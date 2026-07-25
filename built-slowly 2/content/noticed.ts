/* ------------------------------------------------------------------
   Chapter 03 — Interactive Memory Wall

   Every card opens.

   The editorial rule, and it is a hard one:

     Every card must be something she would be GLAD was noticed.

   Character, not habits. How she handles things, not what she does,
   where she goes, or how she looks. "You always take the 7:40 bus" is
   surveillance. "You care about your family" is being seen.

   If a card you add fails that test, it belongs in a conversation and
   not on a website.
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
    id: "family",
    front: "Your family",
    back: "I noticed how much you care about your family. Not in the way people say it — in the way you actually arrange your whole week around them without calling it a sacrifice.",
  },
  {
    id: "strong",
    front: "How strong you are",
    back: "You're stronger than you think. You keep describing things you handled alone as though anybody would have managed the same, and that is simply not true.",
  },
  {
    id: "disappear",
    front: "When you go quiet",
    back: "Sometimes you disappear. Then come back like nothing happened. 😄 Somehow, that has become part of your charm.",
  },
  {
    id: "explaining",
    front: "When someone is not getting it",
    back: "You change the explanation, never the tone. I have watched grown adults in office meetings fail at that for my entire career.",
  },
  {
    id: "tired",
    front: "When you are running on empty",
    back: "You become funnier. It is a terrible giveaway and I would like to be the only one who has noticed it.",
  },
  {
    id: "credit",
    front: "When something goes well",
    back: "You immediately give the credit to whoever is standing nearest. I have stopped pointing it out, but I have not stopped noticing.",
  },
  {
    id: "loved",
    front: "When you talk about something you love",
    back: "You speed up and stop editing yourself. That is the most honest version of you and it is easily my favourite.",
  },
  {
    id: "fine",
    front: "When you say you are fine",
    back: "Sometimes you genuinely are. I am still learning which times, and I would rather ask twice than assume once.",
  },
];

export const noticedIntro = {
  title: "A wall of\nsmall things.",
  body: "None of these are about how you look or where you go. They are the things you do when you think nobody is keeping count.",
  hint: "Every card opens. Go on.",
};

/** Shown once every card has been turned. */
export const noticedComplete =
  "Eight cards, and I did not have to think hard about a single one of them. That is the part I would like you to take away from this.";
