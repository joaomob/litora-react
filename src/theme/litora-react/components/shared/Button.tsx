// The button of the Litora system: the label twice, the copy slides in on hover (system.css, .button_text-wrap)
type ButtonProps = { label: string; href: string; secondary?: boolean; download?: string };

export function Button({ label, href, secondary, download }: ButtonProps) {
  return (
    <a className={secondary ? 'button is-secondary' : 'button'} href={href} download={download}>
      <span className="button_text-wrap">
        <span className="button_text">{label}</span>
        <span className="button_text is-clone" aria-hidden="true">
          {label}
        </span>
      </span>
    </a>
  );
}
