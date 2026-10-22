import { Fragment } from 'react';

// Keeps a term on one line inside a text (the HubL theme replaces "EB-5" with a span.text-style-nowrap)
export function withNoWrap(text: string, term: string) {
  if (!term || !text.includes(term)) return text;
  const parts = text.split(term);
  return parts.map((part, i) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 && <span className="text-style-nowrap">{term}</span>}
    </Fragment>
  ));
}
