import { GAME_WIDTH } from '../config.js';
import { loadSvg, svgDoc } from './svg.js';
import { attrs, crown, ridge } from './scenery.js';
import { arch, f1, gothic, groundShadow, lozenges, polygon, spire, treeRow } from './muenchen.js';

// Level 15, the Oktoberfest (grown-ups, only loaded after the pretzel button): a sunny late-September
// day on the Theresienwiese in Munich. Entrance and Bavaria statue, the beer tents, the fairground.
// Everything here is background: soft outlines, never the strong OUTLINE, no lettering anywhere.
// The real obstacles of the level are mugs, barrels, crates, balls, puddles, dachshunds and a hedgehog,
// so nothing round, flat or barrel-like stands at the ground line: barrels only sit high on the dray,
// balloons float high up, wheels and loops are hollow rings far away.

// Landmarks stand on the meadow line of hills-far-wiesn: far pictures sit at GROUND_Y - 45 with
// scale ~0.56, so this much empty space below their foot puts the foot on that line (y 128).
const FOOT_GAP = 111;
const MEADOW = 128;

const BLUE = '#3d84c6';
const BLUE_DARK = '#2a609a';
const BLUE_LIGHT = '#9cc6ea';
const CREAM = '#fbf5e4';
const WOOD = '#b98a58';
const WOOD_LIGHT = '#d6a874';
const WOOD_DARK = '#8a5e38';
const WOOD_LINE = '#6e4a2c';
const STONE = '#ddd2b8';
const STONE_LIGHT = '#f1e9d4';
const STONE_SHADE = '#b8aa8e';
const STONE_LINE = '#7b6f5a';
const RED = '#cf4b43';
const RED_DARK = '#8f2f2a';
const RED_LIGHT = '#e88572';
const GOLD = '#f2b83c';
const GOLD_LINE = '#9a6e1c';
const COPPER = '#6fae96';
const COPPER_LIGHT = '#a4d6c0';
const COPPER_LINE = '#3f7561';
const GLASS = '#8fb1cf';
const DARK = '#5e4a46';
const GREEN = '#5c9a46';
const GREEN_DARK = '#3a6a34';
const LEAF = { line: '#3f6b36', base: '#62a547', shade: '#4a8639', light: '#8cc65c', dots: '#b8dc7c' };
const DEEP_LEAF = { line: '#2f5a2c', base: '#4a8a3a', shade: '#3a7432', light: '#6aaa4c', dots: '#92c45e' };

const soft = (color, w = 1.5) => attrs(color, w);
const rad = (deg) => (deg * Math.PI) / 180;

// ---- Small helpers ----

// A pennant on a pole: pole top at (x, y), flag of length len and height h flying to the right.
function flagPole(x, y, h, len, fill, fill2 = null) {
  const wave = `M${x} ${y} Q${f1(x + len * 0.4)} ${f1(y - 3)} ${f1(x + len)} ${f1(y + 2)} Q${f1(x + len * 0.55)} ${f1(y + h * 0.55)} ${f1(x + len)} ${f1(y + h)} Q${f1(x + len * 0.4)} ${f1(y + h + 3)} ${x} ${f1(y + h)} Z`;
  return `<path d="M${x} ${y + h + 40} V${y - 4}" stroke="#a8864a" stroke-width="2.4" stroke-linecap="round"/>
    <circle cx="${x}" cy="${y - 5}" r="2.2" fill="${GOLD}"/>
    <path d="${wave}" fill="${fill}" ${soft(BLUE_DARK, 0.8)}/>
    ${fill2 ? `<path d="M${x} ${f1(y + h / 2)} Q${f1(x + len * 0.4)} ${f1(y + h / 2 - 2)} ${f1(x + len)} ${f1(y + h / 2 + 1)} V${f1(y + h)} Q${f1(x + len * 0.4)} ${f1(y + h + 3)} ${x} ${f1(y + h)} Z" fill="${fill2}"/>` : ''}`;
}

// A white and blue flag (lozenges) on a pole.
function bavarianFlag(x, y, h = 16, len = 28) {
  const id = `bf${x}_${y}`;
  const wave = `M${x} ${y} Q${f1(x + len * 0.4)} ${f1(y - 3)} ${f1(x + len)} ${f1(y + 2)} Q${f1(x + len * 0.55)} ${f1(y + h * 0.55)} ${f1(x + len)} ${f1(y + h)} Q${f1(x + len * 0.4)} ${f1(y + h + 3)} ${x} ${f1(y + h)} Z`;
  return `<defs><clipPath id="${id}"><path d="${wave}"/></clipPath></defs>
    <path d="M${x} ${y + h + 60} V${y - 4}" stroke="#a8864a" stroke-width="2.4" stroke-linecap="round"/>
    <circle cx="${x}" cy="${y - 5}" r="2.2" fill="${GOLD}"/>
    <path d="${wave}" fill="#ffffff"/>
    <g clip-path="url(#${id})"><path d="${lozenges(x, y - 4, len + 4, h + 8, 8)}" fill="${BLUE}"/></g>
    <path d="${wave}" fill="none" ${soft(BLUE_DARK, 0.8)}/>`;
}

