import { GAME_WIDTH } from '../config.js';
import { OUTLINE, loadSvg, svgDoc } from './svg.js';
import { WOOD, attrs, crown, ridge, ridgeY, trunk } from './scenery.js';

// Level 2: the forest. Background pieces have soft outlines; everything Frankie
// can touch (stump, log, hedgehog, blocks, stream) gets the strong dark outline.

const line = (w = 3) => attrs(OUTLINE, w);
const BARK = '#7a4e2c';
const BARK_DARK = '#5e3b20';
const WOOD_CUT = '#e8c58a';
const RINGS = '#c9a06a';
const MOSS = '#6aa84f';

const polygon = (pts, w, h) => `M0 ${h} ${pts.map(([x, y]) => `L${x} ${y.toFixed(1)}`).join(' ')} L${w} ${h} Z`;

function hillsFarForest() {
  const w = GAME_WIDTH;
  const back = ridge(w, 80, [[28, 1, 0.3], [12, 3, 1.1]]);
  const front = ridge(w, 128, [[18, 2, 2], [8, 5]]);
  const firs = [];
  for (let x = 10; x < w - 10; x += 13 + ((x * 7) % 9)) {
    const y = ridgeY(front, x);
    const h = 20 + ((x * 13) % 16);
    firs.push(`<path d="M${x} ${(y - h).toFixed(1)} L${x + 7} ${(y + 4).toFixed(1)} L${x - 7} ${(y + 4).toFixed(1)} Z"/>`);
  }
  return svgDoc(w, 220, `
    <defs>
      <linearGradient id="mb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b3cfc6"/><stop offset="1" stop-color="#9dbfb0"/></linearGradient>
      <linearGradient id="mf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7aa886"/><stop offset="1" stop-color="#668f72"/></linearGradient>
    </defs>
    <path d="${polygon(back, w, 220)}" fill="url(#mb)"/>
    <path d="${polygon(front, w, 220)}" fill="url(#mf)"/>
    <g fill="#6a9a77">${firs.join('')}</g>`);
}

function hillsNearForest() {
  const w = GAME_WIDTH;
  const top = ridge(w, 44, [[14, 2, 0.8], [7, 4]]);
  const ferns = [];
  for (let x = 24; x < w - 24; x += 70 + ((x * 11) % 40)) {
    const y = ridgeY(top, x) + 26 + ((x * 7) % 30);
    ferns.push(`<path d="M${x} ${y} q-14 -10 -20 -2 M${x} ${y} q-4 -16 -2 -22 M${x} ${y} q12 -12 20 -6" fill="none" stroke="#4f8a3c" stroke-width="3" stroke-linecap="round"/>`);
  }
  const flowers = [];
  for (let x = 30; x < w - 10; x += 53) {
    flowers.push(`<circle cx="${x}" cy="${(ridgeY(top, x) + 20 + ((x * 13) % 60)).toFixed(1)}" r="2.4" fill="${x % 2 ? '#ffffff' : '#b3c7ff'}"/>`);
  }
  return svgDoc(w, 140, `
    <defs><linearGradient id="fn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#76ad5a"/><stop offset="1" stop-color="#5d9446"/></linearGradient></defs>
    <path d="${polygon(top, w, 140)}" fill="url(#fn)"/>
    ${ferns.join('')}${flowers.join('')}`);
}

