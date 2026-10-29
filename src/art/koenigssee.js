import { GAME_WIDTH } from '../config.js';
import { loadSvg, svgDoc } from './svg.js';
import { attrs, crown, ridge, ridgeY } from './scenery.js';

// Level 13, Lake Königssee (grown-ups, only loaded after the pretzel button): a clear morning at the
// emerald-green lake between steep rock walls. Zone 1 is the mountain forest on the way down (Watzmann
// peeking through), zone 2 the lake with St. Bartholomä and the tour boats, zone 3 the boat landing
// at Schönau with the Jenner mountain.
// Everything here is background: soft outlines, never the strong OUTLINE. Tall things (trees, signpost,
// boathouses) in the mid layer; the near layer holds only small pale plants. Water is drawn in the far
// tile and in far pieces only, so nothing flat, oval and blue ever lies on the ground line (a puddle).

const f1 = (n) => n.toFixed(1);
const polygon = (pts, w, h) => `M0 ${h} ${pts.map(([x, y]) => `L${f1(x)} ${f1(y)}`).join(' ')} L${w} ${h} Z`;
const rnd = (n) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

// The lake lies below y 128 of hills-far-koenigssee. Far pictures sit at GROUND_Y - 45 with scale ~0.56,
// so this much empty space below their foot puts the foot on the shore line (landmarks) ...
const SHORE = 128;
const FOOT_GAP = 111;
// ... and this much puts it on the water at y 150 (boats, jetty, islet).
const WATER = 150;
const WATER_GAP = 71;

const WOOD = '#a9784a';
const WOOD_LIGHT = '#caa070';
const WOOD_DARK = '#7a5232';
const WOOD_LINE = '#5a3a22';
const GREY_WOOD = '#9c8a74';
const GREY_WOOD_LIGHT = '#bcab94';
const GREY_WOOD_DARK = '#76674f';
const STONE = '#c4bca8';
const STONE_LIGHT = '#ddd6c4';
const STONE_SHADE = '#a39a84';
const STONE_LINE = '#7b705c';
const ROCK = '#a9b4ad';
const ROCK_LIGHT = '#cbd5cf';
const ROCK_DARK = '#7b8c88';
const ROCK_LINE = '#5d6e6c';
const SNOW = '#ffffff';
const WALL_WHITE = '#fbf7ec';
const WALL_SHADE = '#e6dcc6';
const WALL_LINE = '#a89a82';
const DOME = '#c8452f';
const DOME_LIGHT = '#ea7a60';
const DOME_LINE = '#7d2418';
const ROOF = '#b5573f';
const ROOF_LIGHT = '#d7795a';
const ROOF_LINE = '#7d332b';
const SHINGLE = '#8f7a62';
const SHINGLE_LIGHT = '#b09a7e';
const SHINGLE_LINE = '#5e4c3a';
const GLASS = '#8fb1cf';
const GOLD = '#f2b83c';
const GOLD_LINE = '#9a6e1c';
export const FIR = { line: '#1f4a36', base: '#2c6648', shade: '#235538', light: '#4a8a60' };
export const FIR_PALE = { line: '#3d6b58', base: '#4f8566', shade: '#427558', light: '#6ea683' };
const BEECH = { line: '#3a6a2e', base: '#6fb04a', shade: '#58983a', light: '#93cc62', dots: '#bde88a' };
const BEECH_DARK = { line: '#2f5a2c', base: '#5a9a42', shade: '#47843a', light: '#7cba58', dots: '#a6dc7a' };
const BEECH_PALE = { line: '#5a8a4e', base: '#86bd66', shade: '#72a858', light: '#a8d482', dots: '#c8ec9c' };
const LAKE_TOP = '#3dbba2';
const LAKE_MID = '#23988f';
const LAKE_DEEP = '#177a80';

// ---- Small helpers ----

const soft = (color, w = 1.5) => attrs(color, w);

// Soft ground shadow under a piece.
const groundShadow = (cx, y, rx, o = 0.2) => `<ellipse cx="${cx}" cy="${y}" rx="${rx}" ry="${f1(Math.min(rx * 0.1, 6))}" fill="#3e5a28" opacity="${o}"/>`;

// A round-arched window or door w wide, from its top at y down to y + h.
const arch = (x, y, w, h) => `M${f1(x)} ${f1(y + h)} V${f1(y + w / 2)} A${f1(w / 2)} ${f1(w / 2)} 0 0 1 ${f1(x + w)} ${f1(y + w / 2)} V${f1(y + h)} Z`;

// A spruce standing on (cx, base): h high, w wide, drawn from the bottom tier up. The left half of
// every tier is lighter, a darker wedge sits on the right.
export function fir(cx, base, h, w, c = FIR, tiers = 5) {
  const trunkH = h * 0.07;
  const top = base - h;
  const usable = h - trunkH;
  const out = [`<rect x="${f1(cx - w * 0.035)}" y="${f1(base - trunkH - 2)}" width="${f1(w * 0.07)}" height="${f1(trunkH + 2)}" fill="#6a4a32"/>`];
  for (let i = tiers - 1; i >= 0; i--) {
    const yTop = top + usable * (i / tiers) * 0.92;
    const yBot = top + usable * ((i + 1) / tiers) + (i < tiers - 1 ? usable * 0.07 : 0);
    const hw = (w / 2) * (0.26 + 0.74 * ((i + 1) / tiers));
    const sag = (yBot - yTop) * 0.12;
    out.push(`<path d="M${f1(cx)} ${f1(yTop)} L${f1(cx + hw)} ${f1(yBot)} Q${f1(cx + hw * 0.5)} ${f1(yBot - sag)} ${f1(cx)} ${f1(yBot - sag * 0.4)} Q${f1(cx - hw * 0.5)} ${f1(yBot - sag)} ${f1(cx - hw)} ${f1(yBot)} Z" fill="${c.base}" ${soft(c.line, 1.2)}/>`);
    out.push(`<path d="M${f1(cx)} ${f1(yTop)} L${f1(cx - hw)} ${f1(yBot)} Q${f1(cx - hw * 0.5)} ${f1(yBot - sag)} ${f1(cx)} ${f1(yBot - sag * 0.4)} Z" fill="${c.light}" opacity="0.5"/>`);
    out.push(`<path d="M${f1(cx + hw * 0.1)} ${f1(yTop + (yBot - yTop) * 0.3)} L${f1(cx + hw * 0.6)} ${f1(yBot - sag * 0.8)} L${f1(cx + hw * 0.2)} ${f1(yBot - sag * 0.6)} Z" fill="${c.shade}" opacity="0.55"/>`);
  }
  return out.join('');
}

// Small spruces along a ridge: n evenly spaced firs per tile width, so the tile repeats cleanly.
function firRow(w, pts, n, dy, size, palette) {
  const out = [];
  const step = w / n;
  for (let i = -1; i <= n; i++) {
    const k = ((i % n) + n) % n;
    const x = i * step + ((k * 37) % 13);
    const y = ridgeY(pts, ((x % w) + w) % w) + dy + ((k * 11) % 7);
    const h = size * (0.75 + 0.5 * rnd(k + 3));
    out.push(fir(x, y, h, h * 0.5, palette[k % palette.length], 4));
  }
  return out.join('');
}

// A beech: smooth grey trunk with a flared foot, a broad round crown. base is the foot of the trunk.
function beech(cx, base, h, w, c = BEECH) {
  const th = h * 0.5;
  const tw = w * 0.07;
  const r = w * 0.28;
  const cy = base - h + r * 1.75;
  return `<path d="M${f1(cx - tw * 2.1)} ${f1(base)} Q${f1(cx - tw * 0.7)} ${f1(base - 8)} ${f1(cx - tw)} ${f1(base - th)} L${f1(cx + tw)} ${f1(base - th)} Q${f1(cx + tw * 0.7)} ${f1(base - 8)} ${f1(cx + tw * 2.1)} ${f1(base)} Z" fill="#9a9488" ${soft('#5e5a50', 1.3)}/>
    <path d="M${f1(cx - tw * 1.8)} ${f1(base)} Q${f1(cx - tw * 0.6)} ${f1(base - 8)} ${f1(cx - tw * 0.8)} ${f1(base - th)} L${f1(cx - tw * 0.1)} ${f1(base - th)} Q${f1(cx - tw * 0.2)} ${f1(base - 8)} ${f1(cx - tw * 0.2)} ${f1(base)} Z" fill="#c4bfb2" opacity="0.7"/>
    <path d="M${f1(cx)} ${f1(base - th)} L${f1(cx - r * 0.9)} ${f1(cy + r * 0.5)} M${f1(cx)} ${f1(base - th)} L${f1(cx + r * 0.8)} ${f1(cy + r * 0.3)}" stroke="#7a766a" stroke-width="${f1(tw * 0.8)}" stroke-linecap="round" fill="none"/>
    ${crown([[cx - r * 1.1, cy + r * 0.45, r * 0.78], [cx + r * 1.05, cy + r * 0.4, r * 0.8], [cx, cy + r * 0.2, r * 1.05], [cx - r * 0.55, cy - r * 0.5, r * 0.85], [cx + r * 0.6, cy - r * 0.45, r * 0.85], [cx, cy - r * 0.95, r * 0.7]], c)}`;
}

// Mirrors a drawing at x - 960, x and x + 960 where it shows, so a tile repeats cleanly.
const wrapped = (cx, half, fn) => [-GAME_WIDTH, 0, GAME_WIDTH].filter((o) => cx + o + half > 0 && cx + o - half < GAME_WIDTH).map((o) => fn(cx + o)).join('');

// ---- Background tiles ----

// One steep rock wall: a jagged crest, near-vertical faces, strata, gullies, a shaded left face (the
// light comes from the right) and optional remnants of snow. No clip paths, so it can be reused mirrored.
function crag({ cx, top, base, half, seed, rock, tint = '#3f5a68', shade = 0.24, snow = 0, steep = 0.7 }) {
  const n = 9;
  const side = (dir, off) =>
    Array.from({ length: n }, (_, k) => {
      const t = k / n;
      const x = cx + dir * half * (1 - t) + (k ? (rnd(seed * 7 + k + off) - 0.5) * half * 0.12 : 0);
      const y = base - (base - top) * t ** steep + (k ? (k % 2 ? 5 : -3) : 0);
      return [x, y];
    });
  const L = side(-1, 0);
  const R = side(1, 50);
  const crest = [[cx - half * 0.12, top + 11], [cx - half * 0.06, top + 3], [cx, top], [cx + half * 0.06, top + 9], [cx + half * 0.13, top + 5]];
  const pts = [...L, ...crest, ...R.slice().reverse()];
  const d = `M${pts.map(([x, y]) => `${f1(x)} ${f1(y)}`).join(' L')} Z`;
  // The shaded face: left flank up to the crest, then an inner line down to the base.
  const inner = R.slice().map(([x, y]) => [cx + (x - cx) * 0.18, y]).reverse().slice(0, -1);
  const shadeD = `M${[...L, ...crest.slice(0, 3), ...inner, [cx + half * 0.04, base]].map(([x, y]) => `${f1(x)} ${f1(y)}`).join(' L')} Z`;
  const lightD = `M${[...R.slice(1).reverse().slice(0, -1), [cx + half * 0.06, top + 9]].map(([x, y]) => `${f1(x)} ${f1(y)}`).join(' L')} L${f1(cx + half * 0.5)} ${f1(base)} Z`;
  const gullies = [-0.45, -0.2, 0.14, 0.4]
    .map((o, i) => `M${f1(cx + half * o * 0.5)} ${f1(top + 10 + i * 4)} l${f1(half * o * 0.5)} ${f1((base - top) * (0.5 + 0.12 * i))}`)
    .join(' ');
  let snowD = '';
  if (snow) {
    snowD = [[-0.08, 0.1], [0.05, 0.16], [-0.3, 0.3], [0.28, 0.34]]
      .slice(0, 2 + Math.round(snow))
      .map(([o, t], i) => {
        const x = cx + half * o * 0.5;
        const y = top + (base - top) * t;
        return `<path d="M${f1(x - 7)} ${f1(y)} l7 -${6 + i * 2} l9 4 l4 ${10 + i * 2} l-10 -2 l-6 ${8 - i} Z" fill="${SNOW}" opacity="0.92"/>`;
      })
      .join('');
  }
  return `<path d="${d}" fill="${rock}"/>
    <path d="${lightD}" fill="#ffffff" opacity="0.14"/>
    <path d="${shadeD}" fill="${tint}" opacity="${shade}"/>
    <path d="${gullies}" stroke="${tint}" stroke-width="2.6" opacity="0.2" fill="none" stroke-linecap="round"/>${snowD}`;
}

