import type { ImageValue } from '../../shared/types.js';

export type ProjectRevealProps = {
  fieldValues: {
    noWrapTerm: string;
    labelText: string;
    word: string;
    nameText: string;
    text: string;
    caption: string;
    buttonLabel: string;
    buttonTarget: string;
    image: ImageValue;
    imageTall: ImageValue;
    background: 'primary' | 'secondary' | 'inverse';
  };
};
