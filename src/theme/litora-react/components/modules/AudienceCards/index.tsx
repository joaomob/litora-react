import audienceCardsIcon from './assets/audience-cards.svg';
import { InlineStyle } from '../../utils/inline-style.js';
import { backgroundClass } from '../../utils/background.js';
import { hubfsSrcset, resizedSrc } from '../../utils/images.js';
import { withNoWrap } from '../../utils/text.js';
import type { AudienceCardsProps } from './types.js';
import audienceCardsCss from './audience-cards.css?inline';

// Audience photo cards (photo-card_* in system.css). Same markup and classes as the Litora HubL module; the focus of
// each photo is a class (is-focus-top, is-focus-upper).
export function Component({ fieldValues }: AudienceCardsProps) {
  const { heading, noWrapTerm, items, background } = fieldValues;
  return (
    <>
      <InlineStyle sheet={audienceCardsCss} />
      <section className={`section_audience-cards ${backgroundClass(background)}`} id="audience">
        <div className="padding-global padding-section-medium">
          <div className="container-large">
            <div className="section-header_component" data-reveal>
              <h2>{withNoWrap(heading, noWrapTerm)}</h2>
            </div>
            <ul className="audience-cards_list" role="list">
              {items.map((item, i) => (
                <li className="audience-cards_item" data-reveal key={i}>
                  <div className="photo-card_component">
                    <img
                      className={item.focus ? `photo-card_media is-focus-${item.focus}` : 'photo-card_media'}
                      src={resizedSrc(item.image, 840)}
                      srcSet={hubfsSrcset(item.image.src, [420, 840])}
                      sizes="(min-width: 992px) 26rem, (min-width: 768px) 33vw, 100vw"
                      width={item.image.width}
                      height={item.image.height}
                      alt={item.image.alt}
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="photo-card_veil">
                      <h3>{withNoWrap(item.heading, noWrapTerm)}</h3>
                    </div>
                  </div>
                  <p className="photo-card_text">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

export { fields } from './fields.js';

export const meta = {
  label: 'Audience photo cards',
  content_types: ['SITE_PAGE', 'LANDING_PAGE'],
  icon: audienceCardsIcon,
  categories: ['body_content'],
};

export const defaultModuleConfig = {
  moduleName: 'litora-react/components/modules/AudienceCards',
  version: 0,
  themeModule: true,
};
