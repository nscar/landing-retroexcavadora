import { useEffect, useRef } from "react";

export function useParallax(factor = 0.25) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let rafId = null;
    let ticking = false;

    function update() {
      const rect = el.getBoundingClientRect();
      const offset = rect.top * factor;
      el.style.transform = "translate3d(0, " + offset.toFixed(2) + "px, 0)";
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        rafId = requestAnimationFrame(update);
        ticking = true;
      }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [factor]);

  return ref;
}
