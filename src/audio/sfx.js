// All sounds are generated with Web Audio; there are no sound files.

const STORAGE_KEY = 'frankie-muted';

let ctx = null;
let muted = readMuted();

function readMuted() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

// Browsers only allow audio after a tap or key press, so call this from an input handler.
export function unlock() {
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    ctx = new AudioCtx();
  }
  if (ctx.state === 'suspended') ctx.resume();
}

export function isMuted() {
  return muted;
}

export function toggleMute() {
  muted = !muted;
  try {
    window.localStorage.setItem(STORAGE_KEY, muted ? '1' : '0');
  } catch {
    // Storage blocked (private mode): mute still works for this visit.
  }
  return muted;
}

function ready() {
  return ctx && !muted;
}

function envelope(gain, t, vol, dur) {
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
}

function tone({ type = 'sine', from, to = from, start = 0, dur = 0.15, vol = 0.2, lowpass = null }) {
  if (!ready()) return;
  const t = ctx.currentTime + start;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t);
  osc.frequency.exponentialRampToValueAtTime(to, t + dur);
  envelope(gain, t, vol, dur);
  let node = osc;
  if (lowpass) {
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = lowpass;
    node.connect(filter);
    node = filter;
  }
  node.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

let noiseBuffer = null;

// One shared buffer of white noise, made once instead of for every sound.
function getNoise() {
  if (!noiseBuffer) {
    noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  return noiseBuffer;
}

function noise({ start = 0, dur = 0.08, vol = 0.25, freq = 900 }) {
  if (!ready()) return;
  const t = ctx.currentTime + start;
  const src = ctx.createBufferSource();
  src.buffer = getNoise();
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = freq;
  const gain = ctx.createGain();
  envelope(gain, t, vol, dur);
  src.connect(filter).connect(gain).connect(ctx.destination);
  src.start(t, Math.random() * 0.5, dur + 0.02);
}

export function jump() {
  tone({ type: 'sine', from: 320, to: 760, dur: 0.18, vol: 0.18 });
}

export function collect() {
  tone({ type: 'triangle', from: 880, dur: 0.08, vol: 0.15 });
  tone({ type: 'triangle', from: 1320, start: 0.07, dur: 0.14, vol: 0.15 });
}

export function oops() {
  tone({ type: 'triangle', from: 520, to: 180, dur: 0.35, vol: 0.18 });
}

export function splash() {
  noise({ dur: 0.25, vol: 0.2, freq: 1800 });
}

export function munch() {
  noise({ dur: 0.07, vol: 0.35, freq: 700 });
  noise({ start: 0.14, dur: 0.07, vol: 0.35, freq: 600 });
}

export function bark() {
  tone({ type: 'sawtooth', from: 300, to: 150, dur: 0.13, vol: 0.14, lowpass: 1200 });
  tone({ type: 'sawtooth', from: 320, to: 160, start: 0.18, dur: 0.13, vol: 0.14, lowpass: 1200 });
}

export function plop() {
  tone({ type: 'sine', from: 600, to: 200, dur: 0.12, vol: 0.15 });
}

export function melody() {
  [523, 659, 784, 1047, 784, 1047].forEach((f, i) => {
    tone({ type: 'triangle', from: f, start: i * 0.14, dur: 0.24, vol: 0.14 });
  });
}
