import { SectionHeader } from './ui/SectionHeader.jsx';
import { Icon } from './ui/Icon.jsx';
import { useTilt } from '../hooks/useTilt.js';

const items = [
  { titulo: 'Operador certificado', desc: 'Personal con matrícula al día y experiencia en obra.' },
  { titulo: 'Entrega en 24 h', desc: 'Llevamos la máquina a tu obra en tu zona.' },
  { titulo: 'Combustible incluido', desc: 'Llegas, arrancas, devuelves. Sin cargos extra.' },
  { titulo: 'Tarifa plana', desc: 'Precio cerrado por jornada. Sin sorpresas.' },
];

// Sub-componente para poder usar useTilt dentro de un .map().
function BeneficioCard({ titulo, desc }) {
  const tiltRef = useTilt({ maxAngle: 6, scale: 1.03 });
  return (
    <li
      ref={tiltRef}
      className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand text-brand-ink">
        <Icon name="check" className="h-5 w-5" />
      </span>
      <h3 className="text-lg font-bold text-brand-ink">{titulo}</h3>
      <p className="text-body text-gray-700">{desc}</p>
    </li>
  );
}

export function Beneficios() {
  return (
    <section
      id="beneficios"
      aria-labelledby="beneficios-title"
      className="bg-gray-50 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          kicker="Por qué elegirnos"
          title="Beneficios"
          id="beneficios-title"
        />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <BeneficioCard key={it.titulo} titulo={it.titulo} desc={it.desc} />
          ))}
        </ul>
      </div>
    </section>
  );
}
