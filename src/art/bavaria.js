import { GAME_WIDTH } from '../config.js';
import { OUTLINE, loadSvg, svgDoc } from './svg.js';
import { attrs } from './scenery.js';

// Pieces shared by the Bavarian levels 11-15 (only loaded after the pretzel button): the four
// Bavarian obstacles (beer mug, rolling barrel, dachshund, marmot) and the white and blue bunting
// of the celebration after level 15. The obstacles get the strong dark outline like every other
// thing Frankie can touch.

const line = (w = 3) => attrs(OUTLINE, w);
const f1 = (n) => n.toFixed(1);
export const BAVARIAN_BLUE = '#2f7fc9';
export const BAVARIAN_BLUE_DARK = '#1d5a96';

// ---- Obstacles ----

// A one-litre glass beer mug with a foam crown and a thick handle on the right.
function masskrug() {
  return svgDoc(40, 54, `
    <defs><linearGradient id="beer" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e2901a"/><stop offset="0.4" stop-color="#ffcb4c"/><stop offset="1" stop-color="#d07e16"/></linearGradient></defs>
    <path d="M29 18 C37 18 37 44 29 44" fill="none" stroke="${OUTLINE}" stroke-width="10" stroke-linecap="round"/>
    <path d="M29 18 C37 18 37 44 29 44" fill="none" stroke="#e4f1f4" stroke-width="5" stroke-linecap="round"/>
    <path d="M5 12 H31 V48 Q31 52 27 52 H9 Q5 52 5 48 Z" fill="#e4f1f4" ${line()}/>
    <rect x="7.5" y="17" width="21" height="28" fill="url(#beer)"/>
    <rect x="7.5" y="45" width="21" height="4.5" rx="1.5" fill="#cfe4ea"/>
    <g fill="#fff3c4" opacity="0.85"><circle cx="13" cy="38" r="1.3"/><circle cx="20" cy="31" r="1.1"/><circle cx="24" cy="40" r="1.3"/><circle cx="16" cy="25" r="0.9"/></g>
    <path d="M10.5 21 V42" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" opacity="0.75"/>
    <path d="M3 16 Q2 9 9 10 Q11 4 17 7 Q21 2.5 26 7 Q33 5.5 33 13 Q34.5 19 29 19 H8 Q3 20 3 16 Z" fill="#ffffff" ${line(2.5)}/>
    <path d="M9 14 Q12 12 15 14" fill="none" stroke="#e8e0cc" stroke-width="1.6" stroke-linecap="round"/>`);
}

// The round end of a wooden beer barrel rolling on its side: planks, iron hoop, bung hole and
// a small white and blue shield (the barrel spins while it rolls).
const SHIELD = 'M19 19 H31 V28 Q31 33 25 35 Q19 33 19 28 Z';
function barrel() {
  const planks = [11, 18, 25, 32, 39].map((x) => `<path d="M${x} 2 V48" stroke="#8a5226" stroke-width="1.8"/>`).join('');
  const nails = [0, 60, 120, 180, 240, 300].map((a) => {
    const r = (a * Math.PI) / 180;
    return `<circle cx="${f1(25 + Math.cos(r) * 18)}" cy="${f1(25 + Math.sin(r) * 18)}" r="1.3" fill="#2e3136"/>`;
  }).join('');
  return svgDoc(50, 50, `
    <defs>
      <clipPath id="br"><circle cx="25" cy="25" r="21.5"/></clipPath>
      <clipPath id="shield"><path d="${SHIELD}"/></clipPath>
      <radialGradient id="brs" cx="0.38" cy="0.32" r="0.8"><stop offset="0" stop-color="#ffffff" stop-opacity="0.25"/><stop offset="0.6" stop-color="#ffffff" stop-opacity="0"/><stop offset="1" stop-color="#000000" stop-opacity="0.25"/></radialGradient>
    </defs>
    <circle cx="25" cy="25" r="21.5" fill="#c4823f"/>
    <g clip-path="url(#br)">${planks}</g>
    <circle cx="25" cy="25" r="18" fill="none" stroke="#5b5f66" stroke-width="3.4"/>
    ${nails}
    <path d="${SHIELD}" fill="#ffffff"/>
    <path d="M19 19 L22 22 L19 25 Z M25 19 L28 22 L25 25 L22 22 Z M31 19 V25 L28 22 Z M22 25 L25 28 L22 31 L19 28 Z M28 25 L31 28 L28 31 L25 28 Z M25 31 L28 34 L25 37 L22 34 Z" fill="${BAVARIAN_BLUE}" clip-path="url(#shield)"/>
    <path d="${SHIELD}" fill="none" ${attrs(OUTLINE, 1.6)}/>
    <circle cx="25" cy="40" r="2.4" fill="#3b2414"/>
    <circle cx="25" cy="25" r="21.5" fill="url(#brs)"/>
    <circle cx="25" cy="25" r="21.5" fill="none" ${line()}/>`);
}

