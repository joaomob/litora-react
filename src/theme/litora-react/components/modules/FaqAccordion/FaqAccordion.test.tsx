import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Component } from './index.js';
import defaults from './defaults.json';
import type { FaqAccordionProps } from './types.js';

const values = defaults as FaqAccordionProps['fieldValues'];
const sections = (container: HTMLElement) => [...container.querySelectorAll('section')];
const groups = (section: Element) =>
  new Set([...section.querySelectorAll('details')].map((d) => d.getAttribute('name')));

describe('FaqAccordion', () => {
  it('keeps the id and the question group of the HubL module by default', () => {
    const { container } = render(<Component fieldValues={values} />);
    const [section] = sections(container);
    expect(section!.id).toBe('faq');
    expect(groups(section!)).toEqual(new Set(['faq']));
  });

  it('gives a second question section its own id and its own open question', () => {
    const { container } = render(
      <>
        <Component fieldValues={values} />
        <Component fieldValues={{ ...values, anchorId: 'costs' }} />
      </>,
    );
    const [first, second] = sections(container);
    expect([first!.id, second!.id]).toEqual(['faq', 'costs']);
    expect(groups(second!)).toEqual(new Set(['costs']));
  });

  it('leaves the id out when the anchor is empty', () => {
    const { container } = render(<Component fieldValues={{ ...values, anchorId: '' }} />);
    expect(sections(container)[0]!.hasAttribute('id')).toBe(false);
  });
});
