import { GAME_WIDTH } from '../config.js';
import { loadSvg, svgDoc } from './svg.js';
import { attrs, crown, ridge, ridgeY } from './scenery.js';
import { fir, FIR, FIR_PALE } from './koenigssee.js';

// Level 14, Neuschwanstein (grown-ups, only loaded after the pretzel button): a golden autumn afternoon
// in the Allgäu below the fairy-tale castle. Zone 1 is the mountain forest of the Pöllat gorge with
// Hohenschwangau on its hill, zone 2 the view from the Marienbrücke with Neuschwanstein itself, zone 3
// the Alpsee and Schwansee with the castle far behind the lake.
// Everything here is background: soft outlines, never the strong OUTLINE. Tall things (trees, gorge
// wall, lanterns, banner) sit in the mid layer; the near layer holds only small pale plants. Water is
// drawn only in far pieces and high up, so nothing flat, oval and blue ever lies on the ground line
// (it would look like the puddle obstacle).

const f1 = (n) => n.toFixed(1);
const polygon = (pts, w, h) => `M0 ${h} ${pts.map(([x, y]) => `L${f1(x)} ${f1(y)}`).join(' ')} L${w} ${h} Z`;
const rnd = (n) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

// The meadow of hills-far-neuschwanstein starts at y 128. Far pictures sit at GROUND_Y - 45 with scale
// ~0.56, so this much empty space below their foot puts the foot on that line.
const MEADOW = 128;
const FOOT_GAP = 111;

const WOOD = '#a9784a';
const WOOD_LIGHT = '#caa070';
const WOOD_DARK = '#7a5232';
const WOOD_LINE = '#5a3a22';
const STONE = '#c4bca8';
const STONE_LIGHT = '#ddd6c4';
const STONE_SHADE = '#a39a84';
const STONE_LINE = '#7b705c';
const ROCK = '#b7ae9c';
const ROCK_LIGHT = '#d8cfbb';
const ROCK_DARK = '#8b8272';
const ROCK_LINE = '#5f574a';
const MOSS = '#7fa24a';
const MOSS_LIGHT = '#a9c868';
const WALL = '#f7f1e3';
const WALL_LIGHT = '#fff6dc';
const WALL_SHADE = '#ddd2ba';
const WALL_LINE = '#a39580';
const SLATE = '#5f7596';
const SLATE_LIGHT = '#8aa0c0';
const SLATE_DARK = '#44567a';
const SLATE_LINE = '#2f3e5c';
const WINDOW = '#6f87a8';
const GOLD = '#f2b83c';
const GOLD_LINE = '#9a6e1c';
const YELLOW = '#efc766';
const YELLOW_LIGHT = '#fbe39a';
const YELLOW_SHADE = '#d3a547';
const YELLOW_LINE = '#8f6c26';
const IRON = '#3a4a46';
const IRON_LIGHT = '#6a7e78';

// Autumn crowns (crown() palettes) and bark.
const MAPLE = { line: '#8a3a18', base: '#d9602c', shade: '#b5461f', light: '#f2923f', dots: '#ffc860' };
const MAPLE_GOLD = { line: '#94601a', base: '#e9a22e', shade: '#c78322', light: '#f7c853', dots: '#ffe58a' };
const BEECH_GOLD = { line: '#8a6a1c', base: '#dfb340', shade: '#c2922a', light: '#f2d36c', dots: '#fff0a8' };
const BEECH_GREEN = { line: '#4a6a2a', base: '#7fa840', shade: '#678f34', light: '#a4c85c', dots: '#cfe88a' };
const RUST = { line: '#7a3a1c', base: '#c4572a', shade: '#9f4220', light: '#e08040', dots: '#ffb060' };
const LARCH = { line: '#8a6a1e', base: '#e0a834', shade: '#c0881f', light: '#f5cd62' };
const BARK_GREY = { fill: '#9a9488', light: '#c4bfb2', line: '#5e5a50', branch: '#7a766a' };
const BARK_DARK = { fill: '#7a5a46', light: '#a8846a', line: '#4a3226', branch: '#5e4434' };
const LEAF_COLORS = ['#d9602c', '#e9a22e', '#f2c04a', '#c4572a', '#e8842c'];

// ---- Small helpers ----

const soft = (color, w = 1.5) => attrs(color, w);

// Soft ground shadow under a piece.
const groundShadow = (cx, y, rx, o = 0.2) => `<ellipse cx="${cx}" cy="${y}" rx="${rx}" ry="${f1(Math.min(rx * 0.1, 6))}" fill="#5a4a22" opacity="${o}"/>`;

// A round-arched window or door w wide, from its top at y down to y + h.
const arch = (x, y, w, h) => `M${f1(x)} ${f1(y + h)} V${f1(y + w / 2)} A${f1(w / 2)} ${f1(w / 2)} 0 0 1 ${f1(x + w)} ${f1(y + w / 2)} V${f1(y + h)} Z`;
// A pointed (gothic) window.
const gothic = (x, y, w, h) => `M${f1(x)} ${f1(y + h)} V${f1(y + w * 0.7)} Q${f1(x)} ${f1(y + w * 0.2)} ${f1(x + w / 2)} ${f1(y)} Q${f1(x + w)} ${f1(y + w * 0.2)} ${f1(x + w)} ${f1(y + w * 0.7)} V${f1(y + h)} Z`;

// Mirrors a drawing at x - 960, x and x + 960 where it shows, so a tile repeats cleanly.
const wrapped = (cx, half, fn) => [-GAME_WIDTH, 0, GAME_WIDTH].filter((o) => cx + o + half > 0 && cx + o - half < GAME_WIDTH).map((o) => fn(cx + o)).join('');

// One falling leaf (a pointed oval) at (x, y).
const leaf = (x, y, r, rot, color) => `<path d="M0 ${f1(-r)} C${f1(r * 0.9)} ${f1(-r * 0.3)} ${f1(r * 0.7)} ${f1(r * 0.7)} 0 ${f1(r)} C${f1(-r * 0.7)} ${f1(r * 0.7)} ${f1(-r * 0.9)} ${f1(-r * 0.3)} 0 ${f1(-r)} Z" transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)})" fill="${color}"/>`;

// n leaves drifting in the box (x0, y0, w, h).
const drift = (x0, y0, w, h, n, seed, colors = LEAF_COLORS) =>
  Array.from({ length: n }, (_, i) => leaf(x0 + rnd(seed + i) * w, y0 + rnd(seed + i + 50) * h, 3 + rnd(seed + i + 90) * 2.2, rnd(seed + i + 20) * 360, colors[i % colors.length])).join('');

// A broad-leaved tree: trunk with a flared foot, a round crown. base is the foot of the trunk.
function broadleaf(cx, base, h, w, c = BEECH_GOLD, bark = BARK_GREY) {
  const th = h * 0.5;
  const tw = w * 0.07;
  const r = w * 0.28;
  const cy = base - h + r * 1.75;
  return `<path d="M${f1(cx - tw * 2.1)} ${f1(base)} Q${f1(cx - tw * 0.7)} ${f1(base - 8)} ${f1(cx - tw)} ${f1(base - th)} L${f1(cx + tw)} ${f1(base - th)} Q${f1(cx + tw * 0.7)} ${f1(base - 8)} ${f1(cx + tw * 2.1)} ${f1(base)} Z" fill="${bark.fill}" ${soft(bark.line, 1.3)}/>
    <path d="M${f1(cx - tw * 1.8)} ${f1(base)} Q${f1(cx - tw * 0.6)} ${f1(base - 8)} ${f1(cx - tw * 0.8)} ${f1(base - th)} L${f1(cx - tw * 0.1)} ${f1(base - th)} Q${f1(cx - tw * 0.2)} ${f1(base - 8)} ${f1(cx - tw * 0.2)} ${f1(base)} Z" fill="${bark.light}" opacity="0.7"/>
    <path d="M${f1(cx)} ${f1(base - th)} L${f1(cx - r * 0.9)} ${f1(cy + r * 0.5)} M${f1(cx)} ${f1(base - th)} L${f1(cx + r * 0.8)} ${f1(cy + r * 0.3)}" stroke="${bark.branch}" stroke-width="${f1(tw * 0.8)}" stroke-linecap="round" fill="none"/>
    ${crown([[cx - r * 1.1, cy + r * 0.45, r * 0.78], [cx + r * 1.05, cy + r * 0.4, r * 0.8], [cx, cy + r * 0.2, r * 1.05], [cx - r * 0.55, cy - r * 0.5, r * 0.85], [cx + r * 0.6, cy - r * 0.45, r * 0.85], [cx, cy - r * 0.95, r * 0.7]], c)}`;
}

// A maple: dark-brown trunk, a wide crown in two autumn colours (the lower and outer lumps are redder).
function maple(cx, base, h, w, c = MAPLE, c2 = MAPLE_GOLD) {
  const th = h * 0.46;
  const tw = w * 0.05;
  const r = w * 0.26;
  const cy = base - h + r * 1.8;
  return `<path d="M${f1(cx - tw * 2.4)} ${f1(base)} Q${f1(cx - tw * 0.6)} ${f1(base - 10)} ${f1(cx - tw)} ${f1(base - th)} L${f1(cx + tw)} ${f1(base - th)} Q${f1(cx + tw * 0.6)} ${f1(base - 10)} ${f1(cx + tw * 2.4)} ${f1(base)} Z" fill="${BARK_DARK.fill}" ${soft(BARK_DARK.line, 1.3)}/>
    <path d="M${f1(cx)} ${f1(base - th)} L${f1(cx - r * 1.2)} ${f1(cy + r * 0.6)} M${f1(cx)} ${f1(base - th)} L${f1(cx + r * 1.2)} ${f1(cy + r * 0.5)}" stroke="${BARK_DARK.branch}" stroke-width="${f1(tw * 0.9)}" stroke-linecap="round" fill="none"/>
    ${crown([[cx - r * 1.25, cy + r * 0.55, r * 0.72], [cx + r * 1.25, cy + r * 0.5, r * 0.74]], c)}
    ${crown([[cx, cy + r * 0.3, r * 1.05], [cx - r * 0.65, cy - r * 0.45, r * 0.85], [cx + r * 0.7, cy - r * 0.4, r * 0.85], [cx + r * 0.05, cy - r * 1.0, r * 0.7]], c2)}`;
}

