import type { FooterBackground } from '../../utils/background.js';
export type SiteFooterProps = {
  fieldValues: {
    fictionalNotice: string;
    style: { background: FooterBackground };
    links: {
      self: string;
      alternate: string;
      alternateLang: string;
      privacy: string;
    };
    global: {
      header: {
        logoText: string;
      };
      footer: {
        about: string;
        legalNoticeTitle: string;
        legalNotice: string;
        privacyLabel: string;
        languageLinkLabel: string;
      };
    };
  };
};
