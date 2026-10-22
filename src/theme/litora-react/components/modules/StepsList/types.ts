import type { Background } from '../../utils/background.js';
export type StepsListProps = {
  fieldValues: {
    heading: string;
    noWrapTerm: string;
    intro: string;
    items: {
      text: string;
    }[];
    style: { background: Background };
  };
};
