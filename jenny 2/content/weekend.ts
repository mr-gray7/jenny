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
        reaction: "Ambitious. I will bring the coffee and say nothing until it starts working.",
        line: "It starts early in the morning, when the roads are still empty and neither of us is properly awake enough to talk.",
        tint: ["#2a2018", "#0b0b0b"],
      },
      {
        id: "evening",
        label: "Evening",
        reaction: "Correct answer. That is the one I would have picked also.",
        line: "It starts in the evening, in that half hour when the light turns golden and everybody pretends not to notice it.",
        tint: ["#2e2114", "#0b0b0b"],
      },
      {
        id: "night",
        label: "Night",
        reaction: "Now you are speaking my language.",
        line: "It starts late. Properly late — the part of the night when the city has finally stopped showing off.",
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
        reaction: "Excellent choice. Bonus points if it is raining.",
        line: "There is a long drive in it. No particular destination — one hour out, one hour back, and the conversation doing all the work.",
        tint: ["#1d1a14", "#0b0b0b"],
      },
      {
        id: "mountains",
        label: "Mountains",
        reaction: "Good. Cold air solves a surprising number of problems.",
        line: "We end up somewhere high and cold, and stay about twenty minutes longer than either of us planned.",
        tint: ["#161b1a", "#0b0b0b"],
      },
      {
        id: "rain",
        label: "Somewhere it's raining",
        reaction: "Rain it is. Best sound in the world through a windscreen.",
        line: "It rains the whole way through, which only makes it better. Everything sounds nicer from inside something dry.",
        tint: ["#131a1e", "#0b0b0b"],
      },
      {
        id: "home",
        label: "Nowhere. Stay in.",
        reaction: "Also correct. Normally I would argue, but not this time.",
        line: "We do not go anywhere at all. The car stays where it is and so do we, and it turns out to be the better plan.",
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
        reaction: "You choose. I will pretend I have no opinions.",
        line: "There is music the whole time, chosen by you, and I keep my opinions to a reasonable number.",
        tint: ["#22191f", "#0b0b0b"],
      },
      {
        id: "cooking",
        label: "Cooking",
        reaction: "Then I am cooking. Too much of it, as already established.",
        line: "At some point I cook. Too much, as established, and you get handed things to taste before they are ready.",
        tint: ["#251d13", "#0b0b0b"],
      },
      {
        id: "coffee",
        label: "Coffee",
        reaction: "Some small place with terrible lighting, then.",
        line: "There is coffee involved. Some small place with bad lighting, where we sit until they start stacking the chairs.",
        tint: ["#20180f", "#0b0b0b"],
      },
      {
        id: "talking",
        label: "Just talking",
        reaction: "That was always going to be part of it.",
        line: "Mostly it is talking, which was always going to be the actual plan regardless of whatever else got scheduled.",
        tint: ["#1a1a1c", "#0b0b0b"],
      },
    ],
  },
];

export const weekendIntro = {
  title: "Build the weekend.\nI'll take notes.",
  body: "Three choices. Everything reacts, and at the end it writes itself out properly.",
  cta: "Write it out",
  again: "Write it out again",
};

/** Closing line of the write-up, keyed by the "where" choice. */
export const weekendClosers: Record<string, string> = {
  default:
    "Nothing in it is expensive and nothing in it is impressive, and that is deliberate. Anything that needs a budget is not yet a habit.",
  drive:
    "Nothing in it is expensive, and that is deliberate. The best version of this is one we could repeat next week without it becoming an occasion.",
  home: "Not one part of it needs explaining to anybody, which I suspect is the part you would like the most.",
};
