import { useCallback, useEffect, useRef, useState } from "react";

/**
 * useCrossfadeSlider — cross-fade de N "slides" sin movimiento lateral.
 *
 * Pensado para el Hero del landing: el efecto cinematográfico es opacidad
 * pura (`transition: opacity 1200ms ease-in-out`), no `translateX`. Eso
 * evita pintar 7 fotos a la vez en el compositor y se siente coherente
 * con el lenguaje premium del resto del sitio (parallax + overlay, no
 * carrusel horizontal).
 *
 * Comportamiento:
 * - Auto-advance cada `intervalMs` (default 6000 ms). Pausa al hacer hover
 *   sobre el contenedor y se reanuda al salir.
 * - `prefers-reduced-motion: reduce` → deshabilita auto-advance y deja el
 *   slide activo estático. El consumidor debe aplicar `transition: none`
 *   en la capa CSS correspondiente (ya está hecho en `.hero-slider__slide`
 *   dentro de `@media (prefers-reduced-motion: reduce)` en index.css).
 * - Teclado: ←/→ saltan entre slides cuando el contenedor (o uno de sus
 *   descendientes interactivos) tiene el foco. El primer tab en la página
 *   no debe robar el foco: usamos `onKeyDown` en el contenedor, no global.
 * - Dots como botones reales: el consumidor debe renderizar `<button>`
 *   con `aria-label="Ir al slide N"` y llamar `setIndex(i)`.
 *
 * Devuelve:
 *   index       índice del slide activo (0..count-1)
 *   setIndex    setter directo (para los dots)
 *   goNext      avanza al siguiente (con wrap)
 *   goPrev      retrocede al anterior (con wrap)
 *   count       total de slides
 *   isPaused    true si el auto-advance está pausado por hover/reduced-motion
 *   handlers    { onMouseEnter, onMouseLeave, onKeyDown } para enchufar al contenedor
 *
 * @param {object}  opts
 * @param {number}  opts.count       Número total de slides (obligatorio).
 * @param {number}  [opts.intervalMs=6000] Milisegundos entre auto-advance.
 * @param {boolean} [opts.pauseOnHover=true] Pausa al pasar el mouse.
 * @returns {{ index: number, setIndex: Function, goNext: Function, goPrev: Function, count: number, isPaused: boolean, handlers: object }}
 */
export function useCrossfadeSlider({
  count,
  intervalMs = 6000,
  pauseOnHover = true,
} = {}) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  // Reducimos consultas a matchMedia: una sola suscripción viva, no por tick.
  const reducedMotionRef = useRef(false);
  const intervalRef = useRef(null);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % count);
  }, [count]);

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + count) % count);
  }, [count]);

  // Suscripción a prefers-reduced-motion.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = mq.matches;
    const handler = (e) => {
      reducedMotionRef.current = e.matches;
    };
    if (mq.addEventListener) {
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
    // Safari < 14 fallback
    mq.addListener(handler);
    return () => mq.removeListener(handler);
  }, []);

  // Auto-advance. Sólo corre si: hay más de 1 slide, no está pausado y el
  // usuario no pidió reduced-motion.
  useEffect(() => {
    if (count <= 1) return undefined;
    if (isPaused || reducedMotionRef.current) return undefined;
    intervalRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, intervalMs);
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [count, intervalMs, isPaused]);

  // Handlers de hover — sólo si pauseOnHover está activo.
  const onMouseEnter = useCallback(() => {
    if (pauseOnHover) setIsPaused(true);
  }, [pauseOnHover]);
  const onMouseLeave = useCallback(() => {
    if (pauseOnHover) setIsPaused(false);
  }, [pauseOnHover]);

  // Teclado ←/→. Va en el contenedor del slider; no instalamos listener
  // global para no interferir con otros componentes.
  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    },
    [goNext, goPrev]
  );

  return {
    index,
    setIndex,
    goNext,
    goPrev,
    count,
    isPaused,
    handlers: {
      onMouseEnter,
      onMouseLeave,
      onKeyDown,
    },
  };
}
