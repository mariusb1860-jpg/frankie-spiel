import { GAME_WIDTH } from '../config.js';
import { loadSvg, svgDoc } from './svg.js';
import { attrs, crown, ridge, ridgeY } from './scenery.js';

// Level 12, the Bavarian Alps (grown-ups, only loaded after the pretzel button): high summer on an
// alpine pasture, then the alpine hut, then the rocky foot of the Zugspitze.
// Everything here is background: soft outlines, never the strong OUTLINE. Cows, fences and woodpiles
// sit in the far and mid layers, rocks only far and small; nothing flat, oval or blue (a puddle) lies on the ground line.

const f1 = (n) => n.toFixed(1);
const polygon = (pts, w, h) => `M0 ${h} ${pts.map(([x, y]) => `L${f1(x)} ${f1(y)}`).join(' ')} L${w} ${h} Z`;
const rnd = (n) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

// Landmarks stand on the meadow line (y 128) of hills-far-alm: far pictures sit at GROUND_Y - 45 with
// scale ~0.56, so this much empty space below their foot puts the foot on that line.
const FOOT_GAP = 111;
const MEADOW = 128;

const WOOD = '#a9784a';
const WOOD_LIGHT = '#caa070';
const WOOD_DARK = '#7a5232';
const WOOD_LINE = '#5a3a22';
const STONE = '#c4bca8';
const STONE_LIGHT = '#ddd6c4';
const STONE_SHADE = '#a39a84';
const STONE_LINE = '#7b705c';
const ROCK = '#aab3c0';
const ROCK_LIGHT = '#cdd4de';
const ROCK_DARK = '#7d8795';
const ROCK_LINE = '#5f6877';
const SNOW = '#ffffff';
const SNOW_SHADE = '#d9e4f2';
const GOLD = '#f2b83c';
const GOLD_LINE = '#9a6e1c';
const SLATE_LINE = '#4a5a60';
const WHITE_WALL = '#fbf7ec';
const WALL_SHADE = '#e6dcc6';
const WALL_LINE = '#a89a82';
const COPPER = '#5fa88e';
const COPPER_LIGHT = '#9ad6bd';
const COPPER_LINE = '#356f5a';
const ROOF = '#b5573f';
const ROOF_LIGHT = '#d7795a';
const ROOF_LINE = '#7d332b';
const SHINGLE = '#8f7a62';
const SHINGLE_LIGHT = '#b09a7e';
const SHINGLE_LINE = '#5e4c3a';
const GLASS = '#8fb1cf';
const FIR = { line: '#24503a', base: '#2f6b4a', shade: '#245a3c', light: '#4f9363' };
const FIR_PALE = { line: '#3d6b58', base: '#4f8566', shade: '#427558', light: '#6ea683' };
const GRASS = { line: '#3f6b36', base: '#6fb34a', shade: '#58a03c', light: '#98d060', dots: '#c0e888' };
const PINE = { line: '#26503a', base: '#3b7048', shade: '#2e5e3c', light: '#5a9566', dots: '#86bd88' };
const COW = '#a8643a';
const COW_LIGHT = '#c98a5a';
const COW_DARK = '#7a4426';
const COW_LINE = '#5a3220';
const BRASS = '#e6b53c';
const BRASS_DARK = '#a8761c';

// ---- Small helpers ----

const soft = (color, w = 1.5) => attrs(color, w);

// Soft ground shadow under a piece.
const groundShadow = (cx, y, rx, o = 0.2) => `<ellipse cx="${cx}" cy="${y}" rx="${rx}" ry="${f1(Math.min(rx * 0.1, 6))}" fill="#3e5a28" opacity="${o}"/>`;

// A round-arched window or door w wide, from its top at y down to y + h.
const arch = (x, y, w, h) => `M${f1(x)} ${f1(y + h)} V${f1(y + w / 2)} A${f1(w / 2)} ${f1(w / 2)} 0 0 1 ${f1(x + w)} ${f1(y + w / 2)} V${f1(y + h)} Z`;

