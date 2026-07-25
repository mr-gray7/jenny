/* ------------------------------------------------------------------
   The only file you must edit.
   Everything else reads from here.
------------------------------------------------------------------ */

export const config = {
  /** Her name. Used sparingly — three or four times in the whole piece,
   *  which is what makes it land. Set to "" and every line still reads. */
  recipientName: "Jenny",

  /** Your name. Optional. Only appears in the sign-off. */
  senderName: "",

  projectName: "Built Slowly",
  tagline: "Some things aren’t found. They’re built.",

  /** Shown in the browser tab and on link previews.
   *  Deliberately vague — this is not for an audience. */
  meta: {
    title: "Built Slowly",
    description: "A small thing, made carefully, for one person.",
  },

  /** How to reach you at the end. Any of these can be left empty and
   *  the button simply won't render. */
  contact: {
    label: "Send a message",
    href: "", // e.g. "https://wa.me/…" or "mailto:…"
  },
} as const;

export const firstName = config.recipientName.trim();

/** Use this instead of interpolating the name directly. It returns the
 *  name when set, and a graceful fallback when it isn't — so the copy
 *  never reads "Hello , " to someone. */
export function name(fallback = "you"): string {
  return firstName || fallback;
}
