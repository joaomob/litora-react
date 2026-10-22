/**
 * check-tokens: design token lint. Fails the build when the code writes a literal value that repeats a token exactly
 * (the classic case: UI written by AI that types the brand colour again instead of var(--accent)).
 * Source of the tokens: the :root block of the token CSS file(s), plus the colour overrides of the dark theme block.
 *   Error (fails the build, above the baseline): hex colour == token, box-shadow == --sh*, cubic-bezier == --ease,
 *   font-family == --serif/--sans.
 *   Warning (counted only): font-size in px, and padding/margin/gap/inset in px outside the spacing scale; they turn
 *   into errors with tokens.advisoryHard = true.
 * The baseline freezes the duplications that already exist (signature: file + type + value, so a moved line does not
 * count as new); the build fails only when a signature is new or its count grows.
 * Settings (app-checks.json), section tokens: css, darkSelector, baseline, extensions, ignore (path prefixes),
 * primitives (hex with no token, allowed), exceptions ({ "file:line": "reason" }), spacingScale, advisoryHard; and src.
 * Usage: node check-tokens.cjs [--root=<app>] [--config=<file>] [--report | --update-baseline] | --self-test
 *   --report lists every duplication and exits 0; --update-baseline writes the baseline (only when the team accepts it).
 * Same output as olimpo/scripts/check-tokens.js on the Olimpo app (02/10/2026); reads the Olimpo baseline as it is.
 */
const fs = require('fs');
const path = require('path');
const { parseArgs, loadConfig, relative, extRegex, asList, selfCommand, runSelfTest } = require('./lib.cjs');

if (process.argv.includes('--self-test')) {
  const css = ':root {\n  --accent: #e2560f;\n  --ease: cubic-bezier(.2,.8,.2,1);\n}\n[data-theme="dark"] {\n  --bg: #111111;\n}\n';
  const baseline = { signatures: {} };
  runSelfTest(__filename, [
    { name: 'hex that repeats a token is caught', files: { 'src/index.css': css, 'scripts/.token-baseline.json': baseline, 'src/Button.jsx': "const s = { color: '#E2560F' };" }, expect: 1, expectText: 'var(--accent)' },
    { name: 'var(--token), a fallback inside var() and #fff pass', files: { 'src/index.css': css, 'scripts/.token-baseline.json': baseline, 'src/Button.jsx': "const s = { color: 'var(--accent, #e2560f)', background: '#fff' };" }, expect: 0 },
    { name: 'test folders and a long comment pass', files: { 'src/index.css': css, 'scripts/.token-baseline.json': baseline, 'src/features/__tests__/old.jsx': "const s = { color: '#E2560F' };", 'src/Note.jsx': "/*\n the old accent was #E2560F\n*/\nconst a = 1;" }, expect: 0 },
    { name: 'missing baseline fails', files: { 'src/index.css': css, 'src/Button.jsx': 'const a = 1;' }, expect: 1, expectText: 'baseline' },
  ]);
}

const { root, configPath, flags } = parseArgs();
const config = loadConfig(configPath);
const T = config.tokens;
const REPORT_ONLY = flags.has('--report');

const PRIMITIVES = new Set(T.primitives.map((h) => normHex(h)));
const CSS_FILES = asList(T.css);
const IGNORE = [...T.ignore, ...CSS_FILES]; // the token files hold the definitions
const SPACING_SCALE = new Set(T.spacingScale);

