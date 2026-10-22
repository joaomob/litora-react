import { Fragment } from 'react';
import projectStackIcon from './assets/project-stack.svg';
import { ArtDirectedPhoto } from '../../shared/Photo.js';
import { InlineStyle } from '../../utils/inline-style.js';
import type { ProjectStackProps } from './types.js';
import projectStackCss from './project-stack.css?inline';

// Full screen photos stacked as the page scrolls (data-stack-*, js/motion.js), each with the index of the stack and a
// caption. Same markup and classes as the Litora HubL module.
export function Component({ fieldValues }: ProjectStackProps) {
  const { labelText, items } = fieldValues;
  return (
    <>
      <InlineStyle sheet={projectStackCss} />
      <section className="section_project-stack" aria-label={labelText} id="inside" data-nav-theme="inverse">
        {items.map((item, i) => (
          <figure className="project-stack_panel" id={`inside-${i + 1}`} data-stack-panel key={i}>
            <ArtDirectedPhoto
              image={item.image}
              imageTall={item.imageTall}
              tallMedia="(max-width: 767px)"
              tallWidths={[480, 709]}
              wideWidths={[1440, 1920, 2560]}
              srcWidth={1280}
              sizes="100vw"
              className="project-stack_image"
              dataAttribute="data-stack-image"
            />
            <div className="project-stack_veil" aria-hidden="true"></div>
            <div className="project-stack_index" aria-hidden="true">
              {items.map((_, j) => (
                <Fragment key={j}>
                  {j > 0 && <span className="project-stack_index-line"></span>}
                  <span className={j === i ? 'project-stack_index-mark is-current' : 'project-stack_index-mark'}></span>
                </Fragment>
              ))}
            </div>
            <figcaption className="project-stack_caption">
              <span className="text-style-eyebrow">{item.labelText}</span>
              <span className="heading-style-h2">{item.nameText}</span>
              <span className="text-style-eyebrow">{item.caption}</span>
            </figcaption>
          </figure>
        ))}
      </section>
    </>
  );
}

export { fields } from './fields.js';

export const meta = {
  label: 'Stacked full screen photos with captions',
  content_types: ['SITE_PAGE', 'LANDING_PAGE'],
  icon: projectStackIcon,
  categories: ['body_content'],
};

export const defaultModuleConfig = {
  moduleName: 'litora-react/components/modules/ProjectStack',
  version: 0,
  themeModule: true,
};
