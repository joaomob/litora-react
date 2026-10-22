import type { Background } from '../../utils/background.js';
export type FaqAccordionProps = {
  fieldValues: {
    heading: string;
    noWrapTerm: string;
    intro: string;
    timeline: {
      legend: string;
      items: {
        title: string;
        text: string;
        trace: string;
      }[];
    };
    items: {
      question: string;
      answer: {
        text?: string;
        list?: string[];
      }[];
    }[];
    style: { background: Background };
  };
};
