import { GAME_WIDTH } from '../config.js';
import { loadSvg, svgDoc } from './svg.js';
import { WOOD, attrs, ridge, ridgeY } from './scenery.js';

// Level 6 (grown-ups, only loaded after the paprika button): the Hungarian Puszta with paprika
// fields, whitewashed farmhouses, draw wells, grey cattle, a csikós on his horse and a
// goulash feast. Everything here is background: soft outlines, never the strong OUTLINE,
// because Frankie cannot touch any of it.

const f1 = (n) => n.toFixed(1);
const polygon = (pts, w, h) => `M0 ${h} ${pts.map(([x, y]) => `L${x} ${f1(y)}`).join(' ')} L${w} ${h} Z`;

export const HU_RED = '#ce2939';
export const HU_GREEN = '#477050';
export const PAPRIKA_RED = '#d7261e';
const PAPRIKA_DARK = '#8f1a14';
const STEM = '#3f7a2e';
const WHITEWASH = '#f7f1e3';
const REED = '#c9a45c';
const REED_DARK = '#94713a';
const STEPPE = '#d9c27a';
// Far animals sit at the top of their picture; the empty space below lifts them onto the
// far steppe, so the near grass does not hide their legs (as in farm.js). The Puszta
// horizon is low and flat, so they need less lift than on the farm (90 there).
const LIFT = 50;

// One paprika pod hanging from its stem at (x, y); s = size, a = tilt in degrees.
export function paprikaPod(x, y, s = 1, a = 0, color = PAPRIKA_RED) {
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${a}) scale(${s})">
    <path d="M0 0 C7 2 8 10 6 20 C4 30 1 36 -1 40 C-4 34 -7 24 -7 14 C-7 6 -5 1 0 0 Z" fill="${color}" ${attrs(PAPRIKA_DARK, 1.6)}/>
    <path d="M-3 6 C-4 14 -3 24 -1 32" fill="none" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" opacity="0.45"/>
    <path d="M0 0 C1 -3 3 -5 5 -6" fill="none" stroke="${STEM}" stroke-width="2.4" stroke-linecap="round"/>
  </g>`;
}

// A string of dried paprika (paprikafüzér) hanging down from (x, y), n pods long.
export function paprikaString(x, y, n) {
  const pods = [];
  for (let i = n - 1; i >= 0; i--) {
    pods.push(paprikaPod(x + (i % 2 ? 3 : -3), y + 4 + i * 11, 0.62, i % 2 ? 14 : -14, i % 3 === 2 ? '#b8201a' : PAPRIKA_RED));
  }
  return `<path d="M${x} ${y} V${y + n * 11 + 6}" stroke="#8a6a3a" stroke-width="1.6"/>${pods.join('')}`;
}

// Colours of the cauldron: black iron by default; c lets a far-away one look paler.
const CAULDRON = { body: '#2b2b2b', line: '#111111', stew: '#a8341c', stewLight: '#d0542e', shine: '#555555', handle: '#3a3a3a' };

// A black goulash cauldron (bogrács) with red stew, its rim centred at (x, y); s = size.
export function cauldron(x, y, s = 1, c = CAULDRON) {
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">
    <path d="M-30 0 C-30 26 -16 36 0 36 C16 36 30 26 30 0 Z" fill="${c.body}" ${attrs(c.line, 2)}/>
    <ellipse cx="0" cy="0" rx="30" ry="7" fill="${c.stew}" ${attrs(c.line, 2)}/>
    <ellipse cx="-8" cy="-1" rx="9" ry="2.5" fill="${c.stewLight}"/>
    <path d="M-12 14 C-10 24 -4 30 4 31" fill="none" stroke="${c.shine}" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
    <path d="M-30 -2 Q0 -40 30 -2" fill="none" stroke="${c.handle}" stroke-width="2.5"/>
  </g>`;
}

// A point on the cubic curve p (four [x, y] points) at t.
function bez(p, t) {
  const u = 1 - t;
  return [0, 1].map((i) => u * u * u * p[0][i] + 3 * u * u * t * p[1][i] + 3 * u * t * t * p[2][i] + t * t * t * p[3][i]);
}

// A horn (or pole) along the cubic curve p from t0 to t1: w wide at the base, thin at the tip.
function taper(p, w, t0 = 0, t1 = 1, tip = 0.15) {
  const left = [];
  const right = [];
  for (let k = 0; k <= 14; k++) {
    const t = t0 + ((t1 - t0) * k) / 14;
    const [x, y] = bez(p, t);
    const [xa, ya] = bez(p, Math.max(0, t - 0.01));
    const [xb, yb] = bez(p, Math.min(1, t + 0.01));
    const len = Math.hypot(xb - xa, yb - ya) || 1;
    const r = (w / 2) * (1 - t * (1 - tip));
    const [nx, ny] = [-(yb - ya) / len, (xb - xa) / len];
    left.push([x + nx * r, y + ny * r]);
    right.push([x - nx * r, y - ny * r]);
  }
  return `M${[...left, ...right.reverse()].map(([x, y]) => `${f1(x)} ${f1(y)}`).join(' L')} Z`;
}

// ---- Background tiles ----

// Far away: the endless flat Puszta, a few poplars and tiny white farms on the horizon.
function pusztaFar() {
  const w = GAME_WIDTH;
  const horizon = ridge(w, 150, [[4, 2, 0.5], [2, 7, 1.2]]);
  const band = ridge(w, 172, [[3, 3, 2.1]]);
  const farms = [];
  for (let x = 60; x < w - 60; x += 170 + ((x * 7) % 60)) {
    const y = ridgeY(horizon, x);
    farms.push(`<rect x="${x - 9}" y="${f1(y - 8)}" width="18" height="8" fill="#f2ede0"/><path d="M${x - 11} ${f1(y - 8)} L${x} ${f1(y - 15)} L${x + 11} ${f1(y - 8)} Z" fill="#c9ad72"/>`);
  }
  const poplars = [];
  for (let x = 30; x < w - 30; x += 110 + ((x * 13) % 70)) {
    poplars.push(`<ellipse cx="${x}" cy="${f1(ridgeY(horizon, x) - 18)}" rx="4" ry="18" fill="#8fb27a"/>`);
  }
  return svgDoc(w, 220, `
    <defs><linearGradient id="pf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9d7a6"/><stop offset="1" stop-color="#cbbf7e"/></linearGradient></defs>
    <path d="${polygon(horizon, w, 220)}" fill="url(#pf)"/>
    <path d="${polygon(band, w, 220)}" fill="#c2b26c" opacity="0.6"/>
    ${poplars.join('')}${farms.join('')}`);
}

