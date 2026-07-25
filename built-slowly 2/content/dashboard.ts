/* ------------------------------------------------------------------
   Chapter 06 — Project Dashboard

   The PRD's fields, played completely straight. The comedy comes from
   the format being applied honestly, not from jokes bolted onto it —
   "Deadline: No rush." is funnier for being typeset as a real field in
   a real dashboard than it would be as a punchline.

   The Blockers panel is the part that matters. A status report with no
   blockers is a status report nobody believes, and the brief is
   explicit that he shouldn't appear perfect.
------------------------------------------------------------------ */

export interface Field {
  id: string;
  label: string;
  value: string;
  /** Optional smaller line under the value. */
  note?: string;
  /** Renders the value in beige. */
  accent?: boolean;
}

export const fields: Field[] = [
  {
    id: "project",
    label: "Project name",
    value: "Getting To Know You",
    note: "Working title. It stuck.",
    accent: true,
  },
  {
    id: "sprint",
    label: "Current sprint",
    value: "Building trust",
    note: "Ongoing. No end date, by design.",
  },
  {
    id: "priority",
    label: "Priority",
    value: "High",
    note: "Unchanged since the day it was opened.",
  },
  {
    id: "deadline",
    label: "Deadline",
    value: "No rush.",
    note: "This field is not a formality. There genuinely isn't one.",
    accent: true,
  },
];

export interface Deliverable {
  id: string;
  label: string;
  /** 0-1. Drives the bar. */
  value: number;
  state: "shipped" | "progress" | "early";
  note: string;
}

export const deliverables: Deliverable[] = [
  {
    id: "peace",
    label: "Peace",
    value: 0.72,
    state: "progress",
    note: "Not something I can deliver to you. Only something I can avoid taking away from you.",
  },
  {
    id: "communication",
    label: "Communication",
    value: 0.84,
    state: "progress",
    note: "Improving. Earlier I would sit on the awkward thing for a full day. Now it is about an hour.",
  },
  {
    id: "laughter",
    label: "Laughter",
    value: 1,
    state: "shipped",
    note: "Delivered early and consistently over-delivered, mostly by you.",
  },
  {
    id: "trust",
    label: "Trust",
    value: 0.38,
    state: "early",
    note: "Early, and it should be early. Anything higher at this stage would be a number I simply made up.",
  },
];

export interface Blocker {
  id: string;
  title: string;
  body: string;
  /** A real action, not a promise. */
  mitigation: string;
}

export const blockers: Blocker[] = [
  {
    id: "distance",
    title: "Distance",
    body: "The honest one, and the only blocker that is not my fault. It makes everything slower and makes consistency much harder to prove.",
    mitigation: "Handled by turning up when I say I will turn up. There is no clever fix for this one.",
  },
  {
    id: "work",
    title: "I work too much",
    body: "Not a humblebrag. It is an actual problem, and the thing most likely to make me unreliable in a way that matters.",
    mitigation: "In progress. Not solved. You will be able to tell before I admit it.",
  },
  {
    id: "fixing",
    title: "I try to solve feelings",
    body: "You will tell me something difficult and I will immediately start looking for a solution, because that is the reflex a career of project work builds.",
    mitigation: "Just say “I don't need it fixed” and I will stop mid-sentence. No sulking afterwards.",
  },
];

export const dashboardIntro = {
  title: "Status report.\nNo green-washing.",
  body: "This is genuinely how I would write it up if you were the client. Which, in the only sense that matters here, you are.",
};

export const dashboardStatus = {
  label: "Status",
  value: "Still worth working on.",
};
