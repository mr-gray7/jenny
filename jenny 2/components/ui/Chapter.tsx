"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useExperience } from "@/lib/store";

interface ChapterProps {
  id: string;
  index: string;
  title: string;
  children: ReactNode;
  className?: string;
  /** Sections that manage their own height (the timeline scrub, mostly). */
  fullHeight?: boolean;
}

/**
 * A section of the story. Registers itself with the store when it owns
 * the middle of the viewport, which drives the rail and nothing else —
 * chapters never *gate* scrolling. She can leave at any point.
 */
export function Chapter({
  id,
  index,
  title,
  children,
  className = "",
  fullHeight = true,
}: ChapterProps) {
  const ref = useRef<HTMLElement>(null);
  const setActiveChapter = useExperience((s) => s.setActiveChapter);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActiveChapter(id);
      },
      // A band across the middle of the screen. Whatever crosses it owns
      // the chapter marker — far steadier than "most visible".
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [id, setActiveChapter]);

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`relative z-10 w-full ${fullHeight ? "min-h-svh" : ""} ${className}`}
    >
      <h2 id={`${id}-heading`} className="sr-only">
        {`Chapter ${index} — ${title}`}
      </h2>
      {children}
    </section>
  );
}

/** Consistent horizontal rhythm for every chapter's inner content. */
export function ChapterInner({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-6xl px-6 sm:px-10 lg:px-16 ${className}`}
    >
      {children}
    </div>
  );
}

/** The small mono heading that sits above every chapter title. */
export function ChapterEyebrow({
  index,
  title,
}: {
  index: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="label text-ember-400/70">{index}</span>
      <span aria-hidden className="hairline h-px w-8" />
      <span className="label">{title}</span>
    </div>
  );
}
