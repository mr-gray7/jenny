/* ------------------------------------------------------------------
   Chapter 02 — Personality Scan

   The PRD asks for a futuristic scan with a loading animation and a
   checklist of results. Built as specified.

   One framing decision worth keeping: the scan does not start on its
   own. She presses the button. A machine that begins analysing a
   person the moment they scroll past is a different, worse object than
   one that waits to be asked — same pixels, opposite manners.

   And the punchline is honest about itself. The last line of the
   readout admits there is no algorithm here, which is what stops the
   whole chapter from being a horoscope.
------------------------------------------------------------------ */

export interface ScanTrait {
  id: string;
  label: string;
  /** Appears under the trait once the line resolves. Optional. */
  note?: string;
  /** ms into the scan when this line lands. */
  at: number;
}

export const traits: ScanTrait[] = [
  { id: "teacher", label: "Teacher", note: "Confirmed. Repeatedly.", at: 400 },
  { id: "kind", label: "Kind", note: "Even when it costs you something.", at: 900 },
  { id: "funny", label: "Funny", note: "Faster than most people can keep up with.", at: 1400 },
  { id: "talkative", label: "Talkative", note: "No complaints filed.", at: 1900 },
  {
    id: "childish",
    label: "Sometimes behaves like a kid",
    note: "Flagged as a feature. Not a defect.",
    at: 2450,
  },
  { id: "strong", label: "Strong", note: "The quiet kind, which is the harder kind.", at: 3000 },
  {
    id: "peace",
    label: "Searching for peace",
    note: "Reasonable. Long overdue.",
    at: 3550,
  },
  {
    id: "trust",
    label: "Trust requires patience",
    note: "Understood. No objection raised.",
    at: 4150,
  },
];

/** Cycled under the progress bar while the scan runs. */
export const scanStatuses = [
  "Establishing connection…",
  "Reading two years of evidence…",
  "Cross-referencing everything you've said…",
  "Discarding assumptions…",
  "Checking for shortcuts…",
  "Compiling results…",
];

export const scanIntro = {
  title: "A completely\nunscientific scan.",
  body: "It takes about five seconds and it doesn't ask you a single question, which should tell you roughly how rigorous it is.",
  cta: "Run the scan",
  again: "Run it again",
};

export const scanResult = {
  headline: "No shortcuts detected.",
  sub: "Trust builds one moment at a time.",
  /** The admission. This is the line that makes the chapter honest. */
  honesty:
    "There's no algorithm behind this, obviously. It's eight things I already knew, arranged to look like a machine worked them out. The only real finding is that none of them took any effort to remember.",
};
