export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-brand-ink text-gray-300">
      <div className="mx-auto max-w-6xl px-6 py-8 text-sm">
        <p>© {year} Retroexcavadora — Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
