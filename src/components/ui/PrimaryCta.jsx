import { Icon } from './Icon.jsx';

export function PrimaryCta({ children, onClick, type = 'button', ariaLabel }) {
  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-md bg-brand px-6 py-3 text-base font-bold text-brand-ink shadow-sm transition hover:brightness-95 focus-visible:ring-4 focus-visible:ring-brand focus-visible:ring-offset-2"
    >
      {children}
      <Icon name="arrow" className="w-5 h-5" />
    </button>
  );
}
