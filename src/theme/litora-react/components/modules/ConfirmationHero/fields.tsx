import { ModuleFields, TextField, FieldGroup, RepeatedFieldGroup, ImageField, BooleanField } from '@hubspot/cms-components/fields';
// Every visitor text is a field, ported from the Litora HubL module (confirmation-hero.module/fields.json, by
// scripts/port-fields.mjs). The defaults are the English page (content/webinar-thank-you-en-us.json).
import defaults from './defaults.json';

export const fields = (
  <ModuleFields>
    <TextField label="Heading" name="heading" default={defaults.heading} />
    <TextField label="Term kept on one line" name="noWrapTerm" inlineHelpText="Wherever this term appears in a heading, it never breaks across two lines." default={defaults.noWrapTerm} />
    <RepeatedFieldGroup label="Details" name="details" occurrence={{ min: 0, max: 20 }} default={defaults.details}>
      <TextField label="Text" name="text" />
    </RepeatedFieldGroup>
    <TextField label="Body Text" name="bodyText" default={defaults.bodyText} />
    <FieldGroup label="Time Block" name="timeBlock">
      <TextField label="Date" name="date" default={defaults.timeBlock.date} />
      <TextField label="Day" name="day" default={defaults.timeBlock.day} />
      <TextField label="Month" name="month" default={defaults.timeBlock.month} />
      <RepeatedFieldGroup label="Rows" name="rows" occurrence={{ min: 0, max: 20 }} default={defaults.timeBlock.rows}>
        <TextField label="Time" name="time" />
        <TextField label="Datetime" name="datetime" />
        <TextField label="Place" name="place" />
      </RepeatedFieldGroup>
    </FieldGroup>
    <FieldGroup label="Calendar" name="calendar">
      <TextField label="Button Label" name="buttonLabel" default={defaults.calendar.buttonLabel} />
      <TextField label="File Name" name="fileName" default={defaults.calendar.fileName} />
      <TextField label="Title" name="title" default={defaults.calendar.title} />
      <TextField label="Description" name="description" default={defaults.calendar.description} />
      <TextField label="Start Utc" name="startUtc" default={defaults.calendar.startUtc} />
      <TextField label="End Utc" name="endUtc" default={defaults.calendar.endUtc} />
    </FieldGroup>
    <ImageField label="Image" name="image" resizable={false} responsive showLoading={false} default={defaults.image} />
    <ImageField label="Image, phone crop" name="imageTall" inlineHelpText="The crop shown on phones (767 px and narrower)." resizable={false} responsive showLoading={false} default={defaults.imageTall} />
    <BooleanField label="Show Calendar" name="showCalendar" display="checkbox" default={defaults.showCalendar} />
    <FieldGroup label="Links" name="links">
      <TextField label="Self" name="self" default={defaults.links.self} />
      <TextField label="Alternate" name="alternate" default={defaults.links.alternate} />
      <TextField label="Alternate Lang" name="alternateLang" default={defaults.links.alternateLang} />
    </FieldGroup>
    <FieldGroup label="Global" name="global">
      <FieldGroup label="Header" name="header">
        <TextField label="Logo Text" name="logoText" default={defaults.global.header.logoText} />
        <TextField label="Language Current" name="languageCurrent" default={defaults.global.header.languageCurrent} />
        <TextField label="Language Other" name="languageOther" default={defaults.global.header.languageOther} />
        <TextField label="Language Other Label" name="languageOtherLabel" default={defaults.global.header.languageOtherLabel} />
      </FieldGroup>
    </FieldGroup>
  </ModuleFields>
);