// A red dachshund with a small green felt hat, looking left; two frames for walking.
function dachshund(step) {
  const legs = step ? [[16, 14], [26, 28], [47, 45], [57, 59]] : [[19, 19], [25, 25], [50, 50], [56, 56]];
  const leg = ([x, fx]) => `
    <path d="M${x} 30 L${fx} 40" ${line(7)}/>
    <path d="M${x} 30 L${fx} 40" stroke="#a24a22" stroke-width="3.6" stroke-linecap="round"/>
    <ellipse cx="${fx - 1}" cy="41" rx="3.4" ry="2" fill="#7a3416" ${line(1.6)}/>`;
  return svgDoc(70, 44, `
    ${legs.map(leg).join('')}
    <path d="M60 21 Q66 17 68 9" fill="none" ${line(6)}/>
    <path d="M60 21 Q66 17 68 9" fill="none" stroke="#b5562a" stroke-width="3" stroke-linecap="round"/>
    <path d="M17 20 Q19 13 30 13 H52 Q62 13 62 23 Q62 33 52 33 H28 Q17 33 17 26 Z" fill="#b5562a" ${line()}/>
    <path d="M24 29 Q36 33 52 30" fill="none" stroke="#d98a52" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
    <path d="M23 16 C17 8 8 9 6 14 L1.5 19.5 Q0 24 4 25 L12 26 C18 28 24 26 25.5 21 Z" fill="#b5562a" ${line()}/>
    <circle cx="2.6" cy="21" r="2.2" fill="#1b120b"/>
    <circle cx="10" cy="16.5" r="1.9" fill="#1b120b"/><circle cx="10.6" cy="15.9" r="0.6" fill="#ffffff"/>
    <path d="M15 13 C21 12 23 23 18 28 C13 26 12 18 15 13 Z" fill="#7f3417" ${line(2)}/>
    <path d="M20 21 L25 22.5" stroke="${BAVARIAN_BLUE}" stroke-width="2.6" stroke-linecap="round"/>
    <g transform="rotate(-8 14 7)">
      <path d="M17.5 6 Q21 2 21 0.8" fill="none" stroke="#6b6b6b" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M9 8 Q10 1.5 14 1.5 Q18 1.5 19 8 Z" fill="#3f6b3a" ${line(1.8)}/>
      <path d="M9.4 6 H18.6" stroke="#6b4325" stroke-width="1.6"/>
      <ellipse cx="14" cy="8.2" rx="8" ry="2" fill="#4c7d45" ${line(1.6)}/>
    </g>`);
}

