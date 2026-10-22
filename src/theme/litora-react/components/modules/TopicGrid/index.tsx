import topicGridIcon from './assets/topic-grid.svg';
import { InlineStyle } from '../../utils/inline-style.js';
import { backgroundClass } from '../../utils/background.js';
import { resizedSrc } from '../../utils/images.js';
import { withNoWrap } from '../../utils/text.js';
import type { TopicGridProps } from './types.js';
import topicGridCss from './topic-grid.css?inline';

// Topic rows with a number and a thumbnail that turns as the row comes in (data-line, data-topic-image, js/motion.js).
// Same markup and classes as the Litora HubL module; the thumbnail is one file, so it goes through HubSpot's resizer.
export function Component({ fieldValues }: TopicGridProps) {
  const { heading, noWrapTerm, intro, items, style } = fieldValues;
  return (
    <>
      <InlineStyle sheet={topicGridCss} />
      <section
        className={`section_topic-grid ${backgroundClass(style.background)}`}
        id="topics"
        data-nav-theme="inverse"
      >
        <div className="padding-global padding-section-medium">
          <div className="container-large">
            <div className="topic-grid_header" data-reveal>
              <div className="topic-grid_heading">
                <h2>{withNoWrap(heading, noWrapTerm)}</h2>
                {intro && <p className="text-size-large text-color-secondary">{intro}</p>}
              </div>
            </div>
            <ol className="topic-grid_list" role="list">
              {items.map((item, i) => (
                <li className="topic-row_component" key={i}>
                  <span className="topic-row_line is-bleed" aria-hidden="true" data-line></span>
                  <span className="topic-row_number heading-style-h3" aria-hidden="true" data-reveal>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="topic-row_title" data-reveal>
                    {withNoWrap(item.heading, noWrapTerm)}
                  </h3>
                  <p className="topic-row_text text-color-secondary" data-reveal>
                    {item.text}
                  </p>
                  <div className="topic-row_media">
                    <img
                      className="topic-row_image"
                      data-topic-image
                      src={resizedSrc(item.image, 280)}
                      width={item.image.width}
                      height={item.image.height}
                      alt={item.image.alt}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}

export { fields } from './fields.js';

export const meta = {
  label: 'Topic rows with number and thumbnail',
  content_types: ['SITE_PAGE', 'LANDING_PAGE'],
  icon: topicGridIcon,
  categories: ['body_content'],
};

export const defaultModuleConfig = {
  moduleName: 'litora-react/components/modules/TopicGrid',
  version: 0,
  themeModule: true,
};
