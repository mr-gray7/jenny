"use client";

import { useCallback, useRef, useState } from "react";

/**
 * Returns a reaction line for a choice.
 *
 * Shows the handwritten line immediately, every time. If the optional
 * AI route is configured it then asks for an alternative and swaps it
 * in when it arrives — so there is never a spinner, never a delay, and
 * never a worse experience for the default configuration.
 *
 * With no OPENAI_API_KEY set the route replies `{enabled:false}` once
 * and this stops asking for the rest of the session.
 */
export function useQuip() {
  const [line, setLine] = useState<string | null>(null);
  const aiAvailable = useRef<boolean | null>(null);
  const requestId = useRef(0);

  const say = useCallback(async (choice: string, fallback: string) => {
    const id = ++requestId.current;
    setLine(fallback);

    if (aiAvailable.current === false) return;

    try {
      const response = await fetch("/api/quip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choice, fallback }),
      });
      const data = await response.json();

      aiAvailable.current = Boolean(data?.enabled);

      // Ignore a late reply for a choice she has already moved past.
      if (data?.text && id === requestId.current) setLine(data.text);
    } catch {
      aiAvailable.current = false;
    }
  }, []);

  const clear = useCallback(() => {
    requestId.current += 1;
    setLine(null);
  }, []);

  return { line, say, clear };
}
