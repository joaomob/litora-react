import { ChoiceField, FieldGroup } from '@hubspot/cms-components/fields';
import { isBackground } from '../utils/background.js';

// The section colour, on the editor's Style tab as in HubSpot's Elevate theme. It moved there from the top level of
// the module: the alias reads the value the pages saved before the move (HubSpot alias mapping), so no page loses its
// colour. Same default and no "required", as the old field, because the docs ask both fields to match on these.
// The default comes from defaults.json, typed as a plain string, so it is checked here and a wrong one stops the build.
export function SectionStyle({ defaultBackground }: { defaultBackground: string }) {
  if (!isBackground(defaultBackground)) throw new Error(`Section style: unknown background "${defaultBackground}"`);
  return (
    <FieldGroup label="Section style" name="style" tab="STYLE" expanded>
      <ChoiceField
        label="Background"
        name="background"
        inlineHelpText="The three colours are set once in the theme settings, so every section stays on brand."
        display="select"
        choices={[
          ['primary', 'Light'],
          ['secondary', 'Light alternate'],
          ['inverse', 'Dark'],
        ]}
        default={defaultBackground}
        propertyAliasesPaths={{ background: ['background'] }}
      />
    </FieldGroup>
  );
}
