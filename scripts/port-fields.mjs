// One-off: writes defaults.json, fields.tsx and types.ts of the React modules from the Litora HubL theme (flowforge,
// projects/eb5-real-estate/hubspot/theme/litora/modules/<name>.module/fields.json), keeping only the fields the markup
// of the module reads. The defaults are the values of an English page (content/*.json), as in HeroEvent; the HubL
// fields.json holds the Portuguese ones. index.tsx and the story are written by hand.
//   node scripts/port-fields.mjs <path of the HubL modules folder>
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MODULES = path.join(ROOT, 'src', 'theme', 'litora-react', 'components', 'modules');
const HUBL = process.argv[2];
if (!HUBL) throw new Error('usage: node scripts/port-fields.mjs <HubL modules folder>');

// true keeps a field whole; an object keeps only the children it names
const HEADER = { header: { logoText: true, languageCurrent: true, languageOther: true, languageOtherLabel: true } };
const LINKS = { self: true, alternate: true, alternateLang: true };
const PORTS = [
  { hubl: 'site-header', folder: 'SiteHeader', page: 'webinar-en-us', pick: { ctaLabel: true, ctaTarget: true, links: LINKS, global: HEADER } },
  { hubl: 'statement-reveal', folder: 'StatementReveal', page: 'webinar-en-us', pick: { labelText: true, text: true, background: true } },
  {
    hubl: 'project-reveal', folder: 'ProjectReveal', page: 'webinar-en-us', noWrap: true,
    pick: { labelText: true, word: true, nameText: true, text: true, caption: true, buttonLabel: true, buttonTarget: true, image: true, imageTall: true, background: true },
  },
  { hubl: 'topic-grid', folder: 'TopicGrid', page: 'webinar-en-us', noWrap: true, pick: { heading: true, intro: true, items: true, background: true } },
  { hubl: 'audience-cards', folder: 'AudienceCards', page: 'webinar-en-us', noWrap: true, pick: { heading: true, items: true, background: true } },
  { hubl: 'speakers', folder: 'Speakers', page: 'webinar-en-us', noWrap: true, pick: { heading: true, note: true, items: true, background: true } },
  { hubl: 'stat-row', folder: 'StatRow', page: 'webinar-en-us', noWrap: true, pick: { heading: true, items: true, source: true, cost: true, background: true } },
  { hubl: 'project-stack', folder: 'ProjectStack', page: 'webinar-en-us', pick: { labelText: true, items: true } },
  {
    hubl: 'faq-accordion', folder: 'FaqAccordion', page: 'webinar-en-us', noWrap: true,
    pick: { heading: true, intro: true, timeline: true, items: true, background: true },
    // a paragraph of an answer is a text or a list
    optional: ['items.answer.text', 'items.answer.list'],
  },
  { hubl: 'cta-band', folder: 'CtaBand', page: 'webinar-en-us', noWrap: true, pick: { heading: true, text: true, buttonLabel: true, buttonTarget: true, image: true, imageTall: true } },
  {
    hubl: 'confirmation-hero', folder: 'ConfirmationHero', page: 'webinar-thank-you-en-us', noWrap: true,
    pick: { heading: true, details: true, timeBlock: true, bodyText: true, showCalendar: true, calendar: true, image: true, imageTall: true, links: LINKS, global: HEADER },
    // the event has a time range with no exact time
    optional: ['timeBlock.rows.datetime'],
  },
  { hubl: 'steps-list', folder: 'StepsList', page: 'webinar-thank-you-en-us', noWrap: true, pick: { heading: true, intro: true, items: true, background: true } },
  { hubl: 'legal-text', folder: 'LegalText', page: 'privacy-en-us', noWrap: true, pick: { heading: true, updated: true, paragraphs: true, background: true } },
  {
    hubl: 'site-footer', folder: 'SiteFooter', page: 'webinar-en-us',
    pick: {
      fictionalNotice: true, background: true, links: { ...LINKS, privacy: true },
      global: { header: { logoText: true }, footer: { about: true, legalNoticeTitle: true, legalNotice: true, privacyLabel: true, languageLinkLabel: true } },
    },
  },
];

// the same field HeroEvent has: the HubL theme wraps "EB-5" of each heading in span.text-style-nowrap
const NO_WRAP = { name: 'noWrapTerm', label: 'Term kept on one line', type: 'text', inline_help_text: 'Wherever this term appears in a heading, it never breaks across two lines.' };

const isRepeated = (f) => Boolean(f.occurrence);
function pickFields(fields, pick) {
  return fields
    .filter((f) => pick[f.name])
    .map((f) => (pick[f.name] === true || !f.children ? f : { ...f, children: pickFields(f.children, pick[f.name]) }));
}
// the value of the page, shaped like the fields: a missing key is an error, an image loses the keys HubL adds (loading)
function pickValue(fields, value, where) {
  return Object.fromEntries(
    fields.map((f) => {
      if (!(f.name in value)) throw new Error(`${where}: no ${f.name}`);
      const v = value[f.name];
      if (f.type === 'image') return [f.name, { src: v.src, alt: v.alt, width: v.width, height: v.height }];
      if (f.type === 'group' && !isRepeated(f)) return [f.name, pickValue(f.children, v, `${where}.${f.name}`)];
      return [f.name, v];
    }),
  );
}

