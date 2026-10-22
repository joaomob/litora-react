import { ModuleFields } from '@hubspot/cms-components/fields';
import { ButtonContent, HeaderText, PageLinks } from '../../fieldLibrary/index.js';
// Every visitor text is a field, ported from the Litora HubL module (site-header.module/fields.json).
// The defaults are the English page (content/webinar-en-us.json).
import defaults from './defaults.json';

export const fields = (
  <ModuleFields>
    <ButtonContent
      labelName="ctaLabel"
      targetName="ctaTarget"
      defaults={{ label: defaults.ctaLabel, target: defaults.ctaTarget }}
    />
    <PageLinks defaults={defaults.links} />
    <HeaderText defaults={defaults.global.header} />
  </ModuleFields>
);
