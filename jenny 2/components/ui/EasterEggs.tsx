"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Star, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { easeOutExpo } from "@/lib/motion";
import { useExperience } from "@/lib/store";
import { useSecretWord } from "@/lib/useSecretWord";
import { useReducedMotion } from "@/lib/useMotionPreference";

/* ------------------------------------------------------------------
   Everything hidden, in one place.

   Design rule for all of these: nothing an egg unlocks may be required
   to understand the piece, and nothing may fire without her doing
   something deliberate. A surprise that interrupts is just a popup.
------------------------------------------------------------------ */

export function EasterEggs() {
  return (
    <>
      <HiddenStar />
      <Konami />
      <DriveBy />
    </>
  );
}

/* ── The star ─────────────────────────────────────────────────────
   Small, slowly pulsing, parked low on the page where a curious
   person scrolling will eventually catch it moving. Typing "slowly"
   is the backstop for anyone who never does.
------------------------------------------------------------------ */

function HiddenStar() {
  const unlocked = useExperience((s) => s.roomUnlocked);
  const unlockRoom = useExperience((s) => s.unlockRoom);
  const collectEgg = useExperience((s) => s.collectEgg);
  const hasEntered = useExperience((s) => s.hasEntered);
  const [announced, setAnnounced] = useState(false);

  const open = useCallback(
    (via: string) => {
      if (unlocked) return;
      collectEgg(via);
      unlockRoom();
      setAnnounced(true);
    },
    [unlocked, unlockRoom, collectEgg],
  );

  useSecretWord("slowly", () => open("typed-slowly"));

  useEffect(() => {
    if (!announced) return;
    const t = setTimeout(() => setAnnounced(false), 9000);
    return () => clearTimeout(t);
  }, [announced]);

  return (
    <>
      {hasEntered && !unlocked && (
        <button
          type="button"
          onClick={() => open("found-star")}
          aria-label="A small star. Nothing depends on it."
          className="group fixed bottom-8 left-6 z-40 grid size-8 place-items-center rounded-full sm:left-8"
        >
          <Star
            className="size-3 text-ember-400/45 transition-all duration-700 group-hover:scale-125 group-hover:text-ember-300"
            strokeWidth={1.4}
            style={{ animation: "caret-blink 4.5s ease-in-out infinite" }}
          />
        </button>
      )}

      <AnimatePresence>
        {announced && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.8, ease: easeOutExpo }}
            className="fixed bottom-6 left-1/2 z-50 w-[min(26rem,calc(100vw-2rem))] -translate-x-1/2"
          >
            <a
              href="#room"
              onClick={() => setAnnounced(false)}
              className="glass glass-hover flex items-center gap-4 rounded-2xl px-5 py-4"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-full border border-ember-400/30 bg-ember-400/10">
                <Star className="size-4 fill-ember-400/30 text-ember-400" strokeWidth={1.4} />
              </span>
              <span className="min-w-0">
                <span className="block text-[14px] text-porcelain">
                  Something opened.
                </span>
                <span className="block text-[12.5px] text-porcelain-faint">
                  Chapter 07, between the dashboard and the end.
                </span>
              </span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Konami ───────────────────────────────────────────────────────
   ↑ ↑ ↓ ↓ ← → ← → B A. Opens a panel that is deliberately the least
   serious thing on the site.
------------------------------------------------------------------ */

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

function Konami() {
  const [open, setOpen] = useState(false);
  const collectEgg = useExperience((s) => s.collectEgg);
  const bufferRef = useRef<string[]>([]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const el = event.target as HTMLElement | null;
      if (el && (el.isContentEditable || el.tagName === "INPUT")) return;

      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      bufferRef.current = [...bufferRef.current, key].slice(-KONAMI.length);

      if (bufferRef.current.join(",") === KONAMI.join(",")) {
        bufferRef.current = [];
        collectEgg("konami");
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [collectEgg]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[60] grid place-items-center bg-ink-950/80 p-6 backdrop-blur-md"
          onClick={() => setOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-label="You entered the Konami code"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.7, ease: easeOutExpo }}
            onClick={(e) => e.stopPropagation()}
            className="glass relative w-full max-w-lg rounded-3xl p-8 sm:p-10"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-5 top-5 text-porcelain-faint transition-colors hover:text-porcelain"
            >
              <X className="size-4" />
            </button>

            <span className="label text-ember-500/80">Achievement unlocked</span>
            <p className="text-ember-gradient mt-4 font-display text-[clamp(2rem,5vw,3rem)] leading-[1.05]">
              You entered the Konami code.
            </p>
            <p className="measure-wide mt-5 text-[15.5px] leading-relaxed text-porcelain">
              On a website built for one person. By a project manager. Who
              spent his evenings on it instead of sleeping.
            </p>
            <p className="measure-wide mt-4 text-[15.5px] leading-relaxed text-porcelain-dim">
              I put this in expecting nobody would ever find it, which is the
              only honest reason to put anything in. Well done. There is no
              prize and I refuse to pretend otherwise.
            </p>
            <p className="mt-7 font-mono text-[11px] uppercase tracking-[0.16em] text-porcelain-faint">
              ↑ ↑ ↓ ↓ ← → ← → b a · no reward · entirely worth it
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── The car ──────────────────────────────────────────────────────
   Two headlight smears crossing the bottom of the screen, at long
   random intervals. Never on load, never twice in quick succession,
   and never when motion is reduced.
------------------------------------------------------------------ */

function DriveBy() {
  const reduced = useReducedMotion();
  const hasEntered = useExperience((s) => s.hasEntered);
  const collectEgg = useExperience((s) => s.collectEgg);
  const [driving, setDriving] = useState(false);

  useEffect(() => {
    if (reduced || !hasEntered) return;

    let timer: ReturnType<typeof setTimeout>;

    const schedule = () => {
      // Long gaps. If it were frequent it would be a decoration; at
      // this spacing it reads as something you happened to catch.
      timer = setTimeout(
        () => {
          setDriving(true);
          collectEgg("saw-the-car");
          setTimeout(() => {
            setDriving(false);
            schedule();
          }, 7000);
        },
        45000 + Math.random() * 70000,
      );
    };

    schedule();
    return () => clearTimeout(timer);
  }, [reduced, hasEntered, collectEgg]);

  if (!driving) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed bottom-[12vh] left-0 z-10 w-full overflow-hidden"
    >
      <div
        className="flex items-center gap-3"
        style={{ animation: "drive-by 6.5s cubic-bezier(0.4, 0, 0.6, 1) forwards" }}
      >
        <span className="h-[3px] w-24 rounded-full bg-gradient-to-r from-transparent to-ember-300/70 blur-[2px]" />
        <span className="size-[5px] rounded-full bg-ember-100 shadow-[0_0_18px_6px_rgba(230,217,195,0.35)]" />
        <span className="size-[5px] rounded-full bg-ember-100 shadow-[0_0_18px_6px_rgba(230,217,195,0.35)]" />
        <span className="h-[2px] w-16 rounded-full bg-gradient-to-r from-ember-600/50 to-transparent blur-[3px]" />
      </div>
    </div>
  );
}

/* ── Hover words ──────────────────────────────────────────────────
   Wrap a word anywhere in the copy to hang a small aside off it.
   Keyboard-reachable, because a secret only mouse users can reach is
   a bug wearing a costume.
------------------------------------------------------------------ */

export function Aside({
  children,
  note,
}: {
  children: React.ReactNode;
  note: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="cursor-help underline decoration-ember-500/40 decoration-dotted underline-offset-4 transition-colors hover:text-ember-300"
      >
        {children}
      </button>

      <AnimatePresence>
        {open && (
          <motion.span
            role="note"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.35, ease: easeOutExpo }}
            className="glass absolute bottom-full left-1/2 z-30 mb-2 w-56 -translate-x-1/2 rounded-xl px-3.5 py-2.5 text-[12.5px] font-normal not-italic leading-relaxed text-porcelain-dim"
          >
            {note}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