const q = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
// a JSX attribute: a plain string when it has no double quote (JSX strings take no escapes)
const attr = (s) => (String(s).includes('"') ? `{${q(s)}}` : `"${s}"`);
const COMPONENT ={ text: 'TextField', image: 'ImageField', choice: 'ChoiceField', boolean: 'BooleanField' };
function tsx(fields, indent, defaultsPath) {
  const pad = ' '.repeat(indent);
  return fields
    .map((f) => {
      const props = [`label=${attr(f.label)}`, `name=${attr(f.name)}`];
      if (f.inline_help_text) props.push(`inlineHelpText=${attr(f.inline_help_text)}`);
      if (f.occurrence) props.push(`occurrence={{ min: ${f.occurrence.min}, max: ${f.occurrence.max} }}`);
      if (f.type === 'image') props.push('resizable={false}', 'responsive', 'showLoading={false}');
      if (f.type === 'choice') props.push(`display=${attr(f.display)}`, `choices={[${f.choices.map((c) => `[${c.map(q).join(', ')}]`).join(', ')}]}`);
      if (f.type === 'boolean') props.push(`display=${attr(f.display)}`);
      const dflt = defaultsPath && `default={${defaultsPath}.${f.name}}`;
      if (f.type === 'group') {
        const tag = isRepeated(f) ? 'RepeatedFieldGroup' : 'FieldGroup';
        if (isRepeated(f) && dflt) props.push(dflt);
        const inner = tsx(f.children, indent + 2, isRepeated(f) ? null : defaultsPath && `${defaultsPath}.${f.name}`);
        return `${pad}<${tag} ${props.join(' ')}>\n${inner}\n${pad}</${tag}>`;
      }
      if (dflt) props.push(dflt);
      return `${pad}<${COMPONENT[f.type]} ${props.join(' ')} />`;
    })
    .join('\n');
}

// at: the path of the field from the module (items.answer.text), to find it in port.optional
function tsType(f, indent, at, optional) {
  let t;
  if (f.type === 'text') t = 'string';
  else if (f.type === 'boolean') t = 'boolean';
  else if (f.type === 'image') t = 'ImageValue';
  else if (f.type === 'choice') t = f.choices.map(([v]) => q(v)).join(' | ');
  else t = `{\n${f.children.map((c) => tsMember(c, indent + 2, `${at}.`, optional)).join('\n')}\n${' '.repeat(indent)}}`;
  return isRepeated(f) ? (t.includes('|') ? `(${t})[]` : `${t}[]`) : t;
}
const tsMember = (f, indent, prefix, optional) =>
  `${' '.repeat(indent)}${f.name}${optional.includes(prefix + f.name) ? '?' : ''}: ${tsType(f, indent, prefix + f.name, optional)};`;

for (const port of PORTS) {
  const hublFields = JSON.parse(fs.readFileSync(path.join(HUBL, `${port.hubl}.module`, 'fields.json'), 'utf8'));
  let fields = pickFields(hublFields, port.pick);
  const missing = Object.keys(port.pick).filter((k) => !fields.some((f) => f.name === k));
  if (missing.length) throw new Error(`${port.hubl}: no field ${missing.join(', ')}`);
  const page = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', `${port.page}.json`), 'utf8'));
  const params = page.find((m) => m.module === port.hubl)?.params;
  if (!params) throw new Error(`${port.page}: no ${port.hubl}`);
  let defaults = pickValue(fields, params, port.hubl);
  if (port.noWrap) {
    const at = fields.findIndex((f) => f.name === 'heading') + 1;
    fields = [...fields.slice(0, at), NO_WRAP, ...fields.slice(at)];
    defaults = Object.fromEntries([...Object.entries(defaults).slice(0, at), ['noWrapTerm', 'EB-5'], ...Object.entries(defaults).slice(at)]);
  }

  const dir = path.join(MODULES, port.folder);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'defaults.json'), JSON.stringify(defaults, null, 2) + '\n');

  const used = new Set(['ModuleFields']);
  const scan = (list) => list.forEach((f) => (f.type === 'group' ? (used.add(isRepeated(f) ? 'RepeatedFieldGroup' : 'FieldGroup'), scan(f.children)) : used.add(COMPONENT[f.type])));
  scan(fields);
  const order = ['ModuleFields', 'TextField', 'FieldGroup', 'RepeatedFieldGroup', 'ImageField', 'ChoiceField', 'BooleanField'];
  fs.writeFileSync(
    path.join(dir, 'fields.tsx'),
    `import { ${order.filter((c) => used.has(c)).join(', ')} } from '@hubspot/cms-components/fields';
// Every visitor text is a field, ported from the Litora HubL module (${port.hubl}.module/fields.json, by
// scripts/port-fields.mjs). The defaults are the English page (content/${port.page}.json).
import defaults from './defaults.json';

export const fields = (
  <ModuleFields>
${tsx(fields, 4, 'defaults')}
  </ModuleFields>
);
`,
  );

  const needsImage = JSON.stringify(fields).includes('"type":"image"');
  fs.writeFileSync(
    path.join(dir, 'types.ts'),
    `${needsImage ? "import type { ImageValue } from '../../shared/types.js';\n\n" : ''}export type ${port.folder}Props = {
  fieldValues: {
${fields.map((f) => tsMember(f, 4, '', port.optional ?? [])).join('\n')}
  };
};
`,
  );
  console.log(`${port.folder}: ${fields.length} fields`);
}
