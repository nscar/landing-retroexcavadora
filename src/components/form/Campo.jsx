export function Campo({
  id,
  name,
  label,
  type = 'text',
  inputMode,
  autoComplete,
  value,
  onChange,
  error,
  required = false,
  min,
}) {
  const describedBy = error ? `${id}-error` : undefined;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-semibold text-brand-ink">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        required={required}
        min={min}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={`min-h-[48px] rounded-md border bg-white px-3 py-2 text-body text-brand-ink focus:outline-none focus:ring-4 focus:ring-brand ${
          error ? 'border-danger' : 'border-gray-300'
        }`}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
