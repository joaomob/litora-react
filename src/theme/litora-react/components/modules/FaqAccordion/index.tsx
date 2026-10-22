import faqAccordionIcon from './assets/faq-accordion.svg';
import { InlineStyle } from '../../utils/inline-style.js';
import { backgroundClass } from '../../utils/background.js';
import { withNoWrap } from '../../utils/text.js';
import type { FaqAccordionProps } from './types.js';
import faqAccordionCss from './faq-accordion.css?inline';

// The questions, one open at a time (details name="faq", the first one open), beside a timeline of the capital that
// draws itself (data-timeline, js/motion.js). Same markup and classes as the Litora HubL module.
export function Component({ fieldValues }: FaqAccordionProps) {
  const { heading, noWrapTerm, intro, timeline, items, background } = fieldValues;
  const lastMilestone = timeline.items.length - 1;
  return (
    <>
      <InlineStyle sheet={faqAccordionCss} />
      <section className={`section_faq-accordion ${backgroundClass(background)}`} id="faq">
        <div className="padding-global padding-section-medium">
          <div className="container-large">
            <span className="faq-accordion_line" aria-hidden="true" data-line></span>
            <div className="faq-accordion_layout">
              <div className="faq-accordion_header" data-reveal>
                <h2>{withNoWrap(heading, noWrapTerm)}</h2>
                {intro && <p className="faq-accordion_intro">{intro}</p>}
                <div className="faq_timeline">
                  <ol className="faq_timeline-list" role="list" data-timeline>
                    {timeline.items.map((milestone, i) => (
                      <li className="faq_timeline-item" key={i}>
                        <span
                          className={`faq_timeline-trace${i > 0 ? ' is-dashed' : ''}${i === lastMilestone ? ' is-open' : ''}`}
                          aria-hidden="true"
                          data-timeline-trace={i > 0 ? 'dashed' : 'solid'}
                        ></span>
                        {i !== lastMilestone && <span className="faq_timeline-point" aria-hidden="true"></span>}
                        <span className="heading-style-h3">{milestone.title}</span>
                        <p>
                          {milestone.text}
                          {milestone.trace && (
                            <>
                              {' '}
                              <span className="visually-hidden">({milestone.trace})</span>
                            </>
                          )}
                        </p>
                      </li>
                    ))}
                  </ol>
                  <p className="text-size-small text-color-secondary">{timeline.legend}</p>
                </div>
              </div>
              <div className="faq-accordion_list">
                {items.map((item, i) => (
                  <details className="faq_item" name="faq" open={i === 0} data-reveal key={i}>
                    <summary className="faq_question">
                      <h3>{withNoWrap(item.question, noWrapTerm)}</h3>
                      <svg
                        className="faq_icon"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          d="M5 15.5 12 8.5 19 15.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </summary>
                    <div className="faq_answer">
                      {item.answer.map((paragraph, j) =>
                        paragraph.list && paragraph.list.length ? (
                          <ul className="faq_answer-list" key={j}>
                            {paragraph.list.map((entry, k) => (
                              <li key={k}>{entry}</li>
                            ))}
                          </ul>
                        ) : (
                          <p key={j}>{paragraph.text}</p>
                        ),
                      )}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export { fields } from './fields.js';

export const meta = {
  label: 'Questions with a capital timeline',
  content_types: ['SITE_PAGE', 'LANDING_PAGE'],
  icon: faqAccordionIcon,
  categories: ['body_content'],
};

export const defaultModuleConfig = {
  moduleName: 'litora-react/components/modules/FaqAccordion',
  version: 0,
  themeModule: true,
};