// Right behind Frankie's path: dry golden steppe grass with tufts and field flowers.
function pusztaNear() {
  const w = GAME_WIDTH;
  const top = ridge(w, 52, [[6, 2, 0.3], [3, 5, 1.7]]);
  const tufts = [];
  for (let x = 14; x < w - 24; x += 26 + ((x * 11) % 22)) {
    const y = ridgeY(top, x) + 10 + ((x * 7) % 60);
    tufts.push(`<path d="M${x - 6} ${y} l3 -11 l3 9 l3 -13 l3 11 l3 -8" fill="none" stroke="${x % 3 ? '#b49a4a' : '#9fae55'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`);
  }
  const flowers = [];
  for (let x = 40; x < w - 20; x += 57 + ((x * 5) % 31)) {
    flowers.push(`<circle cx="${x}" cy="${ridgeY(top, x) + 20 + ((x * 13) % 50)}" r="2.6" fill="${x % 2 ? '#e53935' : '#5b7fd6'}"/>`);
  }
  return svgDoc(w, 140, `
    <defs><linearGradient id="pn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e3cf86"/><stop offset="1" stop-color="#cdb664"/></linearGradient></defs>
    <path d="${polygon(top, w, 140)}" fill="url(#pn)"/>
    ${tufts.join('')}${flowers.join('')}`);
}

// ---- Far: poplars and animals on the steppe ----

// Slim Lombardy poplar: leaf clumps along the edge of its tall crown; its foot hides
// behind the near steppe.
function poplar() {
  const shapes = ['<ellipse cx="30" cy="100" rx="18" ry="80"/>', '<circle cx="30" cy="22" r="5"/>', '<circle cx="30" cy="178" r="5"/>'];
  for (let y = 32; y <= 172; y += 10) {
    const half = 15 * Math.sqrt(1 - ((y - 100) / 78) ** 2);
    shapes.push(`<circle cx="${f1(30 - half)}" cy="${y + (y % 20 ? 3 : 0)}" r="${4.5 + (y % 3)}"/>`);
    shapes.push(`<circle cx="${f1(30 + half)}" cy="${y + (y % 20 ? 0 : 4)}" r="${4.5 + ((y + 1) % 3)}"/>`);
  }
  const crown = shapes.join('');
  // Light streaks: elongated leafy highlights stacked into three upright stripes.
  const streaks = [[21, 46, 18], [22, 86, 22], [21, 128, 16], [28, 34, 20], [29, 76, 26], [28, 122, 24], [30, 158, 12], [36, 60, 16], [37, 98, 20]];
  return svgDoc(60, 200, `
    <defs><clipPath id="pc">${crown}</clipPath></defs>
    <rect x="27" y="178" width="6" height="22" fill="#7a6a4a" ${attrs('#5a4c32', 1.5)}/>
    <g fill="#5f7f4f" stroke="#5f7f4f" stroke-width="4">${crown}</g>
    <g fill="#7ea46a">${crown}</g>
    <g clip-path="url(#pc)">
      <ellipse cx="46" cy="110" rx="13" ry="90" fill="#6a9258" opacity="0.75"/>
      ${streaks.map(([x, y, h]) => `<ellipse cx="${x}" cy="${y}" rx="2.4" ry="${h / 2}" fill="#9cc286"/>`).join('')}
    </g>`);
}

// Hungarian grey cattle, head to the left, with its huge lyre-shaped horns.
function greyCattle() {
  const horn = (p) => {
    const d = taper(p, 7, 0, 1, 0.25);
    const tip = taper(p, 7, 0.72, 1, 0.25);
    return `<path d="${d}" fill="#efe6cf" ${attrs('#a89d82', 1.5)}/><path d="${tip}" fill="#3a3a3a"/>`;
  };
  const leg = (x, x2, color) => `<path d="M${x} 62 L${x2} 92" fill="none" stroke="#6f6a63" stroke-width="9" stroke-linecap="round"/>
    <path d="M${x} 62 L${x2} 92" fill="none" stroke="${color}" stroke-width="5.5" stroke-linecap="round"/>
    <path d="M${x2 - 3} 94 H${x2 + 3}" stroke="#3a3a3a" stroke-width="4" stroke-linecap="round"/>`;
  return svgDoc(160, 100 + LIFT, `
    <defs><linearGradient id="gc" gradientUnits="userSpaceOnUse" x1="26" y1="0" x2="140" y2="0">
      <stop offset="0" stop-color="#a9a39a"/><stop offset="0.3" stop-color="#b8b2a9"/><stop offset="0.48" stop-color="#d3cec6"/><stop offset="1" stop-color="#d3cec6"/></linearGradient></defs>
    ${horn([[29, 31], [43, 27], [50, 14], [43, 1]])}
    ${leg(54, 52, '#958f86')}${leg(120, 122, '#958f86')}
    ${leg(64, 64, '#aaa49b')}${leg(131, 132, '#aaa49b')}
    <path d="M139 38 Q150 50 147 78" fill="none" stroke="#8f897f" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M147 74 C152 80 151 88 147 93 C143 88 142 80 147 74 Z" fill="#3a3a3a"/>
    <path d="M30 34 C40 28 50 23 62 25 C90 29 116 27 132 29 C144 31 146 48 142 62 C138 72 128 74 118 72 L72 72 C62 74 52 76 44 72 C36 68 28 60 26 52 C25 44 26 38 30 34 Z" fill="url(#gc)" ${attrs('#7f7a72', 2)}/>
    <path d="M62 67 Q90 71 118 68" fill="none" stroke="#ffffff" stroke-width="3" opacity="0.35" stroke-linecap="round"/>
    <path d="M128 34 Q138 44 134 58 M56 32 Q66 44 62 60" fill="none" stroke="#bdb7ae" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
    <path d="M18 27 C26 25 33 30 33 38 C33 46 29 54 23 60 C19 64 11 64 9 60 C7 56 9 50 11 44 C13 36 12 30 18 27 Z" fill="#c4beb5" ${attrs('#7f7a72', 2)}/>
    <ellipse cx="12" cy="57" rx="6" ry="5.5" fill="#4a4642"/>
    <circle cx="10" cy="57" r="1.3" fill="#1b1b1b"/>
    <circle cx="20" cy="38" r="3.2" fill="#5a5550"/><circle cx="19.5" cy="38" r="1.7" fill="#1b1b1b"/>
    <ellipse cx="37" cy="33" rx="7" ry="3" transform="rotate(18 37 33)" fill="#b3ada4" ${attrs('#7f7a72', 1.5)}/>
    ${horn([[19, 30], [5, 28], [-1, 15], [7, 1]])}
    <path d="M16 29 Q23 25 30 29" fill="none" stroke="#9a948b" stroke-width="3" stroke-linecap="round"/>`);
}

