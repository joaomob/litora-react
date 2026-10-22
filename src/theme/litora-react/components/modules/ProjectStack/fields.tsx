import { ModuleFields, TextField, RepeatedFieldGroup, ImageField } from '@hubspot/cms-components/fields';
// Every visitor text is a field, ported from the Litora HubL module (project-stack.module/fields.json, by
// scripts/port-fields.mjs). The defaults are the English page (content/webinar-en-us.json).
import defaults from './defaults.json';

export const fields = (
  <ModuleFields>
    <TextField label="Label Text" name="labelText" default={defaults.labelText} />
    <RepeatedFieldGroup label="Items" name="items" occurrence={{ min: 0, max: 20 }} default={defaults.items}>
      <TextField label="Label Text" name="labelText" />
      <TextField label="Name Text" name="nameText" />
      <TextField label="Caption" name="caption" />
      <ImageField label="Image" name="image" resizable={false} responsive showLoading={false} />
      <ImageField label="Image, phone crop" name="imageTall" inlineHelpText="The crop shown on phones (767 px and narrower)." resizable={false} responsive showLoading={false} />
    </RepeatedFieldGroup>
  </ModuleFields>
);