// Far away: pale back peaks, steep green-grey rock walls with forest at their feet, the emerald lake in
// front of them. Nothing crosses the left or right edge, so it tiles.
function hillsFar() {
  const w = GAME_WIDTH;
  const back = [
    { cx: 40, top: 12, half: 120, seed: 11, snow: 2 }, { cx: 255, top: 30, half: 105, seed: 12, snow: 1 },
    { cx: 480, top: 8, half: 140, seed: 13, snow: 2 }, { cx: 700, top: 34, half: 110, seed: 14, snow: 1 }, { cx: 890, top: 18, half: 110, seed: 15, snow: 2 },
  ];
  const front = [
    { cx: 150, top: 54, half: 130, seed: 21, snow: 0 }, { cx: 395, top: 44, half: 120, seed: 22, snow: 1 },
    { cx: 610, top: 62, half: 130, seed: 23, snow: 0 }, { cx: 840, top: 50, half: 120, seed: 24, snow: 1 },
  ];
  const walls = [
    ...back.map((m) => wrapped(m.cx, m.half, (cx) => crag({ ...m, cx, base: SHORE, rock: '#c3d0d6', tint: '#5a7288', shade: 0.2 }))),
    `<rect y="50" width="${w}" height="80" fill="#e6f0f4" opacity="0.4"/>`,
    ...front.map((m) => wrapped(m.cx, m.half, (cx) => crag({ ...m, cx, base: SHORE, rock: '#a4b6ac', tint: '#35504c', shade: 0.3, steep: 0.62 }))),
  ].join('');
  const belt = ridge(w, 112, [[5, 3, 1.2], [3, 7, 0.5]]);
  const foot = ridge(w, 122, [[2.4, 4, 0.4], [1.6, 9, 1.1]]);
  // Shimmer on the lake: short light dashes.
  const ripples = [];
  for (let i = 0; i < 70; i++) {
    const x = (i * 211) % w;
    const y = SHORE + 8 + ((i * 41) % 80);
    ripples.push(`M${x} ${y} h${6 + (i % 4) * 4}`);
  }
  const lake = `M0 ${SHORE} H${w} V220 H0 Z`;
  return svgDoc(w, 220, `
    <defs><linearGradient id="lk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${LAKE_TOP}"/><stop offset="0.45" stop-color="${LAKE_MID}"/><stop offset="1" stop-color="${LAKE_DEEP}"/></linearGradient></defs>
    ${walls}
    <path d="${polygon(belt, w, SHORE + 2)}" fill="#47805c"/>
    ${firRow(w, belt, 52, 8, 26, [FIR, FIR_PALE, FIR])}
    <path d="${polygon(foot, w, SHORE + 2)}" fill="#3f7552"/>
    <path d="${lake}" fill="url(#lk)"/>
    <g transform="translate(0 ${SHORE * 2}) scale(1 -1)" opacity="0.13">${walls}</g>
    <path d="${lake}" fill="url(#lk)" opacity="0.35"/>
    <path d="${ripples.join(' ')}" stroke="#d6fff0" stroke-width="1.6" stroke-linecap="round" opacity="0.35" fill="none"/>
    <path d="M0 ${SHORE + 1} H${w}" stroke="#bfe6c4" stroke-width="2.4" opacity="0.7"/>`);
}

// A tiny boathouse on the shore for the near hills.
function tinyBoathouse(x, y) {
  return `<rect x="${x - 14}" y="${y - 9}" width="28" height="12" fill="#a9845a"/><path d="M${x - 18} ${y - 8} L${x} ${y - 24} L${x + 18} ${y - 8} Z" fill="#9a8068"/><rect x="${x - 4}" y="${y - 5}" width="8" height="9" fill="#5a3a22"/>`;
}

