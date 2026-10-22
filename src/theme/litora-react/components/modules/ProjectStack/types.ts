import type { ImageValue } from '../../shared/types.js';

export type ProjectStackProps = {
  fieldValues: {
    labelText: string;
    items: {
      labelText: string;
      nameText: string;
      caption: string;
      image: ImageValue;
      imageTall: ImageValue;
    }[];
  };
};
