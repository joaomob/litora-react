/**
 * check-hardcoded: user-facing text written straight in the React code, which check-i18n and check-i18n-usage cannot
 * see (rules/web-development.md: nothing hardcoded in an app or landing, every text through t('key')). Looks for:
 *   1. JSX text between tags, on the same line (>Seu arquétipo<) or alone on a line after a line that opens a tag;
 *   2. strings with a Portuguese accent in UI props (title, placeholder, alt, aria-label);
 *   3. a literal string or template passed straight into a UI call (showToast, toast, alert, confirm...).
 * Heuristic: an accent is a strong sign of hardcoded Portuguese; JSX text of 2+ words is flagged too (it may be
 * hardcoded English). A lone emoji, JS expressions and acronyms are left out. A finding is a question with the place,
 * judged by the app chat (rules/git-and-engineering.md).
 * Settings (app-checks.json), section hardcoded: extensions, skipDirs, skipFiles, calls; and src.
 * Usage: node check-hardcoded.cjs [--root=<app>] [--config=<file>] | --self-test
 * Same findings as olimpo/scripts/check-hardcoded.js on the Olimpo app (02/10/2026); paths print with "/".
 */
const fs = require('fs');
const path = require('path');
const { parseArgs, loadConfig, relative, runSelfTest } = require('./lib.cjs');

if (process.argv.includes('--self-test')) {
  runSelfTest(__filename, [
    { name: 'JSX text, accented placeholder and toast literal are caught', files: { 'src/Card.jsx': "export const Card = () => (\n  <div title=\"Ações\">\n    <p>Seu arquétipo</p>\n    <button onClick={() => showToast('Saved profile')}>{t('card.cta')}</button>\n  </div>\n);\n" }, expect: 1, expectText: '[attr:title]' },
    { name: 'a switch case after a JSX line passes', files: { 'src/Page.tsx': "function view(page: string) {\n  switch (page) {\n    case 'home': return <Home />\n    case 'goals list':\n      return <Goals />\n  }\n}\n" }, expect: 0 },
    { name: 'generic types in .ts and .tsx signatures pass', files: { 'src/lib/table.ts': "export const f = (a: Record<string, X>, b: Record<string, X>) => null\n", 'src/Row.tsx': "export const Row = (a: Record<string, X>, b: Record<string, X>) => <p>{t('row.title')}</p>\n" }, expect: 0 },
    { name: 'text through t() and a key-like toast pass', files: { 'src/Card.jsx': "export const Card = () => (\n  <div title={t('card.actions')}>\n    <p>{t('card.archetype')}</p>\n    <button onClick={() => showToast('card.saved')}>OK</button>\n  </div>\n);\n", 'src/stories/Card.stories.jsx': '<p>Texto de demonstração</p>' }, expect: 0 },
  ]);
}

const { root, configPath } = parseArgs();
const config = loadConfig(configPath);
const H = config.hardcoded;
const SRC = path.join(root, config.src);

const SKIP_DIR = new RegExp('[\\\\/](' + H.skipDirs.join('|') + ')[\\\\/]', 'i');
const SKIP_FILE = new RegExp('\\.(' + H.skipFiles.join('|') + ')\\.(' + H.extensions.join('|') + ')$', 'i');
const SOURCE_FILE = new RegExp('\\.(' + H.extensions.join('|') + ')$');
const CALLS = H.calls.join('|');

