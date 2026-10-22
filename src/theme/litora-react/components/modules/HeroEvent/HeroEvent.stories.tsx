import { moduleStory } from '@hubspot/cms-dev-server/storybook';
import { Component, fields } from './index.js';
import defaults from './defaults.json';

// Storybook resolves the ?island import to the plain module, so the form is interactive here. Without a portal ID in
// the preview, a valid form goes straight to the thank you page and nothing reaches HubSpot.
// moduleStory takes each field default as an argument but steps into a repeated group and loses the default of the
// group, so the three repeated groups get theirs here (an argument named after the group replaces the nested ones).
// moduleStory types fieldValues as a loose record, so the typed component goes in as its parameter type (through
// unknown, since TypeScript sees no overlap between the record and the module's own field types).
type StoryComponent = Parameters<typeof moduleStory>[0];
export default {
  title: 'Modules/HeroEvent',
  component: Component,
  parameters: { layout: 'fullscreen' },
};

export const Default = moduleStory(Component as unknown as StoryComponent, fields, {
  details: defaults.details,
  'timeBlock.rows': defaults.timeBlock.rows,
  'form.fields': defaults.form.fields,
});
