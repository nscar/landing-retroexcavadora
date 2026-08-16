import { PrimaryCta } from "./ui/PrimaryCta.jsx";
import { useCrossfadeSlider } from "../hooks/useCrossfadeSlider.js";
import { useParallax } from "../hooks/useParallax.js";

// Vite no reescribe rutas absolutas dentro de strings JS, así que una URL
// hardcodeada como "/img/..." apuntaría a la raíz del host
// (https://user.github.io/img/...) y daría 404 al desplegar bajo
// /landing-retroexcavadora/. import.meta.env.BASE_URL respeta la `base`
// de vite.config.js tanto en dev como en build (incluyendo VITE_BASE_PATH
// custom), por lo que los assets se sirven siempre desde el prefijo
// correcto.
const BASE = import.meta.env.BASE_URL;

// Slides del fondo del Hero. Mezclamos el asset histórico de la máquina
// con dos fotos de obra, que coinciden con el aspect-ratio de la imagen
// original y evitan recortes agresivos al hacer `object-fit: cover`. El orden
// es estable y se reproduce en cada carga: hero-backhoe → trabajo-1 → trabajo-7.
const HERO_SLIDES = [
  {
    id: "backhoe",
    src: `${BASE}img/hero-backhoe.png`,
    alt: "",
    fetchPriority: "high",
  },
  {
    id: "trabajo-1",
    src: `${BASE}img/trabajo-1.jpg`,
    alt: "",
  },
  {
    id: "trabajo-7",
    src: `${BASE}img/trabajo-7.jpg`,
    alt: "",
  },
];

export function Hero() {
  const { index, setIndex, handlers, count } = useCrossfadeSlider({
    count: HERO_SLIDES.length,
    intervalMs: 6000,
  });
  // Parallax sobre el wrapper interno del slider (no sobre cada slide):
  // desacopla movimiento vertical y cross-fade, exactamente como
  // recomienda el plan (ver §6 — "Mantener el parallax sobre el
  // contenedor, no sobre cada slide").
  const parallaxRef = useParallax(0.45);

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      aria-roledescription="carrusel"
      className="hero-parallax relative overflow-hidden bg-brand-ink text-white"
      tabIndex={-1}
      onKeyDown={handlers.onKeyDown}
      onMouseEnter={handlers.onMouseEnter}
      onMouseLeave={handlers.onMouseLeave}
    >
      {/* Capa slider. .hero-slider fija `inset:0` y contiene las imágenes
          absolutas; .hero-slider__parallax es el wrapper interno que
          recibe el translate3d del hook de parallax. La altura del Hero
          viene del padding de contenido (.py-20 sm:py-28 más abajo), NO
          de las imágenes — eso garantiza CERO CLS antes de que carguen
          los JPEGs. */}
      <div className="hero-slider" aria-live="polite" aria-atomic="false">
        <div ref={parallaxRef} className="hero-slider__parallax">
          {HERO_SLIDES.map((slide, i) => (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${i + 1} de ${HERO_SLIDES.length}`}
              aria-hidden={i !== index}
              className={
                "hero-slider__slide" +
                (i === index ? " hero-slider__slide--active" : "")
              }
            >
              <img
                src={slide.src}
                alt={slide.alt}
                // Primer slide: eager + prioridad alta para que el LCP
                // no espere. Los demás: lazy + async decoding.
                loading={i === 0 ? "eager" : "lazy"}
                decoding={i === 0 ? "sync" : "async"}
                fetchpriority={slide.fetchPriority}
                draggable="false"
              />
            </div>
          ))}
          {/* Veladura oscura sobre TODAS las imágenes: garantiza
              legibilidad del título y CTA sin importar qué foto esté
              activa. Mismo gradiente que el hero original. */}
          <div className="hero-slider__overlay" aria-hidden="true" />
        </div>

        {/* Dots accesibles. tabIndex=0 en cada uno permite foco de
            teclado dentro del slider; ←/→ a nivel contenedor navega
            entre slides sin necesidad de tabular hasta los dots. */}
        <div className="hero-slider__dots" role="tablist" aria-label="Seleccionar slide del hero">
          {HERO_SLIDES.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-controls="hero-slider-track"
              aria-label={`Ir al slide ${i + 1}: ${slide.id}`}
              tabIndex={i === index ? 0 : -1}
              className={
                "hero-slider__dot" +
                (i === index ? " hero-slider__dot--active" : "")
              }
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>

      {/* Contenido. z-10 lo deja por encima del slider (z 0) y del
          overlay (z 1). */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand">
          Nahuel del Sur SPA — Alquiler de retroexcavadora
        </p>
        <h1
          id="hero-title"
          className="mt-3 text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl"
        >
          Mueve tierra sin complicarte.
          <span className="block text-brand">Reserva en 60 segundos.</span>
        </h1>
        <p className="mt-5 max-w-xl text-body text-gray-200">
          Servicio profesional con operador. Retroexcavadora disponible
          con o sin martillo hidráulico, entrega en obra y tarifa plana por
          jornada. Sin letra chica.
        </p>
        <div className="mt-8">
          <PrimaryCta onClick={() => {
            const target = document.getElementById("contacto");
            if (target) target.scrollIntoView({ behavior: "smooth" });
          }}>
            Reservar ahora
          </PrimaryCta>
        </div>
      </div>
    </section>
  );
}