// Right behind Frankie: the forested shore slope, beeches and spruces, pale scree and pebble coves.
function hillsNear() {
  const w = GAME_WIDTH;
  const forest = ridge(w, 78, [[6, 3, 0.8], [3, 8, 1.7]]);
  const slope = ridge(w, 92, [[5, 2, 1.3], [3, 5, 0.2], [2, 11, 0.9]]);
  const crowns = [];
  for (let i = 0; i < 26; i++) {
    const x = i * (w / 26) + 12;
    const y = ridgeY(forest, x) + 4;
    const r = 15 + (i % 4) * 2.4;
    crowns.push(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="${i % 3 ? '#5f9b48' : '#79b255'}"/><circle cx="${f1(x - 4)}" cy="${f1(y - 5)}" r="${f1(r * 0.55)}" fill="#8cc765" opacity="0.8"/>`);
  }
  // Pebble coves: pale patches at the foot of the slope, hidden below by the ground.
  const coves = [120, 430, 760]
    .map((cx) => `<path d="M${cx - 60} 120 Q${cx - 40} 98 ${cx} 100 Q${cx + 40} 98 ${cx + 66} 120 Z" fill="#d9d4c4" opacity="0.9"/>${[0, 1, 2, 3, 4, 5, 6].map((i) => `<circle cx="${cx - 40 + i * 13}" cy="${108 + (i % 3) * 4}" r="${1.4 + (i % 2)}" fill="${['#b9b3a2', '#efeadc', '#a8a290'][i % 3]}"/>`).join('')}`)
    .join('');
  return svgDoc(w, 140, `
    <defs><linearGradient id="sl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cb04e"/><stop offset="1" stop-color="#639c42"/></linearGradient></defs>
    <path d="${polygon(forest, w, 110)}" fill="#3d7552"/>
    ${firRow(w, forest, 34, 14, 52, [FIR, FIR_PALE, FIR, FIR])}
    ${crowns.join('')}
    <path d="${polygon(slope, w, 140)}" fill="url(#sl)"/>
    <path d="M${slope.map(([x, y]) => `${x} ${f1(y + 3)}`).join(' L')}" fill="none" stroke="#b9e08a" stroke-width="3" opacity="0.7"/>
    ${coves}
    ${tinyBoathouse(330, ridgeY(slope, 330) + 24)}${tinyBoathouse(690, ridgeY(slope, 690) + 24)}`);
}

// ---- Landmarks (far layer, once per zone) ----

// An onion dome of a church tower: w wide at the belly, h high, base at (cx, y), with a gold finial.
function onion(cx, y, w, h) {
  return `<path d="M${f1(cx - w * 0.3)} ${f1(y)} C${f1(cx - w * 0.62)} ${f1(y - h * 0.12)} ${f1(cx - w * 0.5)} ${f1(y - h * 0.5)} ${f1(cx)} ${f1(y - h * 0.86)} C${f1(cx + w * 0.5)} ${f1(y - h * 0.5)} ${f1(cx + w * 0.62)} ${f1(y - h * 0.12)} ${f1(cx + w * 0.3)} ${f1(y)} Z" fill="${DOME}" ${soft(DOME_LINE, 1.5)}/>
    <path d="M${f1(cx - w * 0.28)} ${f1(y - 1)} C${f1(cx - w * 0.54)} ${f1(y - h * 0.14)} ${f1(cx - w * 0.44)} ${f1(y - h * 0.46)} ${f1(cx - w * 0.04)} ${f1(y - h * 0.78)} C${f1(cx - w * 0.3)} ${f1(y - h * 0.46)} ${f1(cx - w * 0.3)} ${f1(y - h * 0.16)} ${f1(cx - w * 0.2)} ${f1(y - 1)} Z" fill="${DOME_LIGHT}" opacity="0.8"/>
    <path d="M${f1(cx)} ${f1(y - h * 0.84)} V${f1(y - h)}" stroke="${GOLD_LINE}" stroke-width="2.2" stroke-linecap="round"/>
    <circle cx="${f1(cx)}" cy="${f1(y - h * 0.9)}" r="${f1(Math.max(2.2, w * 0.07))}" fill="${GOLD}" ${soft(GOLD_LINE, 0.9)}/>
    <path d="M${f1(cx)} ${f1(y - h)} v-8 M${f1(cx - 3)} ${f1(y - h - 5)} h6" stroke="${GOLD}" stroke-width="2" stroke-linecap="round"/>`;
}

// The Watzmann massif seen from the north: the Watzmann children, the Watzmann wife, then the long
// crest with Hocheck, Mittelspitze and Südspitze. Spruces in front: it peeks through the forest.
function watzmann() {
  const W = 640;
  const H = 340;
  const d = 'M-4 344 L8 300 L28 264 L42 272 L64 232 L82 244 L100 208 L122 224 L140 190 L164 168 L176 150 L194 164 L210 196 L232 168 L258 120 L282 86 L304 62 L320 76 L338 94 L356 80 L372 54 L392 22 L402 10 L414 20 L430 40 L448 46 L466 38 L484 22 L498 14 L510 24 L528 46 L552 82 L570 128 L596 176 L618 240 L644 344 Z';
  const shadeFaces = [
    'M304 62 L282 86 L258 120 L232 168 L210 196 L236 270 L292 330 L296 200 Z',
    'M402 10 L392 22 L372 54 L356 80 L338 94 L364 170 L400 280 L410 120 Z',
    'M498 14 L484 22 L466 38 L448 46 L430 40 L446 110 L470 220 L500 120 Z',
    'M176 150 L164 168 L140 190 L122 224 L100 208 L120 270 L170 300 L186 200 Z',
  ];
  const lightFaces = [
    'M304 62 L320 76 L338 94 L356 80 L350 160 L310 250 L296 200 Z',
    'M402 10 L414 20 L430 40 L448 46 L450 140 L420 230 L410 120 Z',
    'M498 14 L510 24 L528 46 L552 82 L570 128 L560 220 L520 280 L500 120 Z',
    'M176 150 L194 164 L210 196 L212 250 L186 200 Z',
  ];
  const gullies = 'M304 66 L296 120 L300 190 M402 14 L398 80 L404 170 M498 18 L492 90 L500 190 M352 84 L346 140 M452 46 L458 120 M176 154 L172 200 M262 120 L270 190 M530 50 L528 120';
  const bands = 'M214 190 Q260 180 292 196 M340 120 Q380 112 410 130 M432 90 Q470 82 510 100 M120 240 Q150 228 180 240 M520 170 Q560 160 590 180';
  const snow = [
    'M296 70 L304 62 L312 72 L306 84 L300 80 Z', 'M394 22 L402 10 L410 24 L406 40 L398 34 Z', 'M490 24 L498 14 L506 28 L500 44 Z',
    'M240 160 L256 126 L262 148 L250 176 Z', 'M356 84 L372 58 L380 78 L364 98 Z', 'M452 50 L466 42 L472 58 L458 70 Z', 'M172 156 L176 150 L184 164 L178 176 Z',
  ].map((p) => `<path d="${p}" fill="${SNOW}" opacity="0.92"/>`).join('');
  const forest = [];
  for (let x = 6; x < W; x += 21) forest.push(fir(x, 322 + ((x * 7) % 9), 40 + ((x * 13) % 22), 24, x % 3 ? FIR : FIR_PALE, 3));
  return svgDoc(W, H + FOOT_GAP, `
    <defs><clipPath id="wz"><path d="${d}"/></clipPath>
      <linearGradient id="wzr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bdc3c0"/><stop offset="1" stop-color="#a3b0a8"/></linearGradient></defs>
    <path d="${d}" fill="url(#wzr)" ${soft(ROCK_LINE, 1.5)}/>
    <g clip-path="url(#wz)">
      ${lightFaces.map((p) => `<path d="${p}" fill="#ffffff" opacity="0.18"/>`).join('')}
      ${shadeFaces.map((p) => `<path d="${p}" fill="#3f566a" opacity="0.26"/>`).join('')}
      <path d="${gullies}" stroke="#3f566a" stroke-width="3" opacity="0.22" fill="none" stroke-linecap="round"/>
      <path d="${bands}" stroke="#5d6e6c" stroke-width="1.6" opacity="0.28" fill="none" stroke-linecap="round"/>
      ${snow}
      <path d="M-4 300 C60 284 120 296 200 288 C300 278 400 298 500 286 C560 280 600 290 644 296 V344 H-4 Z" fill="#4a8560"/>
      <path d="M-4 308 C60 296 120 306 200 298 C300 290 400 308 500 296 C560 292 600 300 644 304" fill="none" stroke="#7fb882" stroke-width="3" opacity="0.7"/>
    </g>
    ${forest.join('')}
    ${fir(26, 342, 170, 70)}${fir(64, 346, 120, 52, FIR_PALE)}${fir(612, 342, 150, 64)}${fir(580, 346, 108, 48, FIR_PALE)}${fir(330, 344, 70, 34)}`);
}

// St. Bartholomä: the pilgrimage church with its two red onion domes and the three apses on a green
// peninsula, the old hunting lodge next to it, and the huge east face of the Watzmann behind.
function bartholomae() {
  const W = 640;
  const H = 330;
  const face = 'M-4 300 L-4 250 L8 176 L30 100 L60 74 L96 62 L120 40 L160 30 L200 44 L236 20 L280 32 L320 14 L360 26 L400 16 L440 36 L480 30 L520 52 L560 84 L590 118 L618 176 L636 240 L644 300 Z';
  const ledges = [];
  for (let k = 0; k < 9; k++) ledges.push(`M${k * 70 - 10} ${64 + k * 6 + (k % 2) * 18} q40 -8 90 ${6 - (k % 3) * 4}`);
  const ledges2 = [];
  for (let k = 0; k < 8; k++) ledges2.push(`M${k * 80} ${120 + (k % 3) * 20} q50 -6 100 4`);
  const streaks = [];
  for (let x = 14; x < W; x += 24) streaks.push(`M${x} ${40 + ((x * 7) % 40)} L${x + ((x * 3) % 9) - 4} ${250 - ((x * 11) % 30)}`);
  const snow = [[90, 70, 30], [170, 44, 40], [260, 40, 34], [340, 26, 44], [430, 44, 36], [520, 66, 30], [200, 100, 26], [380, 96, 24]]
    .map(([x, y, w]) => `<path d="M${x} ${y} l${w * 0.4} -5 l${w * 0.6} 3 l-4 7 l-${w * 0.5} 3 l-${w * 0.3} 4 Z" fill="${SNOW}" opacity="0.88"/>`)
    .join('');
  const spurs = [60, 210, 330, 460, 580].map((x, i) => `<path d="M${x - 40} 290 Q${x - 6} ${196 + (i % 2) * 20} ${x} ${188 + (i % 2) * 18} Q${x + 8} 214 ${x + 44} 290 Z" fill="#5f8a64" opacity="0.8"/>`).join('');
  const win = (x, y, w, h) => `<path d="${arch(x, y, w, h)}" fill="#6a7e94" ${soft('#fffdf4', 1.2)}/>`;
  const trees = [];
  for (let x = 150; x < 520; x += 28) trees.push(fir(x + ((x * 5) % 11), 286 + ((x * 3) % 8), 44 + ((x * 7) % 26), 26, x % 3 ? FIR : FIR_PALE, 3));
  const pebbles = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => `<circle cx="${130 + i * 34}" cy="${H + 14 + (i % 3) * 3}" r="1.8" fill="${['#b9b3a2', '#efeadc', '#a8a290'][i % 3]}"/>`).join('');
  return svgDoc(W, H + 30 + FOOT_GAP, `
    <defs><clipPath id="bf"><path d="${face}"/></clipPath>
      <linearGradient id="bfr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9c3b2"/><stop offset="1" stop-color="#a6a898"/></linearGradient></defs>
    <path d="${face}" fill="url(#bfr)" ${soft(ROCK_LINE, 1.5)}/>
    <g clip-path="url(#bf)">
      <path d="M-4 300 V250 L8 176 L30 100 L60 74 L96 62 L120 40 L160 30 L200 44 L236 20 L280 32 L320 14 L330 100 L318 190 L330 300 Z" fill="#3f566a" opacity="0.14"/>
      <path d="${streaks.join(' ')}" stroke="#4a5a60" stroke-width="3.2" opacity="0.15" fill="none" stroke-linecap="round"/>
      <path d="${ledges.join(' ')} ${ledges2.join(' ')}" stroke="#ffffff" stroke-width="3" opacity="0.28" fill="none" stroke-linecap="round"/>
      <path d="${ledges.join(' ')}" stroke="#5d6e6c" stroke-width="1.2" opacity="0.3" fill="none" transform="translate(0 4)"/>
      ${snow}${spurs}
      <path d="M-4 280 C80 268 160 282 260 276 C360 270 440 282 520 274 C580 270 620 276 644 280 V300 H-4 Z" fill="#4a8560"/>
    </g>
    ${trees.join('')}
    <path d="M70 ${H + 6} C96 292 150 282 214 286 C280 280 400 280 470 286 C520 282 560 290 586 ${H + 6} C560 ${H + 18} 500 ${H + 20} 330 ${H + 22} C170 ${H + 20} 110 ${H + 18} 70 ${H + 6} Z" fill="#86bf62" ${soft('#4f8a3c', 1.4)}/>
    <path d="M96 296 C160 286 230 290 330 288 C440 288 520 288 570 298" fill="none" stroke="#c4e88a" stroke-width="3" opacity="0.8"/>
    <path d="M110 ${H + 10} C200 ${H + 20} 300 ${H + 22} 330 ${H + 22} C420 ${H + 22} 500 ${H + 18} 560 ${H + 10} C500 ${H + 24} 400 ${H + 26} 330 ${H + 26} C230 ${H + 26} 170 ${H + 24} 110 ${H + 10} Z" fill="#d9d4c4" opacity="0.95"/>
    ${pebbles}
    <g>
      <rect x="418" y="258" width="92" height="46" fill="${WALL_WHITE}" ${soft(WALL_LINE, 1.3)}/>
      <rect x="418" y="258" width="92" height="5" fill="${WALL_SHADE}"/>
      <path d="M410 262 L430 238 H498 L518 262 Z" fill="${ROOF}" ${soft(ROOF_LINE, 1.4)}/>
      <path d="M410 262 L430 238 H452 L444 262 Z" fill="${ROOF_LIGHT}" opacity="0.55"/>
      <rect x="480" y="226" width="9" height="18" fill="${WALL_WHITE}" ${soft(WALL_LINE, 1)}/>
      ${[430, 458, 486].map((x) => `<rect x="${x}" y="272" width="12" height="16" fill="${GLASS}" ${soft('#fffdf4', 1.6)}/><rect x="${x - 4}" y="272" width="3" height="16" fill="#3c8a5a"/><rect x="${x + 13}" y="272" width="3" height="16" fill="#3c8a5a"/>`).join('')}
      <path d="${arch(452, 274, 16, 30)}" fill="${WOOD_DARK}" ${soft(WOOD_LINE, 1.1)}/>
    </g>
    <g>
      <rect x="282" y="212" width="96" height="62" fill="${WALL_WHITE}" ${soft(WALL_LINE, 1.4)}/>
      <path d="M270 216 L290 184 H370 L390 216 Z" fill="${ROOF}" ${soft(ROOF_LINE, 1.5)}/>
      <path d="M270 216 L290 184 H318 L308 216 Z" fill="${ROOF_LIGHT}" opacity="0.55"/>
      <rect x="276" y="140" width="34" height="84" fill="${WALL_WHITE}" ${soft(WALL_LINE, 1.4)}/>
      <rect x="352" y="140" width="34" height="84" fill="${WALL_WHITE}" ${soft(WALL_LINE, 1.4)}/>
      <rect x="298" y="140" width="12" height="84" fill="${WALL_SHADE}" opacity="0.8"/><rect x="374" y="140" width="12" height="84" fill="${WALL_SHADE}" opacity="0.8"/>
      <rect x="272" y="136" width="42" height="6" fill="${WALL_SHADE}" ${soft(WALL_LINE, 1)}/><rect x="348" y="136" width="42" height="6" fill="${WALL_SHADE}" ${soft(WALL_LINE, 1)}/>
      ${win(285, 154, 14, 26)}${win(361, 154, 14, 26)}
      <circle cx="293" cy="196" r="6" fill="#ffffff" ${soft(GOLD_LINE, 1.2)}/><circle cx="369" cy="196" r="6" fill="#ffffff" ${soft(GOLD_LINE, 1.2)}/>
      ${onion(293, 136, 44, 66)}${onion(369, 136, 44, 66)}
      ${win(304, 226, 12, 24)}${win(346, 226, 12, 24)}
      <rect x="258" y="248" width="48" height="36" fill="${WALL_WHITE}" ${soft(WALL_LINE, 1.3)}/><path d="M250 250 Q282 214 314 250 Z" fill="${DOME}" ${soft(DOME_LINE, 1.4)}/>
      <rect x="356" y="248" width="48" height="36" fill="${WALL_WHITE}" ${soft(WALL_LINE, 1.3)}/><path d="M348 250 Q380 214 412 250 Z" fill="${DOME}" ${soft(DOME_LINE, 1.4)}/>
      <rect x="298" y="240" width="64" height="44" fill="${WALL_WHITE}" ${soft(WALL_LINE, 1.3)}/><path d="M290 242 Q330 196 370 242 Z" fill="${DOME}" ${soft(DOME_LINE, 1.5)}/>
      <path d="M296 242 Q330 204 364 242" fill="none" stroke="${DOME_LIGHT}" stroke-width="3" opacity="0.7"/>
      <rect x="258" y="248" width="14" height="36" fill="${WALL_SHADE}" opacity="0.7"/><rect x="298" y="240" width="12" height="44" fill="${WALL_SHADE}" opacity="0.7"/><rect x="356" y="248" width="12" height="36" fill="${WALL_SHADE}" opacity="0.7"/>
      ${win(274, 258, 14, 22)}${win(323, 252, 14, 26)}${win(372, 258, 14, 22)}
      <rect x="250" y="284" width="164" height="4" fill="${STONE}" ${soft(STONE_LINE, 1)}/>
    </g>
    ${fir(130, 300, 96, 44)}${fir(166, 304, 70, 34, FIR_PALE)}${fir(560, 302, 100, 46)}${fir(530, 306, 66, 32, FIR_PALE)}
    ${beech(214, 302, 90, 70, BEECH_DARK)}
    <path d="M84 ${H + 4} q6 -10 12 0 M600 ${H + 2} q6 -10 12 0 M236 ${H + 8} q-6 -10 -12 0" fill="none" stroke="#6aa650" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M150 ${H + 30} q14 -3 28 0 M440 ${H + 32} q16 -3 32 0 M250 ${H + 34} q18 -3 34 0" fill="none" stroke="#d6fff0" stroke-width="2" stroke-linecap="round" opacity="0.6"/>`);
}

// The Jenner: a broad wooded mountain with a bare summit, the cable car station on top and its cable.
function jenner() {
  const W = 500;
  const H = 300;
  const d = 'M-4 304 L-4 262 C40 246 80 230 120 208 C170 176 204 142 238 104 L260 78 L276 62 L290 54 L302 62 L320 82 L340 106 L362 146 L388 196 L428 240 L504 266 L504 304 Z';
  const forest = [];
  for (let x = -6; x < W + 6; x += 17) forest.push(fir(x, 300 - ((x * 5) % 8), 52 + ((x * 11) % 26), 28, x % 3 ? FIR : FIR_PALE, 3));
  const rowBand = (y, o, c) => `<path d="M-4 ${y} C60 ${y - 18} 120 ${y - 6} 180 ${y - 22} C240 ${y - 40} 300 ${y - 40} 360 ${y - 12} C410 ${y + 6} 460 ${y - 4} 504 ${y - 16} V310 H-4 Z" fill="${c}" opacity="${o}"/>`;
  const cabin = (x, y) => `<path d="M${f1(x)} ${f1(y)} V${f1(y + 8)}" stroke="#4a5058" stroke-width="1.6"/><rect x="${f1(x - 7)}" y="${f1(y + 8)}" width="14" height="11" rx="2.4" fill="#ffffff" ${soft('#6a727c', 1)}/><rect x="${f1(x - 5)}" y="${f1(y + 10)}" width="10" height="5" fill="#a8d0ea"/>`;
  const cable = (x) => 56 + ((x - 318) * 194) / 122;
  return svgDoc(W, H + FOOT_GAP, `
    <defs><clipPath id="jn"><path d="${d}"/></clipPath>
      <linearGradient id="jnr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9bfbc"/><stop offset="0.6" stop-color="#a3b0a8"/></linearGradient></defs>
    <path d="${d}" fill="url(#jnr)" ${soft(ROCK_LINE, 1.5)}/>
    <g clip-path="url(#jn)">
      <path d="M290 54 L276 62 L260 78 L238 104 L204 142 L170 176 L120 208 L150 250 L230 280 L262 210 L280 120 Z" fill="#3f566a" opacity="0.2"/>
      <path d="M290 54 L302 62 L320 82 L340 106 L362 146 L388 196 L360 250 L310 200 L296 110 Z" fill="#ffffff" opacity="0.2"/>
      <path d="M284 60 L278 100 L282 150 M300 62 L304 110 L312 160 M258 84 L262 130 M326 90 L332 140" stroke="#3f566a" stroke-width="3" opacity="0.2" fill="none" stroke-linecap="round"/>
      <path d="M150 190 Q200 160 240 176 Q290 146 330 176 Q356 168 374 184 L400 226 L230 270 Z" fill="#8cc86a" opacity="0.9"/>
      <path d="M170 186 Q214 166 244 182 Q290 154 326 182" fill="none" stroke="#c4e88a" stroke-width="3" opacity="0.8"/>
      ${rowBand(262, 1, '#4a8560')}
      ${rowBand(244, 0.55, '#3f7a56')}
    </g>
    ${forest.join('')}
    <rect x="278" y="44" width="40" height="22" fill="#eef0f2" ${soft('#8a929e', 1.4)}/>
    <path d="M272 46 L286 32 H310 L324 46 Z" fill="#7d8e94" ${soft('#4a5a60', 1.2)}/>
    ${[284, 294, 304].map((x) => `<rect x="${x}" y="50" width="6" height="8" fill="#7fa6c8"/>`).join('')}
    <path d="M300 32 V12 M295 18 H305" stroke="${GOLD}" stroke-width="3" stroke-linecap="round"/>
    <path d="M318 56 L440 250" stroke="#4a5058" stroke-width="2" fill="none"/>
    <path d="M420 218 V252" stroke="#8a929c" stroke-width="4" stroke-linecap="round"/>
    ${cabin(352, cable(352) - 2)}${cabin(398, cable(398) - 2)}
    ${fir(24, 300, 110, 50)}${fir(480, 302, 120, 54, FIR_PALE)}${fir(54, 304, 70, 34, FIR_PALE)}`);
}

// ---- Far: spruces, deer, tour boats, a landing stage, a wooded islet ----

// A single tall spruce.
function spruceTall() {
  return svgDoc(90, 220, `${fir(45, 216, 206, 80, FIR, 6)}${groundShadow(45, 216, 26)}`);
}

// A small group of spruces and a beech on a grass mound.
function spruceGroup() {
  return svgDoc(240, 180, `
    <path d="M0 178 C20 168 60 164 120 164 C180 164 220 168 240 178 Z" fill="#7fb85a" ${soft('#4f8a3c', 1.2)}/>
    ${fir(46, 172, 118, 52, FIR_PALE, 5)}${fir(196, 172, 100, 46, FIR, 5)}${fir(112, 170, 160, 70, FIR, 6)}${beech(158, 176, 100, 72, BEECH_DARK)}${fir(80, 176, 72, 36, FIR, 4)}
    ${[[26, 174, '#ffffff'], [218, 174, '#f6d84a'], [128, 176, '#b4c8f0']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${c}"/>`).join('')}
    ${groundShadow(120, 177, 100, 0.15)}`);
}

// A deer in side view, standing on (0, 0), about 80 wide: facing right, head up or down.
function deer(x, y, s, flip, grazing, fawn = false) {
  const head = grazing
    ? `<path d="M30 -46 C40 -44 48 -34 52 -20 L44 -18 C40 -28 34 -36 26 -40 Z" fill="#a9703f" ${soft('#6a4020', 1)}/>
       <ellipse cx="52" cy="-16" rx="8.5" ry="5" transform="rotate(62 52 -16)" fill="#b57c48" ${soft('#6a4020', 1)}/>
       <circle cx="55" cy="-10" r="2" fill="#2a1a12"/><circle cx="53" cy="-17" r="1.5" fill="#2a1a12"/>
       <path d="M46 -24 l-4 -8 l8 4 Z" fill="#a9703f" ${soft('#6a4020', 0.9)}/>`
    : `<path d="M26 -46 C34 -56 38 -66 40 -76 L50 -74 C48 -62 44 -52 38 -40 Z" fill="#a9703f" ${soft('#6a4020', 1)}/>
       <ellipse cx="48" cy="-78" rx="10" ry="6.4" transform="rotate(-14 48 -78)" fill="#b57c48" ${soft('#6a4020', 1)}/>
       <ellipse cx="57" cy="-76" rx="4.4" ry="3.2" fill="#3a2418"/>
       <circle cx="46" cy="-80" r="1.6" fill="#2a1a12"/>
       <path d="M40 -86 l-5 -10 l10 5 Z M47 -87 l2 -11 l6 9 Z" fill="#a9703f" ${soft('#6a4020', 0.9)}/>`;
  return `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">
    <path d="M-24 -46 q-8 4 -10 14" stroke="#a9703f" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M-20 -26 L-22 0 M-12 -26 L-10 0 M16 -26 L16 0 M24 -26 L28 0" stroke="#8a5a34" stroke-width="4.4" stroke-linecap="round"/>
    <path d="M-23 -4 h5 M-11 -3 h5 M15 -3 h5 M27 -3 h5" stroke="#3a2a1e" stroke-width="3" stroke-linecap="round"/>
    <path d="M-28 -44 C-28 -56 -14 -58 0 -58 C16 -58 30 -56 32 -46 C34 -36 24 -26 4 -26 C-16 -26 -28 -32 -28 -44 Z" fill="#b57c48" ${soft('#6a4020', 1.2)}/>
    <path d="M-24 -50 C-14 -58 6 -60 22 -54 C10 -52 -8 -50 -24 -42 Z" fill="#cf9c68" opacity="0.8"/>
    <path d="M-26 -38 C-14 -30 14 -30 28 -36 C20 -28 -14 -24 -26 -38 Z" fill="#f2e6d0" opacity="0.8"/>
    <ellipse cx="-27" cy="-44" rx="5" ry="8" fill="#f6ecd8"/>
    <circle cx="-14" cy="-48" r="1.2" fill="#f6ecd8"/><circle cx="-4" cy="-52" r="1.2" fill="#f6ecd8"/><circle cx="8" cy="-49" r="1.2" fill="#f6ecd8"/>
    ${head}</g>`;
}

// A doe with her fawn on a grassy rise between spruces, far away.
function deerFar() {
  return svgDoc(220, 150, `
    ${fir(26, 140, 100, 44, FIR_PALE, 4)}${fir(198, 142, 110, 48, FIR, 4)}
    <path d="M0 148 C14 108 56 88 110 88 C164 88 206 108 220 148 Z" fill="#7fb85a" ${soft('#4f8a3c', 1.2)}/>
    <path d="M24 130 C48 106 80 98 112 100 C146 100 176 112 196 134" fill="none" stroke="#b6e07c" stroke-width="4" opacity="0.8"/>
    ${deer(92, 114, 0.9, false, false)}${deer(144, 122, 0.58, true, true, true)}
    ${[[40, 142, '#ffffff'], [64, 136, '#f6d84a'], [168, 140, '#b4c8f0'], [186, 144, '#ffffff']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="2.4" fill="${c}"/>`).join('')}
    ${groundShadow(110, 146, 90, 0.16)}`);
}

// Ripples around a boat or a pier, drawn on the lake below the waterline y.
const ripples = (cx, y, w) => `<path d="M${f1(cx - w * 0.5)} ${y + 5} h${f1(w * 0.24)} M${f1(cx - w * 0.18)} ${y + 5} h${f1(w * 0.34)} M${f1(cx + w * 0.22)} ${y + 5} h${f1(w * 0.26)} M${f1(cx - w * 0.38)} ${y + 12} h${f1(w * 0.3)} M${f1(cx + w * 0.06)} ${y + 12} h${f1(w * 0.32)}" stroke="#e8fff6" stroke-width="2" stroke-linecap="round" opacity="0.55" fill="none"/>`;

// An electric tour boat of the Königssee: long white hull with a wooden stripe, a row of big windows,
// a flat roof with a rail and flags, passengers behind the glass. Bow to the right.
function boatFar() {
  const W = 290;
  const BH = 96;
  const heads = [];
  for (let i = 0; i < 11; i++) heads.push(`<circle cx="${60 + i * 17}" cy="${58 + (i % 3)}" r="3.6" fill="${['#e8b890', '#c98a64', '#f0c8a0'][i % 3]}"/><rect x="${57 + i * 17}" y="${62 + (i % 3)}" width="6.4" height="5" rx="1.6" fill="${['#c83a3a', '#3d84c6', '#e0a82a', '#ffffff', '#4a8a5a'][i % 5]}"/>`);
  const windows = [];
  for (let x = 46; x < 220; x += 17) windows.push(`<rect x="${x}" y="52" width="14" height="17" rx="2" fill="${GLASS}" opacity="0.9"/>`);
  return svgDoc(W, BH + WATER_GAP, `
    <path d="M30 ${BH + 4} H262 M54 ${BH + 9} H236" stroke="#0f5e66" stroke-width="5" stroke-linecap="round" opacity="0.28"/>
    <path d="M30 ${BH - 18} C18 ${BH - 18} 12 ${BH - 8} 14 ${BH} H236 C262 ${BH} 276 ${BH - 22} 284 ${BH - 40} C268 ${BH - 30} 256 ${BH - 26} 240 ${BH - 26} Z" fill="#fbf7ec" ${soft('#8a8272', 1.4)}/>
    <path d="M14 ${BH} H236 C250 ${BH} 258 ${BH - 6} 264 ${BH - 14} C250 ${BH - 8} 230 ${BH - 8} 214 ${BH - 8} H18 Z" fill="#b5573f" ${soft('#7d332b', 1)}/>
    <path d="M16 ${BH - 12} H258" stroke="${WOOD_LIGHT}" stroke-width="3.4" opacity="0.9"/>
    <rect x="34" y="48" width="196" height="22" rx="4" fill="#fbf7ec" ${soft('#8a8272', 1.3)}/>
    ${windows.join('')}${heads.join('')}
    <rect x="30" y="40" width="204" height="9" rx="3" fill="#7d8e94" ${soft('#4a5a60', 1.3)}/>
    <path d="M34 40 V28 M80 40 V28 M126 40 V28 M172 40 V28 M218 40 V28 M34 30 H218" stroke="#e8e0d0" stroke-width="2.4" stroke-linecap="round" fill="none"/>
    <path d="M232 ${BH - 28} V32 M232 40 l16 5 l-16 5" stroke="${WOOD_DARK}" stroke-width="2" fill="#ffffff"/>
    <path d="M232 36 h16 v10 h-16 Z" fill="#ffffff" ${soft('#8a8272', 0.8)}/><path d="M232 36 l8 5 l-8 5 Z M240 41 l8 -5 v10 Z" fill="#3d84c6" opacity="0.9"/>
    <path d="M44 38 V22 M44 22 h14 v8 h-14 Z" stroke="${WOOD_DARK}" stroke-width="2" fill="#e5384a"/>
    ${ripples(150, BH, 250)}
    <path d="M2 ${BH + 3} h20 M270 ${BH + 3} h16" stroke="#e8fff6" stroke-width="2.4" stroke-linecap="round" opacity="0.6"/>`);
}

// A small rowing boat with a paddler, drawn at (cx, y) on the waterline.
function rowBoat(cx, y, s, color) {
  return `<g transform="translate(${cx} ${y}) scale(${s})">
    <path d="M-34 -10 C-28 2 -16 4 0 4 C16 4 28 2 36 -12 C20 -8 -18 -8 -34 -10 Z" fill="${color}" ${soft('#4a3020', 1.2)}/>
    <path d="M-32 -10 C-14 -6 20 -6 34 -10" fill="none" stroke="${WOOD_LIGHT}" stroke-width="2.4"/>
    <rect x="-4" y="-26" width="9" height="12" rx="3" fill="#3d84c6" ${soft('#2a4a6a', 0.8)}/>
    <circle cx="0" cy="-31" r="4.6" fill="#e8b890"/><path d="M-5 -33 h10 l-2 -5 h-6 Z" fill="#5a8a4a"/>
    <path d="M-12 -18 L-30 -2 M12 -18 L30 -2" stroke="#8a5a34" stroke-width="2.4" stroke-linecap="round"/></g>`;
}

// The boat landing stage: a roofed wooden shelter on a pier, two rowing boats moored alongside.
function jettyFar() {
  const W = 330;
  const BH = 130;
  const posts = [];
  for (let x = 20; x <= 220; x += 28) posts.push(`<rect x="${x}" y="${BH - 28}" width="6" height="30" fill="${WOOD_DARK}" ${soft(WOOD_LINE, 0.9)}/>`);
  const planks = [];
  for (let x = 12; x < 232; x += 14) planks.push(`M${x} ${BH - 34} v7`);
  return svgDoc(W, BH + WATER_GAP, `
    <path d="M14 ${BH + 6} H230 M40 ${BH + 11} H200" stroke="#0f5e66" stroke-width="5" stroke-linecap="round" opacity="0.26"/>
    ${posts.join('')}
    <rect x="8" y="${BH - 36}" width="228" height="9" rx="2" fill="${WOOD}" ${soft(WOOD_LINE, 1.2)}/>
    <path d="${planks.join(' ')}" stroke="${WOOD_LINE}" stroke-width="1" opacity="0.5"/>
    <rect x="22" y="${BH - 78}" width="5" height="42" fill="${WOOD}" ${soft(WOOD_LINE, 1)}/><rect x="104" y="${BH - 78}" width="5" height="42" fill="${WOOD}" ${soft(WOOD_LINE, 1)}/>
    <rect x="22" y="${BH - 62}" width="87" height="26" fill="#c89a62" ${soft(WOOD_LINE, 1.2)}/>
    <path d="M22 ${BH - 62} V${BH - 36} M44 ${BH - 62} V${BH - 36} M66 ${BH - 62} V${BH - 36} M88 ${BH - 62} V${BH - 36}" stroke="${WOOD_LINE}" stroke-width="1" opacity="0.5"/>
    <path d="M12 ${BH - 76} L66 ${BH - 108} L120 ${BH - 76} Z" fill="${ROOF}" ${soft(ROOF_LINE, 1.4)}/>
    <path d="M12 ${BH - 76} L66 ${BH - 108} L66 ${BH - 76} Z" fill="${ROOF_LIGHT}" opacity="0.5"/>
    <path d="M66 ${BH - 108} V${BH - 120} M66 ${BH - 120} h14 v8 h-14 Z" stroke="${WOOD_DARK}" stroke-width="2" fill="#3d84c6"/>
    <path d="M170 ${BH - 36} V${BH - 66}" stroke="${WOOD_DARK}" stroke-width="3" stroke-linecap="round"/><circle cx="170" cy="${BH - 70}" r="5.6" fill="#fff4c0" ${soft(WOOD_LINE, 1)}/>
    ${rowBoat(262, BH, 0.9, '#b5573f')}${rowBoat(298, BH + 8, 0.8, '#3d6a8a')}
    <path d="M232 ${BH - 30} q14 4 26 14 M232 ${BH - 28} q22 4 50 18" stroke="#e8e0d0" stroke-width="1.4" fill="none" opacity="0.8"/>
    ${ripples(160, BH, 280)}`);
}

// A small wooded islet in the lake with reeds at the waterline.
function islet() {
  const W = 300;
  const BH = 110;
  const reeds = [];
  for (let x = 18; x < 284; x += 13) reeds.push(`M${x} ${BH} q${(x % 3) - 1} -9 ${(x % 5) - 2} -${14 + (x % 4) * 3}`);
  return svgDoc(W, BH + WATER_GAP, `
    <path d="M30 ${BH + 6} H270 M60 ${BH + 11} H240" stroke="#0f5e66" stroke-width="5" stroke-linecap="round" opacity="0.26"/>
    ${fir(70, BH - 8, 70, 34, FIR_PALE, 4)}${fir(226, BH - 8, 66, 32, FIR, 4)}${fir(188, BH - 6, 98, 46, FIR, 5)}${beech(128, BH - 4, 84, 70, BEECH)}${beech(86, BH - 2, 62, 52, BEECH_DARK)}
    <path d="M10 ${BH + 2} C24 ${BH - 12} 70 ${BH - 18} 150 ${BH - 18} C230 ${BH - 18} 276 ${BH - 12} 290 ${BH + 2} C270 ${BH + 8} 200 ${BH + 10} 150 ${BH + 10} C100 ${BH + 10} 30 ${BH + 8} 10 ${BH + 2} Z" fill="#7fb85a" ${soft('#4f8a3c', 1.2)}/>
    <path d="M30 ${BH - 6} C70 ${BH - 14} 230 ${BH - 14} 270 ${BH - 6}" fill="none" stroke="#b6e07c" stroke-width="3" opacity="0.8"/>
    <path d="${reeds.join(' ')}" stroke="#a89c4a" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    <path d="M6 ${BH + 8} h24 M270 ${BH + 8} h24" stroke="#e8fff6" stroke-width="2.2" stroke-linecap="round" opacity="0.6"/>
    ${ripples(150, BH + 4, 250)}`);
}

// ---- Mid: forest, signpost, stream bridge, boathouses, kiosk, viewpoint, reeds ----

// A fern frond rising from (x, y), len long, its tip leaning by `lean`: a curved stem with pairs of leaflets.
function frond(x, y, len, lean, color = '#5f9a48') {
  const cx = x + lean * 0.2;
  const cy = y - len * 0.7;
  const ex = x + lean;
  const ey = y - len;
  const at = (t) => [(1 - t) ** 2 * x + 2 * (1 - t) * t * cx + t * t * ex, (1 - t) ** 2 * y + 2 * (1 - t) * t * cy + t * t * ey];
  const stem = `M${f1(x)} ${f1(y)} Q${f1(cx)} ${f1(cy)} ${f1(ex)} ${f1(ey)}`;
  const leaves = [];
  for (let t = 0.16; t < 0.98; t += 0.07) {
    const [px, py] = at(t);
    const [qx, qy] = at(t + 0.02);
    const tx = qx - px;
    const ty = qy - py;
    const tl = Math.hypot(tx, ty) || 1;
    const nx = -ty / tl;
    const ny = tx / tl;
    const L = 3 + len * 0.15 * Math.sin(Math.PI * (0.15 + 0.85 * (1 - t)) * 0.9);
    leaves.push(`M${f1(px)} ${f1(py)} l${f1(nx * L + (tx / tl) * L * 0.7)} ${f1(ny * L + (ty / tl) * L * 0.7)} M${f1(px)} ${f1(py)} l${f1(-nx * L + (tx / tl) * L * 0.7)} ${f1(-ny * L + (ty / tl) * L * 0.7)}`);
  }
  return `<path d="${stem}" stroke="#4a7a38" stroke-width="2" fill="none" stroke-linecap="round"/><path d="${leaves.join(' ')}" stroke="${color}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
}

// A fan of fern fronds standing at (cx, y), s scales their length.
function ferns(cx, y, s = 1) {
  return [[-1, -34, 20], [-0.6, -22, 34], [-0.2, -8, 42], [0.2, 8, 40], [0.6, 22, 32], [1, 34, 18]]
    .map(([o, lean, len], i) => frond(cx + o * 7 * s, y, len * s, lean * s, i % 2 ? '#6aa84e' : '#5a9645'))
    .join('');
}

// A mossy rock mass, x..x+w wide, top at y, standing on `base`; the moss cap hangs over the grey rock.
function mossRock(x, y, w, base, flip = false) {
  const m = flip ? -1 : 1;
  const px = (v) => (flip ? x + w - v : x + v);
  return `<path d="M${f1(px(0))} ${base} L${f1(px(0))} ${y + 40} Q${f1(px(w * 0.1))} ${y + 4} ${f1(px(w * 0.45))} ${y} Q${f1(px(w * 0.85))} ${y - 4} ${f1(px(w))} ${y + 30} L${f1(px(w * 0.96))} ${base} Z" fill="${ROCK}" ${soft(ROCK_LINE, 1.4)}/>
    <path d="M${f1(px(w * 0.04))} ${base} L${f1(px(w * 0.02))} ${y + 40} Q${f1(px(w * 0.12))} ${y + 8} ${f1(px(w * 0.4))} ${y + 4} L${f1(px(w * 0.3))} ${f1(y + 60)} L${f1(px(w * 0.34))} ${base} Z" fill="${ROCK_LIGHT}" opacity="0.7"/>
    <path d="M${f1(px(w * 0.9))} ${base} L${f1(px(w * 0.96))} ${y + 40} L${f1(px(w))} ${y + 30} L${f1(px(w * 0.96))} ${base} Z" fill="${ROCK_DARK}" opacity="0.6"/>
    <path d="M${f1(px(0))} ${y + 40} Q${f1(px(w * 0.1))} ${y + 4} ${f1(px(w * 0.45))} ${y} Q${f1(px(w * 0.85))} ${y - 4} ${f1(px(w))} ${y + 30} Q${f1(px(w * 0.9))} ${y + 38} ${f1(px(w * 0.8))} ${y + 26} Q${f1(px(w * 0.64))} ${y + 40} ${f1(px(w * 0.5))} ${y + 24} Q${f1(px(w * 0.3))} ${y + 40} ${f1(px(w * 0.18))} ${y + 28} Q${f1(px(w * 0.06))} ${y + 44} ${f1(px(0))} ${y + 40} Z" fill="#6aa84e" ${soft('#3f7a38', 1.2)}/>
    <path d="M${f1(px(w * 0.12))} ${y + 14} Q${f1(px(w * 0.4))} ${y + 4} ${f1(px(w * 0.7))} ${y + 8}" fill="none" stroke="#a6dc7a" stroke-width="3" opacity="0.8" stroke-linecap="round"/>
    <path d="M${f1(px(w * 0.5))} ${y + 50} l${m * -8} 26 l${m * 6} 24 M${f1(px(w * 0.7))} ${y + 44} l${m * 4} 30" stroke="${ROCK_LINE}" stroke-width="1.6" opacity="0.5" fill="none"/>`;
}

// A big dark spruce.
function spruceBig() {
  return svgDoc(150, 300, `${fir(75, 296, 288, 128, FIR, 7)}${groundShadow(75, 296, 46, 0.22)}`);
}

// A beech with a smooth trunk and fresh green crown, ferns at its foot.
function beechMid() {
  return svgDoc(220, 280, `
    ${beech(110, 274, 262, 200, BEECH)}
    ${ferns(70, 276, 0.8)}${ferns(160, 276, 0.7)}
    <path d="M96 270 q4 -12 10 -2 M118 272 q6 -10 10 0" stroke="#7aae52" stroke-width="3" fill="none" stroke-linecap="round"/>
    ${groundShadow(110, 276, 80, 0.2)}`);
}

// A wooden hiking signpost with a little roof and three yellow arrow boards (a boat, a hiker, a church).
function signpost() {
  const W = 140;
  const H = 250;
  const board = (y, right, icon) => {
    const d = right ? `M44 ${y} H108 L128 ${y + 14} L108 ${y + 28} H44 Z` : `M96 ${y} H32 L12 ${y + 14} L32 ${y + 28} H96 Z`;
    const cx = right ? 76 : 64;
    return `<path d="${d}" fill="#f2c94c" ${soft('#8a6a1c', 1.5)}/><path d="${d}" fill="none" stroke="#fff3b0" stroke-width="1.2" opacity="0.7" transform="translate(0 2)"/>${icon(cx, y + 14)}`;
  };
  const boat = (x, y) => `<path d="M${x - 14} ${y + 2} H${x + 14} L${x + 9} ${y + 8} H${x - 9} Z" fill="#4a3a1c"/><path d="M${x} ${y - 9} V${y + 1} M${x} ${y - 9} L${x + 11} ${y + 1} H${x} Z" stroke="#4a3a1c" stroke-width="1.6" fill="#fffbe6"/>`;
  const hiker = (x, y) => `<circle cx="${x}" cy="${y - 8}" r="3.4" fill="#4a3a1c"/><path d="M${x} ${y - 4} V${y + 4} M${x} ${y - 2} L${x + 6} ${y + 2} M${x} ${y + 4} L${x - 5} ${y + 10} M${x} ${y + 4} L${x + 4} ${y + 10} M${x + 7} ${y - 4} V${y + 10}" stroke="#4a3a1c" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  const church = (x, y) => `<path d="M${x - 8} ${y + 9} V${y - 1} H${x + 8} V${y + 9} Z" fill="#4a3a1c"/><path d="M${x - 5} ${y - 1} C${x - 9} ${y - 6} ${x - 3} ${y - 8} ${x} ${y - 13} C${x + 3} ${y - 8} ${x + 9} ${y - 6} ${x + 5} ${y - 1} Z" fill="#c8452f"/><path d="M${x} ${y - 13} V${y - 17}" stroke="#4a3a1c" stroke-width="1.4"/>`;
  return svgDoc(W, H, `
    ${ferns(30, 246, 0.9)}${ferns(112, 246, 0.8)}
    <rect x="62" y="36" width="16" height="${H - 40}" rx="3" fill="${WOOD}" ${soft(WOOD_LINE, 1.4)}/>
    <rect x="62" y="36" width="5" height="${H - 40}" fill="${WOOD_LIGHT}" opacity="0.7"/>
        ${board(70, true, boat)}${board(104, false, hiker)}${board(138, true, church)}
    <path d="M44 38 L70 8 L96 38 Z" fill="${SHINGLE}" ${soft(SHINGLE_LINE, 1.4)}/>
    <path d="M44 38 L70 8 L70 38 Z" fill="${SHINGLE_LIGHT}" opacity="0.5"/>
    <path d="M52 30 H88" stroke="${SHINGLE_LINE}" stroke-width="1" opacity="0.5"/>
    <path d="M62 ${H - 6} q-4 -9 -9 -10 M78 ${H - 6} q6 -8 10 -8" fill="none" stroke="#6aa650" stroke-width="2.6" stroke-linecap="round"/>
    ${[[44, H - 8, '#ffffff'], [98, H - 6, '#b4c8f0'], [112, H - 10, '#f6d84a'], [24, H - 6, '#f2788a']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${c}"/>`).join('')}
    ${groundShadow(70, H - 3, 56, 0.2)}`);
}

// A mountain stream tumbling down a mossy gorge, a little arched wooden footbridge across the top.
// Background only: the water is a thin falling ribbon and its foot hides behind ferns.
function bridge() {
  const W = 330;
  const H = 260;
  const deck = (t) => {
    const y = (1 - t) ** 2 * 118 + 2 * (1 - t) * t * 74 + t * t * 118;
    return [58 + t * 214, y];
  };
  const posts = [];
  const rail = [];
  for (let k = 0; k <= 8; k++) {
    const [x, y] = deck(k / 8);
    posts.push(`M${f1(x)} ${f1(y)} V${f1(y - 24)}`);
    rail.push(`${k ? 'L' : 'M'}${f1(x)} ${f1(y - 24)}`);
  }
  const planks = [];
  for (let k = 1; k < 18; k++) {
    const [x, y] = deck(k / 18);
    planks.push(`M${f1(x)} ${f1(y - 1)} v10`);
  }
  const top = deck(0);
  const end = deck(1);
  return svgDoc(W, H, `
    ${fir(40, 140, 124, 54, FIR_PALE, 5)}${fir(292, 136, 128, 56, FIR, 5)}
    <path d="M96 ${H - 10} V112 Q108 70 167 64 Q226 70 238 112 V${H - 10} Z" fill="#2f6048"/>
    <path d="M110 80 H160 L150 ${H - 10} H110 Z" fill="#3d7656" opacity="0.7"/>
    <path d="M152 70 C150 110 160 150 152 ${H - 40} L180 ${H - 40} C172 150 182 110 178 70 Z" fill="#d6f2f2" ${soft('#8ac8cc', 1)}/>
    <path d="M158 80 C157 120 164 150 158 ${H - 50} M168 76 C168 120 172 150 170 ${H - 46}" stroke="#ffffff" stroke-width="2.6" fill="none" stroke-linecap="round" opacity="0.9"/>
    <path d="M140 150 q16 -10 34 0 q16 10 30 0" stroke="${ROCK_LINE}" stroke-width="0" fill="none"/>
    <path d="M142 148 H196 Q202 148 202 154 V160 H142 Z" fill="${ROCK}" ${soft(ROCK_LINE, 1.2)}/><path d="M142 148 H196 Q202 148 202 154 V156 H142 Z" fill="#6aa84e"/>
    ${mossRock(0, 118, 126, H - 6)}${mossRock(204, 112, 126, H - 6, true)}
    <path d="M${top[0] - 4} ${top[1] + 6} Q160 66 ${end[0] + 4} ${end[1] + 6} L${end[0] + 4} ${end[1] + 16} Q160 78 ${top[0] - 4} ${top[1] + 16} Z" fill="${WOOD}" ${soft(WOOD_LINE, 1.4)}/>
    <path d="${planks.join(' ')}" stroke="${WOOD_LINE}" stroke-width="1" opacity="0.5"/>
    <path d="${posts.join(' ')}" stroke="${WOOD_LIGHT}" stroke-width="4" stroke-linecap="round"/>
    <path d="${rail.join(' ')}" stroke="${WOOD_LIGHT}" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="${rail.join(' ')}" stroke="${WOOD_LINE}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.6" transform="translate(0 2)"/>
    <g fill="#ffffff" opacity="0.9"><circle cx="164" cy="${H - 36}" r="9"/><circle cx="150" cy="${H - 30}" r="7"/><circle cx="180" cy="${H - 30}" r="7"/></g>
    ${ferns(130, H - 8, 1)}${ferns(200, H - 8, 1.05)}${ferns(60, H - 8, 0.9)}${ferns(276, H - 8, 0.85)}
    ${[[110, H - 14, '#ffffff'], [214, H - 12, '#f2788a'], [166, H - 8, '#b4c8f0']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${c}"/>`).join('')}
    ${groundShadow(165, H - 3, 140, 0.18)}`);
}

// One boathouse seen from the front with the roof and side wall in a slight oblique view: stone foot,
// weathered plank walls, a big arched boat door with the bow of a boat inside, a flower box, a steep
// shingle roof. Pieces: x is the left edge of the front, base the ground.
function boathouse({ x, base, w, wallH, roofH, wall, wallDark, roof, roofLight, shutter = '#b83a3a', hull = '#fbf7ec' }) {
  const foundH = 14;
  const eaveY = base - foundH - wallH;
  const peakY = eaveY - roofH;
  const peakX = x + w / 2;
  const dx = w * 0.5;
  const dy = -w * 0.12;
  const ovh = 8;
  const planks = [];
  for (let px = x + 8; px < x + w - 2; px += 10) planks.push(`M${px} ${eaveY + 2} V${base - foundH}`);
  const gableLines = [];
  for (let px = x + 10; px < x + w - 4; px += 10) {
    const half = (w / 2 + ovh) * ((px - peakX) / (w / 2 + ovh));
    const topY = eaveY - roofH * (1 - Math.abs(half) / (w / 2 + ovh)) + 4;
    gableLines.push(`M${px} ${f1(topY)} V${eaveY}`);
  }
  const rows = [];
  const nRows = 7;
  for (let k = 1; k < nRows; k++) {
    const t = k / nRows;
    const ax = peakX + (x + w + ovh - peakX) * t;
    const ay = peakY + (eaveY - peakY) * t;
    rows.push(`M${f1(ax)} ${f1(ay)} L${f1(ax + dx)} ${f1(ay + dy)}`);
  }
  const ticks = [];
  for (let k = 0; k < nRows; k++) {
    const t0 = k / nRows;
    const t1 = (k + 1) / nRows;
    for (let u = 0.12; u < 1; u += 0.16) {
      const sx = (t) => peakX + (x + w + ovh - peakX) * t + dx * u;
      const sy = (t) => peakY + (eaveY - peakY) * t + dy * u;
      ticks.push(`M${f1(sx(t0 + (t1 - t0) * 0.3))} ${f1(sy(t0 + (t1 - t0) * 0.3))} L${f1(sx(t1))} ${f1(sy(t1))}`);
    }
  }
  const doorW = w * 0.62;
  const dX = x + (w - doorW) / 2;
  const doorTop = base - foundH - wallH * 0.82;
  const sideU = (u) => [x + w + dx * u, dy * u];
  const [sx1, sy1] = sideU(0.2);
  const [sx2, sy2] = sideU(0.52);
  const geraniums = [];
  for (let gx = dX + 2, i = 0; gx < dX + doorW - 2; gx += 11, i++) geraniums.push(`<circle cx="${f1(gx)}" cy="${f1(eaveY + 18 - (i % 2) * 2)}" r="4.6" fill="${['#e5384a', '#f2788a', '#d6283c'][i % 3]}"/><circle cx="${f1(gx + 3)}" cy="${f1(eaveY + 23)}" r="3" fill="#4f9440"/>`);
  return `
    <path d="M${x + w} ${eaveY} L${x + w + dx} ${eaveY + dy} V${base - foundH + dy} L${x + w} ${base - foundH} Z" fill="${wallDark}" ${soft(WOOD_LINE, 1.3)}/>
    <path d="M${x + w + 2} ${eaveY + 6} L${x + w + dx - 2} ${eaveY + dy + 6}" stroke="${WOOD_LINE}" stroke-width="1" opacity="0.4"/>
    <path d="M${x + w} ${base - foundH} L${x + w + dx} ${base - foundH + dy} V${base + dy} L${x + w} ${base} Z" fill="${STONE_SHADE}" ${soft(STONE_LINE, 1.1)}/>
    <path d="M${f1(sx1)} ${f1(eaveY + 24 + sy1)} L${f1(sx2)} ${f1(eaveY + 24 + sy2)} V${f1(eaveY + 48 + sy2)} L${f1(sx1)} ${f1(eaveY + 48 + sy1)} Z" fill="${GLASS}" ${soft('#fffdf4', 1.8)}/>
    <path d="M${f1(sx1 - 5)} ${f1(eaveY + 24 + sy1 - 1)} v26 M${f1(sx2 + 5)} ${f1(eaveY + 24 + sy2 + 1)} v26" stroke="${shutter}" stroke-width="5"/>
    <path d="M${peakX} ${peakY} L${x + w + ovh} ${eaveY} L${x + w + ovh + dx} ${eaveY + dy} L${peakX + dx} ${peakY + dy} Z" fill="${roof}" ${soft(SHINGLE_LINE, 1.5)}/>
    <path d="${rows.join(' ')}" stroke="${SHINGLE_LINE}" stroke-width="1.3" opacity="0.6"/>
    <path d="${ticks.join(' ')}" stroke="${SHINGLE_LINE}" stroke-width="0.9" opacity="0.4"/>
    <path d="M${peakX} ${peakY} L${x + w + ovh} ${eaveY} L${x + w + ovh + dx * 0.4} ${eaveY + dy * 0.4} L${peakX + dx * 0.4} ${peakY + dy * 0.4} Z" fill="${roofLight}" opacity="0.3"/>
    <rect x="${x - 2}" y="${base - foundH}" width="${w + 4}" height="${foundH}" fill="${STONE}" ${soft(STONE_LINE, 1.2)}/>
    <path d="M${x + 6} ${base - 7} h14 M${x + 30} ${base - 4} h12 M${x + 58} ${base - 8} h16 M${x + 88} ${base - 5} h14" stroke="${STONE_LINE}" stroke-width="1.2" opacity="0.5"/>
    <rect x="${x}" y="${eaveY}" width="${w}" height="${wallH}" fill="${wall}" ${soft(WOOD_LINE, 1.4)}/>
    <path d="${planks.join(' ')}" stroke="${WOOD_LINE}" stroke-width="1" opacity="0.45"/>
    <path d="M${x - ovh} ${eaveY} L${peakX} ${peakY} L${x + w + ovh} ${eaveY} Z" fill="${wall}" ${soft(WOOD_LINE, 1.4)}/>
    <path d="${gableLines.join(' ')}" stroke="${WOOD_LINE}" stroke-width="1" opacity="0.45"/>
    <path d="M${x - ovh - 2} ${eaveY + 1} L${peakX} ${peakY - 2} L${x + w + ovh + 2} ${eaveY + 1}" fill="none" stroke="${WOOD_LINE}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M${x - ovh - 2} ${eaveY + 1} L${peakX} ${peakY - 2} L${x + w + ovh + 2} ${eaveY + 1}" fill="none" stroke="#d6b080" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${arch(peakX - 8, eaveY - roofH * 0.55, 16, roofH * 0.34)}" fill="${GLASS}" ${soft('#fffdf4', 1.8)}/>
    <path d="M${peakX} ${eaveY - roofH * 0.55} v${roofH * 0.34}" stroke="#fffdf4" stroke-width="1.2"/>
    <rect x="${peakX - 14}" y="${eaveY - roofH * 0.55}" width="5" height="${roofH * 0.34}" fill="${shutter}"/><rect x="${peakX + 9}" y="${eaveY - roofH * 0.55}" width="5" height="${roofH * 0.34}" fill="${shutter}"/>
    <path d="${arch(dX, doorTop, doorW, base - foundH - doorTop)}" fill="#2e2a28" ${soft(WOOD_LINE, 1.6)}/>
    <path d="M${dX + doorW * 0.14} ${base - foundH} C${dX + doorW * 0.2} ${base - foundH - 22} ${dX + doorW * 0.5} ${base - foundH - 30} ${dX + doorW * 0.92} ${base - foundH - 20} L${dX + doorW * 0.92} ${base - foundH} Z" fill="${hull}" ${soft('#8a8272', 1)}/>
    <path d="M${dX + doorW * 0.18} ${base - foundH - 8} C${dX + doorW * 0.4} ${base - foundH - 16} ${dX + doorW * 0.7} ${base - foundH - 16} ${dX + doorW * 0.92} ${base - foundH - 10}" stroke="#b5573f" stroke-width="3.4" fill="none"/>
    <path d="${arch(dX - 3, doorTop - 3, doorW + 6, base - foundH - doorTop + 3)}" fill="none" stroke="#d6b080" stroke-width="3"/>
    <rect x="${dX - 2}" y="${eaveY + 12}" width="${doorW + 4}" height="9" rx="1.6" fill="#9a6a3e" ${soft(WOOD_LINE, 1.1)}/>
    ${geraniums.join('')}
    <path d="M${dX - 10} ${base - foundH - 4} L${dX - 6} ${base - foundH - 44}" stroke="${WOOD_DARK}" stroke-width="2.6" stroke-linecap="round"/><path d="M${dX - 6} ${base - foundH - 44} l-3 -14 l7 0 Z" fill="${WOOD_LIGHT}" ${soft(WOOD_LINE, 0.8)}/>
    <path d="M${x + w - 4} ${eaveY + 30} v10" stroke="${WOOD_DARK}" stroke-width="2"/><circle cx="${x + w - 4}" cy="${eaveY + 44}" r="4.6" fill="#fff4c0" ${soft(WOOD_LINE, 1)}/>`;
}

function boathouseSingle() {
  const W = 230;
  const H = 250;
  return svgDoc(W, H, `
    ${fir(206, 244, 120, 54, FIR_PALE, 4)}
    ${boathouse({ x: 14, base: H - 6, w: 120, wallH: 84, roofH: 96, wall: '#b49a78', wallDark: '#9a8262', roof: '#8f7a62', roofLight: '#c8b496' })}
    <path d="M10 ${H - 6} q-4 -9 -10 -10 M142 ${H - 6} q6 -8 12 -8" fill="none" stroke="#6aa650" stroke-width="2.6" stroke-linecap="round"/>
    ${groundShadow(110, H - 3, 100, 0.2)}`);
}

// Two boathouses side by side: a weathered brown one and a taller one painted red-brown.
function boathouseRow() {
  const W = 380;
  const H = 250;
  return svgDoc(W, H, `
    ${beech(352, 244, 130, 84, BEECH_DARK)}
    ${boathouse({ x: 22, base: H - 6, w: 104, wallH: 72, roofH: 86, wall: '#b49a78', wallDark: '#9a8262', roof: '#8f7a62', roofLight: '#c8b496', shutter: '#3c8a5a' })}
    ${boathouse({ x: 190, base: H - 6, w: 116, wallH: 92, roofH: 96, wall: '#b8664a', wallDark: '#9a5238', roof: '#7a6a5c', roofLight: '#b0a090', shutter: '#f4efe2', hull: '#e8f0f6' })}
    ${groundShadow(190, H - 3, 176, 0.2)}`);
}

// A bavarian blue and white lozenge awning over a kiosk counter, scalloped at the lower edge.
function awning(x, y, w, h) {
  const diamonds = [];
  const n = Math.round(w / 22);
  const dw = w / n;
  for (let i = 0; i < n; i++) {
    const cx = x + dw * (i + 0.5);
    diamonds.push(`<path d="M${f1(cx)} ${y + 2} L${f1(cx + dw * 0.42)} ${y + h / 2} L${f1(cx)} ${y + h - 4} L${f1(cx - dw * 0.42)} ${y + h / 2} Z" fill="#3d84c6"/>`);
  }
  const scallops = [];
  for (let i = 0; i < n; i++) scallops.push(`<path d="M${f1(x + dw * i)} ${y + h} q${f1(dw / 2)} 9 ${f1(dw)} 0 Z" fill="#ffffff" ${soft('#8a9aae', 1)}/>`);
  return `<path d="M${x - 6} ${y + h} L${x + 6} ${y} H${x + w - 6} L${x + w + 6} ${y + h} Z" fill="#ffffff" ${soft('#8a9aae', 1.3)}/>${diamonds.join('')}${scallops.join('')}`;
}

// A little lakeside kiosk: shingle roof with a cupola, a bavarian awning, a hatch with shelves and a flower box.
function kiosk() {
  const W = 230;
  const H = 220;
  const shelf = [];
  for (let i = 0; i < 6; i++) shelf.push(`<rect x="${64 + i * 17}" y="${118 + (i % 2) * 20}" width="9" height="14" rx="2" fill="${['#e5384a', '#f6d84a', '#4f9a5a', '#3d84c6', '#f2788a', '#ffffff'][i]}"/>`);
  const geraniums = [];
  for (let gx = 52, i = 0; gx < 180; gx += 12, i++) geraniums.push(`<circle cx="${gx}" cy="${164 - (i % 2) * 2}" r="4.8" fill="${['#e5384a', '#f2788a', '#d6283c'][i % 3]}"/><circle cx="${gx + 3}" cy="${170}" r="3" fill="#4f9440"/>`);
  return svgDoc(W, H, `
    ${beech(36, 212, 118, 66, BEECH_PALE)}
    <rect x="34" y="92" width="168" height="108" fill="#d8b888" ${soft(WOOD_LINE, 1.5)}/>
    <path d="M44 92 V200 M70 92 V200 M166 92 V200 M192 92 V200" stroke="${WOOD_LINE}" stroke-width="1" opacity="0.4"/>
    <rect x="34" y="188" width="168" height="14" fill="${STONE}" ${soft(STONE_LINE, 1.2)}/>
    <rect x="54" y="112" width="128" height="52" fill="#3a302a" ${soft(WOOD_LINE, 1.4)}/>
    <path d="M58 132 H178 M58 150 H178" stroke="#7a6a5c" stroke-width="2"/>
    ${shelf.join('')}
    <circle cx="150" cy="140" r="9" fill="#f6ecd8"/><path d="M143 143 L150 160 L157 143 Z" fill="#e0a860"/><circle cx="150" cy="137" r="5" fill="#f2788a"/>
    <rect x="48" y="162" width="140" height="9" rx="2" fill="#9a6a3e" ${soft(WOOD_LINE, 1.1)}/>
    ${geraniums.join('')}
    ${awning(40, 92, 156, 20)}
    <path d="M24 92 L52 48 H184 L212 92 Z" fill="${SHINGLE}" ${soft(SHINGLE_LINE, 1.5)}/>
    <path d="M24 92 L52 48 H100 L84 92 Z" fill="${SHINGLE_LIGHT}" opacity="0.5"/>
    <path d="M32 80 H206 M42 66 H196" stroke="${SHINGLE_LINE}" stroke-width="1.2" opacity="0.5"/>
    <rect x="102" y="26" width="32" height="24" fill="#d8b888" ${soft(WOOD_LINE, 1.2)}/><rect x="110" y="32" width="16" height="12" fill="${GLASS}" ${soft('#fffdf4', 1.4)}/>
    <path d="M96 28 L118 8 L140 28 Z" fill="${ROOF}" ${soft(ROOF_LINE, 1.3)}/>
    <path d="M118 8 V-2" stroke="${WOOD_DARK}" stroke-width="2"/>
    <circle cx="206" cy="124" r="15" fill="#fbf7ec" ${soft(WOOD_LINE, 1.6)}/><path d="M199 126 L206 144 L213 126 Z" fill="#e0a860" ${soft('#8a5a2a', 0.8)}/><circle cx="206" cy="120" r="7" fill="#f2788a" ${soft('#a82848', 0.8)}/><circle cx="203" cy="117" r="2" fill="#ffffff" opacity="0.8"/>
    <path d="M206 108 V92" stroke="${WOOD_DARK}" stroke-width="2"/>
    ${groundShadow(118, H - 4, 100, 0.2)}`);
}

// The Malerwinkel viewpoint: a stone terrace wall, a bench, a painter's easel with a little lake painting, a big beech.
function viewpoint() {
  const W = 290;
  const H = 240;
  const slats = [];
  for (let i = 0; i < 3; i++) slats.push(`<rect x="52" y="${130 + i * 11}" width="100" height="8" rx="2" fill="${WOOD_LIGHT}" ${soft(WOOD_LINE, 1.1)}/>`);
  const stones = [];
  for (let row = 0; row < 5; row++) for (let i = 0, x = 20 + (row % 2) * 12; x < 170; i++, x += 28 + ((row * 5 + i * 7) % 8)) stones.push(`<rect x="${x}" y="${156 + row * 14}" width="${f1(Math.min(26 + ((row + i) % 3) * 3, 172 - x))}" height="12" rx="3" fill="${(row + i) % 3 === 0 ? STONE_LIGHT : (row + i) % 3 === 1 ? STONE : STONE_SHADE}" ${soft(STONE_LINE, 0.8)}/>`);
  return svgDoc(W, H, `
    ${beech(92, 232, 224, 170, BEECH)}
    <rect x="12" y="150" width="166" height="4" fill="${STONE_LIGHT}"/>
    <path d="M12 154 H178 V228 H12 Z" fill="${STONE}" ${soft(STONE_LINE, 1.3)}/>${stones.join('')}
    <rect x="8" y="148" width="174" height="8" rx="2" fill="${STONE_LIGHT}" ${soft(STONE_LINE, 1.3)}/>
    ${slats.join('')}
    <rect x="52" y="156" width="104" height="9" rx="2" fill="${WOOD}" ${soft(WOOD_LINE, 1.3)}/>
    <rect x="56" y="165" width="8" height="44" fill="${WOOD_DARK}" ${soft(WOOD_LINE, 1)}/><rect x="144" y="165" width="8" height="44" fill="${WOOD_DARK}" ${soft(WOOD_LINE, 1)}/>
    <path d="M60 138 V160 M148 138 V160" stroke="${WOOD_DARK}" stroke-width="5"/>
    <path d="M92 156 q10 -10 24 -4 q-6 8 -24 4 Z" fill="#e8c878" ${soft('#8a6a2a', 1)}/><path d="M92 154 q12 -4 24 -2" stroke="#c83a3a" stroke-width="3" fill="none"/>
    <path d="M206 232 L222 110 M254 232 L238 110 M230 232 V120" stroke="${WOOD_DARK}" stroke-width="5" stroke-linecap="round" fill="none"/>
    <rect x="198" y="128" width="64" height="48" fill="#fffdf4" ${soft(WOOD_LINE, 1.6)}/>
    <path d="M200 160 H260 V174 H200 Z" fill="#2f9c8c"/><path d="M200 160 L214 144 L224 152 L236 138 L250 156 L260 148 V160 H200 Z" fill="#9aa8b4"/><path d="M236 138 l4 4 l-5 1 Z" fill="#ffffff"/><circle cx="214" cy="136" r="5" fill="#f6d84a"/>
    <rect x="196" y="176" width="68" height="5" rx="2" fill="${WOOD}" ${soft(WOOD_LINE, 1.1)}/>
    <path d="M10 ${H - 6} q-4 -10 -9 -10 M182 ${H - 6} q6 -9 12 -9" fill="none" stroke="#6aa650" stroke-width="2.6" stroke-linecap="round"/>
    ${ferns(188, 232, 0.8)}
    ${[[100, 208, '#ffffff'], [44, 214, '#f6d84a'], [194, 214, '#b4c8f0']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${c}"/>`).join('')}
    ${groundShadow(145, H - 6, 130, 0.2)}`);
}

// A big clump of tall reeds with brown cattails and a few purple loosestrife spikes.
function reedsBig() {
  const W = 230;
  const H = 210;
  const blades = [];
  const heads = [];
  for (let i = 0; i < 40; i++) {
    const x = 18 + rnd(i) * 194;
    const top = 26 + rnd(i + 40) * 96;
    const lean = (rnd(i + 80) - 0.5) * 50;
    const col = ['#8fb050', '#a9c466', '#7ea044', '#c4b25a'][i % 4];
    blades.push(`<path d="M${f1(x)} ${H - 6} Q${f1(x + lean * 0.2)} ${f1((H + top) / 2)} ${f1(x + lean)} ${f1(top)}" stroke="${col}" stroke-width="${2.2 + (i % 3) * 0.8}" fill="none" stroke-linecap="round"/>`);
    if (i % 5 === 0) heads.push(`<rect x="${f1(x + lean - 2.6)}" y="${f1(top - 4)}" width="5.2" height="18" rx="2.6" fill="#7a4a2a" ${soft('#4a2a14', 0.8)}/>`);
  }
  const loose = [24, 196].map((x) => `<path d="M${x} ${H - 8} V${H - 70}" stroke="#6a9a48" stroke-width="2.4"/>${[0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${x + (i % 2) * 3 - 1}" cy="${H - 70 + i * 6}" r="3.6" fill="#b45aa8"/>`).join('')}`).join('');
  return svgDoc(W, H, `
    ${blades.join('')}${heads.join('')}${loose}
    <path d="M10 ${H - 4} q10 -8 22 -2 M190 ${H - 4} q12 -8 26 -2" stroke="#6aa650" stroke-width="3" fill="none" stroke-linecap="round"/>
    ${groundShadow(115, H - 3, 92, 0.18)}`);
}

// ---- Near: small and pale plants ----

// A flower stem with leaves.
const stem = (x, y, base, lean = 0) => `<path d="M${x - lean * 3} ${base} Q${x + lean} ${f1((y + base) / 2)} ${x} ${y}" fill="none" stroke="#7aa850" stroke-width="2" stroke-linecap="round"/>`;

// Pale fern fronds, small and soft.
function fernsNear() {
  const W = 130;
  const H = 76;
  return svgDoc(W, H, `
    <g opacity="0.92">${[[-1, -30, 22], [-0.55, -18, 36], [-0.15, -6, 46], [0.2, 8, 44], [0.6, 20, 34], [1, 32, 22]]
      .map(([o, lean, len], i) => frond(62 + o * 8, H - 4, len, lean, i % 2 ? '#8cc46a' : '#7ab85c'))
      .join('')}</g>
    ${[[18, H - 6, '#ffffff'], [104, H - 5, '#f6d84a']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="2.4" fill="${c}"/>`).join('')}`);
}

// Harebells: slender stems with nodding blue-violet bells.
function harebell() {
  const bell = (x, y) => `<path d="M${x} ${y - 4} Q${x - 7} ${y - 2} ${x - 7} ${y + 8} Q${x} ${y + 12} ${x + 7} ${y + 8} Q${x + 7} ${y - 2} ${x} ${y - 4} Z" fill="#8a8ee0" ${soft('#5a5ea8', 0.8)}/><path d="M${x - 4} ${y + 9} l-2 3 M${x} ${y + 10} v4 M${x + 4} ${y + 9} l2 3" stroke="#5a5ea8" stroke-width="1" stroke-linecap="round"/>`;
  const one = (x, top, lean) => `<path d="M${x} 72 Q${x + lean} ${f1((72 + top) / 2)} ${x + lean * 1.4} ${top}" fill="none" stroke="#7aa850" stroke-width="2" stroke-linecap="round"/>${bell(x + lean * 1.4, top + 4)}`;
  return svgDoc(110, 78, `
    <path d="M4 74 Q24 62 44 72 Q68 60 106 74" fill="none" stroke="#8ab05c" stroke-width="5" stroke-linecap="round"/>
    ${one(22, 30, -6)}${one(46, 18, 4)}${one(70, 34, -3)}${one(92, 40, 6)}
    ${[[34, 66], [58, 62], [82, 66]].map(([x, y]) => `<path d="M${x - 5} ${y + 4} q5 -12 10 0 Z" fill="#7aae52"/>`).join('')}`);
}

// Slim reeds with a couple of cattails, pale green and golden.
function reedTuft() {
  const W = 110;
  const H = 96;
  const blades = [];
  for (let i = 0; i < 16; i++) {
    const x = 14 + i * 5.4 + rnd(i) * 4;
    const top = 28 + rnd(i + 20) * 40;
    const lean = (rnd(i + 40) - 0.5) * 26;
    blades.push(`<path d="M${f1(x)} ${H - 4} Q${f1(x + lean * 0.3)} ${f1((H + top) / 2)} ${f1(x + lean)} ${f1(top)}" stroke="${['#a9c466', '#c4cc7a', '#8fb050', '#d2c070'][i % 4]}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`);
  }
  return svgDoc(W, H, `
    ${blades.join('')}
    <path d="M40 ${H - 4} Q38 56 42 24 M70 ${H - 4} Q74 60 68 30" stroke="#8fb050" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <rect x="39" y="12" width="5" height="16" rx="2.5" fill="#9a6a3e"/><rect x="65.5" y="18" width="5" height="16" rx="2.5" fill="#9a6a3e"/>
    <path d="M8 ${H - 4} q8 -6 16 0 M86 ${H - 4} q8 -6 16 0" fill="none" stroke="#7aae52" stroke-width="2.6" stroke-linecap="round"/>`);
}

// ---- Strips: reeds at the shore and a rope rail at the landing ----

// Reeds along the water: every stalk leans only a little and groups repeat at the tile edge, so it joins.
function stripReeds() {
  const w = 156;
  const blades = [];
  for (let i = 0; i < 17; i++) {
    const x = (i * w) / 17 + 3;
    const top = 30 + rnd(i + 5) * 26;
    const lean = (rnd(i + 17) - 0.5) * 12;
    const col = ['#a9c466', '#c4cc7a', '#8fb050', '#d2c070'][i % 4];
    for (const o of [-w, 0, w]) blades.push(`<path d="M${f1(x + o)} 68 Q${f1(x + o + lean * 0.3)} ${f1((68 + top) / 2)} ${f1(x + o + lean)} ${f1(top)}" stroke="${col}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`);
    if (i % 8 === 3) for (const o of [-w, 0, w]) blades.push(`<rect x="${f1(x + o + lean - 2.4)}" y="${f1(top - 3)}" width="4.8" height="13" rx="2.4" fill="#9a6a3e"/>`);
  }
  return svgDoc(w, 70, blades.join(''));
}

// A harbour rail: posts with rounded caps and two sagging ropes. Posts sit on the tile edges and in
// the middle, so the ropes meet at the same height on both sides and the strip joins without a seam.
function stripRail() {
  const w = 156;
  const post = (x) => `<rect x="${x - 4}" y="22" width="8" height="46" rx="3" fill="${WOOD_LIGHT}" ${soft(WOOD_LINE, 1.2)}/><circle cx="${x}" cy="22" r="5.4" fill="${WOOD}" ${soft(WOOD_LINE, 1.2)}/>`;
  const rope = (y, sag) => `<path d="M0 ${y} Q${w / 4} ${y + sag} ${w / 2} ${y} Q${(w * 3) / 4} ${y + sag} ${w} ${y}" fill="none" stroke="#e8dcc0" stroke-width="3.4" stroke-linecap="round"/><path d="M0 ${y} Q${w / 4} ${y + sag} ${w / 2} ${y} Q${(w * 3) / 4} ${y + sag} ${w} ${y}" fill="none" stroke="#8a7a58" stroke-width="1" opacity="0.6" transform="translate(0 2)"/>`;
  const grass = [];
  for (let x = 12; x < w; x += 19) grass.push(`M${x} 68 q-2 -8 -5 -10 M${x + 3} 68 q1 -9 5 -12`);
  return svgDoc(w, 70, `
    ${rope(28, 12)}${rope(44, 12)}
    ${post(0)}${post(w / 2)}${post(w)}
    <path d="${grass.join(' ')}" stroke="#6aa650" stroke-width="2.4" fill="none" stroke-linecap="round"/>`);
}

// ---- All pieces ----

const PIECES = {
  'hills-far-koenigssee': [GAME_WIDTH, 220, hillsFar],
  'hills-near-koenigssee': [GAME_WIDTH, 140, hillsNear],
  'ks-watzmann': [644, 340 + FOOT_GAP, watzmann],
  'ks-bartholomae': [644, 360 + FOOT_GAP, bartholomae],
  'ks-jenner': [500, 300 + FOOT_GAP, jenner],
  'ks-spruce': [90, 220, spruceTall],
  'ks-spruces': [240, 180, spruceGroup],
  'ks-deer-far': [220, 150, deerFar],
  'ks-boat-far': [290, 96 + WATER_GAP, boatFar],
  'ks-jetty-far': [330, 130 + WATER_GAP, jettyFar],
  'ks-islet': [300, 110 + WATER_GAP, islet],
  'ks-spruce-big': [150, 300, spruceBig],
  'ks-beech': [220, 280, beechMid],
  'ks-signpost': [140, 250, signpost],
  'ks-bridge': [330, 260, bridge],
  'ks-boathouse': [230, 250, boathouseSingle],
  'ks-boathouse-row': [380, 250, boathouseRow],
  'ks-kiosk': [230, 220, kiosk],
  'ks-viewpoint': [290, 240, viewpoint],
  'ks-reeds-big': [230, 210, reedsBig],
  'ks-ferns': [130, 76, fernsNear],
  'ks-harebell': [110, 78, harebell],
  'ks-reed-tuft': [110, 96, reedTuft],
  'ks-strip-reeds': [156, 70, stripReeds],
  'ks-strip-rail': [156, 70, stripRail],
};

export function koenigsseeSvgs() {
  return Object.fromEntries(Object.entries(PIECES).map(([key, [w, h, draw]]) => [key, { w, h, svg: draw() }]));
}

export function preloadKoenigssee(scene) {
  for (const [key, { w, h, svg }] of Object.entries(koenigsseeSvgs())) loadSvg(scene, key, svg, w, h);
}
