import { ModuleFields, TextField } from '@hubspot/cms-components/fields';
import { SectionStyle } from '../../fieldLibrary/index.js';
// Every visitor text is a field, ported from the Litora HubL module (statement-reveal.module/fields.json).
// The defaults are the English page (content/webinar-en-us.json).
import defaults from './defaults.json';

export const fields = (
  <ModuleFields>
    <TextField label="Eyebrow" name="labelText" inlineHelpText="Such as The webinar." default={defaults.labelText} />
    <TextField
      label="Statement"
      name="text"
      inlineHelpText="One or two sentences. The words light up one by one as the visitor scrolls."
      required
      default={defaults.text}
    />
    <SectionStyle defaultBackground={defaults.style.background} />
  </ModuleFields>
);
