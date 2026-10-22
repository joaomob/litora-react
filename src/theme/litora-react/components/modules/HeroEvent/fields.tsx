import {
  ModuleFields,
  TextField,
  FieldGroup,
  RepeatedFieldGroup,
  ChoiceField,
  BooleanField,
} from '@hubspot/cms-components/fields';
import { HeaderText, NoWrapTerm, PageLinks, PhotoWithPhoneCrop, TimeBlock } from '../../fieldLibrary/index.js';
// Every visitor text is a field. The defaults are the English page (content/webinar-en-us.json); the Portuguese
// template passes its own values, as in the Litora HubL theme.
import defaults from './defaults.json';

const { form, timeBlock, links, global } = defaults;

export const fields = (
  <ModuleFields>
    <TextField
      label="Eyebrow"
      name="eyebrow"
      inlineHelpText="The short line above the heading."
      default={defaults.eyebrow}
    />
    <TextField label="Heading" name="heading" required default={defaults.heading} />
    <NoWrapTerm defaultValue={defaults.noWrapTerm} />
    <RepeatedFieldGroup
      label="Details"
      name="details"
      inlineHelpText="Short lines under the heading: when, where, in which language."
      occurrence={{ min: 0, max: 4 }}
      default={defaults.details}
    >
      <TextField label="Text" name="text" />
    </RepeatedFieldGroup>
    <TimeBlock defaults={timeBlock} />
    <TextField label="Text" name="bodyText" default={defaults.bodyText} />
    {/* The hero is the first screen: no responsive image request, as in the HubL module */}
    <PhotoWithPhoneCrop responsive={false} defaults={defaults} />
    <FieldGroup label="Registration form" name="form">
      <TextField
        label="Section anchor"
        name="anchorId"
        inlineHelpText="Buttons link here with # in front, such as #register."
        required
        default={form.anchorId}
      />
      <TextField label="Heading" name="heading" required default={form.heading} />
      <TextField
        label="HubSpot form ID"
        name="hubspotFormGuid"
        inlineHelpText="Marketing, Forms, the form, then the ID in the address bar. Entries go to that form and to the CRM."
        required
        default={form.hubspotFormGuid}
      />
      <RepeatedFieldGroup
        label="Form fields"
        name="fields"
        inlineHelpText="Each one must match a property of the HubSpot form above."
        occurrence={{ min: 1, max: 12, sorting_label_field: 'form.fields.labelText' }}
        default={form.fields}
      >
        <TextField
          label="HubSpot property"
          name="propertyName"
          inlineHelpText="The internal name of the property, such as firstname."
        />
        <ChoiceField
          label="Field type"
          name="type"
          display="select"
          choices={[
            ['text', 'Short text'],
            ['email', 'Email'],
            ['tel', 'Phone number'],
            ['radio', 'One choice from a list'],
            ['checkbox', 'Checkbox'],
            ['consent', 'Consent checkbox, with a link'],
          ]}
        />
        <TextField label="Label" name="labelText" />
        <TextField
          label="Autofill"
          name="autocomplete"
          inlineHelpText="What the browser may fill in, such as given-name, email or tel."
        />
        <BooleanField label="Half width on a computer" name="half" display="checkbox" />
        <FieldGroup label="Error messages" name="errors">
          <TextField label="When empty" name="required" />
          <TextField label="When the format is wrong" name="invalid" />
        </FieldGroup>
        <TextField label="Help text" name="help" inlineHelpText="Shown under the field." />
        <RepeatedFieldGroup
          label="Choices"
          name="options"
          inlineHelpText="Only for One choice from a list."
          occurrence={{ min: 0, max: 6, sorting_label_field: 'form.fields.options.labelText' }}
        >
          <TextField label="Value saved in HubSpot" name="value" />
          <TextField label="Label" name="labelText" />
        </RepeatedFieldGroup>
        <TextField label="Link text" name="linkLabel" inlineHelpText="Only for the consent checkbox." />
        <TextField label="Link" name="linkUrl" inlineHelpText="Only for the consent checkbox." />
      </RepeatedFieldGroup>
      <TextField label="Button text" name="submitLabel" required default={form.submitLabel} />
      <TextField label="Note under the button" name="submitNote" default={form.submitNote} />
      <TextField
        label="Error summary"
        name="notice"
        inlineHelpText="Shown above the fields when one has an error."
        default={form.notice}
      />
      <TextField
        label="Sending error"
        name="submitError"
        inlineHelpText="Shown when HubSpot cannot be reached."
        default={form.submitError}
      />
      <TextField
        label="Thank you page"
        name="redirectUrl"
        inlineHelpText="Where the visitor goes after the form is sent."
        required
        default={form.redirectUrl}
      />
    </FieldGroup>
    <PageLinks defaults={links} />
    <HeaderText defaults={global.header} />
  </ModuleFields>
);
