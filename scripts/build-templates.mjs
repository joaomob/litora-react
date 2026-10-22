// Builds the page templates of the theme from content/*.json, the module parameters read from the Litora HubL
// templates (scripts/extract-params.cjs). Each React module gets the parameters its fields define (the keys of its
// defaults.json); the rest stays in the content file until that module exists in React. Same structure as the HubL
// templates: a layout, the skip link text, and one full width dnd_section per module.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const THEME = path.join(ROOT, 'src', 'theme', 'litora-react');
const MODULES = path.join(THEME, 'components', 'modules');

const PAGES = [
  { content: 'webinar-pt-br', label: 'Litora webinar (Portuguese)' },
  { content: 'webinar-en-us', label: 'Litora webinar (English)' },
];
// HubL module name -> React module folder
const REACT_MODULES = { 'hero-event': 'HeroEvent' };

const isObject = (v) => v && typeof v === 'object' && !Array.isArray(v);
// keeps only the keys the module fields define, at every object level (arrays pass whole)
function shape(value, defaults) {
  if (!isObject(value) || !isObject(defaults)) return value;
  return Object.fromEntries(Object.keys(defaults).filter((k) => k in value).map((k) => [k, shape(value[k], defaults[k])]));
}

// JSON is valid HubL for strings, numbers, booleans, lists and dicts; a HubL tag inside a value would run, so it stops the build
function hubl(value) {
  const text = JSON.stringify(value);
  if (/\{[{%#]/.test(text)) throw new Error(`HubL delimiter inside a value: ${text.slice(0, 80)}`);
  return text;
}

for (const page of PAGES) {
  const modules = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', `${page.content}.json`), 'utf8'));
  const skipLink = modules.find((m) => m.params.global?.skipLink)?.params.global.skipLink;
  if (!skipLink) throw new Error(`${page.content}: no global.skipLink`);
  const sections = [];
  for (const { module, params } of modules) {
    const folder = REACT_MODULES[module];
    if (!folder) continue;
    const defaults = JSON.parse(fs.readFileSync(path.join(MODULES, folder, 'defaults.json'), 'utf8'));
    const args = [`path="../components/modules/${folder}"`];
    if (params.label) args.push(`label=${hubl(params.label)}`);
    for (const [key, value] of Object.entries(shape(params, defaults))) args.push(`${key}=${hubl(value)}`);
    sections.push(`{% dnd_section full_width=true %}\n{% dnd_module\n  ${args.join(',\n  ')}\n%}\n{% end_dnd_module %}\n{% end_dnd_section %}`);
  }
  const template = `<!--
  templateType: page
  isAvailableForNewContent: true
  label: ${page.label}
-->
{% extends "./layouts/base.hubl.html" %}
{% block skip_link %}${skipLink}{% endblock skip_link %}
{% block body %}
{% dnd_area "main" label="Page sections" %}
${sections.join('\n')}
{% end_dnd_area %}
{% endblock body %}
`;
  fs.writeFileSync(path.join(THEME, 'templates', `${page.content}.hubl.html`), template);
  console.log(`templates/${page.content}.hubl.html ${sections.length} module(s)`);
}
