import { Island, getPortalID } from '@hubspot/cms-components';
// @ts-expect-error -- the ?island import is not typed
import RegisterFormIsland from './islands/RegisterForm.js?island';
import heroEventIcon from './assets/hero-event.svg';
import { LogoMark } from '../../shared/LogoMark.js';
import { hubfsSrcset } from '../../utils/images.js';
import { withNoWrap } from '../../utils/text.js';
import type { HeroEventProps } from './types.js';
import './hero-event.css';
import './form-card.css';

// Event hero: photo, schedule and the sign up form. Same markup and classes as the Litora HubL module, so the section
// CSS and motion.js (data-hero, data-hero-image, data-hero-runway) work unchanged. Only the form is an island.
export function Component({ fieldValues }: HeroEventProps) {
  const { eyebrow, heading, noWrapTerm, details, timeBlock, bodyText, image, imageTall, form, links, global } = fieldValues;
  const { header } = global;

  return (
    <section className="section_hero-event theme-inverse" data-hero>
      <div className="hero_layout">
        <div className="hero_media">
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet={hubfsSrcset(imageTall.src, [750, 1534]) ?? imageTall.src}
              sizes="100vw"
              width={imageTall.width}
              height={imageTall.height}
            />
            <img
              className="hero_image"
              src={image.src}
              srcSet={hubfsSrcset(image.src, [960, 1440, 1920])}
              sizes="100vw"
              width={image.width}
              height={image.height}
              alt={image.alt}
              fetchPriority="high"
              data-hero-image
            />
          </picture>
        </div>
        <div className="hero_panel">
          <div className="hero_top-banner">
            <a className="logo_component" href={links.self}>
              <LogoMark />
              <span className="logo_text">{header.logoText}</span>
            </a>
            <ul className="language-switch_list" role="list">
              <li>
                <span className="language-switch_link is-current" aria-current="true">
                  {header.languageCurrent}
                </span>
              </li>
              <li>
                <a className="language-switch_link" href={links.alternate} hrefLang={links.alternateLang}>
                  <span aria-hidden="true">{header.languageOther}</span>
                  <span className="visually-hidden">{header.languageOtherLabel}</span>
                </a>
              </li>
            </ul>
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
