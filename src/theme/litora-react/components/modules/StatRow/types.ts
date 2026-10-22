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
    background: 'primary' | 'secondary' | 'inverse';
  };
};
