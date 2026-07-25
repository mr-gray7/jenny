"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Chapter, ChapterEyebrow, ChapterInner } from "@/components/ui/Chapter";
import { Reveal } from "@/components/ui/Reveal";
import { config, name } from "@/content/config";
import { closingLines, endingCta, endingReveal, signOff } from "@/content/ending";
import { easeOutExpo } from "@/lib/motion";
import { useExperience } from "@/lib/store";
import { useReducedMotion } from "@/lib/useMotionPreference";

/**
 * The last part.
 *
 * The lines arrive one at a time on scroll rather than all at once —
 * ten sentences dropped in as a block reads as a paragraph, and this
 * needs to read as someone speaking slowly.
 *
 * The button reveals rather than submits. Nothing is sent, nothing is
 * recorded beyond a local flag, and the revealed text closes the loop
 * instead of opening one.
 */
export function Ending() {
  const reduced = useReducedMotion();
  const storyOpened = useExperience((s) => s.storyOpened);
  const openStory = useExperience((s) => s.openStory);

  return (
    <Chapter
      id="ending"
      index="08"
      title="The Last Part"
      className="flex items-center py-32 sm:py-40"
      fullHeight
    >
      <ChapterInner>
        <Reveal>
          <ChapterEyebrow index="08" title="The Last Part" />
        </Reveal>

        <div className="mt-12 max-w-3xl space-y-4">
          {closingLines.map((line, i) => (
            <motion.p
              key={line}
              initial={reduced ? false : { opacity: 0, y: 18, filter: "blur(5px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.9 }}
              transition={{ duration: 1, ease: easeOutExpo }}
              className={
                // The two lines that carry the chapter get display type;
                // everything else stays quiet so they can land.
                i === 3 || i === 6
                  ? "font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.1] tracking-[-0.02em] text-ember-gradient"
                  : "text-[clamp(1.05rem,2.2vw,1.4rem)] leading-relaxed text-porcelain-dim"
              }
            >
              {line}
            </motion.p>
          ))}
        </div>

        {/* ── The button ───────────────────────────────────────────── */}
        <Reveal>
          <div className="mt-14">
            {!storyOpened ? (
              <button
                type="button"
                onClick={openStory}
                className="group relative overflow-hidden rounded-full bg-porcelain px-8 py-4 text-[15px] font-medium text-ink-950 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03] active:scale-[0.99]"
              >
                <span className="relative z-10">{endingCta}</span>
                {!reduced && (
                  <span
                    aria-hidden
                    className="absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/50 opacity-0 transition-opacity group-hover:opacity-100"
                    style={{ animation: "sheen 1.6s var(--ease-out-expo) infinite" }}
                  />
                )}
              </button>
            ) : (
              <AnimatePresence>
                <motion.div
                  initial={reduced ? false : { opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, ease: easeOutExpo }}
                  className="glass max-w-2xl rounded-3xl p-8 sm:p-10"
                >
                  <p className="text-ember-gradient font-display text-[clamp(1.9rem,4.4vw,3rem)] leading-[1.06]">
                    {endingReveal.headline}
                  </p>

                  {endingReveal.body.map((paragraph, i) => (
                    <motion.p
                      key={paragraph}
                      initial={reduced ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 1,
                        delay: reduced ? 0 : 0.4 + i * 0.35,
                      }}
                      className="measure-wide mt-5 text-[16px] leading-relaxed text-porcelain"
                    >
                      {paragraph}
                    </motion.p>
                  ))}

                  <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.16em] text-porcelain-faint">
                    {endingReveal.footer}
                  </p>

                  {config.contact.href && (
                    <a
                      href={config.contact.href}
                      className="mt-7 inline-flex items-center gap-2 rounded-full border border-porcelain/14 px-6 py-3 text-sm text-porcelain-dim transition-colors duration-500 hover:border-ember-400/40 hover:text-porcelain"
                    >
                      {config.contact.label}
                      <ArrowUpRight className="size-4" />
                    </a>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </Reveal>

        {/* ── Sign-off ─────────────────────────────────────────────── */}
        <Reveal>
          <div className="mt-24">
            <div aria-hidden className="hairline h-px w-full" />
            <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
              <p className="font-display text-2xl italic leading-snug text-porcelain-dim">
                {signOff}
              </p>
              <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-porcelain-faint">
                built slowly
                <br />
                for {name("one person")}
                {config.senderName ? (
                  <>
                    <br />
                    by {config.senderName}
                  </>
                ) : null}
              </p>
            </div>
          </div>
        </Reveal>
      </ChapterInner>
    </Chapter>
  );
}
