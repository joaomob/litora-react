/**
 * check-lang: ratchet guard for "code in English" (rules/code-language.md). Portuguese identifiers and comments that
 * already exist are debt; this guard does not rewrite them, it freezes the amount per file in a baseline and fails
 * the build when a file gains Portuguese or a new file brings Portuguese. The debt can only shrink.
 * Only identifiers and comments count: strings and template literals are blanked first, since text inside a string is
 * content (UI copy, prompts, i18n) in any language.
 * Settings (app-checks.json), section lang: scan (folders), baseline, skipDirs, extensions, identifiers (replaces the
 * list), extraIdentifiers (adds to it), commentWords.
 * Usage: node check-lang.cjs [--root=<app>] [--config=<file>] [--update] | --self-test
 *   --update writes the baseline, only after a migration lowered the debt on purpose, or once when the app adopts
 *   the guard. Without a baseline the guard fails (the Olimpo original wrote one silently, so deleting the baseline
 *   would let any Portuguese in).
 * Same output as olimpo/scripts/check-lang.js on the Olimpo app (02/10/2026); reads the Olimpo baseline as it is.
 */
const fs = require('fs');
const path = require('path');
const { parseArgs, loadConfig, relative, extRegex, selfCommand, runSelfTest } = require('./lib.cjs');

if (process.argv.includes('--self-test')) {
  const baseline = { 'src/old.js': { comments: 1, idents: 1 } };
  const old = '// não mexer\nconst tarefa = 1;\n';
  runSelfTest(__filename, [
    { name: 'new Portuguese identifier and comment are caught', files: { 'scripts/lang-baseline.json': baseline, 'src/old.js': old, 'src/new.js': '// salva o perfil\nfunction salvar(perfil) {}\n' }, expect: 1, expectText: 'src/new.js' },
    { name: 'debt as in the baseline and Portuguese inside strings pass', files: { 'scripts/lang-baseline.json': baseline, 'src/old.js': old, 'src/new.js': "// saves the profile\nconst label = 'Salvar perfil';\n" }, expect: 0 },
    { name: 'import.meta in code and in a comment passes', files: { 'scripts/lang-baseline.json': baseline, 'src/old.js': old, 'src/env.ts': "// reads import.meta.env\nexport const key = import.meta.env.VITE_KEY;\n" }, expect: 0 },
    { name: 'missing baseline fails', files: { 'src/old.js': old }, expect: 1, expectText: '--update' },
  ]);
}

const { root, configPath, flags } = parseArgs();
const L = loadConfig(configPath).lang;
const BASELINE = path.resolve(root, L.baseline);
const SKIP_DIR = new RegExp('[\\\\/](' + L.skipDirs.join('|') + ')[\\\\/]', 'i');
const SOURCE_FILE = extRegex(L.extensions);

const IDENTIFIERS = [...L.identifiers, ...L.extraIdentifiers];
const IDENT_RE = new RegExp('(?<![\\w$])(' + IDENTIFIERS.join('|') + ')(?![\\w$])', 'g');
// A Portuguese comment: a comment line with an accented letter or a distinctive Portuguese word.
const PT_COMMENT_RE = new RegExp('(\\/\\/|\\/\\*|^\\s*\\*).*(?:[áàâãéêíóôõúç]|\\b(' + L.commentWords.join('|') + ')\\b)', 'i');

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    // skip folders by their path inside the app, so the app's own location never matters
    if (e.isDirectory()) { if (!SKIP_DIR.test(path.sep + path.relative(root, p) + path.sep)) walk(p, out); }
    else if (SOURCE_FILE.test(e.name)) out.push(p);
  }
  return out;
}

// Blank out comments and string/template literals, so identifier counting sees only code.
function stripCommentsAndStrings(src) {
  return src
    .replace(/\/\/[^\n]*/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/`(?:\\.|[^`\\])*`/gs, '``')
    .replace(/'(?:\\.|[^'\\])*'/g, "''")
    .replace(/"(?:\\.|[^"\\])*"/g, '""');
}

function measure(file) {
  // import.meta is JavaScript syntax (import.meta.env of Vite), not the Portuguese word "meta", in code and in comments
  // (Apps · Olimpo, 04/10/2026: every file that read a Vite variable added one to the debt)
  const src = fs.readFileSync(file, 'utf8').replace(/\bimport\.meta\b/g, 'import');
  let comments = 0, idents = 0;
  for (const line of src.split('\n')) if (PT_COMMENT_RE.test(line)) comments++;
  for (const line of stripCommentsAndStrings(src).split('\n')) {
    const m = line.match(IDENT_RE);
    if (m) idents += m.length;
  }
  return { comments, idents };
}

const files = L.scan.flatMap((d) => walk(path.join(root, d))).map((f) => relative(root, f));
const current = {};
for (const rel of files) {
  const m = measure(path.join(root, rel));
  if (m.comments || m.idents) current[rel] = m;
}

if (flags.has('--update')) {
  fs.mkdirSync(path.dirname(BASELINE), { recursive: true });
  fs.writeFileSync(BASELINE, JSON.stringify(current, null, 2) + '\n');
  const totC = Object.values(current).reduce((s, x) => s + x.comments, 0);
  const totI = Object.values(current).reduce((s, x) => s + x.idents, 0);
  console.log(`check-lang: baseline gravado: ${Object.keys(current).length} arquivos, ${totC} comentários PT, ${totI} identificadores PT.`);
  process.exit(0);
}

if (!fs.existsSync(BASELINE)) {
  console.log(`check-lang: baseline ${L.baseline} ausente. Na adoção, grave o primeiro com: ${selfCommand(__filename, '--update')}`);
  process.exit(1);
}

const base = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));
const violations = [];
for (const [rel, m] of Object.entries(current)) {
  const b = base[rel] || { comments: 0, idents: 0 };
  if (m.comments > b.comments) violations.push(`${rel}: comentários PT ${b.comments} → ${m.comments} (+${m.comments - b.comments})`);
  if (m.idents > b.idents) violations.push(`${rel}: identificadores PT ${b.idents} → ${m.idents} (+${m.idents - b.idents})`);
}

if (!violations.length) {
  console.log('check-lang: OK, nenhum código em português novo (dívida não cresceu).');
  process.exit(0);
}
console.log('check-lang: código em PORTUGUÊS novo detectado (rules/code-language.md). A dívida só pode diminuir:\n');
violations.forEach((v) => console.log('  ' + v));
console.log(`\nSe você MIGROU e a dívida caiu de propósito, rode: ${selfCommand(__filename, '--update')}`);
process.exit(1);
