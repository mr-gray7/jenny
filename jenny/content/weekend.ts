/* ------------------------------------------------------------------
   Chapter 05 — Perfect Weekend Builder

   Three choices: time of day, where, and what's in it. Every option
   carries three things — a reaction that fires the moment she picks
   it, a clause for the final write-up, and a colour the page shifts
   towards.

   The clauses are written to follow one another rather than being
   slotted into a template. A mail merge always reads like a mail
   merge; the whole point of this chapter is that it doesn't.
------------------------------------------------------------------ */

export interface WeekendOption {
  id: string;
  label: string;
  /** Fires immediately on selection. The PRD's "Excellent choice." beat. */
  reaction: string;
  /** One clause of the final write-up. */
  line: string;
  /** Two hex stops the ambient wash shifts towards. Kept dark. */
  tint: [string, string];
}

export interface WeekendSlot {
  id: string;
  field: string;
  question: string;
  options: WeekendOption[];
}

export const slots: WeekendSlot[] = [
  {
    id: "time",
    field: "when",
    question: "Morning, evening, or night?",
    options: [
      {
        id: "morning",
        label: "Morning",
        reaction: "Ambitious. I'll bring the coffee and say very little until it works.",
        line: "It starts in the morning, early enough that the roads are still empty and neither of us is properly talking yet.",
        tint: ["#2a2018", "#0b0b0b"],
      },
      {
        id: "evening",
        label: "Evening",
        reaction: "The correct answer, and the one I'd have picked.",
        line: "It starts in the evening, at the hour where the light goes gold for about twenty minutes and everyone pretends not to notice.",
        tint: ["#2e2114", "#0b0b0b"],
      },
      {
        id: "night",
        label: "Night",
        reaction: "Now you're speaking my language.",
        line: "It starts late — properly late, the part of the night where the city has finally stopped performing.",
        tint: ["#141821", "#0b0b0b"],
      },
    ],
  },
  {
    id: "where",
    field: "where",
    question: "And where does it go?",
    options: [
      {
        id: "drive",
        label: "Long drive",
        reaction: "Excellent choice. Bonus points if it's raining.",
        line: "There's a long drive in it. No destination worth naming — an hour out, an hour back, the conversation doing all the work.",
        tint: ["#1d1a14", "#0b0b0b"],
      },
      {
        id: "mountains",
        label: "Mountains",
        reaction: "Good. Cold air fixes an unreasonable number of things.",
        line: "We end up somewhere high and cold, staying about twenty minutes longer than either of us planned.",
        tint: ["#161b1a", "#0b0b0b"],
      },
      {
        id: "rain",
        label: "Somewhere it's raining",
        reaction: "Rain it is. Best sound in the world through a windscreen.",
        line: "It rains the whole way through, which improves it. Everything sounds better from inside something dry.",
        tint: ["#131a1e", "#0b0b0b"],
      },
      {
        id: "home",
        label: "Nowhere. Stay in.",
        reaction: "Also correct. I'd normally argue and on this occasion I won't.",
        line: "We don't go anywhere. The car stays where it is and so do we, and it turns out to be the better plan.",
        tint: ["#231c15", "#0b0b0b"],
      },
    ],
  },
  {
    id: "what",
    field: "and in it",
    question: "What's in it?",
    options: [
      {
        id: "music",
        label: "Music",
        reaction: "You pick. I'll pretend I don't have opinions.",
        line: "There's music the entire time, chosen by you, and I keep my opinions to a manageable number.",
        tint: ["#22191f", "#0b0b0b"],
      },
      {
        id: "cooking",
        label: "Cooking",
        reaction: "Then I'm cooking. Too much of it, as established.",
        line: "I cook at some point in it. Too much, as established, and you get handed things to taste before they're finished.",
        tint: ["#251d13", "#0b0b0b"],
      },
      {
        id: "coffee",
        label: "Coffee",
        reaction: "Somewhere small with terrible lighting, then.",
        line: "There's coffee involved — somewhere small with bad lighting, where we stay until they start stacking the chairs.",
        tint: ["#20180f", "#0b0b0b"],
      },
      {
        id: "talking",
        label: "Just talking",
        reaction: "That was always going to be in it.",
        line: "Mostly it's talking, which was always going to be the actual content regardless of what else got scheduled.",
        tint: ["#1a1a1c", "#0b0b0b"],
      },
    ],
  },
];

export const weekendIntro = {
  title: "Build the weekend.\nI'll take notes.",
  body: "Three choices. Everything reacts, and it writes itself out at the end.",
  cta: "Write it out",
  again: "Write it out again",
};

/** Closing line of the write-up, keyed by the "where" choice. */
export const weekendClosers: Record<string, string> = {
  default:
    "Nothing in it is expensive and nothing in it is impressive, which is deliberate. Anything that needs a budget isn't a habit yet.",
  drive:
    "Nothing in it is expensive, which is deliberate. The best version of this is one we could do again next week without it being an occasion.",
  home: "Not one part of it needs explaining to anyone, which I suspect is the part you'd like most.",
};
