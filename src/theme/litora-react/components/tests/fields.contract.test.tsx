import type { ReactElement } from 'react';
import { fieldsJson, type FieldJson } from '../shared/fieldsJson.js';

// The editor stores each value under the field path (name inside its groups) and reads it with the field type. A renamed
// or retyped field shows the default again on every page that already set it, so the paths and types are a contract:
// this test fails when one changes, unless the new field maps the old path with an alias (HubSpot alias mapping).
const modules = import.meta.glob<{ fields: ReactElement }>('../modules/*/fields.tsx', { eager: true });

function contract(fields: FieldJson[], prefix = ''): string[] {
  return fields.flatMap((f) => {
    const path = prefix + f.name;
    const aliases = Object.values(f.aliases_mapping?.property_aliases_paths ?? {}).flat();
    const line = `${path}: ${f.type}${aliases.length ? ` (alias of ${aliases.join(', ')})` : ''}`;
    return [line, ...contract(f.children ?? [], `${path}.`)];
  });
}

// The module parameters of the 10 pages (content/*.json, the values the templates write and the pages store), by the
// module folder name: site-header is SiteHeader
const content = import.meta.glob<{ module: string; params: unknown }[]>('../../../../../content/*-{en-us,pt-br}.json', {
  eager: true,
  import: 'default',
});
const pages = Object.entries(content).map(([page, modules]) => ({ page, modules }));
const folderOf = (module: string) => module.replace(/(^|-)(\w)/g, (_, __, c: string) => c.toUpperCase());

type Value = Record<string, unknown>;
// Every repeater count outside its limits, at any depth, as "path: count (min-max)"
function outOfLimits(fields: FieldJson[], value: Value, prefix = ''): string[] {
  return fields.flatMap((f) => {
    const path = prefix + f.name;
    const v = value?.[f.name];
    if (v === undefined) return [];
    if (f.occurrence) {
      const items = v as unknown[];
      const { min, max } = f.occurrence;
      const bad = items.length < (min ?? 0) || (max != null && items.length > max);
      const own = bad ? [`${path}: ${items.length} (${min}-${max})`] : [];
      return [
        ...own,
        ...items.flatMap((item) => (f.children ? outOfLimits(f.children, item as Value, `${path}.`) : [])),
      ];
    }
    return f.children ? outOfLimits(f.children, v as Value, `${path}.`) : [];
  });
}

function walk(fields: FieldJson[], prefix = ''): (FieldJson & { path: string })[] {
  return fields.flatMap((f) => [{ ...f, path: prefix + f.name }, ...walk(f.children ?? [], `${prefix + f.name}.`)]);
}

describe.each(Object.entries(modules))('%s', (file, { fields }) => {
  const json = fieldsJson(fields);
  const folder = file.split('/')[2]!;

  it('keeps the field paths and types', () => {
    expect(contract(json)).toMatchSnapshot();
  });

  it('keeps every repeater of the 10 pages inside its limits', () => {
    const uses = pages.flatMap(({ page, modules }) =>
      modules.filter((m) => folderOf(m.module) === folder).map((m) => ({ page, params: m.params as Value })),
    );
    expect(uses.length).toBeGreaterThan(0);
    for (const { page, params } of uses) expect(outOfLimits(json, params), page).toEqual([]);
  });

  it('gives every required field a default, so a new section starts valid', () => {
    const empty = walk(json).filter((f) => f.required && (f.default === undefined || f.default === ''));
    expect(empty.map((f) => f.path)).toEqual([]);
  });

  it('keeps the section colour saved before the Style tab, through the alias', () => {
    const style = walk(json).find((f) => f.path === 'style.background');
    if (!style) return;
    expect(json.find((f) => f.name === 'style')?.tab).toBe('STYLE');
    expect(style.aliases_mapping?.property_aliases_paths).toEqual({ background: ['background'] });
    expect(style.required).toBeFalsy();
  });
});
