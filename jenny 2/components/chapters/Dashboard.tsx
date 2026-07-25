"use client";

import { motion, useInView } from "framer-motion";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import { useRef } from "react";
import { Chapter, ChapterEyebrow, ChapterInner } from "@/components/ui/Chapter";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import {
  blockers,
  dashboardIntro,
  dashboardStatus,
  deliverables,
  fields,
  type Deliverable,
} from "@/content/dashboard";
import { easeOutExpo } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useMotionPreference";

const stateStyles: Record<Deliverable["state"], { label: string; bar: string; pill: string }> = {
  shipped: {
    label: "Shipped",
    bar: "bg-ember-400",
    pill: "border-ember-400/40 bg-ember-400/10 text-ember-300",
  },
  progress: {
    label: "In progress",
    bar: "bg-signal-400/70",
    pill: "border-porcelain/14 bg-porcelain/5 text-porcelain-dim",
  },
  early: {
    label: "Early",
    bar: "bg-porcelain/25",
    pill: "border-porcelain/12 bg-porcelain/5 text-porcelain-faint",
  },
};

/** Chapter 06 — the status report, typeset as a real dashboard. */
export function Dashboard() {
  return (
    <Chapter
      id="dashboard"
      index="06"
      title="The Dashboard"
      className="py-28 sm:py-36"
      fullHeight={false}
    >
      <ChapterInner>
        <Reveal>
          <ChapterEyebrow index="06" title="The Dashboard" />
          <p className="text-gradient mt-6 max-w-2xl whitespace-pre-line font-display text-[clamp(2.6rem,5.5vw,4.4rem)] font-medium leading-[1.02] tracking-[-0.02em]">
            {dashboardIntro.title}
          </p>
          <p className="measure-wide mt-5 text-[15px] leading-relaxed text-porcelain-dim">
            {dashboardIntro.body}
          </p>
        </Reveal>

        {/* ── Header fields ────────────────────────────────────────── */}
        <RevealGroup className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" step={0.06}>
          {fields.map((field) => (
            <RevealItem key={field.id}>
              <div className="glass glass-hover h-full rounded-2xl p-5">
                <span className="label">{field.label}</span>
                <p
                  className={`mt-3 font-display text-[1.7rem] leading-tight ${
                    field.accent ? "text-ember-300" : "text-porcelain"
                  }`}
                >
                  {field.value}
                </p>
                {field.note && (
                  <p className="mt-2.5 text-[12.5px] leading-relaxed text-porcelain-faint">
                    {field.note}
                  </p>
                )}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* ── Deliverables ─────────────────────────────────────────── */}
        <Reveal>
          <div className="mt-12 flex items-center gap-3">
            <h3 className="label text-porcelain-dim">Deliverables</h3>
            <span aria-hidden className="hairline h-px flex-1" />
          </div>
        </Reveal>

        <RevealGroup className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" step={0.06}>
          {deliverables.map((item) => (
            <RevealItem key={item.id}>
              <DeliverableCard item={item} />
            </RevealItem>
          ))}
        </RevealGroup>

        {/* ── Blockers ─────────────────────────────────────────────── */}
        <Reveal>
          <div className="mt-14 flex items-center gap-3">
            <AlertTriangle className="size-4 text-ember-400" strokeWidth={1.8} />
            <h3 className="label text-porcelain-dim">Blockers</h3>
            <span aria-hidden className="hairline h-px flex-1" />
          </div>
          <p className="measure-wide mt-4 text-[15px] leading-relaxed text-porcelain-dim">
            A status report with no blockers is a status report nobody
            believes. So here are mine, written the same way I would write
            them if getting this wrong were expensive.
          </p>
        </Reveal>

        <RevealGroup className="mt-8 grid gap-3 lg:grid-cols-3" step={0.07}>
          {blockers.map((blocker) => (
            <RevealItem key={blocker.id}>
              <article className="glass glass-hover h-full rounded-2xl p-6">
                <h4 className="font-display text-[1.7rem] leading-tight text-porcelain">
                  {blocker.title}
                </h4>
                <p className="mt-3 text-[14px] leading-relaxed text-porcelain-dim">
                  {blocker.body}
                </p>
                <div className="mt-5 flex gap-2.5 border-t border-porcelain/8 pt-4">
                  <ShieldCheck className="mt-px size-3.5 shrink-0 text-ember-400/70" />
                  <p className="text-[12.5px] leading-relaxed text-porcelain-faint">
                    {blocker.mitigation}
                  </p>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* ── Status ───────────────────────────────────────────────── */}
        <Reveal>
          <div className="glass-romance mt-10 flex flex-wrap items-baseline gap-x-8 gap-y-3 rounded-3xl p-8 sm:p-10">
            <span className="label">{dashboardStatus.label}</span>
            <p className="text-romance font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.05]">
              {dashboardStatus.value}
            </p>
          </div>
        </Reveal>
      </ChapterInner>
    </Chapter>
  );
}

function DeliverableCard({ item }: { item: Deliverable }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  // Bars fill on entry rather than on mount, so the number reads as a
  // measurement being taken rather than a decoration that was always there.
  const visible = useInView(ref, { once: true, amount: 0.6 });
  const style = stateStyles[item.state];

  return (
    <div ref={ref} className="glass glass-hover h-full rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="font-display text-[1.35rem] leading-tight text-porcelain">
          {item.label}
        </span>
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] ${style.pill}`}
        >
          {style.label}
        </span>
      </div>

      <div
        role="meter"
        aria-valuenow={Math.round(item.value * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={item.label}
        className="mt-4 h-1 w-full overflow-hidden rounded-full bg-porcelain/8"
      >
        <motion.div
          className={`h-full rounded-full ${style.bar}`}
          initial={reduced ? false : { scaleX: 0 }}
          animate={{ scaleX: visible || reduced ? item.value : 0 }}
          style={{ transformOrigin: "left" }}
          transition={{ duration: 1.4, ease: easeOutExpo, delay: 0.15 }}
        />
      </div>

      <p className="mt-4 text-[12.5px] leading-relaxed text-porcelain-faint">
        {item.note}
      </p>
    </div>
  );
}