// A fern frond rising from (x, y), len long, its tip leaning by `lean`: a curved stem with pairs of leaflets.
function frond(x, y, len, lean, color) {
  const cx = x + lean * 0.2;
  const cy = y - len * 0.7;
  const ex = x + lean;
  const ey = y - len;
  const at = (t) => [(1 - t) ** 2 * x + 2 * (1 - t) * t * cx + t * t * ex, (1 - t) ** 2 * y + 2 * (1 - t) * t * cy + t * t * ey];
  const leaves = [];
  for (let t = 0.16; t < 0.98; t += 0.07) {
    const [px, py] = at(t);
    const [qx, qy] = at(t + 0.02);
    const tl = Math.hypot(qx - px, qy - py) || 1;
    const nx = -(qy - py) / tl;
    const ny = (qx - px) / tl;
    const L = 3 + len * 0.15 * Math.sin(Math.PI * (0.15 + 0.85 * (1 - t)) * 0.9);
    leaves.push(`M${f1(px)} ${f1(py)} l${f1(nx * L + ((qx - px) / tl) * L * 0.7)} ${f1(ny * L + ((qy - py) / tl) * L * 0.7)} M${f1(px)} ${f1(py)} l${f1(-nx * L + ((qx - px) / tl) * L * 0.7)} ${f1(-ny * L + ((qy - py) / tl) * L * 0.7)}`);
  }
  return `<path d="M${f1(x)} ${f1(y)} Q${f1(cx)} ${f1(cy)} ${f1(ex)} ${f1(ey)}" stroke="#8a6a38" stroke-width="2" fill="none" stroke-linecap="round"/><path d="${leaves.join(' ')}" stroke="${color}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
}

// A fan of fern fronds standing at (cx, y); colours run from green to copper, s scales the length.
function ferns(cx, y, s = 1, tones = ['#7ea244', '#b69a3c', '#c9843a']) {
  return [[-1, -34, 20], [-0.6, -22, 34], [-0.2, -8, 42], [0.2, 8, 40], [0.6, 22, 32], [1, 34, 18]]
    .map(([o, lean, len], i) => frond(cx + o * 7 * s, y, len * s, lean * s, tones[i % tones.length]))
    .join('');
}

// A mossy rock mass, x..x+w wide, top at y, standing on `base`; the moss cap hangs over the grey rock.
function mossRock(x, y, w, base, flip = false) {
  const m = flip ? -1 : 1;
  const px = (v) => (flip ? x + w - v : x + v);
  return `<path d="M${f1(px(0))} ${base} L${f1(px(0))} ${y + 40} Q${f1(px(w * 0.1))} ${y + 4} ${f1(px(w * 0.45))} ${y} Q${f1(px(w * 0.85))} ${y - 4} ${f1(px(w))} ${y + 30} L${f1(px(w * 0.96))} ${base} Z" fill="${ROCK}" ${soft(ROCK_LINE, 1.4)}/>
    <path d="M${f1(px(w * 0.04))} ${base} L${f1(px(w * 0.02))} ${y + 40} Q${f1(px(w * 0.12))} ${y + 8} ${f1(px(w * 0.4))} ${y + 4} L${f1(px(w * 0.3))} ${f1(y + 60)} L${f1(px(w * 0.34))} ${base} Z" fill="${ROCK_LIGHT}" opacity="0.7"/>
    <path d="M${f1(px(w * 0.9))} ${base} L${f1(px(w * 0.96))} ${y + 40} L${f1(px(w))} ${y + 30} L${f1(px(w * 0.96))} ${base} Z" fill="${ROCK_DARK}" opacity="0.6"/>
    <path d="M${f1(px(0))} ${y + 40} Q${f1(px(w * 0.1))} ${y + 4} ${f1(px(w * 0.45))} ${y} Q${f1(px(w * 0.85))} ${y - 4} ${f1(px(w))} ${y + 30} Q${f1(px(w * 0.9))} ${y + 38} ${f1(px(w * 0.8))} ${y + 26} Q${f1(px(w * 0.64))} ${y + 40} ${f1(px(w * 0.5))} ${y + 24} Q${f1(px(w * 0.3))} ${y + 40} ${f1(px(w * 0.18))} ${y + 28} Q${f1(px(w * 0.06))} ${y + 44} ${f1(px(0))} ${y + 40} Z" fill="${MOSS}" ${soft('#3f6a30', 1.2)}/>
    <path d="M${f1(px(w * 0.12))} ${y + 14} Q${f1(px(w * 0.4))} ${y + 4} ${f1(px(w * 0.7))} ${y + 8}" fill="none" stroke="${MOSS_LIGHT}" stroke-width="3" opacity="0.8" stroke-linecap="round"/>
    <path d="M${f1(px(w * 0.5))} ${y + 50} l${m * -8} 26 l${m * 6} 24 M${f1(px(w * 0.7))} ${y + 44} l${m * 4} 30" stroke="${ROCK_LINE}" stroke-width="1.6" opacity="0.5" fill="none"/>`;
}

// ---- Background tiles ----

// A mountain ridge made of sharp peaks and rounded valleys that repeats every `w` px: each component is
// [amplitude, peaks per tile, phase, sharpness]. Sampled from -w to 2w so shading can cross the tile edge.
function mountain(w, base, comps) {
  const pts = [];
  for (let x = -w; x <= 2 * w; x += 4) {
    let y = base;
    for (const [amp, k, ph, p] of comps) y -= amp * (1 - Math.abs(Math.sin((Math.PI * k * x) / w + ph))) ** p;
    pts.push([x, y]);
  }
  return pts;
}

// Lit and shaded faces of a ridge made by mountain(): the light comes from the right (the game's sun).
function facets(pts, floorY, shade, light) {
  const out = [];
  for (let i = 6; i < pts.length - 6; i++) {
    const [px, py] = pts[i];
    if (px < -50 || px > GAME_WIDTH + 50) continue;
    let peak = true;
    for (let d = 1; d <= 6; d++) if (pts[i - d][1] < py || pts[i + d][1] < py) peak = false;
    if (!peak) continue;
    let j = i;
    while (j > 0 && pts[j - 1][1] >= pts[j][1]) j--;
    let k = i;
    while (k < pts.length - 1 && pts[k + 1][1] >= pts[k][1]) k++;
    const left = pts.slice(j, i + 1);
    const right = pts.slice(i, k + 1);
    out.push(`<path d="M${left.map(([x, y]) => `${f1(x)} ${f1(y)}`).join(' L')} L${f1(px + 24)} ${floorY} L${f1(pts[j][0])} ${floorY} Z" fill="${shade}" opacity="0.32"/>`);
    out.push(`<path d="M${right.map(([x, y]) => `${f1(x)} ${f1(y)}`).join(' L')} L${f1(pts[k][0])} ${floorY} L${f1(px + 24)} ${floorY} Z" fill="${light}" opacity="0.26"/>`);
  }
  return out.join('');
}

// Early snow on the highest peaks: warm white on the lit side, bluish on the shaded one.
function snowCaps(pts, maxY) {
  const out = [];
  for (let i = 6; i < pts.length - 6; i++) {
    const [px, py] = pts[i];
    if (px < -40 || px > GAME_WIDTH + 40 || py > maxY) continue;
    let peak = true;
    for (let d = 1; d <= 6; d++) if (pts[i - d][1] < py || pts[i + d][1] < py) peak = false;
    if (!peak) continue;
    const band = pts.filter(([x, y]) => Math.abs(x - px) <= 30 && y < py + 20);
    const cap = (sel, fill) => {
      const part = band.filter(([x]) => sel(x));
      if (part.length < 2) return '';
      const low = part.map(([x, y], n) => [x, y + 7 + ((n * 5) % 4) * 3]).reverse();
      return `<path d="M${part.map(([x, y]) => `${f1(x)} ${f1(y)}`).join(' L')} L${low.map(([x, y]) => `${f1(x)} ${f1(y)}`).join(' L')} Z" fill="${fill}"/>`;
    };
    out.push(cap((x) => x <= px, '#d6d8ee'), cap((x) => x >= px, '#fff8ee'));
  }
  return out.join('');
}

// Far away: the Allgäu Alps (Säuling and Tegelberg country) in soft violet-blue with the first snow,
// golden light on their right faces, a belt of autumn forest and a yellowing meadow below.
function hillsFar() {
  const w = GAME_WIDTH;
  const back = mountain(w, 146, [[84, 3, 0.7, 1.15], [64, 4, 2.3, 1.1], [28, 9, 1.1, 1], [8, 21, 0.3, 1]]);
  const mid = mountain(w, 150, [[56, 5, 1.4, 1.2], [32, 8, 0.4, 1.1], [9, 17, 2, 1]]);
  const range = (pts) => `M${f1(pts[0][0])} 230 L${pts.map(([x, y]) => `${f1(x)} ${f1(y)}`).join(' L')} L${f1(pts[pts.length - 1][0])} 230 Z`;
  const belt = ridge(w, 112, [[8, 2, 0.5], [5, 5, 1.1], [2.5, 11, 0.2]]);
  const N = 87;
  const crowns = [];
  const tones = ['#d9892e', '#e9b43c', '#c4572a', '#7da044', '#f0c85a', '#e2a23a', '#6a9040'];
  for (let i = 0; i <= N; i++) {
    const x = (i * w) / N;
    const k = i % N;
    const y = ridgeY(belt, x) + 3 + rnd(k) * 9;
    const r = 6.5 + rnd(k + 9) * 4.5;
    crowns.push(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="${tones[k % tones.length]}"/><circle cx="${f1(x - 2)}" cy="${f1(y - 2.5)}" r="${f1(r * 0.5)}" fill="#ffffff" opacity="0.18"/>`);
    if (rnd(k + 31) > 0.62) crowns.push(fir(x + 3, y + 8, 28 + rnd(k + 5) * 10, 14, k % 2 ? FIR_PALE : FIR, 3));
  }
  const meadow = ridge(w, MEADOW, [[2, 4, 0.3], [1.5, 9, 1]]);
  // A few tiny farmhouses on the meadow.
  const houses = [150, 395, 640, 860].map((x, i) => {
    const y = 138 + (i % 2) * 5;
    return `<rect x="${x - 7}" y="${y - 8}" width="14" height="8" fill="#f6efe0" ${soft('#a39580', 0.8)}/><path d="M${x - 9} ${y - 7} L${x} ${y - 15} L${x + 9} ${y - 7} Z" fill="#a9604a" ${soft('#6a3a2a', 0.8)}/>`;
  }).join('');
  const grass = [];
  for (let i = 0; i < 40; i++) grass.push(`M${(i * 241) % w} ${MEADOW + 8 + ((i * 37) % 70)} h${8 + (i % 4) * 5}`);
  return svgDoc(w, 220, `
    <defs>
      <linearGradient id="b1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b6b3d8"/><stop offset="0.6" stop-color="#cdbfd2"/><stop offset="1" stop-color="#e8d2bc"/></linearGradient>
      <linearGradient id="b2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8d9fbc"/><stop offset="1" stop-color="#b3b0b0"/></linearGradient>
      <linearGradient id="ml" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d4c866"/><stop offset="1" stop-color="#a8b254"/></linearGradient>
      <linearGradient id="ms" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6e2bc" stop-opacity="0"/><stop offset="0.55" stop-color="#f6e2bc" stop-opacity="0.6"/><stop offset="1" stop-color="#f6e2bc" stop-opacity="0"/></linearGradient>
    </defs>
    <path d="${range(back)}" fill="url(#b1)"/>
    ${facets(back, 150, '#6f6aa6', '#ffe6b0')}${snowCaps(back, 52)}
    <rect y="60" width="${w}" height="70" fill="url(#ms)"/>
    <path d="${range(mid)}" fill="url(#b2)"/>
    ${facets(mid, 150, '#4c5f86', '#ffe0a0')}
    <rect y="85" width="${w}" height="50" fill="url(#ms)" opacity="0.7"/>
    <path d="${polygon(belt, w, 132)}" fill="#8c7a3c"/>
    ${crowns.join('')}
    <path d="${polygon(meadow, w, 222)}" fill="url(#ml)"/>
    <path d="M${meadow.map(([x, y]) => `${x} ${f1(y + 1.5)}`).join(' L')}" fill="none" stroke="#f0e496" stroke-width="2.4" opacity="0.8"/>
    ${houses}
    <path d="${grass.join(' ')}" stroke="#e8dc84" stroke-width="2" stroke-linecap="round" opacity="0.5" fill="none"/>`);
}

// Right behind Frankie: the autumn forest slope, spruces among yellow, orange and red crowns, a golden meadow below.
function hillsNear() {
  const w = GAME_WIDTH;
  const forest = ridge(w, 76, [[6, 3, 0.8], [3, 8, 1.7]]);
  const slope = ridge(w, 94, [[5, 2, 1.3], [3, 5, 0.2], [2, 11, 0.9]]);
  const crowns = [];
  const tones = [['#d9602c', '#f2923f'], ['#e9a22e', '#f7c853'], ['#7fa840', '#a4c85c'], ['#c4572a', '#e08040'], ['#dfb340', '#f2d36c']];
  const N = 26;
  for (let i = 0; i < N; i++) {
    const x = i * (w / N) + 12;
    const y = ridgeY(forest, x) + 4;
    const r = 15 + (i % 4) * 2.4;
    const [c1, c2] = tones[(i * 2 + (i % 3)) % tones.length];
    crowns.push(wrapped(x, r + 2, (cx) => `<circle cx="${f1(cx)}" cy="${f1(y)}" r="${r}" fill="${c1}"/><circle cx="${f1(cx - 4)}" cy="${f1(y - 5)}" r="${f1(r * 0.55)}" fill="${c2}" opacity="0.85"/>`));
  }
  const dots = [];
  for (let i = 0; i < 46; i++) {
    const x = (i * 211) % w;
    dots.push(`<circle cx="${x}" cy="${f1(ridgeY(slope, x) + 12 + ((i * 29) % 30))}" r="${1.6 + (i % 3) * 0.5}" fill="${LEAF_COLORS[i % 5]}" opacity="0.7"/>`);
  }
  const firs = [];
  for (let i = 0; i < 34; i++) {
    const x = i * (w / 34) + ((i * 37) % 13);
    firs.push(fir(x, ridgeY(forest, x) + 14 + ((i * 11) % 7), 50 * (0.75 + 0.5 * rnd(i + 3)), 26, i % 4 === 1 ? FIR_PALE : FIR, 4));
  }
  return svgDoc(w, 140, `
    <defs><linearGradient id="sl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b6b84e"/><stop offset="1" stop-color="#8fa642"/></linearGradient></defs>
    <path d="${polygon(forest, w, 110)}" fill="#6f7f3c"/>
    ${firs.join('')}
    ${crowns.join('')}
    <path d="${polygon(slope, w, 140)}" fill="url(#sl)"/>
    <path d="M${slope.map(([x, y]) => `${x} ${f1(y + 3)}`).join(' L')}" fill="none" stroke="#e8dc84" stroke-width="3" opacity="0.7"/>
    ${dots.join('')}`);
}