// A swag of pennants between two points; sag = how far the rope hangs down in the middle.
function swag(x1, y1, x2, y2, sag, n, colors = ['#ffffff', BLUE]) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 + sag * 2;
  const at = (t) => [(1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * mx + t * t * x2, (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * my + t * t * y2];
  const flags = [];
  for (let i = 0; i < n; i++) {
    const [x, y] = at((i + 0.5) / n);
    flags.push(`<path d="M${f1(x - 4.4)} ${f1(y)} L${f1(x + 4.4)} ${f1(y)} L${f1(x)} ${f1(y + 11)} Z" fill="${colors[i % colors.length]}" ${soft(BLUE_DARK, 0.7)}/>`);
  }
  return `<path d="M${x1} ${y1} Q${f1(mx)} ${f1(my)} ${x2} ${y2}" fill="none" stroke="#d8c8a8" stroke-width="1.8"/>${flags.join('')}`;
}

// A garland of leaves and small flowers hanging between two points.
function garland(x1, y1, x2, y2, sag, n = 9) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 + sag * 2;
  const at = (t) => [(1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * mx + t * t * x2, (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * my + t * t * y2];
  const bits = [];
  for (let i = 0; i <= n; i++) {
    const [x, y] = at(i / n);
    bits.push(`<circle cx="${f1(x)}" cy="${f1(y)}" r="5" fill="${i % 2 ? GREEN : '#4a8a3a'}"/>`);
    if (i % 3 === 1) bits.push(`<circle cx="${f1(x)}" cy="${f1(y - 1)}" r="3" fill="${['#ffffff', '#f6c4d0', '#f6d84a'][Math.floor(i / 3) % 3]}"/>`);
  }
  return `<path d="M${x1} ${y1} Q${f1(mx)} ${f1(my)} ${x2} ${y2}" fill="none" stroke="${GREEN_DARK}" stroke-width="4" stroke-linecap="round"/>${bits.join('')}`;
}

// A small heart (gingerbread, wreath ornament) centred at (x, y), s = half width.
const heartPath = (x, y, s) => `M${f1(x)} ${f1(y + s * 0.95)} C${f1(x - s * 1.6)} ${f1(y - s * 0.1)} ${f1(x - s * 0.95)} ${f1(y - s * 1.1)} ${f1(x)} ${f1(y - s * 0.45)} C${f1(x + s * 0.95)} ${f1(y - s * 1.1)} ${f1(x + s * 1.6)} ${f1(y - s * 0.1)} ${f1(x)} ${f1(y + s * 0.95)} Z`;

// A tiny visitor in Tracht, feet at (x, y), about 44 * s tall. kind 0-5: dirndl in several colours or lederhosen.
const FOLK = [
  { dirndl: true, skirt: '#3d84c6', bodice: '#2a609a', hair: '#6a3f1e' },
  { dirndl: false, pants: '#8a6a44', shirt: '#cf4b43', hat: '#4d7a4a' },
  { dirndl: true, skirt: '#cf4b43', bodice: '#8f2f2a', hair: '#d6a23c' },
  { dirndl: false, pants: '#6a5a40', shirt: '#3d84c6', hat: '#4d7a4a' },
  { dirndl: true, skirt: '#4d8a5a', bodice: '#2f5a3a', hair: '#2e2018' },
  { dirndl: true, skirt: '#8a4a8a', bodice: '#5a2f5a', hair: '#8a4a22' },
];
function person(x, y, s, kind) {
  const p = FOLK[kind % FOLK.length];
  const sk = '#f2c9a0';
  const t = (px, py) => `${f1(x + px * s)} ${f1(y + py * s)}`;
  if (p.dirndl) {
    return `<path d="M${t(-3, -12)} V${f1(y - 2 * s)} M${t(3, -12)} V${f1(y - 2 * s)}" stroke="${sk}" stroke-width="${f1(3 * s)}" stroke-linecap="round"/>
      <path d="M${t(-5, -2)} h${f1(4 * s)} M${t(1.5, -2)} h${f1(4 * s)}" stroke="#4a3322" stroke-width="${f1(2.4 * s)}" stroke-linecap="round"/>
      <path d="M${t(-5, -16)} L${t(-9, -5)} Q${t(0, -2)} ${t(9, -5)} L${t(5, -16)} Z" fill="${p.skirt}"/>
      <path d="M${t(-3.6, -16)} L${t(-4.6, -6)} L${t(4.6, -6)} L${t(3.6, -16)} Z" fill="#ffffff" opacity="0.92"/>
      <path d="M${t(-5, -16)} L${t(-5.4, -27)} Q${t(0, -29)} ${t(5.4, -27)} L${t(5, -16)} Z" fill="${p.bodice}"/>
      <path d="M${t(-3, -27)} Q${t(0, -23)} ${t(3, -27)} Z" fill="#ffffff"/>
      <circle cx="${f1(x)}" cy="${f1(y - 33 * s)}" r="${f1(4.6 * s)}" fill="${sk}"/>
      <path d="M${t(-5, -33)} Q${t(-5, -40)} ${t(0, -39)} Q${t(5, -40)} ${t(5, -33)} Q${t(4, -38)} ${t(0, -36)} Q${t(-4, -38)} ${t(-5, -33)} Z" fill="${p.hair}"/>`;
  }
  return `<path d="M${t(-2.6, -15)} V${f1(y - 3 * s)} M${t(2.6, -15)} V${f1(y - 3 * s)}" stroke="#f4efe0" stroke-width="${f1(3.4 * s)}" stroke-linecap="round"/>
    <path d="M${t(-5.6, -2.6)} h${f1(5 * s)} M${t(0.6, -2.6)} h${f1(5 * s)}" stroke="#4a3322" stroke-width="${f1(2.6 * s)}" stroke-linecap="round"/>
    <path d="M${t(-5.4, -14)} L${t(-5.4, -24)} L${t(5.4, -24)} L${t(5.4, -14)} Z" fill="${p.pants}"/>
    <path d="M${t(-5.4, -28)} L${t(-6, -22)} L${t(6, -22)} L${t(5.4, -28)} Z" fill="${p.shirt}"/>
    <path d="M${t(-3, -26)} L${t(-3, -17)} M${t(3, -26)} L${t(3, -17)}" stroke="#5a4020" stroke-width="${f1(1.6 * s)}"/>
    <circle cx="${f1(x)}" cy="${f1(y - 33 * s)}" r="${f1(4.6 * s)}" fill="${sk}"/>
    <path d="M${t(-6.4, -35)} Q${t(0, -37)} ${t(6.4, -35)} L${t(4.4, -41)} Q${t(0, -43)} ${t(-4.4, -41)} Z" fill="${p.hat}"/>
    <path d="M${t(3, -40)} l${f1(5 * s)} ${f1(-7 * s)}" stroke="#f4efe0" stroke-width="${f1(1.4 * s)}" stroke-linecap="round"/>`;
}

// A horse looking right, hooves on (x, y), about 62 * s high. gallop = carousel pose with raised legs.
function horse(x, y, s, { body, mane, gallop = false, blaze = false, saddle = null, heavy = 1, dir = 1 }) {
  const dark = '#4a3322';
  const legs = gallop
    ? `<path d="M${14} -28 L26 -20 L34 -26" fill="none" stroke="${body}" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/>
       <path d="M5 -28 L18 -14 L22 -22" fill="none" stroke="${body}" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/>
       <path d="M-14 -26 L-26 -14 L-34 -20" fill="none" stroke="${body}" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/>
       <path d="M-20 -26 L-14 -10 L-22 -2" fill="none" stroke="${body}" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/>`
    : `<path d="M14 -28 V-6 M6 -28 V-6 M-14 -28 V-6 M-21 -28 V-6" stroke="${body}" stroke-width="${f1(6.5 * heavy)}" stroke-linecap="round"/>
       <path d="M14 -9 V0 M6 -9 V0 M-14 -9 V0 M-21 -9 V0" stroke="#f4efe0" stroke-width="${f1(7 * heavy)}" stroke-linecap="round"/>
       <path d="M10 1 h9 M2 1 h9 M-18 1 h9 M-25 1 h9" stroke="${dark}" stroke-width="3.2" stroke-linecap="round"/>`;
  return `<g transform="translate(${x} ${y}) scale(${f1(s * dir)} ${f1(s)})">
    ${legs}
    <path d="M-24 -38 Q-40 -34 -38 -14 Q-46 -22 -42 -40 Q-36 -48 -24 -42 Z" fill="${mane}" ${soft(dark, 1)}/>
    <ellipse cx="0" cy="-37" rx="${f1(25 * heavy)}" ry="${f1(12.5 * heavy)}" fill="${body}" ${soft(dark, 1.4)}/>
    <path d="M12 -44 Q20 -62 30 -70 L44 -64 Q38 -50 28 -34 Z" fill="${body}" ${soft(dark, 1.4)}/>
    <ellipse cx="42" cy="-64" rx="12" ry="6" transform="rotate(32 42 -64)" fill="${body}" ${soft(dark, 1.4)}/>
    ${blaze ? '<path d="M38 -70 L52 -57" stroke="#ffffff" stroke-width="3.4" stroke-linecap="round"/>' : ''}
    <path d="M26 -75 L30 -66 L34 -72 Z" fill="${body}" ${soft(dark, 0.8)}/>
    <path d="M24 -72 Q12 -64 8 -46 Q18 -56 30 -64 Z" fill="${mane}"/>
    <circle cx="40" cy="-67" r="1.6" fill="#2a1a10"/>
    ${saddle ? `<path d="M-10 -48 Q0 -50 10 -48 L9 -34 Q0 -32 -9 -34 Z" fill="${saddle}" ${soft(GOLD_LINE, 1)}/><path d="M-9 -42 H9" stroke="${GOLD}" stroke-width="2"/>` : ''}
    </g>`;
}

// ---- Background tiles ----

// Far away: the Alps faintly, the skyline of Munich with the twin towers of the Frauenkirche, the green
// meadow of the Theresienwiese with the Ruhmeshalle on its little hill. Nothing crosses the edges, so it tiles.
function hillsFar() {
  const w = GAME_WIDTH;
  const alps = ridge(w, 62, [[22, 1, 0.7], [12, 3, 1.4], [6, 7, 0.3], [3, 13]]);
  const alps2 = ridge(w, 76, [[13, 2, 2.2], [7, 5, 0.6], [3, 11]]);
  const treeLine = ridge(w, 121, [[4, 2, 1], [3, 6, 0.4]]);
  const capEdge = alps.map(([x, y]) => [x, y + Math.max(0, (58 - y) * 0.7) + (y < 58 ? 2.5 * Math.sin(x * 0.9) : 0)]);
  const sil = '#b9bfd6';
  const silLight = '#cbd0e2';
  const roofCol = '#c3a6b4';
  const houses = [];
  for (let x = 24; x < w - 50; x += 28 + ((x * 7) % 17)) {
    const hw = 20 + ((x * 3) % 14);
    const hh = 14 + ((x * 5) % 18);
    houses.push(`<rect x="${x}" y="${MEADOW - 14 - hh}" width="${hw}" height="${hh + 8}" fill="${sil}"/><path d="M${x - 2} ${MEADOW - 14 - hh} L${x + hw / 2} ${MEADOW - 23 - hh} L${x + hw + 2} ${MEADOW - 14 - hh} Z" fill="${roofCol}"/>`);
  }
  // The twin onion-domed towers of the Frauenkirche with the big roof between them.
  const frauen = (cx) => `
    <path d="M${cx - 18} ${MEADOW - 10} L${cx - 14} ${MEADOW - 50} H${cx + 14} L${cx + 18} ${MEADOW - 10} Z" fill="#b99aa0"/>
    ${[-18, 18].map((dx) => `<rect x="${cx + dx - 8}" y="${MEADOW - 68}" width="16" height="${64}" fill="#c9aab0"/><path d="M${cx + dx - 8} ${MEADOW - 68} Q${cx + dx - 14} ${MEADOW - 80} ${cx + dx} ${MEADOW - 88} Q${cx + dx + 14} ${MEADOW - 80} ${cx + dx + 8} ${MEADOW - 68} Z" fill="#8fb8ac"/><path d="M${cx + dx} ${MEADOW - 86} V${MEADOW - 96}" stroke="#9aa0bd" stroke-width="1.6"/>`).join('')}`;
  const pointed = (x, ww, h) => `<rect x="${x - ww / 2}" y="${MEADOW - 10 - h}" width="${ww}" height="${h + 4}" fill="${silLight}"/><path d="M${x - ww / 2 - 1} ${MEADOW - 10 - h} L${x} ${MEADOW - 36 - h} L${x + ww / 2 + 1} ${MEADOW - 10 - h} Z" fill="${roofCol}"/>`;
  // The hill with the Ruhmeshalle: a low colonnade, pale against the trees.
  const hx = 770;
  const hill = `<path d="M${hx - 90} ${MEADOW + 2} Q${hx} ${MEADOW - 40} ${hx + 90} ${MEADOW + 2} Z" fill="#a6cc78"/>
    <rect x="${hx - 36}" y="${MEADOW - 26}" width="72" height="9" fill="#e6dfcc"/>
    <path d="M${hx - 40} ${MEADOW - 26} H${hx + 40} L${hx + 34} ${MEADOW - 32} H${hx - 34} Z" fill="#d6cfba"/>
    ${Array.from({ length: 13 }, (_, i) => `<rect x="${hx - 33 + i * 5.6}" y="${MEADOW - 24}" width="2" height="8" fill="#b8ae94"/>`).join('')}
    <path d="M${hx} ${MEADOW - 33} V${MEADOW - 44} M${hx - 3} ${MEADOW - 40} H${hx + 3}" stroke="#7fa48c" stroke-width="2.4" stroke-linecap="round"/>`;
  const stripes = [];
  for (let x = 0; x < w; x += 80) stripes.push(`<path d="M${x} ${MEADOW + 4} L${x + 40} ${MEADOW + 4} L${x + 80} 220 L${x + 40} 220 Z" fill="#ffffff" opacity="0.1"/>`);
  const dots = [];
  for (let i = 0; i < 52; i++) {
    const x = (i * 211) % w;
    const y = MEADOW + 12 + ((i * 53) % 74);
    dots.push(`<circle cx="${x}" cy="${y}" r="${1.4 + (i % 3) * 0.5}" fill="${['#fff3b0', '#ffffff', '#f6c4d0', '#9cc6ea'][i % 4]}" opacity="0.7"/>`);
  }
  return svgDoc(w, 220, `
    <defs><linearGradient id="mw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9d878"/><stop offset="1" stop-color="#93c25c"/></linearGradient></defs>
    <path d="${polygon(alps, w, 120)}" fill="#bccae0"/>
    <path d="M${alps.map(([x, y]) => `${x} ${f1(y)}`).join(' L')} L${capEdge.slice().reverse().map(([x, y]) => `${x} ${f1(y)}`).join(' L')} Z" fill="#f6f9fd"/>
    <path d="${polygon(alps2, w, 120)}" fill="#cfdbec"/>
    ${houses.join('')}
    ${frauen(300)}${pointed(150, 12, 44)}${pointed(470, 11, 50)}${pointed(560, 13, 40)}${pointed(900, 11, 36)}${pointed(60, 10, 34)}
    <path d="${polygon(treeLine, w, MEADOW + 2)}" fill="#7fae66"/>
    ${hill}
    ${treeRow(w, treeLine, 26, 6, 11, ['#6ea05c', '#8cb866', '#78aa60'])}
    <rect y="${MEADOW}" width="${w}" height="${220 - MEADOW}" fill="url(#mw)"/>
    ${stripes.join('')}${dots.join('')}
    <path d="M0 ${MEADOW} H${w}" stroke="#d8eaa0" stroke-width="2.4" opacity="0.8"/>`);
}

// Right behind Frankie: tent roofs in rows with flags, chestnut trees, the trampled lawn in front.
function hillsNear() {
  const w = GAME_WIDTH;
  const top = ridge(w, 80, [[4, 2, 0.4], [2.2, 6, 1.3]]);
  const belt = ridge(w, 60, [[6, 3, 1.1], [3, 7, 0.2]]);
  const tent = (x, y, ww, c1, c2) => {
    const id = `tr${x}`;
    const roof = `M${x - ww / 2} ${y} L${x - ww * 0.28} ${y - 20} H${x + ww * 0.28} L${x + ww / 2} ${y} Z`;
    const stripes = [];
    for (let i = 0; i < 10; i++) stripes.push(`<path d="M${f1(x - ww / 2 + (i * ww) / 10)} ${y} L${f1(x - ww * 0.28 + (i * ww * 0.56) / 10)} ${y - 20} h${f1((ww * 0.56) / 10)} L${f1(x - ww / 2 + ((i + 1) * ww) / 10)} ${y} Z" fill="${i % 2 ? c2 : c1}"/>`);
    return `<rect x="${x - ww * 0.44}" y="${y}" width="${ww * 0.88}" height="12" fill="#f4ead2"/>
      <path d="${roof}" fill="${c1}"/><g>${stripes.join('')}</g><path d="${roof}" fill="none" ${soft('#8a7a68', 1)}/>
      <path d="M${x} ${y - 20} V${y - 32}" stroke="#a8864a" stroke-width="1.6"/><path d="M${x} ${y - 32} h9 l-2 4 l2 4 h-9 Z" fill="${c2}"/>`;
  };
  const tents = [[96, 56, 92, '#ffffff', BLUE], [286, 58, 74, '#f7e3dc', '#d96a5a'], [486, 56, 98, '#ffffff', BLUE], [690, 58, 78, '#e5efdc', '#6aa650'], [860, 56, 86, '#ffffff', BLUE]];
  const stripesLawn = [];
  for (let x = 0; x < w; x += 64) stripesLawn.push(`<rect x="${x}" y="92" width="32" height="48" fill="#f6f6a8" opacity="0.1"/>`);
  return svgDoc(w, 140, `
    <defs><linearGradient id="ln" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b4d070"/><stop offset="1" stop-color="#8fbb54"/></linearGradient></defs>
    <path d="${polygon(belt, w, 100)}" fill="#6a9c52"/>
    ${treeRow(w, belt, 22, -2, 15, ['#5f9a4c', '#7bb258', '#6aa653'])}
    ${tents.map(([x, y, ww, c1, c2]) => tent(x, y, ww, c1, c2)).join('')}
    ${treeRow(w, top, 17, 0, 17, ['#73ac55', '#92c466', '#80b85c'])}
    <path d="${polygon(top, w, 140)}" fill="url(#ln)"/>
    <path d="M${top.map(([x, y]) => `${x} ${f1(y + 3)}`).join(' L')}" fill="none" stroke="#e4f0a0" stroke-width="3" opacity="0.8"/>
    ${stripesLawn.join('')}`);
}

// ---- Far: the landmarks ----

// The colonnade of the Ruhmeshalle with the great bronze Bavaria statue and her lion in front.
function bavaria() {
  const W = 340;
  const H = 270;
  const cx = 170;
  const line = soft(STONE_LINE, 1.3);
  const cols = [];
  for (let x = 34; x <= 306; x += 13) {
    if (x > 140 && x < 200) continue;
    cols.push(`<rect x="${x - 3.4}" y="140" width="6.8" height="78" fill="${STONE_LIGHT}" ${soft(STONE_SHADE, 1)}/><rect x="${x + 0.6}" y="140" width="2.4" height="78" fill="${STONE}" opacity="0.8"/><rect x="${x - 5}" y="136" width="10" height="5" fill="${STONE}" ${soft(STONE_SHADE, 0.8)}/>`);
  }
  const bronze = '#7fa48c';
  const lion = (x, y) => `
    <path d="M${x - 24} ${y} Q${x - 28} ${y - 22} ${x - 12} ${y - 26} H${x + 8} Q${x + 14} ${y - 12} ${x + 12} ${y} Z" fill="#d9b66a" ${soft('#8a6a22', 1.2)}/>
    <path d="M${x - 24} ${y - 6} Q${x - 34} ${y - 12} ${x - 30} ${y - 24}" fill="none" stroke="#d9b66a" stroke-width="4" stroke-linecap="round"/>
    <path d="M${x + 4} ${y - 22} Q${x + 10} ${y - 32} ${x + 16} ${y - 34} V${y} H${x + 6} Z" fill="#e6c880" ${soft('#8a6a22', 1)}/>
    <circle cx="${x + 12}" cy="${y - 36}" r="11" fill="#b8883a" ${soft('#8a6a22', 1)}/>
    <circle cx="${x + 13}" cy="${y - 34}" r="6.6" fill="#e6c880"/>
    <circle cx="${x + 15}" cy="${y - 35}" r="1.2" fill="#3a2a1a"/><path d="M${x + 14} ${y - 31} h4" stroke="#6a4a22" stroke-width="1.4" stroke-linecap="round"/>`;
  return svgDoc(W, H + FOOT_GAP, `
    ${crown([[30, 214, 22], [28, 238, 18], [310, 212, 22], [312, 238, 18]], DEEP_LEAF)}
    <rect x="16" y="104" width="308" height="12" fill="${STONE_LIGHT}" ${line}/>
    <path d="M12 116 H328 V136 H12 Z" fill="${STONE}" ${line}/>
    <path d="M12 128 H328" stroke="${STONE_SHADE}" stroke-width="2"/>
    ${Array.from({ length: 22 }, (_, i) => `<rect x="${24 + i * 14}" y="119" width="7" height="6" fill="${STONE_SHADE}" opacity="0.7"/>`).join('')}
    <rect x="26" y="140" width="288" height="80" fill="#6a665e" opacity="0.8"/>
    <path d="M26 140 H314" stroke="#4a463e" stroke-width="3" opacity="0.5"/>
    ${[[60, 0], [100, 0], [240, 0], [280, 0]].map(([x]) => `<path d="${arch(x - 7, 168, 14, 44)}" fill="#8a8678" opacity="0.7"/>`).join('')}
    ${cols.join('')}
    <rect x="22" y="218" width="296" height="8" fill="${STONE_LIGHT}" ${line}/>
    <rect x="12" y="226" width="316" height="8" fill="${STONE}" ${line}/>
    <rect x="4" y="234" width="332" height="10" fill="${STONE_LIGHT}" ${line}/>
    <rect x="${cx - 36}" y="164" width="72" height="80" fill="${STONE}" ${line}/>
    <rect x="${cx - 36}" y="164" width="22" height="80" fill="${STONE_SHADE}" opacity="0.5"/>
    <rect x="${cx - 42}" y="158" width="84" height="10" fill="${STONE_LIGHT}" ${line}/>
    <path d="M${cx - 36} 190 H${cx + 36} M${cx - 36} 216 H${cx + 36}" stroke="${STONE_SHADE}" stroke-width="2"/>
    <path d="M${cx - 12} 80 Q${cx - 20} 120 ${cx - 22} 160 H${cx + 22} Q${cx + 18} 120 ${cx + 12} 80 Z" fill="${bronze}" ${soft('#3f5f4e', 1.4)}/>
    <path d="M${cx - 12} 80 Q${cx - 20} 120 ${cx - 22} 160 H${cx - 8} Q${cx - 8} 120 ${cx - 6} 84 Z" fill="#a3c4ae" opacity="0.7"/>
    <path d="M${cx - 8} 100 Q${cx} 112 ${cx + 8} 100 M${cx - 14} 132 Q${cx - 6} 144 ${cx - 12} 158 M${cx + 12} 126 Q${cx + 6} 142 ${cx + 14} 158" fill="none" stroke="#4f7360" stroke-width="1.6" opacity="0.8"/>
    <path d="M${cx + 10} 86 L${cx + 36} 46" stroke="${bronze}" stroke-width="8" stroke-linecap="round"/>
    <path d="M${cx + 10} 86 L${cx + 36} 46" stroke="#3f5f4e" stroke-width="1" opacity="0.7"/>
    <circle cx="${cx + 40}" cy="36" r="11" fill="none" stroke="#4a8a3a" stroke-width="5"/>
    <circle cx="${cx + 40}" cy="36" r="11" fill="none" stroke="#8cc65c" stroke-width="1.6" stroke-dasharray="3 4"/>
    <path d="M${cx - 14} 92 L${cx - 20} 150" stroke="#4f7360" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M${cx - 22} 108 H${cx - 14}" stroke="${GOLD_LINE}" stroke-width="2.4"/>
    <path d="M${cx - 12} 80 Q${cx} 72 ${cx + 12} 80 L${cx + 8} 70 H${cx - 8} Z" fill="${bronze}" ${soft('#3f5f4e', 1)}/>
    <circle cx="${cx}" cy="62" r="9" fill="${bronze}" ${soft('#3f5f4e', 1.2)}/>
    <path d="M${cx - 7} 56 Q${cx} 46 ${cx + 8} 56 Q${cx + 3} 52 ${cx - 7} 56 Z" fill="#5f846e"/>
    ${lion(cx + 60, 244)}
    ${groundShadow(cx, H, 160, 0.15)}`);
}

// The big entrance gate of the festival: two tall painted towers, the beam with the lozenge shield,
// garlands of leaves, pennants and flags.
function gate() {
  const W = 340;
  const H = 290;
  const tower = (x0) => {
    const x1 = x0 + 74;
    const cx = x0 + 37;
    return `
      <rect x="${x0}" y="86" width="74" height="${H - 86}" fill="${CREAM}" ${soft(WOOD_LINE, 1.5)}/>
      <rect x="${x0}" y="86" width="20" height="${H - 86}" fill="#e6dcc0" opacity="0.7"/>
      <rect x="${x0 - 4}" y="${H - 22}" width="82" height="22" fill="${STONE}" ${soft(STONE_LINE, 1.3)}/>
      <path d="M${x0 + 2} 96 H${x1 - 2} V122 H${x0 + 2} Z" fill="${BLUE}"/>
      <clipPath id="tb${x0}"><rect x="${x0 + 2}" y="96" width="70" height="26"/></clipPath>
      <g clip-path="url(#tb${x0})"><path d="${lozenges(x0 + 2, 96, 70, 26, 13)}" fill="#ffffff"/></g>
      <path d="${gothic(cx - 7, 134, 14, 34)}" fill="#7d8aa0" ${soft('#fffdf4', 2)}/>
      <path d="${gothic(cx - 7, 188, 14, 34)}" fill="#7d8aa0" ${soft('#fffdf4', 2)}/>
      <path d="M${x0} 176 H${x1} M${x0} 232 H${x1}" stroke="${WOOD_DARK}" stroke-width="3"/>
      ${[0, 1, 2].map((i) => `<circle cx="${x0 + 14 + i * 23}" cy="246" r="4" fill="${[RED, '#ffffff', BLUE][i]}" ${soft(WOOD_LINE, 0.8)}/>`).join('')}
      <path d="M${x0 - 6} 86 H${x1 + 6} L${x1 + 2} 76 H${x0 - 2} Z" fill="${WOOD_DARK}" ${soft(WOOD_LINE, 1.3)}/>
      <path d="${spire(cx, 76, 80, 62)}" fill="${BLUE}" ${soft(BLUE_DARK, 1.6)}/>
      <path d="M${cx - 40} 76 L${cx} 14 L${cx - 8} 76 Z" fill="${BLUE_LIGHT}" opacity="0.55"/>
      <g><path d="M${cx} 20 L${cx - 30} 76 H${cx - 18} Z" fill="#ffffff" opacity="0.8"/></g>
      <circle cx="${cx}" cy="13" r="3.6" fill="${GOLD}" ${soft(GOLD_LINE, 1)}/>`;
  };
  return svgDoc(W, H + FOOT_GAP, `
    ${tower(18)}${tower(248)}
    <path d="M92 150 Q170 112 248 150 V120 Q170 80 92 120 Z" fill="${CREAM}" ${soft(WOOD_LINE, 1.6)}/>
    <path d="M92 134 Q170 98 248 134 V112 Q170 76 92 112 Z" fill="${BLUE}"/>
    <path d="M92 150 Q170 112 248 150 V158 Q170 120 92 158 Z" fill="${WOOD_DARK}" ${soft(WOOD_LINE, 1.2)}/>
    <g clip-path="url(#beam)"><path d="${lozenges(92, 76, 156, 62, 12)}" fill="#ffffff" opacity="0.95"/></g>
    <defs><clipPath id="beam"><path d="M92 134 Q170 98 248 134 V112 Q170 76 92 112 Z"/></clipPath></defs>
    <path d="M142 130 H198 V152 Q170 164 142 152 Z" fill="#ffffff" ${soft(BLUE_DARK, 1.6)}/>
    <g clip-path="url(#sh)"><path d="${lozenges(142, 118, 56, 50, 9)}" fill="${BLUE}"/></g>
    <defs><clipPath id="sh"><path d="M142 130 H198 V152 Q170 164 142 152 Z"/></clipPath></defs>
    <path d="M154 126 L158 116 L164 122 L170 112 L176 122 L182 116 L186 126 Z" fill="${GOLD}" ${soft(GOLD_LINE, 1)}/>
    ${garland(92, 154, 18, 112, 22, 8)}${garland(248, 154, 322, 112, 22, 8)}
    ${swag(92, 160, 248, 160, 18, 14)}
    ${swag(18, 200, 92, 194, 12, 7, [RED, '#ffffff', BLUE])}${swag(248, 194, 322, 200, 12, 7, [RED, '#ffffff', BLUE])}
    ${bavarianFlag(54, 4, 14, 26)}${bavarianFlag(286, 4, 14, 26)}
    ${[110, 226].map((x) => `<path d="M${x} 160 V206" stroke="#a8864a" stroke-width="1.6"/><path d="${heartPath(x, 214, 8)}" fill="#e0603f" ${soft(RED_DARK, 1)}/><path d="${heartPath(x, 214, 4.6)}" fill="none" stroke="#fff3e6" stroke-width="1.4" stroke-dasharray="2 2.4"/>`).join('')}
    ${groundShadow(170, H, 150, 0.15)}`);
}

// The twin-towered church of St. Paul: neo-Gothic hall with one tall tower and two small ones.
function paulskirche() {
  const W = 270;
  const H = 300;
  const ochre = '#dcc08a';
  const ochreDark = '#b8996a';
  const line = soft('#7a6040', 1.4);
  const tower = (cx, top, w, bodyTop, spireH) => `
    <rect x="${cx - w / 2}" y="${bodyTop}" width="${w}" height="${H - bodyTop}" fill="${ochre}" ${line}/>
    <rect x="${cx - w / 2}" y="${bodyTop}" width="${w * 0.3}" height="${H - bodyTop}" fill="${ochreDark}" opacity="0.4"/>
    <path d="M${cx - w / 2} ${bodyTop + 36} H${cx + w / 2} M${cx - w / 2} ${bodyTop + 86} H${cx + w / 2}" stroke="${ochreDark}" stroke-width="2.4"/>
    <path d="${gothic(cx - 5, bodyTop + 8, 10, 24)} ${gothic(cx - 5, bodyTop + 46, 10, 30)}" fill="#6a5a50"/>
    <path d="${spire(cx, bodyTop, w + 6, spireH)}" fill="${COPPER}" ${soft(COPPER_LINE, 1.5)}/>
    <path d="M${cx} ${bodyTop - spireH} L${cx - w / 2 - 3} ${bodyTop} H${cx - w * 0.1} Z" fill="${COPPER_LIGHT}" opacity="0.7"/>
    <path d="M${cx} ${bodyTop - spireH} V${bodyTop - spireH - 9}" stroke="${GOLD_LINE}" stroke-width="2"/><circle cx="${cx}" cy="${bodyTop - spireH - 2}" r="2.4" fill="${GOLD}"/>`;
  const windows = [];
  for (let x = 62; x <= 208; x += 20) windows.push(gothic(x, 214, 9, 38));
  return svgDoc(W, H + FOOT_GAP, `
    ${crown([[30, 268, 22], [28, 288, 16], [240, 268, 22], [242, 288, 16]], DEEP_LEAF)}
    <path d="M24 ${H} V190 H246 V${H} Z" fill="${ochre}" ${line}/>
    <path d="M18 190 L135 126 L252 190 Z" fill="#8a96a0" ${soft('#4a5660', 1.5)}/>
    <path d="M18 190 L135 126 L135 190 Z" fill="#a9b6bd" opacity="0.5"/>
    ${[142, 156, 170].map((y) => `<path d="M${f1(18 + (190 - y) * 1.85 * 0.57)} ${y} H${f1(252 - (190 - y) * 1.85 * 0.57)}" stroke="#4a5660" stroke-width="1" opacity="0.4"/>`).join('')}
    <path d="${windows.join(' ')}" fill="#6a5a50" ${soft('#fffdf4', 1.2)}/>
    <path d="M24 204 H246" stroke="${ochreDark}" stroke-width="3"/>
    ${tower(60, 0, 36, 128, 62)}${tower(210, 0, 36, 128, 62)}
    ${tower(135, 0, 46, 62, 56)}
    <path d="${arch(115, 246, 40, 54)}" fill="#6a4a3a" ${soft('#fff3e6', 2)}/>
    <circle cx="135" cy="222" r="11" fill="${STONE_LIGHT}" ${soft('#7a6040', 1.3)}/>
    <path d="M135 213 V231 M126 222 H144 M129 216 L141 228 M141 216 L129 228" stroke="#b8996a" stroke-width="1.3"/>
    ${groundShadow(135, H, 124, 0.15)}`);
}

// The big Ferris wheel: a hollow double ring with spokes, gondolas on the rim and a tall frame.
function riesenrad() {
  const W = 310;
  const H = 310;
  const cx = 155;
  const cy = 130;
  const R = 112;
  const spokes = [];
  for (let i = 0; i < 24; i++) {
    const a = rad(i * 15);
    spokes.push(`M${cx} ${cy} L${f1(cx + Math.cos(a) * R)} ${f1(cy + Math.sin(a) * R)}`);
  }
  const cabins = [];
  for (let i = 0; i < 16; i++) {
    const a = rad(i * 22.5 + 8);
    const x = cx + Math.cos(a) * R;
    const y = cy + Math.sin(a) * R;
    const c = [RED, '#ffffff', BLUE, '#f6c85a'][i % 4];
    cabins.push(`<path d="M${f1(x)} ${f1(y)} V${f1(y + 6)}" stroke="#6a6a72" stroke-width="1.4"/><path d="M${f1(x - 8)} ${f1(y + 6)} H${f1(x + 8)} V${f1(y + 20)} Q${f1(x)} ${f1(y + 24)} ${f1(x - 8)} ${f1(y + 20)} Z" fill="${c}" ${soft('#4a4a54', 1)}/><path d="M${f1(x - 6)} ${f1(y + 11)} H${f1(x + 6)}" stroke="#4a4a54" stroke-width="1" opacity="0.6"/>`);
  }
  const lights = [];
  for (let i = 0; i < 48; i++) {
    const a = rad(i * 7.5);
    lights.push(`<circle cx="${f1(cx + Math.cos(a) * (R + 5))}" cy="${f1(cy + Math.sin(a) * (R + 5))}" r="1.8" fill="#fff0b0"/>`);
  }
  return svgDoc(W, H + FOOT_GAP, `
    <path d="M${cx - 66} 296 L${cx - 6} ${cy + 4} M${cx + 66} 296 L${cx + 6} ${cy + 4} M${cx - 54} 296 L${cx} ${cy + 8} M${cx + 54} 296 L${cx} ${cy + 8}" stroke="#8d97a6" stroke-width="5" stroke-linecap="round"/>
    <path d="M${cx - 66} 296 L${cx - 6} ${cy + 4} M${cx + 66} 296 L${cx + 6} ${cy + 4}" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
    <path d="M${cx - 52} 270 H${cx + 52} M${cx - 40} 238 H${cx + 40} M${cx - 28} 208 H${cx + 28}" stroke="#8d97a6" stroke-width="2.4"/>
    <path d="M${cx - 70} 296 H${cx + 70}" stroke="${STONE_LINE}" stroke-width="5" stroke-linecap="round"/>
    <path d="${spokes.join(' ')}" stroke="#b6bfcc" stroke-width="1.4" opacity="0.95"/>
    <circle cx="${cx}" cy="${cy}" r="${R * 0.62}" fill="none" stroke="#b6bfcc" stroke-width="1.4"/>
    <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#8d97a6" stroke-width="6"/>
    <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#ffffff" stroke-width="2.4"/>
    <circle cx="${cx}" cy="${cy}" r="${R - 12}" fill="none" stroke="#8d97a6" stroke-width="2.4"/>
    ${lights.join('')}
    ${cabins.join('')}
    <circle cx="${cx}" cy="${cy}" r="11" fill="${BLUE}" ${soft(BLUE_DARK, 1.6)}/>
    <circle cx="${cx}" cy="${cy}" r="5" fill="#ffffff"/>
    ${groundShadow(cx, H, 90, 0.14)}`);
}

// A roller coaster far behind, with a loop: white lattice supports under a red track.
function coaster() {
  const W = 380;
  const H = 232;
  const segs = [
    [[4, 150], [40, 100], [70, 50], [96, 28]],
    [[96, 28], [110, 12], [134, 16], [144, 44]],
    [[144, 44], [156, 90], [172, 150], [204, 150]],
    [[204, 150], [220, 150], [226, 150], [232, 150]],
    [[232, 150], [248, 150], [256, 150], [264, 150]],
    [[264, 150], [300, 150], [306, 40], [336, 40]],
    [[336, 40], [352, 40], [362, 60], [372, 96]],
  ];
  const bez = ([p0, p1, p2, p3], t) => {
    const u = 1 - t;
    return [u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0], u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]];
  };
  const trackD = `M${segs[0][0].join(' ')} ${segs.map(([, p1, p2, p3]) => `C${p1.join(' ')} ${p2.join(' ')} ${p3.join(' ')}`).join(' ')}`;
  const supports = [];
  const foot = 226;
  let lastX = -99;
  for (const seg of segs) {
    for (let i = 0; i <= 12; i++) {
      const [x, y] = bez(seg, i / 12);
      if (x - lastX < 17 || y > 146) continue;
      lastX = x;
      supports.push(`<path d="M${f1(x - 4)} ${foot} L${f1(x)} ${f1(y)} L${f1(x + 4)} ${foot} M${f1(x - 3)} ${f1(y + (foot - y) * 0.35)} L${f1(x + 3)} ${f1(y + (foot - y) * 0.6)} M${f1(x + 3)} ${f1(y + (foot - y) * 0.35)} L${f1(x - 3)} ${f1(y + (foot - y) * 0.6)}" fill="none" stroke="#e8edf3" stroke-width="2"/>`);
    }
  }
  const lx = 232;
  const ly = 92;
  const lr = 58;
  // A little train on the lift hill: three cars in a row along the first segment.
  const cars = [0.5, 0.6, 0.7].map((t, i) => {
    const [x, y] = bez(segs[0], t);
    return `<rect x="${f1(x - 6)}" y="${f1(y - 9)}" width="12" height="7" rx="2" transform="rotate(-48 ${f1(x)} ${f1(y)})" fill="${[BLUE, '#ffffff', BLUE][i]}" ${soft(BLUE_DARK, 0.8)}/>`;
  });
  return svgDoc(W, H + FOOT_GAP, `
    <path d="M${lx - 24} ${foot} L${lx - 14} ${ly + lr - 3} M${lx + 24} ${foot} L${lx + 14} ${ly + lr - 3} M${lx - 18} ${foot - 30} L${lx + 18} ${foot - 8} M${lx + 18} ${foot - 30} L${lx - 18} ${foot - 8}" fill="none" stroke="#e8edf3" stroke-width="2.4"/>
    <path d="M${lx - 40} ${ly + lr - 14} V${foot} M${lx + 40} ${ly + lr - 14} V${foot}" stroke="#e8edf3" stroke-width="2.4" opacity="0.9"/>
    ${supports.join('')}
    <path d="${trackD}" fill="none" stroke="${RED_DARK}" stroke-width="6" stroke-linecap="round"/>
    <path d="${trackD}" fill="none" stroke="${RED}" stroke-width="3.6" stroke-linecap="round"/>
    <circle cx="${lx}" cy="${ly}" r="${lr}" fill="none" stroke="${RED_DARK}" stroke-width="6"/>
    <circle cx="${lx}" cy="${ly}" r="${lr}" fill="none" stroke="${RED}" stroke-width="3.6"/>
    <circle cx="${lx}" cy="${ly}" r="${lr - 5}" fill="none" stroke="#e8edf3" stroke-width="1.4" stroke-dasharray="4 3"/>
    ${cars.join('')}
    ${[100, 232, 336].map((x, i) => `<path d="M${x} ${[28, 34, 40][i] - 2} V${[28, 34, 40][i] - 26}" stroke="#a8864a" stroke-width="1.6"/><path d="M${x} ${[28, 34, 40][i] - 26} h12 l-3 4.4 l3 4.4 h-12 Z" fill="${i === 1 ? BLUE : '#ffffff'}" ${soft(BLUE_DARK, 0.6)}/>`).join('')}
    ${groundShadow(190, H, 170, 0.12)}`);
}

