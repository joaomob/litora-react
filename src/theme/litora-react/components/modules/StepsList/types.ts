export type StepsListProps = {
  fieldValues: {
    heading: string;
    noWrapTerm: string;
    intro: string;
    items: {
      text: string;
    }[];
    background: 'primary' | 'secondary' | 'inverse';
  };
};
