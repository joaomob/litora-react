import { ModuleFields, TextField, ChoiceField } from '@hubspot/cms-components/fields';
// Every visitor text is a field, ported from the Litora HubL module (statement-reveal.module/fields.json, by
// scripts/port-fields.mjs). The defaults are the English page (content/webinar-en-us.json).
import defaults from './defaults.json';

export const fields = (
  <ModuleFields>
    <TextField label="Label Text" name="labelText" default={defaults.labelText} />
    <TextField label="Text" name="text" default={defaults.text} />
    <ChoiceField
      label="Section colour"
      name="background"
      inlineHelpText="Colours come from the theme settings."
      display="select"
      choices={[
        ['primary', 'Light'],
        ['secondary', 'Light alternate'],
        ['inverse', 'Dark'],
      ]}
      default={defaults.background}
    />
  </ModuleFields>
);
