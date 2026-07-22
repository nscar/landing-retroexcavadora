import { PrimaryCta } from "./ui/PrimaryCta.jsx";

const HERO_IMG = "/img/hero-backhoe.png";

export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-brand-ink text-white"
      style={{
        backgroundImage: "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.7)), url(" + HERO_IMG + ")",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand">
          Alquiler de retroexcavadora
        </p>
        <h1
          id="hero-title"
          className="mt-3 text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl"
        >
          Mueve tierra sin complicarte.
          <span className="block text-brand">Reserva en 60 segundos.</span>
        </h1>
        <p className="mt-5 max-w-xl text-body text-gray-200">
          Servicio profesional con operador, entrega en obra y tarifa plana por jornada.
          Sin letra chica.
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
