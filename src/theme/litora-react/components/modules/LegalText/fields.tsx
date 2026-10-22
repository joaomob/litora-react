import { ModuleFields, TextField, RepeatedFieldGroup } from '@hubspot/cms-components/fields';
import { NoWrapTerm, SectionStyle } from '../../fieldLibrary/index.js';
// Every visitor text is a field, ported from the Litora HubL module (legal-text.module/fields.json).
// The defaults are the English page (content/privacy-en-us.json).
import defaults from './defaults.json';

export const fields = (
  <ModuleFields>
    <TextField label="Heading" name="heading" required default={defaults.heading} />
    <NoWrapTerm defaultValue={defaults.noWrapTerm} />
    <TextField
      label="Last update"
      name="updated"
      inlineHelpText="Such as Updated October 2, 2026. Change it with every new version."
      default={defaults.updated}
    />
    <RepeatedFieldGroup
      label="Paragraphs"
      name="paragraphs"
      occurrence={{ min: 1, max: 30 }}
      default={defaults.paragraphs}
    >
      <TextField label="Text" name="text" />
    </RepeatedFieldGroup>
    <SectionStyle defaultBackground={defaults.style.background} />
  </ModuleFields>
);
