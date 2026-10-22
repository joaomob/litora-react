// Builds js/ of the theme from source/js, minified by esbuild, the same way the Litora HubL theme builds its scripts
// (flowforge, projects/eb5-real-estate/hubspot/build-theme.mjs): smaller, and the comments, written for the team, stay
// out of the published theme. Measured on the draft test page (22/10/2026): the unminified motion.js was 22,447 bytes.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import esbuild from 'esbuild';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = path.join(ROOT, 'source', 'js');
const OUT = path.join(ROOT, 'src', 'theme', 'litora-react', 'js');

fs.mkdirSync(OUT, { recursive: true });
for (const file of fs.readdirSync(SOURCE).filter((f) => f.endsWith('.js'))) {
  const { code } = esbuild.transformSync(fs.readFileSync(path.join(SOURCE, file), 'utf8'), {
    minify: true,
    target: 'es2018',
  });
  fs.writeFileSync(path.join(OUT, file), code);
  console.log(`js/${file} ${Buffer.byteLength(code)} bytes`);
}