function groundForest() {
  const w = 256;
  const stones = [[34, 52, 6], [110, 68, 5], [170, 46, 7], [226, 64, 5]];
  const leaves = [[20, 6, '#d98a3a', 20], [64, 4, '#e3b341', -30], [118, 7, '#c7642c', 45], [160, 5, '#e3b341', 10], [214, 6, '#d98a3a', -20]];
  const blades = [];
  for (let x = 4; x < w; x += 9) {
    const h = 5 + ((x * 7) % 6);
    blades.push(`<path d="M${x} 13 L${x + 2.5} ${13 - h} L${x + 5} 13 Z" fill="${x % 2 ? '#5aa944' : '#3f8a35'}"/>`);
  }
  const edge = ridge(w, 18, [[2.5, 8]], 4)
    .reverse()
    .map(([x, y]) => `L${x} ${y.toFixed(1)}`)
    .join(' ');
  return svgDoc(w, 80, `
    <defs><linearGradient id="soil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a5232"/><stop offset="1" stop-color="#5b3b22"/></linearGradient></defs>
    <rect width="${w}" height="80" fill="url(#soil)"/>
    ${stones.map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r * 1.3}" ry="${r}" fill="#86817a"/><ellipse cx="${x - r * 0.3}" cy="${y - r * 0.35}" rx="${r * 0.6}" ry="${r * 0.35}" fill="#aaa59d"/>`).join('')}
    <path d="M60 26 q12 10 4 22 M196 24 q-10 12 2 24 M140 30 q6 8 0 16" fill="none" stroke="#4a2f1c" stroke-width="2.5" opacity="0.6"/>
    <path d="M0 0 H${w} ${edge} Z" fill="#3f7f30"/>
    <rect width="${w}" height="11" fill="#4f9a3c"/>
    ${blades.join('')}
    ${leaves.map(([x, y, c, a]) => `<ellipse cx="${x}" cy="${y}" rx="4.5" ry="2.4" transform="rotate(${a} ${x} ${y})" fill="${c}"/>`).join('')}`);
}

function fir() {
  const tiers = [];
  for (let i = 0; i < 6; i++) {
    const bottom = 262 - i * 40;
    const hw = 70 - i * 11;
    const h = 74;
    const cx = 75;
    // Scalloped lower edge: little drooping branch tips.
    const scallops = [];
    const n = 5;
    for (let k = n; k > 0; k--) {
      const xa = cx - hw + ((2 * hw) / n) * k;
      const xb = cx - hw + ((2 * hw) / n) * (k - 1);
      scallops.push(`Q${((xa + xb) / 2).toFixed(1)} ${bottom + 9} ${xb.toFixed(1)} ${bottom}`);
    }
    tiers.push(`<path d="M${cx} ${bottom - h} L${cx + hw} ${bottom} ${scallops.join(' ')} Z" fill="#2f6b3f" ${attrs('#1f4a2c', 2.5)}/>
      <path d="M${cx} ${bottom - h + 6} L${cx - hw + 8} ${bottom - 2} L${cx - hw * 0.25} ${bottom - 4} Z" fill="#3f8a52"/>`);
  }
  return svgDoc(150, 300, `
    <rect x="68" y="250" width="14" height="48" fill="${BARK}" ${attrs(WOOD, 2.5)}/>
    ${tiers.join('')}`);
}

function beech() {
  return svgDoc(230, 280, `
    <path d="M100 278 C104 250 106 200 108 150 L122 150 C124 200 126 250 132 278 Z" fill="#a5a198" ${attrs('#6f6b63', 3)}/>
    <path d="M86 278 Q98 268 104 262 M146 278 Q134 268 128 262" fill="none" ${attrs('#6f6b63', 3)}/>
    <path d="M112 240 v-24 M120 210 v-30" stroke="#c4c0b6" stroke-width="2.5" stroke-linecap="round"/>
    ${crown(
      [[58, 120, 44], [104, 78, 58], [160, 88, 52], [188, 130, 36], [140, 136, 44], [84, 146, 36], [118, 34, 38]],
      { base: '#5c9e3c', shade: '#467f2e', light: '#7cbf52', dots: '#a5d977', line: '#2f5a24' },
    )}`);
}

function fern() {
  const fronds = [];
  const make = (angle, len, color) => {
    const a = (angle * Math.PI) / 180;
    // Points along a frond that rises and droops at the tip.
    const at = (t) => [60 + Math.cos(a) * len * t, 70 - Math.sin(a) * len * t + 16 * t * t];
    const [ex, ey] = at(1);
    const [mx, my] = at(0.5);
    const leaves = [];
    for (let i = 1; i < 9; i++) {
      const t = i / 9;
      const [x, y] = at(t);
      const [nx, ny] = at(t + 0.01);
      const dir = (Math.atan2(ny - y, nx - x) * 180) / Math.PI;
      const l = 10 * (1 - t) + 3;
      for (const side of [-1, 1]) {
        const ox = x + Math.cos(((dir + 90 * side) * Math.PI) / 180) * (l / 2);
        const oy = y + Math.sin(((dir + 90 * side) * Math.PI) / 180) * (l / 2);
        leaves.push(`<ellipse cx="${ox.toFixed(1)}" cy="${oy.toFixed(1)}" rx="${(l / 2).toFixed(1)}" ry="2.3" transform="rotate(${(dir + 70 * side).toFixed(0)} ${ox.toFixed(1)} ${oy.toFixed(1)})"/>`);
      }
    }
    fronds.push(`<g fill="${color}"><path d="M60 70 Q${mx.toFixed(1)} ${my.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}" fill="none" stroke="${color}" stroke-width="2"/>${leaves.join('')}</g>`);
  };
  make(158, 52, '#3f8a35');
  make(22, 52, '#3f8a35');
  make(122, 56, '#4f9a3c');
  make(58, 56, '#4f9a3c');
  make(90, 52, '#66b84b');
  return svgDoc(120, 70, fronds.join(''));
}

function berryBush() {
  const berries = [[40, 40, '#d93a3a'], [70, 30, '#4a5bd1'], [98, 44, '#d93a3a'], [120, 58, '#4a5bd1'], [58, 60, '#d93a3a'], [88, 64, '#4a5bd1'], [110, 30, '#d93a3a']];
  return svgDoc(150, 84, `
    ${crown([[36, 58, 26], [66, 40, 30], [102, 42, 30], [126, 60, 22], [80, 64, 24]], { base: '#3f8a3a', shade: '#2f7030', light: '#57a84f', dots: '#7cc673', line: '#24562a' })}
    ${berries.map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="4" fill="${c}"/><circle cx="${x - 1.2}" cy="${y - 1.2}" r="1.2" fill="#fff" opacity="0.8"/>`).join('')}`);
}

