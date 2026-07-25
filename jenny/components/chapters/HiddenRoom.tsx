"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Star } from "lucide-react";
import { CorrectMyHeart } from "@/components/CorrectMyHeart";
import { Chapter, ChapterEyebrow, ChapterInner } from "@/components/ui/Chapter";
import { Reveal } from "@/components/ui/Reveal";
import { notes, roomIntro } from "@/content/room";
import { easeOutExpo } from "@/lib/motion";
import { useExperience } from "@/lib/store";
import { useReducedMotion } from "@/lib/useMotionPreference";

/**
 * Chapter 07 — Things I Never Said.
 *
 * Renders nothing at all until the star has been found, so there is no
 * locked door teasing her into hunting for a key. A hidden chapter that
 * advertises itself is just a chapter with an extra click.
 */
export function HiddenRoom() {
  const reduced = useReducedMotion();
  const unlocked = useExperience((s) => s.roomUnlocked);
  const foundNotes = useExperience((s) => s.foundNotes);
  const findNote = useExperience((s) => s.findNote);

  if (!unlocked) return null;

  return (
    <Chapter
      id="room"
      index="07"
      title="Things I Never Said"
      className="py-28 sm:py-36"
      fullHeight={false}
    >
      <ChapterInner>
        <Reveal>
          <ChapterEyebrow index="07" title="Things I Never Said" />
          <div className="mt-6 flex items-center gap-3">
            <Star className="size-6 shrink-0 fill-ember-400/25 text-ember-400" strokeWidth={1.3} />
            <p className="text-ember-gradient font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.02] tracking-[-0.02em]">
              {roomIntro.title}
            </p>
          </div>
          <p className="measure-wide mt-5 text-[15px] leading-relaxed text-porcelain-dim">
            {roomIntro.body}
          </p>
        </Reveal>

        {/* ── The notes ────────────────────────────────────────────── */}
        <div className="mt-12 space-y-3">
          {notes.map((note, i) => {
            const open = foundNotes.includes(note.id);
            return (
              <Reveal key={note.id} size="small" delay={i * 0.04}>
                <div className="glass overflow-hidden rounded-2xl">
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => findNote(note.id)}
                    className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
                  >
                    <span className="flex items-center gap-4">
                      <span className="font-mono text-[11px] text-ember-400/50">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-xl text-porcelain sm:text-2xl">
                        {note.spine}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className={`shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
                        open
                          ? "text-porcelain-faint"
                          : "text-porcelain-faint group-hover:text-porcelain-dim"
                      }`}
                    >
                      {open ? "—" : "Open"}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={reduced ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduced ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.7, ease: easeOutExpo }}
                        className="overflow-hidden"
                      >
                        <p className="measure-wide px-5 pb-6 text-[16px] leading-relaxed text-porcelain sm:px-6 sm:pl-[3.9rem]">
                          {note.body}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* ── Correct my heart ─────────────────────────────────────── */}
        <Reveal>
          <div className="mt-12">
            <CorrectMyHeart />
          </div>
        </Reveal>
      </ChapterInner>
    </Chapter>
  );
}
