import { hubfsSrcset, resizedSrc } from './images.js';

describe('hubfsSrcset', () => {
  it('points each width to its own file for the theme photos', () => {
    const src = 'https://149475007.fs1.hubspotusercontent-eu1.net/hubfs/149475007/litora/images/hero/hero-wide-1920.webp';
    expect(hubfsSrcset(src, [960, 1440, 1920])).toBe(
      '/hubfs/litora/images/hero/hero-wide-960.webp 960w, /hubfs/litora/images/hero/hero-wide-1440.webp 1440w, /hubfs/litora/images/hero/hero-wide-1920.webp 1920w',
    );
  });

  it('uses the HubSpot resizer for any other photo', () => {
    const src = 'https://149475007.fs1.hubspotusercontent-eu1.net/hubfs/149475007/uploads/photo.jpg';
    expect(hubfsSrcset(src, [750, 1534])).toBe('/hs-fs/hubfs/uploads/photo.jpg?width=750 750w, /hs-fs/hubfs/uploads/photo.jpg?width=1534 1534w');
  });

  it('gives nothing for a photo outside File Manager', () => {
    expect(hubfsSrcset('https://example.com/photo.jpg', [960])).toBeUndefined();
  });
});

describe('resizedSrc', () => {
  it('goes through the resizer on the site domain, as resize_image_url does', () => {
    const image = { src: 'https://149475007.fs1.hubspotusercontent-eu1.net/hubfs/149475007/litora/images/project/aerial-wide-1920.webp', width: 1920, height: 1080 };
    expect(resizedSrc(image, 1280)).toBe('/hs-fs/hubfs/litora/images/project/aerial-wide-1920.webp?width=1280&height=720&name=aerial-wide-1920.webp');
  });

  it('keeps a photo outside File Manager', () => {
    expect(resizedSrc({ src: 'https://example.com/photo.jpg', width: 800, height: 600 }, 400)).toBe('https://example.com/photo.jpg');
  });
});