function mossyRock() {
  return svgDoc(110, 60, `
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a7a39a"/><stop offset="1" stop-color="#7e7a72"/></linearGradient></defs>
    <path d="M6 58 C4 36 22 14 50 12 C78 10 104 30 104 58 Z" fill="url(#g)" ${attrs('#5f5b54', 2.5)}/>
    <path d="M20 26 C30 12 60 6 82 18 C74 22 66 20 58 24 C48 18 36 26 20 26 Z" fill="${MOSS}"/>
    <path d="M70 36 l6 9 l-3 8" fill="none" stroke="#66625a" stroke-width="2"/>`);
}

function logPile() {
  const end = (x, y) => `<circle cx="${x}" cy="${y}" r="15" fill="${WOOD_CUT}" ${attrs('#6b4325', 2.5)}/><circle cx="${x}" cy="${y}" r="9" fill="none" stroke="${RINGS}" stroke-width="2"/><circle cx="${x}" cy="${y}" r="3.5" fill="${RINGS}"/>`;
  return svgDoc(150, 76, `
    <rect x="16" y="30" width="118" height="44" rx="6" fill="${BARK}" ${attrs('#4a2f1c', 2.5)}/>
    ${end(34, 58)}${end(66, 58)}${end(98, 58)}${end(50, 32)}${end(82, 32)}${end(66, 10 + 4)}`);
}

function hunterStand() {
  const pole = (x1, y1, x2, y2) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${WOOD}" stroke-width="9" stroke-linecap="round"/><path d="M${x1} ${y1} L${x2} ${y2}" stroke="#9a6a3a" stroke-width="5" stroke-linecap="round"/>`;
  const rungs = [200, 178, 156, 134, 112].map((y) => `<path d="M${54 + (228 - y) * 0.03} ${y} H${66 - (228 - y) * 0.03}" stroke="#9a6a3a" stroke-width="3"/>`).join('');
  return svgDoc(120, 230, `
    ${pole(26, 228, 42, 92)}${pole(94, 228, 78, 92)}
    <path d="M34 170 L86 130 M86 170 L34 130" stroke="#8a5a33" stroke-width="4"/>
    <path d="M52 228 L56 96 M68 228 L64 96" stroke="#8a5a33" stroke-width="3.5"/>
    ${rungs}
    <rect x="28" y="50" width="64" height="46" fill="#a87444" ${attrs(WOOD, 2.5)}/>
    <path d="M28 66 H92 M28 82 H92" stroke="#8a5a33" stroke-width="2"/>
    <rect x="40" y="58" width="40" height="15" fill="#3a2414"/>
    <path d="M18 54 L60 22 L102 54 Z" fill="#6b4325" ${attrs('#4a2f1c', 2.5)}/>`);
}

