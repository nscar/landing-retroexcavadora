export function SubmitButton({ children, disabled = false }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="inline-flex min-h-[56px] w-full items-center justify-center rounded-md bg-brand px-6 py-3 text-base font-bold text-brand-ink shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:ring-4 focus-visible:ring-brand focus-visible:ring-offset-2"
    >
      {children}
    </button>
  );
}
