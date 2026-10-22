import { describe, expect, it } from 'vitest';
import { calendarHref } from './index.js';

describe('calendarHref', () => {
  it('writes the event into a data URL that decodes back to the .ics text', () => {
    const href = calendarHref({
      buttonLabel: 'Add to calendar',
      fileName: 'litora-webinar.ics',
      title: 'Litora EB-5 webinar',
      description: 'Online, link by email',
      startUtc: '20261105T220000Z',
      endUtc: '20261105T230000Z',
    });
    expect(href.startsWith('data:text/calendar;charset=utf-8,')).toBe(true);
    const ics = decodeURIComponent(href.slice('data:text/calendar;charset=utf-8,'.length));
    expect(ics).toContain('\r\nUID:20261105T220000Z@litora\r\n');
    expect(ics).toContain('\r\nDTEND:20261105T230000Z\r\n');
    expect(ics).toContain('\r\nSUMMARY:Litora EB-5 webinar\r\n');
    expect(ics.endsWith('END:VEVENT\r\nEND:VCALENDAR\r\n')).toBe(true);
  });
});
