import siteHeaderIcon from './assets/site-header.svg';
import { LanguageSwitch, Logo } from '../../shared/Brand.js';
import { Button } from '../../shared/Button.js';
import { InlineStyle } from '../../utils/inline-style.js';
import type { SiteHeaderProps } from './types.js';
import siteHeaderCss from './site-header.css?inline';

// The fixed header that comes in once the hero leaves the screen (data-site-header, js/motion.js). Hidden in the
// markup, as the HubL module writes it; the button shows only when the page has a call to action.
export function Component({ fieldValues }: SiteHeaderProps) {
  const { ctaLabel, ctaTarget, links, global } = fieldValues;
  const { header } = global;
  return (
    <>
      <InlineStyle sheet={siteHeaderCss} />
      <header className="site-header_component is-hidden" data-site-header>
        <div className="padding-global">
          <div className="container-large">
            <div className="site-header_layout">
              <div className="site-header_languages">
                <LanguageSwitch
                  current={header.languageCurrent}
                  other={header.languageOther}
                  otherLabel={header.languageOtherLabel}
                  alternate={links.alternate}
                  alternateLang={links.alternateLang}
                />
              </div>
              <Logo href={links.self} text={header.logoText} />
              <div className="site-header_action">{ctaLabel && <Button label={ctaLabel} href={ctaTarget} />}</div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export { fields } from './fields.js';

export const meta = {
  label: 'Fixed header with language switch and button',
  content_types: ['SITE_PAGE', 'LANDING_PAGE'],
  icon: siteHeaderIcon,
  categories: ['design'],
};

export const defaultModuleConfig = {
  moduleName: 'litora-react/components/modules/SiteHeader',
  version: 0,
  themeModule: true,
};
