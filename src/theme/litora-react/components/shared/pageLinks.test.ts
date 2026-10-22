import { describe, expect, it } from 'vitest';
import { linksFromVariants } from './pageLinks.js';

const fieldLinks = {
  self: '/en/eb5-visa-webinar',
  alternate: '/webinar-visto-eb5',
  alternateLang: 'pt-BR',
  privacy: '/en/privacy',
};
const variant = (languageCode: string, localizedUrl: string, isActive: boolean) => ({
  languageDisplayName: { HYBRID: '', LOCALIZED: '', PAGELANG: '' },
  languageCode,
  localizedUrl,
  isActive,
});

describe('linksFromVariants', () => {
  it('takes this page and the language switch from the two variants', () => {
    const links = linksFromVariants(fieldLinks, [
      variant('pt-br', 'https://litora.joaomob.com/react/webinar-visto-eb5', false),
      variant('en', 'https://litora.joaomob.com/en/react/eb5-visa-webinar', true),
    ]);
    expect(links).toEqual({
      self: '/en/react/eb5-visa-webinar',
      alternate: '/react/webinar-visto-eb5',
      alternateLang: 'pt-br',
      privacy: '/en/privacy',
    });
  });

  it('keeps the field paths without a translation', () => {
    expect(linksFromVariants(fieldLinks, [])).toBe(fieldLinks);
    expect(linksFromVariants(fieldLinks, [variant('en', 'https://litora.joaomob.com/en/react/x', true)])).toBe(
      fieldLinks,
    );
  });
});