// ---- Far: trees, visitors, the brass band, the brewery dray ----

// A small chestnut for the far layer: low enough not to hide the landmarks behind it.
function tree() {
  return svgDoc(130, 140, `
    <path d="M58 138 C62 124 62 112 60 96 H72 C70 112 72 126 76 138 Z" fill="#7a5a3c" ${soft('#4a3322', 1.4)}/>
    ${crown([[40, 66, 26], [66, 44, 32], [94, 64, 26], [66, 78, 28]], DEEP_LEAF)}
    <circle cx="48" cy="84" r="3" fill="#8ab650"/><circle cx="86" cy="76" r="3" fill="#8ab650"/>
    ${groundShadow(66, 138, 34)}`);
}

// A group of visitors in Tracht walking along the far meadow.
function visitorsFar() {
  const folks = [[22, 1, 0], [50, 0.92, 1], [76, 1.06, 2], [112, 0.9, 3], [140, 1, 4], [168, 0.94, 5]];
  return svgDoc(200, 74, `
    ${folks.map(([x, s, k]) => `<ellipse cx="${x}" cy="71" rx="9" ry="2" fill="#4a5a30" opacity="0.2"/>${person(x, 70, s * 1.3, k)}`).join('')}
    <path d="M88 52 V30" stroke="#a8864a" stroke-width="1.4"/>
    <path d="${heartPath(88, 24, 7)}" fill="#e0603f" ${soft(RED_DARK, 0.8)}/>`);
}

