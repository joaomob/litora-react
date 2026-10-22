import { ModuleFields, TextField, RepeatedFieldGroup } from '@hubspot/cms-components/fields';
import { NoWrapTerm, Photo, SectionStyle } from '../../fieldLibrary/index.js';
// Every visitor text is a field, ported from the Litora HubL module (topic-grid.module/fields.json).
// The defaults are the English page (content/webinar-en-us.json).
import defaults from './defaults.json';

export const fields = (
  <ModuleFields>
    <TextField label="Heading" name="heading" required default={defaults.heading} />
    <NoWrapTerm defaultValue={defaults.noWrapTerm} />
    <TextField label="Intro" name="intro" default={defaults.intro} />
    <RepeatedFieldGroup
      label="Topics"
      name="items"
      occurrence={{ min: 1, max: 10, sorting_label_field: 'items.heading' }}
      default={defaults.items}
    >
      <TextField label="Heading" name="heading" />
      <TextField label="Text" name="text" />
      <Photo />
    </RepeatedFieldGroup>
    <SectionStyle defaultBackground={defaults.style.background} />
  </ModuleFields>
);
