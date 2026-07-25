"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Fingerprint, Lock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Chapter, ChapterEyebrow, ChapterInner } from "@/components/ui/Chapter";
import { Reveal } from "@/components/ui/Reveal";
import { scanIntro, scanResult, scanStatuses, traits } from "@/content/scan";
import { easeOutExpo } from "@/lib/motion";
import { useExperience } from "@/lib/store";
import { useReducedMotion } from "@/lib/useMotionPreference";

const TOTAL = traits[traits.length - 1].at + 900;

/**
 * Chapter 02 — the personality scan.
 *
 * It does not start on its own. A machine that begins analysing a
 * person the moment they scroll past is a different, worse object than
 * one that waits to be asked — identical pixels, opposite manners.
 *
 * With motion reduced it skips the theatre and prints the readout,
 * which loses the effect and keeps every word.
 */
export function Scan() {
  const reduced = useReducedMotion();
  const scanRun = useExperience((s) => s.scanRun);
  const runScan = useExperience((s) => s.runScan);

  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const rafRef = useRef(0);

  const start = () => {
    runScan();
    if (reduced) {
      setElapsed(TOTAL);
      setDone(true);
      return;
    }
    setElapsed(0);
    setDone(false);
    setRunning(true);
  };

  useEffect(() => {
    if (!running) return;
    // rAF rather than an interval — the readout lines are keyed to real
    // elapsed time, so a dropped frame delays a line instead of
    // desynchronising the whole sequence from the progress bar.
    let startedAt: number | null = null;
    const tick = (now: number) => {
      startedAt ??= now;
      const t = now - startedAt;
      setElapsed(t);
      if (t >= TOTAL) {
        setRunning(false);
        setDone(true);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [running]);

  const progress = Math.min(1, elapsed / TOTAL);
  const revealed = traits.filter((t) => elapsed >= t.at);
  const status =
    scanStatuses[
      Math.min(scanStatuses.length - 1, Math.floor(progress * scanStatuses.length))
    ];

  return (
    <Chapter
      id="scan"
      index="02"
      title="The Scan"
      className="py-28 sm:py-36"
      fullHeight={false}
    >
      <ChapterInner>
        <Reveal>
          <ChapterEyebrow index="02" title="The Scan" />
          <p className="text-gradient mt-6 max-w-2xl whitespace-pre-line font-display text-[clamp(2.6rem,5.5vw,4.4rem)] font-medium leading-[1.02] tracking-[-0.02em]">
            {scanIntro.title}
          </p>
          <p className="measure-wide mt-5 text-[15px] leading-relaxed text-porcelain-dim">
            {scanIntro.body}
          </p>
        </Reveal>

        <Reveal>
          <div className="glass relative mt-12 overflow-hidden rounded-3xl">
            {/* Sweep bar while running */}
            {running && !reduced && (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ember-400/12 to-transparent"
                style={{ animation: "scan-sweep 2.1s ease-in-out infinite" }}
              />
            )}

            <div className="relative border-b border-porcelain/8 px-6 py-4 sm:px-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="flex items-center gap-2.5">
                  <Fingerprint
                    className={`size-3.5 ${running ? "text-ember-400" : "text-porcelain-faint"}`}
                  />
                  <span className="label">
                    {done ? "Scan complete" : running ? "Scanning" : "Standby"}
                  </span>
                </span>
                <span className="font-mono text-[10px] tracking-widest text-porcelain-faint">
                  {Math.round(progress * 100)}%
                </span>
              </div>

              <div
                aria-hidden
                className="mt-3 h-px w-full overflow-hidden bg-porcelain/8"
              >
                <motion.div
                  className="h-full origin-left bg-ember-400"
                  initial={false}
                  animate={{ scaleX: progress }}
                  transition={{ duration: 0.1, ease: "linear" }}
                />
              </div>

              <p
                aria-live="polite"
                className="mt-2.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-porcelain-faint"
              >
                {running ? status : done ? "Results below." : "Waiting for you."}
              </p>
            </div>

            {/* ── Readout ────────────────────────────────────────── */}
            <div className="px-6 py-7 sm:px-8">
              {!running && !done ? (
                <div className="flex flex-col items-start gap-5 py-6">
                  <p className="measure-wide text-[15px] leading-relaxed text-porcelain-faint">
                    Nothing runs until you say so.
                  </p>
                  <button
                    type="button"
                    onClick={start}
                    className="rounded-full bg-porcelain px-6 py-3 text-sm font-medium text-ink-950 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03]"
                  >
                    {scanRun ? scanIntro.again : scanIntro.cta}
                  </button>
                </div>
              ) : (
                <ul className="space-y-3.5">
                  <AnimatePresence initial={false}>
                    {revealed.map((trait) => (
                      <motion.li
                        key={trait.id}
                        initial={reduced ? false : { opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.55, ease: easeOutExpo }}
                        className="flex items-start gap-3.5"
                      >
                        <span className="mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-full border border-ember-400/45 bg-ember-400/10">
                          <Check className="size-2.5 text-ember-300" strokeWidth={3.5} />
                        </span>
                        <span>
                          <span className="block text-[16px] leading-snug text-porcelain">
                            {trait.label}
                          </span>
                          {trait.note && (
                            <span className="mt-0.5 block text-[13px] leading-relaxed text-porcelain-faint">
                              {trait.note}
                            </span>
                          )}
                        </span>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}

              {/* ── Verdict ──────────────────────────────────────── */}
              <AnimatePresence>
                {done && (
                  <motion.div
                    initial={reduced ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: easeOutExpo, delay: 0.25 }}
                    className="mt-8 border-t border-porcelain/8 pt-7"
                  >
                    <span className="label text-ember-500/80">
                      {scanResult.label}
                    </span>
                    <p className="text-romance mt-3 font-display text-[clamp(1.9rem,4.4vw,3rem)] leading-[1.06]">
                      {scanResult.headline}
                    </p>
                    <p className="mt-3 font-display text-[clamp(1.2rem,2.4vw,1.6rem)] italic leading-snug text-porcelain-dim">
                      {scanResult.sub}
                    </p>

                    <button
                      type="button"
                      onClick={start}
                      className="mt-6 text-xs text-porcelain-faint transition-colors hover:text-porcelain-dim"
                    >
                      {scanIntro.again}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Reveal>

        {/* The admission. Given its own space rather than buried as
            fine print — it is what keeps the chapter from being a
            horoscope. */}
        <Reveal size="small">
          <div className="mt-6 flex max-w-2xl gap-3 px-1">
            <Lock className="mt-0.5 size-3.5 shrink-0 text-porcelain-faint" />
            <p className="text-xs leading-relaxed text-porcelain-faint">
              {scanResult.honesty}
            </p>
          </div>
        </Reveal>
      </ChapterInner>
    </Chapter>
  );
}
