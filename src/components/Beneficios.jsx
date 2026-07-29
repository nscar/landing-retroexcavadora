import { SectionHeader } from './ui/SectionHeader.jsx';
import { Icon } from './ui/Icon.jsx';

const items = [
  { titulo: 'Operador certificado', desc: 'Personal con matrícula al día y experiencia en obra.' },
  { titulo: 'Entrega en 24 h', desc: 'Llevamos la máquina a tu obra en tu zona.' },
  { titulo: 'Combustible incluido', desc: 'Llegas, arrancas, devuelves. Sin cargos extra.' },
  { titulo: 'Tarifa plana', desc: 'Precio cerrado por jornada. Sin sorpresas.' },
];

// Card de beneficio — render estático. Sin tilt 3D, sin rainbow animado,
// sin draw-on ni respiración del ícono. La apariencia vive en
// `.beneficio-card` / `.beneficio-badge` en `index.css`.
function BeneficioCard({ titulo, desc }) {
  return (
    <li className="beneficio-card">
      <span className="beneficio-badge" aria-hidden="true">
        <Icon name="check" className="beneficio-badge__icon" />
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
        <ul className="grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <BeneficioCard key={it.titulo} titulo={it.titulo} desc={it.desc} />
          ))}
        </ul>
      </div>
    </section>
  );
}