// Racka sheep: long shaggy wool in twisted locks, black face and legs, and two long
// straight corkscrew horns standing up in a V.
function rackaSheep() {
  const horn = (x, y, angle) => {
    const p = [[0, 0], [0, -8], [0, -16], [0, -26]];
    const d = taper(p, 6, 0, 1, 0.2);
    const twists = [4, 8, 12, 16, 20].map((s) => `<path d="M-4 ${-s + 1.5} L4 ${-s - 1.5}" stroke="#8a7a5a" stroke-width="1.4"/>`).join('');
    return `<g transform="translate(${x} ${y}) rotate(${angle})">
      <defs><clipPath id="rh${x}"><path d="${d}"/></clipPath></defs>
      <path d="${d}" fill="#d8cbb0"/><g clip-path="url(#rh${x})">${twists}</g>
      <path d="${d}" fill="none" ${attrs('#8a7a5a', 1.3)}/></g>`;
  };
  // One twisted lock of wool hanging from (x, top) down to end; sway bends it.
  const lock = (x, top, end, w, sway, fill) => {
    const h = end - top;
    const d = `M${f1(x - w / 2)} ${top} C${f1(x - w / 2 + sway)} ${f1(top + h * 0.35)} ${f1(x - w / 2 - sway)} ${f1(top + h * 0.7)} ${f1(x - 1.2)} ${end - 1} Q${x} ${end + 1.5} ${f1(x + 1.2)} ${end - 1} C${f1(x + w / 2 - sway)} ${f1(top + h * 0.7)} ${f1(x + w / 2 + sway)} ${f1(top + h * 0.35)} ${f1(x + w / 2)} ${top} Z`;
    const twist = [];
    for (let t = 0.25; t < 0.85; t += 0.2) {
      const cx = x + 3 * t * (1 - t) * (1 - 2 * t) * sway;
      twist.push(`M${f1(cx - w / 2 + 2)} ${f1(top + h * t + 1.5)} l${f1(w - 4)} -3`);
    }
    return `<path d="${d}" fill="${fill}" ${attrs('#b3a68c', 1.2)}/><path d="${twist.join(' ')}" stroke="#cbbfa6" stroke-width="1.3" stroke-linecap="round"/>`;
  };
  // The locks start along the curved back, so the coat is shaggy right up to the top.
  const backY = (x) => Math.round(21 + ((x - 64) / 32) ** 2 * 10);
  const back = [];
  for (let i = 0; i < 9; i++) back.push(lock(38 + i * 7, backY(38 + i * 7), 58 + (i % 3) * 3, 7, i % 2 ? 2 : -2, '#ddd0b6'));
  const front = [];
  for (let i = 0; i < 9; i++) {
    const x = 35 + i * 7.4;
    front.push(lock(x, backY(x) + 3, 63 + ((i * 5) % 7), 7.5, i % 2 ? -2.2 : 2.2, i % 2 ? '#f1e8d6' : '#ebe1cc'));
  }
  const curls = [];
  for (let x = 38; x <= 92; x += 9) curls.push(`<ellipse cx="${x}" cy="${backY(x) + 1}" rx="5.5" ry="3.6" fill="#f4ecdb" ${attrs('#b3a68c', 1.1)}/>`);
  return svgDoc(110, 80 + LIFT, `
    <path d="M46 58 V76 M84 58 V76" fill="none" stroke="#3a3430" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M54 60 V78 M76 60 V78" fill="none" stroke="#2b2622" stroke-width="4.5" stroke-linecap="round"/>
    ${lock(100, 34, 62, 6, 2, '#e3d8c0')}
    <path d="M30 42 C30 26 44 18 62 18 C82 18 98 24 98 38 C98 50 94 56 88 58 L40 58 C34 56 30 50 30 42 Z" fill="#e6dcc6" ${attrs('#a8997e', 1.8)}/>
    ${back.join('')}${front.join('')}${curls.join('')}
    ${lock(32, 28, 54, 6.5, 2, '#ebe1cc')}${lock(38, 26, 58, 7, -2, '#f1e8d6')}
    <path d="M30 30 C28 24 22 22 17 25 C11 28 8 36 9 44 C10 48 14 50 18 48 C24 46 30 40 30 30 Z" fill="#2b2622" ${attrs('#141110', 1.5)}/>
    <ellipse cx="34" cy="31" rx="6.5" ry="2.4" transform="rotate(14 34 31)" fill="#2b2622" ${attrs('#141110', 1)}/>
    <circle cx="20" cy="31" r="1.8" fill="#d9b44a"/><circle cx="19.6" cy="31" r="0.8" fill="#141110"/>
    <circle cx="11" cy="44" r="1" fill="#6a605a"/>
    ${horn(20, 26, -26)}${horn(25, 26, 22)}`);
}

