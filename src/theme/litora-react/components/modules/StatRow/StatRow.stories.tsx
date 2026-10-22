import { moduleStory } from '@hubspot/cms-dev-server/storybook';
import { Component, fields } from './index.js';
import defaults from './defaults.json';

// The repeated groups get their defaults here, as in HeroEvent.stories.tsx (moduleStory loses the default of a group).
type StoryComponent = Parameters<typeof moduleStory>[0];
export default {
  title: 'Modules/StatRow',
  component: Component,
  parameters: { layout: 'fullscreen' },
};

export const Default = moduleStory(Component as unknown as StoryComponent, fields, {
  items: defaults.items,
  'cost.rows': defaults.cost.rows,
});
