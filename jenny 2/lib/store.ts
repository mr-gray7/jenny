"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/* ------------------------------------------------------------------
   Everything she does here is stored in her own browser and nowhere
   else. No network calls, no analytics, no database. That is a design
   decision, not a shortcut — the piece is about trust, so it would be
   incoherent to quietly collect her answers while saying so.
   The one place this shows up in the UI is the personality scan,
   which says it out loud before it runs.
------------------------------------------------------------------ */

export type Mood = "night" | "dawn";

export interface ExperienceState {
  /** Chapter currently filling the viewport. */
  activeChapter: string;
  /** Chapters she has actually reached, in order. */
  visited: string[];
  /** Overture finished — unlocks the rest of the page. */
  hasEntered: boolean;

  /** Chapter 02 — the personality scan has been run at least once. */
  scanRun: boolean;

  /** Chapter 03 — which "noticed" cards have been turned over. */
  flipped: string[];

  /** Chapter 05 — Perfect Weekend Builder selections. */
  weekend: Record<string, string>;
  weekendGenerated: boolean;

  /** Chapter 07 — notes read in the hidden room. */
  foundNotes: string[];
  roomUnlocked: boolean;

  /** "Correct My Heart" — she fixed the sentence. */
  heartCorrected: boolean;

  /** Small rewards for curiosity. */
  eggs: string[];

  /** Final chapter — whether she opened the closing message. */
  storyOpened: boolean;

  /** The moon easter egg. Still dark either way. */
  mood: Mood;

  /** Her own override of the motion setting, independent of the OS. */
  motionOverride: "system" | "reduced" | "full";

  setActiveChapter: (id: string) => void;
  visit: (id: string) => void;
  enter: () => void;
  runScan: () => void;
  correctHeart: () => void;
  flip: (id: string) => void;
  setWeekend: (slot: string, value: string) => void;
  generateWeekend: () => void;
  findNote: (id: string) => void;
  unlockRoom: () => void;
  collectEgg: (id: string) => void;
  openStory: () => void;
  setMood: (mood: Mood) => void;
  setMotionOverride: (m: "system" | "reduced" | "full") => void;
  reset: () => void;
}

const initial = {
  activeChapter: "overture",
  visited: [] as string[],
  hasEntered: false,
  scanRun: false,
  flipped: [] as string[],
  weekend: {} as Record<string, string>,
  weekendGenerated: false,
  foundNotes: [] as string[],
  roomUnlocked: false,
  heartCorrected: false,
  eggs: [] as string[],
  storyOpened: false,
  mood: "night" as Mood,
  motionOverride: "system" as const,
};

const pushUnique = (list: string[], id: string) =>
  list.includes(id) ? list : [...list, id];

export const useExperience = create<ExperienceState>()(
  persist(
    (set) => ({
      ...initial,

      setActiveChapter: (id) =>
        set((s) =>
          s.activeChapter === id
            ? s
            : { activeChapter: id, visited: pushUnique(s.visited, id) },
        ),
      visit: (id) => set((s) => ({ visited: pushUnique(s.visited, id) })),
      enter: () => set({ hasEntered: true }),

      runScan: () => set({ scanRun: true }),
      correctHeart: () => set({ heartCorrected: true }),

      flip: (id) => set((s) => ({ flipped: pushUnique(s.flipped, id) })),

      setWeekend: (slot, value) =>
        set((s) => ({ weekend: { ...s.weekend, [slot]: value } })),
      generateWeekend: () => set({ weekendGenerated: true }),

      findNote: (id) => set((s) => ({ foundNotes: pushUnique(s.foundNotes, id) })),
      unlockRoom: () => set({ roomUnlocked: true }),

      collectEgg: (id) => set((s) => ({ eggs: pushUnique(s.eggs, id) })),

      openStory: () => set({ storyOpened: true }),
      setMood: (mood) => set({ mood }),
      setMotionOverride: (motionOverride) => set({ motionOverride }),

      reset: () => set({ ...initial }),
    }),
    {
      name: "built-slowly",
      storage: createJSONStorage(() => localStorage),
      version: 2,
      // activeChapter is derived from scroll position, so it should not
      // be restored — otherwise the rail lights up a chapter she is
      // nowhere near on reload.
      partialize: ({ activeChapter: _activeChapter, ...rest }) => rest,
    },
  ),
);

/** True once the persisted state has been read from localStorage.
 *  Guards against hydration mismatches on anything that renders
 *  differently for a returning visitor — the server has no idea she
 *  has been here before, so the first paint must not assume it. */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (useExperience.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    return useExperience.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  return hydrated;
}
