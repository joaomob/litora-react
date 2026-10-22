import { useLanguageVariants, type LanguageVariant } from '@hubspot/cms-components';

export type PageLinksValue = { self: string; alternate: string; alternateLang: string; privacy?: string };

// The path of an address, as the page links store it (localizedUrl comes absolute)
const toPath = (url: string) => new URL(url, 'https://localhost').pathname;

// Links of the page from the variants HubSpot keeps for it: the active one is this page, the other one the language
// switch. The pages are in two languages, so anything other than two variants (no translation yet, the local server,
// Storybook) keeps the paths typed in the module fields.
export function linksFromVariants<T extends PageLinksValue>(links: T, variants: LanguageVariant[]): T {
  const [active, ...moreActive] = variants.filter((v) => v.isActive);
  const [other, ...moreOthers] = variants.filter((v) => !v.isActive);
  if (!active || !other || moreActive.length || moreOthers.length) return links;
  return {
    ...links,
    self: toPath(active.localizedUrl),
    alternate: toPath(other.localizedUrl),
    alternateLang: other.languageCode,
  };
}

export function usePageLinks<T extends PageLinksValue>(links: T): T {
  return linksFromVariants(links, useLanguageVariants());
}