// ---- The castle (drawn in its own coordinates: y 0 is the terrace, the rock reaches down to y 125) ----

// A slender cone roof with slightly flared eaves, shingle rows and a gold finial. eave line at y, half width hw.
function coneRoof(cx, y, hw, h, rows = 5) {
  const P = [[cx - hw, y], [cx - hw * 0.2, y - h * 0.5], [cx, y - h]];
  const at = (u) => [(1 - u) ** 2 * P[0][0] + 2 * (1 - u) * u * P[1][0] + u * u * P[2][0], (1 - u) ** 2 * P[0][1] + 2 * (1 - u) * u * P[1][1] + u * u * P[2][1]];
  const shingles = [];
  for (let k = 1; k <= rows; k++) {
    const [xl, yl] = at(k / (rows + 1));
    shingles.push(`M${f1(xl)} ${f1(yl)} Q${f1(cx)} ${f1(yl + 4)} ${f1(2 * cx - xl)} ${f1(yl)}`);
  }
  return `<path d="M${f1(cx - hw)} ${f1(y)} Q${f1(cx - hw * 0.2)} ${f1(y - h * 0.5)} ${f1(cx)} ${f1(y - h)} Q${f1(cx + hw * 0.2)} ${f1(y - h * 0.5)} ${f1(cx + hw)} ${f1(y)} Q${f1(cx)} ${f1(y + 6)} ${f1(cx - hw)} ${f1(y)} Z" fill="${SLATE}" ${soft(SLATE_LINE, 1.4)}/>
    <path d="M${f1(cx)} ${f1(y - h)} Q${f1(cx + hw * 0.2)} ${f1(y - h * 0.5)} ${f1(cx + hw)} ${f1(y)} Q${f1(cx + hw * 0.5)} ${f1(y + 4)} ${f1(cx + hw * 0.1)} ${f1(y + 3)} Z" fill="${SLATE_LIGHT}" opacity="0.55"/>
    <path d="M${f1(cx)} ${f1(y - h)} Q${f1(cx - hw * 0.2)} ${f1(y - h * 0.5)} ${f1(cx - hw)} ${f1(y)} Q${f1(cx - hw * 0.6)} ${f1(y + 4)} ${f1(cx - hw * 0.3)} ${f1(y + 3)} Z" fill="${SLATE_DARK}" opacity="0.3"/>
    <path d="${shingles.join(' ')}" fill="none" stroke="${SLATE_LINE}" stroke-width="1" opacity="0.45"/>
    <path d="M${f1(cx)} ${f1(y - h)} V${f1(y - h - 9)}" stroke="${GOLD_LINE}" stroke-width="1.8" stroke-linecap="round"/><circle cx="${f1(cx)}" cy="${f1(y - h - 10)}" r="2.8" fill="${GOLD}" ${soft(GOLD_LINE, 0.8)}/>`;
}

// A round tower: shaft from y0 up to y1, shaded on the left and lit on the right, a corbel ring and a cone roof.
function roundTower(cx, y0, y1, r, roofH, rows = 5) {
  const n = Math.max(2, Math.round((y0 - y1) / 48));
  const wins = [];
  for (let i = 0; i < n; i++) {
    const wy = y1 + 24 + (i * (y0 - y1 - 56)) / Math.max(1, n - 1);
    wins.push(`<path d="${arch(cx - 3.5, wy, 7, 15)}" fill="${WINDOW}" ${soft('#fffdf4', 0.8)}/>`);
  }
  return `<rect x="${f1(cx - r)}" y="${y1}" width="${r * 2}" height="${y0 - y1}" fill="${WALL}"/>
    <rect x="${f1(cx - r)}" y="${y1}" width="${f1(r * 0.75)}" height="${y0 - y1}" fill="${WALL_SHADE}" opacity="0.85"/>
    <rect x="${f1(cx + r * 0.4)}" y="${y1}" width="${f1(r * 0.6)}" height="${y0 - y1}" fill="${WALL_LIGHT}"/>
    <rect x="${f1(cx - r)}" y="${y1}" width="${r * 2}" height="${y0 - y1}" fill="none" ${soft(WALL_LINE, 1.4)}/>
    <rect x="${f1(cx - r)}" y="${f1((y0 + y1) / 2)}" width="${r * 2}" height="4" fill="${WALL_SHADE}" opacity="0.9"/>
    ${wins.join('')}
    <rect x="${f1(cx - r - 4)}" y="${y1 - 3}" width="${r * 2 + 8}" height="10" rx="2" fill="${WALL_SHADE}" ${soft(WALL_LINE, 1.2)}/>
    ${coneRoof(cx, y1 - 2, r + 8, roofH, rows)}`;
}

// A square tower with a pyramid roof.
function squareTower(cx, y0, y1, w, roofH) {
  const hw = w / 2;
  const rows = [0.25, 0.5, 0.75].map((t) => `M${f1(cx - (hw + 6) * (1 - t))} ${f1(y1 - roofH * t)} H${f1(cx + (hw + 6) * (1 - t))}`);
  return `<rect x="${f1(cx - hw)}" y="${y1}" width="${w}" height="${y0 - y1}" fill="${WALL}" ${soft(WALL_LINE, 1.4)}/>
    <rect x="${f1(cx - hw)}" y="${y1}" width="${f1(w * 0.3)}" height="${y0 - y1}" fill="${WALL_SHADE}" opacity="0.85"/>
    <rect x="${f1(cx + hw * 0.4)}" y="${y1}" width="${f1(hw * 0.6)}" height="${y0 - y1}" fill="${WALL_LIGHT}"/>
    <path d="${arch(cx - 5, y1 + 14, 10, 20)} ${arch(cx - 5, y1 + 58, 10, 20)}" fill="${WINDOW}" ${soft('#fffdf4', 0.8)}/>
    <rect x="${f1(cx - hw - 3)}" y="${y1 - 3}" width="${w + 6}" height="8" rx="2" fill="${WALL_SHADE}" ${soft(WALL_LINE, 1.1)}/>
    <path d="M${f1(cx - hw - 6)} ${y1 - 2} L${f1(cx)} ${f1(y1 - roofH)} L${f1(cx + hw + 6)} ${y1 - 2} Z" fill="${SLATE}" ${soft(SLATE_LINE, 1.4)}/>
    <path d="M${f1(cx)} ${f1(y1 - roofH)} L${f1(cx + hw + 6)} ${y1 - 2} L${f1(cx + 3)} ${y1 - 2} Z" fill="${SLATE_LIGHT}" opacity="0.55"/>
    <path d="${rows.join(' ')}" stroke="${SLATE_LINE}" stroke-width="1" opacity="0.45"/>
    <path d="M${f1(cx)} ${f1(y1 - roofH)} V${f1(y1 - roofH - 9)}" stroke="${GOLD_LINE}" stroke-width="1.8" stroke-linecap="round"/><circle cx="${f1(cx)}" cy="${f1(y1 - roofH - 10)}" r="2.8" fill="${GOLD}" ${soft(GOLD_LINE, 0.8)}/>`;
}

// A house with a front gable and a long roof running back to the right (an oblique view), like the palace.
function gableHouse({ x, base, w, wallH, roofH, dx, dy, rows = 5 }) {
  const eaveY = base - wallH;
  const peakX = x + w / 2;
  const peakY = eaveY - roofH;
  const ovh = 6;
  const lines = [];
  for (let k = 1; k < rows; k++) {
    const t = k / rows;
    const ax = peakX + (x + w + ovh - peakX) * t;
    const ay = peakY + (eaveY - peakY) * t;
    lines.push(`M${f1(ax)} ${f1(ay)} L${f1(ax + dx)} ${f1(ay + dy)}`);
  }
  return `<path d="M${x + w} ${eaveY} L${x + w + dx} ${eaveY + dy} V${base + dy} L${x + w} ${base} Z" fill="${WALL_LIGHT}" ${soft(WALL_LINE, 1.3)}/>
    <path d="M${peakX} ${peakY} L${x + w + ovh} ${eaveY} L${x + w + ovh + dx} ${eaveY + dy} L${peakX + dx} ${peakY + dy} Z" fill="${SLATE}" ${soft(SLATE_LINE, 1.4)}/>
    <path d="${lines.join(' ')}" stroke="${SLATE_LINE}" stroke-width="1.1" opacity="0.5"/>
    <path d="M${peakX} ${peakY} L${x + w + ovh} ${eaveY} L${x + w + ovh + dx * 0.45} ${eaveY + dy * 0.45} L${peakX + dx * 0.45} ${peakY + dy * 0.45} Z" fill="${SLATE_LIGHT}" opacity="0.4"/>
    <rect x="${x}" y="${eaveY}" width="${w}" height="${wallH}" fill="${WALL}" ${soft(WALL_LINE, 1.4)}/>
    <rect x="${x}" y="${eaveY}" width="${f1(w * 0.18)}" height="${wallH}" fill="${WALL_SHADE}" opacity="0.7"/>
    <path d="M${x - ovh} ${eaveY} L${peakX} ${peakY} L${x + w + ovh} ${eaveY} Z" fill="${WALL}" ${soft(WALL_LINE, 1.3)}/>
    <path d="M${x - ovh} ${eaveY} L${peakX} ${peakY} L${x + w + ovh} ${eaveY}" fill="none" stroke="${SLATE_LINE}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M${x - ovh} ${eaveY} L${peakX} ${peakY} L${x + w + ovh} ${eaveY}" fill="none" stroke="${SLATE}" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${peakX}" cy="${peakY - 4}" r="3" fill="${GOLD}" ${soft(GOLD_LINE, 0.8)}/>`;
}

// A row of arched windows between x0 and x1 at height y.
function windowRow(x0, x1, y, n, w = 8, h = 15) {
  return Array.from({ length: n }, (_, i) => {
    const wx = n === 1 ? (x0 + x1) / 2 - w / 2 : x0 + ((x1 - x0) * i) / (n - 1) - w / 2;
    return `<path d="${arch(wx, y, w, h)}" fill="${WINDOW}" ${soft('#fffdf4', 0.8)}/>`;
  }).join('');
}

// The palace of Neuschwanstein, the terrace at y 0: towers and the great gable, white walls, blue-grey roofs.
function castle() {
  return `
    ${gableHouse({ x: -292, base: -2, w: 62, wallH: 62, roofH: 44, dx: 24, dy: -6, rows: 3 })}
    ${gableHouse({ x: -40, base: 0, w: 190, wallH: 175, roofH: 125, dx: 80, dy: -14, rows: 7 })}
    ${windowRow(-12, 122, -278, 1, 9, 16)}${windowRow(-22, 132, -244, 2, 9, 16)}${windowRow(-34, 144, -208, 4, 9, 16)}
    ${windowRow(-26, 136, -160, 5, 9, 17)}${windowRow(-26, 136, -118, 5, 9, 17)}${windowRow(-26, 136, -76, 5, 10, 18)}${windowRow(-20, 130, -34, 4, 12, 22)}
    <path d="M-40 -172 H150 M-40 -98 H150" stroke="${WALL_LINE}" stroke-width="1.6" opacity="0.5"/>
    ${roundTower(-34, 0, -190, 10, 40, 3)}${roundTower(144, 0, -190, 10, 40, 3)}
    ${squareTower(-72, 0, -208, 44, 92)}
    ${gableHouse({ x: -220, base: 0, w: 124, wallH: 104, roofH: 82, dx: 36, dy: -8, rows: 4 })}
    ${windowRow(-208, -108, -86, 4, 9, 17)}${windowRow(-198, -118, -48, 3, 11, 20)}${windowRow(-176, -140, -128, 2, 9, 17)}
    ${roundTower(-246, 0, -214, 24, 118)}
    ${roundTower(178, 0, -196, 15, 74, 4)}
    ${gableHouse({ x: 166, base: 0, w: 56, wallH: 92, roofH: 56, dx: 24, dy: -6, rows: 3 })}
    ${windowRow(176, 212, -76, 2, 9, 17)}${windowRow(176, 212, -40, 2, 9, 17)}
    ${roundTower(246, 0, -252, 27, 126)}
    <path d="M-306 -14 H306 V0 H-306 Z" fill="${STONE_LIGHT}" ${soft(STONE_LINE, 1.3)}/>
    <path d="${Array.from({ length: 25 }, (_, i) => arch(-298 + i * 24.5, -11, 12, 11)).join(' ')}" fill="${STONE_SHADE}" opacity="0.55"/>
    <path d="M-306 -14 H306" stroke="#fffdf4" stroke-width="2" opacity="0.8"/>`;
}