function deer() {
  return svgDoc(90, 80, `
    <g ${attrs('#5a3a22', 2)}>
      <path d="M22 78 L24 54 M30 78 L32 54 M56 78 L56 52 M64 78 L62 52" fill="none" stroke-width="4"/>
      <ellipse cx="44" cy="48" rx="26" ry="12" fill="#b07a46"/>
      <path d="M60 42 L68 22 L76 22 L72 44 Z" fill="#b07a46"/>
      <ellipse cx="76" cy="20" rx="9" ry="6" fill="#b07a46"/>
      <path d="M70 14 l-4 -10 M66 8 l-6 -2 M74 12 l2 -10 M75 6 l6 -2" fill="none"/>
    </g>
    <ellipse cx="19" cy="46" rx="4" ry="5" fill="#fff"/>
    <circle cx="79" cy="18" r="1.4" fill="#2b1a10"/>`);
}

function railFence() {
  return svgDoc(160, 62, `
    <path d="M0 22 H160 M0 40 H160" stroke="${WOOD}" stroke-width="9" stroke-linecap="round"/>
    <path d="M0 22 H160 M0 40 H160" stroke="#a87444" stroke-width="5" stroke-linecap="round"/>
    <rect x="6" y="8" width="11" height="54" rx="3" fill="#8a5a33" ${attrs(WOOD, 2.5)}/>`);
}

function sunbeam() {
  return svgDoc(220, 420, `
    <defs><linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffbe0" stop-opacity="0.7"/><stop offset="1" stop-color="#fffbe0" stop-opacity="0"/></linearGradient></defs>
    <path d="M92 0 L128 0 L206 420 L30 420 Z" fill="url(#b)"/>`);
}

// ---- Things Frankie can bump into or stand on ----

function stump() {
  return svgDoc(60, 52, `
    <path d="M6 50 Q12 44 14 36 L46 36 Q48 44 54 50 Z" fill="${BARK_DARK}" ${line(2.5)}/>
    <path d="M12 48 L15 15 L45 15 L48 48 Z" fill="${BARK}" ${line()}/>
    <path d="M22 20 V44 M31 22 V46 M39 19 V43" stroke="${BARK_DARK}" stroke-width="2.2" stroke-linecap="round"/>
    <ellipse cx="30" cy="15" rx="16" ry="6.5" fill="${WOOD_CUT}" ${line()}/>
    <ellipse cx="30" cy="15" rx="10" ry="4" fill="none" stroke="${RINGS}" stroke-width="1.8"/>
    <ellipse cx="30" cy="15" rx="4" ry="1.7" fill="${RINGS}"/>
    <path d="M12 34 Q8 26 15 24 Q18 30 16 36 Z" fill="${MOSS}"/>`);
}

function log() {
  return svgDoc(104, 44, `
    <rect x="4" y="9" width="88" height="32" rx="14" fill="${BARK}" ${line()}/>
    <path d="M18 18 H70 M14 28 H82 M24 36 H64" stroke="${BARK_DARK}" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M40 10 L44 2 L51 4 L48 11" fill="${BARK}" ${line(2.5)}/>
    <ellipse cx="90" cy="25" rx="10" ry="16" fill="${WOOD_CUT}" ${line()}/>
    <ellipse cx="90" cy="25" rx="6" ry="10" fill="none" stroke="${RINGS}" stroke-width="1.8"/>
    <circle cx="90" cy="25" r="2.2" fill="${RINGS}"/>
    <path d="M10 18 Q16 8 30 10 Q24 16 12 22 Z" fill="${MOSS}"/>`);
}

