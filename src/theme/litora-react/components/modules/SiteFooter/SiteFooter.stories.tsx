import { moduleStates } from '../../shared/storyStates.js';
import { Component, fields } from './index.js';

// The states of every module (shared/storyStates.ts); tests/stories.test.tsx checks this file exports the ones that apply
const states = moduleStates('SiteFooter', Component, fields);

export default {
  title: 'Modules/SiteFooter',
  component: Component,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export const English = states.english;
export const Portuguese = states.portuguese;
export const LongText = states.longText;
export const Dark = states.dark!;
