import { ModuleFields, TextField, ImageField, ChoiceField } from '@hubspot/cms-components/fields';
// Every visitor text is a field, ported from the Litora HubL module (project-reveal.module/fields.json, by
// scripts/port-fields.mjs). The defaults are the English page (content/webinar-en-us.json).
import defaults from './defaults.json';

export const fields = (
  <ModuleFields>
    <TextField label="Term kept on one line" name="noWrapTerm" inlineHelpText="Wherever this term appears in a heading, it never breaks across two lines." default={defaults.noWrapTerm} />
    <TextField label="Label Text" name="labelText" default={defaults.labelText} />
    <TextField label="Word" name="word" default={defaults.word} />
    <TextField label="Name Text" name="nameText" default={defaults.nameText} />
    <TextField label="Text" name="text" default={defaults.text} />
    <TextField label="Caption" name="caption" default={defaults.caption} />
    <TextField label="Button Label" name="buttonLabel" default={defaults.buttonLabel} />
    <TextField label="Button Target" name="buttonTarget" default={defaults.buttonTarget} />
    <ImageField label="Image" name="image" resizable={false} responsive showLoading={false} default={defaults.image} />
    <ImageField label="Image, phone crop" name="imageTall" inlineHelpText="The crop shown on phones (767 px and narrower)." resizable={false} responsive showLoading={false} default={defaults.imageTall} />
    <ChoiceField label="Section colour" name="background" inlineHelpText="Colours come from the theme settings." display="select" choices={[['primary', 'Light'], ['secondary', 'Light alternate'], ['inverse', 'Dark']]} default={defaults.background} />
  </ModuleFields>
);
