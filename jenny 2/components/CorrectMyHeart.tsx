"use client";

import { AnimatePresence, motion } from "framer-motion";
import { PenLine } from "lucide-react";
import { useState } from "react";
import { correctMyHeart as copy } from "@/content/room";
import { easeOutExpo } from "@/lib/motion";
import { useExperience } from "@/lib/store";
import { useReducedMotion } from "@/lib/useMotionPreference";

/**
 * The PRD's grammar joke, and the teacher's chapter.
 *
 * She isn't tested — testing a teacher on grammar would be
 * condescending however fondly meant. She's handed a red pen and one
 * sentence that is wrong on purpose, and the joke is entirely at his
 * expense. Marking the wrong word costs nothing and gets a nudge, not
 * a correction.
 */
export function CorrectMyHeart() {
  const reduced = useReducedMotion();
  const corrected = useExperience((s) => s.heartCorrected);
  const correctHeart = useExperience((s) => s.correctHeart);
  const [missed, setMissed] = useState(false);
  const [fixed, setFixed] = useState(false);

  const done = fixed || corrected;

  const mark = (index: number) => {
    if (done) return;
    if (index === copy.errorIndex) {
      setMissed(false);
      setFixed(true);
      correctHeart();
    } else {
      setMissed(true);
    }
  };

  return (
    <div className="glass rounded-3xl p-6 sm:p-8">
      <div className="flex items-center gap-2.5">
        <PenLine className="size-3.5 text-ember-400" />
        <span className="label">{copy.label}</span>
      </div>

      <p className="measure-wide mt-4 text-[15px] leading-relaxed text-porcelain-dim">
        {copy.brief}
      </p>

      <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ember-500/80">
        {done ? "Corrected" : copy.prompt}
      </p>

      {/* ── The sentence ─────────────────────────────────────────── */}
      <p className="mt-6 font-display text-[clamp(2.2rem,6vw,3.6rem)] leading-tight text-porcelain">
        {copy.tokens.map((token, index) => {
          const isError = index === copy.errorIndex;
          return (
            <span key={token}>
              {done && isError ? (
                <motion.span
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: easeOutExpo }}
                  className="text-ember-300"
                >
                  {copy.correction}
                </motion.span>
              ) : (
                <button
                  type="button"
                  onClick={() => mark(index)}
                  disabled={done}
                  aria-label={done ? token : `Correct the word ${token}`}
                  className={`relative rounded transition-colors duration-300 ${
                    done
                      ? "cursor-default"
                      : "cursor-pointer hover:text-ember-300 focus-visible:text-ember-300"
                  }`}
                >
                  {token}
                </button>
              )}
              {index < copy.tokens.length - 1 && " "}
            </span>
          );
        })}
      </p>

      {/* ── Feedback ─────────────────────────────────────────────── */}
      <div aria-live="polite" className="mt-6">
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="done"
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: easeOutExpo, delay: 0.3 }}
            >
              <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-ember-400">
                {copy.success.headline}
              </p>
              <p className="mt-2 font-display text-[clamp(1.5rem,3.4vw,2.2rem)] italic leading-snug text-porcelain">
                {copy.success.sub}
              </p>
              <p className="measure-wide mt-6 border-t border-porcelain/8 pt-5 text-[14px] leading-relaxed text-porcelain-dim">
                {copy.outro}
              </p>
            </motion.div>
          ) : missed ? (
            <motion.p
              key="missed"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[14px] text-porcelain-faint"
            >
              {copy.miss}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
