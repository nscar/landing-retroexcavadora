export function SectionHeader({ kicker, title, subtitle, id }) {
  return (
    <div className="mx-auto max-w-2xl text-center mb-10">
      {kicker && (
        <p className="text-sm font-semibold uppercase tracking-wider text-brand">{kicker}</p>
      )}
      <h2 id={id} className="mt-2 text-3xl font-extrabold tracking-tight text-brand-ink sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-3 text-body text-gray-700">{subtitle}</p>}
    </div>
  );
}