// A csikós (Hungarian horse herder) on his brown horse, looking left, cracking his whip.
function csikos() {
  const HORSE = '#8a5230';
  const HORSE_LINE = '#4e2c16';
  const MANE = '#3a2414';
  const leg = (pts, color) => `<path d="M${pts}" fill="none" stroke="${HORSE_LINE}" stroke-width="9.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M${pts}" fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;
  const hoof = (x) => `<path d="M${x - 4} 166 H${x + 4}" stroke="#2b1a10" stroke-width="5" stroke-linecap="round"/>`;
  return svgDoc(170, 170 + LIFT, `
    ${leg('66 112 L68 142 L66 162', '#74421f')}${hoof(66)}
    ${leg('128 110 C134 130 134 140 128 148 L126 162', '#74421f')}${hoof(126)}
    ${leg('56 110 L56 142 L55 162', HORSE)}${hoof(55)}
    ${leg('138 108 C146 128 144 140 138 148 L137 162', HORSE)}${hoof(137)}
    <path d="M146 92 C162 98 166 124 160 152 C156 140 152 132 152 120 C150 132 146 140 140 146 C146 128 146 108 142 98 Z" fill="${MANE}" ${attrs('#1f130a', 1.5)}/>
    <path d="M42 70 C40 84 42 98 50 108 L82 90 C72 80 64 66 56 54 Z" fill="${HORSE}" ${attrs(HORSE_LINE, 2)}/>
    <path d="M50 98 C56 84 82 84 104 86 C122 86 138 84 146 94 C154 104 150 122 140 126 C132 130 124 128 116 126 L78 128 C62 130 50 124 48 112 Z" fill="${HORSE}" ${attrs(HORSE_LINE, 2)}/>
    <path d="M62 92 C80 88 110 90 136 90" fill="none" stroke="#a8693f" stroke-width="4" stroke-linecap="round" opacity="0.8"/>
    <path d="M58 122 Q90 126 120 122" fill="none" stroke="#6e3e1e" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
    <path d="M47 51 C41 51 35 55 31 61 L17 81 C13 87 16 94 23 94 C29 94 33 90 37 86 L49 72 C55 66 55 56 47 51 Z" fill="${HORSE}" ${attrs(HORSE_LINE, 2)}/>
    <path d="M44 53 L44 41 L51 51 Z" fill="${HORSE}" ${attrs(HORSE_LINE, 1.5)}/>
    <path d="M46 48 C58 54 66 68 74 78 C78 84 82 88 86 90 L82 82 C80 86 76 80 74 74 L70 76 C68 68 64 62 60 58 L58 62 C54 56 50 52 46 48 Z" fill="${MANE}" ${attrs('#1f130a', 1.2)}/>
    <path d="M42 54 Q36 54 34 60 Q40 58 44 60 Z" fill="${MANE}"/>
    <circle cx="38" cy="63" r="2" fill="#1b0f08"/><circle cx="37.4" cy="62.4" r="0.7" fill="#ffffff"/>
    <ellipse cx="20" cy="88" rx="2" ry="1.4" fill="#2b1a10"/>
    <path d="M45 55 L27 80 M17 80 L28 86 M23 90 Q50 92 80 82" fill="none" stroke="#2b1a10" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M80 88 C82 80 106 80 112 88 L110 96 H82 Z" fill="#6a3a1e" ${attrs('#3a2010', 1.5)}/>
    <path d="M80 96 H112 L110 104 H82 Z" fill="${HU_RED}" ${attrs('#7a1a20', 1.2)}/>
    <path d="M90 84 H106 C107 94 102 102 96 107 L84 108 C83 100 85 90 90 84 Z" fill="#f4f0e6" ${attrs('#a8a090', 1.5)}/>
    <path d="M84 104 H96 L97 120 C97 123 96 125 93 125 H80 C78 125 78 122 80 121 L84 119 Z" fill="#1d1b1b" ${attrs('#000000', 1)}/>
    <path d="M81 125 Q88 131 95 125" fill="none" stroke="#8a8a8a" stroke-width="1.5"/>
    <path d="M90 60 C88 70 88 80 90 88 H106 C108 78 106 66 104 60 Z" fill="#f4f0e6" ${attrs('#a8a090', 1.5)}/>
    <path d="M90 60 L96 60 L95 88 H89 C88 78 88 68 90 60 Z M104 60 L99 60 L101 88 H106 C108 78 106 68 104 60 Z" fill="#2d3f78" ${attrs('#1b2850', 1.2)}/>
    <circle cx="94" cy="68" r="1.1" fill="#e0b84a"/><circle cx="94" cy="75" r="1.1" fill="#e0b84a"/><circle cx="94" cy="82" r="1.1" fill="#e0b84a"/>
    <path d="M102 60 C110 56 116 50 114 42 C112 38 108 38 106 42 C106 48 102 52 98 54 Z" fill="#ffffff" ${attrs('#a8a090', 1.5)}/>
    <path d="M110 40 L114 30" stroke="#5a3a1e" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="111" cy="40" r="2.6" fill="#e8b48a" ${attrs('#a8765a', 1)}/>
    <path d="M114 30 C120 14 136 4 150 8 C162 12 162 26 152 30 C144 33 140 24 148 20 C154 17 160 22 164 30" fill="none" stroke="#3a2414" stroke-width="1.4" stroke-linecap="round"/>
    <path d="M91 62 C84 64 80 70 82 76 C83 80 86 80 88 78 C90 74 92 70 95 66 Z" fill="#ffffff" ${attrs('#a8a090', 1.5)}/>
    <circle cx="82" cy="80" r="2.6" fill="#e8b48a" ${attrs('#a8765a', 1)}/>
    <path d="M94 52 V61" stroke="#e8b48a" stroke-width="6"/>
    <path d="M95 36 C101 36 103 42 102 48 C101 52 97 54 93 54 C89 54 87 50 87 48 L85 46 L87 44 C87 40 90 36 95 36 Z" fill="#e8b48a" ${attrs('#a8765a', 1.4)}/>
    <path d="M86 49 C88 48 90 48 91 50 C92 52 95 52 96 50" fill="none" stroke="#3a2414" stroke-width="1.8" stroke-linecap="round"/>
    <circle cx="90" cy="42" r="1" fill="#2b1a10"/>
    <ellipse cx="95" cy="36" rx="12" ry="2.6" fill="#1d1b1b"/>
    <path d="M87 36 C87 28 90 25 95 25 C100 25 103 28 103 36 Z" fill="#1d1b1b"/>
    <path d="M87.5 33 H102.5" stroke="#3d3a3a" stroke-width="1.6"/>
    <path d="M101 31 C104 26 106 21 104 15 C108 20 107 27 102 32 Z" fill="#d8d0c0" ${attrs('#6a6458', 1)}/>`);
}

// ---- Mid: farmhouse, well, goulash fire, haystack, flag ----

// Long whitewashed farmhouse (tanya) with a thick reed roof, a porch with wooden posts
// and strings of drying paprika under the eaves.
function paprikaHouse() {
  const roof = 'M4 106 C14 100 24 84 34 66 L56 30 C60 25 64 23 70 23 H170 C176 23 180 25 184 30 L206 66 C214 84 220 100 228 106 Z';
  const reeds = [];
  for (let row = 0, y = 30; y < 104; row++, y += 7) {
    for (let x = 6 + (row % 2) * 4 + ((row * 5) % 3); x < 228; x += 8) {
      reeds.push(`M${x} ${y} l${f1(((x * 7 + row) % 5) * 0.4 - 0.8)} 6`);
    }
  }
  const win = (x) => `
    <rect x="${x - 10}" y="128" width="9" height="24" fill="${HU_GREEN}" ${attrs('#2c4a33', 1.5)}/>
    <rect x="${x + 25}" y="128" width="9" height="24" fill="${HU_GREEN}" ${attrs('#2c4a33', 1.5)}/>
    <path d="M${x - 8} 134 h5 M${x - 8} 140 h5 M${x - 8} 146 h5 M${x + 27} 134 h5 M${x + 27} 140 h5 M${x + 27} 146 h5" stroke="#6a9474" stroke-width="1.5"/>
    <rect x="${x}" y="128" width="24" height="24" fill="#8fb4c4" ${attrs('#ffffff', 3)}/>
    <path d="M${x + 12} 128 V152 M${x} 140 H${x + 24}" stroke="#ffffff" stroke-width="2"/>
    <rect x="${x - 2}" y="152" width="28" height="4" rx="1" fill="#d9d2c2" ${attrs('#b8b0a0', 1)}/>`;
  const post = (x) => `<rect x="${x - 3.5}" y="104" width="7" height="82" fill="#8a5a33" ${attrs(WOOD, 1.8)}/><path d="M${x - 1} 108 V182" stroke="#a8743f" stroke-width="1.5"/>`;
  return svgDoc(230, 200, `
    <defs><clipPath id="rf"><path d="${roof}"/></clipPath></defs>
    <rect x="16" y="100" width="198" height="100" fill="${WHITEWASH}" ${attrs('#b8b0a0', 2)}/>
    <rect x="17" y="104" width="70" height="80" fill="#e4dccb"/>
    <path d="M40 186 V146 Q51 136 62 146 V186 Z" fill="#7a5a3a" ${attrs('#4e3520', 1.5)}/>
    <path d="M45 150 V182 M51 146 V182 M57 150 V182" stroke="#5e4228" stroke-width="1.2"/>
    <rect x="16" y="184" width="198" height="16" fill="#cbb48c" ${attrs('#9a8664', 1.5)}/>
    ${win(110)}${win(170)}
    ${paprikaString(150, 104, 7)}
    <rect x="16" y="100" width="72" height="6" fill="#8a5a33" ${attrs(WOOD, 1.5)}/>
    ${post(22)}${post(54)}${post(84)}
    ${paprikaString(38, 106, 7)}${paprikaString(70, 106, 7)}
    <path d="${roof}" fill="${REED}"/>
    <g clip-path="url(#rf)">
      <path d="M150 20 L228 110 V20 Z" fill="${REED_DARK}" opacity="0.18"/>
      <path d="${reeds.join(' ')}" fill="none" stroke="${REED_DARK}" stroke-width="1.3" stroke-linecap="round" opacity="0.75"/>
      <path d="M0 96 H230 V110 H0 Z" fill="#b48d4a"/>
      <path d="${Array.from({ length: 56 }, (_, i) => `M${4 + i * 4} 97 v8`).join(' ')}" stroke="${REED_DARK}" stroke-width="1.4" opacity="0.8"/>
      <path d="M50 23 H190 V30 H50 Z" fill="#a8843f"/>
    </g>
    <path d="${roof}" fill="none" ${attrs('#7d6234', 2)}/>
    <rect x="152" y="8" width="13" height="18" fill="${WHITEWASH}" ${attrs('#b8b0a0', 1.5)}/>
    <path d="M149 9 H168 L166 3 H151 Z" fill="#a89f8c" ${attrs('#8a8270', 1)}/>`);
}

// Draw well with a sweep (gémeskút): a forked post holds the long pole; the short end
// carries a counterweight, from the high end the bucket hangs down over the well.
// The well stands on the steppe a little behind the path (empty strip below its foot),
// in pale weathered wood with a low curb, so it never looks like something to jump over.
function wellSweep() {
  const [FILL, LINE, LIGHT] = ['#9a7a4f', '#6e5638', '#c4a274'];
  const pole = (x1, y1, x2, y2, w) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${LINE}" stroke-width="${w + 3}" stroke-linecap="round"/>
    <path d="M${x1} ${y1} L${x2} ${y2}" stroke="${FILL}" stroke-width="${w}" stroke-linecap="round"/>`;
  const round = (x) => Math.sqrt(1 - ((x - 160) / 30) ** 2);
  const planks = [136, 144, 152, 160, 168, 176, 184].map((x) => `M${x} ${f1(218 + 5 * round(x))} V${f1(240 + 4 * round(x))}`).join(' ');
  return svgDoc(200, 258, `
    <defs><linearGradient id="curb" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c8b08a"/><stop offset="0.4" stop-color="#b39874"/><stop offset="1" stop-color="#9a8060"/></linearGradient></defs>
    <ellipse cx="112" cy="242" rx="86" ry="5" fill="#9c8a52" opacity="0.3"/>
    ${pole(66, 240, 66, 94, 8)}
    ${pole(66, 96, 57, 74, 5)}${pole(66, 96, 76, 70, 5)}
    <path d="M64 236 V100" stroke="${LIGHT}" stroke-width="2" stroke-linecap="round"/>
    <path d="M10 126 V134" stroke="${FILL}" stroke-width="2"/>
    <rect x="2" y="132" width="22" height="20" rx="3" fill="${FILL}" ${attrs(LINE, 2)}/>
    <path d="M6 138 H20 M6 146 H20" stroke="${LIGHT}" stroke-width="1.5"/>
    <path d="M8 126 L162 16" stroke="${LINE}" stroke-width="8" stroke-linecap="round"/>
    <path d="M8 126 L162 16" stroke="${FILL}" stroke-width="5" stroke-linecap="round"/>
    <path d="M12 121 L150 23" stroke="${LIGHT}" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="66" cy="84.5" r="3" fill="#5a4630"/>
    ${pole(162, 16, 162, 192, 2.5)}
    <path d="M155 194 H169 L167 210 H157 Z" fill="#b09068" ${attrs('#86704f', 1.6)}/>
    <path d="M156 198 H168 M157 206 H167" stroke="#8f8a82" stroke-width="1.6"/>
    <path d="M155 194 Q162 186 169 194" fill="none" stroke="#8f8a82" stroke-width="1.4"/>
    <path d="M130 218 V240 A30 4 0 0 0 190 240 V218 Z" fill="url(#curb)" ${attrs('#86704f', 1.6)}/>
    <path d="${planks}" stroke="#a38a68" stroke-width="1.3"/>
    <path d="M131 230 Q160 236 189 230" fill="none" stroke="#8f8a82" stroke-width="2"/>
    <ellipse cx="160" cy="218" rx="30" ry="5" fill="#d6c29c" ${attrs('#86704f', 1.6)}/>
    <ellipse cx="160" cy="218" rx="24" ry="3" fill="#7a6650"/>`);
}

