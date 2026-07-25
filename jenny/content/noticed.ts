/* ------------------------------------------------------------------
   Chapter 03 — Things I Noticed

   Cards 01-04 are the PRD's lines. The rest follow its lead.

   The editorial rule, and it is a hard one:

     Every card must be something she would be GLAD was noticed.

   Character, not habits. How she handles things, not what she does,
   where she goes, or how she looks. "You always take the 7:40" is
   surveillance. "You care more than you admit" is being seen.

   If a card you add fails that test, it belongs in a conversation.
------------------------------------------------------------------ */

export interface NoticedCard {
  id: string;
  /** Front of the card — short. */
  front: string;
  /** Back — one or two sentences, no more. */
  back: string;
}

export const noticedCards: NoticedCard[] = [
  {
    id: "care",
    front: "You care more than you admit",
    back: "You play it down every time, usually with a joke. The joke is very good and it does not work on me.",
  },
  {
    id: "ordinary",
    front: "Ordinary conversations",
    back: "You somehow make them interesting. I've come away from talking about absolutely nothing with you in a better mood than I started, more than once.",
  },
  {
    id: "childish",
    front: "Sometimes you're wonderfully childish",
    back: "I think that's one of my favourite things. Adults mostly train it out of themselves, and you clearly refused.",
  },
  {
    id: "careful",
    front: "You've become careful with trust",
    back: "Honestly… I understand why. I'm not going to treat that as a problem to solve, or as something you owe me an explanation for.",
  },
  {
    id: "struggling",
    front: "When someone isn't getting it",
    back: "You change the explanation, never the tone. I've watched grown adults in meetings fail at that for my entire career.",
  },
  {
    id: "tired",
    front: "When you're running on empty",
    back: "You get funnier. It's a terrible tell, and I'd rather like to be the only one who's spotted it.",
  },
  {
    id: "credit",
    front: "When something goes well",
    back: "You hand the credit to whoever's nearest. I've stopped pointing it out, but I haven't stopped noticing.",
  },
  {
    id: "fine",
    front: "When you say you're fine",
    back: "Sometimes you genuinely are. I'm still learning which times, and I'd rather ask twice than assume once.",
  },
];

export const noticedIntro = {
  title: "Things I noticed,\nwithout trying to.",
  body: "None of these are about how you look or where you go. They're the things you do when you think nobody's keeping score.",
  hint: "Turn them over.",
};

/** Shown once every card has been turned. */
export const noticedComplete =
  "Eight cards, and not one of them took any effort to remember. That's the part I'd like you to take away from this.";
