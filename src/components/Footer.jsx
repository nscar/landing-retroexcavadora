const LOGO_WEBP = `${import.meta.env.BASE_URL}img/logotipo1.webp`;
const LOGO_PNG = `${import.meta.env.BASE_URL}img/logotipo1.png`;

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-brand-ink text-gray-300">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
        <picture className="flex-shrink-0">
          <source srcSet={LOGO_WEBP} type="image/webp" />
          <img
            src={LOGO_PNG}
            alt="Nahuel del Sur SPA"
            width="360"
            height="360"
            loading="lazy"
            decoding="async"
            className="h-auto w-20 opacity-90 hover:opacity-100 transition-opacity"
          />
        </picture>
        <p>© {year} Nahuel del Sur SPA — Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
