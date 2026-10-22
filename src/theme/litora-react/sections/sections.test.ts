import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// The ready made sections the marketing team drops on a new page: each points to a module and a preview that exist, and
// every module of the page body has one (the header and the footer sit in the layout blocks, not in the sections).
const SECTIONS = path.dirname(fileURLToPath(import.meta.url));
const THEME = path.resolve(SECTIONS, '..');
const OUTSIDE_BODY = ['SiteHeader', 'SiteFooter'];
const files = fs.readdirSync(SECTIONS).filter((f) => f.endsWith('.hubl.html'));

describe('sections', () => {
  it.each(files)('%s points to a module and a preview that exist', (file) => {
    const text = fs.readFileSync(path.join(SECTIONS, file), 'utf8');
    expect(text).toMatch(/^\s*templateType: section$/m);
    expect(text).toMatch(/^\s*label: \S/m);
    const preview = text.match(/^\s*screenshotPath: (.+)$/m)?.[1];
    const module = text.match(/dnd_module path="([^"]+)"/)?.[1];
    expect(preview && fs.existsSync(path.resolve(SECTIONS, preview))).toBe(true);
    expect(module && fs.existsSync(path.resolve(SECTIONS, module, 'index.tsx'))).toBe(true);
  });

  it('covers every module of the page body', () => {
    const covered = files.map((f) => fs.readFileSync(path.join(SECTIONS, f), 'utf8').match(/modules\/(\w+)"/)?.[1]);
    const body = fs
      .readdirSync(path.join(THEME, 'components', 'modules'), { withFileTypes: true })
      .filter((d) => d.isDirectory() && !d.name.startsWith('_') && !OUTSIDE_BODY.includes(d.name))
      .map((d) => d.name);
    expect(covered.sort()).toEqual(body.sort());
  });
});
