"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Gauge, Moon, RotateCcw, Sunrise, Volume2, VolumeX, Waves, X } from "lucide-react";
import { useEffect, useState } from "react";
import { easeOutExpo } from "@/lib/motion";
import { useExperience } from "@/lib/store";
import { useAmbience } from "@/lib/useAmbience";

/**
 * The corner controls: sound, mood, and settings.
 *
 * Sound sits outside the settings panel because the PRD asks for a
 * visible mute, and a mute button you have to open a menu to find is
 * not a visible mute.
 *
 * The moon is an easter egg that also happens to be a legitimate
 * control, which is the best kind — nobody has to find it for the page
 * to work, and finding it does something real.
 */
export function Controls() {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const { playing, ready, toggle: toggleSound } = useAmbience();

  const motionOverride = useExperience((s) => s.motionOverride);
  const setMotionOverride = useExperience((s) => s.setMotionOverride);
  const mood = useExperience((s) => s.mood);
  const setMood = useExperience((s) => s.setMood);
  const collectEgg = useExperience((s) => s.collectEgg);
  const reset = useExperience((s) => s.reset);

  // The mood lives on the root element so plain CSS can switch the
  // custom properties without every component subscribing to it.
  useEffect(() => {
    document.documentElement.dataset.mood = mood;
  }, [mood]);

  const options = [
    { value: "system", label: "System" },
    { value: "full", label: "Full" },
    { value: "reduced", label: "Calm" },
  ] as const;

  return (
    <div className="fixed right-4 top-4 z-50 flex flex-col items-end gap-2 sm:right-6 sm:top-6">
      <div className="flex items-center gap-2">
        {/* Moon / dawn */}
        <button
          type="button"
          onClick={() => {
            setMood(mood === "night" ? "dawn" : "night");
            collectEgg("moon");
          }}
          aria-label={
            mood === "night" ? "Warm the page towards dawn" : "Return to night"
          }
          className="glass glass-hover grid size-10 place-items-center rounded-full text-porcelain-dim transition-colors hover:text-ember-300"
        >
          {mood === "night" ? (
            <Moon className="size-4" strokeWidth={1.6} />
          ) : (
            <Sunrise className="size-4" strokeWidth={1.6} />
          )}
        </button>

        {/* Sound — never autoplays; this is the only way it ever starts */}
        {ready && (
          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={playing}
            aria-label={playing ? "Mute the rain" : "Play rain and piano"}
            className="glass glass-hover grid size-10 place-items-center rounded-full text-porcelain-dim transition-colors hover:text-porcelain"
          >
            {playing ? (
              <Volume2 className="size-4" strokeWidth={1.6} />
            ) : (
              <VolumeX className="size-4" strokeWidth={1.6} />
            )}
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            setOpen((v) => !v);
            setConfirming(false);
          }}
          aria-expanded={open}
          aria-label={open ? "Close settings" : "Open settings"}
          className="glass glass-hover grid size-10 place-items-center rounded-full text-porcelain-dim transition-colors hover:text-porcelain"
        >
          {open ? <X className="size-4" /> : <Gauge className="size-4" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.4, ease: easeOutExpo }}
            className="glass w-64 origin-top-right rounded-2xl p-4"
          >
            <div className="flex items-center gap-2">
              <Waves className="size-3.5 text-ember-500" />
              <span className="label">Motion</span>
            </div>

            <div
              role="radiogroup"
              aria-label="Motion preference"
              className="mt-3 grid grid-cols-3 gap-1 rounded-full bg-ink-950/60 p-1"
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={motionOverride === option.value}
                  onClick={() => setMotionOverride(option.value)}
                  className={`rounded-full px-2 py-1.5 text-xs transition-colors duration-300 ${
                    motionOverride === option.value
                      ? "bg-ember-500/15 text-ember-300"
                      : "text-porcelain-faint hover:text-porcelain-dim"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div aria-hidden className="hairline my-4 h-px w-full" />

            <p className="text-xs leading-relaxed text-porcelain-faint">
              Everything you do here stays in this browser. Nothing is sent
              anywhere, and this button erases all of it.
            </p>

            <button
              type="button"
              onClick={() => {
                if (!confirming) {
                  setConfirming(true);
                  return;
                }
                reset();
                setConfirming(false);
                setOpen(false);
                window.scrollTo({ top: 0, behavior: "auto" });
              }}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-porcelain/10 py-2 text-xs text-porcelain-dim transition-colors hover:border-ember-500/30 hover:text-porcelain"
            >
              <RotateCcw className="size-3" />
              {confirming ? "Tap again to erase" : "Start over"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
