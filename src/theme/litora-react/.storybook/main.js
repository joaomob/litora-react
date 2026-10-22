// The Storybook config of the HubSpot dev server with two changes for Windows:
//   - the stories glob relative to this folder (the dev server builds it as an absolute C:\...\**\*.stories.* path,
//     which Storybook reads as a relative one and finds nothing);
//   - no preview head script (its bare import fails in the browser; preview.js sets the same config instead).
// It also sends /hubfs to the published Litora, because the image defaults are paths of the site's file manager.
// Everything else (the island plugin, the React dedupe) is theirs.
import hubspot from '../node_modules/@hubspot/cms-dev-server/dist/storybook-main/main.js';

const SITE = 'https://litora.joaomob.com';

export default {
  ...hubspot,
  stories: ['../components/**/*.stories.@(js|jsx|ts|tsx)'],
  previewHead: (head) => head,
  viteFinal: async (config) => {
    const merged = await hubspot.viteFinal(config);
    return { ...merged, server: { ...merged.server, proxy: { '/hubfs': { target: SITE, changeOrigin: true } } } };
  },
};
