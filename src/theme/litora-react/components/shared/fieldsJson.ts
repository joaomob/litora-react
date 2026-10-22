import { cloneElement, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// The fields of a module as the editor reads them (the fields.json HubSpot builds from fields.tsx)
export type FieldJson = {
  name: string;
  type: string;
  label: string;
  required?: boolean;
  default?: unknown;
  tab?: string;
  choices?: [string, string][];
  occurrence?: { min: number | null; max?: number | null };
  children?: FieldJson[];
  aliases_mapping?: { property_aliases_paths: Record<string, string[]> };
};

export function fieldsJson(fields: ReactElement): FieldJson[] {
  let out: FieldJson[] = [];
  renderToStaticMarkup(
    cloneElement(fields as ReactElement<{ outputCallback?: (f: FieldJson[]) => void }>, {
      outputCallback: (f: FieldJson[]) => (out = f),
    }),
  );
  return out;
}
