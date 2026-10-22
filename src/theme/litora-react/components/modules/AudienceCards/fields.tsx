import { ModuleFields, TextField, RepeatedFieldGroup } from '@hubspot/cms-components/fields';
import { NoWrapTerm, Photo, SectionStyle } from '../../fieldLibrary/index.js';
// Every visitor text is a field, ported from the Litora HubL module (audience-cards.module/fields.json).
// The defaults are the English page (content/webinar-en-us.json).
import defaults from './defaults.json';

export const fields = (
  <ModuleFields>
    <TextField label="Heading" name="heading" required default={defaults.heading} />
    <NoWrapTerm defaultValue={defaults.noWrapTerm} />
    <RepeatedFieldGroup
      label="Cards"
      name="items"
      inlineHelpText="Three per row on a computer, one per row on a phone."
      occurrence={{ min: 1, max: 6, sorting_label_field: 'items.heading' }}
      default={defaults.items}
    >
      <TextField label="Heading" name="heading" />
      <TextField label="Text" name="text" />
      <Photo />
      {/* A text field, as the pages stored it: a choice field would be another type and lose the saved values */}
      <TextField
        label="Photo framing"
        name="focus"
        inlineHelpText="The part of the photo kept in view when the card crops it: top or upper. Empty keeps the middle."
      />
    </RepeatedFieldGroup>
    <SectionStyle defaultBackground={defaults.style.background} />
  </ModuleFields>
);
