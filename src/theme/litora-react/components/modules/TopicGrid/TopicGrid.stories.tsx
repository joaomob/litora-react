import { moduleStates } from '../../shared/storyStates.js';
import { Component, fields } from './index.js';

// The states of every module (shared/storyStates.ts); stories.test.ts checks this file exports the ones that apply
const states = moduleStates('TopicGrid', Component, fields);

export default {
  title: 'Modules/TopicGrid',
  component: Component,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export const English = states.english;
export const Portuguese = states.portuguese;
export const LongText = states.longText;
export const FewestItems = states.fewestItems!;
export const MostItems = states.mostItems!;
export const Dark = states.dark!;
