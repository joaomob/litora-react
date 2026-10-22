import statementRevealIcon from './assets/statement-reveal.svg';
import { InlineStyle } from '../../utils/inline-style.js';
import { backgroundClass } from '../../utils/background.js';
import type { StatementRevealProps } from './types.js';
import statementRevealCss from './statement-reveal.css?inline';

// A statement revealed word by word (data-statement, js/motion.js). Same markup and classes as the Litora HubL module.
export function Component({ fieldValues }: StatementRevealProps) {
  const { labelText, text, style } = fieldValues;
  return (
    <>
      <InlineStyle sheet={statementRevealCss} />
      <section className={`section_statement-reveal ${backgroundClass(style.background)}`}>
        <div className="padding-global padding-section-large">
          <div className="container-small">
            <div className="statement-reveal_component">
              <p className="text-style-eyebrow text-color-secondary">{labelText}</p>
              <p className="heading-style-h2 text-style-statement" data-statement>
                {text}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export { fields } from './fields.js';

export const meta = {
  label: 'Statement revealed word by word',
  content_types: ['SITE_PAGE', 'LANDING_PAGE'],
  icon: statementRevealIcon,
  categories: ['body_content'],
};

export const defaultModuleConfig = {
  moduleName: 'litora-react/components/modules/StatementReveal',
  version: 0,
  themeModule: true,
};
