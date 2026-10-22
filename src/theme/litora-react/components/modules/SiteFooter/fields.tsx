import { ModuleFields, TextField, FieldGroup, ChoiceField } from '@hubspot/cms-components/fields';
// Every visitor text is a field, ported from the Litora HubL module (site-footer.module/fields.json, by
// scripts/port-fields.mjs). The defaults are the English page (content/webinar-en-us.json).
import defaults from './defaults.json';

export const fields = (
  <ModuleFields>
    <TextField label="Fictional Notice" name="fictionalNotice" default={defaults.fictionalNotice} />
    <ChoiceField label="Section colour" name="background" inlineHelpText="Colours come from the theme settings." display="select" choices={[['primary', 'Light'], ['secondary', 'Light alternate'], ['inverse', 'Dark']]} default={defaults.background} />
    <FieldGroup label="Links" name="links">
      <TextField label="Self" name="self" default={defaults.links.self} />
      <TextField label="Alternate" name="alternate" default={defaults.links.alternate} />
      <TextField label="Alternate Lang" name="alternateLang" default={defaults.links.alternateLang} />
      <TextField label="Privacy" name="privacy" default={defaults.links.privacy} />
    </FieldGroup>
    <FieldGroup label="Global" name="global">
      <FieldGroup label="Header" name="header">
        <TextField label="Logo Text" name="logoText" default={defaults.global.header.logoText} />
      </FieldGroup>
      <FieldGroup label="Footer" name="footer">
        <TextField label="About" name="about" default={defaults.global.footer.about} />
        <TextField label="Legal Notice Title" name="legalNoticeTitle" default={defaults.global.footer.legalNoticeTitle} />
        <TextField label="Legal Notice" name="legalNotice" default={defaults.global.footer.legalNotice} />
        <TextField label="Privacy Label" name="privacyLabel" default={defaults.global.footer.privacyLabel} />
        <TextField label="Language Link Label" name="languageLinkLabel" default={defaults.global.footer.languageLinkLabel} />
      </FieldGroup>
    </FieldGroup>
  </ModuleFields>
);
