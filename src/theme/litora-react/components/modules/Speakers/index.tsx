import speakersIcon from './assets/speakers.svg';
import { InlineStyle } from '../../utils/inline-style.js';
import { backgroundClass } from '../../utils/background.js';
import { hubfsSrcset, resizedSrc } from '../../utils/images.js';
import { withNoWrap } from '../../utils/text.js';
import type { SpeakersProps } from './types.js';
import speakersCss from './speakers.css?inline';

// Speaker photo cards (photo-card_* in system.css), name and role over the photo. Same markup and classes as the
// Litora HubL module.
export function Component({ fieldValues }: SpeakersProps) {
  const { heading, noWrapTerm, note, items, style } = fieldValues;
  return (
    <>
      <InlineStyle sheet={speakersCss} />
      <section className={`section_speakers ${backgroundClass(style.background)}`} id="speakers">
        <div className="padding-global padding-section-medium">
          <div className="container-large">
            <div className="speakers_layout">
              <div className="speakers_header" data-reveal>
                <h2>{withNoWrap(heading, noWrapTerm)}</h2>
                {note && <p className="text-size-small text-color-secondary">{note}</p>}
              </div>
              <ul className="speakers_list" role="list">
                {items.map((item, i) => (
                  <li className="speakers_item" data-reveal key={i}>
                    <div className="photo-card_component">
                      <img
                        className="photo-card_media is-focus-top"
                        src={resizedSrc(item.image, 840)}
                        srcSet={hubfsSrcset(item.image.src, [420, 840])}
                        sizes="(min-width: 992px) 26rem, (min-width: 768px) 50vw, 27rem"
                        width={item.image.width}
                        height={item.image.height}
                        alt={item.image.alt}
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="photo-card_veil">
                        <h3>{withNoWrap(item.nameText, noWrapTerm)}</h3>
                        <p className="text-style-eyebrow">{item.role}</p>
                      </div>
                    </div>
                    <p className="photo-card_text">{item.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export { fields } from './fields.js';

export const meta = {
  label: 'Speaker photo cards',
  content_types: ['SITE_PAGE', 'LANDING_PAGE'],
  icon: speakersIcon,
  categories: ['body_content'],
};

export const defaultModuleConfig = {
  moduleName: 'litora-react/components/modules/Speakers',
  version: 0,
  themeModule: true,
};
