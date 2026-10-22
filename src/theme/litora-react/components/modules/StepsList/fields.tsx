import { ModuleFields, TextField, RepeatedFieldGroup } from '@hubspot/cms-components/fields';
import { NoWrapTerm, SectionStyle } from '../../fieldLibrary/index.js';
// Every visitor text is a field, ported from the Litora HubL module (steps-list.module/fields.json).
// The defaults are the English page (content/webinar-thank-you-en-us.json).
import defaults from './defaults.json';

export const fields = (
  <ModuleFields>
    <TextField label="Heading" name="heading" required default={defaults.heading} />
    <NoWrapTerm defaultValue={defaults.noWrapTerm} />
    <TextField label="Intro" name="intro" default={defaults.intro} />
    <RepeatedFieldGroup
      label="Steps"
      name="items"
      inlineHelpText="Numbered in this order."
      occurrence={{ min: 2, max: 8, sorting_label_field: 'items.text' }}
      default={defaults.items}
    >
      <TextField label="Text" name="text" />
    </RepeatedFieldGroup>
    <SectionStyle defaultBackground={defaults.style.background} />
  </ModuleFields>
);
