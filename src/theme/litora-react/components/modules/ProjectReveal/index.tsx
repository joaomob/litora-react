import projectRevealIcon from './assets/project-reveal.svg';
import { ArtDirectedPhoto } from '../../shared/Photo.js';
import { Button } from '../../shared/Button.js';
import { InlineStyle } from '../../utils/inline-style.js';
import { backgroundClass } from '../../utils/background.js';
import { withNoWrap } from '../../utils/text.js';
import type { ProjectRevealProps } from './types.js';
import projectRevealCss from './project-reveal.css?inline';

// The project photo opening through a circle as the page scrolls (data-project-*, js/motion.js). Same markup and
// classes as the Litora HubL module.
export function Component({ fieldValues }: ProjectRevealProps) {
  const { noWrapTerm, labelText, word, nameText, text, caption, buttonLabel, buttonTarget, image, imageTall, background } = fieldValues;
  return (
    <>
      <InlineStyle sheet={projectRevealCss} />
      <section className={`section_project-reveal ${backgroundClass(background)}`}>
        <div className="padding-global padding-section-large">
          <div className="container-large">
            <div className="project-reveal_header">
              <div className="project-reveal_intro" data-reveal>
                <p className="text-style-eyebrow text-color-secondary">{labelText}</p>
                <p className="text-size-large">{text}</p>
              </div>
              <div className="project-reveal_action" data-reveal>
                <Button label={buttonLabel} href={buttonTarget} secondary />
              </div>
            </div>
            <div className="project-reveal_track" id="project" data-project-track>
              <figure className="project-reveal_figure" data-project-figure>
                <div className="project-reveal_frame">
                  <div className="project-reveal_ring" aria-hidden="true" data-project-ring></div>
                  <div className="project-reveal_media" data-project-media>
                    <ArtDirectedPhoto
                      image={image}
                      imageTall={imageTall}
                      tallMedia="(max-width: 479px)"
                      tallWidths={[480, 864]}
                      wideWidths={[960, 1280, 1920]}
                      srcWidth={1280}
                      sizes="(min-width: 1440px) 80rem, 100vw"
                      className="project-reveal_image"
                    />
                    <div className="project-reveal_veil" aria-hidden="true"></div>
                  </div>
                  <h2 className="project-reveal_title">
                    <span className="visually-hidden">{withNoWrap(nameText, noWrapTerm)}</span>
                    <span className="project-reveal_word text-style-display-large" aria-hidden="true" data-project-word>
                      {withNoWrap(word, noWrapTerm)}
                    </span>
                  </h2>
                </div>
                <figcaption className="project-reveal_caption text-size-small text-color-secondary">{caption}</figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export { fields } from './fields.js';

export const meta = {
  label: 'Project photo opening through a circle',
  content_types: ['SITE_PAGE', 'LANDING_PAGE'],
  icon: projectRevealIcon,
  categories: ['body_content'],
};

export const defaultModuleConfig = {
  moduleName: 'litora-react/components/modules/ProjectReveal',
  version: 0,
  themeModule: true,
};
