"use client";

import { useEffect, useRef } from "react";
import { useCoarsePointer, useReducedMotion } from "@/lib/useMotionPreference";

/**
 * The interactive layer of the background.
 *
 * A slow constellation of points that drift on their own, join to their
 * near neighbours with hairlines, and part around the pointer as it
 * passes. Clicking sends a ring outward that nudges everything it
 * crosses.
 *
 * Deliberately restrained: the points are small, the lines are barely
 * visible, and the repulsion is gentle. It should register as the page
 * being alive rather than as a screensaver. If you can describe it
 * without being asked, it is too strong.
 *
 * One canvas, one rAF loop, no per-point DOM. Skipped entirely for
 * reduced motion; runs without pointer interaction on touch.
 */

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Offset from the drift position, decayed each frame. */
  ox: number;
  oy: number;
  r: number;
  hue: 0 | 1 | 2;
}

interface Ripple {
  x: number;
  y: number;
  /** Current radius in px. */
  radius: number;
}

const PALETTE = [
  [227, 154, 169], // rose-400
  [211, 189, 147], // ember-400
  [164, 147, 207], // violet-400
] as const;

export function InteractiveField() {
  const reduced = useReducedMotion();
  const coarse = useCoarsePointer();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Cap the backing store at 2x. Beyond that the fill rate costs more
    // than the sharpness is worth for out-of-focus dots.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let points: Point[] = [];
    const ripples: Ripple[] = [];

    const pointer = { x: -9999, y: -9999, active: false };

    const seed = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Density by area, so a laptop and an ultrawide feel the same
      // rather than the big screen looking sparse.
      const count = Math.min(
        90,
        Math.max(26, Math.round((width * height) / 26000)),
      );

      points = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        // Very slow. A point should take the better part of a minute to
        // cross a meaningful distance.
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        ox: 0,
        oy: 0,
        r: 0.7 + Math.random() * 1.5,
        hue: (i % 3) as 0 | 1 | 2,
      }));
    };

    seed();

    const onResize = () => seed();
    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };
    const onDown = (e: PointerEvent) => {
      ripples.push({ x: e.clientX, y: e.clientY, radius: 0 });
      // Bound the list. Someone clicking repeatedly should not be able
      // to accumulate work indefinitely.
      if (ripples.length > 5) ripples.shift();
    };

    window.addEventListener("resize", onResize);
    if (!coarse) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave);
    }
    window.addEventListener("pointerdown", onDown, { passive: true });

    const LINK = 132; // px — max distance for a connecting line
    const PUSH = 150; // px — pointer influence radius
    let raf = 0;

    const frame = () => {
      ctx.clearRect(0, 0, width, height);

      // ── Advance ripples ─────────────────────────────────────────
      for (let i = ripples.length - 1; i >= 0; i -= 1) {
        ripples[i].radius += 7;
        if (ripples[i].radius > Math.max(width, height) * 0.8) {
          ripples.splice(i, 1);
        }
      }

      // ── Move points ─────────────────────────────────────────────
      for (const p of points) {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap rather than bounce — a bounce reads as a wall.
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Pointer repulsion, falling off with distance.
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < PUSH && dist > 0.01) {
            const force = (1 - dist / PUSH) ** 2 * 1.9;
            p.ox += (dx / dist) * force;
            p.oy += (dy / dist) * force;
          }
        }

        // Ripple nudge — only points near the expanding edge.
        for (const ripple of ripples) {
          const dx = p.x - ripple.x;
          const dy = p.y - ripple.y;
          const dist = Math.hypot(dx, dy);
          const delta = Math.abs(dist - ripple.radius);
          if (delta < 40 && dist > 0.01) {
            const force = (1 - delta / 40) * 1.1;
            p.ox += (dx / dist) * force;
            p.oy += (dy / dist) * force;
          }
        }

        // Spring the offset back to zero. This is what makes the field
        // settle instead of slowly blowing itself apart.
        p.ox *= 0.9;
        p.oy *= 0.9;
      }

      // ── Connecting lines ────────────────────────────────────────
      // O(n²) over at most 90 points is ~4k comparisons a frame, which
      // is nothing. A spatial grid here would be premature.
      for (let i = 0; i < points.length; i += 1) {
        const a = points[i];
        const ax = a.x + a.ox;
        const ay = a.y + a.oy;

        for (let j = i + 1; j < points.length; j += 1) {
          const b = points[j];
          const bx = b.x + b.ox;
          const by = b.y + b.oy;
          const dist = Math.hypot(ax - bx, ay - by);
          if (dist > LINK) continue;

          const strength = 1 - dist / LINK;
          const [r, g, bl] = PALETTE[a.hue];
          ctx.strokeStyle = `rgba(${r},${g},${bl},${strength * 0.09})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.stroke();
        }
      }

      // ── Points ──────────────────────────────────────────────────
      for (const p of points) {
        const [r, g, b] = PALETTE[p.hue];
        ctx.fillStyle = `rgba(${r},${g},${b},0.38)`;
        ctx.beginPath();
        ctx.arc(p.x + p.ox, p.y + p.oy, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── Ripple rings ────────────────────────────────────────────
      for (const ripple of ripples) {
        const fade = 1 - ripple.radius / (Math.max(width, height) * 0.8);
        ctx.strokeStyle = `rgba(227,154,169,${fade * 0.14})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);

    // Stop burning frames on a tab nobody is looking at.
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(frame);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced, coarse]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 opacity-90"
    />
  );
}
