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
    note: "Not something I can deliver to you. Only something I can avoid taking from you.",
  },
  {
    id: "communication",
    label: "Communication",
    value: 0.84,
    state: "progress",
    note: "Improving. Historically I'd sit on the awkward thing for a day. Now it's about an hour.",
  },
  {
    id: "laughter",
    label: "Laughter",
    value: 1,
    state: "shipped",
    note: "Shipped early and consistently over-delivered, mostly by you.",
  },
  {
    id: "trust",
    label: "Trust",
    value: 0.38,
    state: "early",
    note: "Early. Should be early. Anything higher this soon would be a number I'd made up.",
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
    body: "The honest one, and the only blocker that isn't my fault. It makes everything slower and it makes consistency harder to prove.",
    mitigation: "Mitigated by turning up when I say I will. There isn't a clever fix.",
  },
  {
    id: "work",
    title: "I work too much",
    body: "Not a humblebrag — an actual failure mode, and the thing most likely to make me unreliable in a way that matters.",
    mitigation: "In progress. Not solved. You'll be able to tell before I admit it.",
  },
  {
    id: "fixing",
    title: "I try to solve feelings",
    body: "You'll tell me something hard and I'll start looking for the fix, because that's the reflex a career of project work builds.",
    mitigation: "Say “I don't need it fixed” and I'll stop mid-sentence. No sulking.",
  },
];

export const dashboardIntro = {
  title: "Status report.\nNo green-washing.",
  body: "This is genuinely how I'd write it up if you were the stakeholder. Which, in the only sense that matters here, you are.",
};

export const dashboardStatus = {
  label: "Status",
  value: "Still worth working on.",
};