// A small stage with a brass band: a white and blue roof, musicians in Tracht with tubas and trumpets.
function bandStage() {
  const W = 250;
  const H = 180;
  const gold = '#e8b53a';
  const musician = (x, kind, inst) => {
    const instr = {
      tuba: `<path d="M${x + 6} 102 q14 -10 12 -26 q-2 -8 -9 -6" fill="none" stroke="${gold}" stroke-width="5" stroke-linecap="round"/><path d="M${x + 9} 66 q4 -8 12 -6 q4 8 -2 12 Z" fill="${gold}" ${soft(GOLD_LINE, 1)}/>`,
      trumpet: `<path d="M${x + 4} 86 l22 -7" stroke="${gold}" stroke-width="3.6" stroke-linecap="round"/><path d="M${x + 24} 74 l8 -4 l1 14 l-8 -2 Z" fill="${gold}" ${soft(GOLD_LINE, 0.9)}/>`,
      horn: `<path d="M${x + 4} 88 q18 -2 20 -14 q0 -10 -9 -8 q-6 4 0 10" fill="none" stroke="${gold}" stroke-width="4" stroke-linecap="round"/>`,
    }[inst];
    return `${person(x, 118, 1.5, kind)}${instr}`;
  };
  return svgDoc(W, H, `
    <path d="M30 112 V${H - 2} M220 112 V${H - 2} M80 112 V${H - 2} M170 112 V${H - 2}" stroke="${WOOD_DARK}" stroke-width="5" stroke-linecap="round"/>
    <path d="M30 150 L80 176 M80 150 L30 176 M80 150 L130 176 M130 150 L80 176 M130 150 L170 176 M170 150 L130 176 M170 150 L220 176 M220 150 L170 176" stroke="${WOOD}" stroke-width="2" opacity="0.7"/>
    <rect x="14" y="30" width="222" height="82" fill="#c9d8e2" opacity="0.5"/>
    ${[[56, 1, 'tuba'], [92, 3, 'trumpet'], [128, 0, 'horn'], [164, 5, 'trumpet'], [200, 2, 'tuba']].map(([x, k, i]) => musician(x, k, i)).join('')}
    <rect x="8" y="112" width="234" height="12" rx="2" fill="${WOOD_LIGHT}" ${soft(WOOD_LINE, 1.4)}/>
    <path d="M8 124 H242" stroke="${WOOD_DARK}" stroke-width="3"/>
    <defs><clipPath id="rf"><path d="M4 40 L125 6 L246 40 Z"/></clipPath></defs>
    <path d="M4 40 L125 6 L246 40 Z" fill="#ffffff"/>
    <g clip-path="url(#rf)"><path d="${lozenges(0, 0, 250, 44, 14)}" fill="${BLUE}"/></g>
    <path d="M4 40 L125 6 L246 40 Z" fill="none" ${soft(BLUE_DARK, 1.6)}/>
    <path d="M4 40 Q30 50 54 40 Q80 50 104 40 Q126 50 148 40 Q172 50 196 40 Q220 50 246 40 L246 36 H4 Z" fill="#ffffff" ${soft(BLUE_DARK, 1)}/>
    <path d="M125 6 V-2" stroke="${GOLD_LINE}" stroke-width="2"/>
    ${swag(40, 46, 210, 46, 6, 12)}
    ${groundShadow(125, H - 1, 100, 0.14)}`);
}

