import type { Transition, Variants } from "framer-motion";

/* One curve for everything that enters. One for everything that moves.
   Consistency is what separates "animated" from "directed". */
export const easeOutExpo = [0.16, 1, 0.3, 1] as const;
export const easeInOutQuint = [0.83, 0, 0.17, 1] as const;
export const easeOutSoft = [0.25, 0.46, 0.45, 0.94] as const;

export const spring: Transition = {
  type: "spring",
  stiffness: 240,
  damping: 30,
  mass: 0.9,
};

export const springSoft: Transition = {
  type: "spring",
  stiffness: 120,
  damping: 22,
  mass: 1,
};

/** The house entrance: rise, unblur, settle. Slow enough to feel deliberate. */
export const rise: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.1, ease: easeOutExpo },
  },
};

export const riseSmall: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easeOutExpo },
  },
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1.2, ease: easeOutExpo } },
};

/** Parent that hands its children a staggered entrance. */
export function stagger(step = 0.09, delay = 0): Variants {
  return {
    hidden: {},
    show: {
      transition: { staggerChildren: step, delayChildren: delay },
    },
  };
}

/** Per-word / per-line reveal, used by <Lines /> and the overture. */
export const lineReveal: Variants = {
  hidden: { opacity: 0, y: "0.6em" },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.95, ease: easeOutExpo },
  },
};

/** Standard viewport trigger. Fires once, a third of the way in, so
 *  content is already settled by the time the eye arrives. */
export const inView = { once: true, amount: 0.28 } as const;
export const inViewEarly = { once: true, amount: 0.1 } as const;
