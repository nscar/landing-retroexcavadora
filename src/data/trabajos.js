// Metadata de la galería "Trabajos realizados".
//
// Las imágenes viven en `public/img/trabajo-N.jpg` (pre-renombradas a partir
// de los JPEGs de WhatsApp con espacios y paréntesis que rompen URLs).
// Las rutas se construyen con `import.meta.env.BASE_URL` para respetar la
// `base` de Vite tanto en dev como en build (incluyendo VITE_BASE_PATH
// custom, ej. `/landing-retroexcavadora/` en GitHub Pages).
//
// `orientacion` controla la `aspect-ratio` del card para evitar layout
// shift antes de que la imagen cargue. Los alts describen lo que se ve en
// obra (no decorativos) para usuarios de lector de pantalla.

const base = import.meta.env.BASE_URL;

export const trabajos = [
  {
    id: 'trabajo-1',
    src: `${base}img/trabajo-1.jpg`,
    alt: 'Retroexcavadora trabajando en terreno.',
    orientacion: 'horizontal',
  },
  {
    id: 'trabajo-2',
    src: `${base}img/trabajo-2.jpg`,
    alt: 'Vista vertical de la retroexcavadora cavando una zanja para instalación.',
    orientacion: 'vertical', // 719x1280 (9:16)
  },
  {
    id: 'trabajo-5',
    src: `${base}img/trabajo-5.jpg`,
    alt: 'Pala frontal de la retroexcavadora cargando material en un camión.',
    orientacion: 'cuadrada', // 1280x960 (4:3)
  },
  {
    id: 'trabajo-6',
    src: `${base}img/trabajo-6.jpg`,
    alt: 'Retroexcavadora con martillo hidráulico trabajando en demolición.',
    orientacion: 'vertical', // 900x1600 (9:16)
  },
  {
    id: 'trabajo-7',
    src: `${base}img/trabajo-7.jpg`,
    alt: 'Retroexcavadora realizando trabajos de movimiento de tierra.',
    orientacion: 'horizontal',
  },
];