// The brewery dray: two heavy horses, a blue wagon with a stack of barrels and the driver. The barrels
// ride high on the wagon bed, far back; the wheels are hollow spoked rings.
function dray() {
  const W = 330;
  const H = 150;
  const wheel = (cx, cy, r) => {
    const sp = [];
    for (let i = 0; i < 12; i++) sp.push(`M${cx} ${cy} L${f1(cx + Math.cos(rad(i * 30)) * r)} ${f1(cy + Math.sin(rad(i * 30)) * r)}`);
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#6a4630" stroke-width="5"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#d6a874" stroke-width="2"/><path d="${sp.join(' ')}" stroke="#8a5e38" stroke-width="1.8"/><circle cx="${cx}" cy="${cy}" r="3.4" fill="#4a4a52"/>`;
  };
  const barrel = (x, y) => `<path d="M${x - 10} ${y} Q${x - 14} ${y - 12} ${x - 10} ${y - 24} H${x + 10} Q${x + 14} ${y - 12} ${x + 10} ${y} Z" fill="#c4823f" ${soft('#6e4a2c', 1.2)}/><path d="M${x - 12} ${y - 7} H${x + 12} M${x - 12} ${y - 17} H${x + 12}" stroke="#4a4a52" stroke-width="2"/><path d="M${x - 6} ${y - 3} V${y - 22}" stroke="#e6a868" stroke-width="2" opacity="0.7"/>`;
  return svgDoc(W, H, `
    ${horse(72, 128, 0.86, { body: '#8a5a38', mane: '#3a2a20', blaze: true, heavy: 1.12, dir: -1 })}
    ${horse(124, 130, 0.9, { body: '#9a6a44', mane: '#3a2a20', blaze: true, heavy: 1.12, dir: -1 })}
    <path d="M140 98 H156" stroke="#6a4a30" stroke-width="3"/>
    ${wheel(214, 118, 22)}${wheel(274, 112, 28)}
    <path d="M156 96 H300 V116 H156 Z" fill="${BLUE}" ${soft(BLUE_DARK, 1.6)}/>
    <g><clipPath id="dz"><rect x="156" y="96" width="144" height="20"/></clipPath></g>
    <g clip-path="url(#dz)"><path d="${lozenges(156, 96, 144, 20, 9)}" fill="#ffffff" opacity="0.92"/></g>
    <rect x="156" y="92" width="144" height="6" fill="${WOOD_LIGHT}" ${soft(WOOD_LINE, 1.2)}/>
    ${barrel(184, 92)}${barrel(208, 92)}${barrel(232, 92)}${barrel(256, 92)}${barrel(280, 92)}
    ${barrel(196, 68)}${barrel(220, 68)}${barrel(244, 68)}${barrel(268, 68)}
    ${barrel(208, 44)}${barrel(232, 44)}${barrel(256, 44)}
    ${person(162, 82, 1.2, 3)}
    <path d="M150 96 V80 H174 V96 Z" fill="${WOOD}" ${soft(WOOD_LINE, 1.2)}/>
    <path d="M120 100 Q140 86 156 92" fill="none" stroke="#6a4a30" stroke-width="2"/>
    ${groundShadow(170, H - 3, 140, 0.1)}`);
}

// ---- Mid: the entrance, trees, tents, rides and stalls ----

// A big old chestnut with hanging lanterns, shading the beer garden of the entrance.
function chestnut() {
  const fruit = ([x, y]) => `<circle cx="${x}" cy="${y}" r="5.4" fill="#8ab650" ${soft('#4a7a30', 1)}/>`;
  const lantern = ([x, y], i) => `<path d="M${x} ${y - 14} V${y}" stroke="#7a6a50" stroke-width="1.2"/><path d="M${x - 5} ${y} H${x + 5} L${x + 4} ${y + 10} Q${x} ${y + 13} ${x - 4} ${y + 10} Z" fill="${['#fff0b0', '#f6c4d0', '#cfe6f6'][i % 3]}" ${soft('#7a6a50', 1)}/>`;
  return svgDoc(220, 260, `
    <path d="M96 256 C102 228 104 202 100 172 L120 172 C118 202 122 230 130 256 Z" fill="#6a4a32" ${soft('#3f2a1c', 1.6)}/>
    <path d="M100 256 C106 230 108 206 104 176 L109 176 C110 208 112 232 110 256 Z" fill="#4a3322" opacity="0.6"/>
    <g transform="translate(0 20)">${crown([[52, 122, 34], [92, 78, 42], [144, 72, 44], [178, 114, 34], [134, 122, 44], [82, 134, 38], [112, 40, 28]], DEEP_LEAF)}
    ${[[72, 154], [128, 160], [152, 138], [46, 138], [102, 116], [166, 92]].map(fruit).join('')}</g>
    ${[[60, 176], [92, 188], [150, 182], [176, 168]].map(lantern).join('')}
    ${groundShadow(110, 256, 56, 0.2)}`);
}

// Shared bits for the tent facades.
const tentWindows = (xs, y, w, h) => xs.map((x) => `<path d="${arch(x, y, w, h)}" fill="#8fb1cf" ${soft('#fffdf4', 2)}/><path d="M${f1(x + w / 2)} ${y} V${y + h}" stroke="#fffdf4" stroke-width="1.4"/>`).join('');

// Tent A: white and blue, a tall central tower with a slim pointed roof, lozenge gable and a wreath of hearts.
function tentA() {
  const W = 340;
  const H = 310;
  const cx = 170;
  return svgDoc(W, H, `
    <defs>
      <clipPath id="gA"><path d="M84 168 L${cx} 100 L256 168 Z"/></clipPath>
      <clipPath id="rA"><path d="M6 164 L52 122 H288 L334 164 Z"/></clipPath>
      <clipPath id="bA"><rect x="20" y="164" width="300" height="22"/></clipPath>
    </defs>
    <path d="M6 164 L52 122 H288 L334 164 Z" fill="#ffffff"/>
    <g clip-path="url(#rA)">${Array.from({ length: 14 }, (_, i) => `<path d="M${f1(6 + i * 23.4)} 164 L${f1(52 + i * 17)} 122 h${f1(17)} L${f1(29.4 + i * 23.4)} 164 Z" fill="${i % 2 ? BLUE : '#ffffff'}"/>`).join('')}</g>
    <path d="M6 164 L52 122 H288 L334 164 Z" fill="none" ${soft(BLUE_DARK, 1.6)}/>
    <rect x="20" y="164" width="300" height="${H - 164}" fill="${CREAM}" ${soft(WOOD_LINE, 1.6)}/>
    <rect x="20" y="164" width="300" height="22" fill="${BLUE}"/>
    <g clip-path="url(#bA)"><path d="${lozenges(20, 164, 300, 22, 11)}" fill="#ffffff"/></g>
    ${Array.from({ length: 11 }, (_, i) => `<rect x="${24 + i * 28}" y="186" width="5" height="${H - 186}" fill="${WOOD}" opacity="0.8"/>`).join('')}
    <path d="M20 232 H320" stroke="${WOOD_DARK}" stroke-width="3"/>
    ${tentWindows([40, 70, 100, 224, 254, 284], 196, 16, 32)}
    ${tentWindows([40, 70, 100, 224, 254, 284], 244, 16, 40)}
    <path d="M84 168 L${cx} 100 L256 168 Z" fill="#ffffff" ${soft(BLUE_DARK, 1.6)}/>
    <g clip-path="url(#gA)"><path d="${lozenges(80, 96, 180, 76, 14)}" fill="${BLUE}"/></g>
    <path d="M84 168 L${cx} 100 L256 168 Z" fill="none" ${soft(BLUE_DARK, 1.8)}/>
    <rect x="${cx - 54}" y="168" width="108" height="${H - 168}" fill="#f6ecd2" ${soft(WOOD_LINE, 1.5)}/>
    <path d="${arch(cx - 28, 220, 56, 90)}" fill="#6a4a3a" ${soft('#fff3e6', 2.4)}/>
    <path d="${arch(cx - 20, 232, 40, 78)}" fill="#8a6a50"/>
    <path d="M${cx} 232 V310" stroke="#4a3226" stroke-width="2"/>
    ${[-40, 40].map((dx) => `<path d="${arch(cx + dx - 7, 190, 14, 24)}" fill="#8fb1cf" ${soft('#fffdf4', 2)}/>`).join('')}
    <circle cx="${cx}" cy="148" r="17" fill="#ffffff" ${soft(BLUE_DARK, 1.6)}/>
    <path d="${heartPath(cx, 148, 10)}" fill="${RED}" ${soft(RED_DARK, 1)}/>
    ${[0, 60, 120, 180, 240, 300].map((a) => `<circle cx="${f1(cx + Math.cos(rad(a)) * 22)}" cy="${f1(148 + Math.sin(rad(a)) * 22)}" r="2.8" fill="${[GREEN, '#ffffff'][(a / 60) % 2]}"/>`).join('')}
    <rect x="${cx - 24}" y="40" width="48" height="66" fill="${CREAM}" ${soft(WOOD_LINE, 1.5)}/>
    <rect x="${cx - 24}" y="40" width="14" height="66" fill="#e6dcc0" opacity="0.7"/>
    <path d="M${cx - 28} 40 H${cx + 28}" stroke="${WOOD_DARK}" stroke-width="3.4"/>
    <circle cx="${cx}" cy="64" r="9" fill="#fffdf0" ${soft('#6a5a4a', 1.4)}/><path d="M${cx} 64 V58 M${cx} 64 L${cx + 4} 66" stroke="#3a2a22" stroke-width="1.3" stroke-linecap="round"/>
    <path d="${arch(cx - 6, 82, 12, 22)}" fill="#8fb1cf" ${soft('#fffdf4', 1.6)}/>
    <path d="${spire(cx, 40, 60, 38)}" fill="${BLUE}" ${soft(BLUE_DARK, 1.5)}/>
    <path d="M${cx} 2 L${cx - 30} 40 H${cx - 10} Z" fill="${BLUE_LIGHT}" opacity="0.55"/>
    <circle cx="${cx}" cy="3" r="3.2" fill="${GOLD}" ${soft(GOLD_LINE, 1)}/>
    ${bavarianFlag(34, 100, 14, 26)}${bavarianFlag(306, 100, 14, 26)}${bavarianFlag(96, 112, 12, 22)}${bavarianFlag(244, 112, 12, 22)}
    ${swag(34, 164, cx - 54, 170, 10, 8)}${swag(cx + 54, 170, 306, 164, 10, 8)}
    ${groundShadow(170, H - 1, 150, 0.15)}`);
}

