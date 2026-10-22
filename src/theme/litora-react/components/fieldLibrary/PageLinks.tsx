import { FieldGroup, TextField } from '@hubspot/cms-components/fields';

type Links = { self: string; alternate: string; alternateLang: string; privacy?: string };

// The paths a module links to: this page, the same page in the other language (the language switch) and, in the
// modules that link to it, the privacy policy in this language. Once the page is linked to its translation in HubSpot,
// the first three come from the language variants (shared/pageLinks.ts), so these values only serve a page alone.
export function PageLinks({ defaults }: { defaults: Links }) {
  return (
    <FieldGroup label="Page links" name="links">
      <TextField
        label="This page"
        name="self"
        inlineHelpText="The path of this page, such as /en/eb5-visa-webinar."
        default={defaults.self}
      />
      <TextField
        label="Translated page"
        name="alternate"
        inlineHelpText="The path of this page in the other language. Once the page is linked to its translation, the link follows it."
        default={defaults.alternate}
      />
      <TextField
        label="Translated page language"
        name="alternateLang"
        inlineHelpText="Its language code, such as pt-BR."
        default={defaults.alternateLang}
      />
      {defaults.privacy !== undefined && (
        <TextField
          label="Privacy policy"
          name="privacy"
          inlineHelpText="The path of the privacy policy in this language."
          default={defaults.privacy}
        />
      )}
    </FieldGroup>
  );
}
