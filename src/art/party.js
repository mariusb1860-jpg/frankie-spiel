import { GAME_WIDTH } from '../config.js';
import { OUTLINE, loadSvg, svgDoc } from './svg.js';
import { attrs } from './scenery.js';

// The big celebration after the last level: trophy, bunting, balloons, stars and confetti.

const line = (w = 3) => attrs(OUTLINE, w);
const f1 = (n) => n.toFixed(1);
const PARTY = ['#e53935', '#ffd23f', '#43b047', '#3b7fc4', '#ff8a3d', '#a259d9'];

function starPath(cx, cy, outer, inner) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = ((-90 + i * 36) * Math.PI) / 180;
    const r = i % 2 ? inner : outer;
    pts.push(`${f1(cx + Math.cos(a) * r)} ${f1(cy + Math.sin(a) * r)}`);
  }
  return `M${pts.join(' L')} Z`;
}

// Golden cup with Frankie's paw print and a sausage on the name plate.
function trophy() {
  return svgDoc(130, 170, `
    <defs><linearGradient id="gold" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f2b632"/><stop offset="0.35" stop-color="#ffe680"/><stop offset="0.7" stop-color="#f2b632"/><stop offset="1" stop-color="#c98a12"/></linearGradient></defs>
    <path d="M30 30 C6 30 6 72 40 78 M100 30 C124 30 124 72 90 78" fill="none" ${line(10)}/>
    <path d="M30 30 C6 30 6 72 40 78 M100 30 C124 30 124 72 90 78" fill="none" stroke="#f2b632" stroke-width="5" stroke-linecap="round"/>
    <path d="M24 18 H106 Q104 70 80 88 Q72 94 72 104 H58 Q58 94 50 88 Q26 70 24 18 Z" fill="url(#gold)" ${line()}/>
    <ellipse cx="65" cy="18" rx="41" ry="7" fill="#ffe9a0" ${line(2.5)}/>
    <g fill="#c98a12"><ellipse cx="65" cy="58" rx="9" ry="7.5"/><circle cx="54" cy="47" r="3.6"/><circle cx="61" cy="42" r="3.6"/><circle cx="69" cy="42" r="3.6"/><circle cx="76" cy="47" r="3.6"/></g>
    <path d="M38 28 Q40 56 54 74" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.7"/>
    <rect x="56" y="102" width="18" height="17" fill="url(#gold)" ${line(2.5)}/>
    <path d="M40 133 Q40 118 52 118 H78 Q90 118 90 133 Z" fill="url(#gold)" ${line(2.5)}/>
    <rect x="24" y="132" width="82" height="35" rx="4" fill="#6b4325" ${line()}/>
    <rect x="38" y="140" width="54" height="19" rx="3" fill="#f2c94c" ${line(2)}/>
    <rect x="49" y="145.5" width="32" height="8" rx="4" fill="#c4553a" ${line(1.5)}/>
    <circle cx="48" cy="149.5" r="1.8" fill="#8e3b2a"/><circle cx="82" cy="149.5" r="1.8" fill="#8e3b2a"/>`);
}

// Two garlands of little flags hanging across the top of the screen.
function bunting() {
  const flags = [];
  const strings = [];
  for (const [x0, x1] of [[-20, 490], [470, 980]]) {
    const mid = (x0 + x1) / 2;
    const at = (t) => [x0 + (x1 - x0) * t, 12 + 4 * 52 * t * (1 - t)];
    strings.push(`<path d="M${x0} 12 Q${mid} 116 ${x1} 12" fill="none" stroke="#6b4a2a" stroke-width="2.5"/>`);
    for (let i = 1; i < 12; i++) {
      const [x, y] = at(i / 12);
      const c = PARTY[(i + (x0 > 0 ? 3 : 0)) % PARTY.length];
      flags.push(`<path d="M${f1(x - 15)} ${f1(y)} L${f1(x + 15)} ${f1(y)} L${f1(x)} ${f1(y + 32)} Z" fill="${c}" ${attrs('#5a3a22', 2)}/>`);
    }
  }
  return svgDoc(GAME_WIDTH, 110, `${strings.join('')}${flags.join('')}`);
}

function balloon(color, dark) {
  return svgDoc(64, 124, `
    <path d="M32 74 Q26 90 34 104 Q40 114 30 124" fill="none" stroke="#7a7a7a" stroke-width="1.8"/>
    <path d="M32 4 C52 4 60 20 60 34 C60 54 44 68 32 72 C20 68 4 54 4 34 C4 20 12 4 32 4 Z" fill="${color}" ${attrs(dark, 2.5)}/>
    <path d="M27 76 L32 69 L37 76 Z" fill="${color}" ${attrs(dark, 1.5)}/>
    <ellipse cx="21" cy="24" rx="6" ry="11" fill="#ffffff" opacity="0.55" transform="rotate(25 21 24)"/>`);
}

// White star with a dark edge; the scene colours it (one star per world).
function bigStar() {
  return svgDoc(72, 72, `
    <path d="${starPath(36, 38, 33, 14)}" fill="#ffffff" ${attrs(OUTLINE, 3.5)}/>
    <path d="${starPath(32, 32, 10, 4.5)}" fill="#ffffff" opacity="0.8"/>`);
}

function confetti() {
  return svgDoc(10, 14, '<rect x="0.5" y="0.5" width="9" height="13" rx="2" fill="#ffffff"/>');
}

// White spark for fireworks; the scene colours it.
function spark() {
  const pts = [];
  for (let i = 0; i < 8; i++) {
    const r = i % 2 ? 4 : 12;
    const a = (Math.PI / 4) * i - Math.PI / 2;
    pts.push(`${f1(13 + r * Math.cos(a))} ${f1(13 + r * Math.sin(a))}`);
  }
  return svgDoc(26, 26, `<path d="M${pts.join(' L')} Z" fill="#ffffff"/><circle cx="13" cy="13" r="3.5" fill="#ffffff"/>`);
}

const PIECES = {
  trophy: [130, 170, trophy],
  bunting: [GAME_WIDTH, 110, bunting],
  'balloon-0': [64, 124, () => balloon('#e53935', '#8a1a1a')],
  'balloon-1': [64, 124, () => balloon('#ffd23f', '#a07c10')],
  'balloon-2': [64, 124, () => balloon('#43b047', '#1f5a22')],
  'balloon-3': [64, 124, () => balloon('#3b7fc4', '#1d3f66')],
  'balloon-4': [64, 124, () => balloon('#a259d9', '#5a2a7a')],
  'star-big': [72, 72, bigStar],
  confetti: [10, 14, confetti],
  spark: [26, 26, spark],
};

export const BALLOONS = 5;

export function partySvgs() {
  return Object.fromEntries(Object.entries(PIECES).map(([key, [w, h, draw]]) => [key, { w, h, svg: draw() }]));
}

export function preloadParty(scene) {
  for (const [key, { w, h, svg }] of Object.entries(partySvgs())) loadSvg(scene, key, svg, w, h);
}