// Tent B: red and white with gold, two onion-domed towers and a balcony with a garland between them.
function tentB() {
  const W = 340;
  const H = 320;
  const tower = (x0) => {
    const cx = x0 + 28;
    return `
      <rect x="${x0}" y="120" width="56" height="${H - 120}" fill="#f6ecd2" ${soft(WOOD_LINE, 1.5)}/>
      <rect x="${x0}" y="120" width="16" height="${H - 120}" fill="#e6dcc0" opacity="0.7"/>
      <path d="M${x0} 156 H${x0 + 56} M${x0} 226 H${x0 + 56}" stroke="${RED}" stroke-width="10"/>
      <path d="${arch(cx - 8, 170, 16, 44)} ${arch(cx - 8, 240, 16, 44)}" fill="#8fb1cf" ${soft('#fffdf4', 2)}/>
      <path d="M${x0 - 4} 120 H${x0 + 60}" stroke="${GOLD_LINE}" stroke-width="4"/>
      <path d="M${cx - 32} 120 Q${cx - 44} 70 ${cx - 12} 56 Q${cx - 4} 46 ${cx - 6} 30 L${cx + 6} 30 Q${cx + 4} 46 ${cx + 12} 56 Q${cx + 44} 70 ${cx + 32} 120 Z" fill="${RED}" ${soft(RED_DARK, 1.6)}/>
      <path d="M${cx - 32} 120 Q${cx - 44} 70 ${cx - 12} 56 Q${cx - 4} 46 ${cx - 6} 30 L${cx - 1} 30 Q${cx - 12} 70 ${cx - 14} 120 Z" fill="${RED_LIGHT}" opacity="0.7"/>
      <path d="M${cx - 30} 100 Q${cx} 108 ${cx + 30} 100 M${cx - 24} 82 Q${cx} 90 ${cx + 24} 82" fill="none" stroke="${GOLD}" stroke-width="2.4"/>
      <path d="M${cx} 30 V16" stroke="${GOLD_LINE}" stroke-width="2.4"/><circle cx="${cx}" cy="14" r="4" fill="${GOLD}" ${soft(GOLD_LINE, 1)}/>`;
  };
  const stripes = [];
  for (let i = 0; i < 12; i++) stripes.push(`<path d="M${f1(112 + i * 9)} 176 L${f1(116 + i * 8.5)} 140 h${f1(8.5)} L${f1(121 + i * 9)} 176 Z" fill="${i % 2 ? RED : '#ffffff'}"/>`);
  return svgDoc(W, H, `
    ${tower(20)}${tower(264)}
    <rect x="76" y="150" width="188" height="${H - 150}" fill="#f6ecd2" ${soft(WOOD_LINE, 1.5)}/>
    <path d="M70 150 L100 112 H240 L270 150 Z" fill="${RED}" ${soft(RED_DARK, 1.6)}/>
    <path d="M70 150 L100 112 H240 L270 150 Z" fill="none"/>
    ${Array.from({ length: 12 }, (_, i) => `<path d="M${f1(70 + i * 16.7)} 150 L${f1(100 + i * 11.7)} 112 h${f1(11.7)} L${f1(86.7 + i * 16.7)} 150 Z" fill="${i % 2 ? RED : '#ffffff'}"/>`).join('')}
    <path d="M70 150 L100 112 H240 L270 150 Z" fill="none" ${soft(RED_DARK, 1.6)}/>
    <path d="M76 190 H264" stroke="${WOOD_DARK}" stroke-width="3"/>
    <rect x="86" y="170" width="168" height="8" fill="${WOOD_LIGHT}" ${soft(WOOD_LINE, 1.2)}/>
    ${[90, 106, 122, 138, 154, 170, 186, 202, 218, 234].map((x) => `<path d="M${x} 170 V186" stroke="${WOOD_DARK}" stroke-width="2.4"/>`).join('')}
    <path d="M86 186 H254" stroke="${WOOD_DARK}" stroke-width="3"/>
    ${garland(86, 176, 254, 176, 14, 12)}
    <path d="${arch(142, 224, 56, 96)}" fill="#6a4a3a" ${soft('#fff3e6', 2.4)}/>
    <path d="${arch(150, 236, 40, 84)}" fill="#8a6a50"/>
    ${tentWindows([90, 112, 218, 240], 206, 14, 30)}
    <path d="M${f1(170)} 110 V150" stroke="none"/>
    <path d="M110 148 Q170 122 230 148" fill="none" stroke="${GOLD}" stroke-width="3"/>
    <circle cx="170" cy="130" r="12" fill="#ffffff" ${soft(RED_DARK, 1.4)}/>
    <path d="${heartPath(170, 130, 7)}" fill="${RED}"/>
    ${bavarianFlag(76, 124, 14, 26)}${bavarianFlag(260, 124, 14, 26)}
    ${swag(48, 176, 76, 196, 6, 3, [RED, '#ffffff'])}${swag(264, 196, 292, 176, 6, 3, [RED, '#ffffff'])}
    ${groundShadow(170, H - 1, 150, 0.15)}`);
}

// Tent C: a wide wooden hall in green and white, a big gable with a cut-out heart pattern, small lantern turrets.
function tentC() {
  const W = 320;
  const H = 290;
  const timber = '#8a5e38';
  const hearts = [];
  for (let y = 0; y < 3; y++) for (let x = 0; x < 6 - y; x++) hearts.push(`<path d="${heartPath(100 + y * 12 + x * 24, 96 + y * 22, 8)}" fill="#6aa650" ${soft('#3a6a34', 0.9)}/>`);
  const turret = (cx) => `
    <rect x="${cx - 14}" y="86" width="28" height="${H - 86}" fill="#f6ecd2" ${soft(WOOD_LINE, 1.4)}/>
    <rect x="${cx - 14}" y="86" width="8" height="${H - 86}" fill="#e6dcc0" opacity="0.7"/>
    <path d="${arch(cx - 5, 104, 10, 22)}" fill="#8fb1cf" ${soft('#fffdf4', 1.6)}/>
    <path d="M${cx - 18} 86 L${cx} 52 L${cx + 18} 86 Z" fill="${GREEN}" ${soft(GREEN_DARK, 1.5)}/>
    <path d="M${cx} 52 V38" stroke="${GOLD_LINE}" stroke-width="2"/><path d="M${cx - 5} 48 l5 -14 l5 14 Z" fill="${GOLD}"/>`;
  return svgDoc(W, H, `
    ${turret(36)}${turret(284)}
    <rect x="52" y="146" width="216" height="${H - 146}" fill="#f6ecd2" ${soft(WOOD_LINE, 1.5)}/>
    <path d="M44 146 L160 66 L276 146 Z" fill="#ffffff" ${soft(GREEN_DARK, 1.6)}/>
    <path d="M44 146 L160 66 L276 146 Z" fill="none"/>
    ${Array.from({ length: 12 }, (_, i) => `<path d="M${f1(44 + i * 19.3)} 146 L${f1(160 + (i - 6) * 9.6 * 0.18)} 66 L${f1(63.3 + i * 19.3)} 146 Z" fill="${i % 2 ? '#7fb264' : 'none'}" opacity="0.5"/>`).join('')}
    <path d="M60 138 L160 72 L260 138" fill="none" stroke="${timber}" stroke-width="5" stroke-linecap="round"/>
    ${hearts.join('')}
    <path d="M44 146 L160 66 L276 146 Z" fill="none" ${soft(GREEN_DARK, 1.8)}/>
    <path d="M160 66 V50" stroke="${GOLD_LINE}" stroke-width="2.4"/><circle cx="160" cy="48" r="4" fill="${GOLD}" ${soft(GOLD_LINE, 1)}/>
    <path d="M52 146 H268" stroke="${timber}" stroke-width="5"/>
    ${Array.from({ length: 9 }, (_, i) => `<rect x="${58 + i * 24}" y="150" width="5" height="${H - 150}" fill="${timber}" opacity="0.8"/>`).join('')}
    <path d="M52 200 H268" stroke="${timber}" stroke-width="3"/>
    ${tentWindows([70, 94, 118, 202, 226, 250], 160, 14, 28)}
    ${tentWindows([70, 94, 118, 202, 226, 250], 210, 14, 36)}
    <path d="${arch(134, 214, 52, 76)}" fill="#6a4a3a" ${soft('#fff3e6', 2.2)}/>
    <path d="${arch(142, 226, 36, 64)}" fill="#8a6a50"/>
    ${[[134, 214], [186, 214]].map(([x]) => `<circle cx="${x}" cy="206" r="3" fill="${GOLD}"/>`).join('')}
    ${garland(52, 150, 134, 156, 10, 7)}${garland(186, 156, 268, 150, 10, 7)}
    ${swag(68, 200, 126, 204, 8, 5, ['#ffffff', GREEN])}${swag(194, 204, 252, 200, 8, 5, ['#ffffff', GREEN])}
    ${groundShadow(160, H - 1, 140, 0.15)}`);
}

// The chain swing ride: a tall tower with a striped canopy and chairs swinging out on long chains.
function chainSwing() {
  const W = 270;
  const H = 340;
  const cx = 115;
  const seats = [];
  const rim = [[34, -1], [52, -1], [72, -1], [158, 1], [178, 1], [196, 1], [92, -0.35], [138, 0.35], [115, 0]];
  const colors = [RED, BLUE, '#f6c85a', '#ffffff', GREEN, RED];
  rim.forEach(([x, d], i) => {
    const sx = x + d * 40;
    const sy = 190 - Math.abs(d) * 6;
    const c = colors[i % colors.length];
    seats.push(`<path d="M${x} 108 L${f1(sx - 4)} ${sy - 6} M${x + 5} 108 L${f1(sx + 4)} ${sy - 6}" stroke="#8d97a6" stroke-width="1.2"/>
      <path d="M${f1(sx - 8)} ${sy} H${f1(sx + 8)} V${sy + 4} H${f1(sx - 8)} Z M${f1(sx - 8)} ${sy - 12} V${sy} H${f1(sx - 5)} V${sy - 12} Z" fill="${c}" ${soft('#4a4a54', 1)}/>
      <circle cx="${f1(sx)}" cy="${sy - 14}" r="3.6" fill="${i % 2 ? '#f2c9a0' : '#e0b088'}"/><path d="M${f1(sx - 4)} ${sy} V${sy - 10} H${f1(sx + 4)} V${sy}" fill="${['#3d84c6', '#cf4b43', '#4d8a5a'][i % 3]}" opacity="0.9"/>`);
  });
  const bulbs = Array.from({ length: 12 }, (_, i) => `<circle cx="${22 + i * 17.8}" cy="107" r="2.4" fill="#fff0b0"/>`).join('');
  return svgDoc(W, H, `<g transform="translate(20 0)">
    <path d="M${cx - 18} ${H - 28} L${cx - 9} 108 H${cx + 9} L${cx + 18} ${H - 28} Z" fill="${CREAM}" ${soft(WOOD_LINE, 1.5)}/>
    <path d="M${cx - 18} ${H - 28} L${cx - 9} 108 H${cx - 3} L${cx - 8} ${H - 28} Z" fill="#e6dcc0" opacity="0.8"/>
    ${[150, 200, 250].map((y) => `<rect x="${cx - 12}" y="${y}" width="24" height="12" fill="${BLUE}"/>`).join('')}
    <path d="M${cx - 26} ${H - 28} H${cx + 26} L${cx + 40} ${H - 8} H${cx - 40} Z" fill="${STONE}" ${soft(STONE_LINE, 1.3)}/>
    <rect x="${cx - 52}" y="${H - 14}" width="104" height="14" fill="${WOOD_LIGHT}" ${soft(WOOD_LINE, 1.3)}/>
    <path d="M${cx - 52} ${H - 7} H${cx + 52}" stroke="${WOOD_LINE}" stroke-width="1.4" opacity="0.6"/>
    ${seats.join('')}
    <path d="M8 106 L${cx} 34 L222 106 Z" fill="#ffffff" ${soft(BLUE_DARK, 1.6)}/>
    ${Array.from({ length: 8 }, (_, i) => `<path d="M${f1(8 + i * 26.75)} 106 L${f1(cx - 6 + i * 1.5)} 34 h${f1(1.4)} L${f1(34.75 + i * 26.75)} 106 Z" fill="${i % 2 ? BLUE : '#ffffff'}"/>`).join('')}
    <path d="M8 106 L${cx} 34 L222 106 Z" fill="none" ${soft(BLUE_DARK, 1.8)}/>
    <path d="M8 106 H222" stroke="${GOLD_LINE}" stroke-width="5" stroke-linecap="round"/>
    <path d="M8 106 H222" stroke="${GOLD}" stroke-width="2.4"/>
    ${bulbs}
    <path d="M${cx} 34 V14" stroke="${GOLD_LINE}" stroke-width="3"/><circle cx="${cx}" cy="12" r="5" fill="${GOLD}" ${soft(GOLD_LINE, 1.2)}/>
    <path d="M${cx} 8 V0 M${cx} 2 h14 l-3 4 l3 4 h-14" fill="${RED}" stroke="${RED_DARK}" stroke-width="1"/>
    ${groundShadow(cx, H - 1, 62, 0.16)}</g>`);
}

