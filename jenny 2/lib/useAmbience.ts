"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------
   Ambience, synthesised in the browser. No audio files.

   That is a deliberate constraint, not a shortcut. A few megabytes of
   MP3 for something most people will mute is a poor trade, and a
   looping sample of anything is audibly a loop inside twenty seconds.
   Synthesis never repeats.

   The shape of it:
     — a warm pad, three detuned oscillators through a slow filter
     — soft piano notes from a pentatonic set, at irregular intervals
     — occasional high chimes, rarer still
     — a whisper of rain underneath, well below everything else
     — a stereo delay so nothing sounds like it is in a small box

   Nothing starts without a click. The AudioContext is not constructed
   until she asks for sound, so no browser has cause to complain about
   autoplay and nothing is running in the background of a silent page.
------------------------------------------------------------------ */

interface Ambience {
  playing: boolean;
  ready: boolean;
  toggle: () => void;
}

/* C major pentatonic across two octaves — no semitone clashes are
   possible, so any two notes landing together still sound intentional.
   That is what lets the timing be random without ever sounding wrong. */
const PIANO = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25];
const CHIMES = [1046.5, 1174.66, 1318.51, 1567.98];
/** The pad chord: F major 9 voiced low and open. */
const PAD = [87.31, 130.81, 174.61, 261.63];

