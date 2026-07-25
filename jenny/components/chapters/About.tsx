"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Anchor, Car, ChefHat, MessagesSquare, Moon } from "lucide-react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { Chapter, ChapterEyebrow, ChapterInner } from "@/components/ui/Chapter";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { aboutIntro, specs, type Spec, type SpecIcon } from "@/content/about";
import { useCoarsePointer, useReducedMotion } from "@/lib/useMotionPreference";

const icons: Record<SpecIcon, typeof Moon> = {
  moon: Moon,
  car: Car,
  chef: ChefHat,
  messages: MessagesSquare,
  anchor: Anchor,
};

/** Chapter 04 — the spec sheet. */
export function About() {
  return (
    <Chapter
      id="about"
      index="04"
      title="Specifications"
      className="py-28 sm:py-36"
      fullHeight={false}
    >
      <ChapterInner>
        <Reveal>
          <ChapterEyebrow index="04" title="Specifications" />
          <p className="text-gradient mt-6 max-w-2xl whitespace-pre-line font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.02] tracking-[-0.02em]">
            {aboutIntro.title}
          </p>
          <p className="measure-wide mt-5 text-[15px] leading-relaxed text-porcelain-dim">
            {aboutIntro.body}
          </p>
        </Reveal>

        <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" step={0.07}>
          {specs.map((spec, i) => (
            <RevealItem
              key={spec.id}
              // The first card spans two columns on wide screens so the
              // grid reads as an editorial layout rather than a pricing
              // table. Small asymmetry, large difference.
              className={i === 0 ? "lg:col-span-2" : undefined}
            >
              <SpecCard spec={spec} wide={i === 0} />
            </RevealItem>
          ))}
        </RevealGroup>
      </ChapterInner>
    </Chapter>
  );
}

function SpecCard({ spec, wide }: { spec: Spec; wide: boolean }) {
  const Icon = icons[spec.icon];
  const reduced = useReducedMotion();
  const coarse = useCoarsePointer();
  const interactive = !reduced && !coarse;

  // Pointer-tracked tilt, plus a light that follows the cursor across
  // the card face. The rotation is sprung so the card lags slightly;
  // the glow is not, so it tracks exactly. That difference is what
  // stops it feeling like one flat sticker moving.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, { stiffness: 150, damping: 20 });
  const rotateY = useSpring(tiltY, { stiffness: 150, damping: 20 });

  const glowX = useTransform(px, (v) => `${v * 100}%`);
  const glowY = useTransform(py, (v) => `${v * 100}%`);
  const glow = useMotionTemplate`radial-gradient(20rem circle at ${glowX} ${glowY}, color-mix(in oklab, var(--color-ember-400) 13%, transparent), transparent 70%)`;

  const onMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    px.set(x);
    py.set(y);
    tiltY.set((x - 0.5) * 6);
    tiltX.set((0.5 - y) * 6);
  };

  const onLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={interactive ? { rotateX, rotateY, transformPerspective: 1200 } : undefined}
      className="glass glass-hover group relative h-full overflow-hidden rounded-2xl p-6 sm:p-7"
    >
      {interactive && (
        <motion.span
          aria-hidden
          style={{ backgroundImage: glow }}
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      )}

      <div className="relative">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-full border border-porcelain/10 bg-ink-950/50">
            <Icon className="size-4 text-ember-400" strokeWidth={1.6} />
          </span>
          <span className="label">{spec.field}</span>
        </div>

        <h3
          className={`mt-5 font-display leading-[1.05] text-porcelain ${
            wide ? "text-[2.5rem]" : "text-[2rem]"
          }`}
        >
          {spec.title}
        </h3>

        <p
          className={`mt-3 text-[14.5px] leading-relaxed text-porcelain-dim ${
            wide ? "max-w-xl" : ""
          }`}
        >
          {spec.body}
        </p>

        <p className="mt-5 border-t border-porcelain/8 pt-4 font-mono text-[11px] leading-relaxed text-porcelain-faint">
          {spec.note}
        </p>
      </div>
    </motion.div>
  );
}