// An alpine marmot sitting up, looking left; the second picture with raised paws for the hop.
function marmot(hopping) {
  const paw = (x, y, rx, ry) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#8a6440" ${line(1.8)}/>`;
  const paws = hopping ? paw(9, 22, 3.4, 4.4) + paw(30, 20, 3.4, 4.4) : paw(14, 31, 4, 3.2) + paw(23, 32, 4, 3.2);
  const mouth = hopping ? `<path d="M7 21 Q10 24 13 21" fill="#7a2e22" ${line(1.4)}/>` : '';
  return svgDoc(44, 52, `
    <path d="M34 44 Q42 42 41 34" fill="none" ${line(6)}/>
    <path d="M34 44 Q42 42 41 34" fill="none" stroke="#5e4630" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="13" cy="48.5" rx="6" ry="3" fill="#6e5236" ${line(2)}/>
    <ellipse cx="29" cy="48.5" rx="6" ry="3" fill="#6e5236" ${line(2)}/>
    <path d="M21 17 C10 17 6 30 7 40 C8 47 14 49.5 21 49.5 C28 49.5 35 47 36 40 C37 30 32 17 21 17 Z" fill="#a07850" ${line()}/>
    <ellipse cx="19.5" cy="38" rx="9" ry="10" fill="#e3c99e"/>
    ${paws}
    <circle cx="10" cy="6.5" r="3.4" fill="#8a6440" ${line(1.8)}/>
    <circle cx="24" cy="6" r="3.4" fill="#8a6440" ${line(1.8)}/>
    <ellipse cx="17" cy="14" rx="11" ry="9.5" fill="#a07850" ${line()}/>
    <ellipse cx="9" cy="17.5" rx="4.6" ry="3.6" fill="#e3c99e"/>
    <circle cx="5.6" cy="15.5" r="2" fill="#1b120b"/>
    <circle cx="13" cy="11.5" r="1.9" fill="#1b120b"/><circle cx="13.6" cy="10.9" r="0.6" fill="#ffffff"/>
    <rect x="7" y="19.5" width="2.2" height="3" rx="0.6" fill="#ffffff" ${attrs(OUTLINE, 0.9)}/>
    <rect x="9.4" y="19.5" width="2.2" height="3" rx="0.6" fill="#ffffff" ${attrs(OUTLINE, 0.9)}/>
    ${mouth}`);
}

// ---- The celebration after level 15 ----

// Two garlands of white and blue pennants across the top of the screen, each with a lozenge
// in the other colour (like the Bavarian flag).
function buntingBayern() {
  const flags = [];
  const strings = [];
  for (const [x0, x1] of [[-20, 490], [470, 980]]) {
    const mid = (x0 + x1) / 2;
    const at = (t) => [x0 + (x1 - x0) * t, 12 + 4 * 52 * t * (1 - t)];
    strings.push(`<path d="M${x0} 12 Q${mid} 116 ${x1} 12" fill="none" stroke="#6b4a2a" stroke-width="2.5"/>`);
    for (let i = 1; i < 12; i++) {
      const [x, y] = at(i / 12);
      const blue = (i + (x0 > 0 ? 1 : 0)) % 2 === 0;
      const [fill, lozenge] = blue ? [BAVARIAN_BLUE, '#ffffff'] : ['#ffffff', BAVARIAN_BLUE];
      flags.push(`<path d="M${f1(x - 15)} ${f1(y)} L${f1(x + 15)} ${f1(y)} L${f1(x)} ${f1(y + 32)} Z" fill="${fill}" ${attrs('#3a4a6a', 2)}/>`);
      flags.push(`<path d="M${f1(x)} ${f1(y + 4)} L${f1(x + 5)} ${f1(y + 11)} L${f1(x)} ${f1(y + 18)} L${f1(x - 5)} ${f1(y + 11)} Z" fill="${lozenge}"/>`);
    }
  }
  return svgDoc(GAME_WIDTH, 110, `${strings.join('')}${flags.join('')}`);
}

const PIECES = {
  masskrug: [40, 54, masskrug],
  barrel: [50, 50, barrel],
  dachshund: [70, 44, () => dachshund(0)],
  'dachshund-2': [70, 44, () => dachshund(1)],
  marmot: [44, 52, () => marmot(false)],
  'marmot-jump': [44, 52, () => marmot(true)],
  'bunting-bayern': [GAME_WIDTH, 110, buntingBayern],
};

export function bavariaSvgs() {
  return Object.fromEntries(Object.entries(PIECES).map(([key, [w, h, draw]]) => [key, { w, h, svg: draw() }]));
}

export function preloadBavaria(scene) {
  for (const [key, { w, h, svg }] of Object.entries(bavariaSvgs())) loadSvg(scene, key, svg, w, h);
}

export function createBavariaAnims(scene) {
  scene.anims.create({ key: 'dachshund-walk', frames: [{ key: 'dachshund' }, { key: 'dachshund-2' }], frameRate: 8, repeat: -1 });
}