export function useAmbience(): Ambience {
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const busRef = useRef<GainNode | null>(null);
  const disposables = useRef<Array<() => void>>([]);
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  useEffect(() => setReady(true), []);

  const stop = useCallback(() => {
    for (const t of timers.current) clearTimeout(t);
    timers.current = [];

    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) {
      setPlaying(false);
      return;
    }

    // Fade before teardown. Cutting a pad dead is a click.
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(0, ctx.currentTime, 0.5);

    const dispose = disposables.current;
    disposables.current = [];
    ctxRef.current = null;
    masterRef.current = null;
    busRef.current = null;

    window.setTimeout(() => {
      for (const fn of dispose) {
        try {
          fn();
        } catch {
          /* already torn down */
        }
      }
      void ctx.close();
    }, 2200);

    setPlaying(false);
  }, []);

  const start = useCallback(() => {
    const AudioCtor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtor) return;

    const ctx = new AudioCtor();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    masterRef.current = master;

    /* ── Stereo delay ────────────────────────────────────────────
       Two delays at slightly different times, panned apart. Cheaper
       than a convolver and, for something this quiet, indistinguishable
       from a real room. */
    const bus = ctx.createGain();
    bus.gain.value = 1;
    bus.connect(master);
    busRef.current = bus;

    for (const [time, pan] of [
      [0.33, -0.6],
      [0.47, 0.6],
    ] as const) {
      const delay = ctx.createDelay(1);
      delay.delayTime.value = time;
      const feedback = ctx.createGain();
      feedback.gain.value = 0.32;
      const wet = ctx.createGain();
      wet.gain.value = 0.3;
      const panner = ctx.createStereoPanner();
      panner.pan.value = pan;
      const damp = ctx.createBiquadFilter();
      damp.type = "lowpass";
      damp.frequency.value = 2400;

      bus.connect(delay);
      delay.connect(feedback).connect(delay);
      delay.connect(damp).connect(wet).connect(panner).connect(master);

      disposables.current.push(() => {
        delay.disconnect();
        feedback.disconnect();
        wet.disconnect();
        panner.disconnect();
        damp.disconnect();
      });
    }

    /* ── Pad ─────────────────────────────────────────────────────
       Each chord tone gets two oscillators a few cents apart. The beat
       frequency between them is the entire reason it sounds warm
       instead of like a test tone. */
    const padGain = ctx.createGain();
    padGain.gain.value = 0.05;

    const padFilter = ctx.createBiquadFilter();
    padFilter.type = "lowpass";
    padFilter.frequency.value = 700;
    padFilter.Q.value = 0.7;
    padGain.connect(padFilter).connect(bus);

    // Slow sweep on the cutoff so the pad breathes.
    const padLfo = ctx.createOscillator();
    padLfo.frequency.value = 0.045;
    const padLfoDepth = ctx.createGain();
    padLfoDepth.gain.value = 240;
    padLfo.connect(padLfoDepth).connect(padFilter.frequency);
    padLfo.start();

    for (const freq of PAD) {
      for (const detune of [-6, 6]) {
        const osc = ctx.createOscillator();
        osc.type = "triangle";
        osc.frequency.value = freq;
        osc.detune.value = detune;
        osc.connect(padGain);
        osc.start();
        disposables.current.push(() => {
          osc.stop();
          osc.disconnect();
        });
      }
    }

    disposables.current.push(() => {
      padLfo.stop();
      padLfo.disconnect();
      padGain.disconnect();
      padFilter.disconnect();
      bus.disconnect();
    });

    /* ── Rain, well underneath ───────────────────────────────────── */
    const seconds = 4;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const rainLow = ctx.createBiquadFilter();
    rainLow.type = "lowpass";
    rainLow.frequency.value = 900;
    const rainHigh = ctx.createBiquadFilter();
    rainHigh.type = "highpass";
    rainHigh.frequency.value = 420;
    const rainGain = ctx.createGain();
    rainGain.gain.value = 0.022;

    noise.connect(rainHigh).connect(rainLow).connect(rainGain).connect(master);
    noise.start();

    disposables.current.push(() => {
      noise.stop();
      noise.disconnect();
      rainLow.disconnect();
      rainHigh.disconnect();
      rainGain.disconnect();
    });

    /* ── Piano and chimes ────────────────────────────────────────── */
    const voice = (
      freq: number,
      peak: number,
      decay: number,
      type: OscillatorType,
    ) => {
      const context = ctxRef.current;
      const target = busRef.current;
      if (!context || !target) return;

      const now = context.currentTime;

      const osc = context.createOscillator();
      osc.type = type;
      osc.frequency.value = freq;

      // A quiet octave above gives it body. A pure sine reads as a
      // hearing test; two partials read as an instrument.
      const partial = context.createOscillator();
      partial.type = "sine";
      partial.frequency.value = freq * 2;
      const partialGain = context.createGain();
      partialGain.gain.value = 0.14;

      const env = context.createGain();
      env.gain.setValueAtTime(0, now);
      env.gain.linearRampToValueAtTime(peak, now + 0.05);
      env.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      const panner = context.createStereoPanner();
      panner.pan.value = (Math.random() - 0.5) * 0.5;

      osc.connect(env);
      partial.connect(partialGain).connect(env);
      env.connect(panner).connect(target);

      osc.start(now);
      partial.start(now);
      osc.stop(now + decay + 0.1);
      partial.stop(now + decay + 0.1);
    };

    const schedulePiano = () => {
      voice(PIANO[Math.floor(Math.random() * PIANO.length)], 0.085, 4.2, "sine");
      timers.current.push(
        setTimeout(schedulePiano, 3200 + Math.random() * 5200),
      );
    };

    const scheduleChime = () => {
      voice(
        CHIMES[Math.floor(Math.random() * CHIMES.length)],
        0.028,
        6.5,
        "sine",
      );
      timers.current.push(
        setTimeout(scheduleChime, 11000 + Math.random() * 16000),
      );
    };

    timers.current.push(setTimeout(schedulePiano, 1800));
    timers.current.push(setTimeout(scheduleChime, 7000));

    // Long fade in — four seconds, so it arrives rather than starts.
    master.gain.setTargetAtTime(1, ctx.currentTime, 1.6);
    setPlaying(true);
  }, []);

  const toggle = useCallback(() => {
    if (playing) stop();
    else start();
  }, [playing, start, stop]);

  useEffect(() => stop, [stop]);

  return { playing, ready, toggle };
}
