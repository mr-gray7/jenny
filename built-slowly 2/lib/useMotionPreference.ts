"use client";

import { useEffect, useState } from "react";
import { useExperience } from "./store";

/**
 * The OS preference, overridable by her from the settings pill.
 * Returns `true` when animation should be held back.
 *
 * Components should branch on this rather than relying only on the CSS
 * media query — a lot of the motion here is JS-driven (GSAP scrub,
 * typing, autoplaying reveals) and CSS cannot switch that off.
 */
export function useReducedMotion(): boolean {
  const override = useExperience((s) => s.motionOverride);
  const [systemReduced, setSystemReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setSystemReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setSystemReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (override === "reduced") return true;
  if (override === "full") return false;
  return systemReduced;
}

/** Coarse pointer / touch — used to skip cursor effects and hover-only affordances. */
export function useCoarsePointer(): boolean {
  const [coarse, setCoarse] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setCoarse(!mq.matches);
    const onChange = (e: MediaQueryListEvent) => setCoarse(!e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return coarse;
}
