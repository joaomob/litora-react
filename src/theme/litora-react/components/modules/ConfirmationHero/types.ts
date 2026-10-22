import type { ImageValue } from '../../shared/types.js';

export type ConfirmationHeroProps = {
  fieldValues: {
    heading: string;
    noWrapTerm: string;
    details: {
      text: string;
    }[];
    bodyText: string;
    timeBlock: {
      date: string;
      day: string;
      month: string;
      rows: {
        time: string;
        datetime?: string;
        place: string;
      }[];
    };
    calendar: {
      buttonLabel: string;
      fileName: string;
      title: string;
      description: string;
      startUtc: string;
      endUtc: string;
    };
    image: ImageValue;
    imageTall: ImageValue;
    showCalendar: boolean;
    links: {
      self: string;
      alternate: string;
      alternateLang: string;
    };
    global: {
      header: {
        logoText: string;
        languageCurrent: string;
        languageOther: string;
        languageOtherLabel: string;
      };
    };
  };
};
