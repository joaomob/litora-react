import type { Background } from '../../utils/background.js';
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
    style: { background: Background };
  };
};
