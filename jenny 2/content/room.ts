/* ------------------------------------------------------------------
   Chapter 07 — Things I Never Said

   Found, not navigated to. A small star drifts somewhere on the page;
   clicking it opens the room. Typing "slowly" also works, for anyone
   who never spots it.

   The messages are quieter and more direct than anything else in the
   piece. That is the reward for curiosity — not more jokes, fewer.

   Cards 01-03 are the PRD's lines.
------------------------------------------------------------------ */

export interface Note {
  id: string;
  /** The label she clicks. Should give almost nothing away. */
  spine: string;
  body: string;
}

export const notes: Note[] = [
  {
    id: "admire",
    spine: "The first one",
    body: "I admire how much you care. Not in a general way — I mean the daily, unglamorous version of it that costs you energy you do not always have to spare.",
  },
  {
    id: "peace",
    spine: "The one I mean most",
    body: "I hope life gives you the peace you have been looking for. Genuinely — and separately from whether I am anywhere nearby when it finally arrives.",
  },
  {
    id: "impress",
    spine: "Why this exists",
    body: "I was not trying to impress you. I only wanted to make something that just you would understand.",
  },
  {
    id: "slow",
    spine: "On the pace",
    body: "Fast is easy. Fast is what people do when they want the feeling more than they want the person. Slow means I would rather get it right than get it now. It also means you can change your mind at any point and I will not treat it as a betrayal.",
  },
  {
    id: "careful",
    spine: "The careful one",
    body: "I know something happened before me. I am not going to ask you to explain it, and I am not going to spend my time proving that I am different. That is a performance and you have probably seen it before. I would rather simply be consistent for long enough that the question stops being interesting.",
  },
  {
    id: "teaching",
    spine: "About what you do",
    body: "You spend the whole day being patient with people who do not yet realise they are being helped. That is an unreasonable thing to be good at, and you are good at it. I hope somebody has told you recently. In case nobody has — somebody has now.",
  },
  {
    id: "last",
    spine: "The last one",
    body: "Even if none of this goes anywhere, this room still got to exist. Some things are worth building even when you do not know what happens next. This is not a consolation prize — I mean it exactly as written.",
  },
];

export const roomIntro = {
  title: "Things I never said.",
  body: "You found the star. Seven notes — read them in any order, or don't read them at all.",
};

/* ── Correct My Heart ─────────────────────────────────────────────
   The PRD's grammar joke, and the teacher's chapter.

   Testing a teacher on grammar would be condescending, however fondly
   meant — so she isn't tested. She's handed a red pen and one sentence
   that is wrong on purpose, and the joke is entirely at his expense.
------------------------------------------------------------------ */

export const correctMyHeart = {
  label: "Correct my heart",
  brief:
    "One sentence. It is wrong, and I already know it is wrong. It felt unfair not to give you the chance.",
  /** The broken sentence, split so each word is separately clickable. */
  tokens: ["I", "likes", "you."],
  /** Index of the word that's wrong. */
  errorIndex: 1,
  correction: "like",
  prompt: "Fix it.",
  /** Shown after she corrects it. The payoff. */
  success: {
    headline: "Grammar corrected successfully.",
    sub: "Feelings remain unchanged.",
  },
  /** If she marks the wrong word. Never scolding. */
  miss: "Close. It is the verb that is letting everybody down.",
  outro:
    "For the record — I will take being corrected by you over being agreed with by almost anybody else. That is not flattery. It is a genuine preference.",
};
