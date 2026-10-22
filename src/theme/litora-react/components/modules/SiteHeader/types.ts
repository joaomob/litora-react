export type SiteHeaderProps = {
  fieldValues: {
    ctaLabel: string;
    ctaTarget: string;
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
