import { ModuleFields, TextField } from '@hubspot/cms-components/fields';
import { ButtonContent, NoWrapTerm, PhotoWithPhoneCrop } from '../../fieldLibrary/index.js';
// Every visitor text is a field, ported from the Litora HubL module (cta-band.module/fields.json).
// The defaults are the English page (content/webinar-en-us.json).
import defaults from './defaults.json';

export const fields = (
  <ModuleFields>
    <TextField label="Heading" name="heading" required default={defaults.heading} />
    <NoWrapTerm defaultValue={defaults.noWrapTerm} />
    <TextField label="Text" name="text" default={defaults.text} />
    <ButtonContent
      labelName="buttonLabel"
      targetName="buttonTarget"
      defaults={{ label: defaults.buttonLabel, target: defaults.buttonTarget }}
    />
    <PhotoWithPhoneCrop defaults={defaults} />
  </ModuleFields>
);
