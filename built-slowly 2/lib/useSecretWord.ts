"use client";

import { useEffect, useRef } from "react";

/**
 * Listens for a word typed anywhere on the page.
 *
 * Deliberately forgiving: it keeps a rolling buffer rather than
 * requiring a clean run, so a stray keystroke doesn't reset her back to
 * the start of the word. It also ignores keystrokes aimed at a real
 * input, so typing "slowly" into a text field doesn't trip it.
 */
export function useSecretWord(word: string, onFound: () => void) {
  const bufferRef = useRef("");
  const onFoundRef = useRef(onFound);
  onFoundRef.current = onFound;

  useEffect(() => {
    const target = word.toLowerCase();

    const onKeyDown = (event: KeyboardEvent) => {
      const el = event.target as HTMLElement | null;
      if (
        el &&
        (el.isContentEditable ||
          el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA")
      ) {
        return;
      }
      if (event.key.length !== 1) return;

      bufferRef.current = (bufferRef.current + event.key.toLowerCase()).slice(
        -target.length,
      );

      if (bufferRef.current === target) {
        bufferRef.current = "";
        onFoundRef.current();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [word]);
}
