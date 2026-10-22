import type { ImageValue } from '../../shared/types.js';

export type AudienceCardsProps = {
  fieldValues: {
    heading: string;
    noWrapTerm: string;
    items: {
      heading: string;
      text: string;
      image: ImageValue;
      focus: string;
    }[];
    background: 'primary' | 'secondary' | 'inverse';
  };
};
