import { FieldGroup, RepeatedFieldGroup, TextField } from '@hubspot/cms-components/fields';

type TimeBlockDefaults = {
  date: string;
  day: string;
  month: string;
  rows: { time: string; datetime: string; place: string }[];
};

// The date card: day and month in large type, then one line per city or session
export function TimeBlock({ defaults }: { defaults: TimeBlockDefaults }) {
  return (
    <FieldGroup label="Date card" name="timeBlock">
      <TextField
        label="Date"
        name="date"
        inlineHelpText="As YYYY-MM-DD. Browsers and search engines read it."
        default={defaults.date}
      />
      <TextField label="Day, as shown" name="day" default={defaults.day} />
      <TextField label="Month, as shown" name="month" inlineHelpText="Short, such as Nov." default={defaults.month} />
      <RepeatedFieldGroup
        label="Times"
        name="rows"
        occurrence={{ min: 1, max: 3, sorting_label_field: 'timeBlock.rows.place' }}
        default={defaults.rows}
      >
        <TextField label="Time, as shown" name="time" inlineHelpText="Such as 8 p.m." />
        <TextField
          label="Time, for browsers"
          name="datetime"
          inlineHelpText="With the time zone, as 2026-11-12T20:00-03:00."
        />
        <TextField label="City" name="place" />
      </RepeatedFieldGroup>
    </FieldGroup>
  );
}
