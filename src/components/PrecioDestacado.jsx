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
        <div
          id="precio-title"
          className="price-rainbow relative mx-auto max-w-md p-10 text-center shadow-md"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-600">
            Tarifa
          </p>
          <p className="mt-2 text-5xl font-extrabold text-brand-ink">
            $35.000
          </p>
          <p className="mt-1 text-sm text-gray-600">por hora</p>
          <hr className="my-4 border-gray-300" />
          <p className="text-sm text-gray-600">
            Jornada completa (8 h):{" "}
            <span className="font-bold text-brand-ink">$280.000</span>
          </p>
          <p className="mt-2 text-sm text-gray-600">IVA incluido</p>
        </div>
      </div>
    </section>
  );
}
