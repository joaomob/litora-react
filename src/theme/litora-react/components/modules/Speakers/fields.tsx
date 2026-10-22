import { ModuleFields, TextField, RepeatedFieldGroup, ImageField, ChoiceField } from '@hubspot/cms-components/fields';
// Every visitor text is a field, ported from the Litora HubL module (speakers.module/fields.json, by
// scripts/port-fields.mjs). The defaults are the English page (content/webinar-en-us.json).
import defaults from './defaults.json';

export const fields = (
  <ModuleFields>
    <TextField label="Heading" name="heading" default={defaults.heading} />
    <TextField
      label="Term kept on one line"
      name="noWrapTerm"
      inlineHelpText="Wherever this term appears in a heading, it never breaks across two lines."
      default={defaults.noWrapTerm}
    />
    <TextField label="Note" name="note" default={defaults.note} />
    <RepeatedFieldGroup label="Items" name="items" occurrence={{ min: 0, max: 20 }} default={defaults.items}>
      <TextField label="Name Text" name="nameText" />
      <TextField label="Role" name="role" />
      <TextField label="Text" name="text" />
      <ImageField label="Image" name="image" resizable={false} responsive showLoading={false} />
    </RepeatedFieldGroup>
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
