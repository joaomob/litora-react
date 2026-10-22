import stepsListIcon from './assets/steps-list.svg';
import { InlineStyle } from '../../utils/inline-style.js';
import { backgroundClass } from '../../utils/background.js';
import { withNoWrap } from '../../utils/text.js';
import type { StepsListProps } from './types.js';
import stepsListCss from './steps-list.css?inline';

// Numbered steps on the rows of the topic grid without the thumbnail (topic-row_component is-no-media). Same markup
// and classes as the Litora HubL module.
export function Component({ fieldValues }: StepsListProps) {
  const { heading, noWrapTerm, intro, items, style } = fieldValues;
  return (
    <>
      <InlineStyle sheet={stepsListCss} />
      <section className={`section_steps-list ${backgroundClass(style.background)}`}>
        <div className="padding-global padding-section-small">
          <div className="container-large">
            <div className="section-header_component" data-reveal>
              <h2>{withNoWrap(heading, noWrapTerm)}</h2>
              {intro && <p className="text-size-large text-color-secondary">{intro}</p>}
            </div>
            <ol className="steps-list_list" role="list">
              {items.map((item, i) => (
                <li className="topic-row_component is-no-media" key={i}>
                  <span className="topic-row_line" aria-hidden="true" data-line></span>
                  <span className="heading-style-h3" aria-hidden="true" data-reveal>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="steps-list_text text-size-large" data-reveal>
                    {item.text}
                  </p>
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
  label: 'Numbered steps list',
  content_types: ['SITE_PAGE', 'LANDING_PAGE'],
  icon: stepsListIcon,
  categories: ['body_content'],
};

export const defaultModuleConfig = {
  moduleName: 'litora-react/components/modules/StepsList',
  version: 0,
  themeModule: true,
};
