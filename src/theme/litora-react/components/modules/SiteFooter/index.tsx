import siteFooterIcon from './assets/site-footer.svg';
import { Logo } from '../../shared/Brand.js';
import { InlineStyle } from '../../utils/inline-style.js';
import { backgroundClass } from '../../utils/background.js';
import type { SiteFooterProps } from './types.js';
import siteFooterCss from './site-footer.css?inline';

// The footer: the brand, the notice that the company is fictional, the privacy and language links and the legal
// notice. Same markup and classes as the Litora HubL module.
export function Component({ fieldValues }: SiteFooterProps) {
  const { fictionalNotice, style, links, global } = fieldValues;
  const { header, footer } = global;
  return (
    <>
      <InlineStyle sheet={siteFooterCss} />
      <footer className={`site-footer_component ${backgroundClass(style.background)}`}>
        <div className="padding-global">
          <div className="container-large">
            <div className="site-footer_top">
              <div className="site-footer_brand" data-reveal>
                <Logo href={links.self} text={header.logoText} />
                <p className="text-size-large">{footer.about}</p>
                <p className="text-size-small text-color-secondary">{fictionalNotice}</p>
              </div>
              <span className="site-footer_divider" aria-hidden="true"></span>
              <ul className="site-footer_links" role="list" data-reveal>
                <li>
                  <a className="site-footer_link" href={links.privacy}>
                    {footer.privacyLabel}
                  </a>
                </li>
                <li>
                  <a
                    className="site-footer_link"
                    href={links.alternate}
                    hrefLang={links.alternateLang}
                    lang={links.alternateLang}
                  >
                    {footer.languageLinkLabel}
                  </a>
                </li>
              </ul>
            </div>
            <div className="site-footer_bottom">
              <p className="text-size-small text-color-secondary">
                <strong>{footer.legalNoticeTitle}</strong> {footer.legalNotice}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export { fields } from './fields.js';

export const meta = {
  label: 'Footer with legal notice and links',
  content_types: ['SITE_PAGE', 'LANDING_PAGE'],
  icon: siteFooterIcon,
  categories: ['design'],
};

export const defaultModuleConfig = {
  moduleName: 'litora-react/components/modules/SiteFooter',
  version: 0,
  themeModule: true,
};