function normHex(h) {
  h = h.toLowerCase();
  if (/^#[0-9a-f]{3}$/.test(h)) h = '#' + h.slice(1).split('').map((c) => c + c).join('');
  return h;
}
const normWs = (s) => s.replace(/\s+/g, ' ').trim().toLowerCase();

// 1) Tokens from the :root block (and the dark colour overrides) of each token file.
const tokens = new Map();
for (const file of CSS_FILES) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) {
    console.error(`[check-tokens] ${file} not found (tokens.css in app-checks.json).`);
    process.exit(1);
  }
  const cssSource = fs.readFileSync(full, 'utf8');
  const start = cssSource.indexOf(':root');
  if (start >= 0) {
    const block = cssSource.slice(start, cssSource.indexOf('}', start)).replace(/\/\*[\s\S]*?\*\//g, '');
    for (const seg of block.split(';')) {
      const m = seg.match(/--([\w-]+)\s*:\s*([\s\S]+)/);
      if (m) tokens.set(m[1].trim(), m[2].trim());
    }
  }
  const darkStart = cssSource.indexOf(T.darkSelector);
  const darkBlock = cssSource.slice(darkStart).replace(/\/\*[\s\S]*?\*\//g, '');
  for (const seg of darkBlock.split(';')) {
    const m = seg.match(/--([\w-]+)\s*:\s*([\s\S]+)/);
    if (m && /^#[0-9a-f]{3,8}$/i.test(m[2].trim())) tokens.set('dark:' + m[1].trim(), m[2].trim());
  }
}

const colorTokens = new Map();  // normalized hex -> token name
const shadowTokens = new Map(); // normalized value -> token name
let easeToken = null;
const fontFamilies = new Map(); // normalized value -> token name
for (const [name, val] of tokens) {
  if (/^#[0-9a-f]{3,8}$/i.test(val)) { const h = normHex(val); if (!PRIMITIVES.has(h)) colorTokens.set(h, name); }
  else if (/^(--)?(sh)/.test(name) && /\dpx/.test(val)) shadowTokens.set(normWs(val), name);
  else if (name === 'ease') easeToken = normWs(val);
  else if (name === 'serif' || name === 'sans') fontFamilies.set(normWs(val), name);
}

// 2) Files under src with the token extensions.
const FILE_RE = extRegex(T.extensions);
function list(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    // test folders keep copies of the old code on purpose (Apps · Olimpo, 04/10/2026), as check-lang and check-hardcoded skip
    if (e.isDirectory()) { if (e.name !== 'node_modules' && !T.skipDirs.includes(e.name)) list(p, acc); }
    else if (FILE_RE.test(e.name)) acc.push(p);
  }
  return acc;
}
const files = list(path.join(root, config.src));

// 3) Rules. Type labels are the ones the Olimpo baseline signatures use ("cor" = colour, "sombra" = shadow).
const errors = [];
const warnings = { fontSize: [], spacing: [] };

for (const file of files) {
  const r = relative(root, file);
  const ignored = IGNORE.some((prefix) => r.startsWith(prefix));
  // a comment over several lines is blanked first, keeping the line breaks so the line numbers stay (a hex named in a
  // long comment was counted, Apps · Olimpo, 04/10/2026)
  const lines = fs.readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' ')).split('\n');

  lines.forEach((rawLine, i) => {
    const key = `${r}:${i + 1}`;
    if (T.exceptions[key]) return;

    // Drop comments, and what is inside var(--x, fallback), so a legitimate fallback is not counted.
    const line = rawLine.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/, '');
    const withoutVar = line.replace(/var\([^)]*\)/g, '');
    // A custom property definition is a definition, not a literal in use.
    const isDefinition = /^\s*--[\w-]+\s*:/.test(line);

    if (!ignored && !isDefinition) {
      // 3a) colour: hex literal == token
      for (const m of withoutVar.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
        const h = normHex(m[0]);
        if (colorTokens.has(h)) errors.push({ type: 'cor', key, detail: `${m[0]} == var(--${colorTokens.get(h).replace('dark:', '')})` });
      }
      // 3b) box-shadow / boxShadow literal == --sh*
      const bs = line.match(/box-?[Ss]hadow\s*:\s*['"]?([^'";}]+)/);
      if (bs) { const v = normWs(bs[1]); if (shadowTokens.has(v)) errors.push({ type: 'sombra', key, detail: `== var(--${shadowTokens.get(v)})` }); }
      // 3c) cubic-bezier == --ease
      const cb = withoutVar.match(/cubic-bezier\([^)]*\)/);
      if (cb && easeToken && normWs(cb[0]) === easeToken) errors.push({ type: 'easing', key, detail: '== var(--ease)' });
      // 3d) font-family literal == --serif/--sans
      const ff = line.match(/font-?[Ff]amily\s*:\s*['"]?([^'";}]+)/);
      if (ff) { const v = normWs(ff[1]); if (fontFamilies.has(v)) errors.push({ type: 'fontFamily', key, detail: `== var(--${fontFamilies.get(v)})` }); }

      // 3e) warning: font-size in px (CSS and JSX)
      if (/font-size\s*:\s*\d+px/.test(line) || /fontSize:\s*['"]?\d+(px)?['"]?/.test(line)) warnings.fontSize.push(key);
      // 3f) warning: spacing in px (padding/margin/gap/inset) outside the scale
      const sp = line.match(/(padding|margin|gap|inset|top|right|bottom|left)[^:]*:\s*['"]?([^'";}]*\d+px[^'";}]*)/);
      if (sp && (sp[2].match(/\d+px/g) || []).some((v) => !SPACING_SCALE.has(v))) warnings.spacing.push(key);
    }
  });
}

// 4) Baseline: the build fails only on a NEW duplication. Stable signature: file + type (+ value for colours).
function signature(e) {
  const file = e.key.split(':').slice(0, -1).join(':');
  if (e.type === 'cor') return `${file}::cor:${normHex(e.detail.split(' ')[0])}`;
  return `${file}::${e.type}`;
}
const current = {};
for (const e of errors) { const s = signature(e); current[s] = (current[s] || 0) + 1; }

const baselinePath = path.resolve(root, T.baseline);
const byType = errors.reduce((a, e) => ((a[e.type] = (a[e.type] || 0) + 1), a), {});
console.log(`[check-tokens] tokens: ${tokens.size} | arquivos: ${files.length}`);
console.log(`[check-tokens] ERROS de duplicação de token: ${errors.length} ${JSON.stringify(byType)}`);
console.log(`[check-tokens] AVISO (não quebra o build): font-size px = ${warnings.fontSize.length}, espaçamento fora da escala = ${warnings.spacing.length}`);

if (flags.has('--update-baseline')) {
  fs.mkdirSync(path.dirname(baselinePath), { recursive: true });
  fs.writeFileSync(baselinePath, JSON.stringify({
    _doc: 'Token duplications that already existed. check-tokens fails the build on a NEW one (above this baseline). ' +
      'Write again only when the team accepts a change on purpose: ' + selfCommand(__filename, '--update-baseline'),
    generatedOn: new Date().toISOString().slice(0, 10),
    total: errors.length,
    byType,
    signatures: current,
  }, null, 2) + '\n');
  console.log(`[check-tokens] baseline gravado (${errors.length} pré-existentes) em ${T.baseline}`);
  process.exit(0);
}

if (REPORT_ONLY) {
  for (const e of errors) console.log(`  ${e.type.padEnd(10)} ${e.key}  ${e.detail}`);
  process.exit(0);
}

if (!fs.existsSync(baselinePath)) {
  console.error(`[check-tokens] baseline ausente. Rode: ${selfCommand(__filename, '--update-baseline')}`);
  process.exit(1);
}
const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
// "assinaturas" is the key of the baselines written by the Olimpo original
const base = baseline.signatures || baseline.assinaturas || {};

const fresh = [];
for (const [s, n] of Object.entries(current)) {
  const excess = n - (base[s] || 0);
  if (excess > 0) fresh.push(...errors.filter((e) => signature(e) === s).slice(-excess));
}

if (T.advisoryHard && (warnings.fontSize.length || warnings.spacing.length)) {
  fresh.push({ type: 'advisory', key: '(font-size/espaçamento)', detail: 'advisoryHard ligado' });
}

if (fresh.length) {
  console.error(`[check-tokens] ${fresh.length} valor(es) hardcoded NOVOS que duplicam um token (acima do baseline). Use var(--token):`);
  for (const e of fresh) console.error(`  ✗ ${e.type.padEnd(10)} ${e.key}  ${e.detail}`);
  console.error('Troque o literal pela var(--token). Se for intencional, adicione a tokens.exceptions do app-checks.json com motivo, ou aceite conscientemente com --update-baseline.');
  process.exit(1);
}
console.log(`[check-tokens] ok, nenhuma duplicação de token nova (baseline: ${baseline.total ?? Object.keys(base).length}).`);
