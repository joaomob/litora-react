// Lint for the theme code: TypeScript, React, hooks and jsx-a11y (accessibility caught while writing, before axe in the tests)
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';

export default tseslint.config(
  // Generated or copied: src/theme/litora-react/js is source/js minified; scripts/guards is the flowforge copy
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/storybook-static/**',
      'src/theme/litora-react/js/**',
      'scripts/guards/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { react, 'react-hooks': reactHooks, 'jsx-a11y': jsxA11y },
    languageOptions: { globals: { ...globals.browser } },
    settings: { react: { version: '18.3' } },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.strict.rules,
      'react/prop-types': 'off',
      // role="list" stays on styled lists: Safari drops the list role when list-style is none
      'jsx-a11y/no-redundant-roles': ['error', { ul: ['list'], ol: ['list'] }],
    },
  },
  {
    files: [
      'scripts/**/*.{js,cjs,mjs}',
      'source/js/**/*.js',
      '*.{js,mjs,ts}',
      'src/theme/litora-react/.storybook/**/*.js',
    ],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
);
