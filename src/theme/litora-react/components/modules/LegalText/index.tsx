import legalTextIcon from './assets/legal-text.svg';
import { InlineStyle } from '../../utils/inline-style.js';
import { backgroundClass } from '../../utils/background.js';
import { withNoWrap } from '../../utils/text.js';
import type { LegalTextProps } from './types.js';
import legalTextCss from './legal-text.css?inline';

// The body of the privacy policy: the page heading, the date of the last update and the paragraphs. Same markup and
// classes as the Litora HubL module.
export function Component({ fieldValues }: LegalTextProps) {
  const { heading, noWrapTerm, updated, paragraphs, style } = fieldValues;
  return (
    <>
      <InlineStyle sheet={legalTextCss} />
      <section className={`section_legal-text ${backgroundClass(style.background)}`}>
        <div className="padding-global padding-section-small">
          <div className="container-small">
            <div className="legal-text_content">
              <h1>{withNoWrap(heading, noWrapTerm)}</h1>
              <p className="text-size-small text-color-secondary">{updated}</p>
              {paragraphs.map((paragraph, i) => (
                <p className="legal-text_paragraph" key={i}>
                  {paragraph.text}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export { fields } from './fields.js';

export const meta = {
  label: 'Legal text page body',
  content_types: ['SITE_PAGE', 'LANDING_PAGE'],
  icon: legalTextIcon,
  categories: ['body_content'],
};

export const defaultModuleConfig = {
  moduleName: 'litora-react/components/modules/LegalText',
  version: 0,
  themeModule: true,
};