// Goulash on the fire: a tripod, the cauldron on its chain, a small fire and steam.
// It stands on the steppe a little behind the path (empty strip below its feet), in soft
// pale colours with a gentle fire, so nobody takes it for something to jump over.
const FAR_CAULDRON = { body: '#77716b', line: '#57514b', stew: '#b46a4c', stewLight: '#cf8f70', shine: '#a29c96', handle: '#6a645e' };

function goulashPot() {
  const leg = (x2, w, color) => `<path d="M60 6 L${x2} 128" stroke="#7a6248" stroke-width="${w + 3}" stroke-linecap="round"/><path d="M60 6 L${x2} 128" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
  const links = [];
  for (let y = 12; y < 50; y += 5) {
    links.push(y % 10 === 2 ? `<ellipse cx="60" cy="${y + 2.5}" rx="1.8" ry="3" fill="none" stroke="#7a746e" stroke-width="1.4"/>` : `<path d="M60 ${y} V${y + 5}" stroke="#7a746e" stroke-width="2.4"/>`);
  }
  const log = (x1, y1, x2, y2) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="#7a6248" stroke-width="9" stroke-linecap="round"/><path d="M${x1} ${y1} L${x2} ${y2}" stroke="#a88a66" stroke-width="6" stroke-linecap="round"/>`;
  const steam = (x, y, s) => {
    const [a, b, c, d] = [5, 9, 15, 14].map((n) => f1(n * s));
    return `<path d="M${x} ${y} c-${a} -${a} ${a} -${b} 0 -${c} c-${a} -${a} ${a} -${b} 0 -${d}" fill="none" stroke="#ffffff" stroke-width="3.2" stroke-linecap="round" opacity="0.7"/>`;
  };
  return svgDoc(120, 150, `
    <ellipse cx="60" cy="120" rx="52" ry="4" fill="#9c8a52" opacity="0.3"/>
    <g transform="translate(9 10) scale(0.85)">
      ${leg(60, 4, '#a08664')}
      ${log(40, 126, 82, 118)}${log(38, 118, 80, 126)}
      <path d="M42 124 C38 116 44 110 46 104 C50 110 54 106 58 100 C62 108 66 110 70 104 C74 112 76 118 76 124 Z" fill="#f2bf8a" ${attrs('#dca06c', 1.2)}/>
      <path d="M48 124 C46 118 50 114 52 110 C55 114 58 112 60 108 C63 114 66 116 68 112 C70 118 70 122 70 124 Z" fill="#f7dea8"/>
      <ellipse cx="60" cy="123" rx="11" ry="2.5" fill="#eaa985"/>
      ${leg(8, 5, '#b0946c')}${leg(112, 5, '#b0946c')}
      <path d="M56 8 L64 8 M56 12 L64 12" stroke="#d6bc84" stroke-width="2.2" stroke-linecap="round"/>
      ${links.join('')}
      ${cauldron(60, 72, 1, FAR_CAULDRON)}
      <circle cx="66" cy="72" r="2.2" fill="#ecc98a"/><circle cx="74" cy="70.5" r="1.8" fill="#e6a27a"/><circle cx="47" cy="73" r="1.8" fill="#ecc98a"/>
      <path d="M78 70 L98 46" stroke="#7a6248" stroke-width="3.5" stroke-linecap="round"/><path d="M78 70 L98 46" stroke="#c4a27a" stroke-width="1.8" stroke-linecap="round"/>
      ${steam(44, 60, 1)}${steam(58, 58, 1.15)}${steam(72, 62, 0.9)}
    </g>`);
}

