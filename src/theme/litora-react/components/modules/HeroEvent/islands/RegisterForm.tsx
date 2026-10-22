import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { FormFieldValue, FormValue } from '../types.js';

// The sign up form of the event hero, the React version of src/js/form.js of the Litora HubL theme (flowforge,
// projects/eb5-real-estate): validation written in text next to each field, then a fetch to the HubSpot Forms API v3,
// which takes cross-origin requests without a key. Every text comes from the module fields. While the portal ID or the
// form GUID is empty, the submission is simulated and the visitor goes straight to the thank you page. Before the
// island hydrates, the browser checks the required fields on its own (noValidate only after hydration).

export const ENDPOINT = 'https://api.hsforms.com/submissions/v3/integration/submit/';
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const digits = (value: string) => value.replace(/\D/g, '');
// the country code and the area code: a leading + and 10 to 15 digits (E.164 allows 15)
const validPhone = (value: string) => {
  const n = digits(value).length;
  return /^\s*\+/.test(value) && n >= 10 && n <= 15;
};

export const fieldId = (anchorId: string, propertyName: string) => `${anchorId}-${propertyName.replace(/_/g, '-')}`;

type Errors = Record<string, string>;

function inputOf(form: HTMLFormElement, name: string) {
  return form.elements.namedItem(name) as HTMLInputElement | RadioNodeList | null;
}

function messageFor(field: FormFieldValue, form: HTMLFormElement): string {
  const control = inputOf(form, field.propertyName);
  if (!control) return '';
  if (field.type === 'radio') return (control as RadioNodeList).value ? '' : field.errors.required;
  if (field.type === 'checkbox' || field.type === 'consent')
    return (control as HTMLInputElement).checked ? '' : field.errors.required;
  const value = (control as HTMLInputElement).value.trim();
  if (!value) return field.errors.required;
  if (field.type === 'email' && !EMAIL.test(value)) return field.errors.invalid ?? '';
  if (field.type === 'tel' && !validPhone(value)) return field.errors.invalid ?? '';
  return '';
}

function cookie(name: string) {
  const value = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))?.[1];
  return value ? decodeURIComponent(value) : '';
}

export function payload(fields: FormFieldValue[], form: HTMLFormElement) {
  const data: {
    fields: { name: string; value: string }[];
    context: { pageUri: string; pageName: string; hutk?: string };
    legalConsentOptions?: { consent: { consentToProcess: boolean; text: string } };
  } = { fields: [], context: { pageUri: window.location.href, pageName: document.title } };
  for (const field of fields) {
    const control = inputOf(form, field.propertyName);
    if (!control) continue;
    if (field.type === 'consent') {
      data.legalConsentOptions = {
        consent: { consentToProcess: (control as HTMLInputElement).checked, text: field.labelText },
      };
    } else if (field.type === 'checkbox') {
      data.fields.push({ name: field.propertyName, value: (control as HTMLInputElement).checked ? 'true' : 'false' });
    } else if (field.type === 'radio') {
      if ((control as RadioNodeList).value)
        data.fields.push({ name: field.propertyName, value: (control as RadioNodeList).value });
    } else {
      data.fields.push({ name: field.propertyName, value: (control as HTMLInputElement).value.trim() });
    }
  }
  const hutk = cookie('hubspotutk');
  if (hutk) data.context.hutk = hutk;
  return data;
}

type Props = { form: FormValue; portalId: string };

