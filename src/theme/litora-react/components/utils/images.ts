// The srcset of a photo in File Manager, as the Litora HubL theme writes it (modules/hero-event.module/module.html):
// the theme photos under litora/images/ were uploaded in each width, named <name>-<width>.<ext>, so each width is its
// own file; any other photo goes through HubSpot's resizer (/hs-fs/hubfs/...?width=).
const HUBFS_PATH = /\/hubfs\/\d+\/(.+)$/;
const THEME_FOLDER = '/litora/images/';

export function hubfsSrcset(src: string, widths: number[]): string | undefined {
  const match = HUBFS_PATH.exec(src);
  if (!match) return undefined;
  const filePath = match[1];
  const largest = Math.max(...widths);
  if (src.includes(THEME_FOLDER)) {
    return widths.map((w) => `/hubfs/${filePath.replace(`-${largest}.`, `-${w}.`)} ${w}w`).join(', ');
  }
  return widths.map((w) => `/hs-fs/hubfs/${filePath}?width=${w} ${w}w`).join(', ');
}

// The src of a photo, as HubL's resize_image_url writes it: HubSpot's resizer on the site's domain, with the height kept
// in proportion. Any photo outside File Manager stays as it is.
export function resizedSrc(image: { src: string; width: number; height: number }, width: number): string {
  const match = HUBFS_PATH.exec(image.src);
  if (!match) return image.src;
  const filePath = match[1];
  const height = Math.round((width * image.height) / image.width);
  return `/hs-fs/hubfs/${filePath}?width=${width}&height=${height}&name=${filePath.split('/').pop()}`;
}
