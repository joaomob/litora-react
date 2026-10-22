import { moduleStory } from '@hubspot/cms-dev-server/storybook';
import type { ReactElement } from 'react';
import content from '../../storybook/module-content.json';
import { fieldsJson, type FieldJson } from './fieldsJson.js';

// The states every module story shows, built from the copy of the 10 pages (storybook/module-content.json, written by
// scripts/build-templates.mjs) and from the module fields, so a new field or a new limit reaches the stories by itself:
//   - English and Portuguese: the values of the first page that has the module, in each language;
//   - Long text: every sentence of the English copy said twice, to see how headings and cards grow;
//   - Fewest items and Most items: every repeater at the minimum and at the maximum the editor allows;
//   - Dark: the inverse section colour of the Style tab.
// moduleStory types fieldValues as a loose record, so the typed component goes in as its parameter type (through
// unknown, since TypeScript sees no overlap between the record and the module's own field types).
type StoryComponent = Parameters<typeof moduleStory>[0];
type Value = Record<string, unknown>;
type Occurrence = NonNullable<FieldJson['occurrence']>;
export type ModuleName = keyof typeof content;

const isObject = (v: unknown): v is Value => typeof v === 'object' && v !== null && !Array.isArray(v);
const isGroup = (f: FieldJson) => f.type === 'group' && !f.occurrence && Boolean(f.children);

// moduleStory reads each argument as a field path ("timeBlock.place") and steps into every group, repeated ones too,
// where it loses the list. So groups pass by path and every other value (a repeater, an image, a link) passes whole.
export function toArgs(fields: FieldJson[], value: Value, prefix = ''): Value {
  return Object.fromEntries(
    fields.flatMap((f) => {
      const v = value[f.name];
      if (v === undefined) return [];
      if (isGroup(f) && isObject(v)) return Object.entries(toArgs(f.children!, v, `${prefix}${f.name}.`));
      return [[prefix + f.name, v]];
    }),
  );
}

// Applies a change to every field of a value, through groups and repeaters
function mapFields(fields: FieldJson[], value: Value, change: (f: FieldJson, v: unknown) => unknown): Value {
  const step = (f: FieldJson, v: unknown): unknown =>
    f.children && isObject(v) ? mapFields(f.children, v, change) : v;
  return Object.fromEntries(
    Object.entries(value).map(([name, v]) => {
      const f = fields.find((field) => field.name === name);
      if (!f) return [name, v];
      const changed = change(f, v);
      return [name, Array.isArray(changed) ? changed.map((item) => step(f, item)) : step(f, changed)];
    }),
  );
}

// A sentence is text with a space in it; paths, addresses, ids and choices stay as they are
const isSentence = (v: unknown): v is string => typeof v === 'string' && v.includes(' ') && !/^(\/|https?:)/.test(v);
const TEXT_TYPES = ['text', 'textarea', 'richtext'];

export const longText = (fields: FieldJson[], value: Value) =>
  mapFields(fields, value, (f, v) => {
    if (!TEXT_TYPES.includes(f.type)) return v;
    const twice = (s: unknown) => (isSentence(s) ? (f.type === 'richtext' ? `${s}${s}` : `${s} ${s}`) : s);
    return Array.isArray(v) ? v.map(twice) : twice(v);
  });

// Every repeater with the count the limit gives (null keeps the list), its items repeated in order
export const itemCount = (fields: FieldJson[], value: Value, count: (o: Occurrence) => number | null | undefined) =>
  mapFields(fields, value, (f, v) => {
    const n = f.occurrence && count(f.occurrence);
    if (n == null || !Array.isArray(v) || !v.length) return v;
    return Array.from({ length: n }, (_, i) => v[i % v.length]);
  });

const hasRepeater = (fields: FieldJson[]): boolean =>
  fields.some((f) => Boolean(f.occurrence) || hasRepeater(f.children ?? []));
const hasDark = (fields: FieldJson[]) =>
  fields
    .find((f) => f.name === 'style')
    ?.children?.find((f) => f.name === 'background')
    ?.choices?.some(([v]) => v === 'inverse') ?? false;

export function moduleContent(name: ModuleName, language: 'en-us' | 'pt-br'): Value {
  return content[name][language] as Value;
}

export function moduleStates(name: ModuleName, Component: unknown, fields: ReactElement) {
  const json = fieldsJson(fields);
  const english = moduleContent(name, 'en-us');
  const story = (value: Value) => moduleStory(Component as StoryComponent, fields, toArgs(json, value));
  return {
    english: story(english),
    portuguese: story(moduleContent(name, 'pt-br')),
    longText: story(longText(json, english)),
    fewestItems: hasRepeater(json) ? story(itemCount(json, english, (o) => o.min ?? 0)) : undefined,
    mostItems: hasRepeater(json) ? story(itemCount(json, english, (o) => o.max)) : undefined,
    dark: hasDark(json) ? story({ ...english, style: { background: 'inverse' } }) : undefined,
  };
}
