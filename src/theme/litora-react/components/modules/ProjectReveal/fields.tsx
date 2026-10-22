import { ModuleFields, TextField } from '@hubspot/cms-components/fields';
import { ButtonContent, NoWrapTerm, PhotoWithPhoneCrop, SectionStyle } from '../../fieldLibrary/index.js';
// Every visitor text is a field, ported from the Litora HubL module (project-reveal.module/fields.json).
// The defaults are the English page (content/webinar-en-us.json).
import defaults from './defaults.json';

export const fields = (
  <ModuleFields>
    <NoWrapTerm defaultValue={defaults.noWrapTerm} />
    <TextField
      label="Eyebrow"
      name="labelText"
      inlineHelpText="The short line above the large word."
      default={defaults.labelText}
    />
    <TextField
      label="Large word"
      name="word"
      inlineHelpText="One word, drawn across the section. Long words shrink to fit."
      required
      default={defaults.word}
    />
    <TextField label="Project name" name="nameText" default={defaults.nameText} />
    <TextField label="Text" name="text" default={defaults.text} />
    <TextField label="Photo caption" name="caption" default={defaults.caption} />
    <ButtonContent
      labelName="buttonLabel"
      targetName="buttonTarget"
      defaults={{ label: defaults.buttonLabel, target: defaults.buttonTarget }}
    />
    <PhotoWithPhoneCrop defaults={defaults} />
    <SectionStyle defaultBackground={defaults.style.background} />
  </ModuleFields>
);
