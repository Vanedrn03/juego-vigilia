"use client";

/**
 * Efectos de sonido sintetizados con Web Audio API (osciladores), sin
 * archivos de audio externos. Se generan en el momento a partir de tonos.
 */

type ToneOptions = {
  freq: number;
  start: number;
  duration: number;
  type?: OscillatorType;
  peakGain?: number;
};

let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return null;
  if (!ctx) ctx = new AudioCtor();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(audioCtx: AudioContext, { freq, start, duration, type = "sine", peakGain = 0.22 }: ToneOptions) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(peakGain, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

/** Ding ascendente al voltear/revelar una respuesta correcta. */
export function playFlip() {
  const audioCtx = getContext();
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  tone(audioCtx, { freq: 660, start: t, duration: 0.12, type: "triangle" });
  tone(audioCtx, { freq: 990, start: t + 0.07, duration: 0.16, type: "triangle" });
}

/** Buzzer grave estilo concurso al marcar un strike. */
export function playStrike() {
  const audioCtx = getContext();
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  tone(audioCtx, { freq: 160, start: t, duration: 0.35, type: "sawtooth", peakGain: 0.28 });
  tone(audioCtx, { freq: 140, start: t + 0.12, duration: 0.35, type: "sawtooth", peakGain: 0.28 });
}

/** Mini fanfarria cuando un equipo se lleva los puntos de la ronda. */
export function playCelebration() {
  const audioCtx = getContext();
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, i) => {
    tone(audioCtx, { freq, start: t + i * 0.11, duration: 0.3, type: "square", peakGain: 0.18 });
  });
}

/** Tic del contador (últimos segundos). */
export function playTick() {
  const audioCtx = getContext();
  if (!audioCtx) return;
  tone(audioCtx, { freq: 880, start: audioCtx.currentTime, duration: 0.09, type: "square", peakGain: 0.16 });
}

/** Sonido al agotarse el tiempo. */
export function playTimeUp() {
  const audioCtx = getContext();
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  tone(audioCtx, { freq: 300, start: t, duration: 0.4, type: "sawtooth", peakGain: 0.25 });
}

/** Ding corto para respuesta correcta (juego de trivia). */
export function playCorrect() {
  const audioCtx = getContext();
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  tone(audioCtx, { freq: 784, start: t, duration: 0.14, type: "triangle" });
  tone(audioCtx, { freq: 1046.5, start: t + 0.1, duration: 0.22, type: "triangle" });
}

/** Sonido corto de whoosh al pasar de pregunta/ronda. */
export function playWhoosh() {
  const audioCtx = getContext();
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  tone(audioCtx, { freq: 220, start: t, duration: 0.18, type: "sine", peakGain: 0.12 });
  tone(audioCtx, { freq: 440, start: t + 0.05, duration: 0.18, type: "sine", peakGain: 0.12 });
}
