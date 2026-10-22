// The section colour of a module, as the Litora HubL modules map their "background" choice to a class
const BACKGROUND_CLASS = {
  primary: 'background-color-primary',
  secondary: 'background-color-secondary',
  inverse: 'theme-inverse',
};

export type Background = keyof typeof BACKGROUND_CLASS;

export const isBackground = (value: string): value is Background => Object.hasOwn(BACKGROUND_CLASS, value);

export const backgroundClass = (background: Background) => BACKGROUND_CLASS[background] ?? '';
