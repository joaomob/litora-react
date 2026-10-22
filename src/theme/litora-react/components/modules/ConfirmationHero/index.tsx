import confirmationHeroIcon from './assets/confirmation-hero.svg';
import { LanguageSwitch, Logo } from '../../shared/Brand.js';
import { Button } from '../../shared/Button.js';
import { ArtDirectedPhoto } from '../../shared/Photo.js';
import { InlineStyle } from '../../utils/inline-style.js';
import { withNoWrap } from '../../utils/text.js';
import type { ConfirmationHeroProps } from './types.js';
import heroEventCss from '../HeroEvent/hero-event.css?inline';

type CalendarEvent = ConfirmationHeroProps['fieldValues']['calendar'];

// The .ics file of the "add to calendar" button, the same text the HubL module writes into the data URL
export function calendarHref({ title, description, startUtc, endUtc }: CalendarEvent): string {
  const ics =
    'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Litora//EB-5 webinar//EN\r\nBEGIN:VEVENT\r\n' +
    `UID:${startUtc}@litora\r\nDTSTAMP:20261002T000000Z\r\nDTSTART:${startUtc}\r\nDTEND:${endUtc}\r\n` +
    `SUMMARY:${title}\r\nDESCRIPTION:${description}\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n`;
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}

// The thank you hero: the event hero without the form, with the schedule and the calendar file. It shares the CSS of
// the event hero (hero_* classes).
export function Component({ fieldValues }: ConfirmationHeroProps) {
  const { heading, noWrapTerm, details, bodyText, timeBlock, calendar, image, imageTall, showCalendar, links, global } =
    fieldValues;
  const { header } = global;
  return (
    <>
      {/* first screen of the page: its CSS goes in the head (utils/inline-style.tsx) */}
      <InlineStyle sheet={heroEventCss} />
      <section className="section_confirmation-hero theme-inverse" data-hero>
        <div className="hero_layout is-static">
          <div className="hero_media">
            <ArtDirectedPhoto
              image={image}
              imageTall={imageTall}
              tallMedia="(max-width: 767px)"
              tallWidths={[750, 1534]}
              wideWidths={[960, 1440, 1920]}
              srcWidth={1280}
              sizes="100vw"
              className="hero_image"
              firstScreen
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
              <h1>{withNoWrap(heading, noWrapTerm)}</h1>
              {details.length > 0 && (
                <div className="hero_details">
                  {details.map((detail, i) => (
                    <p className="text-size-large" key={i}>
                      {detail.text}
                    </p>
                  ))}
                </div>
              )}
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
              {bodyText && <p className="text-size-large text-color-secondary">{bodyText}</p>}
              {showCalendar && (
                <div className="hero_actions">
                  <Button label={calendar.buttonLabel} href={calendarHref(calendar)} download={calendar.fileName} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export { fields } from './fields.js';

export const meta = {
  label: 'Confirmation hero with photo and schedule',
  content_types: ['SITE_PAGE', 'LANDING_PAGE'],
  icon: confirmationHeroIcon,
  categories: ['body_content'],
};

export const defaultModuleConfig = {
  moduleName: 'litora-react/components/modules/ConfirmationHero',
  version: 0,
  themeModule: true,
};
