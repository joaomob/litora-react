import { ImageField } from '@hubspot/cms-components/fields';
import type { ComponentProps } from 'react';

type ImageDefault = ComponentProps<typeof ImageField>['default'];
// Same image options as each module had: the sections drawn after the first screen ask HubSpot for the responsive
// image; the hero, on the first screen, does not
type Options = { responsive?: boolean; defaults?: { image?: ImageDefault; imageTall?: ImageDefault } };

const ALT_HELP = 'Describe what the photo shows in the alt text. Leave it empty only when the photo is decoration.';

const imageOptions = (responsive: boolean) => (responsive ? { responsive: true, showLoading: false } : {});

// One photo. resizable is off because the size comes from the file widths in the srcset.
export function Photo({ responsive = true, defaults }: Options) {
  return (
    <ImageField
      label="Image"
      name="image"
      inlineHelpText={ALT_HELP}
      resizable={false}
      {...imageOptions(responsive)}
      default={defaults?.image}
    />
  );
}

// A photo with its own crop for phones
export function PhotoWithPhoneCrop({ responsive = true, defaults }: Options) {
  return (
    <>
      <Photo responsive={responsive} defaults={defaults} />
      <ImageField
        label="Image, phone crop"
        name="imageTall"
        inlineHelpText="The crop shown on phones (767 px and narrower). Same alt text as the image."
        resizable={false}
        {...imageOptions(responsive)}
        default={defaults?.imageTall}
      />
    </>
  );
}
