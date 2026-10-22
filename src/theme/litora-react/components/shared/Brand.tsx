import { LogoMark } from './LogoMark.js';

// The logo and the language switch, shared by the site header, the top banner of the hero panel and the footer. Their
// CSS is global (source/css/shell.css).
export function Logo({ href, text }: { href: string; text: string }) {
  return (
    <a className="logo_component" href={href}>
      <LogoMark />
      <span className="logo_text">{text}</span>
    </a>
  );
}

type LanguageSwitchProps = {
  current: string;
  other: string;
  otherLabel: string;
  alternate: string;
  alternateLang: string;
};

export function LanguageSwitch({ current, other, otherLabel, alternate, alternateLang }: LanguageSwitchProps) {
  return (
    <ul className="language-switch_list" role="list">
      <li>
        <span className="language-switch_link is-current" aria-current="true">
          {current}
        </span>
      </li>
      <li>
        <a className="language-switch_link" href={alternate} hrefLang={alternateLang}>
          <span aria-hidden="true">{other}</span>
          <span className="visually-hidden">{otherLabel}</span>
        </a>
      </li>
    </ul>
  );
}
