import { useEffect, useRef } from "react";

/**
 * useTilt — aplica un efecto 3D sutil a un elemento según la posición del
 * cursor. Vanilla JS + CSS, sin dependencias externas.
 *
 * - Perspectiva + rotación X/Y limitadas a `maxAngle` (5° por defecto).
 * - Transición ease-out de `transitionMs` ms; al entrar el cursor vuelve
 *   con un fade corto para que el "pop" sea natural.
 * - Desactivado automáticamente si el usuario tiene
 *   `prefers-reduced-motion: reduce`.
 * - Sin listeners si la entrada cambia antes de montarse (cleanup).
 *
 * Devuelve un ref que se debe colocar en el elemento a inclinar.
 * El elemento debe tener `transform-style: preserve-3d` si contiene
 * hijos que también quieran profundidad; el hook solo rota el contenedor.
 *
 * @param {object} [opts]
 * @param {number} [opts.maxAngle=6]    Grados máximos de rotación en X/Y.
 * @param {number} [opts.perspective=900] Perspectiva CSS en px.
 * @param {number} [opts.transitionMs=220] Duración ease-out al salir.
 * @param {number} [opts.scale=1.02]    Scale al hover.
 * @returns {React.MutableRefObject<HTMLElement|null>}
 */
export function useTilt({
  maxAngle = 6,
  perspective = 900,
  transitionMs = 220,
  scale = 1.02,
} = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respeta preferencia de movimiento reducido.
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    // Soporta cambios posteriores a la preferencia (sin re-render).
    const onMqChange = (e) => {
      if (e.matches) {
        el.style.transform = "";
        el.style.transition = "";
        el.removeEventListener("mousemove", handleMove);
        el.removeEventListener("mouseleave", handleLeave);
        el.removeEventListener("mouseenter", handleEnter);
      }
    };
    mq.addEventListener?.("change", onMqChange);

    // Estado inicial: transición corta al volver.
    el.style.transformStyle = "preserve-3d";
    el.style.transition = `transform ${transitionMs}ms cubic-bezier(0.2, 0.7, 0.2, 1)`;
    el.style.willChange = "transform";

    let rafId = null;
    let nextTransform = "";

    function apply() {
      rafId = null;
      el.style.transform = nextTransform;
    }

    function handleMove(e) {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;   // 0..1
      const y = (e.clientY - rect.top) / rect.height;    // 0..1
      // Mapea 0..1 → -maxAngle..+maxAngle. Invertimos Y para que "arriba"
      // del cursor incline la parte superior del card hacia atrás.
      const ry = (x - 0.5) * 2 * maxAngle;
      const rx = -(y - 0.5) * 2 * maxAngle;
      nextTransform =
        `perspective(${perspective}px) ` +
        `rotateX(${rx.toFixed(2)}deg) ` +
        `rotateY(${ry.toFixed(2)}deg) ` +
        `scale(${scale})`;
      if (rafId === null) rafId = requestAnimationFrame(apply);
    }

    function handleEnter() {
      // En hover: respuesta rápida (sin ease-out largo) para que siga al
      // cursor de cerca.
      el.style.transition = `transform 80ms linear`;
    }

    function handleLeave() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      // Vuelve a la pose neutra con ease-out.
      el.style.transition = `transform ${transitionMs}ms cubic-bezier(0.2, 0.7, 0.2, 1)`;
      el.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`;
    }

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseenter", handleEnter);
    el.addEventListener("mouseleave", handleLeave);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseenter", handleEnter);
      el.removeEventListener("mouseleave", handleLeave);
      mq.removeEventListener?.("change", onMqChange);
      // Limpia los estilos inline para no contaminar el árbol DOM.
      el.style.transform = "";
      el.style.transformStyle = "";
      el.style.transition = "";
      el.style.willChange = "";
    };
  }, [maxAngle, perspective, transitionMs, scale]);

  return ref;
}
