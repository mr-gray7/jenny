"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { Chapter, ChapterEyebrow, ChapterInner } from "@/components/ui/Chapter";
import { Reveal } from "@/components/ui/Reveal";
import { beats, timelineIntro } from "@/content/timeline";
import { easeOutExpo } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useMotionPreference";

/**
 * Chapter 01 — a vertical timeline that draws itself as she scrolls.
 *
 * The line is scroll-linked rather than triggered: it fills in step
 * with her, which makes the reading pace hers and not the animation's.
 * Each beat then fades up as it crosses.
 */
export function Timeline() {
  const reduced = useReducedMotion();
  const track = useRef<HTMLOListElement>(null);

  const { scrollYProgress } = useScroll({
    target: track,
    // Start drawing when the list's top reaches three-quarters down the
    // viewport, finish when its bottom passes the middle. Ends the line
    // on the last beat rather than after it.
    offset: ["start 0.75", "end 0.55"],
  });

  const drawn = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    restDelta: 0.001,
  });
  const scaleY = useTransform(drawn, (v) => (reduced ? 1 : v));

  return (
    <Chapter
      id="timeline"
      index="01"
      title="Timeline"
      className="py-28 sm:py-36"
      fullHeight={false}
    >
      <ChapterInner>
        <Reveal>
          <ChapterEyebrow index="01" title="Timeline" />
          <p className="text-gradient mt-6 max-w-2xl whitespace-pre-line font-display text-[clamp(2.6rem,5.5vw,4.4rem)] font-medium leading-[1.02] tracking-[-0.02em]">
            {timelineIntro.title}
          </p>
          <p className="measure-wide mt-5 text-[15px] leading-relaxed text-porcelain-dim">
            {timelineIntro.body}
          </p>
        </Reveal>

        <ol ref={track} className="relative mt-20 max-w-2xl">
          {/* The unlit rail */}
          <div
            aria-hidden
            className="absolute bottom-3 left-[7px] top-3 w-px bg-porcelain/8"
          />
          {/* The lit rail, drawn by scroll */}
          <motion.div
            aria-hidden
            style={{ scaleY, transformOrigin: "top" }}
            className="absolute bottom-3 left-[7px] top-3 w-px bg-gradient-to-b from-rose-400 via-ember-400 to-violet-500/50"
          />

          {beats.map((beat) => (
            <li key={beat.id} className="relative pb-16 pl-12 last:pb-0">
              <Dot pivot={beat.pivot} reduced={reduced} />

              <motion.div
                initial={reduced ? false : { opacity: 0, y: 22, filter: "blur(5px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 1, ease: easeOutExpo }}
              >
                <h3
                  className={`font-display text-[clamp(1.9rem,4vw,2.9rem)] leading-[1.08] tracking-[-0.015em] ${
                    beat.pivot ? "text-romance italic" : "text-porcelain"
                  }`}
                >
                  {beat.headline}
                </h3>
                {beat.body && (
                  <p className="measure-wide mt-3 text-[15px] leading-relaxed text-porcelain-dim">
                    {beat.body}
                  </p>
                )}
              </motion.div>
            </li>
          ))}
        </ol>
      </ChapterInner>
    </Chapter>
  );
}

function Dot({ pivot, reduced }: { pivot?: boolean; reduced: boolean }) {
  return (
    <motion.span
      aria-hidden
      initial={reduced ? false : { scale: 0.2, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, amount: 1 }}
      transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.1 }}
      className={`absolute left-0 top-[0.55em] grid size-[15px] place-items-center rounded-full border ${
        pivot
          ? "border-ember-400 bg-ink-950"
          : "border-porcelain/25 bg-ink-950"
      }`}
    >
      <span
        className={`rounded-full ${
          pivot ? "size-[7px] bg-ember-400" : "size-[5px] bg-porcelain/40"
        }`}
      />
      {/* A faint halo on the two turning points, so they read as
          different weight without needing a label. */}
      {pivot && (
        <span className="absolute inset-[-6px] rounded-full border border-ember-400/25" />
      )}
    </motion.span>
  );
}
