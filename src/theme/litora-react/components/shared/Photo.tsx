import type { ImageValue } from './types.js';
import { hubfsSrcset, resizedSrc } from '../utils/images.js';

// React 18 knows no fetchPriority prop (it warns and writes the attribute as is); the lowercase HTML attribute goes
// through untouched. React 19 takes fetchPriority.
const FIRST_SCREEN = { fetchpriority: 'high' } as Record<string, string>;
const BELOW_THE_FOLD = { loading: 'lazy', decoding: 'async' } as const;

type ArtDirectedPhotoProps = {
  image: ImageValue;
  imageTall: ImageValue;
  // the media query of the tall crop and the widths of each file, as the HubL module writes them
  tallMedia: string;
  tallWidths: number[];
  wideWidths: number[];
  // the width of the src, the photo of a browser that reads no srcset
  srcWidth: number;
  sizes: string;
  className: string;
  // the photo of the first screen loads first and never lazily
  firstScreen?: boolean;
  // the data attribute motion.js finds the photo by
  dataAttribute?: string;
};

// A wide photo with a tall crop for the phone, the <picture> of the Litora HubL modules
export function ArtDirectedPhoto(props: ArtDirectedPhotoProps) {
  const {
    image,
    imageTall,
    tallMedia,
    tallWidths,
    wideWidths,
    srcWidth,
    sizes,
    className,
    firstScreen,
    dataAttribute,
  } = props;
  return (
    <picture>
      <source
        media={tallMedia}
        srcSet={hubfsSrcset(imageTall.src, tallWidths) ?? imageTall.src}
        sizes="100vw"
        width={imageTall.width}
        height={imageTall.height}
      />
      <img
        className={className}
        src={resizedSrc(image, srcWidth)}
        srcSet={hubfsSrcset(image.src, wideWidths)}
        sizes={sizes}
        width={image.width}
        height={image.height}
        alt={image.alt}
        {...(firstScreen ? FIRST_SCREEN : BELOW_THE_FOLD)}
        {...(dataAttribute ? { [dataAttribute]: '' } : {})}
      />
    </picture>
  );
}
