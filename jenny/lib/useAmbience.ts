"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Rain and a very sparse piano, synthesised in the browser.
 *
 * No audio files. That is a deliberate constraint rather than a
 * shortcut: shipping a few megabytes of MP3 for something that plays
 * under a page most people will mute is a poor trade, and a looping
 * sample of rain is audibly a loop within about twenty seconds.
 * Filtered white noise never repeats.
 *
 * Nothing starts without a click. The AudioContext is not even
 * constructed until she asks for sound, so no browser ever has cause
 * to print an autoplay warning.
 */

interface Ambience {
  playing: boolean;
  ready: boolean;
  toggle: () => void;
}

export function useAmbience(): Ambience {
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const nodesRef = useRef<AudioNode[]>([]);
  const pianoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => setReady(true), []);

  const stop = useCallback(() => {
    if (pianoTimerRef.current) clearTimeout(pianoTimerRef.current);
    const master = masterRef.current;
    const ctx = ctxRef.current;
    if (master && ctx) {
      // Fade out rather than cut — a hard stop on noise is a click.
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.4);
      window.setTimeout(() => {
        for (const node of nodesRef.current) node.disconnect();
        nodesRef.current = [];
        void ctx.close();
        ctxRef.current = null;
        masterRef.current = null;
      }, 1600);
    }
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

    /* ── Rain: white noise through a lowpass, with a slow wobble on the
       cutoff so it breathes instead of hissing. ─────────────────── */
    const seconds = 4;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 1050;
    lowpass.Q.value = 0.6;

    const highpass = ctx.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = 380;

    const rainGain = ctx.createGain();
    rainGain.gain.value = 0.055;

    // Slow LFO on the cutoff — this is what makes it read as weather
    // rather than as static.
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoDepth = ctx.createGain();
    lfoDepth.gain.value = 260;
    lfo.connect(lfoDepth).connect(lowpass.frequency);
    lfo.start();

    noise.connect(highpass).connect(lowpass).connect(rainGain).connect(master);
    noise.start();

    nodesRef.current = [noise, highpass, lowpass, rainGain, lfo, lfoDepth];

    /* ── Piano: single soft notes from one pentatonic set, at long and
       irregular intervals. Sparse enough that it never becomes a
       melody you could get stuck in your head. ──────────────────── */
    const notes = [261.63, 293.66, 349.23, 392.0, 440.0, 523.25];

    const playNote = () => {
      const context = ctxRef.current;
      if (!context || !masterRef.current) return;

      const freq = notes[Math.floor(Math.random() * notes.length)];
      const now = context.currentTime;

      const osc = context.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;

      // A quiet second partial gives it a little body without needing
      // a sample; a pure sine reads as a test tone.
      const partial = context.createOscillator();
      partial.type = "sine";
      partial.frequency.value = freq * 2;
      const partialGain = context.createGain();
      partialGain.gain.value = 0.16;

      const env = context.createGain();
      env.gain.setValueAtTime(0, now);
      env.gain.linearRampToValueAtTime(0.09, now + 0.04);
      env.gain.exponentialRampToValueAtTime(0.0001, now + 3.6);

      osc.connect(env);
      partial.connect(partialGain).connect(env);
      env.connect(masterRef.current);

      osc.start(now);
      partial.start(now);
      osc.stop(now + 3.8);
      partial.stop(now + 3.8);

      pianoTimerRef.current = setTimeout(playNote, 4200 + Math.random() * 7000);
    };

    pianoTimerRef.current = setTimeout(playNote, 2400);

    master.gain.setTargetAtTime(1, ctx.currentTime, 1.4);
    setPlaying(true);
  }, []);

  const toggle = useCallback(() => {
    if (playing) stop();
    else start();
  }, [playing, start, stop]);

  useEffect(() => stop, [stop]);

  return { playing, ready, toggle };
}
