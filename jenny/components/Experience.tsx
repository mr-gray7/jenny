"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Atmosphere } from "@/components/ui/Atmosphere";
import { Controls } from "@/components/ui/Controls";
import { EasterEggs } from "@/components/ui/EasterEggs";
import { ProgressRail } from "@/components/ui/ProgressRail";
import { Overture } from "@/components/chapters/Overture";
import { Timeline } from "@/components/chapters/Timeline";
import { Scan } from "@/components/chapters/Scan";
import { Noticed } from "@/components/chapters/Noticed";
import { About } from "@/components/chapters/About";
import { WeekendBuilder } from "@/components/chapters/WeekendBuilder";
import { Dashboard } from "@/components/chapters/Dashboard";
import { HiddenRoom } from "@/components/chapters/HiddenRoom";
import { Ending } from "@/components/chapters/Ending";
import { easeOutExpo } from "@/lib/motion";
import { useExperience } from "@/lib/store";

/**
 * The whole story, assembled.
 *
 * Structural decision worth naming: everything after the landing screen
 * is mounted but hidden until she chooses to begin. Not lazy-loaded on
 * scroll — mounted — so the browser has laid it all out before she
 * reaches it and nothing pops in late. The page is small enough to
 * afford that, and the payoff is a scroll with no seams.
 */
export function Experience() {
  const hasEntered = useExperience((s) => s.hasEntered);

  return (
    <>
      <Atmosphere />
      <Controls />
      <EasterEggs />

      <main className="relative">
        <Overture />

        <AnimatePresence>
          {hasEntered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.4, ease: easeOutExpo }}
            >
              <Timeline />
              <Scan />
              <Noticed />
              <About />
              <WeekendBuilder />
              <Dashboard />
              <HiddenRoom />
              <Ending />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* After <main> in the DOM, fixed to the left visually. Putting the
          chapter links before the content would force every keyboard
          user through them to reach the story, which is exactly the
          problem a skip link exists to paper over. Ordering it
          correctly means no skip link is needed. */}
      <ProgressRail />
    </>
  );
}
