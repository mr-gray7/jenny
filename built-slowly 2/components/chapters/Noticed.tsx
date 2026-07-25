"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Eye } from "lucide-react";
import { Chapter, ChapterEyebrow, ChapterInner } from "@/components/ui/Chapter";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { noticedCards, noticedComplete, noticedIntro } from "@/content/noticed";
import { easeOutExpo } from "@/lib/motion";
import { useExperience } from "@/lib/store";
import { useReducedMotion } from "@/lib/useMotionPreference";

/**
 * Chapter 03 — flip cards.
 *
 * Each card is a real button: it toggles, it announces its state, and
 * it works from the keyboard. The 3D flip is decoration on top of a
 * plain disclosure widget, so with motion reduced it simply crossfades.
 */
export function Noticed() {
  const flipped = useExperience((s) => s.flipped);
  const allTurned = flipped.length === noticedCards.length;

  return (
    <Chapter
      id="noticed"
      index="03"
      title="Things I Noticed"
      className="py-28 sm:py-36"
      fullHeight={false}
    >
      <ChapterInner>
        <Reveal>
          <ChapterEyebrow index="03" title="Things I Noticed" />
          <p className="text-gradient mt-6 max-w-2xl whitespace-pre-line font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.02] tracking-[-0.02em]">
            {noticedIntro.title}
          </p>
          <p className="measure-wide mt-5 text-[15px] leading-relaxed text-porcelain-dim">
            {noticedIntro.body}
          </p>
          <p className="mt-6 flex items-center gap-2 text-xs text-porcelain-faint">
            <Eye className="size-3.5" />
            {noticedIntro.hint}
          </p>
        </Reveal>

        <RevealGroup
          className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          step={0.06}
        >
          {noticedCards.map((card) => (
            <RevealItem key={card.id}>
              <FlipCard card={card} />
            </RevealItem>
          ))}
        </RevealGroup>

        <AnimatePresence>
          {allTurned && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: easeOutExpo }}
              className="measure-wide mx-auto mt-14 text-center font-display text-xl italic leading-snug text-porcelain-dim"
            >
              {noticedComplete}
            </motion.p>
          )}
        </AnimatePresence>
      </ChapterInner>
    </Chapter>
  );
}

function FlipCard({ card }: { card: (typeof noticedCards)[number] }) {
  const reduced = useReducedMotion();
  const flipped = useExperience((s) => s.flipped);
  const flip = useExperience((s) => s.flip);
  const isFlipped = flipped.includes(card.id);

  return (
    <button
      type="button"
      aria-expanded={isFlipped}
      onClick={() => flip(card.id)}
      className="group relative block h-56 w-full text-left [perspective:1400px]"
    >
      <motion.div
        className="relative size-full [transform-style:preserve-3d]"
        initial={false}
        animate={{ rotateY: isFlipped && !reduced ? 180 : 0 }}
        transition={{ duration: 0.9, ease: easeOutExpo }}
      >
        {/* Front */}
        <span
          className={`glass glass-hover absolute inset-0 flex flex-col justify-between rounded-2xl p-5 [backface-visibility:hidden] ${
            reduced && isFlipped ? "opacity-0" : "opacity-100"
          }`}
        >
          <span className="label text-ember-400/50">
            {String(noticedCards.indexOf(card) + 1).padStart(2, "0")}
          </span>
          <span className="font-display text-[1.6rem] leading-[1.12] text-porcelain">
            {card.front}
          </span>
          <span className="label transition-colors group-hover:text-porcelain-dim">
            Turn over
          </span>
        </span>

        {/* Back */}
        <span
          className={`absolute inset-0 flex items-center rounded-2xl border border-rose-400/25 bg-gradient-to-br from-rose-600/14 via-ember-600/10 to-violet-600/14 p-5 backdrop-blur-xl [backface-visibility:hidden] ${
            reduced
              ? isFlipped
                ? "opacity-100"
                : "opacity-0"
              : "[transform:rotateY(180deg)]"
          }`}
        >
          <span className="text-[14.5px] leading-relaxed text-ember-100">
            {card.back}
          </span>
        </span>
      </motion.div>
    </button>
  );
}
