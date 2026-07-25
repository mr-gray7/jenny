"use client";

import { useEffect, useRef } from "react";
import { useCoarsePointer, useReducedMotion } from "@/lib/useMotionPreference";
import { useParallax } from "@/lib/useParallax";

/**
 * The room the story happens in: film grain, a vignette, two slow
 * drifting pools of light, and a soft glow that follows the pointer
 * like a headlight sweeping a wall.
 *
 * All of it sits behind the content at z-0 and is pointer-transparent.
 * None of it is decorative noise — it exists so that flat dark panels
 * read as *space* rather than as #0b0b0b.
 */
export function Atmosphere() {
  const reduced = useReducedMotion();
  const coarse = useCoarsePointer();
  const glowRef = useRef<HTMLDivElement>(null);

  // The two light pools drift at different rates against the scroll,
  // which is the cheapest possible way to make a flat dark page read as
  // having depth. Opposite signs so they separate rather than track.
  const warmRef = useRef<HTMLDivElement>(null);
  const coolRef = useRef<HTMLDivElement>(null);
  useParallax(warmRef, -70);
  useParallax(coolRef, 55);

  useEffect(() => {
    if (coarse || reduced) return;
    const el = glowRef.current;
    if (!el) return;

    let raf = 0;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const tick = () => {
      // Heavy lerp — the light lags the cursor, which is what makes it
      // feel like a light source rather than a cursor decoration.
      x += (targetX - x) * 0.045;
      y += (targetY - y) * 0.045;
      el.style.transform = `translate3d(${x - 320}px, ${y - 320}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [coarse, reduced]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Base wash — keeps the top of the page warmer than the bottom */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,#17130e_0%,#0b0b0b_58%)]" />

      {/* Two slow pools of light. Different speeds so they never
          visibly loop together. */}
      <div
        ref={warmRef}
        className="absolute -left-[20%] top-[8%] h-[46rem] w-[46rem] rounded-full opacity-[0.16] blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, var(--color-ember-600) 0%, transparent 68%)",
          animation: reduced ? undefined : "drift 34s ease-in-out infinite",
        }}
      />
      <div
        ref={coolRef}
        className="absolute -right-[15%] top-[52%] h-[40rem] w-[40rem] rounded-full opacity-[0.13] blur-[130px]"
        style={{
          background:
            "radial-gradient(circle, var(--color-signal-600) 0%, transparent 70%)",
          animation: reduced ? undefined : "drift 47s ease-in-out infinite reverse",
        }}
      />

      {/* Pointer light */}
      {!coarse && !reduced && (
        <div
          ref={glowRef}
          className="absolute left-0 top-0 h-[40rem] w-[40rem] rounded-full opacity-[0.07] blur-[90px] will-change-transform"
          style={{
            background:
              "radial-gradient(circle, var(--color-ember-300) 0%, transparent 62%)",
          }}
        />
      )}

      {!reduced && <Particles />}

      {/* Vignette — pulls the eye to the middle third */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_50%,transparent_38%,rgba(0,0,0,0.55)_100%)]" />

      <Grain />
    </div>
  );
}

/**
 * Floating particles. Dust caught in a projector beam, not snow —
 * so: few, slow, small, and unevenly distributed. Thirty-two is enough
 * to read as atmosphere and few enough to cost nothing; they animate
 * on the compositor via transform and opacity only.
 *
 * Positions are derived from the index rather than Math.random so the
 * server and client agree on first paint.
 */
function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: 32 }, (_, i) => {
        // Cheap deterministic scatter — irrational multipliers keep the
        // three values from lining up into a visible pattern.
        const left = ((i * 37.6) % 100).toFixed(2);
        const size = 1 + ((i * 13) % 5) * 0.5;
        const duration = 26 + ((i * 7) % 22);
        const delay = -((i * 5.3) % 34);
        const drift = ((i % 7) - 3) * 14;
        const opacity = 0.14 + ((i * 11) % 5) * 0.05;

        return (
          <span
            key={i}
            className="absolute bottom-[-6vh] rounded-full bg-ember-300"
            style={{
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              ["--particle-drift" as string]: `${drift}px`,
              ["--particle-opacity" as string]: opacity,
              animation: `float-up ${duration}s linear ${delay}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}

/**
 * Film grain as an inline SVG data URI. Cheap, no network request, and
 * it is the single biggest reason a dark UI stops looking like a slab
 * of hex and starts looking photographed.
 */
function Grain() {
  return (
    <div
      className="absolute inset-0 opacity-[0.038] mix-blend-overlay"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")",
        backgroundSize: "160px 160px",
      }}
    />
  );
}
