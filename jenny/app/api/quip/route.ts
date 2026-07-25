import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ------------------------------------------------------------------
   Optional AI layer.

   The PRD asks for OpenAI-backed reactions. This route provides them —
   but only if OPENAI_API_KEY is set. With no key it returns
   `{ enabled: false }` and every caller falls back to the handwritten
   line it already had, which is the default the site ships in.

   Why it is off by default, and why you should think before turning
   it on:

   The whole piece rests on telling her nothing she does here leaves
   the browser. Enabling this makes that untrue — her selections would
   be sent to a third party. If you turn it on, change the copy in
   content/scan.ts and the settings panel to match, because a promise
   the page quietly breaks is worse than one it never made.

   The safer read is that handwritten lines are better here anyway. A
   model writing "excellent choice" is a model writing it. A person
   writing it in advance, for every branch, is the gesture.
------------------------------------------------------------------ */

const SYSTEM = `You write one-line reactions for a personal, handmade website.

Voice: dry, warm, understated British. Self-deprecating rather than
flattering. Never gushing, never romantic, never a compliment about
appearance. Subtle humour is welcome; exclamation marks are not.

Hard rules:
- One sentence. Two only if the second is very short.
- Never ask a question.
- Never use pet names or terms of endearment.
- Never imply obligation, urgency, or that she owes a reply.
- No emoji.`;

interface Body {
  /** What she just chose, in plain words. */
  choice?: unknown;
  /** The handwritten line, sent so the model has the register to match. */
  fallback?: unknown;
}

export async function POST(request: Request) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    // Not an error. This is the shipped configuration.
    return NextResponse.json({ enabled: false });
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const choice = typeof body.choice === "string" ? body.choice.slice(0, 200) : "";
  const fallback =
    typeof body.fallback === "string" ? body.fallback.slice(0, 400) : "";

  if (!choice) {
    return NextResponse.json({ error: "Missing choice" }, { status: 400 });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        temperature: 0.9,
        max_tokens: 60,
        messages: [
          { role: "system", content: SYSTEM },
          {
            role: "user",
            content: `She chose: ${choice}\n\nThe handwritten line for this option is: "${fallback}"\n\nWrite one different reaction in the same register.`,
          },
        ],
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      // Never surface an upstream failure to her — the caller falls
      // back to the handwritten line and she sees nothing amiss.
      return NextResponse.json({ enabled: true, text: null });
    }

    const data = await response.json();
    const text: string | undefined = data?.choices?.[0]?.message?.content?.trim();

    return NextResponse.json({ enabled: true, text: text ?? null });
  } catch {
    return NextResponse.json({ enabled: true, text: null });
  }
}
