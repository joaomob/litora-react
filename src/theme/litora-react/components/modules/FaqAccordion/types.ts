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
    background: 'primary' | 'secondary' | 'inverse';
  };
};
