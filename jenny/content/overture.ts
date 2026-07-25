/* ------------------------------------------------------------------
   Landing screen.

   The lines are the PRD's, near-verbatim. They already do the most
   important job on the page — telling her what this isn't, before she
   has to wonder — and rewriting them would only make them mine.

   Pacing is set per line rather than globally: the short ones want a
   long silence after them, the list of three wants almost none.
------------------------------------------------------------------ */

export interface OvertureLine {
  text: string;
  /** ms to hold after this line finishes, before the next begins. */
  hold: number;
  /** Renders in beige rather than grey. Use once. */
  accent?: boolean;
}

export const overtureLines: OvertureLine[] = [
  { text: "Hello.", hold: 1100 },
  { text: "Before you continue…", hold: 1000 },
  { text: "This isn’t a proposal.", hold: 900 },
  { text: "It isn’t copied from the internet.", hold: 1100 },
  { text: "Every sentence…", hold: 420 },
  { text: "Every animation…", hold: 420 },
  { text: "Every detail…", hold: 800 },
  { text: "was built while thinking about exactly one person.", hold: 1000 },
  { text: "You.", hold: 600, accent: true },
];

export const overtureCta = {
  primary: "Begin",
  /** Offered next to Begin. Not in the PRD, but a nine-chapter piece
   *  with no way out is a corridor, not an invitation. */
  secondary: "Skip to the last part",
  /** Shown small, under the buttons. */
  note: "Nothing here asks you for anything. You can close the tab at any point.",
};
