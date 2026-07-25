/* ------------------------------------------------------------------
   Chapter 01 — Timeline

   The seven beats are fixed. Each carries one short line underneath,
   because "Silence." alone is a mood but not a memory — and because
   the beats are the true part, the elaboration has to stay small
   enough not to talk over them.

   Voice note for anyone editing: this is Indian English, not British.
   Warmer, more direct, less ironic distance. "Actually", "somehow",
   "the thing is", "properly", "itself". Fewer clever asides. When in
   doubt, say the plain thing plainly — that is what the chapter needs
   anyway.
------------------------------------------------------------------ */

export interface Beat {
  id: string;
  headline: string;
  body?: string;
  /** Marks the turning points, rendered in the romance gradient. */
  pivot?: boolean;
}

export const beats: Beat[] = [
  {
    id: "profile",
    headline: "Mother found profile.",
    body: "Which is how these things still begin, whatever anybody says. She saw it before I did and she was very sure about it.",
  },
  {
    id: "instagram",
    headline: "Instagram request.",
    body: "Sent it and then spent the rest of the evening pretending I was not checking the phone.",
  },
  {
    id: "conversations",
    headline: "Conversations.",
    body: "Long ones. The kind where you look up and two hours are gone and neither of us said anything important.",
  },
  {
    id: "life",
    headline: "Life happened.",
    body: "Not any one big thing. Work, family, distance, all of it at once. That is usually how it goes.",
  },
  {
    id: "silence",
    headline: "Silence.",
    body: "Long enough that I stopped expecting it to end. I did not delete the chat, though.",
    pivot: true,
  },
  {
    id: "somehow",
    headline: "Somehow…",
    body: "I still cannot explain this part properly, and honestly I have stopped trying.",
  },
  {
    id: "back",
    headline: "We're talking again.",
    body: "No big reunion, no long explanation. Just talking, as if the gap was a pause and not an ending.",
    pivot: true,
  },
];

export const timelineIntro = {
  title: "Two years,\nin seven lines.",
  body: "Most of it is very ordinary. That is exactly the point — nothing here happened fast.",
};
