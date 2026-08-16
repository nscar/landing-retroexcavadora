import { useEffect, useRef, useState } from 'react';

// NOTA sobre `createPortal`:
// Lo importamos con `import()` dinámico (lazy) dentro del componente, en vez
// de `import { createPortal } from 'react-dom'` arriba, para que el bundle
// SSR de `App.jsx` (en scripts/verify.cjs y _smoke_preview.mjs) NO arrastre
// `react-dom`. Si lo arrastra, ese SSR pre-carga `react-dom` (prod) en el
// cache de módulos y rompe el sub-form-check que viene justo después, que
// monta el FormularioContacto con `act()` y la build `development` de
// `react-dom/client` — los `react-dom` con modos distintos colisionan y
// `act()` termina no propagando los `onChange` sintéticos de los inputs.
// En SSR el lightbox nunca se abre (lightboxIndex es null), así que el
// import dinámico nunca corre y el SSR de App.jsx queda libre de `react-dom`.

// Lightbox accesible para ampliar las imágenes de la galería.
//
// Responsabilidades:
//   - Render en portal para escapar de cualquier overflow/stacking del padre.
//   - Cierre: clic en overlay, botón cerrar, tecla Escape.
//   - Navegación: teclas ←/→ en teclado, botones prev/next, wrap-around.
//   - Body scroll lock mientras está abierto (sin saltos de layout).
//   - Foco: la primera vez que abre, lo lleva al botón cerrar; al cerrar,
//     lo devuelve al trigger que lo abrió. Tab queda atrapado dentro del
//     lightbox (focus trap mínimo).
//   - Respeta `prefers-reduced-motion`: la transición de opacidad se acorta.
//
// Props:
//   - items: array de { id, src, alt }
//   - index: índice del item abierto (null = cerrado)
//   - onClose(): callback para cerrar
//   - onIndexChange(nextIndex): callback al navegar
export function Lightbox({ items, index, onClose, onIndexChange }) {
  const isOpen = index !== null && index >= 0 && index < items.length;
  const closeBtnRef = useRef(null);
  const dialogRef = useRef(null);
  // Guardamos el elemento que tenía foco antes de abrir para restaurarlo al cerrar.
  const previouslyFocusedRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  // createPortal se resuelve solo en cliente y solo si está abierto.
  // Mientras es null, el componente retorna null y no toca `document.body`.
  const [createPortal, setCreatePortal] = useState(null);

  // `mounted` protege contra SSR: `document` no existe en renderToString.
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lazy import de `createPortal` solo cuando el lightbox se abre.
  useEffect(() => {
    if (!isOpen || !mounted) return undefined;
    let cancelled = false;
    import('react-dom').then((mod) => {
      if (!cancelled) setCreatePortal(() => mod.createPortal);
    });
    return () => {
      cancelled = true;
    };
  }, [isOpen, mounted]);

  // Body scroll lock + restaurar foco al abrir/cerrar.
  // El foco al botón cerrar depende de `createPortal` porque hasta que
  // el portal está montado, el botón no existe en el DOM. El `setTimeout(0)`
  // original corría antes de que el `import('react-dom')` resolviera y
  // dejaba el foco en `body`, rompiendo la navegación por teclado
  // inmediatamente al abrir el lightbox.
  useEffect(() => {
    if (!isOpen || !createPortal) return undefined;
    previouslyFocusedRef.current =
      typeof document !== 'undefined' ? document.activeElement : null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      const prev = previouslyFocusedRef.current;
      if (prev && typeof prev.focus === 'function') {
        prev.focus();
      }
    };
  }, [isOpen, createPortal]);

  // Teclado: Escape, ←, →, Tab (focus trap).
  useEffect(() => {
    if (!isOpen) return undefined;
    function onKey(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const next = (index + 1) % items.length;
        onIndexChange(next);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = (index - 1 + items.length) % items.length;
        onIndexChange(prev);
      } else if (e.key === 'Tab') {
        // Focus trap mínimo: mantener el foco dentro del dialog.
        const root = dialogRef.current;
        if (!root) return;
        const focusables = root.querySelectorAll(
          'button, [href], [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, index, items, onClose, onIndexChange]);

  if (!mounted || !isOpen || !createPortal) return null;

  const item = items[index];
  const hasPrev = items.length > 1;
  const hasNext = items.length > 1;

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={item.alt || 'Imagen ampliada'}
      className="lightbox"
      onClick={(e) => {
        // Cerrar al hacer clic en el overlay (fuera de la imagen y los botones).
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        ref={closeBtnRef}
        type="button"
        onClick={onClose}
        aria-label="Cerrar imagen ampliada"
        className="lightbox__close"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          aria-hidden="true"
          className="h-6 w-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      {hasPrev && (
        <button
          type="button"
          onClick={() => onIndexChange((index - 1 + items.length) % items.length)}
          aria-label="Imagen anterior"
          className="lightbox__nav lightbox__nav--prev"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
            className="h-7 w-7"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
          </svg>
        </button>
      )}

      <figure className="lightbox__figure">
        <img
          src={item.src}
          alt={item.alt}
          className="lightbox__img"
          // Las imágenes del lightbox están abiertas bajo demanda: alta prioridad.
          loading="eager"
          decoding="async"
        />
        <figcaption className="lightbox__caption">
          <span className="lightbox__counter">
            {index + 1} / {items.length}
          </span>
        </figcaption>
      </figure>

      {hasNext && (
        <button
          type="button"
          onClick={() => onIndexChange((index + 1) % items.length)}
          aria-label="Imagen siguiente"
          className="lightbox__nav lightbox__nav--next"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
            className="h-7 w-7"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
          </svg>
        </button>
      )}
    </div>,
    document.body
  );
}
