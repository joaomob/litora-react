import { ModuleFields, TextField, FieldGroup, RepeatedFieldGroup } from '@hubspot/cms-components/fields';
import { NoWrapTerm, SectionStyle } from '../../fieldLibrary/index.js';
// Every visitor text is a field, ported from the Litora HubL module (stat-row.module/fields.json).
// The defaults are the English page (content/webinar-en-us.json).
import defaults from './defaults.json';

export const fields = (
  <ModuleFields>
    <TextField label="Heading" name="heading" required default={defaults.heading} />
    <NoWrapTerm defaultValue={defaults.noWrapTerm} />
    <RepeatedFieldGroup
      label="Figures"
      name="items"
      occurrence={{ min: 2, max: 6, sorting_label_field: 'items.value' }}
      default={defaults.items}
    >
      <TextField label="Figure" name="value" inlineHelpText="Such as $800,000. Keep it short: it is drawn large." />
      <TextField label="What it means" name="caption" />
    </RepeatedFieldGroup>
    <TextField
      label="Source of the figures"
      name="source"
      inlineHelpText="Where the figures come from and as of when."
      default={defaults.source}
    />
    <FieldGroup label="Cost table" name="cost">
      <TextField label="Heading" name="heading" default={defaults.cost.heading} />
      <RepeatedFieldGroup
        label="Rows"
        name="rows"
        occurrence={{ min: 1, max: 8, sorting_label_field: 'cost.rows.labelText' }}
        default={defaults.cost.rows}
      >
        <TextField label="Cost" name="labelText" />
        <RepeatedFieldGroup label="Amounts" name="values" occurrence={{ min: 1, max: 3 }}>
          <TextField label="Amount" name="amount" />
          <TextField label="When it is paid" name="when" />
        </RepeatedFieldGroup>
      </RepeatedFieldGroup>
      <TextField label="Note under the table" name="note" default={defaults.cost.note} />
    </FieldGroup>
    <SectionStyle defaultBackground={defaults.style.background} />
  </ModuleFields>
);
