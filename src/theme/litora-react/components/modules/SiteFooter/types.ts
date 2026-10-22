export type SiteFooterProps = {
  fieldValues: {
    fictionalNotice: string;
    background: 'primary' | 'secondary' | 'inverse';
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
