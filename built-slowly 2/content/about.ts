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
    body: "Sometimes an empty road and good music solve more problems than talking does. After eleven everything becomes quiet — no traffic, nobody needing anything from you. That is where I actually sort things out in my head.",
    note: "Passenger seat is free. Aux cable comes along with it.",
  },
  {
    id: "cooking",
    icon: "chef",
    field: "how I say things",
    title: "Cooking",
    body: "If you are tired after work, I would much rather cook than order something. Not to show off — plating and all is a waste of a good evening. It is simply the most direct way I know of saying I am glad you are here, without actually saying it out loud.",
    note: "Quantity is a known problem. There will be leftovers.",
  },
  {
    id: "work",
    icon: "messages",
    field: "occupation",
    title: "Project manager",
    body: "Yes, I make plans. No, life does not always follow them. Most of the job is figuring out what people actually mean and then getting them to talk to each other properly. Less glamorous than it sounds, more useful than it looks.",
    note: "Occupational hazard — I plan things. Tell me to stop and I will stop.",
  },
  {
    id: "cars",
    icon: "car",
    field: "known enthusiasm",
    title: "Cars, unfortunately",
    body: "I can tell you exactly why one engine sounds better than another, and I will, at length, without anybody asking. I am fully aware this is not interesting to most people.",
    note: "You are allowed to change the subject. I will not notice for a minute.",
  },
  {
    id: "faith",
    icon: "anchor",
    field: "what steadies me",
    title: "Faith, quietly",
    body: "It is part of how I was brought up and part of how I decide things. Mostly it shows up as a belief that you are answerable for how you treat people, even when nobody is watching. I am not going to explain mine to you or ask you about yours.",
    note: "Kept private. Not something I will bring to the table uninvited.",
  },
];

export const aboutIntro = {
  title: "Me, briefly,\nand honestly.",
  body: "Five cards. The small lines at the bottom are the parts most people would have quietly left out, which is exactly why they are there.",
};
