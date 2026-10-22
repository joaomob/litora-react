import type { ImageValue } from '../../shared/types.js';

export type TopicGridProps = {
  fieldValues: {
    heading: string;
    noWrapTerm: string;
    intro: string;
    items: {
      heading: string;
      text: string;
      image: ImageValue;
    }[];
    background: 'primary' | 'secondary' | 'inverse';
  };
};
