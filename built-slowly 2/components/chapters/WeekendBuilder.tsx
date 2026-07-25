"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarRange, Sparkles } from "lucide-react";
import { useMemo } from "react";
import { Chapter, ChapterEyebrow, ChapterInner } from "@/components/ui/Chapter";
import { Reveal } from "@/components/ui/Reveal";
import { slots, weekendClosers, weekendIntro } from "@/content/weekend";
import { easeOutExpo } from "@/lib/motion";
import { useExperience } from "@/lib/store";
import { useReducedMotion } from "@/lib/useMotionPreference";
import { useQuip } from "@/lib/useQuip";

/**
 * Chapter 05 — she assembles the weekend, the page reacts, then writes
 * it out.
 *
 * Two feedback loops, deliberately: an immediate quip the moment she
 * picks something, and the full write-up when she asks for it. The
 * quip is what makes it feel answered rather than recorded.
 */
export function WeekendBuilder() {
  const reduced = useReducedMotion();
  const weekend = useExperience((s) => s.weekend);
  const setWeekend = useExperience((s) => s.setWeekend);
  const generated = useExperience((s) => s.weekendGenerated);
  const generateWeekend = useExperience((s) => s.generateWeekend);

  // Shows the handwritten reaction instantly, and swaps in an AI one
  // only if OPENAI_API_KEY is configured. See app/api/quip/route.ts.
  const { line: reaction, say } = useQuip();

  const chosenCount = slots.filter((slot) => weekend[slot.id]).length;
  const complete = chosenCount === slots.length;

  /** The wash behind the chapter, blended from whatever she has picked. */
  const tint = useMemo(() => {
    const picked = slots
      .map((slot) => slot.options.find((o) => o.id === weekend[slot.id]))
      .filter(Boolean);
    if (!picked.length) return null;
    // Last choice wins the top stop; the first sets the floor. Blending
    // all three muddies to grey, which is worse than either.
    return picked[picked.length - 1]!.tint[0];
  }, [weekend]);

  const itinerary = useMemo(() => {
    if (!complete) return null;
    const lines = slots.map(
      (slot) => slot.options.find((o) => o.id === weekend[slot.id])!.line,
    );
    const closer = weekendClosers[weekend.where] ?? weekendClosers.default;
    return { lines, closer };
  }, [complete, weekend]);

  const choose = (
    slot: (typeof slots)[number],
    option: (typeof slots)[number]["options"][number],
  ) => {
    setWeekend(slot.id, option.id);
    void say(`${slot.field}: ${option.label}`, option.reaction);
  };

  return (
    <Chapter
      id="weekend"
      index="05"
      title="Perfect Weekend"
      className="relative py-28 sm:py-36"
      fullHeight={false}
    >
      {/* Selection-driven wash. Sits under the content, above the page
          atmosphere, and never gets bright enough to fight the text. */}
      <AnimatePresence>
        {tint && !reduced && (
          <motion.div
            key={tint}
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: easeOutExpo }}
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(90% 60% at 50% 0%, ${tint} 0%, transparent 70%)`,
            }}
          />
        )}
      </AnimatePresence>

      <ChapterInner className="relative">
        <Reveal>
          <ChapterEyebrow index="05" title="Perfect Weekend" />
          <p className="text-gradient mt-6 max-w-2xl whitespace-pre-line font-display text-[clamp(2.6rem,5.5vw,4.4rem)] font-medium leading-[1.02] tracking-[-0.02em]">
            {weekendIntro.title}
          </p>
          <p className="measure-wide mt-5 text-[15px] leading-relaxed text-porcelain-dim">
            {weekendIntro.body}
          </p>
        </Reveal>

        <div className="mt-14 space-y-8">
          {slots.map((slot, i) => (
            <Reveal key={slot.id} size="small" delay={i * 0.05}>
              <fieldset>
                <legend className="w-full">
                  <span className="label block text-ember-500/70">{slot.field}</span>
                  <span className="mt-1.5 block font-display text-[1.8rem] leading-tight text-porcelain">
                    {slot.question}
                  </span>
                </legend>

                <div className="mt-4 flex flex-wrap gap-2.5">
                  {slot.options.map((option) => {
                    const selected = weekend[slot.id] === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => choose(slot, option)}
                        className={`rounded-full border px-5 py-3 text-[14.5px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          selected
                            ? "border-ember-400/50 bg-ember-400/10 text-ember-100"
                            : "border-porcelain/10 text-porcelain-dim hover:border-porcelain/28 hover:text-porcelain"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            </Reveal>
          ))}
        </div>

        {/* ── The immediate reaction ───────────────────────────────── */}
        <div aria-live="polite" className="mt-8 min-h-[2.5rem]">
          <AnimatePresence mode="wait">
            {reaction && (
              <motion.p
                key={reaction}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -6, transition: { duration: 0.18 } }}
                // mode="wait" runs exit then enter in series, so the two
                // durations add up. A one-line reaction that takes over a
                // second to swap reads as lag, not as animation.
                transition={{ duration: 0.45, ease: easeOutExpo }}
                className="font-display text-xl italic leading-snug text-ember-300"
              >
                {reaction}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* ── Generate ─────────────────────────────────────────────── */}
        <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            disabled={!complete}
            onClick={generateWeekend}
            className={`flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              complete
                ? "bg-porcelain text-ink-950 hover:scale-[1.03]"
                : "cursor-not-allowed border border-porcelain/10 text-porcelain-faint"
            }`}
          >
            <Sparkles className="size-4" />
            {generated ? weekendIntro.again : weekendIntro.cta}
          </button>
          <p className="text-xs text-porcelain-faint">
            {complete
              ? "Change anything above and it rewrites itself."
              : `${chosenCount} of ${slots.length} chosen.`}
          </p>
        </div>

        {/* ── The write-up ─────────────────────────────────────────── */}
        <AnimatePresence>
          {generated && itinerary && (
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: easeOutExpo }}
              className="glass mt-8 overflow-hidden rounded-3xl"
            >
              <div className="flex items-center gap-2.5 border-b border-porcelain/8 px-6 py-4 sm:px-8">
                <CalendarRange className="size-3.5 text-ember-400" />
                <span className="label">The weekend, as specified</span>
              </div>

              <div className="space-y-4 px-6 py-7 sm:px-8 sm:py-9">
                {itinerary.lines.map((line, i) => (
                  <motion.p
                    key={line}
                    initial={reduced ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.9,
                      delay: reduced ? 0 : 0.2 * i,
                      ease: easeOutExpo,
                    }}
                    className="measure-wide text-[16.5px] leading-relaxed text-porcelain"
                  >
                    {line}
                  </motion.p>
                ))}

                <motion.p
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 1.1,
                    delay: reduced ? 0 : 0.2 * itinerary.lines.length + 0.2,
                  }}
                  className="measure-wide border-t border-porcelain/8 pt-5 font-display text-lg italic leading-snug text-porcelain-dim"
                >
                  {itinerary.closer}
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </ChapterInner>
    </Chapter>
  );
}
