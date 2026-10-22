import { TextField } from '@hubspot/cms-components/fields';

// The text and the target of a button. The names differ between modules (ctaLabel in the header), so each module
// passes the names its pages already store.
export function ButtonContent({
  labelName,
  targetName,
  defaults,
}: {
  labelName: string;
  targetName: string;
  defaults: { label: string; target: string };
}) {
  return (
    <>
      <TextField
        label="Button text"
        name={labelName}
        inlineHelpText="The action and where it leads, in up to four words."
        default={defaults.label}
      />
      <TextField
        label="Button link"
        name={targetName}
        inlineHelpText="A section of this page, such as #register, or a page path."
        default={defaults.target}
      />
    </>
  );
}