// Round-topped haystack (boglya) of the Puszta, with the pole that holds it together.
function haystack() {
  const body = 'M10 120 C10 96 22 60 42 36 C52 24 78 24 88 36 C108 60 120 96 120 120 Z';
  const straw = [];
  for (let row = 0, y = 34; y < 120; row++, y += 7) {
    for (let x = 12 + (row % 2) * 5; x < 120; x += 10) {
      const lean = (x - 65) * 0.06;
      straw.push(`M${x} ${y} q${f1(lean + 1)} 4 ${f1(lean * 1.6)} 8`);
    }
  }
  return svgDoc(130, 120, `
    <defs><clipPath id="hs"><path d="${body}"/></clipPath></defs>
    <path d="M65 8 V40" stroke="${WOOD}" stroke-width="5.5" stroke-linecap="round"/>
    <path d="M65 8 V40" stroke="#8a6a3a" stroke-width="3" stroke-linecap="round"/>
    <path d="${body}" fill="${STEPPE}"/>
    <g clip-path="url(#hs)">
      <path d="M78 20 C104 50 116 90 120 122 H130 V20 Z" fill="#b8a05a" opacity="0.45"/>
      <path d="M38 50 C28 70 22 92 22 118" fill="none" stroke="#ecdca2" stroke-width="10" stroke-linecap="round" opacity="0.6"/>
      <path d="${straw.join(' ')}" fill="none" stroke="#b49a4a" stroke-width="1.4" stroke-linecap="round" opacity="0.8"/>
      <path d="M20 84 Q65 72 112 84" fill="none" stroke="#a8884a" stroke-width="2.5" opacity="0.6"/>
    </g>
    <path d="${body}" fill="none" ${attrs('#9a8040', 2)}/>
    <path d="M12 112 l-5 -2 M16 100 l-6 -3 M114 104 l6 -2 M118 116 l6 0 M30 58 l-5 -3 M100 60 l5 -3" stroke="#b49a4a" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M46 32 Q65 26 84 32" fill="none" stroke="#9a8040" stroke-width="2" stroke-linecap="round"/>`);
}

// The Hungarian flag on a white pole, waving to the right.
function flagHu() {
  const wave = (y) => `M14 ${y} C30 ${y - 6} 46 ${y + 6} 62 ${y} C70 ${y - 3} 78 ${y - 2} 84 ${y}`;
  const band = (y, color) =>
    `<path d="${wave(y)} L84 ${y + 18} C78 ${y + 16} 70 ${y + 15} 62 ${y + 18} C46 ${y + 24} 30 ${y + 12} 14 ${y + 18} Z" fill="${color}"/>`;
  return svgDoc(90, 200, `
    <rect x="9" y="12" width="6" height="188" rx="2" fill="#ece6d8" ${attrs('#9a907e', 1.5)}/>
    <circle cx="12" cy="10" r="5" fill="#e0b84a" ${attrs('#9a7a2a', 1.5)}/>
    ${band(20, HU_RED)}${band(38, '#ffffff')}${band(56, HU_GREEN)}
    <path d="${wave(20)} L84 74 C78 72 70 71 62 74 C46 80 30 68 14 74 Z" fill="none" ${attrs('#7a6a5a', 1.5)}/>`);
}

