// The preview of the HubSpot dev server (the server render context the modules expect), plus two things it misses:
//   - the environment config the modules read (getPortalID), which the dev server injects with an inline script whose
//     bare import the browser cannot resolve here; set without a portal, so the forms of the preview never reach
//     HubSpot (a valid form goes straight to the thank you page);
//   - the global CSS of the theme in plain CSS, which the layout puts in a <style> on the real page.
import { initConfigSingletonFromJSON } from '@hubspot/cms-components/config';
import '../storybook/global.css';

initConfigSingletonFromJSON({ hsEnv: 'prod', hsDeployed: false, hsJSRGates: [] });

export { default } from '../node_modules/@hubspot/cms-dev-server/dist/storybook-main/preview.js';
