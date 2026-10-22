export type LegalTextProps = {
  fieldValues: {
    heading: string;
    noWrapTerm: string;
    updated: string;
    paragraphs: {
      text: string;
    }[];
    background: 'primary' | 'secondary' | 'inverse';
  };
};
