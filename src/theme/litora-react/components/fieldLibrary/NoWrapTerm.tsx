import { TextField } from '@hubspot/cms-components/fields';

// A term that never breaks across two lines in the module headings, such as "EB-5"
export function NoWrapTerm({ defaultValue }: { defaultValue: string }) {
  return (
    <TextField
      label="Term kept on one line"
      name="noWrapTerm"
      inlineHelpText="Wherever this term appears in a heading, it never breaks across two lines. Leave empty to turn off."
      default={defaultValue}
    />
  );
}
