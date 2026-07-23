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
          {/* Borde base tenue (estatico) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-2xl border border-brand/30"
          />
          {/* Haz de luz 1: amarillo, 2.5s, sentido horario, sector 80deg */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 animate-border-beam rounded-2xl"
            style={{
              background:
                'conic-gradient(from var(--angle), transparent 0deg, transparent 280deg, #FACC15 300deg, #FACC15 20deg, transparent 40deg, transparent 360deg)',
              WebkitMask:
                'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              padding: '2px',
            }}
          />
          {/* Haz de luz 2: negro, 3s, sentido antihorario, sector 30deg */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 animate-border-beam-reverse rounded-2xl"
            style={{
              background:
                'conic-gradient(from var(--angle-reverse), transparent 0deg, transparent 165deg, #0A0A0A 195deg, #0A0A0A 215deg, transparent 245deg, transparent 360deg)',
              WebkitMask:
                'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              padding: '2px',
            }}
          />
          <div className="relative">
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
