// Builds the page templates of the theme from content/*.json, the module parameters read from the Litora HubL
// templates (scripts/extract-params.cjs). Each React module gets the parameters its fields define (the keys of its
// defaults.json). Same structure as the HubL templates: a layout, the skip link text, the header and the footer in
// their blocks, and one full width dnd_section per module of the body.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const THEME = path.join(ROOT, 'src', 'theme', 'litora-react');
const MODULES = path.join(THEME, 'components', 'modules');

const PAGES = [
  { content: 'webinar-pt-br', label: 'Litora webinar (Portuguese)' },
  { content: 'webinar-en-us', label: 'Litora webinar (English)' },
  { content: 'webinar-thank-you-pt-br', label: 'Litora webinar thank you (Portuguese)' },
  { content: 'webinar-thank-you-en-us', label: 'Litora webinar thank you (English)' },
  { content: 'event-pt-br', label: 'Litora event (Portuguese)' },
  { content: 'event-en-us', label: 'Litora event (English)' },
  { content: 'event-thank-you-pt-br', label: 'Litora event thank you (Portuguese)' },
  { content: 'event-thank-you-en-us', label: 'Litora event thank you (English)' },
  { content: 'privacy-pt-br', label: 'Litora privacy policy (Portuguese)' },
  { content: 'privacy-en-us', label: 'Litora privacy policy (English)' },
];
// HubL module name -> React module folder
const REACT_MODULES = {
  'site-header': 'SiteHeader',
  'hero-event': 'HeroEvent',
  'confirmation-hero': 'ConfirmationHero',
  'statement-reveal': 'StatementReveal',
  'project-reveal': 'ProjectReveal',
  'topic-grid': 'TopicGrid',
  'audience-cards': 'AudienceCards',
  speakers: 'Speakers',
  'stat-row': 'StatRow',
  'project-stack': 'ProjectStack',
  'faq-accordion': 'FaqAccordion',
  'cta-band': 'CtaBand',
  'steps-list': 'StepsList',
  'legal-text': 'LegalText',
  'site-footer': 'SiteFooter',
};
// the header and the footer sit outside the drag and drop area, in the blocks of the layout, as in the HubL templates
const FIXED = { 'site-header': 'header', 'site-footer': 'footer' };

// The React pages live next to the HubL pages on the same domain, under /react/ and /en/react/, so every link between
// the 10 pages (logo, language switch, privacy, form redirect) points to the React page of the same path
const readContent = (page) => JSON.parse(fs.readFileSync(path.join(ROOT, 'content', `${page.content}.json`), 'utf8'));
const PAGE_PATHS = new Set(
  PAGES.flatMap((page) =>
    readContent(page)
      .map((m) => m.params.links?.self)
      .filter(Boolean),
  ),
);
if (PAGE_PATHS.size !== PAGES.length) throw new Error(`expected ${PAGES.length} page paths, found ${PAGE_PATHS.size}`);
const reactPath = (p) => p.replace(/^\/(en\/)?/, (_, en) => (en ? '/en/react/' : '/react/'));
function toReactPaths(value) {
  if (typeof value === 'string') return PAGE_PATHS.has(value) ? reactPath(value) : value;
  if (Array.isArray(value)) return value.map(toReactPaths);
  if (value && typeof value === 'object')
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, toReactPaths(v)]));
  return value;
}

// structured data (schema.org Event) of the webinar and event pages, copied from the Litora HubL generator
// (flowforge, projects/eb5-real-estate/hubspot/event-schema.json); its page addresses move to the React paths
const ORIGIN = 'https://litora.joaomob.com';
const EVENT_SCHEMAS = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'event-schema.json'), 'utf8'));
function toReactUrls(value) {
  if (typeof value === 'string' && value.startsWith(`${ORIGIN}/`))
    return ORIGIN + toReactPaths(value.slice(ORIGIN.length));
  if (Array.isArray(value)) return value.map(toReactUrls);
  if (value && typeof value === 'object')
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, toReactUrls(v)]));
  return value;
}
const ldJson = (schema) =>
  `<script type="application/ld+json">${JSON.stringify(toReactUrls(schema)).replace(/</g, '\\u003c')}</script>`;

const isObject = (v) => v && typeof v === 'object' && !Array.isArray(v);
// keeps only the keys the module fields define, at every object level (arrays pass whole)
function shape(value, defaults) {
  if (!isObject(value) || !isObject(defaults)) return value;
  return Object.fromEntries(
    Object.keys(defaults)
      .filter((k) => k in value)
      .map((k) => [k, shape(value[k], defaults[k])]),
  );
}

// JSON is valid HubL for strings, numbers, booleans, lists and dicts; a HubL tag inside a value would run, so it stops the build
function hubl(value) {
  const text = JSON.stringify(value);
  if (/\{[{%#]/.test(text)) throw new Error(`HubL delimiter inside a value: ${text.slice(0, 80)}`);
  return text;
}

for (const page of PAGES) {
  const modules = toReactPaths(readContent(page));
  const skipLink = modules.find((m) => m.params.global?.skipLink)?.params.global.skipLink;
  if (!skipLink) throw new Error(`${page.content}: no global.skipLink`);
  const sections = [];
  const blocks = { header: '', footer: '' };
  for (const { module, params } of modules) {
    const folder = REACT_MODULES[module];
    if (!folder) throw new Error(`${page.content}: no React module for ${module}`);
    const defaults = JSON.parse(fs.readFileSync(path.join(MODULES, folder, 'defaults.json'), 'utf8'));
    const args = [`path="../components/modules/${folder}"`];
    if (params.label) args.push(`label=${hubl(params.label)}`);
    // The HubL modules keep the section colour at the top level; the React fields keep it in the Style tab group
    const moved =
      defaults.style && 'background' in params ? { ...params, style: { background: params.background } } : params;
    for (const [key, value] of Object.entries(shape(moved, defaults))) args.push(`${key}=${hubl(value)}`);
    const block = FIXED[module];
    if (block) {
      blocks[block] = `{% module "site_${block}" ${args.join(',\n  ')}\n%}`;
      continue;
    }
    sections.push(
      `{% dnd_section full_width=true %}\n{% dnd_module\n  ${args.join(',\n  ')}\n%}\n{% end_dnd_module %}\n{% end_dnd_section %}`,
    );
  }
  const template = `<!--
  templateType: page
  isAvailableForNewContent: true
  label: ${page.label}
-->
{% extends "./layouts/base.hubl.html" %}
${EVENT_SCHEMAS[page.content] ? `{% block head %}\n${ldJson(EVENT_SCHEMAS[page.content])}\n{% endblock head %}\n` : ''}{% block skip_link %}${skipLink}{% endblock skip_link %}
{% block header %}
${blocks.header}
{% endblock header %}
{% block body %}
{% dnd_area "main" label="Page sections" %}
${sections.join('\n')}
{% end_dnd_area %}
{% endblock body %}
{% block footer %}
${blocks.footer}
{% endblock footer %}
`;
  fs.writeFileSync(path.join(THEME, 'templates', `${page.content}.hubl.html`), template);
  console.log(`templates/${page.content}.hubl.html ${sections.length} section(s)`);
}
