import { ModuleFields, TextField, RepeatedFieldGroup } from '@hubspot/cms-components/fields';
import { NoWrapTerm, Photo, SectionStyle } from '../../fieldLibrary/index.js';
// Every visitor text is a field, ported from the Litora HubL module (speakers.module/fields.json).
// The defaults are the English page (content/webinar-en-us.json).
import defaults from './defaults.json';

export const fields = (
  <ModuleFields>
    <TextField label="Heading" name="heading" required default={defaults.heading} />
    <NoWrapTerm defaultValue={defaults.noWrapTerm} />
    <TextField
      label="Note"
      name="note"
      inlineHelpText="Shown under the heading, such as a notice that the people are fictional."
      default={defaults.note}
    />
    <RepeatedFieldGroup
      label="Speakers"
      name="items"
      inlineHelpText="Two or three per row on a computer, depending on how many there are."
      occurrence={{ min: 1, max: 4, sorting_label_field: 'items.nameText' }}
      default={defaults.items}
    >
      <TextField label="Name" name="nameText" />
      <TextField label="Role" name="role" />
      <TextField label="Short bio" name="text" />
      <Photo />
    </RepeatedFieldGroup>
    <SectionStyle defaultBackground={defaults.style.background} />
  </ModuleFields>
);
