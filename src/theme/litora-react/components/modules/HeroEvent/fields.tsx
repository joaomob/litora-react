import {
  ModuleFields,
  TextField,
  FieldGroup,
  RepeatedFieldGroup,
  ImageField,
  ChoiceField,
  BooleanField,
} from '@hubspot/cms-components/fields';
// Every visitor text is a field. The defaults are the English page (content/webinar-en-us.json); the Portuguese
// template passes its own values, as in the Litora HubL theme.
import defaults from './defaults.json';

const { form, timeBlock, links, global } = defaults;

export const fields = (
  <ModuleFields>
    <TextField label="Eyebrow" name="eyebrow" default={defaults.eyebrow} />
    <TextField label="Heading" name="heading" default={defaults.heading} />
    <TextField
      label="Term kept on one line"
      name="noWrapTerm"
      inlineHelpText="Wherever this term appears in a heading, it never breaks across two lines."
      default={defaults.noWrapTerm}
    />
    <RepeatedFieldGroup label="Details" name="details" occurrence={{ min: 0, max: 20 }} default={defaults.details}>
      <TextField label="Text" name="text" />
    </RepeatedFieldGroup>
    <FieldGroup label="Time block" name="timeBlock">
      <TextField label="Date" name="date" inlineHelpText="As YYYY-MM-DD." default={timeBlock.date} />
      <TextField label="Day" name="day" default={timeBlock.day} />
      <TextField label="Month" name="month" default={timeBlock.month} />
      <RepeatedFieldGroup label="Rows" name="rows" occurrence={{ min: 0, max: 20 }} default={timeBlock.rows}>
        <TextField label="Time" name="time" />
        <TextField label="Datetime" name="datetime" inlineHelpText="With the time zone, as 2026-11-12T20:00-03:00." />
        <TextField label="Place" name="place" />
      </RepeatedFieldGroup>
    </FieldGroup>
    <TextField label="Body text" name="bodyText" default={defaults.bodyText} />
    <ImageField label="Image" name="image" resizable={false} default={defaults.image} />
    <ImageField
      label="Image, phone crop"
      name="imageTall"
      inlineHelpText="The crop shown on phones (767 px and narrower)."
      resizable={false}
      default={defaults.imageTall}
    />
    <FieldGroup label="Form" name="form">
      <TextField label="Anchor ID" name="anchorId" default={form.anchorId} />
      <TextField label="Heading" name="heading" default={form.heading} />
      <TextField label="HubSpot form GUID" name="hubspotFormGuid" default={form.hubspotFormGuid} />
      <RepeatedFieldGroup label="Fields" name="fields" occurrence={{ min: 0, max: 20 }} default={form.fields}>
        <TextField label="Property name" name="propertyName" />
        <ChoiceField
          label="Field type"
          name="type"
          choices={[
            ['text', 'text'],
            ['email', 'email'],
            ['tel', 'tel'],
            ['radio', 'radio'],
            ['checkbox', 'checkbox'],
            ['consent', 'consent'],
          ]}
        />
        <TextField label="Label text" name="labelText" />
        <TextField label="Autocomplete" name="autocomplete" />
        <BooleanField label="Half" name="half" />
        <FieldGroup label="Errors" name="errors">
          <TextField label="Required" name="required" />
          <TextField label="Invalid" name="invalid" />
        </FieldGroup>
        <TextField label="Help" name="help" />
        <RepeatedFieldGroup label="Options" name="options" occurrence={{ min: 0, max: 20 }}>
          <TextField label="Value" name="value" />
          <TextField label="Label text" name="labelText" />
        </RepeatedFieldGroup>
        <TextField label="Link label" name="linkLabel" />
        <TextField label="Link URL" name="linkUrl" />
      </RepeatedFieldGroup>
      <TextField label="Submit label" name="submitLabel" default={form.submitLabel} />
      <TextField label="Submit note" name="submitNote" default={form.submitNote} />
      <TextField label="Notice" name="notice" default={form.notice} />
      <TextField label="Submit error" name="submitError" default={form.submitError} />
      <TextField label="Redirect URL" name="redirectUrl" default={form.redirectUrl} />
    </FieldGroup>
    <FieldGroup label="Links" name="links">
      <TextField label="Self" name="self" default={links.self} />
      <TextField label="Alternate" name="alternate" default={links.alternate} />
      <TextField label="Alternate language" name="alternateLang" default={links.alternateLang} />
      <TextField label="Privacy" name="privacy" default={links.privacy} />
    </FieldGroup>
    <FieldGroup label="Global" name="global">
      <FieldGroup label="Header" name="header">
        <TextField label="Logo text" name="logoText" default={global.header.logoText} />
        <TextField label="Current language" name="languageCurrent" default={global.header.languageCurrent} />
        <TextField label="Other language" name="languageOther" default={global.header.languageOther} />
        <TextField
          label="Other language, full label"
          name="languageOtherLabel"
          default={global.header.languageOtherLabel}
        />
      </FieldGroup>
    </FieldGroup>
  </ModuleFields>
);
