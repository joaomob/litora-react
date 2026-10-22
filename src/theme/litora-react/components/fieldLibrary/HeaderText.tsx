import { FieldGroup, TextField } from '@hubspot/cms-components/fields';
import type { ReactNode } from 'react';

type Header = { logoText: string; languageCurrent: string; languageOther: string; languageOtherLabel: string };

// The brand name and the language switch, inside the "global" group the HubL modules used for the texts every page
// repeats. The footer only needs the brand name.
export function HeaderText({ defaults, children }: { defaults: Partial<Header>; children?: ReactNode }) {
  return (
    <FieldGroup label="Site texts" name="global">
      <FieldGroup label="Header" name="header">
        <TextField
          label="Brand name"
          name="logoText"
          inlineHelpText="Screen readers read it on the logo link."
          default={defaults.logoText}
        />
        {defaults.languageCurrent !== undefined && (
          <>
            <TextField
              label="This language, short"
              name="languageCurrent"
              inlineHelpText="As the switch shows it, such as EN."
              default={defaults.languageCurrent}
            />
            <TextField
              label="Other language, short"
              name="languageOther"
              inlineHelpText="As the switch shows it, such as PT."
              default={defaults.languageOther}
            />
            <TextField
              label="Language switch, for screen readers"
              name="languageOtherLabel"
              inlineHelpText="Such as View this page in Portuguese."
              default={defaults.languageOtherLabel}
            />
          </>
        )}
      </FieldGroup>
      {children}
    </FieldGroup>
  );
}
