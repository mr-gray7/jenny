"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { chapters } from "@/content/chapters";
import { useExperience } from "@/lib/store";
import { easeOutExpo } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useMotionPreference";

/**
 * A thin rail down the left edge. Deliberately not a navbar — a navbar
 * would make this feel like a website. It reads as a film's chapter
 * scrubber: mostly invisible, informative on approach.
 *
 * The hidden room's dot only appears once she has found it.
 */
export function ProgressRail() {
  const active = useExperience((s) => s.activeChapter);
  const hasEntered = useExperience((s) => s.hasEntered);
  const roomUnlocked = useExperience((s) => s.roomUnlocked);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  });

  const visible = chapters.filter((c) => !c.secret || roomUnlocked);

  return (
    <AnimatePresence>
      {hasEntered && (
        <motion.nav
          aria-label="Chapters"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 1, ease: easeOutExpo, delay: 0.4 }}
          className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
        >
          {/* The travelled line */}
          <div className="absolute left-[7px] top-0 h-full w-px bg-porcelain/10">
            <motion.div
              className="h-full w-full origin-top bg-gradient-to-b from-ember-400/70 to-ember-600/20"
              style={{ scaleY: reduced ? 1 : progress }}
            />
          </div>

          <ul className="relative flex flex-col gap-5 py-1">
            {visible.map((chapter) => {
              const isActive = active === chapter.id;
              return (
                <li key={chapter.id}>
                  <a
                    href={`#${chapter.id}`}
                    className="group flex items-center gap-3"
                    aria-current={isActive ? "true" : undefined}
                  >
                    <span
                      aria-hidden
                      className={`relative z-10 block size-[15px] shrink-0 rounded-full border transition-all duration-500 ${
                        isActive
                          ? "border-ember-400 bg-ember-400/25 scale-100"
                          : "border-porcelain/20 bg-ink-950 scale-[0.55] group-hover:scale-75 group-hover:border-porcelain/45"
                      }`}
                    >
                      {isActive && (
                        <span className="absolute inset-[3px] rounded-full bg-ember-400" />
                      )}
                    </span>

                    <span
                      className={`whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.16em] transition-all duration-500 ${
                        isActive
                          ? "text-porcelain-dim opacity-100"
                          : "-translate-x-1 text-porcelain-faint opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                      }`}
                    >
                      {chapter.title}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
