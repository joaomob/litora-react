import { moduleStates } from '../../shared/storyStates.js';
import { Component, fields } from './index.js';

// Storybook resolves the ?island import to the plain module, so the form is interactive here. Without a portal ID in
// the preview, a valid form goes straight to the thank you page and nothing reaches HubSpot.
// The states of every module (shared/storyStates.ts); stories.test.ts checks this file exports the ones that apply
const states = moduleStates('HeroEvent', Component, fields);

export default {
  title: 'Modules/HeroEvent',
  component: Component,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export const English = states.english;
export const Portuguese = states.portuguese;
export const LongText = states.longText;
export const FewestItems = states.fewestItems!;
export const MostItems = states.mostItems!;
