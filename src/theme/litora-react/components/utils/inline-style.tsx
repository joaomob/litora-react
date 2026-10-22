import { useInlineHeadAsset } from '@hubspot/cms-components';

// A plain CSS import reaches the page as a <link> stylesheet (measured on the draft test page, 22/10/2026), and a
// linked stylesheet was the one render-blocking request left on the phone in the Litora HubL theme. The section CSS of
// the first screen goes into the head as a <style> instead: the module imports its file with Vite's ?inline (a string)
// and hands it to useInlineHeadAsset, the hook HubSpot's styling docs use to put CSS in the head on the server render.
// The hook does nothing outside the server render, so the browser-only render (Storybook) gets the <style> in place.
// Not for modules inside an island: the server and the browser would render different markup.
// The prop is "sheet": HubSpot's build reads a "css" prop as the styled-components css prop and fails.
// The CSS goes in as raw HTML, because React escapes the text of a <style> child (">" of a child selector).
export function InlineStyle({ sheet }: { sheet: string }) {
  const style = <style dangerouslySetInnerHTML={{ __html: sheet }} />;
  useInlineHeadAsset(() => style);
  return import.meta.env?.SSR ? null : style;
}
