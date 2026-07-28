export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-brand-ink text-gray-300">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">        <p>© {year} Nahuel del Sur SPA — Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