// The craggy, wooded rock under the castle, from y -4 down to y 125, with a ring of trees at its foot.
function castleRock() {
  const L = [[-318, -4], [-306, 20], [-308, 46], [-284, 72], [-262, 98], [-236, 126]];
  const R = [[318, -4], [308, 18], [310, 48], [288, 74], [266, 100], [240, 126]];
  const pts = [...L, ...R.slice().reverse()];
  const strata = [24, 50, 76, 100].map((y, i) => `M${-300 + i * 8} ${y} q60 -${6 + i} 120 ${i % 2 ? 4 : -2} t130 ${i % 2 ? -3 : 3} t120 -3 t${70 - i * 5} 4`).join(' ');
  const trees = [];
  for (const [x, y, h, k] of [[-296, 40, 70, 0], [-262, 84, 84, 1], [298, 36, 74, 2], [264, 86, 90, 3], [-250, 22, 60, 4], [250, 20, 62, 5], [-190, 60, 50, 2], [190, 70, 54, 1]]) {
    trees.push(k % 2 ? broadleaf(x, y + 10, h * 0.8, h * 0.8, k % 3 === 1 ? MAPLE : MAPLE_GOLD, BARK_DARK) : fir(x, y + 12, h, h * 0.46, k < 3 ? FIR : FIR_PALE, 4));
  }
  const foot = [];
  for (let x = -330; x <= 330; x += 24) {
    const y = 128 + rnd(x) * 4;
    foot.push(rnd(x + 4) > 0.45 ? fir(x, y, 52 + rnd(x + 9) * 26, 26, rnd(x + 2) > 0.5 ? FIR : FIR_PALE, 3) : broadleaf(x, y, 52 + rnd(x + 9) * 20, 46, [MAPLE, MAPLE_GOLD, BEECH_GOLD][Math.floor(rnd(x + 11) * 3)], BARK_DARK));
  }
  return `<path d="M${pts.map(([x, y]) => `${x} ${y}`).join(' L')} Z" fill="${ROCK}" ${soft(ROCK_LINE, 1.5)}/>
    <path d="M-318 -4 L-306 20 L-308 46 L-284 72 L-262 98 L-236 126 L-120 126 L-150 70 L-120 20 L-100 -4 Z" fill="${ROCK_DARK}" opacity="0.4"/>
    <path d="M318 -4 L308 18 L310 48 L288 74 L266 100 L240 126 L170 126 L210 70 L190 20 L220 -4 Z" fill="${ROCK_LIGHT}" opacity="0.6"/>
    <path d="${strata}" stroke="${ROCK_LINE}" stroke-width="2" fill="none" opacity="0.35" stroke-linecap="round"/>
    <path d="M-60 0 L-80 40 L-60 80 L-90 124 M40 0 L60 40 L36 90 M120 0 L96 50 L130 120" stroke="${ROCK_LINE}" stroke-width="1.8" fill="none" opacity="0.3"/>
    ${trees.join('')}
    ${foot.join('')}`;
}

// ---- Landmarks (far layer, once per zone) ----

// Hohenschwangau: the yellow castle of the Bavarian kings on its green hill, small next to its famous neighbour.
function hohenschwangau() {
  const W = 440;
  const Y = 300;
  const g = 182;
  const merlons = (x0, x1, y, m = 7, gp = 5) => {
    const out = [];
    for (let x = x0; x + m <= x1 + 0.1; x += m + gp) out.push(`<rect x="${f1(x)}" y="${y - 7}" width="${m}" height="8" fill="${YELLOW}" ${soft(YELLOW_LINE, 0.9)}/>`);
    return out.join('');
  };
  const gw = (x, y, w, h) => `<path d="${gothic(x, y, w, h)}" fill="${WINDOW}" ${soft('#fffdf4', 0.9)}/>`;
  const win = (x0, x1, y, n, w = 8, h = 16) => Array.from({ length: n }, (_, i) => gw(n === 1 ? (x0 + x1) / 2 - w / 2 : x0 + ((x1 - x0) * i) / (n - 1) - w / 2, y, w, h)).join('');
  return svgDoc(W, Y + FOOT_GAP, `
    <defs><linearGradient id="hh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c0cc5c"/><stop offset="1" stop-color="#8fa848"/></linearGradient></defs>
    ${fir(46, Y - 18, 104, 44, FIR_PALE, 5)}${fir(398, Y - 22, 112, 48, FIR, 5)}
    <path d="M6 ${Y} C30 ${Y - 70} 120 ${Y - 118} 220 ${Y - 120} C320 ${Y - 118} 412 ${Y - 70} 434 ${Y} Z" fill="url(#hh)" ${soft('#5f7a30', 1.4)}/>
    <path d="M60 ${Y - 66} C120 ${Y - 104} 320 ${Y - 104} 380 ${Y - 66}" fill="none" stroke="#e4e68a" stroke-width="3" opacity="0.7"/>
    ${broadleaf(66, Y - 30, 78, 64, MAPLE_GOLD, BARK_DARK)}${broadleaf(372, Y - 26, 84, 68, MAPLE, BARK_DARK)}${fir(100, Y - 8, 70, 34, FIR, 4)}${fir(340, Y - 6, 76, 36, FIR_PALE, 4)}
    <rect x="96" y="${g}" width="258" height="40" fill="${YELLOW}" ${soft(YELLOW_LINE, 1.4)}/>
    <rect x="96" y="${g}" width="60" height="40" fill="${YELLOW_SHADE}" opacity="0.5"/>
    ${merlons(98, 352, g)}
    <path d="${[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => arch(110 + i * 27, g + 14, 14, 26)).join(' ')}" fill="${YELLOW_SHADE}" opacity="0.7"/>
    <rect x="122" y="${g - 74}" width="196" height="74" fill="${YELLOW}" ${soft(YELLOW_LINE, 1.4)}/>
    <rect x="122" y="${g - 74}" width="50" height="74" fill="${YELLOW_SHADE}" opacity="0.5"/><rect x="270" y="${g - 74}" width="48" height="74" fill="${YELLOW_LIGHT}" opacity="0.8"/>
    ${merlons(124, 316, g - 74)}
    ${win(140, 300, g - 62, 6)}${win(140, 300, g - 32, 6)}
    <path d="M186 ${g - 74} L186 ${g - 118} L262 ${g - 118} L262 ${g - 74} Z" fill="${YELLOW}" ${soft(YELLOW_LINE, 1.4)}/>
    <path d="M178 ${g - 116} L224 ${g - 176} L270 ${g - 116} Z" fill="${SLATE}" ${soft(SLATE_LINE, 1.4)}/><path d="M224 ${g - 176} L270 ${g - 116} L224 ${g - 116} Z" fill="${SLATE_LIGHT}" opacity="0.5"/>
    ${win(204, 244, g - 106, 2, 9, 20)}
    <path d="M224 ${g - 176} V${g - 196} M224 ${g - 196} h16 v9 h-16 Z" stroke="${WOOD_DARK}" stroke-width="2" fill="#3d84c6"/>
    <rect x="104" y="${g - 160}" width="46" height="160" fill="${YELLOW}" ${soft(YELLOW_LINE, 1.4)}/>
    <rect x="104" y="${g - 160}" width="14" height="160" fill="${YELLOW_SHADE}" opacity="0.55"/><rect x="136" y="${g - 160}" width="14" height="160" fill="${YELLOW_LIGHT}" opacity="0.8"/>
    <rect x="98" y="${g - 172}" width="58" height="14" fill="${YELLOW}" ${soft(YELLOW_LINE, 1.4)}/>${merlons(99, 155, g - 172, 7, 6)}
    ${win(126, 126, g - 140, 1, 9, 22)}${win(126, 126, g - 96, 1, 9, 22)}${win(126, 126, g - 52, 1, 9, 22)}
    <rect x="296" y="${g - 130}" width="50" height="130" fill="${YELLOW}" ${soft(YELLOW_LINE, 1.4)}/>
    <rect x="296" y="${g - 130}" width="16" height="130" fill="${YELLOW_SHADE}" opacity="0.55"/><rect x="330" y="${g - 130}" width="16" height="130" fill="${YELLOW_LIGHT}" opacity="0.8"/>
    <rect x="290" y="${g - 142}" width="62" height="14" fill="${YELLOW}" ${soft(YELLOW_LINE, 1.4)}/>${merlons(291, 351, g - 142, 7, 6)}
    ${win(321, 321, g - 110, 1, 9, 22)}${win(321, 321, g - 66, 1, 9, 22)}
    <path d="M321 ${g - 142} V${g - 168} M321 ${g - 168} l17 5 l-17 5 Z" stroke="${WOOD_DARK}" stroke-width="2" fill="#ffffff"/>
    ${broadleaf(30, Y - 6, 70, 58, BEECH_GOLD, BARK_GREY)}${fir(420, Y - 4, 80, 38, FIR, 4)}${broadleaf(396, Y - 2, 62, 52, MAPLE_GOLD, BARK_DARK)}
    ${drift(40, Y - 120, 360, 100, 14, 7)}`);
}

// Neuschwanstein, the main landmark of the view from the Marienbrücke: the white palace on its rock
// above the gorge, spruces and golden larches flanking the rock.
function neuschwanstein() {
  const W = 540;
  const s = 0.8;
  const top = 375 * s;
  const H = top + 125 * s;
  return svgDoc(W, H + FOOT_GAP, `
    <g transform="translate(${W / 2} ${f1(top)}) scale(${s})">${castleRock()}${castle()}</g>
    ${fir(36, H, 170, 70, FIR)}${fir(76, H, 112, 50, LARCH, 5)}${fir(506, H, 180, 74, FIR)}${fir(462, H, 116, 52, LARCH, 5)}${broadleaf(20, H + 2, 80, 70, MAPLE, BARK_DARK)}
    ${drift(60, 40, 440, 300, 16, 21)}`);
}

