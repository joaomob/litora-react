# Litora React

Litora, a fictional EB-5 brand made for João Marcos's design portfolio, rebuilt as a HubSpot CMS theme in React
(projects platform 2025.2). The same site is live as a HubL theme at https://litora.joaomob.com; this theme copies its
markup, classes and texts, and swaps the modules for React components.

## Structure

- `hsproject.json`, `src/theme/theme-hsmeta.json`: the HubSpot project and its theme component.
- `src/theme/litora-react/`: the theme. `components/modules/<Name>/` holds each React module (`index.tsx`, `fields.tsx`,
  `defaults.json` with the English texts, the section CSS, and `islands/` for the parts that run in the browser);
  `templates/` holds the layout and the page templates; `css/global.css` the tokens and the system classes;
  `js/motion.js` the scroll motion.
- `source/`: tokens, system CSS and fonts of the Litora HubL theme (flowforge, `projects/eb5-real-estate/src`, commit
  8de318c3 of 04/10/2026). `npm run build:css` turns them into `css/global.css`.
- `content/`: the module parameters of each page, read from the HubL templates by `scripts/extract-params.cjs`.
  `npm run build:templates` writes the page templates from them.

## Tools

| Tool | Where | Why |
| --- | --- | --- |
| Node 20 or newer | system | runs everything below |
| `@hubspot/cli` | root `package.json` | `hs project upload`, `hs auth` |
| `@hubspot/cms-components`, `@hubspot/cms-dev-server` | theme `package.json` | React modules, islands, the local dev server and Storybook |
| Vitest, Testing Library, jsdom | root `package.json` | tests of the islands and utilities (`npm test`) |
| gitleaks | system (winget `Gitleaks.Gitleaks`) | secret scan before every commit of a new folder |

React 18 is pinned at the root as well, because the CLI brings React 19 there and the tests must use the theme's version.

## Commands

```bash
npm run install:all   # root and theme dependencies
npm run build         # css/global.css and the page templates
npm test              # Vitest
npm start             # local dev server (theme folder)
npm run upload        # build, checks, tests, then hs project upload
```

The HubSpot account key lives in `~/.hscli/config.yml` (created by `hs account auth`), never in this repository.
