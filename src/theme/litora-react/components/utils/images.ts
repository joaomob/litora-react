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
