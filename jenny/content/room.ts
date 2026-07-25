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
    body: "I admire how much you care. Not in the abstract — I mean the specific, daily, unglamorous version of it that costs you energy you don't always have.",
  },
  {
    id: "peace",
    spine: "The one I mean most",
    body: "I hope life gives you the peace you've been looking for. Genuinely, and separately from whether I'm anywhere near it when it arrives.",
  },
  {
    id: "impress",
    spine: "Why this exists",
    body: "I wasn't trying to impress you. I just wanted to make something only you would understand.",
  },
  {
    id: "slow",
    spine: "On the pace",
    body: "Fast is easy. Fast is what people do when they want the feeling more than they want the person. Slow means I'd rather get it right than get it now — and it means you can change your mind at any point without me treating it as a betrayal.",
  },
  {
    id: "careful",
    spine: "The careful one",
    body: "I know something happened before me. I'm not going to ask you to explain it, and I'm not going to spend my time proving I'm different — that's a performance and you've probably seen it before. I'd rather just be consistent for long enough that the question stops being interesting.",
  },
  {
    id: "teaching",
    spine: "About what you do",
    body: "You spend all day being patient with people who don't yet know they're being helped. That's an unreasonable thing to do well, and you do it well. I hope somebody has said so recently. In case not: somebody has now.",
  },
  {
    id: "last",
    spine: "The last one",
    body: "If none of this goes anywhere, this room still gets to have existed. Some things are worth building even when you don't know what happens next. That isn't a consolation prize — I mean it exactly as written.",
  },
];

export const roomIntro = {
  title: "Things I never said.",
  body: "You found the star. Seven of them — read in any order, or don't.",
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
    "One sentence. It's wrong, and I already know it's wrong. I'd feel strange denying you the opportunity.",
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
  miss: "Close. It's the verb that's letting the side down.",
  outro:
    "For the record: I'll take being corrected by you over being agreed with by almost anyone else. That isn't flattery — it's a genuine preference, and a fairly rare one.",
};