// Neuschwanstein seen from the lake, small and far behind: the jagged Säuling on the left, the broad
// Tegelberg on the right, the castle on its wooded rock between them, the Schwansee in front.
function alpseeCastle() {
  const W = 580;
  const H = 300;
  const lakeY = 208;
  const sauling = 'M-4 232 L24 186 L52 146 L76 106 L96 66 L110 40 L120 54 L130 46 L144 80 L168 118 L196 158 L228 196 L262 232 Z';
  const tegel = 'M250 232 L300 176 L346 128 L392 92 L424 78 L452 86 L488 108 L530 150 L584 186 L584 232 Z';
  const forestRow = [];
  for (let x = -10; x <= W + 10; x += 17) {
    const y = lakeY - 6 - rnd(x) * 14 + (x > 200 && x < 400 ? -14 : 0);
    forestRow.push(rnd(x + 3) > 0.5 ? fir(x, y + 8, 30 + rnd(x + 6) * 12, 16, rnd(x) > 0.5 ? FIR : FIR_PALE, 3) : `<circle cx="${x}" cy="${f1(y)}" r="${f1(9 + rnd(x + 8) * 4)}" fill="${['#d9892e', '#e9b43c', '#c4572a', '#7da044'][Math.floor(rnd(x + 5) * 4)]}"/>`);
  }
  const scene = `
    <path d="${sauling}" fill="url(#sg)"/><path d="M110 40 L96 66 L76 106 L52 146 L24 186 L-4 232 L60 232 L88 150 Z" fill="#4c5f86" opacity="0.3"/><path d="M110 40 L120 54 L130 46 L144 80 L168 118 L196 158 L228 196 L262 232 L180 232 L132 120 Z" fill="#ffe0a0" opacity="0.25"/>
    <path d="M110 40 L102 52 L112 50 L118 44 Z M130 46 L136 60 L128 56 Z" fill="#fff8ee"/>
    <path d="${tegel}" fill="url(#sg)"/><path d="M424 78 L392 92 L346 128 L300 176 L250 232 L340 232 L400 150 Z" fill="#4c5f86" opacity="0.3"/><path d="M424 78 L452 86 L488 108 L530 150 L584 186 L584 232 L470 232 L440 140 Z" fill="#ffe0a0" opacity="0.25"/>
    <path d="M424 78 L416 84 L432 92 L444 84 Z" fill="#fff8ee"/>
    <path d="M0 ${lakeY} V176 C60 170 110 182 160 176 C230 166 300 176 360 168 C430 160 500 176 ${W} 170 V${lakeY} Z" fill="#7f8a40"/>
    <g transform="translate(298 ${lakeY - 38}) scale(0.34)">${castleRock()}${castle()}</g>
    ${forestRow.join('')}`;
  const reeds = [];
  for (let i = 0; i < 70; i++) {
    const x = 6 + (i * (W - 12)) / 70 + rnd(i) * 6;
    const top = H - 30 - rnd(i + 20) * 26;
    reeds.push(`<path d="M${f1(x)} ${H - 2} Q${f1(x + (rnd(i + 40) - 0.5) * 8)} ${f1((H + top) / 2)} ${f1(x + (rnd(i + 60) - 0.5) * 16)} ${f1(top)}" stroke="${['#a9b266', '#c4b86a', '#8fa050', '#d2b868'][i % 4]}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`);
  }
  const ripples = [];
  for (let i = 0; i < 26; i++) ripples.push(`M${(i * 97) % W} ${lakeY + 12 + ((i * 29) % 70)} h${8 + (i % 4) * 5}`);
  return svgDoc(W, H + FOOT_GAP, `
    <defs>
      <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a9a8d0"/><stop offset="0.7" stop-color="#c8bcd0"/><stop offset="1" stop-color="#e8d2bc"/></linearGradient>
      <linearGradient id="ms" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6e2bc" stop-opacity="0"/><stop offset="0.6" stop-color="#f6e2bc" stop-opacity="0.55"/><stop offset="1" stop-color="#f6e2bc" stop-opacity="0"/></linearGradient>
      <linearGradient id="lk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fb8c4"/><stop offset="0.5" stop-color="#5f98aa"/><stop offset="1" stop-color="#427c92"/></linearGradient>
      <clipPath id="lc"><rect y="${lakeY}" width="${W}" height="${H - lakeY}"/></clipPath>
    </defs>
    ${scene}
    <rect y="${lakeY}" width="${W}" height="${H - lakeY}" fill="url(#lk)"/>
    <g clip-path="url(#lc)"><g transform="translate(0 ${lakeY * 2}) scale(1 -1)" opacity="0.3">${scene}</g></g>
    <rect y="${lakeY}" width="${W}" height="${H - lakeY}" fill="url(#lk)" opacity="0.3"/>
    <path d="${ripples.join(' ')}" stroke="#eaf8f0" stroke-width="1.6" stroke-linecap="round" opacity="0.4" fill="none"/>
    <path d="M0 ${lakeY} H${W}" stroke="#d8dc9a" stroke-width="2" opacity="0.7"/>
    <path d="M-2 ${lakeY - 2} H110 C84 ${lakeY + 8} 40 ${lakeY + 30} -2 ${lakeY + 70} Z M${W + 2} ${lakeY - 2} H${W - 110} C${W - 84} ${lakeY + 8} ${W - 40} ${lakeY + 30} ${W + 2} ${lakeY + 70} Z" fill="#8f9a46"/>
    <path d="M110 ${lakeY} C84 ${lakeY + 8} 40 ${lakeY + 30} 0 ${lakeY + 70} M${W - 110} ${lakeY} C${W - 84} ${lakeY + 8} ${W - 40} ${lakeY + 30} ${W} ${lakeY + 70}" fill="none" stroke="#d8dc9a" stroke-width="2" opacity="0.7"/>
    ${broadleaf(34, lakeY + 36, 100, 84, MAPLE_GOLD, BARK_DARK)}${fir(78, lakeY + 40, 110, 50, FIR)}${fir(552, lakeY + 36, 120, 54, FIR)}${broadleaf(512, lakeY + 40, 96, 80, MAPLE, BARK_DARK)}
    <path d="M0 ${H} V${H - 14} C60 ${H - 22} 140 ${H - 10} 220 ${H - 16} C320 ${H - 24} 420 ${H - 10} ${W} ${H - 18} V${H} Z" fill="#b2ae58"/>
    ${reeds.join('')}`);
}

// ---- Far: larch, forest group, carriage, rocks, waterfall, bridge, swans, horses ----

// A golden larch: a tall airy cone of yellow needles.
function larch() {
  return svgDoc(100, 230, `${fir(50, 226, 212, 84, LARCH, 6)}${drift(8, 60, 84, 150, 8, 33, ['#e0a834', '#f5cd62', '#d9892e'])}${groundShadow(50, 226, 28)}`);
}

// A small wood on a grass mound: spruce, maple, golden beech and a larch.
function forestGroup() {
  return svgDoc(270, 200, `
    <path d="M0 198 C24 186 70 182 135 182 C200 182 246 186 270 198 Z" fill="#9fb050" ${soft('#6f8a38', 1.2)}/>
    ${fir(50, 192, 128, 56, FIR, 5)}${maple(196, 192, 142, 112, MAPLE, MAPLE_GOLD)}${fir(130, 190, 160, 66, LARCH, 6)}${broadleaf(98, 194, 100, 80, BEECH_GOLD, BARK_GREY)}${fir(240, 194, 84, 40, FIR_PALE, 4)}
    ${drift(20, 120, 230, 70, 10, 41)}
    ${groundShadow(135, 197, 110, 0.18)}`);
}

// A horse standing on (x, y), side view, facing right. Uses fixed colours: coat, darker leg colour, mane.
function horse(x, y, s, { coat, dark, mane, flip = false, graze = false, blaze = false, step = 0 }) {
  const line = '#4a2e1c';
  const leg = (lx, dx, c) => `<path d="M${lx} -36 L${lx + dx} -7" stroke="${line}" stroke-width="8.4" stroke-linecap="round"/><path d="M${lx} -36 L${lx + dx} -7" stroke="${c}" stroke-width="5.4" stroke-linecap="round"/><path d="M${lx + dx - 3} -5 h6.4" stroke="#2e2018" stroke-width="4" stroke-linecap="round"/>`;
  const head = graze
    ? `<path d="M28 -64 C40 -60 52 -46 58 -30 L46 -24 C42 -38 32 -48 20 -52 Z" fill="${coat}" ${soft(line, 1.2)}/>
       <path d="M30 -66 C42 -60 56 -44 60 -30" stroke="${mane}" stroke-width="5" fill="none" stroke-linecap="round"/>
       <ellipse cx="61" cy="-17" rx="12.5" ry="6.4" transform="rotate(72 61 -17)" fill="${coat}" ${soft(line, 1.2)}/>
       <ellipse cx="64" cy="-7" rx="4.6" ry="3.4" fill="#3a2418" transform="rotate(72 64 -7)"/>
       ${blaze ? '<path d="M58 -26 L62 -14" stroke="#fff4e0" stroke-width="3" stroke-linecap="round"/>' : ''}
       <path d="M52 -26 l-6 -6 l9 2 Z" fill="${coat}" ${soft(line, 0.9)}/><circle cx="57" cy="-20" r="1.6" fill="#1a100a"/>`
    : `<path d="M26 -66 C34 -80 40 -92 44 -98 L58 -94 C56 -84 50 -70 44 -56 Z" fill="${coat}" ${soft(line, 1.2)}/>
       <path d="M44 -100 C38 -90 32 -78 24 -66" stroke="${mane}" stroke-width="5.4" fill="none" stroke-linecap="round"/>
       <ellipse cx="62" cy="-95" rx="13" ry="6.4" transform="rotate(28 62 -95)" fill="${coat}" ${soft(line, 1.2)}/>
       <ellipse cx="72" cy="-90" rx="4.6" ry="3.6" fill="#3a2418" transform="rotate(28 72 -90)"/>
       ${blaze ? '<path d="M58 -100 L70 -92" stroke="#fff4e0" stroke-width="3" stroke-linecap="round"/>' : ''}
       <path d="M48 -100 l-2 -9 l7 6 Z" fill="${coat}" ${soft(line, 0.9)}/><circle cx="62" cy="-98" r="1.7" fill="#1a100a"/>`;
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(flip ? -s : s)} ${f1(s)})">
    ${leg(-18, -step * 5, dark)}${leg(26, step * 5, dark)}
    <path d="M-36 -62 C-50 -60 -54 -44 -48 -24" stroke="${line}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M-36 -62 C-50 -60 -54 -44 -48 -24" stroke="${mane}" stroke-width="5.2" fill="none" stroke-linecap="round"/>
    <path d="M-36 -52 C-38 -68 -12 -72 6 -70 C24 -68 36 -66 40 -56 C42 -44 32 -34 12 -33 C-14 -31 -34 -38 -36 -52 Z" fill="${coat}" ${soft(line, 1.3)}/>
    <path d="M-30 -42 C-14 -34 20 -34 36 -46 C30 -36 10 -30 -14 -32 Z" fill="${dark}" opacity="0.35"/>
    <path d="M-26 -62 C-10 -70 14 -70 30 -62 C14 -64 -10 -62 -26 -54 Z" fill="#ffffff" opacity="0.18"/>
    ${head}
    ${leg(-27, step * 5, coat)}${leg(17, -step * 5, coat)}</g>`;
}

const HORSES = {
  chestnut: { coat: '#a9602f', dark: '#7a3f1c', mane: '#5a2c14' },
  bay: { coat: '#7a4a2a', dark: '#4a2a18', mane: '#2e1a10' },
  grey: { coat: '#cfcac0', dark: '#9a948a', mane: '#8a857c' },
  cream: { coat: '#e6c98a', dark: '#b8975a', mane: '#f4ead2' },
};

// A wheel with spokes at (cx, cy).
const wheel = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#4a1e16" stroke-width="5.6"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#b5432f" stroke-width="3.4"/>
  <path d="${Array.from({ length: 8 }, (_, i) => `M${cx} ${cy} l${f1(Math.cos((i * Math.PI) / 4) * r)} ${f1(Math.sin((i * Math.PI) / 4) * r)}`).join(' ')}" stroke="#8a4a2c" stroke-width="1.6"/>
  <circle cx="${cx}" cy="${cy}" r="3.2" fill="${GOLD}" ${soft(GOLD_LINE, 0.8)}/>`;

