import { render } from '@testing-library/react';
import axe from 'axe-core';
import type { ComponentType, ReactElement } from 'react';
import { vi } from 'vitest';
import { moduleStates, type ModuleName } from '../shared/storyStates.js';

// Vitest has no HubSpot island plugin, so the ?island import is the plain module and Island renders it in place, the
// way Storybook shows the form (the markup is the one the server renders before the island hydrates)
vi.mock('@hubspot/cms-components', async (original) => ({
  ...(await original<object>()),
  Island: ({ module: Module, ...props }: { module: ComponentType }) => <Module {...props} />,
}));

// The stories are the fixtures: each module renders its English and Portuguese story, the copy of the 10 pages, and
// axe checks the markup (WCAG 2.2 A and AA). Colour contrast needs the CSS and a real layout, which jsdom does not have,
// so it is measured on the published pages (PageSpeed and the browser) and left out here.
type Story = { render: (args: Record<string, unknown>) => ReactElement; args: Record<string, unknown> };
type StoryFile = Record<string, Story | { title: string }>;

const files = import.meta.glob<StoryFile>('../modules/*/*.stories.tsx', { eager: true });
const modules = import.meta.glob<{ Component: unknown; fields: ReactElement }>('../modules/*/index.tsx', {
  eager: true,
});
const EXPORTS = {
  english: 'English',
  portuguese: 'Portuguese',
  longText: 'LongText',
  fewestItems: 'FewestItems',
  mostItems: 'MostItems',
  dark: 'Dark',
};

const cases = Object.entries(files).map(([file, stories]) => {
  const name = file.split('/')[2] as ModuleName;
  return { name, stories, module: modules[`../modules/${name}/index.tsx`]! };
});

describe.each(cases)('$name', ({ name, stories, module }) => {
  it('exports every state that applies to the module', () => {
    const states = moduleStates(name, module.Component, module.fields);
    const expected = Object.entries(states)
      .filter(([, story]) => story)
      .map(([key]) => EXPORTS[key as keyof typeof EXPORTS]);
    const exported = Object.keys(stories).filter((key) => key !== 'default');
    expect(exported.sort()).toEqual(expected.sort());
  });

  it.each(['English', 'Portuguese'])('has no axe violations in %s', async (story) => {
    const { render: renderStory, args } = stories[story] as Story;
    const { container } = render(<main>{renderStory(args)}</main>);
    const result = await axe.run(container, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
      rules: { 'color-contrast': { enabled: false } },
    });
    expect(result.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
  });
});
