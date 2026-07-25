"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Chapter } from "@/components/ui/Chapter";
import { config } from "@/content/config";
import { overtureCta, overtureLines } from "@/content/overture";
import { easeOutExpo, lineReveal, stagger } from "@/lib/motion";
import { useExperience, useHydrated } from "@/lib/store";
import { useReducedMotion } from "@/lib/useMotionPreference";
import { useTypewriter } from "@/lib/useTypewriter";

/**
 * Landing screen. Black, a cursor, and the lines arriving one at a time.
 *
 * Pacing is per-line rather than global — "Hello." wants a second of
 * silence after it, the three "Every…" lines want almost none. That
 * unevenness is the difference between a page typing at someone and a
 * person choosing their words.
 */
export function Overture() {
  const reduced = useReducedMotion();
  const hydrated = useHydrated();
  const hasEntered = useExperience((s) => s.hasEntered);
  const enter = useExperience((s) => s.enter);
  const visited = useExperience((s) => s.visited);

  const isReturning = hydrated && visited.length > 1;
  const instant = reduced || isReturning;

  const [index, setIndex] = useState(0);
  const [showCta, setShowCta] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const line = overtureLines[index];
  const finished = index >= overtureLines.length;

  const advance = useCallback(() => {
    const hold = overtureLines[index]?.hold ?? 600;
    timerRef.current = setTimeout(
      () => setIndex((i) => Math.min(i + 1, overtureLines.length)),
      hold,
    );
  }, [index]);

  const { output } = useTypewriter(line?.text ?? "", {
    speed: 34,
    startDelay: index === 0 ? 900 : 0,
    instant,
    onDone: instant ? undefined : advance,
  });

  // `instant` only becomes true once persisted state has hydrated, which
  // is after first paint. Without this the sequence stalls wherever it
  // had reached at the moment it flipped.
  useEffect(() => {
    if (instant) setIndex(overtureLines.length);
  }, [instant]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  useEffect(() => {
    if (!finished) return;
    const t = setTimeout(() => setShowCta(true), instant ? 0 : 700);
    return () => clearTimeout(t);
  }, [finished, instant]);

  const go = (target: string) => {
    enter();
    requestAnimationFrame(() => {
      document
        .getElementById(target)
        ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    });
  };

  const shown = instant ? overtureLines : overtureLines.slice(0, index);

  return (
    <Chapter
      id="overture"
      index="00"
      title="Begin"
      className="flex items-center justify-center"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col items-start px-6 py-24 sm:px-10">
        <div className="w-full space-y-2.5">
          {shown.map((entry) => (
            <p
              key={entry.text}
              className={`text-[19px] leading-relaxed sm:text-[22px] ${
                entry.accent
                  ? "font-display text-[2.6rem] italic text-romance sm:text-[3.4rem]"
                  : "text-porcelain-dim"
              }`}
            >
              {entry.text}
            </p>
          ))}

          {!finished && (
            <p
              className={`text-[19px] leading-relaxed sm:text-[22px] ${
                line?.accent
                  ? "font-display text-[2.6rem] italic text-romance sm:text-[3.4rem]"
                  : "text-porcelain-dim"
              }`}
            >
              {output}
              <span
                aria-hidden
                className="ml-1 inline-block h-[1.05em] w-[3px] translate-y-[0.16em] bg-ember-400"
                style={{ animation: "caret-blink 1.05s steps(1) infinite" }}
              />
            </p>
          )}
        </div>

        <AnimatePresence>
          {showCta && (
            <motion.div
              variants={reduced ? undefined : stagger(0.14, 0.1)}
              initial={reduced ? undefined : "hidden"}
              animate={reduced ? undefined : "show"}
              className="mt-14 w-full"
            >
              <Line reduced={reduced}>
                <div aria-hidden className="rule-romance h-px w-full" />
              </Line>

              <Line reduced={reduced}>
                <h1 className="mt-10 font-display text-[clamp(3rem,11vw,7rem)] font-medium leading-[0.92] tracking-[-0.03em]">
                  <span className="text-gradient block">Built</span>
                  <span className="text-romance block italic">Slowly</span>
                </h1>
              </Line>

              <Line reduced={reduced}>
                <p className="measure-wide mt-6 text-lg leading-relaxed text-porcelain-dim">
                  {config.tagline}
                </p>
              </Line>

              <Line reduced={reduced}>
                <div className="mt-10 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => go("timeline")}
                    className="group relative overflow-hidden rounded-full bg-porcelain px-8 py-3.5 text-sm font-medium text-ink-950 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03] active:scale-[0.99]"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {isReturning ? "Pick up where you left off" : overtureCta.primary}
                      <ChevronRight className="size-4 transition-transform duration-500 group-hover:translate-x-0.5" />
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => go("ending")}
                    className="rounded-full border border-porcelain/12 px-6 py-3.5 text-sm text-porcelain-dim transition-colors duration-500 hover:border-porcelain/25 hover:text-porcelain"
                  >
                    {overtureCta.secondary}
                  </button>
                </div>
              </Line>

              <Line reduced={reduced}>
                <p className="mt-6 text-xs text-porcelain-faint">{overtureCta.note}</p>
              </Line>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {hasEntered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <ArrowDown className="size-4 animate-bounce text-porcelain-faint/50" />
          </motion.div>
        )}
      </AnimatePresence>
    </Chapter>
  );
}

function Line({
  children,
  reduced,
}: {
  children: React.ReactNode;
  reduced: boolean;
}) {
  if (reduced) return <div>{children}</div>;
  return <motion.div variants={lineReveal}>{children}</motion.div>;
}
