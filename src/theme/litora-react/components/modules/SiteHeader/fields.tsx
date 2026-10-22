import { ModuleFields, TextField, FieldGroup } from '@hubspot/cms-components/fields';
// Every visitor text is a field, ported from the Litora HubL module (site-header.module/fields.json, by
// scripts/port-fields.mjs). The defaults are the English page (content/webinar-en-us.json).
import defaults from './defaults.json';

export const fields = (
  <ModuleFields>
    <TextField label="Button Label" name="ctaLabel" default={defaults.ctaLabel} />
    <TextField label="Button Target" name="ctaTarget" default={defaults.ctaTarget} />
    <FieldGroup label="Links" name="links">
      <TextField label="Self" name="self" default={defaults.links.self} />
      <TextField label="Alternate" name="alternate" default={defaults.links.alternate} />
      <TextField label="Alternate Lang" name="alternateLang" default={defaults.links.alternateLang} />
    </FieldGroup>
    <FieldGroup label="Global" name="global">
      <FieldGroup label="Header" name="header">
        <TextField label="Logo Text" name="logoText" default={defaults.global.header.logoText} />
        <TextField label="Language Current" name="languageCurrent" default={defaults.global.header.languageCurrent} />
        <TextField label="Language Other" name="languageOther" default={defaults.global.header.languageOther} />
        <TextField label="Language Other Label" name="languageOtherLabel" default={defaults.global.header.languageOtherLabel} />
      </FieldGroup>
    </FieldGroup>
  </ModuleFields>
);
