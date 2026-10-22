import { ModuleFields, TextField, FieldGroup, RepeatedFieldGroup, ChoiceField } from '@hubspot/cms-components/fields';
// Every visitor text is a field, ported from the Litora HubL module (faq-accordion.module/fields.json, by
// scripts/port-fields.mjs). The defaults are the English page (content/webinar-en-us.json).
import defaults from './defaults.json';

export const fields = (
  <ModuleFields>
    <TextField label="Heading" name="heading" default={defaults.heading} />
    <TextField
      label="Term kept on one line"
      name="noWrapTerm"
      inlineHelpText="Wherever this term appears in a heading, it never breaks across two lines."
      default={defaults.noWrapTerm}
    />
    <TextField label="Intro" name="intro" default={defaults.intro} />
    <FieldGroup label="Timeline" name="timeline">
      <TextField label="Legend" name="legend" default={defaults.timeline.legend} />
      <RepeatedFieldGroup label="Items" name="items" occurrence={{ min: 0, max: 20 }} default={defaults.timeline.items}>
        <TextField label="Title" name="title" />
        <TextField label="Text" name="text" />
        <TextField label="Trace" name="trace" />
      </RepeatedFieldGroup>
    </FieldGroup>
    <RepeatedFieldGroup label="Items" name="items" occurrence={{ min: 0, max: 20 }} default={defaults.items}>
      <TextField label="Question" name="question" />
      <RepeatedFieldGroup label="Answer" name="answer" occurrence={{ min: 0, max: 20 }}>
        <TextField label="Text" name="text" />
        <TextField label="List" name="list" occurrence={{ min: 0, max: 20 }} />
      </RepeatedFieldGroup>
    </RepeatedFieldGroup>
    <ChoiceField
      label="Section colour"
      name="background"
      inlineHelpText="Colours come from the theme settings."
      display="select"
      choices={[
        ['primary', 'Light'],
        ['secondary', 'Light alternate'],
        ['inverse', 'Dark'],
      ]}
      default={defaults.background}
    />
  </ModuleFields>
);
