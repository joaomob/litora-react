import statRowIcon from './assets/stat-row.svg';
import { InlineStyle } from '../../utils/inline-style.js';
import { backgroundClass } from '../../utils/background.js';
import { withNoWrap } from '../../utils/text.js';
import type { StatRowProps } from './types.js';
import statRowCss from './stat-row.css?inline';

// The program numbers on a ruler that draws itself (data-ruler, js/motion.js) and the cost table. Same markup and
// classes as the Litora HubL module.
export function Component({ fieldValues }: StatRowProps) {
  const { heading, noWrapTerm, items, source, cost, background } = fieldValues;
  return (
    <>
      <InlineStyle sheet={statRowCss} />
      <section className={`section_stat-row ${backgroundClass(background)}`} id="numbers" data-nav-theme="inverse">
        <div className="padding-global padding-section-medium">
          <div className="container-large">
            <div className="section-header_component" data-reveal>
              <h2>{withNoWrap(heading, noWrapTerm)}</h2>
            </div>
            <div className="stat-ruler_component" data-ruler>
              <span className="stat-ruler_line" aria-hidden="true" data-ruler-line></span>
              <span className="stat-ruler_ticks" aria-hidden="true" data-ruler-ticks></span>
              <ul className="stat-ruler_list" role="list">
                {items.map((item, i) => (
                  <li className="stat-ruler_item" key={i}>
                    <span className="stat-ruler_mark" aria-hidden="true"></span>
                    <p className="stat-ruler_value text-style-display-medium" data-reveal>
                      {item.value}
                    </p>
                    <p className="stat-ruler_caption text-color-secondary" data-reveal>
                      {item.caption}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <p className="stat-row_source text-size-small text-color-secondary">{source}</p>
            <div className="stat-row_cost" data-reveal>
              <h3>{withNoWrap(cost.heading, noWrapTerm)}</h3>
              <dl className="cost-list_component">
                {cost.rows.map((row, i) => (
                  <div className="cost-list_row" key={i}>
                    <dt className="cost-list_label">{row.labelText}</dt>
                    {row.values.map((cell, j) => (
                      <dd className="cost-list_value" key={j}>
                        <span className="text-weight-semibold">{cell.amount}</span>
                        {cell.when && <span className="text-color-secondary">{cell.when}</span>}
                      </dd>
                    ))}
                  </div>
                ))}
              </dl>
              <p className="text-size-small text-color-secondary">{cost.note}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export { fields } from './fields.js';

export const meta = {
  label: 'Numbers on a ruler with cost table',
  content_types: ['SITE_PAGE', 'LANDING_PAGE'],
  icon: statRowIcon,
  categories: ['body_content'],
};

export const defaultModuleConfig = {
  moduleName: 'litora-react/components/modules/StatRow',
  version: 0,
  themeModule: true,
};