// A horse-drawn carriage on a forest path, far away: two horses, a blue open carriage, a coachman and two passengers.
function carriageFar() {
  const W = 340;
  const H = 190;
  const g = 176;
  return svgDoc(W, H, `
    ${fir(34, g - 4, 134, 58, FIR)}${fir(70, g - 2, 90, 42, FIR_PALE, 4)}${maple(294, g - 2, 128, 96, MAPLE_GOLD, BEECH_GOLD)}${fir(280, g, 96, 44, FIR, 4)}
    <path d="M-4 ${H - 2} C40 ${g - 10} 120 ${g - 8} 200 ${g - 10} C260 ${g - 10} 310 ${g - 6} ${W + 4} ${g - 12} V${H} H-4 Z" fill="#d6bf8a" ${soft('#a9905a', 1.2)}/>
    <path d="M20 ${g + 4} q30 -4 60 -1 M150 ${g + 2} q40 -4 80 0 M250 ${g + 3} q30 -3 60 -1" stroke="#b79f68" stroke-width="2" fill="none" opacity="0.8"/>
    <g transform="translate(36 ${g})">
      ${horse(196, -2, 0.82, { ...HORSES.bay, step: 1 })}
      ${horse(222, 2, 0.86, { ...HORSES.cream, step: -1 })}
      <path d="M118 -40 L170 -52 M118 -34 L170 -44" stroke="#4a2e1c" stroke-width="2.4"/>
      <path d="M118 -64 Q150 -76 232 -90" stroke="#4a2e1c" stroke-width="1" fill="none"/>
      ${wheel(36, -19, 19)}${wheel(104, -15, 14)}
      <path d="M12 -38 C12 -56 22 -62 40 -62 H112 C124 -62 130 -52 130 -38 Z" fill="#3b5f9a" ${soft('#1f3560', 1.4)}/>
      <path d="M14 -46 H128" stroke="#f1e6c8" stroke-width="3"/><path d="M16 -38 H128" stroke="#1f3560" stroke-width="1.4"/>
      <path d="M8 -62 C6 -74 12 -84 22 -84 L40 -84 V-62 Z" fill="#8a3a30" ${soft('#4a1e16', 1.2)}/>
      <rect x="92" y="-72" width="38" height="10" rx="2" fill="#8a3a30" ${soft('#4a1e16', 1.2)}/>
      <circle cx="54" cy="-76" r="5.2" fill="#e8b890"/><path d="M47 -78 h14 l-2 -9 h-10 Z" fill="#5a8a4a"/><rect x="49" y="-72" width="11" height="10" rx="3" fill="#c83a3a"/>
      <circle cx="76" cy="-76" r="5.2" fill="#e8b890"/><path d="M69 -76 q7 -12 14 0 Z" fill="#f2c0d0"/><rect x="71" y="-72" width="11" height="10" rx="3" fill="#e8d8a0"/>
      <rect x="107" y="-90" width="12" height="18" rx="3" fill="#2a2a34"/><circle cx="113" cy="-96" r="5.2" fill="#e8b890"/><path d="M106 -99 h14 M108 -99 v-12 h10 v12" stroke="#1a1a22" stroke-width="2.6" fill="#1a1a22"/>
      <path d="M118 -82 L132 -76" stroke="#2a2a34" stroke-width="3" stroke-linecap="round"/>
    </g>
    ${drift(10, 60, 320, 90, 8, 57)}
    ${groundShadow(170, H - 3, 150, 0.14)}`);
}

// A mossy rock outcrop with spruces and ferns, far away.
function rocksFar() {
  const W = 260;
  const H = 180;
  return svgDoc(W, H, `
    ${fir(44, 150, 120, 50, FIR_PALE, 5)}${fir(222, 148, 130, 54, FIR, 5)}${maple(160, 130, 100, 78, MAPLE, MAPLE_GOLD)}
    ${mossRock(14, 70, 122, H - 6)}${mossRock(112, 98, 128, H - 6, true)}
    ${fir(130, 80, 62, 30, FIR, 3)}
    ${ferns(150, H - 6, 0.9)}${ferns(30, H - 6, 0.8)}${ferns(236, H - 6, 0.8)}
    ${drift(30, 60, 200, 100, 6, 63)}
    ${groundShadow(130, H - 3, 110, 0.18)}`);
}

// A small waterfall of the Pöllat gorge: a mossy rock face, three drops of white water, ferns and trees at the top. The foot hides behind ferns.
function waterfall() {
  const W = 250;
  const H = 270;
  const drop = (x, y0, y1, w0, w1) => `<path d="M${f1(x - w0 / 2)} ${y0} C${f1(x - w0 / 2 - 2)} ${f1((y0 + y1) / 2)} ${f1(x - w1 / 2 + 2)} ${f1((y0 + y1) / 2)} ${f1(x - w1 / 2)} ${y1} L${f1(x + w1 / 2)} ${y1} C${f1(x + w1 / 2 - 2)} ${f1((y0 + y1) / 2)} ${f1(x + w0 / 2 + 2)} ${f1((y0 + y1) / 2)} ${f1(x + w0 / 2)} ${y0} Z" fill="#e6f8f6" ${soft('#8ac4c8', 1)}/>
    <path d="M${f1(x - w0 / 5)} ${y0 + 6} L${f1(x - w1 / 5)} ${y1 - 4} M${f1(x + w0 / 5)} ${y0 + 8} L${f1(x + w1 / 5)} ${y1 - 6}" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round"/>`;
  const foam = (x, y, r) => `<g fill="#ffffff" opacity="0.92"><circle cx="${x}" cy="${y}" r="${r}"/><circle cx="${x - r * 0.9}" cy="${y + r * 0.3}" r="${r * 0.7}"/><circle cx="${x + r * 0.9}" cy="${y + r * 0.3}" r="${r * 0.7}"/></g>`;
  return svgDoc(W, H + 30, `
    <g transform="translate(0 30)">
    ${fir(26, 150, 110, 48, FIR_PALE, 4)}${fir(226, 140, 124, 52, FIR, 5)}
    <path d="M12 ${H - 6} V96 Q22 58 64 50 L172 46 Q222 54 238 96 V${H - 6} Z" fill="${ROCK}" ${soft(ROCK_LINE, 1.5)}/>
    <path d="M12 ${H - 6} V96 Q22 58 64 50 L90 50 L70 130 L84 ${H - 6} Z" fill="${ROCK_DARK}" opacity="0.35"/>
    <path d="M238 ${H - 6} V96 Q232 66 210 54 L180 48 L190 130 L176 ${H - 6} Z" fill="${ROCK_LIGHT}" opacity="0.6"/>
    <path d="M24 112 q50 -10 90 2 M120 150 q50 -8 100 4 M26 190 q40 -6 80 0 M130 214 q50 -6 98 2" stroke="${ROCK_LINE}" stroke-width="2" fill="none" opacity="0.35" stroke-linecap="round"/>
    <path d="M12 96 Q22 58 64 50 L172 46 Q222 54 238 96 Q226 88 214 98 Q196 84 178 96 Q150 80 124 94 Q96 80 70 96 Q44 84 28 100 Z" fill="${MOSS}" ${soft('#3f6a30', 1.2)}/>
    <path d="M60 64 Q120 54 190 62" stroke="${MOSS_LIGHT}" stroke-width="3" fill="none" opacity="0.8" stroke-linecap="round"/>
    ${drop(126, 78, 112, 12, 18)}<path d="M100 112 H146 Q154 112 154 120 H96 Q92 112 100 112 Z" fill="${MOSS}" ${soft('#3f6a30', 1)}/>${foam(124, 114, 7)}
    ${drop(112, 120, 172, 18, 26)}<path d="M82 172 H138 Q148 172 148 180 H76 Q72 172 82 172 Z" fill="${MOSS}" ${soft('#3f6a30', 1)}/>${foam(112, 174, 9)}
    ${drop(122, 180, 246, 26, 38)}
    ${foam(122, 248, 14)}${foam(100, 252, 10)}${foam(146, 254, 10)}
    <path d="M30 64 V8 M30 14 l-12 -6" stroke="none"/>
    ${maple(206, 74, 70, 64, MAPLE, MAPLE_GOLD)}${fir(60, 74, 66, 32, FIR, 4)}
    ${ferns(46, H - 6, 1)}${ferns(206, H - 6, 1)}${ferns(160, H - 4, 0.8)}
    ${groundShadow(125, H - 3, 108, 0.18)}</g>`);
}

// The Marienbrücke seen from far away: a slim iron truss bridge on a wooden deck high above the gorge,
// steep rock walls with trees to both sides, a thin waterfall and mist in the depth.
function bridgeFar() {
  const W = 400;
  const H = 250;
  const posts = [];
  const diag = [];
  for (let x = 140, i = 0; x <= 260; x += 12, i++) {
    const belly = 76 + 24 * Math.sin((Math.PI * (x - 140)) / 120);
    posts.push(`M${x} 74 V${f1(belly)}`);
    if (i % 2 === 0 && x < 260) {
      const x2 = x + 12;
      const belly2 = 76 + 24 * Math.sin((Math.PI * (x2 - 140)) / 120);
      diag.push(`M${x} 74 L${x2} ${f1(belly2)} M${x2} 74 L${x} ${f1(belly)}`);
    }
  }
  const rail = [];
  for (let x = 128; x <= 272; x += 12) rail.push(`M${x} 74 V60`);
  return svgDoc(W, H + 40, `
    <g transform="translate(0 40)">
    <defs><linearGradient id="gd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6d8a86" stop-opacity="0.2"/><stop offset="0.5" stop-color="#5a7a78"/><stop offset="1" stop-color="#cfe0d8"/></linearGradient></defs>
    ${fir(40, 100, 110, 48, FIR_PALE, 4)}${maple(356, 100, 110, 88, MAPLE, MAPLE_GOLD)}${fir(318, 96, 90, 42, FIR, 4)}
    <path d="M146 ${H} V78 H254 V${H} Z" fill="url(#gd)"/>
    <path d="M150 140 H250 M156 190 H246" stroke="#ffffff" stroke-width="14" opacity="0.3" stroke-linecap="round"/>
    <path d="M-4 ${H} V92 C30 80 84 74 134 74 L152 80 L160 124 L150 170 L162 212 L154 ${H} Z" fill="${ROCK}" ${soft(ROCK_LINE, 1.5)}/>
    <path d="M-4 ${H} V92 C30 80 84 74 134 74 L96 120 L70 ${H} Z" fill="${ROCK_DARK}" opacity="0.3"/>
    <path d="M404 ${H} V84 C370 72 322 68 276 72 L248 80 L242 120 L252 170 L240 212 L248 ${H} Z" fill="${ROCK}" ${soft(ROCK_LINE, 1.5)}/>
    <path d="M404 ${H} V84 C370 72 322 68 276 72 L300 130 L330 ${H} Z" fill="${ROCK_LIGHT}" opacity="0.5"/>
    <path d="M10 130 q40 -8 90 2 M14 180 q40 -6 80 0 M300 120 q40 -6 90 2 M310 170 q40 -6 80 0" stroke="${ROCK_LINE}" stroke-width="2" fill="none" opacity="0.35" stroke-linecap="round"/>
    <path d="M-4 92 C30 80 84 74 134 74 L146 78 Q120 92 90 88 Q60 100 30 90 Q10 100 -4 98 Z" fill="${MOSS}" ${soft('#3f6a30', 1.1)}/>
    <path d="M404 84 C370 72 322 68 276 72 L254 78 Q280 90 310 86 Q340 98 370 88 Q392 96 404 92 Z" fill="${MOSS}" ${soft('#3f6a30', 1.1)}/>
    <path d="M244 100 C246 140 240 180 244 230" stroke="#f2fbfa" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.95"/>
    ${fir(56, 92, 130, 54, FIR)}${maple(104, 90, 96, 80, MAPLE_GOLD, BEECH_GOLD)}${fir(344, 84, 120, 52, FIR)}${broadleaf(298, 82, 80, 70, BEECH_GOLD, BARK_GREY)}
    <path d="M128 76 H272 V80 H128 Z" fill="${WOOD}" ${soft(WOOD_LINE, 1.2)}/>
    <path d="M140 76 Q200 124 260 76" fill="none" stroke="${IRON}" stroke-width="3.4"/>
    <path d="${posts.join(' ')} ${diag.join(' ')}" stroke="${IRON}" stroke-width="1.8" fill="none"/>
    <path d="M128 60 H272" stroke="${IRON}" stroke-width="3.2" stroke-linecap="round"/>
    <path d="${rail.join(' ')}" stroke="${IRON}" stroke-width="1.6"/>
    <path d="M128 60 H272" stroke="${IRON_LIGHT}" stroke-width="1" transform="translate(0 -1)"/>
    <g fill="#ffffff" opacity="0.85"><circle cx="200" cy="${H - 26}" r="14"/><circle cx="178" cy="${H - 18}" r="12"/><circle cx="222" cy="${H - 18}" r="12"/></g>
    ${ferns(30, H - 6, 1)}${ferns(372, H - 6, 1)}${ferns(120, H - 4, 0.8)}${ferns(282, H - 4, 0.8)}
    ${groundShadow(200, H - 3, 190, 0.16)}</g>`);
}