// The traditional carousel with painted horses on golden poles under a scalloped roof.
function carousel() {
  const W = 270;
  const H = 260;
  const cx = 135;
  const horses = [
    { x: 50, y: 188, body: '#f4efe0', mane: '#c9873a', saddle: RED, gallop: true },
    { x: 108, y: 176, body: '#8a5a38', mane: '#3a2a20', saddle: BLUE, gallop: true },
    { x: 170, y: 190, body: '#3f3a3a', mane: '#e8d8b0', saddle: GOLD, gallop: true },
    { x: 228, y: 178, body: '#d9a860', mane: '#f4efe0', saddle: GREEN, gallop: true },
  ];
  const panels = [];
  for (let i = 0; i < 7; i++) panels.push(`<rect x="${34 + i * 32}" y="102" width="28" height="14" fill="${i % 2 ? '#f6e2a8' : '#cfe6f6'}" ${soft(GOLD_LINE, 1)}/><path d="${heartPath(48 + i * 32, 109, 4)}" fill="${i % 2 ? RED : BLUE}" opacity="0.8"/>`);
  return svgDoc(W, H, `
    <rect x="12" y="214" width="246" height="14" fill="${WOOD_LIGHT}" ${soft(WOOD_LINE, 1.4)}/>
    <rect x="18" y="228" width="234" height="${H - 228}" fill="${RED}" ${soft(RED_DARK, 1.4)}/>
    <path d="M18 238 H252" stroke="${GOLD}" stroke-width="3"/>
    ${Array.from({ length: 12 }, (_, i) => `<path d="${heartPath(30 + i * 19.5, 249, 4)}" fill="#fff3e6" opacity="0.9"/>`).join('')}
    <rect x="${cx - 28}" y="116" width="56" height="98" fill="#f6ecd2" ${soft(GOLD_LINE, 1.4)}/>
    ${[0, 1, 2].map((i) => `<rect x="${cx - 24 + i * 17}" y="124" width="14" height="82" fill="#cfe6f6" ${soft(GOLD_LINE, 1)}/><path d="M${cx - 22 + i * 17} 128 L${cx - 12 + i * 17} 150" stroke="#ffffff" stroke-width="2" opacity="0.7"/>`).join('')}
    ${[50, 108, 170, 228].map((x) => `<path d="M${x} 112 V214" stroke="${GOLD_LINE}" stroke-width="5"/><path d="M${x} 112 V214" stroke="${GOLD}" stroke-width="2.4"/>`).join('')}
    ${horses.map((h) => horse(h.x, h.y + 4, 0.8, h)).join('')}
    ${panels.join('')}
    <path d="M18 100 H252 V118 H18 Z" fill="none" stroke="${GOLD_LINE}" stroke-width="3"/>
    <path d="M${cx} 22 L10 98 H260 Z" fill="#ffffff" ${soft(BLUE_DARK, 1.6)}/>
    ${Array.from({ length: 10 }, (_, i) => `<path d="M${f1(10 + i * 25)} 98 L${f1(cx - 8 + i * 1.6)} 22 h1.6 L${f1(35 + i * 25)} 98 Z" fill="${i % 2 ? RED : '#ffffff'}"/>`).join('')}
    <path d="M${cx} 22 L10 98 H260 Z" fill="none" ${soft(RED_DARK, 1.8)}/>
    ${Array.from({ length: 10 }, (_, i) => `<path d="M${10 + i * 25} 98 Q${22.5 + i * 25} 112 ${35 + i * 25} 98 Z" fill="${i % 2 ? RED : '#ffffff'}" ${soft(RED_DARK, 1)}/>`).join('')}
    ${Array.from({ length: 11 }, (_, i) => `<circle cx="${10 + i * 25}" cy="98" r="2.6" fill="#fff0b0"/>`).join('')}
    <path d="M${cx} 22 V6" stroke="${GOLD_LINE}" stroke-width="3"/><circle cx="${cx}" cy="6" r="5" fill="${GOLD}" ${soft(GOLD_LINE, 1.2)}/>
    ${groundShadow(cx, H - 1, 118, 0.16)}`);
}

// A gingerbread-heart stall: hearts with icing patterns (no lettering) hang from the awning and fill the racks.
function heartStall() {
  const W = 240;
  const H = 210;
  const heart = (x, y, s, icing = 0) => `<path d="M${x - 4} ${y - s * 1.0} q-6 -10 -2 -14 M${x + 4} ${y - s * 1.0} q6 -10 2 -14" fill="none" stroke="${['#e0603f', '#f2b83c', '#3d84c6'][icing % 3]}" stroke-width="2" stroke-linecap="round"/>
    <path d="${heartPath(x, y, s)}" fill="#9a5a2e" ${soft('#5a3018', 1)}/>
    <path d="${heartPath(x, y, s * 0.72)}" fill="none" stroke="#fff3e6" stroke-width="1.6" stroke-dasharray="${icing % 2 ? '1.6 2.6' : '4 2'}" stroke-linecap="round"/>
    <circle cx="${x}" cy="${f1(y - s * 0.1)}" r="${f1(s * 0.22)}" fill="${['#f6c4d0', '#fff3e6', '#f6e6a8'][icing % 3]}"/>`;
  const awning = Array.from({ length: 12 }, (_, i) => {
    const xt0 = 40 + (i * 160) / 12;
    const xb0 = 14 + (i * 212) / 12;
    return `<path d="M${f1(xt0)} 22 L${f1(xt0 + 13.4)} 22 L${f1(xb0 + 17.7)} 62 L${f1(xb0)} 62 Z" fill="${i % 2 ? RED : '#ffffff'}"/><path d="M${f1(xb0)} 62 Q${f1(xb0 + 8.8)} 76 ${f1(xb0 + 17.7)} 62 Z" fill="${i % 2 ? RED : '#ffffff'}" ${soft(RED_DARK, 1)}/>`;
  });
  return svgDoc(W, H, `
    <path d="M24 62 V${H - 1} M216 62 V${H - 1}" stroke="${WOOD_DARK}" stroke-width="7" stroke-linecap="round"/>
    <rect x="28" y="62" width="184" height="70" fill="#f6e8c8" opacity="0.5"/>
    ${awning.join('')}
    <path d="M40 22 H200" stroke="${RED_DARK}" stroke-width="2"/>
    ${[[52, 90, 11, 0], [84, 98, 13, 1], [120, 92, 12, 2], [154, 98, 13, 0], [186, 90, 11, 1]].map(([x, y, s, k]) => heart(x, y, s, k)).join('')}
    <path d="M${f1(120)} 26 V40" stroke="#a8864a" stroke-width="1.4"/>
    <path d="${heartPath(120, 48, 15)}" fill="#a85e2c" ${soft('#5a3018', 1.3)}/>
    <path d="${heartPath(120, 48, 11)}" fill="none" stroke="#fff3e6" stroke-width="2" stroke-dasharray="5 3" stroke-linecap="round"/>
    <path d="${heartPath(120, 47, 5)}" fill="#f6c4d0"/>
    <rect x="20" y="132" width="200" height="10" rx="2" fill="${WOOD_LIGHT}" ${soft(WOOD_LINE, 1.4)}/>
    <path d="M${f1(34)} 132 L48 118 H100 L108 132 M132 132 L140 118 H192 L206 132" fill="#c89a62" ${soft(WOOD_DARK, 1.2)}/>
    ${[[56, 129, 9, 0], [76, 128, 9, 1], [96, 129, 9, 2], [146, 129, 9, 1], [168, 128, 9, 2], [188, 129, 9, 0]].map(([x, y, s, k]) => heart(x, y, s, k)).join('')}
    <rect x="26" y="142" width="188" height="${H - 142}" fill="${BLUE}" ${soft(BLUE_DARK, 1.4)}/>
    <g><clipPath id="hs"><rect x="26" y="142" width="188" height="${H - 142}"/></clipPath></g>
    <g clip-path="url(#hs)"><path d="${lozenges(26, 142, 188, H - 142, 11)}" fill="#ffffff" opacity="0.92"/></g>
    ${groundShadow(120, H - 1, 104, 0.15)}`);
}

