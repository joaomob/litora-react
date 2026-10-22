import type { ImageValue } from '../../shared/types.js';

export type SpeakersProps = {
  fieldValues: {
    heading: string;
    noWrapTerm: string;
    note: string;
    items: {
      nameText: string;
      role: string;
      text: string;
      image: ImageValue;
    }[];
    background: 'primary' | 'secondary' | 'inverse';
  };
};
