/* ------------------------------------------------------------------
   Chapter 01 — Timeline

   The seven beats are the PRD's, unchanged. Each one carries a short
   second line, because "Silence." alone on a screen is a mood but not
   a memory — and because the beats are the true part, so the elaboration
   has to stay small enough not to overwrite them.

   The facts underneath: introduced through matrimony, about two years
   ago, lost touch, reconnected. Nothing here invents a detail beyond
   those, and nothing puts words in her mouth.
------------------------------------------------------------------ */

export interface Beat {
  id: string;
  /** The PRD's line. This is the one that carries the chapter. */
  headline: string;
  /** One sentence underneath. Keep it shorter than you want to. */
  body?: string;
  /** Marks the two turning points, rendered in beige. */
  pivot?: boolean;
}

export const beats: Beat[] = [
  {
    id: "crossed",
    headline: "Our paths crossed.",
    body: "An introduction, arranged the traditional way. Neither of us chose it and both of us turned up anyway.",
  },
  {
    id: "talking",
    headline: "We started talking.",
    body: "Which, given how those introductions usually go, was not guaranteed. You made it easy in a way I didn't expect.",
  },
  {
    id: "interrupted",
    headline: "Life interrupted.",
    body: "Not dramatically. It just did what life does when nobody is protecting the thing.",
  },
  {
    id: "silence",
    headline: "Silence.",
    body: "Long enough that I stopped assuming it would end.",
    pivot: true,
  },
  {
    id: "somehow",
    headline: "Somehow…",
    body: "I still don't have a tidy explanation for this part, and I've stopped looking for one.",
  },
  {
    id: "back",
    headline: "We found our way back.",
    body: "No grand reunion. Just talking again, as though the gap had been a pause rather than an ending.",
    pivot: true,
  },
  {
    id: "reading",
    headline: "You're reading this.",
    body: "Which is the part I couldn't have planned, and the only reason any of the rest of it got built.",
  },
];

export const timelineIntro = {
  title: "Two years,\nabridged.",
  body: "Seven moments. Most of them are unremarkable, which I think is rather the point — nothing here happened quickly.",
};
