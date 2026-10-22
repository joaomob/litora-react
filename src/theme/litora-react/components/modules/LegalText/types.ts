import type { Background } from '../../utils/background.js';
export type LegalTextProps = {
  fieldValues: {
    heading: string;
    noWrapTerm: string;
    updated: string;
    paragraphs: {
      text: string;
    }[];
    style: { background: Background };
  };
};