const ACCENT = /[áàâãäéèêëíìîïóòôõöúùûüçñ]/i;
// characters that give away CODE (not UI text) inside a piece of text
const CODEY = /[(){}\[\]|&;=<>`$]|=>|\/\/|\?\.|\.\w|&&|\|\|/;

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    // skip folders by their path inside the app, so the app's own location never matters
    if (e.isDirectory()) { if (!SKIP_DIR.test(path.sep + path.relative(root, p) + path.sep)) walk(p, out); }
    else if (SOURCE_FILE.test(e.name) && !SKIP_FILE.test(e.name)) out.push(p);
  }
  return out;
}

// human UI text: has a real word, is not code, is not only a CONSTANT, URL or emoji
function looksHuman(s) {
  const t = s.trim();
  if (!t) return false;
  if (!/[A-Za-zÀ-ÿ]{2,}/.test(t)) return false;
  if (/^[A-Z0-9_]+$/.test(t)) return false;
  if (/^https?:|^\/|^[a-z0-9_]+([A-Z][a-z0-9]+)+$/.test(t)) return false;
  if (CODEY.test(t)) return false;
  return true;
}
function flagWorthy(text) {
  const t = text.trim();
  const words = t.split(/\s+/).filter((w) => /[A-Za-zÀ-ÿ]{2,}/.test(w));
  return ACCENT.test(t) || words.length >= 2;
}
const isKeyish = (s) => /^[a-z0-9_]+(\.[a-z0-9_]+)+$/.test((s || '').trim());

const findings = [];

for (const file of walk(SRC)) {
  const rel = relative(root, file);
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  // a .ts file has no JSX: what sits between > and < there is a generic type (Record<string, X>, b: Record<...>),
  // found by the Apps · Olimpo chat on 04/10/2026; in .tsx, a piece that starts with a comma is the next parameter
  const jsx = !/\.ts$/.test(file);

  lines.forEach((line, i) => {
    const ln = i + 1;
    const trimmed = line.trim();

    // 1a) JSX text between > and < on the same line
    let m;
    const reText = />([^<>{}\n]+)</g;
    while (jsx && (m = reText.exec(line))) {
      if (/^\s*,/.test(m[1])) continue;
      if (looksHuman(m[1]) && flagWorthy(m[1])) findings.push({ rel, ln, kind: 'jsx-text', txt: m[1].trim().slice(0, 70) });
    }

    // 1b) JSX text alone on a line, right after a line that ends a tag (">"); a line that starts with a JS keyword is
    // code, as "case 'goals':" after a JSX line in a switch (false positive found by the Apps · Olimpo chat, 04/10/2026)
    if (jsx && !/[<>{}]/.test(trimmed) && looksHuman(trimmed) && flagWorthy(trimmed)
        && !/^(?:(?:import|export|const|let|var|return|case|default|if|else|break|throw|type|interface|enum)(?![\w$])|\/\/|\/\*|\*)/.test(trimmed)) {
      let prev = '';
      for (let k = i - 1; k >= 0 && k >= i - 3; k--) { if (lines[k].trim()) { prev = lines[k].trim(); break; } }
      if (/>$/.test(prev)) findings.push({ rel, ln, kind: 'jsx-text-ml', txt: trimmed.slice(0, 70) });
    }

    // 2) accented strings in UI props
    const reAttr = /(title|placeholder|alt|aria-label)\s*=\s*(["'])([^"']*[áàâãäéèêëíìîïóòôõöúùûüçñ][^"']*)\2/gi;
    while ((m = reAttr.exec(line))) findings.push({ rel, ln, kind: 'attr:' + m[1], txt: m[3].slice(0, 70) });

    // 3) literal string or template straight into a UI call (it should be t('...')); a t() argument does not start
    // with a quote, and a string shaped like an i18n key ('a.b.c') is skipped
    const reCallQ = new RegExp('(?<![\\w$])(' + CALLS + ')\\s*\\(\\s*([\'"])((?:[^\'"\\\\]|\\\\.)*[A-Za-zÀ-ÿ]{2,}(?:[^\'"\\\\]|\\\\.)*)\\2', 'g');
    while ((m = reCallQ.exec(line))) { if (!isKeyish(m[3])) findings.push({ rel, ln, kind: 'call:' + m[1], txt: m[3].slice(0, 70) }); }
    const reCallT = new RegExp('(?<![\\w$])(' + CALLS + ')\\s*\\(\\s*`([^`]*)`', 'g');
    while ((m = reCallT.exec(line))) {
      // only the literal part counts: ${t('x')} and ${title} are not hardcoded words
      const lit = m[2].replace(/\$\{[^}]*\}/g, '');
      if (/[A-Za-zÀ-ÿ]{2,}/.test(lit) && !isKeyish(lit)) findings.push({ rel, ln, kind: 'call-tpl:' + m[1], txt: m[2].slice(0, 70) });
    }
  });
}

if (!findings.length) {
  console.log('check-hardcoded: OK, nenhum texto hardcoded encontrado.');
  process.exit(0);
}

const byFile = {};
for (const f of findings) (byFile[f.rel] ||= []).push(f);
console.log(`check-hardcoded: ${findings.length} texto(s) hardcoded em ${Object.keys(byFile).length} arquivo(s):\n`);
for (const [rel, list] of Object.entries(byFile).sort()) {
  console.log(rel);
  for (const f of list) console.log(`  :${f.ln}  [${f.kind}]  ${f.txt}`);
  console.log('');
}
process.exit(1);
