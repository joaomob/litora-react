// Builds css/global.css of the theme from source/css (tokens and system), the same way the Litora HubL theme builds
// css/main.css (flowforge, projects/eb5-real-estate/hubspot/build-theme.mjs):
//   - comments out, because "{#" inside a CSS comment breaks HubL;
//   - each font by get_asset_url, or inline when the file is 4 KB or less (the subset of the giant word);
//   - the brand colours and the two text fonts read from the theme settings (fields.json).
// The layout puts the file inside a <style> in the head ({% include %}), because a linked stylesheet was the one
// render-blocking request left on the phone in the HubL theme (PageSpeed, 04/10/2026). Section styles live in each
// React module, not here.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = path.join(ROOT, 'source');
const THEME = path.join(ROOT, 'src', 'theme', 'litora-react');

const read = (...p) => fs.readFileSync(path.join(SOURCE, ...p), 'utf8');
const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\n{3,}/g, '\n\n');
const minCss = (css) => css.replace(/\s+/g, ' ').replace(/\s*([{};,>])\s*/g, '$1').replace(/:\s+/g, ':').replace(/;}/g, '}').trim();

const fields = JSON.parse(fs.readFileSync(path.join(THEME, 'fields.json'), 'utf8'));
const brandColors = fields.find((f) => f.name === 'brand_colors').children.map((c) => ({ name: c.name, token: c.name.replace(/_/g, '-') }));
const FONTS = [
  { name: 'heading_font', token: '--font-family--display', family: 'Jost', fallback: 'Jost Fallback' },
  { name: 'body_font', token: '--font-family--primary', family: 'Nunito Sans', fallback: 'Nunito Sans Fallback' },
];

const linkedFonts = new Set();
let css = stripComments(read('css', 'tokens.css')).replace(/url\("\.\.\/assets\/fonts\/([\w.-]+\.woff2)"\)/g, (whole, file) => {
  const bytes = fs.readFileSync(path.join(SOURCE, 'fonts', file));
  if (bytes.length <= 4096) return `url("data:font/woff2;base64,${bytes.toString('base64')}")`;
  linkedFonts.add(file);
  return `url("{{ get_asset_url('../fonts/${file}') }}")`;
});
for (const c of brandColors) {
  const re = new RegExp(`--base-color-brand--${c.token}: #[0-9a-f]{6};`);
  if (!re.test(css)) throw new Error(`tokens.css: no --base-color-brand--${c.token}`);
  css = css.replace(re, `--base-color-brand--${c.token}: {{ theme.brand_colors.${c.name}.color }};`);
}
for (const f of FONTS) {
  const from = `${f.token}: "${f.family}", "${f.fallback}", sans-serif;`;
  if (!css.includes(from)) throw new Error(`tokens.css: no ${from}`);
  css = css.replace(from, `${f.token}: "{{ theme.fonts.${f.name}.font }}", "${f.fallback}", sans-serif;`);
}
css += '\n' + stripComments(read('css', 'system.css'));

fs.writeFileSync(path.join(THEME, 'css', 'global.css'), minCss(css) + '\n');

// fonts: every file the CSS loads by URL, with the licences
fs.mkdirSync(path.join(THEME, 'fonts'), { recursive: true });
for (const f of fs.readdirSync(path.join(SOURCE, 'fonts'))) {
  if (linkedFonts.has(f) || f.startsWith('LICENSE')) fs.copyFileSync(path.join(SOURCE, 'fonts', f), path.join(THEME, 'fonts', f));
}
console.log(`css/global.css ${fs.statSync(path.join(THEME, 'css', 'global.css')).size} bytes`);
