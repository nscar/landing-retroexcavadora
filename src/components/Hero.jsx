import { PrimaryCta } from "./ui/PrimaryCta.jsx";
import { useParallax } from "../hooks/useParallax.js";

// Vite no reescribe rutas absolutas dentro de strings JS, así que una URL
// hardcodeada como "/img/..." apuntaría a la raíz del host
// (https://user.github.io/img/...) y daría 404 al desplegar bajo
// /landing-retroexcavadora/. import.meta.env.BASE_URL respeta la `base`
// de vite.config.js tanto en dev como en build (incluyendo VITE_BASE_PATH
// custom), por lo que los assets se sirven siempre desde el prefijo
// correcto.
const HERO_IMG = `${import.meta.env.BASE_URL}img/hero-backhoe.png`;

export function Hero() {
  const parallaxRef = useParallax(0.45);

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="hero-parallax relative overflow-hidden bg-brand-ink text-white"
    >
      <div
        ref={parallaxRef}
        className="hero-parallax-bg"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.7)), url(" + HERO_IMG + ")",
        }}
      />
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
