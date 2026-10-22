import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Same setup as HubSpot's Elevate theme: tests at the root. The CLI brings React 19 to the root, so React 18 (the
// theme's version) is pinned there too, and dedupe makes the theme files and the testing library share that one copy.
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts', './src/theme/litora-react/vitest.environment.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    // Processed by Vite, so the fields library uses the deduplicated React instead of the theme folder copy
    server: { deps: { inline: ['@hubspot/cms-components', '@hubspot/cms-dev-server'] } },
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
});
