"use client";

import { useEffect, type RefObject } from "react";
import { useCoarsePointer, useReducedMotion } from "./useMotionPreference";

/**
 * Soft parallax, driven by GSAP ScrollTrigger.
 *
 * `strength` is how far the element travels across its whole pass
 * through the viewport, in pixels. Negative moves against the scroll
 * (nearer the viewer), positive with it (further away). Keep it under
 * about 80 — past that it stops reading as depth and starts reading as
 * a bug.
 *
 * GSAP is imported lazily and only when it will actually be used, so
 * it never lands in the initial bundle, and never downloads at all for
 * a touch device or anyone who has asked for less motion.
 */
export function useParallax(
  ref: RefObject<HTMLElement | null>,
  strength = 40,
) {
  const reduced = useReducedMotion();
  const coarse = useCoarsePointer();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || coarse) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        gsap.fromTo(
          el,
          { y: -strength / 2 },
          {
            y: strength / 2,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          },
        );
      });

      cleanup = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [ref, strength, reduced, coarse]);
}
