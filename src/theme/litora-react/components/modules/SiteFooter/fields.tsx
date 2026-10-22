import { ModuleFields, TextField, FieldGroup } from '@hubspot/cms-components/fields';
import { HeaderText, PageLinks, SectionStyle } from '../../fieldLibrary/index.js';
// Every visitor text is a field, ported from the Litora HubL module (site-footer.module/fields.json).
// The defaults are the English page (content/webinar-en-us.json).
import defaults from './defaults.json';

const { footer } = defaults.global;

export const fields = (
  <ModuleFields>
    <TextField
      label="Fictional brand notice"
      name="fictionalNotice"
      inlineHelpText="Says the brand and the people on the page are fictional."
      default={defaults.fictionalNotice}
    />
    <PageLinks defaults={defaults.links} />
    <HeaderText defaults={defaults.global.header}>
      <FieldGroup label="Footer" name="footer">
        <TextField label="About the brand" name="about" default={footer.about} />
        <TextField label="Legal notice title" name="legalNoticeTitle" default={footer.legalNoticeTitle} />
        <TextField label="Legal notice" name="legalNotice" default={footer.legalNotice} />
        <TextField label="Privacy link text" name="privacyLabel" default={footer.privacyLabel} />
        <TextField
          label="Language link text"
          name="languageLinkLabel"
          inlineHelpText="Leads to this page in the other language."
          default={footer.languageLinkLabel}
        />
      </FieldGroup>
    </HeaderText>
    <SectionStyle defaultBackground={defaults.style.background} />
  </ModuleFields>
);
