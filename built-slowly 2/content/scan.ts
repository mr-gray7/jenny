/* ------------------------------------------------------------------
   Chapter 02 — AI Personality Scan

   Loading, then eight ticks, then the conclusion.

   One framing decision worth keeping: the scan does not start on its
   own. She presses the button. A machine that begins analysing a
   person the moment they walk past is a different and worse object
   than one that waits to be asked — same pixels, opposite manners.

   And the note at the bottom admits what it is. That admission is
   what keeps the chapter from being a horoscope.
------------------------------------------------------------------ */

export interface ScanTrait {
  id: string;
  label: string;
  note?: string;
  /** ms into the scan when this line lands. */
  at: number;
}

export const traits: ScanTrait[] = [
  { id: "teacher", label: "Teacher", note: "Confirmed. Many times over.", at: 400 },
  { id: "kind", label: "Kind", note: "Even when it costs you something.", at: 900 },
  {
    id: "talkative",
    label: "Talkative",
    note: "No complaints from this side.",
    at: 1400,
  },
  {
    id: "funny",
    label: "Funny",
    note: "Faster than most people can keep up with.",
    at: 1900,
  },
  {
    id: "childish",
    label: "Sometimes behaves like a kid",
    note: "Marked as a feature. Not a defect.",
    at: 2450,
  },
  {
    id: "protective",
    label: "Protective of her heart",
    note: "Completely fair. Nobody has to explain that to me.",
    at: 3000,
  },
  {
    id: "peace",
    label: "Searching for peace",
    note: "Reasonable. And long overdue.",
    at: 3550,
  },
  {
    id: "trust",
    label: "Trust requires patience",
    note: "Understood. No objection from my side.",
    at: 4150,
  },
];

/** Cycled under the progress bar while the scan runs. */
export const scanStatuses = [
  "Starting up…",
  "Reading two years of evidence…",
  "Going through everything you have said…",
  "Removing my own assumptions…",
  "Checking for shortcuts…",
  "Almost done…",
];

export const scanIntro = {
  title: "A completely\nunscientific scan.",
  body: "It takes about five seconds and it does not ask you a single question, so you can imagine how rigorous it is.",
  cta: "Run the scan",
  again: "Run it again",
};

export const scanResult = {
  label: "AI Conclusion",
  headline: "Definitely worth knowing better.",
  sub: "No shortcuts found. Trust builds one moment at a time.",
  /** The admission. This is the line that makes the chapter honest. */
  honesty:
    "There is no algorithm here, obviously. It is eight things I already knew, arranged to look like a machine worked them out. The only real finding is that I did not have to think hard about any of them.",
};
