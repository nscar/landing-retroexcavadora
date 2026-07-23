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
          {/* Haz de luz 1: amarillo con fade por alpha, sector 120deg */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 animate-border-beam rounded-2xl"
            style={{
              background:
                'conic-gradient(from var(--angle), rgba(250,204,21,0) 0deg, rgba(250,204,21,0) 230deg, rgba(250,204,21,0.4) 250deg, rgba(250,204,21,0.85) 268deg, #FACC15 285deg, #FACC15 75deg, rgba(250,204,21,0.85) 92deg, rgba(250,204,21,0.4) 110deg, rgba(250,204,21,0) 130deg, rgba(250,204,21,0) 360deg)',
              WebkitMask:
                'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              padding: '2px',
            }}
          />
          {/* Haz de luz 2: negro con fade por alpha, sector 50deg */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 animate-border-beam-reverse rounded-2xl"
            style={{
              background:
                'conic-gradient(from var(--angle-reverse), rgba(10,10,10,0) 0deg, rgba(10,10,10,0) 155deg, rgba(10,10,10,0.5) 170deg, rgba(10,10,10,0.85) 182deg, #0A0A0A 195deg, #0A0A0A 215deg, rgba(10,10,10,0.85) 228deg, rgba(10,10,10,0.5) 240deg, rgba(10,10,10,0) 255deg, rgba(10,10,10,0) 360deg)',
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
