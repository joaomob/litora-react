import { ModuleFields, TextField, FieldGroup, RepeatedFieldGroup, BooleanField } from '@hubspot/cms-components/fields';
import { HeaderText, NoWrapTerm, PageLinks, PhotoWithPhoneCrop, TimeBlock } from '../../fieldLibrary/index.js';
// Every visitor text is a field, ported from the Litora HubL module (confirmation-hero.module/fields.json).
// The defaults are the English page (content/webinar-thank-you-en-us.json).
import defaults from './defaults.json';

export const fields = (
  <ModuleFields>
    <TextField label="Heading" name="heading" required default={defaults.heading} />
    <NoWrapTerm defaultValue={defaults.noWrapTerm} />
    <RepeatedFieldGroup
      label="Details"
      name="details"
      inlineHelpText="Short lines under the heading, such as where the link arrives."
      occurrence={{ min: 0, max: 4 }}
      default={defaults.details}
    >
      <TextField label="Text" name="text" />
    </RepeatedFieldGroup>
    <TextField label="Text" name="bodyText" default={defaults.bodyText} />
    <TimeBlock defaults={defaults.timeBlock} />
    <BooleanField
      label="Show the calendar button"
      name="showCalendar"
      display="checkbox"
      default={defaults.showCalendar}
    />
    <FieldGroup label="Calendar file" name="calendar">
      <TextField label="Button text" name="buttonLabel" default={defaults.calendar.buttonLabel} />
      <TextField
        label="File name"
        name="fileName"
        inlineHelpText="Ends in .ics, the calendar file the button downloads."
        default={defaults.calendar.fileName}
      />
      <TextField label="Event title" name="title" default={defaults.calendar.title} />
      <TextField label="Event description" name="description" default={defaults.calendar.description} />
      <TextField
        label="Start, in UTC"
        name="startUtc"
        inlineHelpText="As 20261112T230000Z (year, month, day, T, hour, minute, second, Z)."
        default={defaults.calendar.startUtc}
      />
      <TextField
        label="End, in UTC"
        name="endUtc"
        inlineHelpText="Same format as the start."
        default={defaults.calendar.endUtc}
      />
    </FieldGroup>
    <PhotoWithPhoneCrop defaults={defaults} />
    <PageLinks defaults={defaults.links} />
    <HeaderText defaults={defaults.global.header} />
  </ModuleFields>
);
