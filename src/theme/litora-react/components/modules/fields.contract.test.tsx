import { cloneElement, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// The editor stores each value under the field path (name inside its groups) and reads it with the field type. A renamed
// or retyped field shows the default again on every page that already set it, so the paths and types are a contract:
// this test fails when one changes, unless the new field maps the old path with an alias (HubSpot alias mapping).
type FieldJson = {
  name: string;
  type: string;
  label: string;
  required?: boolean;
  tab?: string;
  occurrence?: { min: number; max?: number | null };
  children?: FieldJson[];
  aliases_mapping?: { property_aliases_paths: Record<string, string[]> };
};

const modules = import.meta.glob<{ fields: ReactElement }>('./*/fields.tsx', { eager: true });

export function fieldsJson(fields: ReactElement): FieldJson[] {
  let out: FieldJson[] = [];
  renderToStaticMarkup(
    cloneElement(fields as ReactElement<{ outputCallback?: (f: FieldJson[]) => void }>, {
      outputCallback: (f: FieldJson[]) => (out = f),
    }),
  );
  return out;
}

function contract(fields: FieldJson[], prefix = ''): string[] {
  return fields.flatMap((f) => {
    const path = prefix + f.name;
    const aliases = Object.values(f.aliases_mapping?.property_aliases_paths ?? {}).flat();
    const line = `${path}: ${f.type}${aliases.length ? ` (alias of ${aliases.join(', ')})` : ''}`;
    return [line, ...contract(f.children ?? [], `${path}.`)];
  });
}

describe.each(Object.entries(modules))('%s', (file, { fields }) => {
  const json = fieldsJson(fields);

  it('keeps the field paths and types', () => {
    expect(contract(json)).toMatchSnapshot();
  });
});