// A stall with sweets and roasted almonds: candy jars, paper cones, lollipops, cotton candy and a steaming copper pan.
function candyStall() {
  const W = 250;
  const H = 214;
  const pink = '#f08aa8';
  const awning = Array.from({ length: 12 }, (_, i) => {
    const xt0 = 44 + (i * 162) / 12;
    const xb0 = 16 + (i * 218) / 12;
    return `<path d="M${f1(xt0)} 22 L${f1(xt0 + 13.5)} 22 L${f1(xb0 + 18.2)} 62 L${f1(xb0)} 62 Z" fill="${i % 2 ? pink : '#ffffff'}"/><path d="M${f1(xb0)} 62 Q${f1(xb0 + 9.1)} 76 ${f1(xb0 + 18.2)} 62 Z" fill="${i % 2 ? pink : '#ffffff'}" ${soft('#b8506e', 1)}/>`;
  });
  const lolly = (x, y, c) => `<path d="M${x} ${y} V${y + 36}" stroke="#e8e0d0" stroke-width="2"/><circle cx="${x}" cy="${y}" r="9" fill="${c}" ${soft('#8a4a5a', 1)}/><path d="M${x} ${y} m0 -2 a2.6 2.6 0 1 1 -2.6 2.6 a5.2 5.2 0 1 1 5.2 5.2" fill="none" stroke="#ffffff" stroke-width="1.6" opacity="0.9"/>`;
  const cotton = (x, y, c) => `<path d="M${x} ${y} V${y + 30}" stroke="#e8e0d0" stroke-width="2"/><circle cx="${x - 6}" cy="${y - 2}" r="7" fill="${c}"/><circle cx="${x + 6}" cy="${y - 3}" r="7" fill="${c}"/><circle cx="${x}" cy="${y - 10}" r="8" fill="${c}"/><circle cx="${x - 3}" cy="${y - 12}" r="3" fill="#ffffff" opacity="0.5"/>`;
  const jar = (x, c1, c2) => `<path d="M${x - 11} 100 H${x + 11} V122 Q${x} 126 ${x - 11} 122 Z" fill="#e8f4f8" opacity="0.85" ${soft('#8aa0aa', 1)}/><path d="M${x - 9} 108 H${x + 9} V122 Q${x} 125 ${x - 9} 122 Z" fill="${c1}"/><circle cx="${x - 3}" cy="114" r="2.6" fill="${c2}"/><circle cx="${x + 3}" cy="118" r="2.6" fill="${c2}"/><rect x="${x - 9}" y="95" width="18" height="6" rx="2" fill="#d8c8a8" ${soft('#8a7a58', 1)}/>`;
  const cone = (x, y) => `<path d="M${x - 9} ${y - 22} H${x + 9} L${x + 3} ${y} H${x - 3} Z" fill="#f4ead2" ${soft('#8a7a58', 1)}/><path d="M${x - 8} ${y - 22} q2 -6 5 -2 q2 -6 5 -1 q3 -4 5 1 Z" fill="#c4823f"/><path d="M${x - 5} ${y - 14} h10" stroke="${pink}" stroke-width="2"/>`;
  return svgDoc(W, H, `
    <path d="M26 62 V${H - 1} M224 62 V${H - 1}" stroke="${WOOD_DARK}" stroke-width="7" stroke-linecap="round"/>
    <rect x="30" y="62" width="190" height="70" fill="#f6e8c8" opacity="0.5"/>
    ${awning.join('')}
    <path d="M44 22 H206" stroke="#b8506e" stroke-width="2"/>
    ${lolly(60, 80, '#e5484d')}${lolly(82, 84, '#3d84c6')}${lolly(104, 80, '#f2b83c')}${cotton(176, 84, '#f6a8c0')}${cotton(198, 86, '#cfe6f6')}
    ${[[134, 76]].map(([x, y]) => `<path d="${heartPath(x, y, 10)}" fill="#e0603f" ${soft(RED_DARK, 1)}/><path d="${heartPath(x, y, 6)}" fill="none" stroke="#fff3e6" stroke-width="1.4" stroke-dasharray="2 2"/>`).join('')}
    <rect x="20" y="130" width="210" height="12" rx="2" fill="${WOOD_LIGHT}" ${soft(WOOD_LINE, 1.4)}/>
    ${jar(46, '#e5484d', '#f6c85a')}${jar(72, '#f6c85a', '#ffffff')}${jar(98, '#7aae4a', '#f6c85a')}${jar(124, '#f08aa8', '#ffffff')}
    ${cone(160, 130)}${cone(182, 130)}
    <path d="M196 130 H224 L220 114 H200 Z" fill="#c4743a" ${soft('#6a3a18', 1.2)}/>
    <ellipse cx="210" cy="114" rx="11" ry="3.4" fill="#e0a868" ${soft('#6a3a18', 1)}/>
    <path d="M205 108 q-4 -8 0 -14 M213 108 q4 -8 0 -14" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" opacity="0.7"/>
    <rect x="26" y="142" width="198" height="${H - 142}" fill="${pink}" ${soft('#b8506e', 1.4)}/>
    <g><clipPath id="cs"><rect x="26" y="142" width="198" height="${H - 142}"/></clipPath></g>
    <g clip-path="url(#cs)"><path d="${lozenges(26, 142, 198, H - 142, 11)}" fill="#ffffff" opacity="0.8"/></g>
    ${groundShadow(125, H - 1, 108, 0.15)}`);
}

// The balloon seller: a grown-up in lederhosen holding a bunch of balloons floating high above.
function balloons() {
  const W = 160;
  const H = 270;
  const hx = 78;
  const hy = 190;
  const bs = [
    [78, 34, '#e5484d'], [48, 52, BLUE], [108, 52, '#f6c85a'], [28, 84, '#ffffff'], [128, 84, '#7aae4a'], [62, 82, '#f08aa8'], [96, 84, '#cfe6f6'], [78, 62, '#ffffff'], [44, 112, '#f6c85a'], [112, 114, '#e5484d'], [78, 106, BLUE],
  ];
  const hearts = [[48, 52], [112, 114]];
  const balloon = ([x, y, c], i) => `<path d="M${x} ${y + 17} Q${f1(x + (hx - x) * 0.3)} ${f1(y + (hy - y) * 0.5)} ${hx} ${hy}" fill="none" stroke="#c8c0b0" stroke-width="1"/>
    ${hearts.some(([hx2, hy2]) => hx2 === x && hy2 === y) ? `<path d="${heartPath(x, y, 16)}" fill="${c}" ${soft('#00000030', 1)}/>` : `<ellipse cx="${x}" cy="${y}" rx="14" ry="17" fill="${c}" ${soft('#6a6a7a', 1)}/>`}
    <ellipse cx="${x - 5}" cy="${y - 7}" rx="3.4" ry="5.4" transform="rotate(20 ${x - 5} ${y - 7})" fill="#ffffff" opacity="0.6"/>
    <path d="M${x - 3} ${y + 18} h6 l-3 -3 Z" fill="${c}" ${soft('#6a6a7a', 0.8)}/>`;
  return svgDoc(W, H, `
    ${bs.map(balloon).join('')}
    ${person(78, H - 6, 2, 1)}
    <path d="M${hx} ${hy} L${hx + 2} ${H - 40}" stroke="#c8c0b0" stroke-width="1.4"/>
    ${groundShadow(78, H - 3, 24, 0.18)}`);
}

// ---- Near: small and pale, so nobody takes them for something to jump over ----

// Asters and cornflowers on the trampled lawn.
function flowers() {
  const flower = (x, y, c, r = 4) => `<path d="M${x} 62 Q${x + 2} ${y + 16} ${x} ${y}" fill="none" stroke="#7aa850" stroke-width="2" stroke-linecap="round"/>
    ${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<circle cx="${f1(x + Math.cos(rad(a)) * r)}" cy="${f1(y + Math.sin(rad(a)) * r)}" r="${f1(r * 0.55)}" fill="${c}"/>`).join('')}
    <circle cx="${x}" cy="${y}" r="${f1(r * 0.55)}" fill="#f6d84a"/>`;
  return svgDoc(100, 66, `
    <path d="M4 64 Q22 52 40 62 Q62 50 96 64" fill="none" stroke="#8ab860" stroke-width="5" stroke-linecap="round"/>
    ${flower(18, 38, '#ffffff')}${flower(38, 26, '#b6d4f0')}${flower(58, 36, '#f6c4d0', 3.6)}${flower(78, 24, '#ffffff', 3.6)}${flower(90, 44, '#b6d4f0', 3.4)}`);
}

// A small wooden signpost with a blank arrow board and a painted heart (no lettering).
function sign() {
  return svgDoc(62, 118, `
    <path d="M31 116 V30" stroke="#c9a070" stroke-width="5" stroke-linecap="round"/>
    <path d="M31 116 V30" stroke="${WOOD_LINE}" stroke-width="1" opacity="0.5"/>
    <path d="M10 22 H44 L54 32 L44 42 H10 Z" fill="#f6ecd2" ${soft('#b8946a', 1.2)}/>
    <path d="${heartPath(26, 31, 6)}" fill="#e0603f"/>
    <path d="M18 50 H52 V60 H18 L10 55 Z" fill="${BLUE_LIGHT}" ${soft('#6a9ac8', 1)}/>
    <path d="M24 55 h22" stroke="#ffffff" stroke-width="2.4" stroke-dasharray="3 3"/>
    ${groundShadow(31, 116, 14, 0.14)}`);
}

// A slim white and blue striped pole with swags of pennants and a little lantern on top.
function garlandPole() {
  const bands = [];
  for (let y = 24; y < 190; y += 14) bands.push(`M25 ${y + 6} L33 ${y + 2} V${y + 9} L25 ${y + 13} Z`);
  return svgDoc(70, 190, `
    <defs><clipPath id="gp"><rect x="25" y="20" width="8" height="168"/></clipPath></defs>
    <rect x="25" y="20" width="8" height="168" fill="#ffffff"/>
    <g clip-path="url(#gp)"><path d="${bands.join(' ')}" fill="${BLUE}"/></g>
    <rect x="25" y="20" width="8" height="168" fill="none" ${soft(BLUE_DARK, 1)}/>
    <path d="M22 20 H36 L33 10 H25 Z" fill="${WOOD_DARK}"/>
    <path d="M29 10 V4" stroke="${GOLD_LINE}" stroke-width="2"/><circle cx="29" cy="3" r="2.6" fill="${GOLD}"/>
    ${swag(29, 34, 2, 52, 8, 3)}${swag(29, 34, 56, 52, 8, 3)}
    ${swag(29, 70, 4, 84, 6, 3, [RED, '#ffffff'])}${swag(29, 70, 54, 84, 6, 3, [RED, '#ffffff'])}
    <path d="M24 188 H34 V182 H24 Z" fill="${STONE}" ${soft(STONE_LINE, 1)}/>
    ${groundShadow(29, 188, 10, 0.14)}`);
}

// ---- Strip: a garland of white and blue pennants between slim posts ----

// The rope sags between the posts and is level at both edges, so the strip joins without a seam.
function buntingStrip() {
  const w = 156;
  const cubic = (p0, p1, p2, p3, t) => {
    const u = 1 - t;
    return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
  };
  const ropeY = (x) => {
    let best = 30;
    let bestDx = 1e9;
    for (let i = 0; i <= 200; i++) {
      const t = i / 200;
      const dx = Math.abs(cubic(0, 40, 62, 78, t) - x);
      if (dx < bestDx) { bestDx = dx; best = cubic(30, 30, 24, 12, t); }
    }
    return best;
  };
  const flags = [10, 24, 38, 52, 66, 90, 104, 118, 132, 146].map((x, i) => {
    const y = ropeY(x < 78 ? x : w - x);
    return `<path d="M${f1(x - 4.6)} ${f1(y)} L${f1(x + 4.6)} ${f1(y)} L${f1(x)} ${f1(y + 12)} Z" fill="${i % 2 ? BLUE : '#ffffff'}" ${soft(BLUE_DARK, 0.7)}/>`;
  });
  return svgDoc(w, 70, `
    <path d="M78 66 V8" stroke="#d8cdb4" stroke-width="5" stroke-linecap="round"/>
    <path d="M75 20 h6 M75 30 h6 M75 40 h6" stroke="${BLUE_LIGHT}" stroke-width="2.4"/>
    <circle cx="78" cy="7" r="3" fill="${GOLD}"/>
    <path d="M0 30 C40 30 62 24 78 12 C94 24 116 30 156 30" fill="none" stroke="#d8c8a8" stroke-width="2"/>
    ${flags.join('')}`);
}

// ---- All pieces ----

const PIECES = {
  'hills-far-wiesn': [GAME_WIDTH, 220, hillsFar],
  'hills-near-wiesn': [GAME_WIDTH, 140, hillsNear],
  'wi-gate': [340, 290 + FOOT_GAP, gate],
  'wi-bavaria': [340, 270 + FOOT_GAP, bavaria],
  'wi-paulskirche': [270, 300 + FOOT_GAP, paulskirche],
  'wi-riesenrad': [310, 310 + FOOT_GAP, riesenrad],
  'wi-coaster': [380, 232 + FOOT_GAP, coaster],
  'wi-tree': [130, 140, tree],
  'wi-visitors-far': [200, 74, visitorsFar],
  'wi-band-stage': [250, 180, bandStage],
  'wi-dray': [330, 150, dray],
  'wi-chestnut': [220, 260, chestnut],
  'wi-tent-a': [340, 310, tentA],
  'wi-tent-b': [340, 320, tentB],
  'wi-tent-c': [320, 290, tentC],
  'wi-chain-swing': [270, 340, chainSwing],
  'wi-carousel': [270, 260, carousel],
  'wi-heart-stall': [240, 210, heartStall],
  'wi-candy-stall': [250, 214, candyStall],
  'wi-balloons': [160, 270, balloons],
  'wi-flowers': [100, 66, flowers],
  'wi-sign': [62, 118, sign],
  'wi-garland-pole': [70, 190, garlandPole],
  'wi-strip-bunting': [156, 70, buntingStrip],
};

export function wiesnSvgs() {
  return Object.fromEntries(Object.entries(PIECES).map(([key, [w, h, draw]]) => [key, { w, h, svg: draw() }]));
}

export function preloadWiesn(scene) {
  for (const [key, { w, h, svg }] of Object.entries(wiesnSvgs())) loadSvg(scene, key, svg, w, h);
}
