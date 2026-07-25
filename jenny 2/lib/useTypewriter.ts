"use client";

import { useEffect, useRef, useState } from "react";

interface Options {
  /** ms per character. Real typing is uneven; see the jitter below. */
  speed?: number;
  /** Pause before the first character. */
  startDelay?: number;
  /** Don't animate — resolve to the full string immediately. */
  instant?: boolean;
  onDone?: () => void;
}

/**
 * Types a string out character by character.
 *
 * The jitter is the point. A perfectly even interval reads as a machine
 * printing; varying it by ±45% and pausing longer after punctuation
 * reads as a person thinking. It costs four lines and it is the whole
 * difference between "typing effect" and "someone is writing to you".
 */
export function useTypewriter(text: string, options: Options = {}) {
  const { speed = 42, startDelay = 0, instant = false, onDone } = options;
  const [output, setOutput] = useState(instant ? text : "");
  const [done, setDone] = useState(instant);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (instant) {
      setOutput(text);
      setDone(true);
      onDoneRef.current?.();
      return;
    }

    setOutput("");
    setDone(false);

    let index = 0;
    let timer: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const step = () => {
      if (cancelled) return;
      index += 1;
      setOutput(text.slice(0, index));

      if (index >= text.length) {
        setDone(true);
        onDoneRef.current?.();
        return;
      }

      const char = text[index - 1];
      const pause =
        char === "." || char === "?" || char === "!"
          ? speed * 9
          : char === "," || char === "—"
            ? speed * 5
            : speed * (0.55 + Math.random() * 0.9);

      timer = setTimeout(step, pause);
    };

    timer = setTimeout(step, startDelay);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [text, speed, startDelay, instant]);

  return { output, done };
}

/** Types an ordered list of lines, one after the other. */
export function useTypewriterLines(lines: string[], instant = false) {
  const [current, setCurrent] = useState(instant ? lines.length : 0);
  const done = current >= lines.length;

  // `instant` can flip from false to true *after* the first paint — a
  // returning visitor is only recognised once persisted state hydrates,
  // and the settings pill can switch to reduced motion mid-line. Without
  // this the per-line advance is suppressed while the index is still
  // mid-sequence, and the sequence never finishes.
  useEffect(() => {
    if (instant) setCurrent(lines.length);
  }, [instant, lines.length]);

  const { output } = useTypewriter(lines[current] ?? "", {
    // Fast enough that nobody waits, slow enough to be legible as typing.
    // Five lines land in roughly four seconds.
    speed: 15,
    startDelay: current === 0 ? 420 : 150,
    instant,
    onDone: () => {
      if (instant) return;
      // Clamp. Past the last line the hook is handed "" — which
      // completes instantly and would otherwise advance the index
      // forever, re-rendering the tree on every frame.
      setTimeout(() => setCurrent((c) => Math.min(c + 1, lines.length)), 170);
    },
  });

  return {
    /** Lines already finished. */
    completed: instant ? lines : lines.slice(0, current),
    /** The line mid-flight, if any. */
    typing: done ? null : output,
    done,
  };
}
