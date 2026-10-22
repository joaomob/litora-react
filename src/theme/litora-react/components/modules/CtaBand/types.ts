import type { ImageValue } from '../../shared/types.js';

export type CtaBandProps = {
  fieldValues: {
    heading: string;
    noWrapTerm: string;
    text: string;
    buttonLabel: string;
    buttonTarget: string;
    image: ImageValue;
    imageTall: ImageValue;
  };
};
