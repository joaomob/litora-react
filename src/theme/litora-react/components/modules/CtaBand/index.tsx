import ctaBandIcon from './assets/cta-band.svg';
import { Button } from '../../shared/Button.js';
import { ArtDirectedPhoto } from '../../shared/Photo.js';
import { InlineStyle } from '../../utils/inline-style.js';
import { withNoWrap } from '../../utils/text.js';
import type { CtaBandProps } from './types.js';
import ctaBandCss from './cta-band.css?inline';

// The final call over a photo that moves with the scroll (data-cta, js/motion.js). Same markup and classes as the
// Litora HubL module.
export function Component({ fieldValues }: CtaBandProps) {
  const { heading, noWrapTerm, text, buttonLabel, buttonTarget, image, imageTall } = fieldValues;
  return (
    <>
      <InlineStyle sheet={ctaBandCss} />
      <section className="section_cta-band" id="cta" data-cta data-nav-theme="inverse">
        <div className="cta-band_background">
          <ArtDirectedPhoto
            image={image}
            imageTall={imageTall}
            tallMedia="(max-width: 767px)"
            tallWidths={[488, 824]}
            wideWidths={[1280, 1920]}
            srcWidth={1280}
            sizes="100vw"
            className="cta-band_image"
            dataAttribute="data-cta-image"
          />
          <div className="cta-band_veil" aria-hidden="true"></div>
        </div>
        <div className="padding-global padding-section-small">
          <div className="container-large">
            <div className="cta-band_layout">
              <div className="cta-band_top">
                <p className="cta-band_text text-size-large" data-reveal>
                  {text}
                </p>
                <div className="cta-band_action" data-reveal>
                  <Button label={buttonLabel} href={buttonTarget} />
                </div>
              </div>
              <h2 className="cta-band_heading" data-reveal>
                {withNoWrap(heading, noWrapTerm)}
              </h2>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export { fields } from './fields.js';

export const meta = {
  label: 'Final call over a photo',
  content_types: ['SITE_PAGE', 'LANDING_PAGE'],
  icon: ctaBandIcon,
  categories: ['body_content'],
};

export const defaultModuleConfig = {
  moduleName: 'litora-react/components/modules/CtaBand',
  version: 0,
  themeModule: true,
};