// ---- Near: paprika, steppe grass, thistles ----

// Paprika bush with ripe red pods; its foot stands behind the edge of the path.
function paprikaPlant() {
  const leaves = [[40, 30, 16], [24, 40, 14], [56, 40, 14], [32, 54, 15], [50, 54, 15], [40, 46, 14]];
  const pods = [[30, 44, 0.9, -10], [48, 40, 1, 12], [40, 54, 0.85, -4], [58, 52, 0.8, 18], [22, 56, 0.75, -18]];
  return svgDoc(80, 80, `
    <path d="M40 80 V50 M40 62 L28 48 M40 58 L54 46" stroke="#3a6a2a" stroke-width="3" stroke-linecap="round"/>
    ${leaves.map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${f1(r * 0.7)}" fill="#4f9a3a" ${attrs('#2f6a24', 1.8)}/>`).join('')}
    ${leaves.map(([x, y, r]) => `<ellipse cx="${f1(x - r * 0.3)}" cy="${f1(y - r * 0.25)}" rx="${f1(r * 0.45)}" ry="${f1(r * 0.28)}" fill="#6dbb4f"/>`).join('')}
    ${pods.map(([x, y, s, a]) => paprikaPod(x, y, s, a)).join('')}`);
}

// Tuft of dry steppe grass with two plumes of feather grass (árvalányhaj).
function steppeGrass() {
  const blades = [
    [36, 10, -30, '#c9b062'], [38, 4, -16, '#b49a4a'], [40, 14, -6, '#c9b062'], [42, 2, 4, '#b49a4a'], [41, 18, 12, '#c9b062'],
    [44, 8, 22, '#b49a4a'], [46, 20, 30, '#c9b062'], [38, 24, -24, '#b49a4a'], [35, 30, -34, '#c9b062'], [47, 30, 34, '#b49a4a'],
    [39, 12, -10, '#7fae55'], [43, 16, 16, '#7fae55'],
  ];
  return svgDoc(80, 60, `
    <path d="M40 58 C42 50 44 44 46 40 M40 58 C38 50 36 44 34 40" fill="none" stroke="#c9bd94" stroke-width="1.4" stroke-linecap="round"/>
    ${[[[46, 40], [52, 24], [62, 14], [76, 11]], [[34, 40], [28, 24], [18, 14], [4, 12]]].map((p) => `<path d="${taper(p, 5, 0, 1, 0.2)}" fill="#f6f1df" ${attrs('#d2c9a6', 0.8)}/><path d="${taper(p, 1.4, 0.1, 0.9, 0.5)}" fill="#ffffff"/>`).join('')}
    ${blades.map(([x, top, lean, c]) => `<path d="M${x - 3} 60 Q${x + lean * 0.2} ${top + 22} ${x + lean} ${top} Q${x + 1 + lean * 0.3} ${top + 24} ${x + 3} 60 Z" fill="${c}" ${attrs(c === '#7fae55' ? '#5a8a3a' : '#97803c', 0.8)}/>`).join('')}`);
}

// A spiny leaf from (x0, y0) to (x1, y1), w wide, with n teeth on each side.
function spinyLeaf(x0, y0, x1, y1, w, n = 4) {
  const len = Math.hypot(x1 - x0, y1 - y0);
  const [ux, uy] = [(x1 - x0) / len, (y1 - y0) / len];
  const [nx, ny] = [-uy, ux];
  const side = (sign) => {
    const pts = [];
    for (let i = 1; i <= n * 2; i++) {
      const t = i / (n * 2 + 1);
      const r = (w / 2) * Math.sin(Math.PI * t) * (i % 2 ? 1.25 : 0.7) * sign;
      pts.push([x0 + ux * len * t + nx * r, y0 + uy * len * t + ny * r]);
    }
    return pts;
  };
  const pts = [[x0, y0], ...side(1), [x1, y1], ...side(-1).reverse()];
  return `M${pts.map(([x, y]) => `${f1(x)} ${f1(y)}`).join(' L')} Z`;
}

// Thistle with spiny leaves and two purple flower heads.
function thistle() {
  const head = (x, y, r) => {
    const bracts = [];
    for (let i = 0; i < 9; i++) {
      const a = Math.PI * (0.05 + (i / 8) * 0.9);
      bracts.push(`M${f1(x + Math.cos(a) * r * 0.9)} ${f1(y + Math.sin(a) * r * 0.9)} l${f1(Math.cos(a) * 3.5)} ${f1(Math.sin(a) * 3.5)}`);
    }
    const tufts = [];
    for (let i = 0; i < 9; i++) {
      const a = Math.PI * (1.12 + (i / 8) * 0.76);
      const [tx, ty] = [x + Math.cos(a) * r * 1.9, y - r * 0.4 + Math.sin(a) * r * 1.6];
      tufts.push(`<path d="M${x} ${f1(y - r * 0.5)} L${f1(tx)} ${f1(ty)}" stroke="#9b4fb0" stroke-width="2.4" stroke-linecap="round"/><circle cx="${f1(tx)}" cy="${f1(ty)}" r="1.4" fill="#c58ad6"/>`);
    }
    return `${tufts.join('')}
      <ellipse cx="${x}" cy="${y}" rx="${r}" ry="${f1(r * 0.92)}" fill="#7f9a5a" ${attrs('#4f6a3a', 1.6)}/>
      <path d="${bracts.join(' ')}" stroke="#4f6a3a" stroke-width="1.3" stroke-linecap="round"/>
      <path d="M${f1(x - r * 0.85)} ${f1(y + r * 0.2)} Q${x} ${f1(y + r * 1.1)} ${f1(x + r * 0.85)} ${f1(y + r * 0.2)} Q${x} ${f1(y + r * 0.55)} ${f1(x - r * 0.85)} ${f1(y + r * 0.2)} Z" fill="#62804a"/>
      <circle cx="${f1(x - r * 0.4)}" cy="${f1(y - r * 0.45)}" r="1.4" fill="#a8c084"/>`;
  };
  return svgDoc(60, 70, `
    <path d="M30 70 C30 56 28 44 22 30 M29 50 C32 44 36 40 40 36" fill="none" stroke="#4f7a3a" stroke-width="3" stroke-linecap="round"/>
    <path d="${spinyLeaf(30, 62, 8, 52, 12)}" fill="#5f8f4a" ${attrs('#3f6a30', 1.4)}/>
    <path d="${spinyLeaf(30, 54, 52, 44, 11)}" fill="#5f8f4a" ${attrs('#3f6a30', 1.4)}/>
    <path d="${spinyLeaf(27, 42, 12, 36, 8, 3)}" fill="#5f8f4a" ${attrs('#3f6a30', 1.4)}/>
    ${head(40, 32, 6)}${head(22, 24, 7)}`);
}

// ---- Strips: paprika field and the fence with bunting ----

// Strips are laid out every 156 px; drawing everything with that period makes them seamless.
const PERIOD = 156;

// A row of paprika bushes across the whole strip.
function paprikaStrip() {
  const leaves = [[0, 30, 15], [-16, 40, 14], [16, 40, 14], [-9, 54, 15], [9, 54, 15], [0, 46, 14], [-20, 64, 12], [20, 64, 12], [0, 68, 13]];
  const podSets = [
    [[-10, 40, 0.75, -10], [8, 36, 0.8, 12], [0, 52, 0.7, -4], [18, 50, 0.65, 18], [-18, 54, 0.62, -18]],
    [[-6, 38, 0.78, -6], [12, 44, 0.7, 14], [-14, 52, 0.66, -16], [4, 56, 0.66, 6]],
    [[-12, 44, 0.7, -12], [6, 38, 0.75, 8], [16, 54, 0.66, 20], [-2, 58, 0.62, -2], [-20, 58, 0.6, -20]],
  ];
  const bush = (cx, k) => `
    <path d="M${cx} 90 V54 M${cx} 70 L${cx - 12} 56 M${cx} 66 L${cx + 14} 54" stroke="#3a6a2a" stroke-width="3" stroke-linecap="round"/>
    ${leaves.map(([x, y, r]) => `<ellipse cx="${cx + x}" cy="${y}" rx="${r}" ry="${f1(r * 0.7)}" fill="#4f9a3a" ${attrs('#2f6a24', 1.8)}/>`).join('')}
    ${leaves.map(([x, y, r]) => `<ellipse cx="${f1(cx + x - r * 0.3)}" cy="${f1(y - r * 0.25)}" rx="${f1(r * 0.45)}" ry="${f1(r * 0.28)}" fill="#6dbb4f"/>`).join('')}
    ${podSets[k].map(([x, y, s, a], i) => paprikaPod(cx + x, y, s, a, i === 2 ? '#b8201a' : PAPRIKA_RED)).join('')}`;
  const out = [];
  for (let shift = -PERIOD; shift <= PERIOD; shift += PERIOD) {
    [26, 78, 130].forEach((cx, k) => {
      if (cx + shift > -40 && cx + shift < 200) out.push(bush(cx + shift, k));
    });
  }
  return svgDoc(160, 90, `
    <path d="M0 80 Q40 72 78 80 T156 80 T312 80 V90 H0 Z" fill="#3f8a32"/>
    ${out.join('')}`);
}

// Low white picket fence; a string of red, white and green pennants hangs between the posts.
function buntingFence() {
  const ropeAt = (t) => [2 + PERIOD * t, (1 - t) * (1 - t) * 14 + 2 * (1 - t) * t * 54 + t * t * 14];
  const colors = [HU_RED, '#ffffff', HU_GREEN];
  const pennants = [];
  for (let i = 0; i < 7; i++) {
    const [x0, y0] = ropeAt((i + 0.6) / 8);
    const [x1, y1] = ropeAt((i + 1.4) / 8);
    const [xm, ym] = ropeAt((i + 1) / 8);
    pennants.push(`<path d="M${f1(x0)} ${f1(y0)} L${f1(x1)} ${f1(y1)} L${f1(xm + 0.5)} ${f1(ym + 17)} Z" fill="${colors[i % 3]}" ${attrs(i % 3 === 1 ? '#b8b0a0' : '#7a6a5a', 1.2)}/>`);
  }
  const pickets = [];
  for (let i = 1; i < 8; i++) {
    const x = f1(2 + (PERIOD / 8) * i);
    pickets.push(`<path d="M${x - 2} 90 V52 L${x} 49 L${+x + 2} 52 V90 Z" fill="#f4efe4" ${attrs('#9a907e', 1.3)}/>`);
  }
  const post = (x) => `<path d="M${x - 4} 90 V14 Q${x} 9 ${x + 4} 14 V90 Z" fill="#f4efe4" ${attrs('#9a907e', 1.5)}/><circle cx="${x}" cy="11" r="3.4" fill="#e0b84a" ${attrs('#9a7a2a', 1.2)}/>`;
  return svgDoc(160, 90, `
    <rect x="0" y="64" width="160" height="5" fill="#ece6d8" ${attrs('#9a907e', 1.2)}/>
    ${pickets.join('')}
    <path d="M2 14 Q80 54 158 14" fill="none" stroke="#7a6a5a" stroke-width="1.5"/>
    ${pennants.join('')}
    ${post(2)}${post(158)}`);
}

const PIECES = {
  'hills-far-puszta': [GAME_WIDTH, 220, pusztaFar],
  'hills-near-puszta': [GAME_WIDTH, 140, pusztaNear],
  'flag-hu': [90, 200, flagHu],
  'paprika-plant': [80, 80, paprikaPlant],
  poplar: [60, 200, poplar],
  'grey-cattle': [160, 100 + LIFT, greyCattle],
  'racka-sheep': [110, 80 + LIFT, rackaSheep],
  csikos: [170, 170 + LIFT, csikos],
  'paprika-house': [230, 200, paprikaHouse],
  'well-sweep': [200, 258, wellSweep],
  'goulash-pot': [120, 150, goulashPot],
  'haystack-puszta': [130, 120, haystack],
  'steppe-grass': [80, 60, steppeGrass],
  thistle: [60, 70, thistle],
  'paprika-strip': [160, 90, paprikaStrip],
  'bunting-fence': [160, 90, buntingFence],
};

export function pusztaSvgs() {
  return Object.fromEntries(Object.entries(PIECES).map(([key, [w, h, draw]]) => [key, { w, h, svg: draw() }]));
}

export function preloadPuszta(scene) {
  for (const [key, { w, h, svg }] of Object.entries(pusztaSvgs())) loadSvg(scene, key, svg, w, h);
}