export default function RegisterForm({ form, portalId }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [hydrated, setHydrated] = useState(false);
  const [tried, setTried] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const { anchorId } = form;

  // the messages of this island replace the bubbles of the browser
  useEffect(() => setHydrated(true), []);

  function check(field: FormFieldValue) {
    const el = formRef.current;
    if (!el) return '';
    const message = messageFor(field, el);
    setErrors((prev) => ({ ...prev, [field.propertyName]: message }));
    return message;
  }

  // after the first attempt, each field checks itself again as the visitor fixes it
  const recheck = (field: FormFieldValue) => () => {
    if (tried) check(field);
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const el = event.currentTarget;
    setTried(true);
    setStatus('');
    const next: Errors = {};
    let firstInvalid: string | null = null;
    for (const field of form.fields) {
      next[field.propertyName] = messageFor(field, el);
      if (next[field.propertyName] && !firstInvalid) firstInvalid = field.propertyName;
    }
    setErrors(next);
    if (firstInvalid) {
      const control = inputOf(el, firstInvalid);
      const target = control instanceof RadioNodeList ? (control[0] as HTMLInputElement) : control;
      target?.focus();
      return;
    }

    const redirect = new URL(form.redirectUrl, window.location.href).href;
    if (!portalId || !form.hubspotFormGuid) {
      window.location.assign(redirect);
      return;
    }

    setBusy(true);
    try {
      const response = await fetch(
        `${ENDPOINT}${encodeURIComponent(portalId)}/${encodeURIComponent(form.hubspotFormGuid)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload(form.fields, el)),
        },
      );
      if (!response.ok) throw new Error(`HubSpot answered ${response.status}`);
      window.location.assign(redirect);
    } catch {
      setStatus(form.submitError);
      setBusy(false);
    }
  }

  return (
    <form
      ref={formRef}
      className="form-card_form"
      method="post"
      action={form.redirectUrl}
      noValidate={hydrated}
      aria-busy={busy || undefined}
      onSubmit={submit}
    >
      <div className="form_component">
        {form.fields.map((field) => {
          const id = fieldId(anchorId, field.propertyName);
          const error = errors[field.propertyName] ?? '';
          const invalid = error ? true : undefined;
          const onChange = recheck(field);

          if (field.type === 'radio') {
            return (
              // ARIA 1.2 takes aria-invalid on a radiogroup and not on a radio, so the group carries the state and points to
              // its error text; the legend still names it
              <fieldset
                className="form_field is-full"
                role="radiogroup"
                aria-invalid={invalid}
                aria-describedby={`${id}-error`}
                key={field.propertyName}
              >
                <legend className="form_label">{field.labelText}</legend>
                <div className="form_options">
                  {(field.options ?? []).map((option) => (
                    <label className="form_check" key={option.value}>
                      <input
                        className="form_check-input is-radio"
                        type="radio"
                        name={field.propertyName}
                        value={option.value}
                        required
                        onChange={onChange}
                      />
                      <span>{option.labelText}</span>
                    </label>
                  ))}
                </div>
                <p className="form_error" id={`${id}-error`}>
                  {error}
                </p>
              </fieldset>
            );
          }

          if (field.type === 'checkbox' || field.type === 'consent') {
            return (
              <div className="form_field is-full" key={field.propertyName}>
                <label className="form_check">
                  <input
                    className="form_check-input"
                    type="checkbox"
                    id={id}
                    name={field.propertyName}
                    value="true"
                    required
                    aria-describedby={`${id}-error`}
                    aria-invalid={invalid}
                    onChange={onChange}
                  />
                  <span>{field.labelText}</span>
                </label>
                {field.linkLabel ? (
                  <p className="form_help">
                    <a href={field.linkUrl}>{field.linkLabel}</a>
                  </p>
                ) : null}
                <p className="form_error" id={`${id}-error`}>
                  {error}
                </p>
              </div>
            );
          }

          return (
            <div className={field.half ? 'form_field' : 'form_field is-full'} key={field.propertyName}>
              <label className="form_label" htmlFor={id}>
                {field.labelText}
              </label>
              <input
                className="form_input"
                id={id}
                name={field.propertyName}
                type={field.type}
                autoComplete={field.autocomplete}
                required
                aria-describedby={field.help ? `${id}-help ${id}-error` : `${id}-error`}
                aria-invalid={invalid}
                onChange={onChange}
              />
              {field.help ? (
                <p className="form_help" id={`${id}-help`}>
                  {field.help}
                </p>
              ) : null}
              <p className="form_error" id={`${id}-error`}>
                {error}
              </p>
            </div>
          );
        })}
        <div className="form_field is-full">
          <button className="button" type="submit" disabled={busy}>
            <span className="button_text-wrap">
              <span className="button_text">{form.submitLabel}</span>
              <span className="button_text is-clone" aria-hidden="true">
                {form.submitLabel}
              </span>
            </span>
          </button>
          <p className="form_help">{form.submitNote}</p>
          <p className="form_error" role="alert">
            {status}
          </p>
        </div>
      </div>
    </form>
  );
}
