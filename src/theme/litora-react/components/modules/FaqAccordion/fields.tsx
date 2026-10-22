import { ModuleFields, TextField, FieldGroup, RepeatedFieldGroup } from '@hubspot/cms-components/fields';
import { NoWrapTerm, SectionStyle } from '../../fieldLibrary/index.js';
// Every visitor text is a field, ported from the Litora HubL module (faq-accordion.module/fields.json).
// The defaults are the English page (content/webinar-en-us.json).
import defaults from './defaults.json';

export const fields = (
  <ModuleFields>
    <TextField label="Heading" name="heading" required default={defaults.heading} />
    <NoWrapTerm defaultValue={defaults.noWrapTerm} />
    <TextField label="Intro" name="intro" default={defaults.intro} />
    <TextField
      label="Section anchor"
      name="anchorId"
      inlineHelpText="Links reach the questions with # in front, such as #faq. A second question section on the page needs another one."
      default={defaults.anchorId}
    />
    <FieldGroup
      label="Timeline"
      name="timeline"
      inlineHelpText="The steps drawn as a line beside the questions, each with where its date comes from."
    >
      <TextField label="Legend" name="legend" default={defaults.timeline.legend} />
      <RepeatedFieldGroup
        label="Steps"
        name="items"
        occurrence={{ min: 1, max: 6, sorting_label_field: 'timeline.items.title' }}
        default={defaults.timeline.items}
      >
        <TextField label="Title" name="title" />
        <TextField label="Text" name="text" />
        <TextField label="Source of the date" name="trace" inlineHelpText="Such as set by law." />
      </RepeatedFieldGroup>
    </FieldGroup>
    <RepeatedFieldGroup
      label="Questions"
      name="items"
      inlineHelpText="The first one opens with the page; opening another closes it."
      occurrence={{ min: 1, max: 20, sorting_label_field: 'items.question' }}
      default={defaults.items}
    >
      <TextField label="Question" name="question" />
      <RepeatedFieldGroup
        label="Answer paragraphs"
        name="answer"
        inlineHelpText="Start with the fact, such as Yes. or No., then explain."
        occurrence={{ min: 1, max: 6 }}
      >
        <TextField label="Text" name="text" />
        <TextField label="List items" name="list" occurrence={{ min: 0, max: 10 }} />
      </RepeatedFieldGroup>
    </RepeatedFieldGroup>
    <SectionStyle defaultBackground={defaults.style.background} />
  </ModuleFields>
);
