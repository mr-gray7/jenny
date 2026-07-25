# Built Slowly

> Some things aren't found. They're built.

A nine-part interactive piece made for one person. Not a landing page, not a
proposal site — closer to a short film you can touch.

---

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

Build and serve the production bundle:

```bash
npm run build && npm start
```

---

## The one file you need to edit

**`content/config.ts`** — her name, your name, and the contact link.

```ts
recipientName: "Jenny",   // used once, in the sign-off
senderName: "",           // optional, sign-off only
contact: { label: "Send a message", href: "" },  // empty = button hidden
```

Set `recipientName` to `""` and every line still reads — the copy uses a
`name()` helper with a graceful fallback rather than interpolating a bare
string.

Her name is used exactly once, in the sign-off. That's deliberate. The landing
screen ends on "You." rather than on her name, which is the stronger of the
two, and a name repeated through a page starts to read as a technique rather
than as a greeting.

---

## Where the writing lives

Every word is in `content/`. No copy is hard-coded in a component, so you can
rewrite the whole piece in your own voice without opening a `.tsx` file.

| File | Chapter |
|---|---|
| `content/config.ts` | Names, tagline, contact |
| `content/chapters.ts` | Chapter titles and order |
| `content/overture.ts` | 00 — The landing sequence |
| `content/timeline.ts` | 01 — Timeline |
| `content/scan.ts` | 02 — The personality scan |
| `content/noticed.ts` | 03 — Interactive Memory Wall |
| `content/about.ts` | 04 — About Me |
| `content/weekend.ts` | 05 — Perfect Weekend Builder |
| `content/dashboard.ts` | 06 — Project Dashboard |
| `content/room.ts` | 07 — Things I Never Said, and Correct My Heart |
| `content/ending.ts` | The last part |

Each file opens with a note on the editorial rule that chapter follows. Those
rules are the reason the piece doesn't read as a pitch — worth reading before
you rewrite a chapter.

**Voice.** The whole piece is written in Indian English, not British. Warmer,
more direct, less ironic distance. "Actually", "somehow", "properly", "the
thing is". Fewer clever asides, and when in doubt the plain sentence wins —
which is what this material wants anyway. If you add copy, match that.

---

## Decisions worth knowing before you change things

**The AI is optional and off by default.** The PRD asks for OpenAI-backed
reactions, and `app/api/quip/route.ts` provides them — but only when
`OPENAI_API_KEY` is set. With no key it returns `{enabled:false}` and every
caller uses the handwritten line it already had, which is what ships.

Think before you turn it on. The whole piece rests on telling her nothing she
does here leaves the browser; enabling the route makes that untrue. If you
enable it, change the copy in `content/scan.ts` and the settings panel to
match — a promise the page quietly breaks is worse than one it never made. My
honest read is that handwritten lines are better here anyway: a model writing
"excellent choice" is a model writing it, and a person writing it in advance
for every branch is the gesture.

**Nothing else leaves the browser.** No analytics, no database, no other
network calls. State is Zustand persisted to `localStorage`. The settings
panel has a one-click erase.

**The page is `noindex, nofollow`.** It's for one person and shouldn't be
findable by anyone else.

**The ending button reveals; it does not submit.** Nothing is sent and nothing
is asked. An earlier draft offered three doors — yes, slowly, not now — on the
reasoning that one warm button makes "no" feel like breaking something. The
PRD's own copy answers that: "I'm not asking for an answer today" removes the
pressure more cleanly than a menu of exits would, and a menu turns a letter
into a form.

**The scan waits to be asked.** It does not start on scroll. A machine that
begins analysing a person the moment they walk past is a different, worse
object than one that waits — identical pixels, opposite manners. And its last
line admits there is no algorithm, which is what stops it being a horoscope.

**Every Memory Wall card must be something she'd be glad was noticed.**
Character, never habits, appearance, or movements. "You always take the 7:40
bus" is surveillance; "you care about your family" is being seen. The rule is
written into `content/noticed.ts` so it survives your edits.

---

## Accessibility

The whole piece is built to work with animation switched off — reduced motion
is a parallel path, not a degraded one. The landing sequence resolves instantly
instead of typing; the timeline draws itself fully rather than on scroll; flip
cards crossfade; the scan prints its readout without the theatre; particles,
parallax and the car don't run at all. Not a word is lost in any of it. There's
a manual override in the settings panel for anyone whose OS setting doesn't
match what they want right now.

Every interactive element is a real button or link with its state announced.
The chapter rail sits after `<main>` in the DOM so keyboard users aren't
marched through nine nav links to reach the story, and the hover-note `<Aside>`
opens on focus as well as hover.

---

## Verifying changes

Two dev-only harnesses drive a real browser (requires `npm start` running):

```bash
npm run verify        # 23 interaction assertions
npm run record        # records a walkthrough video
npm run shoot         # screenshots every chapter to ./screenshots
npm run shoot:mobile  # the same at 390×844
```

`npm run verify` runs 23 assertions: the landing sequence, all seven timeline
beats, the scan not autostarting and then completing, all eight card flips, the
weekend reactions and write-up, every dashboard field, the star unlocking the
room, Correct My Heart, the Konami code, the moon toggle, the ending reveal,
and state surviving a reload.

---

## Stack

Next.js 15 · TypeScript · Tailwind v4 · Framer Motion · GSAP · Zustand ·
Lucide. Framer Motion drives everything discrete; GSAP ScrollTrigger drives the
soft parallax on the ambient light. GSAP is imported lazily and only on
pointer-fine viewports with motion enabled, so it never reaches the initial
bundle and never downloads at all on a phone.

---

## Easter eggs

| Egg | How |
|---|---|
| **Things I Never Said** | The small star, bottom-left. Or type `slowly` anywhere. |
| **Konami** | `↑ ↑ ↓ ↓ ← → ← → B A` |
| **The moon** | Top-right. Warms the whole page towards dawn. Still dark. |
| **The car** | Headlights cross the screen at long random intervals. Not on load. |
| **Asides** | `<Aside note="…">word</Aside>` hangs a hover note off any word. Keyboard-reachable. |

Chapter 07 doesn't render at all until it's found — a locked door that
advertises itself is just a chapter with an extra click.

## Sound

A warm pad, soft piano, occasional chimes and a whisper of rain, all
synthesised in the browser with WebAudio — no audio files, so nothing to load
and no audible loop point.

The pad is three chord tones each doubled by a second oscillator a few cents
off; the beating between them is the entire reason it sounds warm rather than
like a test tone. The piano sits in C major pentatonic, so notes landing
together can never clash — that is what lets the timing be random and still
sound intentional. A short stereo delay puts it in a room.

It never autoplays. The `AudioContext` isn't even constructed until she presses
the speaker, so autoplay is impossible rather than merely avoided.

---

## The background

Two layers. `Atmosphere` is passive — grain, vignette, drifting light pools
with GSAP parallax, and a pointer glow that lags behind the cursor.
`InteractiveField` is a canvas that reacts: a slow constellation of points that
join to their neighbours with hairlines, part around the pointer as it passes,
and get nudged by a ring when she clicks.

Both are deliberately faint. If you can describe the background without being
asked to look at it, it's too strong. One canvas, one rAF loop, no per-point
DOM, and it pauses when the tab is hidden.

---

## Colour

Black `#0B0B0B` underneath everything, warm beige and restrained gold for
structure, and a rose-through-violet gradient for the lines meant to be felt
rather than read (`.text-romance`, `.rule-romance`, `.glass-romance`). The rose
and violet are held well below full saturation — against black, anything more
reads as a greetings card.