// A spruce standing on (cx, base): h high, w wide, drawn from the bottom tier up. The left half of
// every tier is lighter (the sun stands on the right in the sky, the shade falls on the left side).
function fir(cx, base, h, w, c = FIR, tiers = 5) {
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

// One snowy mountain: rock, a snow cap with a ragged lower edge, and a shaded left face (the light
// comes from the right). Drawn at cx - 960, cx and cx + 960 so the tile repeats cleanly.
let clipId = 0;
function mountain({ cx, top, base, half, rock, seed, snowDepth = 34, shade = 0.2, snowColor = SNOW }) {
  const id = `mt${clipId++}`;
  const peakX = cx + (rnd(seed) - 0.5) * half * 0.2;
  const pts = [[cx - half, base]];
  const n = 8;
  for (let k = 1; k < n; k++) {
    const t = k / n;
    pts.push([cx - half * (1 - t) + (rnd(seed * 10 + k) - 0.5) * half * 0.08, base - (base - top) * t ** 0.9 + (k % 2 ? 4 : -3)]);
  }
  pts.push([peakX, top]);
  for (let k = n - 1; k >= 1; k--) {
    const t = k / n;
    pts.push([cx + half * (1 - t) + (rnd(seed * 17 + k) - 0.5) * half * 0.08, base - (base - top) * t ** 0.9 + (k % 2 ? -3 : 4)]);
  }
  pts.push([cx + half, base]);
  const d = `M${pts.map(([x, y]) => `${f1(x)} ${f1(y)}`).join(' L')} Z`;
  const snow = [`M${f1(cx - half - 4)} ${f1(top - 10)} H${f1(cx + half + 4)}`];
  const zig = [];
  for (let x = cx + half + 4, i = 0; x >= cx - half - 4; x -= 11, i++) {
    // The snow reaches lower near the peak and in the gullies, higher on the shoulders.
    const slope = Math.abs(x - peakX) / half;
    zig.push(`${f1(x)} ${f1(top + snowDepth * (0.55 + 0.9 * slope * 0.4) + (i % 2 ? 9 : -4) + rnd(seed + i) * 10)}`);
  }
  snow.push(`L${zig.join(' L')} Z`);
  const ribs = [0.25, 0.45, 0.62, 0.8]
    .map((t, i) => {
      const x = peakX + (t - 0.5) * half * 1.1;
      return `M${f1(x)} ${f1(top + snowDepth + 6)} L${f1(x - 10 + i * 6)} ${f1(base - 6)}`;
    })
    .join(' ');
  const faceShade = `M${f1(peakX)} ${f1(top)} L${f1(peakX + half * 0.05)} ${f1(top + (base - top) * 0.3)} L${f1(peakX - half * 0.03)} ${f1(top + (base - top) * 0.58)} L${f1(peakX + half * 0.08)} ${f1(base)} L${f1(cx - half - 2)} ${f1(base)} Z`;
  return `<defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs>
    <path d="${d}" fill="${rock}"/>
    <g clip-path="url(#${id})">
      <path d="${ribs}" stroke="${ROCK_DARK}" stroke-width="3" opacity="0.2" fill="none"/>
      <path d="${snow.join(' ')}" fill="${snowColor}"/>
      <path d="${faceShade}" fill="#4f6794" opacity="${shade}"/>
    </g>`;
}

const wrapped = (cx, half, fn) => [-GAME_WIDTH, 0, GAME_WIDTH].filter((o) => cx + o + half > 0 && cx + o - half < GAME_WIDTH).map((o) => fn(cx + o)).join('');

// ---- Background tiles ----

// Far away: two ranges of snow-capped Alps, a dark belt of spruce forest and the pasture in front.
// Nothing crosses the left or right edge, so it tiles.
function hillsFar() {
  const w = GAME_WIDTH;
  const back = [
    { cx: 70, top: 14, half: 130, seed: 1 }, { cx: 290, top: 34, half: 110, seed: 2 }, { cx: 500, top: 10, half: 150, seed: 3 },
    { cx: 740, top: 30, half: 120, seed: 4 }, { cx: 915, top: 44, half: 110, seed: 5 },
  ];
  const front = [
    { cx: 170, top: 66, half: 120, seed: 6 }, { cx: 400, top: 56, half: 130, seed: 7 }, { cx: 620, top: 72, half: 110, seed: 8 },
    { cx: 850, top: 60, half: 130, seed: 9 },
  ];
  const belt = ridge(w, 108, [[6, 3, 1.2], [3, 7, 0.5]]);
  const slope = ridge(w, 122, [[4, 2, 0.4], [2, 6, 1.1]]);
  const meadowStripes = [];
  for (let x = 0; x < w; x += 80) meadowStripes.push(`<path d="M${x} ${MEADOW + 4} L${x + 40} ${MEADOW + 4} L${x + 80} 220 L${x + 40} 220 Z" fill="#ffffff" opacity="0.1"/>`);
  const blooms = [];
  for (let i = 0; i < 60; i++) {
    const x = (i * 197) % w;
    const y = MEADOW + 10 + ((i * 53) % 78);
    blooms.push(`<circle cx="${x}" cy="${y}" r="${1.3 + (i % 3) * 0.5}" fill="${['#fff3b0', '#ffffff', '#b4c8f0', '#f6c4d0'][i % 4]}" opacity="0.75"/>`);
  }
  // Little cows far away on the pasture: just brown dots with a lighter back.
  const cows = [[96, 150], [118, 160], [392, 158], [412, 150], [704, 162], [726, 154], [868, 146]]
    .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="5" ry="2.8" fill="#8a5a3a" opacity="0.7"/><ellipse cx="${x - 1}" cy="${y - 1}" rx="3" ry="1.4" fill="#b88458" opacity="0.7"/>`)
    .join('');
  return svgDoc(w, 220, `
    <defs>
      <linearGradient id="mw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b8dc72"/><stop offset="1" stop-color="#8cc85a"/></linearGradient>
      <linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2ecf7" stop-opacity="0"/><stop offset="1" stop-color="#e2ecf7" stop-opacity="0.55"/></linearGradient>
    </defs>
    ${back.map((m) => wrapped(m.cx, m.half, (cx) => mountain({ ...m, cx, base: 126, rock: '#c3cfe2', snowDepth: 40 }))).join('')}
    <rect y="60" width="${w}" height="66" fill="url(#sk)"/>
    ${front.map((m) => wrapped(m.cx, m.half, (cx) => mountain({ ...m, cx, base: 126, rock: '#a7b8d2', snowDepth: 26, shade: 0.26 }))).join('')}
    <path d="${polygon(belt, w, MEADOW + 2)}" fill="#4d8a64"/>
    ${firRow(w, belt, 44, 8, 34, [FIR, FIR_PALE, FIR])}
    <path d="${polygon(slope, w, MEADOW + 2)}" fill="#76b24f"/>
    <rect y="${MEADOW}" width="${w}" height="${220 - MEADOW}" fill="url(#mw)"/>
    ${meadowStripes.join('')}${blooms.join('')}${cows}
    <path d="M0 ${MEADOW} H${w}" stroke="#d8eaa0" stroke-width="2.4" opacity="0.8"/>`);
}

// A tiny alpine hut on a slope, for the near hills.
function tinyHut(x, y) {
  return `<rect x="${x - 15}" y="${y - 10}" width="30" height="14" fill="#a9784a"/><path d="M${x - 19} ${y - 9} L${x - 7} ${y - 22} H${x + 7} L${x + 19} ${y - 9} Z" fill="#8f7a62"/><rect x="${x - 3}" y="${y - 5}" width="6" height="9" fill="#5a3a22"/>`;
}

// Right behind Frankie: a green alpine slope with a forest of spruce above it.
function hillsNear() {
  const w = GAME_WIDTH;
  const forest = ridge(w, 40, [[7, 3, 0.8], [3, 7, 1.7]]);
  const slope = ridge(w, 72, [[9, 2, 1.3], [4, 5, 0.2], [2, 11, 0.9]]);
  const stripes = [];
  for (let x = 0; x < w; x += 64) stripes.push(`<path d="M${x} 90 L${x + 30} 90 L${x + 50} 140 L${x + 20} 140 Z" fill="#f6f6a8" opacity="0.1"/>`);
  const blooms = [];
  for (let i = 0; i < 52; i++) {
    const x = (i * 173) % w;
    const y = ridgeY(slope, x) + 14 + ((i * 29) % 52);
    blooms.push(`<circle cx="${x}" cy="${y}" r="${1.6 + (i % 3) * 0.5}" fill="${['#ffffff', '#ffe066', '#9db8f2', '#ffb0c4'][i % 4]}" opacity="0.8"/>`);
  }
  return svgDoc(w, 140, `
    <defs><linearGradient id="ln" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a6d566"/><stop offset="1" stop-color="#7cb84a"/></linearGradient></defs>
    <path d="${polygon(forest, w, 100)}" fill="#3f7a54"/>
    ${firRow(w, forest, 30, 12, 70, [FIR, FIR_PALE, FIR, FIR])}
    ${firRow(w, slope, 12, 14, 62, [FIR_PALE, FIR])}
    <path d="${polygon(slope, w, 140)}" fill="url(#ln)"/>
    <path d="M${slope.map(([x, y]) => `${x} ${f1(y + 3)}`).join(' L')}" fill="none" stroke="#d6f09a" stroke-width="3" opacity="0.8"/>
    ${tinyHut(210, ridgeY(slope, 210) + 28)}${tinyHut(640, ridgeY(slope, 640) + 28)}
    ${stripes.join('')}${blooms.join('')}`);
}

// ---- Landmarks (far layer, once per zone) ----

// A little grass hill under a landmark, so the foot stands on the meadow line.
const hillFoot = (w, H, top = 24, fill = '#8cc65c') => `<path d="M0 ${H} L0 ${H - 4} C${w * 0.12} ${H - top + 4} ${w * 0.3} ${H - top} ${w / 2} ${H - top} C${w * 0.7} ${H - top} ${w * 0.88} ${H - top + 4} ${w} ${H - 4} L${w} ${H} Z" fill="${fill}" ${soft('#5a8e3c', 1.4)}/>
  <path d="M${w * 0.14} ${H - top + 3} C${w * 0.3} ${H - top - 2} ${w * 0.7} ${H - top - 2} ${w * 0.86} ${H - top + 3}" fill="none" stroke="#c4e88a" stroke-width="3" opacity="0.8"/>`;

// A white pasture chapel with an onion tower, on a green hill, spruces behind it.
function chapel() {
  const W = 210;
  const H = 250;
  const wall = soft(WALL_LINE, 1.4);
  const nave = [];
  for (let x = 86; x < 160; x += 8) nave.push(`M${x} 156 V176`);
  return svgDoc(W, H + FOOT_GAP, `
    ${fir(26, 232, 130, 58)}${fir(178, 234, 150, 66)}${fir(198, 236, 100, 46, FIR_PALE)}
    ${hillFoot(W, H)}
    <path d="M70 180 L84 150 H160 L174 180 Z" fill="${ROOF}" ${soft(ROOF_LINE, 1.5)}/>
    <path d="M70 180 L84 150 H112 L102 180 Z" fill="${ROOF_LIGHT}" opacity="0.55"/>
    <path d="${nave.join(' ')}" stroke="${ROOF_LINE}" stroke-width="0.9" opacity="0.5"/>
    <rect x="76" y="178" width="88" height="50" fill="${WHITE_WALL}" ${wall}/>
    <rect x="76" y="178" width="88" height="5" fill="${WALL_SHADE}"/>
    <path d="${arch(92, 188, 14, 26)} ${arch(126, 188, 14, 26)}" fill="${GLASS}" ${soft('#ffffff', 2)}/>
    <path d="M99 188 V214 M133 188 V214" stroke="#ffffff" stroke-width="1.5"/>
    <path d="M160 190 L172 178 L184 190 V228 H160 Z" fill="${WHITE_WALL}" ${wall}/>
    <path d="M158 190 L172 172 L186 190 Z" fill="${ROOF}" ${soft(ROOF_LINE, 1.3)}/>
    <rect x="38" y="104" width="40" height="124" fill="${WHITE_WALL}" ${wall}/>
    <rect x="66" y="104" width="12" height="124" fill="${WALL_SHADE}" opacity="0.85"/>
    <rect x="34" y="102" width="48" height="6" fill="${WALL_SHADE}" ${soft(WALL_LINE, 1)}/>
    <path d="${arch(50, 114, 16, 28)}" fill="#4a3a32"/><path d="M52 124 H64 M52 130 H64 M52 136 H64" stroke="#7a6a5a" stroke-width="1.3"/>
    <circle cx="58" cy="160" r="9" fill="#ffffff" ${soft(GOLD_LINE, 1.6)}/><path d="M58 160 V153 M58 160 L63 163" stroke="#4a3a32" stroke-width="1.6"/>
    <path d="${arch(49, 196, 18, 32)}" fill="${WOOD}" ${soft(WOOD_LINE, 1.3)}/>
    <path d="M58 196 V228" stroke="${WOOD_LINE}" stroke-width="1.2"/>
    <rect x="44" y="226" width="30" height="4" fill="${STONE}" ${soft(STONE_LINE, 1)}/>
    <path d="M42 104 C32 98 32 84 44 76 C52 72 55 66 58 52 C61 66 64 72 72 76 C84 84 84 98 74 104 Z" fill="${COPPER}" ${soft(COPPER_LINE, 1.5)}/>
    <path d="M42 102 C34 96 36 84 46 78 C52 74 55 68 58 56 C56 70 50 78 46 86 C42 92 42 98 46 102 Z" fill="${COPPER_LIGHT}" opacity="0.8"/>
    <path d="M58 52 V36" stroke="${GOLD_LINE}" stroke-width="2.4" stroke-linecap="round"/>
    <circle cx="58" cy="52" r="3.4" fill="${GOLD}" ${soft(GOLD_LINE, 1)}/>
    <path d="M58 40 V22 M52 29 H64" stroke="${GOLD}" stroke-width="3" stroke-linecap="round"/>
    <path d="M26 230 q8 -10 16 0 M178 232 q8 -9 16 0" fill="none" stroke="#6aa650" stroke-width="3" stroke-linecap="round"/>
    ${[[24, 236, '#ffffff'], [32, 240, '#f6d84a'], [96, 238, '#b4c8f0'], [112, 241, '#ffffff'], [150, 238, '#f2788a'], [186, 241, '#f6d84a'], [14, 241, '#b4c8f0']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="2.4" fill="${c}"/>`).join('')}
    ${groundShadow(105, 229, 82, 0.2)}`);
}

// A stone and timber alpine hut: wooden upper floor with balcony and red geraniums, a roof of
// wooden shingles weighed down with stones, smoke from the chimney.
function hut() {
  const W = 310;
  const H = 232;
  const stones = [];
  for (let row = 0; row < 6; row++) {
    for (let x = 36 + (row % 2) * 9, i = 0; x < 268; x += 24 + ((row * 5 + i * 7) % 10), i++) {
      const sw = 20 + ((row * 3 + i * 5) % 9);
      stones.push(`<rect x="${x}" y="${168 + row * 9}" width="${f1(Math.min(sw, 270 - x))}" height="8" rx="2.4" fill="${(row + i) % 3 === 0 ? STONE_LIGHT : (row + i) % 3 === 1 ? STONE : STONE_SHADE}" ${soft(STONE_LINE, 0.7)}/>`);
    }
  }
  const logs = [];
  for (let y = 120; y < 166; y += 8) logs.push(`M42 ${y} H268`);
  const shingleRows = [];
  const roofStones = [];
  for (let r = 0; r < 5; r++) {
    const y = 58 + r * 11;
    const xl = 34 - r * 3.4;
    const xr = 276 + r * 3.4;
    shingleRows.push(`<path d="M${f1(xl)} ${y + 11} H${f1(xr)}" stroke="${SHINGLE_LINE}" stroke-width="1.3" opacity="0.7"/>`);
    for (let x = xl + 6; x < xr - 4; x += 12) shingleRows.push(`<path d="M${f1(x + (r % 2) * 5)} ${y + 1} V${y + 11}" stroke="${SHINGLE_LINE}" stroke-width="0.8" opacity="0.4"/>`);
    for (let x = xl + 18 + (r % 2) * 22, i = 0; x < xr - 12; x += 44, i++) {
      roofStones.push(`<ellipse cx="${f1(x)}" cy="${y + 5.6}" rx="${7 + (i % 3)}" ry="${4.6 + (i % 2)}" fill="#a9aeb4" ${soft('#6a6f78', 1)}/><ellipse cx="${f1(x - 2)}" cy="${y + 4}" rx="3.4" ry="1.8" fill="#d2d6da"/>`);
    }
  }
  const rail = [];
  for (let x = 36; x < 276; x += 11) rail.push(`M${x} 138 V160`);
  const geraniums = [];
  for (let x = 42, i = 0; x < 268; x += 12, i++) {
    geraniums.push(`<circle cx="${x + (i % 2) * 2}" cy="${132 - (i % 3)}" r="4.8" fill="${['#e5384a', '#f2788a', '#d6283c'][i % 3]}"/><circle cx="${x - 3}" cy="137" r="3.4" fill="#4f9440"/>`);
  }
  return svgDoc(W, H + 30 + FOOT_GAP, `<g transform="translate(0 30)">
    ${fir(20, 228, 150, 66)}${fir(296, 230, 130, 58, FIR_PALE)}
    ${hillFoot(W, H, 20)}
    <rect x="34" y="166" width="238" height="64" fill="${STONE}" ${soft(STONE_LINE, 1.5)}/>
    ${stones.join('')}
    <rect x="34" y="166" width="238" height="3" fill="#6a604c" opacity="0.35"/>
    <path d="${arch(144, 186, 24, 42)}" fill="${WOOD_DARK}" ${soft(WOOD_LINE, 1.5)}/>
    <path d="M156 186 V228 M148 204 H152" stroke="${WOOD_LINE}" stroke-width="1.4"/>
    ${[66, 218].map((x) => `<rect x="${x}" y="190" width="24" height="22" fill="#6a7e8e" ${soft('#fffdf4', 2.2)}/><path d="M${x + 12} 190 V212 M${x} 201 H${x + 24}" stroke="#fffdf4" stroke-width="1.4"/><rect x="${x - 8}" y="190" width="7" height="22" fill="#4f8a5a" ${soft('#2f5a3c', 0.8)}/><rect x="${x + 25}" y="190" width="7" height="22" fill="#4f8a5a" ${soft('#2f5a3c', 0.8)}/>`).join('')}
    <rect x="38" y="116" width="232" height="52" fill="#93633b" ${soft(WOOD_LINE, 1.5)}/>
    <path d="${logs.join(' ')}" stroke="${WOOD_LINE}" stroke-width="1.4" opacity="0.55"/>
    <rect x="38" y="116" width="232" height="52" fill="#c89a62" opacity="0.14"/>
    ${[[34, 122], [34, 140], [34, 156], [266, 122], [266, 140], [266, 156]].map(([x, y]) => `<circle cx="${x + 4}" cy="${y}" r="3.6" fill="${WOOD_LIGHT}" ${soft(WOOD_LINE, 1)}/>`).join('')}
    ${[[70, 124], [214, 124]].map(([x, y]) => `<rect x="${x}" y="${y}" width="22" height="24" fill="${GLASS}" ${soft('#fffdf4', 2.2)}/><path d="M${x + 11} ${y} V${y + 24} M${x} ${y + 11} H${x + 22}" stroke="#fffdf4" stroke-width="1.4"/><rect x="${x - 7}" y="${y}" width="6" height="24" fill="#b83a3a" ${soft('#6a1e1e', 0.8)}/><rect x="${x + 23}" y="${y}" width="6" height="24" fill="#b83a3a" ${soft('#6a1e1e', 0.8)}/>`).join('')}
    <path d="${arch(142, 122, 26, 40)}" fill="${WOOD_DARK}" ${soft(WOOD_LINE, 1.4)}/>
    <path d="M155 122 V162" stroke="${WOOD_LINE}" stroke-width="1.2"/>
    <rect x="28" y="158" width="254" height="8" fill="${WOOD_LIGHT}" ${soft(WOOD_LINE, 1.5)}/>
    <path d="${rail.join(' ')}" stroke="${WOOD_LIGHT}" stroke-width="3" stroke-linecap="round"/>
    <rect x="30" y="136" width="250" height="5" rx="1.5" fill="${WOOD_LIGHT}" ${soft(WOOD_LINE, 1.2)}/>
    ${geraniums.join('')}
    <rect x="236" y="20" width="18" height="44" fill="${STONE}" ${soft(STONE_LINE, 1.4)}/><rect x="233" y="16" width="24" height="7" fill="${STONE_SHADE}" ${soft(STONE_LINE, 1.2)}/>
    <g fill="#eef1f4" opacity="0.85"><circle cx="246" cy="8" r="6"/><circle cx="252" cy="-2" r="8"/><circle cx="246" cy="-12" r="9"/></g>
    <path d="M18 112 L36 56 H274 L292 112 Z" fill="${SHINGLE}" ${soft(SHINGLE_LINE, 1.6)}/>
    <path d="M18 112 L36 56 H110 L96 112 Z" fill="${SHINGLE_LIGHT}" opacity="0.5"/>
    ${shingleRows.join('')}
    ${roofStones.join('')}
    <path d="M34 54 H276" stroke="${SHINGLE_LINE}" stroke-width="4.4" stroke-linecap="round"/>
    <path d="M18 112 H292" stroke="${SHINGLE_LINE}" stroke-width="3" stroke-linecap="round"/>
    <path d="M20 115 H290 V122 H20 Z" fill="#000000" opacity="0.14"/>
    <path d="M52 56 V4" stroke="${WOOD_DARK}" stroke-width="3" stroke-linecap="round"/>
    <path d="M52 6 H84 V26 H52 Z" fill="#ffffff" ${soft(WOOD_LINE, 1)}/>
    <path d="M52 6 h8 l8 8 l-8 8 h-8 Z M68 14 l8 -8 h8 v8 l-8 8 h-8 Z" fill="#3d84c6" opacity="0.9"/>
    <circle cx="48" cy="${H - 2}" r="4" fill="#ffffff"/><circle cx="62" cy="${H}" r="3.4" fill="#b4c8f0"/><circle cx="262" cy="${H - 1}" r="3.4" fill="#f6d84a"/>
    ${groundShadow(155, 229, 118, 0.2)}</g>`);
}

// A rocky peak with a wooden summit cross, green slopes and spruces at its foot.
function summitCross() {
  const W = 300;
  const H = 300;
  const peak = 'M0 300 L18 262 L42 240 L62 202 L86 184 L102 142 L122 112 L136 84 L143 62 L147 55 L154 55 L158 63 L162 76 L172 100 L190 120 L200 158 L222 172 L238 212 L262 238 L284 264 L300 300 Z';
  return svgDoc(W, H + FOOT_GAP, `
    <defs><clipPath id="pk"><path d="${peak}"/></clipPath></defs>
    <path d="${peak}" fill="${ROCK}" ${soft(ROCK_LINE, 1.5)}/>
    <g clip-path="url(#pk)">
      <path d="M150 52 L140 90 L146 130 L134 170 L142 220 L132 260 L120 300 H0 V0 H150 Z" fill="#4f6794" opacity="0.22"/>
      <path d="M150 50 L138 76 L146 82 L132 100 L140 108 L124 122 L142 118 L154 100 L162 112 L172 98 L162 80 L168 74 L158 62 Z" fill="${SNOW}"/>
      <path d="M186 118 L194 138 L204 126 L198 156 L190 140 Z M104 146 L112 166 L96 176 Z" fill="${SNOW}"/>
      <path d="M118 120 L106 176 M146 138 L136 196 M176 128 L184 190 M212 178 L226 230 M82 190 L74 236" stroke="${ROCK_DARK}" stroke-width="3" opacity="0.28" fill="none"/>
      <path d="M0 300 V258 C30 240 52 252 80 238 C110 224 130 244 160 246 C196 248 214 226 246 240 C270 250 286 248 300 260 V300 Z" fill="#8cc65c"/>
      <path d="M0 270 C30 254 52 266 80 252 C110 238 130 258 160 260 C196 262 214 240 246 254 C270 264 286 262 300 274" fill="none" stroke="#b6e07c" stroke-width="4" opacity="0.8"/>
      <path d="M70 244 q10 8 22 4 M190 250 q10 -6 24 2" fill="none" stroke="${ROCK_DARK}" stroke-width="3" stroke-linecap="round" opacity="0.5"/>
    </g>
    ${fir(30, 300, 90, 42)}${fir(52, 304, 70, 32, FIR_PALE)}${fir(262, 302, 96, 44)}${fir(284, 304, 72, 34, FIR_PALE)}
    <path d="M150 54 V6" stroke="${WOOD_LINE}" stroke-width="8" stroke-linecap="round"/>
    <path d="M150 54 V6" stroke="${WOOD}" stroke-width="5" stroke-linecap="round"/>
    <path d="M133 22 H167" stroke="${WOOD_LINE}" stroke-width="8" stroke-linecap="round"/>
    <path d="M133 22 H167" stroke="${WOOD}" stroke-width="5" stroke-linecap="round"/>
    <path d="M147 10 V50 M133 20 H167" stroke="${WOOD_LIGHT}" stroke-width="1.6" stroke-linecap="round" opacity="0.8"/>
    <path d="M138 62 Q140 52 148 53 Q158 50 162 62 Z" fill="${ROCK}" ${soft(ROCK_LINE, 1.2)}/><path d="M142 58 Q146 53 152 54" fill="none" stroke="${ROCK_LIGHT}" stroke-width="2.4" stroke-linecap="round"/>
    ${[[60, 292, '#ffffff'], [76, 296, '#b4c8f0'], [214, 294, '#ffffff'], [232, 298, '#f2788a']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${c}"/>`).join('')}`);
}

// The Zugspitze: the great grey massif with its snow fields, the golden summit cross and the
// summit station on the top, spruce forest at its foot.
function zugspitze() {
  const W = 620;
  const H = 330;
  const prof = [
    [0, 330], [22, 304], [56, 272], [88, 240], [110, 196], [128, 156], [144, 130], [156, 144], [170, 122], [188, 152], [208, 140], [224, 112],
    [244, 96], [262, 72], [286, 56], [306, 46], [322, 40], [344, 40], [356, 46], [364, 60], [384, 78], [404, 100], [424, 112], [442, 94],
    [458, 86], [476, 98], [492, 124], [512, 150], [534, 182], [558, 220], [586, 268], [620, 306], [620, 330],
  ];
  const d = `M${prof.map(([x, y]) => `${x} ${y}`).join(' L')} Z`;
  const snowLine = [[0, 250], [30, 236], [60, 228], [84, 214], [108, 200], [124, 186], [150, 176], [176, 168], [200, 190], [232, 176], [262, 160], [286, 176], [310, 168], [334, 190], [352, 176], [374, 184], [398, 170], [420, 196], [446, 176], [470, 184], [492, 200], [520, 214], [548, 236], [580, 262], [620, 290], [620, 0], [0, 0]];
  const peaks = [[144, 130, 0.9], [170, 122, 0.8], [224, 112, 1], [262, 72, 1.3], [306, 46, 1.6], [322, 40, 1.4], [442, 94, 1], [458, 86, 1]];
  const faces = peaks.map(([x, y, s]) => `<path d="M${x} ${y} L${f1(x + 6 * s)} ${f1(y + 70 * s)} L${f1(x - 4 * s)} ${f1(y + 130 * s)} L${f1(x + 8)} ${y + 200} L${f1(x - 150 * s)} 330 H${x - 150 * s - 40} Z" fill="#4f6794" opacity="0.13"/>`).join('');
  const striations = [];
  for (let i = 0; i < 34; i++) {
    const x = 20 + i * 17 + rnd(i) * 8;
    const yTop = 120 + rnd(i + 40) * 120;
    striations.push(`M${f1(x)} ${f1(yTop)} L${f1(x - 6 - rnd(i + 9) * 12)} ${f1(yTop + 40 + rnd(i + 90) * 50)}`);
  }
  const ridges = '<path d="M226 112 L262 120 L300 118 M300 150 L330 140 L366 150 M410 118 L440 130 L470 124 M150 160 L182 170 L210 160" stroke="#ffffff" stroke-width="2.6" fill="none" opacity="0.8"/>';
  const forest = [];
  for (let x = -6, i = 0; x < W + 10; x += 15 + (i % 4) * 3, i++) {
    const hh = 36 + rnd(i + 5) * 26;
    forest.push(fir(x, 332 - (i % 3) * 3, hh, hh * 0.52, i % 3 ? FIR : FIR_PALE, 4));
  }
  return svgDoc(W, H + FOOT_GAP, `
    <defs><clipPath id="zg"><path d="${d}"/></clipPath>
      <linearGradient id="zf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8cc65c"/><stop offset="1" stop-color="#6aa650"/></linearGradient></defs>
    <path d="${d}" fill="#b0b8c6" ${soft(ROCK_LINE, 1.6)}/>
    <g clip-path="url(#zg)">
      <path d="${striations.join(' ')}" stroke="${ROCK_DARK}" stroke-width="3" fill="none" opacity="0.26" stroke-linecap="round"/>
      <path d="M0 120 H620 V250 H0 Z" fill="#c9cfd9" opacity="0.3"/>
      <path d="M${snowLine.map(([x, y]) => `${x} ${y}`).join(' L')} Z" fill="${SNOW}"/>
      ${ridges}
      <path d="M430 196 L446 176 L470 184 L492 200 L470 222 L444 216 Z" fill="${SNOW_SHADE}" opacity="0.7"/>
      ${faces}
      <path d="M0 330 V296 C60 282 110 300 170 290 C240 280 300 304 380 292 C460 282 540 300 620 292 V330 Z" fill="url(#zf)"/>
    </g>
    <path d="M300 40 H348" stroke="#8a929e" stroke-width="3"/>
    <rect x="296" y="14" width="44" height="26" fill="#eef0f2" ${soft('#8a929e', 1.5)}/>
    <path d="M296 14 H340 L336 8 H300 Z" fill="#7d8e94" ${soft(SLATE_LINE, 1.2)}/>
    ${[302, 312, 322, 332].map((x) => `<rect x="${x}" y="20" width="6" height="9" fill="#7fa6c8"/>`).join('')}
    <rect x="344" y="26" width="14" height="14" fill="#e8e0d0" ${soft('#8a929e', 1.2)}/>
    <path d="M351 26 V4 M346 10 H356 M347 16 H355" stroke="#6a727c" stroke-width="2" stroke-linecap="round"/>
    <path d="M364 60 V28" stroke="${GOLD_LINE}" stroke-width="7" stroke-linecap="round"/>
    <path d="M364 60 V28 M355 38 H373" stroke="${GOLD}" stroke-width="4.4" stroke-linecap="round"/>
    <path d="M364 58 V30 M356 38 H372" stroke="#ffe08a" stroke-width="1.4" stroke-linecap="round" opacity="0.9"/>
    <path d="M364 60 V28 M355 38 H373" stroke="${GOLD_LINE}" stroke-width="1" fill="none" opacity="0"/>
    <path d="M0 330 V300 C60 288 110 304 170 296 C240 286 300 308 380 298 C460 288 540 304 620 296 V330 Z" fill="url(#zf)"/>
    ${forest.join('')}
    ${[[40, 328, '#ffffff'], [90, 332, '#b4c8f0'], [260, 330, '#f2788a'], [420, 332, '#ffffff'], [560, 330, '#f6d84a']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${c}"/>`).join('')}`);
}

// A cable car: a valley station, a steel pylon and the cable climbing away, a cabin on each span.
function gondola() {
  const W = 330;
  const H = 290;
  const px = 210;
  const cabin = (x, y) => `
    <path d="M${x} ${y} V${y + 12}" stroke="#4a5058" stroke-width="2.4"/>
    <rect x="${x - 5}" y="${y + 9}" width="10" height="4" rx="1.4" fill="#6a727c"/>
    <path d="M${x - 17} ${y + 22} Q${x - 18} ${y + 13} ${x - 10} ${y + 13} H${x + 10} Q${x + 18} ${y + 13} ${x + 17} ${y + 22} V${y + 38} Q${x + 17} ${y + 42} ${x + 13} ${y + 42} H${x - 13} Q${x - 17} ${y + 42} ${x - 17} ${y + 38} Z" fill="#d83a3a" ${soft('#7a1e1e', 1.3)}/>
    <path d="M${x - 17} ${y + 31} H${x + 17} V${y + 38} Q${x + 17} ${y + 42} ${x + 13} ${y + 42} H${x - 13} Q${x - 17} ${y + 42} ${x - 17} ${y + 38} Z" fill="#ffffff"/>
    <path d="M${x - 12} ${y + 18} H${x + 12} V${y + 28} H${x - 12} Z" fill="#a8d0ea" ${soft('#ffffff', 1.3)}/>
    <path d="M${x} ${y + 18} V${y + 28}" stroke="#ffffff" stroke-width="1.2"/>`;
  // Cable height on the lower span (60,230 to px,96) and on the upper span (px,96 to 330,8).
  const lower = (x) => 230 + (96 - 230) * ((x - 60) / (px - 60));
  const upper = (x) => 96 + (8 - 96) * ((x - px) / (330 - px));
  const brace = [];
  for (let k = 0; k < 7; k++) {
    const t0 = k / 7;
    const t1 = (k + 1) / 7;
    const y0 = 100 + t0 * 182;
    const y1 = 100 + t1 * 182;
    const hw0 = 6 + t0 * 18;
    const hw1 = 6 + t1 * 18;
    brace.push(`M${px - hw0} ${y0} L${px + hw1} ${y1} M${px + hw0} ${y0} L${px - hw1} ${y1} M${px - hw1} ${y1} H${px + hw1}`);
  }
  return svgDoc(W, H + FOOT_GAP, `
    <defs><linearGradient id="cf" gradientUnits="userSpaceOnUse" x1="${px}" y1="98" x2="330" y2="8"><stop offset="0" stop-color="#4a5058"/><stop offset="0.6" stop-color="#4a5058"/><stop offset="1" stop-color="#4a5058" stop-opacity="0"/></linearGradient></defs>
    ${fir(20, 286, 100, 46)}${fir(300, 290, 120, 54, FIR_PALE)}
    ${hillFoot(W, H, 14)}
    <path d="M${px - 24} 284 L${px - 6} 100 M${px + 24} 284 L${px + 6} 100" stroke="#8a929c" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path d="${brace.join(' ')}" stroke="#9aa2ac" stroke-width="2.2" fill="none"/>
    <path d="M${px - 22} 96 H${px + 22}" stroke="#6a727c" stroke-width="5" stroke-linecap="round"/>
    <circle cx="${px - 10}" cy="94" r="4" fill="#4a5058"/><circle cx="${px + 10}" cy="94" r="4" fill="#4a5058"/>
    <path d="M60 230 L${px} 98" fill="none" stroke="#4a5058" stroke-width="2.4"/>
    <path d="M62 236 L${px - 2} 104" fill="none" stroke="#6a727c" stroke-width="1.4" opacity="0.7"/>
    <path d="M${px} 98 L330 8" fill="none" stroke="url(#cf)" stroke-width="2.4"/>
    <path d="M${px - 2} 104 L330 14" fill="none" stroke="url(#cf)" stroke-width="1.4" opacity="0.7"/>
    <rect x="8" y="238" width="86" height="50" fill="${STONE_LIGHT}" ${soft(STONE_LINE, 1.4)}/>
    <path d="M2 240 L14 218 H88 L100 240 Z" fill="${SHINGLE}" ${soft(SHINGLE_LINE, 1.4)}/>
    <path d="M2 240 L14 218 H44 L34 240 Z" fill="${SHINGLE_LIGHT}" opacity="0.5"/>
    <rect x="22" y="248" width="26" height="18" fill="#a8d0ea" ${soft('#ffffff', 2)}/><path d="M35 248 V266" stroke="#ffffff" stroke-width="1.4"/>
    <path d="${arch(60, 254, 22, 34)}" fill="${WOOD_DARK}" ${soft(WOOD_LINE, 1.2)}/>
    <path d="M60 230 V218" stroke="#4a5058" stroke-width="2.4"/>
    ${cabin(118, lower(118))}${cabin(268, upper(268))}
    ${[[110, 292, '#ffffff'], [140, 294, '#f6d84a'], [250, 292, '#b4c8f0']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${c}"/>`).join('')}
    ${groundShadow(160, 288, 140, 0.15)}`);
}

// ---- Far: spruces, cows on a pasture, two hikers ----

// A single tall spruce.
function firTall() {
  return svgDoc(90, 220, `${fir(45, 216, 206, 80, FIR, 6)}${groundShadow(45, 216, 26)}`);
}

// A small group of spruces on a grass mound, one with a snow-free tip, with a few flowers.
function firGroup() {
  return svgDoc(240, 180, `
    <path d="M0 178 C20 168 60 164 120 164 C180 164 220 168 240 178 Z" fill="#8cc65c" ${soft('#5a8e3c', 1.2)}/>
    ${fir(52, 172, 120, 54, FIR_PALE, 5)}${fir(188, 172, 100, 46, FIR, 5)}${fir(120, 170, 160, 70, FIR, 6)}${fir(86, 176, 76, 38, FIR, 4)}${fir(160, 176, 84, 40, FIR_PALE, 4)}
    ${[[28, 174, '#ffffff'], [214, 174, '#f6d84a'], [104, 176, '#b4c8f0']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${c}"/>`).join('')}
    ${groundShadow(120, 177, 100, 0.15)}`);
}

// A brown cow with a big bell, side view facing right, standing on y 128 of a 210 x 140 picture.
// Grazing: the head is down in the grass. Otherwise the head is up and looks at us.
function cowBody(grazing) {
  const head = grazing
    ? `<path d="M150 56 C164 62 176 80 184 98 L170 110 C160 96 150 80 142 70 Z" fill="${COW}" ${soft(COW_LINE, 1.3)}/>
       <ellipse cx="184" cy="108" rx="18" ry="11" transform="rotate(54 184 108)" fill="${COW}" ${soft(COW_LINE, 1.3)}/>
       <ellipse cx="196" cy="121" rx="10" ry="7" transform="rotate(54 196 121)" fill="#f0d2b4" ${soft(COW_LINE, 1)}/>
       <circle cx="194" cy="123" r="1.4" fill="${COW_LINE}"/>
       <circle cx="181" cy="102" r="2.2" fill="#2a1a12"/>
       <path d="M170 94 Q160 90 156 98 Q162 104 172 100 Z" fill="${COW_DARK}"/>
       <path d="M172 96 q-4 -10 2 -14 M178 92 q2 -10 8 -10" fill="none" stroke="#f0e4cc" stroke-width="3.2" stroke-linecap="round"/>`
    : `<path d="M150 52 C162 40 170 32 176 26 L190 36 C184 50 176 66 162 80 Z" fill="${COW}" ${soft(COW_LINE, 1.3)}/>
       <ellipse cx="186" cy="30" rx="19" ry="13.5" transform="rotate(24 186 30)" fill="${COW}" ${soft(COW_LINE, 1.3)}/>
       <ellipse cx="197" cy="38" rx="10" ry="7.4" transform="rotate(24 197 38)" fill="#f0d2b4" ${soft(COW_LINE, 1)}/>
       <circle cx="198" cy="37" r="1.4" fill="${COW_LINE}"/><circle cx="194" cy="41" r="1.2" fill="${COW_LINE}"/>
       <circle cx="186" cy="26" r="2.2" fill="#2a1a12"/>
       <path d="M172 22 Q162 22 160 30 Q168 34 176 30 Z" fill="${COW_DARK}"/>
       <path d="M176 20 q-4 -10 2 -14 M184 18 q2 -10 8 -10" fill="none" stroke="#f0e4cc" stroke-width="3.2" stroke-linecap="round"/>`;
  const bellX = grazing ? 160 : 160;
  const bellY = grazing ? 76 : 70;
  return `
    <path d="M60 52 C48 54 44 70 44 88" fill="none" stroke="${COW_DARK}" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M44 84 q-6 10 -2 18 q6 -2 6 -12 Z" fill="#3a2418"/>
    <path d="M62 98 L62 124 H74 L74 98 Z M122 98 L124 124 H136 L134 98 Z" fill="${COW_DARK}" ${soft(COW_LINE, 1.1)}/>
    <path d="M62 120 H74 V128 H62 Z M124 120 H136 V128 H124 Z" fill="#3a2a22"/>
    <path d="M92 40 C60 38 50 50 50 66 C50 82 60 96 78 98 H138 C152 98 160 86 160 68 C160 52 150 42 128 40 Z" fill="${COW}" ${soft(COW_LINE, 1.5)}/>
    <path d="M96 42 C70 42 56 52 54 66 C70 52 84 50 112 50 Z" fill="${COW_LIGHT}" opacity="0.75"/>
    <path d="M60 88 C84 98 130 100 156 88 C152 98 140 100 130 100 H80 C70 100 62 96 60 88 Z" fill="${COW_DARK}" opacity="0.45"/>
    <path d="M78 98 q4 8 10 0 M86 98 q4 8 10 0" fill="#e8a8a0" stroke="${COW_LINE}" stroke-width="0.8"/>
    <path d="M84 98 L84 126 H96 L96 98 Z M140 94 L142 126 H154 L152 92 Z" fill="${COW}" ${soft(COW_LINE, 1.2)}/>
    <path d="M84 122 H96 V130 H84 Z M142 122 H154 V130 H142 Z" fill="#3a2a22"/>
    <path d="M76 60 q10 -8 22 -6 M100 70 q8 4 18 0" fill="none" stroke="${COW_DARK}" stroke-width="2" opacity="0.4" stroke-linecap="round"/>
    ${head}
    <path d="M146 46 Q${bellX + 4} ${bellY - 6} ${bellX - 2} ${bellY + 2}" fill="none" stroke="#f0e0b8" stroke-width="4" stroke-linecap="round"/>
    <path d="M${bellX - 12} ${bellY + 4} Q${bellX - 12} ${bellY - 2} ${bellX} ${bellY - 2} Q${bellX + 12} ${bellY - 2} ${bellX + 12} ${bellY + 4} L${bellX + 15} ${bellY + 24} H${bellX - 15} Z" fill="${BRASS}" ${soft(BRASS_DARK, 1.4)}/>
    <path d="M${bellX - 9} ${bellY + 4} L${bellX - 11} ${bellY + 22}" stroke="#ffe9a0" stroke-width="2.4" stroke-linecap="round"/>
    <rect x="${bellX - 15}" y="${bellY + 22}" width="30" height="4" rx="1.4" fill="${BRASS_DARK}"/>
    <circle cx="${bellX}" cy="${bellY + 30}" r="3.2" fill="#6a4a1c"/>`;
}

// A few cows far away on a pasture mound.
function cowsFar() {
  const cow = (x, y, s, flip, grazing) => `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s}) translate(-105 -128)">${cowBody(grazing)}</g>`;
  return svgDoc(300, 110, `
    <path d="M0 108 C30 90 80 84 150 84 C220 84 270 90 300 108 Z" fill="#8cc65c" ${soft('#5a8e3c', 1.2)}/>
    <path d="M30 96 C70 88 230 88 270 96" fill="none" stroke="#c4e88a" stroke-width="3" opacity="0.8"/>
    ${cow(80, 100, 0.5, false, true)}${cow(160, 94, 0.46, true, false)}${cow(236, 102, 0.5, false, true)}
    ${[[20, 104, '#ffffff'], [118, 102, '#f6d84a'], [200, 100, '#b4c8f0'], [282, 104, '#ffffff'], [60, 106, '#f2788a']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="2.2" fill="${c}"/>`).join('')}
    ${groundShadow(150, 106, 120, 0.15)}`);
}

// Two hikers with rucksacks on a path over a grassy rise, far away.
function hikers() {
  const person = (x, y, shirt, hat, flip) => `<g transform="translate(${x} ${y}) scale(${flip ? -1 : 1} 1)">
    <path d="M0 -14 L-4 0 M0 -14 L5 0" stroke="#4a5a78" stroke-width="3.2" stroke-linecap="round"/>
    <rect x="-5" y="-30" width="10" height="17" rx="3" fill="${shirt}" ${soft('#3a3a4a', 0.8)}/>
    <rect x="-9" y="-29" width="6" height="14" rx="2.4" fill="#c0603a" ${soft('#6a301c', 0.8)}/>
    <circle cx="1" cy="-36" r="4.4" fill="#e8b890"/>
    <path d="M-4 -37 H7 L5 -42 H-2 Z" fill="${hat}"/>
    <path d="M6 -26 L12 -6" stroke="#8a5a34" stroke-width="1.6" stroke-linecap="round"/>
  </g>`;
  return svgDoc(150, 100, `
    <path d="M0 98 C14 62 60 44 96 52 C124 58 140 76 150 98 Z" fill="#8cc65c" ${soft('#5a8e3c', 1.2)}/>
    <path d="M30 98 C44 78 66 66 88 66 C106 66 116 76 124 98 Z" fill="#7ab648" opacity="0.8"/>
    <path d="M18 96 C36 78 58 66 84 62 C100 60 112 62 126 70" fill="none" stroke="#e6d4a4" stroke-width="6" stroke-linecap="round"/>
    ${person(54, 76, '#3d84c6', '#c83a3a', false)}${person(82, 66, '#e0a82a', '#3a6a3a', false)}
    ${groundShadow(75, 96, 66, 0.15)}`);
}

// ---- Mid: cows, spruce, hay rack, shrine, trough, woodpile, mountain pines ----

// A brown cow with a big bell, grazing. Soft outline, stands a little off the ground line.
function cowGrazing() {
  return svgDoc(210, 140, `${cowBody(true)}${groundShadow(106, 130, 74, 0.18)}`);
}

// A brown cow with a big bell, head up.
function cowLooking() {
  return svgDoc(220, 140, `${cowBody(false)}${groundShadow(106, 130, 74, 0.18)}`);
}

// A big old spruce of the mountain forest.
function firBig() {
  return svgDoc(150, 300, `${fir(75, 294, 288, 140, FIR, 7)}${groundShadow(75, 294, 42)}`);
}

// A wooden hay rack: posts and rails with hay hung to dry, a little board roof on top. It is tall
// and pale gold, so nobody takes it for something to jump over.
function hayRack() {
  const W = 200;
  const H = 210;
  const hay = (x, y, w, i) => {
    const strands = [];
    for (let k = 0; k < 7; k++) strands.push(`M${f1(x + 6 + k * (w - 12) / 6)} ${y + 2} q${(k % 2 ? 2 : -2)} 10 ${(k % 2 ? -1 : 2)} ${14 + (k * i) % 9}`);
    return `<path d="M${x} ${y} C${x + 4} ${y - 8} ${x + w - 4} ${y - 8} ${x + w} ${y} C${x + w + 4} ${y + 12} ${x + w - 8} ${y + 26} ${x + w - 14} ${y + 28} Q${x + w / 2} ${y + 34} ${x + 14} ${y + 28} C${x + 2} ${y + 24} ${x - 4} ${y + 10} ${x} ${y} Z" fill="#e8cf7a" ${soft('#a8883a', 1.2)}/>
      <path d="M${x + 6} ${y - 2} C${x + w * 0.3} ${y - 8} ${x + w * 0.6} ${y - 8} ${x + w - 8} ${y - 2}" fill="none" stroke="#f6e6a0" stroke-width="3" opacity="0.9"/>
      <path d="${strands.join(' ')}" stroke="#b8963c" stroke-width="1.2" fill="none" opacity="0.7" stroke-linecap="round"/>`;
  };
  return svgDoc(W, H, `
    <path d="M28 ${H - 6} V22 M100 ${H - 6} V22 M172 ${H - 6} V22" stroke="${WOOD_LINE}" stroke-width="9" stroke-linecap="round"/>
    <path d="M28 ${H - 6} V22 M100 ${H - 6} V22 M172 ${H - 6} V22" stroke="${WOOD}" stroke-width="6" stroke-linecap="round"/>
    <path d="M26 ${H - 10} V30 M98 ${H - 10} V30 M170 ${H - 10} V30" stroke="${WOOD_LIGHT}" stroke-width="1.6" opacity="0.8"/>
    ${[56, 98, 140, 182].map((y) => `<path d="M20 ${y} H180" stroke="${WOOD_LINE}" stroke-width="7" stroke-linecap="round"/><path d="M20 ${y} H180" stroke="${WOOD_LIGHT}" stroke-width="4.4" stroke-linecap="round"/>`).join('')}
    ${hay(24, 52, 66, 1)}${hay(106, 52, 66, 2)}${hay(24, 94, 66, 3)}${hay(106, 94, 66, 4)}${hay(24, 136, 66, 5)}${hay(106, 136, 66, 6)}
    <path d="M8 26 L100 4 L192 26 Z" fill="${SHINGLE}" ${soft(SHINGLE_LINE, 1.4)}/>
    <path d="M8 26 L100 4 L100 26 Z" fill="${SHINGLE_LIGHT}" opacity="0.5"/>
    <path d="M30 22 L100 8 L170 22" fill="none" stroke="${SHINGLE_LINE}" stroke-width="1" opacity="0.5"/>
    ${[[16, H - 6, '#ffffff'], [60, H - 4, '#f6d84a'], [150, H - 5, '#b4c8f0'], [186, H - 6, '#f2788a']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${c}"/>`).join('')}
    ${groundShadow(100, H - 4, 92, 0.16)}`);
}

// A wayside shrine (Marterl): a slim wooden post with a little roofed box holding a crucifix.
function shrine() {
  const W = 90;
  const H = 210;
  return svgDoc(W, H, `
    <rect x="38" y="76" width="14" height="${H - 80}" fill="${WOOD}" ${soft(WOOD_LINE, 1.4)}/>
    <rect x="38" y="76" width="5" height="${H - 80}" fill="${WOOD_LIGHT}" opacity="0.7"/>
    <rect x="18" y="38" width="54" height="44" fill="${WOOD_DARK}" ${soft(WOOD_LINE, 1.5)}/>
    <path d="${arch(26, 44, 38, 38)}" fill="#3a2a22" ${soft(WOOD_LINE, 1)}/>
    <path d="${arch(28, 46, 34, 36)}" fill="#e8dcc4" opacity="0.18"/>
    <path d="M45 52 V76 M38 58 H52" stroke="${GOLD}" stroke-width="3.4" stroke-linecap="round"/>
    <circle cx="45" cy="52" r="2.2" fill="#e8b890"/>
    <path d="M10 42 L45 12 L80 42 Z" fill="${SHINGLE}" ${soft(SHINGLE_LINE, 1.5)}/>
    <path d="M10 42 L45 12 L45 42 Z" fill="${SHINGLE_LIGHT}" opacity="0.5"/>
    <path d="M45 12 V4 M41 8 H49" stroke="${GOLD_LINE}" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M32 ${H - 4} q-8 -10 -6 -22 M58 ${H - 4} q8 -10 6 -22" fill="none" stroke="#6aa650" stroke-width="3" stroke-linecap="round"/>
    ${[[26, H - 28, '#e5484d'], [64, H - 28, '#ffffff'], [20, H - 10, '#f6d84a'], [70, H - 8, '#b4c8f0'], [45, H - 6, '#f2788a']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="3.4" fill="${c}"/>`).join('')}
    ${groundShadow(45, H - 3, 30, 0.18)}`);
}

// A wooden water trough: a hollowed log with a spout from a roofed post, water splashing in.
function trough() {
  const W = 230;
  const H = 180;
  return svgDoc(W, H, `
    <rect x="26" y="40" width="14" height="${H - 44}" fill="${WOOD}" ${soft(WOOD_LINE, 1.4)}/>
    <rect x="26" y="40" width="5" height="${H - 44}" fill="${WOOD_LIGHT}" opacity="0.7"/>
    <path d="M12 44 L33 18 L54 44 Z" fill="${SHINGLE}" ${soft(SHINGLE_LINE, 1.4)}/>
    <path d="M12 44 L33 18 L33 44 Z" fill="${SHINGLE_LIGHT}" opacity="0.5"/>
    <path d="M40 78 H78 Q84 78 84 84 V88 H40 Z" fill="${WOOD_DARK}" ${soft(WOOD_LINE, 1.3)}/>
    <path d="M82 88 C84 108 82 118 80 128" fill="none" stroke="#9fd8f0" stroke-width="5" stroke-linecap="round"/>
    <path d="M85 92 C86 108 85 116 84 126" fill="none" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" opacity="0.8"/>
    <rect x="58" y="${H - 18}" width="22" height="14" fill="${STONE}" ${soft(STONE_LINE, 1.1)}/><rect x="170" y="${H - 18}" width="22" height="14" fill="${STONE}" ${soft(STONE_LINE, 1.1)}/>
    <path d="M52 124 H206 Q210 124 210 130 V150 Q210 160 200 160 H62 Q52 160 52 150 Z" fill="${WOOD}" ${soft(WOOD_LINE, 1.6)}/>
    <path d="M52 134 H210 M52 146 H210" stroke="${WOOD_LINE}" stroke-width="1.2" opacity="0.5"/>
    <path d="M52 124 H206 Q210 124 210 130 V136 H52 Z" fill="${WOOD_LIGHT}" opacity="0.7"/>
    <ellipse cx="131" cy="126" rx="74" ry="5" fill="#8fd0ec" ${soft('#4a8aa8', 1)}/>
    <path d="M74 126 q10 -3 20 0 M120 128 q12 -3 24 0 M160 125 q10 -3 20 0" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" opacity="0.85"/>
    <ellipse cx="82" cy="126" rx="8" ry="2.6" fill="#ffffff" opacity="0.8"/>
    <ellipse cx="206" cy="142" rx="4" ry="12" fill="#c89a62" ${soft(WOOD_LINE, 1)}/>
    <path d="M206 134 a8 8 0 1 0 0.1 0 M206 138 a4 4 0 1 0 0.1 0" fill="none" stroke="${WOOD_LINE}" stroke-width="0.8" opacity="0.6"/>
    <path d="M44 ${H - 4} q-6 -10 -2 -18 M216 ${H - 4} q6 -10 2 -16" fill="none" stroke="#6aa650" stroke-width="3" stroke-linecap="round"/>
    ${[[40, H - 5, '#ffffff'], [150, H - 3, '#b4c8f0'], [214, H - 4, '#f6d84a'], [16, H - 4, '#f2788a']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${c}"/>`).join('')}
    ${groundShadow(115, H - 3, 104, 0.18)}`);
}

// A stack of firewood against the wall of a little shed with an overhanging shingle roof. It rises
// to the roof, like part of the building, so it is not a low thing to jump over.
function woodpile() {
  const W = 190;
  const H = 190;
  const logs = [];
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 12; col++) {
      const x = 22 + col * 12.4 + (row % 2) * 6;
      if (x > W - 28) continue;
      const y = H - 14 - row * 11.2;
      const c = ['#d6a874', '#c89a62', '#dcb482', '#caa070'][(row * 5 + col * 3) % 4];
      logs.push(`<circle cx="${f1(x)}" cy="${f1(y)}" r="6.4" fill="${c}" ${soft(WOOD_LINE, 1)}/><circle cx="${f1(x)}" cy="${f1(y)}" r="3.4" fill="none" stroke="#a8784a" stroke-width="0.9"/><circle cx="${f1(x)}" cy="${f1(y)}" r="1" fill="#8a5e38"/>`);
    }
  }
  const planks = [];
  for (let x = 10; x < W - 8; x += 12) planks.push(`M${x} 30 V${H - 6}`);
  return svgDoc(W, H, `
    <rect x="8" y="28" width="${W - 16}" height="${H - 32}" fill="#8a6038" ${soft(WOOD_LINE, 1.4)}/>
    <path d="${planks.join(' ')}" stroke="${WOOD_LINE}" stroke-width="1.2" opacity="0.6"/>
    <path d="M2 34 L22 8 H${W - 22} L${W - 2} 34 Z" fill="${SHINGLE}" ${soft(SHINGLE_LINE, 1.5)}/>
    <path d="M2 34 L22 8 H70 L56 34 Z" fill="${SHINGLE_LIGHT}" opacity="0.5"/>
    <path d="M10 22 H${W - 10} M6 28 H${W - 6}" stroke="${SHINGLE_LINE}" stroke-width="1" opacity="0.5"/>
    <path d="M4 36 H${W - 4} V44 H4 Z" fill="#000000" opacity="0.15"/>
    <path d="M16 ${H - 4} V70 M${W - 16} ${H - 4} V70" stroke="${WOOD_DARK}" stroke-width="5" stroke-linecap="round"/>
    ${logs.join('')}
    ${groundShadow(W / 2, H - 3, 86, 0.18)}`);
}

// A weathered rock outcrop with moss and a little snow in the cracks, flowers in the grass at its foot.
// Far layer only and drawn small, so it never stands at the ground line next to Frankie.
function boulders() {
  const W = 280;
  const H = 200;
  return svgDoc(W, H, `
    <path d="M60 ${H - 4} L52 120 L78 70 L118 44 L170 40 L208 66 L232 108 L240 ${H - 4} Z" fill="${ROCK}" ${soft(ROCK_LINE, 1.6)}/>
    <path d="M60 ${H - 4} L52 120 L78 70 L118 44 L140 80 L112 130 L100 ${H - 4} Z" fill="${ROCK_LIGHT}" opacity="0.8"/>
    <path d="M170 40 L208 66 L232 108 L240 ${H - 4} L190 ${H - 4} L196 110 L150 76 Z" fill="${ROCK_DARK}" opacity="0.55"/>
    <path d="M118 44 L140 80 L150 76 L170 40 Z" fill="#ffffff" opacity="0.9"/>
    <path d="M86 66 q-8 12 4 18 q12 -2 16 -12 Z" fill="#ffffff" opacity="0.9"/>
    <path d="M140 80 L112 130 M150 76 L196 110 M96 100 L120 112 M180 120 L214 130" fill="none" stroke="${ROCK_LINE}" stroke-width="1.8" opacity="0.6"/>
    <path d="M66 ${H - 20} q16 -14 34 -4 q-10 8 -6 18 H66 Z M200 ${H - 30} q18 -12 38 0 l2 26 H196 Z" fill="#7fae55" opacity="0.9"/>
    <path d="M2 ${H - 4} L8 150 L34 124 L66 140 L84 ${H - 4} Z" fill="${ROCK}" ${soft(ROCK_LINE, 1.5)}/>
    <path d="M2 ${H - 4} L8 150 L34 124 L48 136 L40 ${H - 4} Z" fill="${ROCK_LIGHT}" opacity="0.8"/>
    <path d="M230 ${H - 4} L236 140 L262 128 L278 156 L276 ${H - 4} Z" fill="${ROCK}" ${soft(ROCK_LINE, 1.5)}/>
    <path d="M262 128 L278 156 L276 ${H - 4} L258 ${H - 4} Z" fill="${ROCK_DARK}" opacity="0.5"/>
    <path d="M22 ${H - 4} q-6 -12 0 -22 M120 ${H - 4} q-6 -10 0 -18 M226 ${H - 4} q8 -10 4 -22" fill="none" stroke="#6aa650" stroke-width="3" stroke-linecap="round"/>
    ${[[18, H - 6, '#ffffff'], [104, H - 6, '#b4c8f0'], [124, H - 4, '#ffffff'], [214, H - 6, '#f2788a'], [262, H - 5, '#f6d84a']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="2.8" fill="${c}"/>`).join('')}
    ${groundShadow(140, H - 3, 128, 0.2)}`);
}

// Mountain pine (Latsche): a low, wide cushion of dark needles with brown cones, on a stony foot.
function mountainPine() {
  const W = 220;
  const H = 150;
  const needles = [];
  for (let i = 0; i < 46; i++) {
    const x = 30 + rnd(i) * 160;
    const y = 36 + rnd(i + 30) * 80;
    needles.push(`M${f1(x)} ${f1(y)} l${f1(-5 + rnd(i + 2) * 10)} -7 M${f1(x)} ${f1(y)} l${f1(-6 + rnd(i + 4) * 12)} -5`);
  }
  return svgDoc(W, H, `
    <path d="M10 ${H - 4} L18 126 L44 116 L70 124 L90 ${H - 4} Z M150 ${H - 4} L160 122 L190 112 L212 124 L216 ${H - 4} Z" fill="${ROCK}" ${soft(ROCK_LINE, 1.3)}/>
    ${crown([[44, 100, 26], [84, 76, 36], [132, 70, 38], [176, 94, 30], [112, 108, 34], [64, 120, 24], [160, 122, 24]], PINE)}
    <path d="${needles.join(' ')}" stroke="#a8d4a0" stroke-width="1.2" stroke-linecap="round" opacity="0.7" fill="none"/>
    ${[[70, 98], [118, 86], [152, 108], [96, 118], [182, 98]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="4" ry="6" fill="#8a5a34" ${soft('#4a3020', 0.9)}/><path d="M${x - 3} ${y - 2} h6 M${x - 3} ${y + 2} h6" stroke="#4a3020" stroke-width="0.8"/>`).join('')}
    <path d="M60 ${H - 6} q8 -6 16 0 M180 ${H - 4} q8 -6 16 0" fill="none" stroke="#6aa650" stroke-width="3" stroke-linecap="round"/>
    ${groundShadow(110, H - 3, 96, 0.18)}`);
}

// ---- Near: small and pale flowers, a snow patch ----

// A flower stem with leaves, then the head from head().
const stem = (x, y, base, lean = 0) => `<path d="M${x - lean * 3} ${base} Q${x + lean} ${f1((y + base) / 2)} ${x} ${y}" fill="none" stroke="#6a9a48" stroke-width="2.2" stroke-linecap="round"/>`;
const leafPair = (x, y, c = '#7aae52') => `<path d="M${x} ${y} q-9 -3 -12 -10 q9 0 12 10 Z M${x} ${y} q9 -3 12 -10 q-9 0 -12 10 Z" fill="${c}" ${soft('#4a7a38', 0.7)}/>`;

// Blue gentian: deep blue stars on short stems.
function gentian() {
  const star = (x, y, r) => `${stem(x, y, 66, 1)}${leafPair(x, 58)}<path d="${[0, 72, 144, 216, 288].map((a) => `M${x} ${y} L${f1(x + Math.cos(((a - 26) * Math.PI) / 180) * r * 0.55)} ${f1(y + Math.sin(((a - 26) * Math.PI) / 180) * r * 0.55)} L${f1(x + Math.cos((a * Math.PI) / 180) * r)} ${f1(y + Math.sin((a * Math.PI) / 180) * r)} L${f1(x + Math.cos(((a + 26) * Math.PI) / 180) * r * 0.55)} ${f1(y + Math.sin(((a + 26) * Math.PI) / 180) * r * 0.55)} Z`).join(' ')}" fill="#3a5fd0" ${soft('#2a449a', 0.8)}/><circle cx="${x}" cy="${y}" r="${f1(r * 0.34)}" fill="#e8f0ff"/>`;
  return svgDoc(110, 72, `
    <path d="M4 68 Q24 56 44 66 Q68 54 106 68" fill="none" stroke="#7aa850" stroke-width="5" stroke-linecap="round"/>
    ${star(20, 40, 10)}${star(44, 28, 12)}${star(70, 36, 11)}${star(92, 44, 9)}
    ${[[30, 54], [58, 50], [80, 56]].map(([x, y]) => `<path d="M${x - 4} ${y + 4} Q${x} ${y - 6} ${x + 4} ${y + 4} Z" fill="#5b86e6"/>`).join('')}`);
}

// Edelweiss: woolly white stars with a yellow heart, grey-green felty leaves.
function edelweiss() {
  const bloom = (x, y, r) => `${stem(x, y, 64, 1)}
    <path d="M${x} 58 q-10 -2 -14 -9 q10 -1 14 9 Z M${x} 58 q10 -2 14 -9 q-10 -1 -14 9 Z" fill="#b8c8a8" ${soft('#7a8a6a', 0.7)}/>
    ${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<ellipse cx="${f1(x + Math.cos((a * Math.PI) / 180) * r * 0.62)}" cy="${f1(y + Math.sin((a * Math.PI) / 180) * r * 0.62)}" rx="${f1(r * 0.52)}" ry="${f1(r * 0.2)}" transform="rotate(${a} ${f1(x + Math.cos((a * Math.PI) / 180) * r * 0.62)} ${f1(y + Math.sin((a * Math.PI) / 180) * r * 0.62)})" fill="#f6f6ec" ${soft('#c8ccb8', 0.7)}/>`).join('')}
    <circle cx="${x}" cy="${y}" r="${f1(r * 0.3)}" fill="#f6d84a" ${soft('#b8981c', 0.6)}/>
    <circle cx="${x - 1.4}" cy="${y - 1}" r="1" fill="#8a7a28"/><circle cx="${x + 1.6}" cy="${y + 0.8}" r="1" fill="#8a7a28"/>`;
  return svgDoc(100, 70, `
    <path d="M4 66 Q22 58 40 65 Q62 56 96 66" fill="none" stroke="#8ab05c" stroke-width="5" stroke-linecap="round"/>
    ${bloom(24, 36, 14)}${bloom(52, 26, 16)}${bloom(78, 38, 13)}`);
}

// Alpine rose: a low shrub with dark leaves and clusters of pink-red flowers.
function alpenrose() {
  const cluster = (x, y) => [[0, 0], [-8, 5], [8, 5], [-3, 10], [5, 11]].map(([dx, dy], i) => `<circle cx="${x + dx}" cy="${y + dy}" r="${i === 0 ? 5 : 4.4}" fill="${i % 2 ? '#e8476a' : '#f27a95'}" ${soft('#a82848', 0.7)}/><circle cx="${x + dx}" cy="${y + dy}" r="1.4" fill="#fff0a0"/>`).join('');
  return svgDoc(130, 78, `
    <path d="M10 74 C16 54 40 44 66 46 C92 44 116 54 122 74 Z" fill="#3b7048" ${soft('#26503a', 1.2)}/>
    <path d="M18 72 C26 56 44 50 62 52 C54 58 40 62 30 72 Z" fill="#5a9566" opacity="0.8"/>
    ${[[30, 54], [58, 40], [86, 44], [104, 58], [72, 58]].map(([x, y]) => cluster(x, y)).join('')}
    <path d="M44 70 q4 -6 10 0 M88 72 q4 -6 10 0" fill="none" stroke="#6aa650" stroke-width="2.4" stroke-linecap="round"/>`);
}

// ---- Strip: a split-rail pasture fence ----

// Two rails and posts; the rails run to both edges at the same height, so the strip joins without a seam.
function fenceStrip() {
  const w = 156;
  const post = (x) => `<rect x="${x - 4}" y="20" width="8" height="46" rx="3" fill="${WOOD}" ${soft(WOOD_LINE, 1.2)}/><rect x="${x - 4}" y="20" width="3" height="46" fill="${WOOD_LIGHT}" opacity="0.7"/><path d="M${x - 4} 24 H${x + 4}" stroke="${WOOD_LINE}" stroke-width="1" opacity="0.5"/>`;
  const rail = (y) => `<rect x="-2" y="${y}" width="${w + 4}" height="7" rx="2" fill="${WOOD_LIGHT}" ${soft(WOOD_LINE, 1.1)}/><path d="M0 ${y + 2} H${w}" stroke="#e8c898" stroke-width="1.4" opacity="0.8"/><path d="M0 ${y + 5.2} H${w}" stroke="${WOOD_DARK}" stroke-width="1" opacity="0.4"/>`;
  const grass = [];
  for (let x = 6; x < w; x += 19) grass.push(`M${x} 68 q-2 -8 -5 -10 M${x + 3} 68 q1 -9 5 -12`);
  return svgDoc(w, 70, `
    ${post(39)}${post(117)}${rail(28)}${rail(46)}
    <path d="${grass.join(' ')}" stroke="#6aa650" stroke-width="2.4" fill="none" stroke-linecap="round"/>`);
}

// ---- All pieces ----

const PIECES = {
  'hills-far-alm': [GAME_WIDTH, 220, hillsFar],
  'hills-near-alm': [GAME_WIDTH, 140, hillsNear],
  'alm-chapel': [210, 250 + FOOT_GAP, chapel],
  'alm-hut': [310, 262 + FOOT_GAP, hut],
  'alm-summit': [300, 300 + FOOT_GAP, summitCross],
  'alm-gondola': [330, 290 + FOOT_GAP, gondola],
  'alm-zugspitze': [620, 330 + FOOT_GAP, zugspitze],
  'alm-fir': [90, 220, firTall],
  'alm-firs': [240, 180, firGroup],
  'alm-cows-far': [300, 110, cowsFar],
  'alm-hikers': [150, 100, hikers],
  'alm-cow': [210, 140, cowGrazing],
  'alm-cow-bell': [220, 140, cowLooking],
  'alm-fir-big': [150, 300, firBig],
  'alm-hay-rack': [200, 210, hayRack],
  'alm-shrine': [90, 210, shrine],
  'alm-trough': [230, 180, trough],
  'alm-woodpile': [190, 190, woodpile],
  'alm-boulders': [168, 120, boulders], // small, far layer only
  'alm-pine': [220, 150, mountainPine],
  'alm-gentian': [110, 72, gentian],
  'alm-edelweiss': [100, 70, edelweiss],
  'alm-alpenrose': [130, 78, alpenrose],
  'alm-strip-fence': [156, 70, fenceStrip],
};

export function almSvgs() {
  return Object.fromEntries(Object.entries(PIECES).map(([key, [w, h, draw]]) => [key, { w, h, svg: draw() }]));
}

export function preloadAlm(scene) {
  for (const [key, { w, h, svg }] of Object.entries(almSvgs())) loadSvg(scene, key, svg, w, h);
}