// A swan swimming at (x, y) on the water, s scales it.
function swan(x, y, s, flip = false) {
  const neck = 'M24 -12 C38 -20 38 -34 29 -42 C24 -48 29 -56 38 -54';
  return `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">
    <path d="M-34 4 h66 M-22 9 h40" stroke="#e8fff6" stroke-width="2.2" stroke-linecap="round" opacity="0.6"/>
    <path d="${neck}" fill="none" stroke="#a9b4b6" stroke-width="9.4" stroke-linecap="round"/><path d="${neck}" fill="none" stroke="#ffffff" stroke-width="6.6" stroke-linecap="round"/>
    <path d="M-30 -4 C-30 -18 -10 -22 8 -20 C22 -18 28 -14 30 -8 C20 0 -10 4 -30 -4 Z M-30 -4 L-40 -16 L-24 -13 Z" fill="#ffffff" ${soft('#a9b4b6', 1.3)}/>
    <path d="M-20 -13 C-6 -23 12 -21 18 -12 C6 -8 -8 -8 -20 -13 Z" fill="#eef2f2" ${soft('#b9c4c6', 0.9)}/>
    <circle cx="38" cy="-55" r="5.4" fill="#ffffff" ${soft('#a9b4b6', 1.2)}/>
    <path d="M42 -56 L53 -52 L42 -50 Z" fill="#f08a2c" ${soft('#a85a10', 0.8)}/><circle cx="41" cy="-57" r="1.2" fill="#1a1a1a"/><path d="M40 -53 l3 1" stroke="#1a1a1a" stroke-width="2.4"/></g>`;
}

// A small pond in the Alpsee reeds, far away, with two swans: golden trees behind, reeds in front.
function swanPond() {
  const W = 310;
  const H = 140;
  const reeds = [];
  for (let i = 0; i < 46; i++) {
    const x = 8 + (i * (W - 16)) / 46 + rnd(i) * 5;
    const top = H - 24 - rnd(i + 20) * 24;
    reeds.push(`<path d="M${f1(x)} ${H - 2} Q${f1(x + (rnd(i + 40) - 0.5) * 8)} ${f1((H + top) / 2)} ${f1(x + (rnd(i + 60) - 0.5) * 14)} ${f1(top)}" stroke="${['#a9b266', '#c4b86a', '#8fa050', '#d2b868'][i % 4]}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`);
  }
  return svgDoc(W, H, `
    <defs><linearGradient id="pd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9cc0c4"/><stop offset="1" stop-color="#4f8696"/></linearGradient></defs>
    ${fir(34, 100, 88, 40, FIR_PALE, 4)}${maple(270, 98, 96, 78, MAPLE, MAPLE_GOLD)}${broadleaf(60, 98, 82, 66, BEECH_GOLD, BARK_GREY)}${fir(236, 100, 80, 38, FIR, 4)}${broadleaf(150, 90, 56, 48, MAPLE_GOLD, BARK_DARK)}
    <path d="M10 112 C34 84 100 80 156 82 C212 80 276 88 300 114 C262 130 54 130 10 112 Z" fill="url(#pd)" ${soft('#4a7a80', 1.3)}/>
    <path d="M40 100 v10 M54 98 v12 M240 98 v12 M258 100 v10" stroke="#e9b43c" stroke-width="5" stroke-linecap="round" opacity="0.4"/>
    <path d="M70 100 h26 M130 94 h34 M200 98 h30 M96 118 h30 M180 120 h34" stroke="#e8fff6" stroke-width="1.8" stroke-linecap="round" opacity="0.5"/>
    ${swan(112, 112, 0.78)}${swan(202, 117, 0.54, true)}
    ${reeds.join('')}
    ${groundShadow(155, H - 3, 130, 0.12)}`);
}

// A paddock with three horses and a foal grazing under autumn trees, a wooden fence behind.
function horsesFar() {
  const W = 390;
  const H = 170;
  const fence = [];
  for (let x = 40; x <= 350; x += 38) fence.push(`<rect x="${x - 3}" y="72" width="6" height="46" rx="2" fill="${WOOD_LIGHT}" ${soft(WOOD_LINE, 1)}/>`);
  return svgDoc(W, H + 40, `
    <g transform="translate(0 40)">
    ${maple(48, 120, 130, 100, MAPLE, MAPLE_GOLD)}${fir(350, 118, 126, 54, LARCH, 5)}${broadleaf(304, 120, 96, 78, BEECH_GOLD, BARK_GREY)}
    <path d="M30 84 H360 M30 100 H360" stroke="${WOOD}" stroke-width="5" stroke-linecap="round"/><path d="M30 83 H360 M30 99 H360" stroke="${WOOD_LIGHT}" stroke-width="2" stroke-linecap="round"/>
    ${fence.join('')}
    <path d="M0 ${H - 2} C30 130 100 120 196 120 C292 120 360 130 ${W} ${H - 2} Z" fill="#a8b452" ${soft('#7a8c36', 1.2)}/>
    <path d="M30 140 C80 124 160 118 230 124 C290 126 340 136 360 146" fill="none" stroke="#e0e48a" stroke-width="4" opacity="0.7"/>
    ${horse(112, 150, 0.74, { ...HORSES.chestnut, graze: true, blaze: true })}
    ${horse(226, 148, 0.6, { ...HORSES.grey, flip: true, graze: true })}
    ${horse(176, 154, 0.38, { ...HORSES.bay, graze: true, flip: true })}
    ${horse(300, 148, 0.72, { ...HORSES.bay, blaze: true })}
    ${drift(20, 100, 340, 50, 7, 71)}
    ${groundShadow(196, H - 3, 170, 0.14)}</g>`);
}

// ---- Mid: spruce, maple, golden beech, gorge wall, lantern, banner ----

// A big dark spruce between falling leaves.
function spruceBig() {
  return svgDoc(150, 300, `${fir(75, 296, 288, 128, FIR, 7)}${drift(10, 150, 130, 140, 6, 81, ['#e9a22e', '#d9602c', '#f2c04a'])}${groundShadow(75, 296, 46, 0.22)}`);
}

// A maple in full autumn colour with ferns at its foot.
function mapleMid() {
  return svgDoc(240, 290, `
    ${maple(120, 284, 272, 226)}
    ${ferns(66, 286, 0.8)}${ferns(176, 286, 0.7)}
    ${drift(40, 150, 160, 130, 12, 91)}
    ${groundShadow(120, 286, 90, 0.2)}`);
}

// A golden beech: smooth grey trunk, a broad yellow crown, ferns at its foot.
function beechGold() {
  return svgDoc(220, 280, `
    ${broadleaf(110, 274, 262, 200, BEECH_GOLD)}
    ${ferns(70, 276, 0.8)}${ferns(160, 276, 0.7)}
    ${drift(40, 160, 140, 110, 8, 97, ['#e2b13c', '#f2d36c', '#d9892e'])}
    ${groundShadow(110, 276, 80, 0.2)}`);
}

// One steep wall of the gorge: layered rock, cracks, moss and a thin waterfall, spruce and maple on top.
// (Drawn on a 250 x 380 canvas and shown smaller, so the wall never hides the castle.)
function gorgeWall() {
  const W = 250;
  const H = 330;
  const edge = (x0, x1, seed) => {
    const out = [];
    for (let k = 0; k <= 9; k++) out.push([x0 + (x1 - x0) * (k / 9) + (rnd(seed + k) - 0.5) * 12, 64 + k * 29 + (rnd(seed + 20 + k) - 0.5) * 8]);
    return out;
  };
  const left = edge(18, 14, 3);
  const right = edge(232, 236, 40);
  const top = [[18, 70], [34, 44], [62, 36], [90, 22], [124, 30], [154, 20], [190, 38], [214, 52], [232, 70]];
  const pts = [...left.slice().reverse().slice(0, -1), ...top.slice(1), ...right];
  const d = `M${pts.map(([x, y]) => `${f1(x)} ${f1(y)}`).join(' L')} L236 ${H - 4} L14 ${H - 4} Z`;
  const strata = [];
  for (let k = 0; k < 7; k++) strata.push(`M16 ${96 + k * 32} q${40 + (k % 3) * 10} -${6 + (k % 2) * 4} 80 ${k % 2 ? 4 : -3} t80 ${k % 2 ? -4 : 3} t60 -2`);
  const mossBits = [[30, 98, 54], [150, 130, 62], [48, 196, 46], [168, 230, 56], [90, 270, 50]]
    .map(([x, y, w]) => `<path d="M${x} ${y} Q${x + w * 0.2} ${y - 9} ${x + w * 0.5} ${y - 6} Q${x + w * 0.8} ${y - 10} ${x + w} ${y} Q${x + w * 0.8} ${y + 6} ${x + w * 0.6} ${y + 2} Q${x + w * 0.4} ${y + 8} ${x + w * 0.2} ${y + 2} Z" fill="${MOSS}" opacity="0.92" ${soft('#3f6a30', 1)}/>`)
    .join('');
  return svgDoc(W, H + 50, `
    <g transform="translate(0 50)">
    <path d="${d}" fill="${ROCK}" ${soft(ROCK_LINE, 1.5)}/>
    <path d="M18 70 L34 44 L62 36 L90 22 L100 120 L86 200 L96 ${H - 4} L14 ${H - 4} Z" fill="${ROCK_DARK}" opacity="0.32"/>
    <path d="M190 38 L214 52 L232 70 L236 ${H - 4} L190 ${H - 4} L176 200 L186 120 Z" fill="${ROCK_LIGHT}" opacity="0.6"/>
    <path d="${strata.join(' ')}" stroke="${ROCK_LINE}" stroke-width="2.2" fill="none" opacity="0.38" stroke-linecap="round"/>
    <path d="M70 60 L62 130 L74 190 L66 250 M138 40 L146 120 L134 180 L144 260 M196 80 L190 150 L200 220" stroke="${ROCK_LINE}" stroke-width="1.8" fill="none" opacity="0.3"/>
    ${mossBits}
    <path d="M190 74 C186 120 194 160 188 214 C186 250 192 280 190 ${H - 20}" stroke="#f2fbfa" stroke-width="4.4" fill="none" stroke-linecap="round" opacity="0.92"/>
    ${fir(62, 50, 92, 40, FIR)}${maple(176, 54, 94, 80, MAPLE, MAPLE_GOLD)}${fir(124, 36, 60, 30, FIR_PALE, 4)}
    ${ferns(36, H - 4, 1)}${ferns(212, H - 4, 0.95)}${ferns(120, H - 2, 0.7)}
    ${groundShadow(125, H - 3, 112, 0.2)}</g>`);
}

// A wrought-iron promenade lamp with three lanterns, warm light in the glass.
function lantern() {
  const W = 100;
  const H = 260;
  const lamp = (cx, y, s) => `<g transform="translate(${cx} ${y}) scale(${s})">
    <circle cx="0" cy="-20" r="30" fill="url(#gl)"/>
    <path d="M-9 0 L-13 -30 H13 L9 -0 Z" fill="#fff0b0" ${soft(IRON, 1.6)}/>
    <path d="M-9 -2 L-11 -28 H0 L0 -2 Z" fill="#fffbe0" opacity="0.7"/>
    <path d="M0 -30 V0 M-11 -15 H11" stroke="${IRON}" stroke-width="1.4" opacity="0.7"/>
    <path d="M-17 -30 L0 -46 L17 -30 Z" fill="${IRON}" ${soft('#1f2e2a', 1.2)}/><circle cx="0" cy="-49" r="3" fill="${GOLD}" ${soft(GOLD_LINE, 0.8)}/>
    <rect x="-11" y="-1" width="22" height="5" rx="2" fill="${IRON}"/></g>`;
  return svgDoc(W, H, `
    <defs><radialGradient id="gl"><stop offset="0" stop-color="#ffe9a0" stop-opacity="0.65"/><stop offset="1" stop-color="#ffe9a0" stop-opacity="0"/></radialGradient></defs>
    ${ferns(22, H - 4, 0.7)}${ferns(80, H - 4, 0.6)}
    <rect x="31" y="228" width="38" height="24" rx="3" fill="${STONE}" ${soft(STONE_LINE, 1.3)}/><rect x="36" y="214" width="28" height="16" rx="3" fill="${STONE_LIGHT}" ${soft(STONE_LINE, 1.2)}/>
    <path d="M44 214 L46 86 H54 L56 214 Z" fill="${IRON}" ${soft('#1f2e2a', 1.2)}/>
    <path d="M46 214 L47 86" stroke="${IRON_LIGHT}" stroke-width="1.6" opacity="0.8"/>
    <rect x="41" y="196" width="18" height="6" rx="2" fill="${IRON}"/><rect x="42" y="120" width="16" height="5" rx="2" fill="${IRON}"/><rect x="42" y="86" width="16" height="6" rx="2" fill="${IRON}"/>
    <path d="M50 96 C40 94 30 92 22 80 M50 96 C60 94 70 92 78 80 M22 80 q-6 -4 -4 -10 M78 80 q6 -4 4 -10" fill="none" stroke="${IRON}" stroke-width="3" stroke-linecap="round"/>
    ${lamp(50, 86, 0.95)}${lamp(18, 72, 0.7)}${lamp(82, 72, 0.7)}
    ${groundShadow(50, H - 3, 40, 0.2)}`);
}

