"use client";

import { motion, type Variants } from "framer-motion";
import type { ElementType, ReactNode } from "react";
import { inView, rise, riseSmall, stagger } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useMotionPreference";

/* motion(Component) must not be called during render — a fresh
   component identity on every pass unmounts and remounts the subtree,
   which shows up as elements flickering back to their `hidden` state.
   Cache one motion component per tag for the life of the module. */
const motionCache = new Map<ElementType, ElementType>();

function motionTag(as: ElementType): ElementType {
  let cached = motionCache.get(as);
  if (!cached) {
    cached = motion.create(as as never) as ElementType;
    motionCache.set(as, cached);
  }
  return cached;
}

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** "small" travels less — for dense lists where full rise looks fussy. */
  size?: "default" | "small";
  as?: ElementType;
}

/** One element rising into place as it enters the viewport. */
export function Reveal({
  children,
  className,
  delay = 0,
  size = "default",
  as = "div",
}: RevealProps) {
  const reduced = useReducedMotion();
  const variants = size === "small" ? riseSmall : rise;

  if (reduced) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  const Component = motionTag(as);
  return (
    <Component
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      transition={{ delay }}
    >
      {children}
    </Component>
  );
}

interface RevealGroupProps {
  children: ReactNode;
  className?: string;
  step?: number;
  delay?: number;
  as?: ElementType;
}

/** Wrap a list; every <RevealItem /> inside inherits the stagger. */
export function RevealGroup({
  children,
  className,
  step = 0.09,
  delay = 0,
  as = "div",
}: RevealGroupProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  const Component = motionTag(as);
  return (
    <Component
      className={className}
      variants={stagger(step, delay)}
      initial="hidden"
      whileInView="show"
      viewport={inView}
    >
      {children}
    </Component>
  );
}

export function RevealItem({
  children,
  className,
  variants = riseSmall,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  as?: ElementType;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  const Component = motionTag(as);
  return (
    <Component className={className} variants={variants}>
      {children}
    </Component>
  );
}
