import { Island, getPortalID } from '@hubspot/cms-components';
// @ts-expect-error -- the ?island import is not typed
import RegisterFormIsland from './islands/RegisterForm.js?island';
import heroEventIcon from './assets/hero-event.svg';
import { LanguageSwitch, Logo } from '../../shared/Brand.js';
import { ArtDirectedPhoto } from '../../shared/Photo.js';
import { withNoWrap } from '../../utils/text.js';
import { InlineStyle } from '../../utils/inline-style.js';
import type { HeroEventProps } from './types.js';
import heroEventCss from './hero-event.css?inline';
import formCardCss from './form-card.css?inline';

// Event hero: photo, schedule and the sign up form. Same markup and classes as the Litora HubL module, so the section
// CSS and motion.js (data-hero, data-hero-image, data-hero-runway) work unchanged. Only the form is an island.
export function Component({ fieldValues }: HeroEventProps) {
  const { eyebrow, heading, noWrapTerm, details, timeBlock, bodyText, image, imageTall, form, links, global } = fieldValues;
  const { header } = global;

  return (
    <>
      {/* first screen of the page: its CSS goes in the head (utils/inline-style.tsx) */}
      <InlineStyle sheet={heroEventCss + formCardCss} />
      <section className="section_hero-event theme-inverse" data-hero>
        <div className="hero_layout">
          <div className="hero_media">
            <ArtDirectedPhoto
              image={image}
              imageTall={imageTall}
              tallMedia="(max-width: 767px)"
              tallWidths={[750, 1534]}
              wideWidths={[960, 1440, 1920]}
              srcWidth={1920}
              sizes="100vw"
              className="hero_image"
              firstScreen
              dataAttribute="data-hero-image"
            />
          </div>
          <div className="hero_panel">
            <div className="hero_top-banner">
              <Logo href={links.self} text={header.logoText} />
              <LanguageSwitch
                current={header.languageCurrent}
                other={header.languageOther}
                otherLabel={header.languageOtherLabel}
                alternate={links.alternate}
                alternateLang={links.alternateLang}
              />
            </div>
            <div className="hero_content">
              <p className="text-style-eyebrow text-color-secondary">{eyebrow}</p>
              <h1>{withNoWrap(heading, noWrapTerm)}</h1>
              <div className="hero_details">
                {details.map((detail, i) => (
                  <p className="text-size-large" key={i}>
                    {detail.text}
                  </p>
                ))}
              </div>
              <div className="hero_time-block">
                <time className="hero_time-day" dateTime={timeBlock.date}>
                  <span className="text-style-display-medium text-weight-medium">{timeBlock.day}</span>
                  <span className="text-style-eyebrow">{timeBlock.month}</span>
                </time>
                <ul className="hero_time-list" role="list">
                  {timeBlock.rows.map((row, i) => (
                    <li className="hero_time-row text-size-large" key={i}>
                      {row.datetime ? (
                        <time className="hero_time-hour" dateTime={row.datetime}>
                          {row.time}
                        </time>
                      ) : (
                        <span className="hero_time-hour">{row.time}</span>
                      )}
                      <span>{row.place}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-size-large text-color-secondary">{bodyText}</p>
            </div>
            <div className="form-card_component" id={form.anchorId}>
              <h2 className="heading-style-h3">{withNoWrap(form.heading, noWrapTerm)}</h2>
              <Island module={RegisterFormIsland} hydrateOn="idle" form={form} portalId={String(getPortalID() ?? '')} />
              <p className="form-card_notice text-size-small text-color-secondary">{form.notice}</p>
            </div>
          </div>
          <div className="hero_runway" aria-hidden="true" data-hero-runway></div>
        </div>
      </section>
    </>
  );
}

export { fields } from './fields.js';

export const meta = {
  label: 'Event hero with photo, schedule and sign up form',
  content_types: ['SITE_PAGE', 'LANDING_PAGE'],
  icon: heroEventIcon,
  categories: ['body_content'],
};

export const defaultModuleConfig = {
  moduleName: 'litora-react/components/modules/HeroEvent',
  version: 0,
  themeModule: true,
};
