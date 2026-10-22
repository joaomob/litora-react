import type { ImageValue } from '../../shared/types.js';

export type FieldType = 'text' | 'email' | 'tel' | 'radio' | 'checkbox' | 'consent';

export type FormFieldValue = {
  propertyName: string;
  type: FieldType;
  labelText: string;
  autocomplete?: string;
  half?: boolean;
  errors: { required: string; invalid?: string };
  help?: string;
  options?: { value: string; labelText: string }[];
  linkLabel?: string;
  linkUrl?: string;
};

export type FormValue = {
  anchorId: string;
  heading: string;
  hubspotFormGuid: string;
  fields: FormFieldValue[];
  submitLabel: string;
  submitNote: string;
  notice: string;
  submitError: string;
  redirectUrl: string;
};

export type HeroEventProps = {
  fieldValues: {
    eyebrow: string;
    heading: string;
    noWrapTerm: string;
    details: { text: string }[];
    timeBlock: {
      date: string;
      day: string;
      month: string;
      rows: { time: string; datetime?: string; place: string }[];
    };
    bodyText: string;
    image: ImageValue;
    imageTall: ImageValue;
    form: FormValue;
    links: { self: string; alternate: string; alternateLang: string; privacy: string };
    global: {
      header: { logoText: string; languageCurrent: string; languageOther: string; languageOtherLabel: string };
    };
  };
};
