/* ------------------------------------------------------------------
   Chapter 04 — About Me

   Cards, not a biography. The PRD's four are here with its own lines
   kept as the opening beat of each, plus cars, which it lists as a
   fact about him and which was too good to leave out.

   Rule: each card states something true, then undercuts it slightly.
   Sincerity that refuses to laugh at itself reads as a sales pitch,
   and the brief is explicit that he should not appear perfect.
------------------------------------------------------------------ */

export type SpecIcon = "moon" | "car" | "chef" | "messages" | "anchor";

export interface Spec {
  id: string;
  icon: SpecIcon;
  /** Mono label above the heading. */
  field: string;
  title: string;
  body: string;
  /** The dry footnote. Where the humour lives. */
  note: string;
}

export const specs: Spec[] = [
  {
    id: "drives",
    icon: "moon",
    field: "where I think",
    title: "Night drives",
    body: "Sometimes an empty road and good music solve more problems than words do. Everything is quieter after eleven — no traffic, nobody needing anything. It's where I work things out.",
    note: "Passenger seat is available. The aux cable comes with it.",
  },
  {
    id: "cooking",
    icon: "chef",
    field: "how I say things",
    title: "Cooking",
    body: "If you're ever tired after work, I'd rather cook than order food. Not to impress anyone — plating is a waste of a good evening. It's just the most direct way I know to say I'm glad you're here without saying it out loud.",
    note: "Portions are a known defect. There will be leftovers.",
  },
  {
    id: "work",
    icon: "messages",
    field: "occupation",
    title: "Project manager",
    body: "Yes, I make plans. No, life doesn't always follow them. Most of the job is working out what people actually mean and getting them to talk to each other, which is less glamorous than it sounds and more useful than it looks.",
    note: "Occupational hazard: I plan things. Tell me to stop and I will.",
  },
  {
    id: "cars",
    icon: "car",
    field: "known enthusiasm",
    title: "Cars, unfortunately",
    body: "I can tell you why one engine sounds better than another, and I will, at length, without being asked. I'm aware this is not universally interesting.",
    note: "You're permitted to change the subject. I won't notice for a minute.",
  },
  {
    id: "faith",
    icon: "anchor",
    field: "what steadies me",
    title: "Faith, quietly",
    body: "It's part of how I was raised and part of how I decide things, and it mostly shows up as a belief that you're accountable for how you treat people even when nobody's watching. I'm not interested in explaining it to you or asking you about yours.",
    note: "Held privately. Not a topic I'll bring to the table uninvited.",
  },
];

export const aboutIntro = {
  title: "Me, briefly,\nand honestly.",
  body: "Five cards. The footnotes are the parts most people would have left out, which is why they're there.",
};
