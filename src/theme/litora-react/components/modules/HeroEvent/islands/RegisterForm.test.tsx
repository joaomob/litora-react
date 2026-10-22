import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import RegisterForm, { ENDPOINT } from './RegisterForm.js';
import defaults from '../defaults.json';
import type { FormValue } from '../types.js';

const form = defaults.form as FormValue;
const field = (propertyName: string) => form.fields.find((f) => f.propertyName === propertyName)!;
const submit = () => fireEvent.click(screen.getByRole('button', { name: form.submitLabel }));

function fillValid() {
  fireEvent.change(screen.getByLabelText(field('firstname').labelText), { target: { value: ' Ana ' } });
  fireEvent.change(screen.getByLabelText(field('lastname').labelText), { target: { value: 'Souza' } });
  fireEvent.change(screen.getByLabelText(field('email').labelText), { target: { value: 'ana@example.com' } });
  fireEvent.change(screen.getByLabelText(field('mobilephone').labelText), { target: { value: '+55 11 91234 5678' } });
  fireEvent.change(screen.getByLabelText(field('city').labelText), { target: { value: 'Campinas' } });
  fireEvent.click(screen.getByLabelText(field('residence').options![0].labelText));
  fireEvent.click(screen.getByLabelText(field('eb5_minimum_acknowledged').labelText));
  fireEvent.click(screen.getByLabelText(field('lgpd_consent').labelText));
}

let assign: ReturnType<typeof vi.fn>;

beforeEach(() => {
  assign = vi.fn();
  vi.stubGlobal('location', { ...window.location, href: 'https://litora.joaomob.com/en/eb5-visa-webinar', assign });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('RegisterForm', () => {
  it('shows the required message of every empty field and focuses the first one', () => {
    render(<RegisterForm form={form} portalId="149475007" />);
    submit();
    for (const f of form.fields) expect(screen.getByText(f.errors.required)).toBeInTheDocument();
    expect(screen.getByLabelText(field('firstname').labelText)).toHaveFocus();
    expect(screen.getByLabelText(field('firstname').labelText)).toHaveAttribute('aria-invalid', 'true');
  });

  it('checks the email and the phone format, and clears the message once fixed', () => {
    render(<RegisterForm form={form} portalId="149475007" />);
    fillValid();
    const email = screen.getByLabelText(field('email').labelText);
    const phone = screen.getByLabelText(field('mobilephone').labelText);
    fireEvent.change(email, { target: { value: 'ana@example' } });
    fireEvent.change(phone, { target: { value: '11 91234 5678' } });
    submit();
    expect(screen.getByText(field('email').errors.invalid!)).toBeInTheDocument();
    expect(screen.getByText(field('mobilephone').errors.invalid!)).toBeInTheDocument();
    fireEvent.change(email, { target: { value: 'ana@example.com' } });
    expect(screen.queryByText(field('email').errors.invalid!)).not.toBeInTheDocument();
  });

  it('posts to the Forms API with the fields, the context and the consent, then goes to the thank you page', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);
    render(<RegisterForm form={form} portalId="149475007" />);
    fillValid();
    submit();
    await waitFor(() => expect(assign).toHaveBeenCalled());
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`${ENDPOINT}149475007/${form.hubspotFormGuid}`);
    const body = JSON.parse(init.body);
    expect(body.fields).toEqual([
      { name: 'firstname', value: 'Ana' },
      { name: 'lastname', value: 'Souza' },
      { name: 'email', value: 'ana@example.com' },
      { name: 'mobilephone', value: '+55 11 91234 5678' },
      { name: 'city', value: 'Campinas' },
      { name: 'residence', value: 'brazil' },
      { name: 'eb5_minimum_acknowledged', value: 'true' },
    ]);
    expect(body.legalConsentOptions).toEqual({ consent: { consentToProcess: true, text: field('lgpd_consent').labelText } });
    expect(body.context.pageUri).toBe('https://litora.joaomob.com/en/eb5-visa-webinar');
    expect(assign).toHaveBeenCalledWith(new URL(form.redirectUrl, 'https://litora.joaomob.com/').href);
  });

  it('shows the submit error and enables the button again when HubSpot fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 400 }));
    render(<RegisterForm form={form} portalId="149475007" />);
    fillValid();
    submit();
    expect(await screen.findByText(form.submitError)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: form.submitLabel })).toBeEnabled();
    expect(assign).not.toHaveBeenCalled();
  });

  it('goes straight to the thank you page without a portal ID', () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    render(<RegisterForm form={form} portalId="" />);
    fillValid();
    submit();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(assign).toHaveBeenCalled();
  });
});
