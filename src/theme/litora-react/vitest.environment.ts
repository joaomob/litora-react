import { initConfigSingletonFromJSON } from '@hubspot/cms-components/config';

// The environment config the modules read (getPortalID), set as the Storybook preview sets it: no portal, so no form
// of a test reaches HubSpot. It lives in the theme folder, where @hubspot/cms-components is installed.
initConfigSingletonFromJSON({ hsEnv: 'prod', hsDeployed: false, hsJSRGates: [] });
