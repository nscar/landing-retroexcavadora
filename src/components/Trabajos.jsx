import { useRef, useState } from 'react';
import { SectionHeader } from './ui/SectionHeader.jsx';
import { Lightbox } from './ui/Lightbox.jsx';
import { trabajos as TRABAJOS } from '../data/trabajos.js';

// Mapa de orientación -> aspect-ratio inline. Usado para reservar el alto
// del card antes de que la imagen llegue (evita layout shift y CLS).
const ASPECT_BY_ORIENT = {
  horizontal: 'aspect-[16/9]',
  vertical: 'aspect-[9/16]',
  cuadrada: 'aspect-[4/3]',
};

function TrabajoCard({ item, index, onOpen }) {
  return (
    <li className="trabajo-card">
      <button
        type="button"
        onClick={() => onOpen(index)}
        aria-label={`Ampliar: ${item.alt}`}
        className="trabajo-card__button"
      >
        <div className={`trabajo-card__media ${ASPECT_BY_ORIENT[item.orientacion] || 'aspect-[4/3]'}`}>
          <img
            src={item.src}
            alt={item.alt}
            loading="lazy"
            decoding="async"
            className="trabajo-card__img"
          />
        </div>
      </button>
    </li>
  );
}

export function Trabajos() {
  // `lightboxIndex` es null cuando el lightbox está cerrado. Cada card pasa
  // su índice al abrir; el lightbox hace wrap-around con los helpers del
  // propio componente.
  const [lightboxIndex, setLightboxIndex] = useState(null);

  return (
    <section
      id="trabajos"
      aria-labelledby="trabajos-title"
      className="bg-brand-paper py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          kicker="Trabajos realizados"
          title="Lo que hemos hecho en obra"
          subtitle="Una muestra de los últimos trabajos con nuestra retroexcavadora. Toca cualquier imagen para verla en detalle."
          id="trabajos-title"
        />

        {/*
          Grid responsive:
            - móvil (<sm):  1 columna
            - sm..md:       2 columnas
            - lg:           3 columnas
            - xl:           4 columnas
          Como mezclamos orientaciones (16:9 / 9:16 / 4:3), dejamos que
          cada card conserve la altura natural de su aspect-ratio vía
          `align-self: start` en `.trabajo-card`. Sin eso, el grid estira
          las cards a la altura de la fila (la vertical más alta) y las
          horizontales/cuadradas quedan flotando con huecos arriba/abajo.
        */}
        <ul className="trabajos-grid">
          {TRABAJOS.map((item, i) => (
            <TrabajoCard
              key={item.id}
              item={item}
              index={i}
              onOpen={setLightboxIndex}
            />
          ))}
        </ul>
      </div>

      <Lightbox
        items={TRABAJOS}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={setLightboxIndex}
      />
    </section>
  );
}
