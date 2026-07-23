import { SectionHeader } from "./ui/SectionHeader.jsx";

export function PrecioDestacado() {
  return (
    <section
      id="precio"
      aria-labelledby="precio-title"
      className="bg-brand-paper py-16 sm:py-20"
    >
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeader
          kicker="Tarifa"
          title="Precio destacado"
          subtitle="Un precio único, sin sorpresas. Incluye operador y combustible."
        />
        <div className="relative mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-md">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 animate-border-beam rounded-2xl"
            style={{
              background:
                'conic-gradient(from var(--angle), #FACC15 0deg, transparent 60deg, transparent 300deg, #FACC15 360deg)',
              WebkitMask:
                'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              padding: '2px',
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 animate-border-beam-reverse rounded-2xl"
            style={{
              background:
                'conic-gradient(from var(--angle-reverse), #0A0A0A 0deg, transparent 90deg, transparent 270deg, #0A0A0A 360deg)',
              WebkitMask:
                'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              padding: '4px',
            }}
          />
          <div className="relative rounded-2xl bg-white">
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-600">
              Por jornada (8 h)
            </p>
            <p id="precio-title" className="mt-2 text-5xl font-extrabold text-brand-ink">
              $120.000
            </p>
            <p className="mt-2 text-sm text-gray-600">IVA incluido · CABA y GBA</p>
          </div>
        </div>
      </div>
    </section>
  );
}
