export interface ChapterMeta {
  id: string;
  /** Shown in the rail on hover, and as the section's accessible name. */
  title: string;
  /** Two-digit chapter number in the corner of each section. */
  index: string;
  /** Whether the rail shows it before she has reached it.
   *  The hidden room is not advertised. */
  secret?: boolean;
}

export const chapters: ChapterMeta[] = [
  { id: "overture", title: "Begin", index: "00" },
  { id: "timeline", title: "Timeline", index: "01" },
  { id: "scan", title: "The Scan", index: "02" },
  { id: "noticed", title: "Things I Noticed", index: "03" },
  { id: "about", title: "About Me", index: "04" },
  { id: "weekend", title: "Perfect Weekend", index: "05" },
  { id: "dashboard", title: "The Dashboard", index: "06" },
  { id: "room", title: "Things I Never Said", index: "07", secret: true },
  { id: "ending", title: "The Last Part", index: "08" },
];

export const chapterIds = chapters.map((c) => c.id);
