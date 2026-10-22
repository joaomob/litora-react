import { ModuleFields, TextField, RepeatedFieldGroup } from '@hubspot/cms-components/fields';
import { PhotoWithPhoneCrop } from '../../fieldLibrary/index.js';
// Every visitor text is a field, ported from the Litora HubL module (project-stack.module/fields.json).
// The defaults are the English page (content/webinar-en-us.json).
import defaults from './defaults.json';

export const fields = (
  <ModuleFields>
    <TextField label="Eyebrow" name="labelText" inlineHelpText="Such as Inside Tavessa." default={defaults.labelText} />
    <RepeatedFieldGroup
      label="Photos"
      name="items"
      inlineHelpText="They stack over each other as the visitor scrolls."
      occurrence={{ min: 1, max: 6, sorting_label_field: 'items.nameText' }}
      default={defaults.items}
    >
      <TextField label="Tag" name="labelText" inlineHelpText="Such as Illustrative image." />
      <TextField label="Name" name="nameText" inlineHelpText="Such as Facade." />
      <TextField label="Caption" name="caption" />
      <PhotoWithPhoneCrop />
    </RepeatedFieldGroup>
  </ModuleFields>
);
