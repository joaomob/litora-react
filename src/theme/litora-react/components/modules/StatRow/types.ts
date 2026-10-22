import type { Background } from '../../utils/background.js';
export type StatRowProps = {
  fieldValues: {
    heading: string;
    noWrapTerm: string;
    items: {
      value: string;
      caption: string;
    }[];
    source: string;
    cost: {
      heading: string;
      rows: {
        labelText: string;
        values: {
          amount: string;
          when: string;
        }[];
      }[];
      note: string;
    };
    style: { background: Background };
  };
};