// Hedgehog facing left; two frames for walking.
function hedgehog(step) {
  const spikes = [];
  const cx = 36;
  const cy = 32;
  for (let i = 0; i <= 18; i++) {
    const a = Math.PI * (0.98 - (0.96 * i) / 18);
    const r = i % 2 ? 0.78 : 1;
    spikes.push([cx + Math.cos(a) * 22 * r, cy - Math.sin(a) * 22 * r]);
  }
  const back = `M${spikes.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L')} L56 35 L16 35 Z`;
  const feet = step ? [[24, 38], [44, 38]] : [[28, 38], [40, 38]];
  return svgDoc(60, 42, `
    ${feet.map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="4.5" ry="3" fill="#4a2f1c"/>`).join('')}
    <path d="${back}" fill="#6b4a2e" ${line(2.5)}/>
    <path d="M24 22 l4 -6 M34 18 l2 -7 M44 20 l3 -6 M30 28 l3 -5 M40 27 l3 -5" stroke="#9a7a58" stroke-width="2" stroke-linecap="round"/>
    <path d="M22 24 C14 24 4 29 4 33 C4 37 12 38 22 37 C26 34 26 27 22 24 Z" fill="#e8c497" ${line(2.5)}/>
    <circle cx="4.8" cy="33" r="2.8" fill="#1b120b"/>
    <circle cx="15" cy="29" r="2" fill="#1b120b"/><circle cx="15.6" cy="28.4" r="0.7" fill="#fff"/>
    <circle cx="22" cy="24" r="3" fill="#d9b080" ${line(1.8)}/>`);
}

// One block of a floating platform (Mario style), wood with a mossy top.
function blockWood() {
  return svgDoc(48, 32, `
    <rect x="1.5" y="1.5" width="45" height="29" rx="5" fill="#c08a52"/>
    <path d="M4 15 H44 M4 23 H44" stroke="#9a6532" stroke-width="2"/>
    <circle cx="8" cy="19" r="1.4" fill="#6b4325"/><circle cx="40" cy="19" r="1.4" fill="#6b4325"/>
    <path d="M1.5 10 V6.5 Q1.5 1.5 6.5 1.5 H41.5 Q46.5 1.5 46.5 6.5 V10 Q42 13 38 10 Q34 14 29 10 Q24 13 19 10 Q14 14 9 10 Q5 13 1.5 10 Z" fill="${MOSS}"/>
    <path d="M8 4.5 H40" stroke="#9fd67a" stroke-width="2" stroke-linecap="round"/>
    <rect x="1.5" y="1.5" width="45" height="29" rx="5" fill="none" ${line()}/>`);
}

// Stream in a gap: middle part (tiles sideways) and the bank on the left (mirrored for the right).
function gapForestMid() {
  return svgDoc(64, 80, `
    <defs>
      <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a2f1c"/><stop offset="1" stop-color="#2e1c10"/></linearGradient>
      <linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5fb4ff"/><stop offset="1" stop-color="#2a63a8"/></linearGradient>
    </defs>
    <rect width="64" height="80" fill="url(#wall)"/>
    <rect y="30" width="64" height="50" fill="url(#water)"/>
    <rect y="30" width="64" height="3" fill="#cfeeff"/>
    <path d="M6 44 Q14 41 22 44 M36 58 Q44 55 52 58 M20 70 Q26 68 32 70" fill="none" stroke="#e6f6ff" stroke-width="2" stroke-linecap="round" opacity="0.8"/>`);
}

function gapForestBank() {
  return svgDoc(18, 80, `
    <path d="M4 10 Q10 30 8 52 Q10 66 6 80 H18 V8 Z" fill="#6b4325"/>
    <path d="M0 0 H18 V12 Q16 18 12 14 Q8 12 0 13 Z" fill="#4f9a3c"/>
    <path d="M17 6 Q11 28 13 50 Q15 66 11 80" fill="none" ${line()}/>
    <path d="M18 4 Q15 12 11 13" fill="none" ${line(2.5)}/>`);
}

const PIECES = {
  'hills-far-forest': [GAME_WIDTH, 220, hillsFarForest],
  'hills-near-forest': [GAME_WIDTH, 140, hillsNearForest],
  'ground-forest': [256, 80, groundForest],
  'tree-fir': [150, 300, fir],
  'tree-beech': [230, 280, beech],
  fern: [120, 70, fern],
  'berry-bush': [150, 84, berryBush],
  'mossy-rock': [110, 60, mossyRock],
  'log-pile': [150, 76, logPile],
  'hunter-stand': [120, 230, hunterStand],
  deer: [90, 80, deer],
  'rail-fence': [160, 62, railFence],
  sunbeam: [220, 420, sunbeam],
  stump: [60, 52, stump],
  log: [104, 44, log],
  hedgehog: [60, 42, () => hedgehog(0)],
  'hedgehog-2': [60, 42, () => hedgehog(1)],
  'block-wood': [48, 32, blockWood],
  'gap-forest-mid': [64, 80, gapForestMid],
  'gap-forest-bank': [18, 80, gapForestBank],
};

export function forestSvgs() {
  return Object.fromEntries(Object.entries(PIECES).map(([key, [w, h, draw]]) => [key, { w, h, svg: draw() }]));
}

export function preloadForest(scene) {
  for (const [key, { w, h, svg }] of Object.entries(forestSvgs())) loadSvg(scene, key, svg, w, h);
}

export function createForestAnims(scene) {
  scene.anims.create({ key: 'hedgehog-walk', frames: [{ key: 'hedgehog' }, { key: 'hedgehog-2' }], frameRate: 6, repeat: -1 });
}
