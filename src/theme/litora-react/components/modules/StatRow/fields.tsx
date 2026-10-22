import { ModuleFields, TextField, FieldGroup, RepeatedFieldGroup, ChoiceField } from '@hubspot/cms-components/fields';
// Every visitor text is a field, ported from the Litora HubL module (stat-row.module/fields.json, by
// scripts/port-fields.mjs). The defaults are the English page (content/webinar-en-us.json).
import defaults from './defaults.json';

export const fields = (
  <ModuleFields>
    <TextField label="Heading" name="heading" default={defaults.heading} />
    <TextField label="Term kept on one line" name="noWrapTerm" inlineHelpText="Wherever this term appears in a heading, it never breaks across two lines." default={defaults.noWrapTerm} />
    <RepeatedFieldGroup label="Items" name="items" occurrence={{ min: 0, max: 20 }} default={defaults.items}>
      <TextField label="Value" name="value" />
      <TextField label="Caption" name="caption" />
    </RepeatedFieldGroup>
    <TextField label="Source" name="source" default={defaults.source} />
    <FieldGroup label="Cost" name="cost">
      <TextField label="Heading" name="heading" default={defaults.cost.heading} />
      <RepeatedFieldGroup label="Rows" name="rows" occurrence={{ min: 0, max: 20 }} default={defaults.cost.rows}>
        <TextField label="Label Text" name="labelText" />
        <RepeatedFieldGroup label="Values" name="values" occurrence={{ min: 0, max: 20 }}>
          <TextField label="Amount" name="amount" />
          <TextField label="When" name="when" />
        </RepeatedFieldGroup>
      </RepeatedFieldGroup>
      <TextField label="Note" name="note" default={defaults.cost.note} />
    </FieldGroup>
    <ChoiceField label="Section colour" name="background" inlineHelpText="Colours come from the theme settings." display="select" choices={[['primary', 'Light'], ['secondary', 'Light alternate'], ['inverse', 'Dark']]} default={defaults.background} />
  </ModuleFields>
);