// A Bavarian royal banner on a blue-white spiral pole: lozenges in white and blue, a golden crown, no text.
function banner() {
  const W = 130;
  const H = 300;
  const spiral = [];
  for (let y = 40; y < H - 14; y += 22) spiral.push(`<path d="M18 ${y} L34 ${y - 12} V${y - 2} L18 ${y + 10} Z" fill="#2d7ec4"/>`);
  const bx = 38;
  const bw = 80;
  const shape = `M${bx} 40 H${bx + bw} V196 L${bx + bw / 2} 178 L${bx} 196 Z`;
  const jewel = (x, c) => `<circle cx="${x}" cy="94" r="2.4" fill="${c}"/>`;
  return svgDoc(W, H, `
    <defs>
      <clipPath id="bn"><path d="${shape}"/></clipPath>
      <pattern id="lz" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="translate(${bx + 6} 52) rotate(45)"><rect width="40" height="40" fill="#ffffff"/><rect width="20" height="20" fill="#2d7ec4"/><rect x="20" y="20" width="20" height="20" fill="#2d7ec4"/></pattern>
    </defs>
    <rect x="18" y="26" width="16" height="${H - 30}" rx="3" fill="#ffffff" ${soft('#6a7a8e', 1.3)}/>
    ${spiral.join('')}
    <rect x="18" y="26" width="16" height="${H - 30}" rx="3" fill="none" ${soft('#6a7a8e', 1.3)}/>
    <circle cx="26" cy="22" r="7" fill="${GOLD}" ${soft(GOLD_LINE, 1.2)}/><path d="M26 16 v-8" stroke="${GOLD_LINE}" stroke-width="2"/>
    <path d="M26 42 H${bx + bw + 6}" stroke="${GOLD_LINE}" stroke-width="3.4" stroke-linecap="round"/><circle cx="${bx + bw + 6}" cy="42" r="3.4" fill="${GOLD}"/>
    <g clip-path="url(#bn)"><rect x="${bx}" y="40" width="${bw}" height="160" fill="url(#lz)"/></g>
    <path d="${shape}" fill="none" stroke="#6a7a8e" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M${bx} 196 L${bx + bw / 2} 178 L${bx + bw} 196" fill="none" stroke="${GOLD}" stroke-width="3.2" stroke-linejoin="round"/>
    <circle cx="${bx + bw / 2}" cy="104" r="26" fill="#ffffff" ${soft(GOLD_LINE, 2)}/><circle cx="${bx + bw / 2}" cy="104" r="21" fill="#f4f7fb" ${soft('#2d7ec4', 1.4)}/>
    <g transform="translate(${bx + bw / 2} 108)">
      <path d="M-16 6 C-16 -8 -12 -14 -8 -16 C-6 -22 6 -22 8 -16 C12 -14 16 -8 16 6 Z" fill="#c83a3a" ${soft('#7a1e1e', 1)}/>
      <path d="M-18 6 H18 V14 H-18 Z" fill="${GOLD}" ${soft(GOLD_LINE, 1.1)}/>
      <path d="M-18 6 V-6 L-10 0 L0 -10 L10 0 L18 -6 V6" fill="${GOLD}" ${soft(GOLD_LINE, 1.1)}/>
      <circle cx="0" cy="-12" r="3" fill="${GOLD}" ${soft(GOLD_LINE, 0.8)}/><path d="M0 -15 v-6 M-3 -19 h6" stroke="${GOLD_LINE}" stroke-width="1.8" stroke-linecap="round"/>
      <circle cx="-9" cy="10" r="2" fill="#2d7ec4"/><circle cx="0" cy="10" r="2" fill="#c83a3a"/><circle cx="9" cy="10" r="2" fill="#2d7ec4"/>
    </g>
    <path d="${[0, 1, 2, 3, 4].map((i) => `M${bx + 8 + i * 16} 196 v8`).join(' ')}" stroke="${GOLD}" stroke-width="2.6" stroke-linecap="round"/>
    ${ferns(26, H - 4, 0.7)}
    ${groundShadow(40, H - 3, 36, 0.2)}`);
}

// ---- Near: small and pale plants ----

// Small, pale fern fronds in green, gold and copper.
function fernsNear() {
  const W = 130;
  const H = 76;
  return svgDoc(W, H, `
    <g opacity="0.92">${[[-1, -30, 22], [-0.55, -18, 36], [-0.15, -6, 46], [0.2, 8, 44], [0.6, 20, 34], [1, 32, 22]]
      .map(([o, lean, len], i) => frond(62 + o * 8, H - 4, len, lean, ['#a8c274', '#d6bc6c', '#dca468'][i % 3]))
      .join('')}</g>
    ${leaf(20, H - 8, 4, 40, '#e9a22e')}${leaf(106, H - 6, 4, -30, '#d9602c')}`);
}

// Autumn crocuses: lilac cups on pale stems, no leaves.
function crocus() {
  const cup = (x, y, rot) => `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M-7 0 Q-8 -14 0 -20 Q8 -14 7 0 Q0 4 -7 0 Z" fill="#cfa6e0" ${soft('#8a62a0', 0.9)}/><path d="M0 -19 V0 M-3.5 -16 L-3 0 M3.5 -16 L3 0" stroke="#a678c0" stroke-width="1" opacity="0.8"/><circle cx="-2" cy="-17" r="1.3" fill="#f2c040"/><circle cx="2" cy="-17" r="1.3" fill="#f2c040"/></g>`;
  const one = (x, top, lean) => `<path d="M${x} 62 Q${x + lean * 0.4} ${(62 + top) / 2} ${x + lean} ${top}" fill="none" stroke="#c4d49c" stroke-width="2.6" stroke-linecap="round"/>${cup(x + lean, top + 2, lean * 2)}`;
  return svgDoc(100, 66, `
    <path d="M4 64 Q24 54 44 62 Q68 52 96 64" fill="none" stroke="#a9c868" stroke-width="5" stroke-linecap="round"/>
    ${one(18, 28, -4)}${one(36, 18, 3)}${one(56, 30, -2)}${one(74, 22, 4)}${one(84, 38, 3)}
    ${leaf(44, 60, 3.4, 70, '#e9a22e')}`);
}

// A few fallen leaves and two chestnuts, small and pale.
function leavesNear() {
  const nut = (x, y) => `<circle cx="${x}" cy="${y}" r="5" fill="#9a5a30" ${soft('#6a3a1c', 1)}/><ellipse cx="${x - 1.4}" cy="${y - 1.6}" rx="2" ry="1.4" fill="#d09060" opacity="0.8"/><circle cx="${x + 5.4}" cy="${y + 1}" r="2" fill="#a9c868"/>`;
  return svgDoc(110, 40, `
    ${[[12, 30, 6, 30, 0], [30, 34, 6, -40, 1], [52, 28, 7, 70, 2], [74, 33, 6, 10, 3], [96, 29, 6, -60, 4], [42, 36, 5, 100, 1], [86, 36, 5, 140, 0], [64, 37, 4.4, -20, 2]]
      .map(([x, y, r, rot, c]) => leaf(x, y, r, rot, ['#eab45e', '#e8943c', '#d9602c', '#f2cf6a', '#c4572a'][c]))
      .join('')}
    ${nut(22, 35)}${nut(66, 34)}`);
}

// ---- Strips: a rustic fence at the forest path, an iron railing on the lakeside promenade ----

// Split-rail fence: posts on the tile edges and in the middle, two rails; joins without a seam.
function stripFence() {
  const w = 156;
  const post = (x) => `<rect x="${x - 4.5}" y="24" width="9" height="44" rx="3" fill="${WOOD_LIGHT}" ${soft(WOOD_LINE, 1.2)}/><path d="M${x - 4.5} 28 h9" stroke="${WOOD_LINE}" stroke-width="1" opacity="0.5"/>`;
  const grass = [];
  for (let x = 12; x < w; x += 19) grass.push(`M${x} 68 q-2 -8 -5 -10 M${x + 3} 68 q1 -9 5 -12`);
  return svgDoc(w, 70, `
    <rect x="0" y="32" width="${w}" height="6" rx="2" fill="${WOOD}" ${soft(WOOD_LINE, 1.2)}/><rect x="0" y="48" width="${w}" height="6" rx="2" fill="${WOOD}" ${soft(WOOD_LINE, 1.2)}/>
    <path d="M0 34 H${w} M0 50 H${w}" stroke="${WOOD_LIGHT}" stroke-width="1.6" opacity="0.8"/>
    ${post(0)}${post(w / 2)}${post(w)}
    <path d="${grass.join(' ')}" stroke="#a9b04a" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    ${leaf(30, 64, 3.4, 30, '#e9a22e')}${leaf(104, 66, 3.4, -50, '#d9602c')}`);
}

// A slim iron railing with ball finials and a small lantern on the middle post.
function stripRail() {
  const w = 156;
  const post = (x) => `<rect x="${x - 3.5}" y="22" width="7" height="46" rx="2" fill="${IRON}" ${soft('#1f2e2a', 1)}/><circle cx="${x}" cy="19" r="5" fill="${IRON}" ${soft('#1f2e2a', 1)}/><circle cx="${x - 1.4}" cy="17.4" r="1.6" fill="${IRON_LIGHT}"/>`;
  const bars = [];
  for (let x = 13; x < w - 6; x += 13) if (Math.abs(x - w / 2) > 6) bars.push(`M${x} 30 V64`);
  return svgDoc(w, 70, `
    <path d="${bars.join(' ')}" stroke="${IRON}" stroke-width="2.2" stroke-linecap="round" opacity="0.9"/>
    <path d="M0 30 H${w} M0 62 H${w}" stroke="${IRON}" stroke-width="3.6" stroke-linecap="round"/><path d="M0 29 H${w}" stroke="${IRON_LIGHT}" stroke-width="1.2"/>
    ${post(0)}${post(w / 2)}${post(w)}
    <circle cx="${w / 2}" cy="2" r="10" fill="#ffe9a0" opacity="0.4"/>
    <path d="M${w / 2 - 4} 14 l-1.4 -12 h10.8 l-1.4 12 Z" fill="#fff0b0" ${soft(IRON, 1)}/>
    ${leaf(34, 66, 3.4, 30, '#e9a22e')}${leaf(112, 67, 3.4, -50, '#d9602c')}`);
}

// ---- All pieces ----

const PIECES = {
  'hills-far-neuschwanstein': [GAME_WIDTH, 220, hillsFar],
  'hills-near-neuschwanstein': [GAME_WIDTH, 140, hillsNear],
  'ns-hohenschwangau': [440, 300 + FOOT_GAP, hohenschwangau],
  'ns-neuschwanstein': [540, 400 + FOOT_GAP, neuschwanstein],
  'ns-alpsee-castle': [580, 300 + FOOT_GAP, alpseeCastle],
  'ns-larch': [100, 230, larch],
  'ns-forest-group': [270, 200, forestGroup],
  'ns-carriage-far': [340, 190, carriageFar],
  'ns-rocks-far': [260, 180, rocksFar],
  'ns-waterfall': [250, 300, waterfall],
  'ns-bridge-far': [400, 290, bridgeFar],
  'ns-swan-pond': [310, 140, swanPond],
  'ns-horses-far': [390, 210, horsesFar],
  'ns-spruce-big': [150, 300, spruceBig],
  'ns-maple': [240, 290, mapleMid],
  'ns-beech-gold': [220, 280, beechGold],
  'ns-gorge-wall': [190, 289, gorgeWall],
  'ns-lantern': [100, 260, lantern],
  'ns-banner': [130, 300, banner],
  'ns-ferns-gold': [130, 76, fernsNear],
  'ns-crocus': [100, 66, crocus],
  'ns-leaves': [110, 40, leavesNear],
  'ns-strip-fence': [156, 70, stripFence],
  'ns-strip-rail': [156, 70, stripRail],
};

export function neuschwansteinSvgs() {
  return Object.fromEntries(Object.entries(PIECES).map(([key, [w, h, draw]]) => [key, { w, h, svg: draw() }]));
}

export function preloadNeuschwanstein(scene) {
  for (const [key, { w, h, svg }] of Object.entries(neuschwansteinSvgs())) loadSvg(scene, key, svg, w, h);
}
