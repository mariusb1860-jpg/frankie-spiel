import { GAME_WIDTH, GAME_HEIGHT } from '../config.js';
import { loadSvg, svgDoc } from './svg.js';
import { attrs, crown, ridge, ridgeY } from './scenery.js';
import { HU_GREEN, HU_RED } from './puszta.js';

// Level 10, Visegrád castle at the Danube bend at sunset (grown-ups, only loaded with ?paprika).
// The warmest world of the game: golden-pink light from the right, violet hills far away.
// Everything here is background: soft outlines, never the strong OUTLINE.

const f1 = (n) => n.toFixed(1);
const polygon = (pts, w, h) => `M0 ${h} ${pts.map(([x, y]) => `L${f1(x)} ${f1(y)}`).join(' ')} L${w} ${h} Z`;

// Landmarks stand on the far bank: this much empty space below their foot puts the foot
// on the bank line of hills-far-visegrad (far pictures sit at GROUND_Y - 45, scale ~0.56).
const RIVER = 125;
const STONE = '#efd0a6'; // sun-lit stone
const STONE_LIGHT = '#fbe6c4';
const STONE_SHADE = '#cfa092';
const STONE_LINE = '#936a62';
const ROOF = '#c9553f';
const ROOF_LIGHT = '#e57a58';
const ROOF_LINE = '#85322e';
const WOOD = '#b8814f';
const WOOD_LIGHT = '#d29c66';
const WOOD_LINE = '#6e482c';
const SLOT = '#6b4a4a';
const GOLD = '#f2b83c';
const GOLD_LINE = '#9a6e1c';
const LEAF = { line: '#5f7f45', base: '#86a550', shade: '#5f8545', light: '#bccb60', dots: '#e0e07c' };
const PINE = '#4b7a58';
const PINE_LIGHT = '#79a35e';
const PINE_LINE = '#2f5240';

// ---- Small helpers ----

// A slim spire standing on (x, y), w wide at its foot and h high.
const spire = (x, y, w, h) => `M${f1(x - w / 2)} ${f1(y)} L${f1(x)} ${f1(y - h)} L${f1(x + w / 2)} ${f1(y)} Z`;

// A pointed (Gothic) window w wide, from its tip at y down to y + h.
const gothic = (x, y, w, h) =>
  `M${f1(x)} ${f1(y + h)} V${f1(y + w * 0.9)} Q${f1(x)} ${f1(y + w * 0.2)} ${f1(x + w / 2)} ${f1(y)} Q${f1(x + w)} ${f1(y + w * 0.2)} ${f1(x + w)} ${f1(y + w * 0.9)} V${f1(y + h)} Z`;

// Square battlements (one path) along y from x0 to x1: merlons m wide, gaps g, h high.
function battlements(x0, x1, y, fill, line, m = 9, g = 6, h = 8) {
  const out = [];
  for (let x = x0; x + m <= x1 + 0.5; x += m + g) out.push(`M${f1(x)} ${y + 1} V${y - h} H${f1(x + m)} V${y + 1}`);
  return `<path d="${out.join(' ')}" fill="${fill}" ${attrs(line, 1.2)}/>`;
}

// Arrow slits in a row.
const slits = (xs, y, h = 11) => `<path d="${xs.map((x) => `M${x} ${y} v${h}`).join(' ')}" stroke="${SLOT}" stroke-width="2.6" stroke-linecap="round"/>`;

// A waving three-coloured Hungarian pennant on a pole at (x, y), h high, flying to the right (dir 1) or left (-1).
function flag(x, y, h, len = 22, dir = 1) {
  const t = y - h;
  const band = (k, color) => {
    const y0 = t + k * (len * 0.2);
    const y1 = y0 + len * 0.2;
    const e = x + dir * len;
    const m = x + dir * len * 0.5;
    return `<path d="M${x} ${f1(y0)} C${f1(m - dir * 4)} ${f1(y0 - 3)} ${f1(m + dir * 4)} ${f1(y0 + 3)} ${f1(e)} ${f1(y0)} V${f1(y1)} C${f1(m + dir * 4)} ${f1(y1 + 3)} ${f1(m - dir * 4)} ${f1(y1 - 3)} ${x} ${f1(y1)} Z" fill="${color}"/>`;
  };
  return `<path d="M${x} ${y} V${t - 3}" stroke="#8a7a68" stroke-width="2" stroke-linecap="round"/>
    <circle cx="${x}" cy="${t - 4}" r="2.2" fill="${GOLD}"/>
    ${band(0, HU_RED)}${band(1, '#ffffff')}${band(2, HU_GREEN)}`;
}

// A hanging swallow-tail pennant of one colour with a lighter edge.
const pennant = (x, y, len, h, color, dir = 1) =>
  `<path d="M${x} ${y} L${x + dir * len} ${y + h * 0.12} L${x + dir * len * 0.78} ${y + h * 0.5} L${x + dir * len} ${y + h * 0.88} L${x} ${y + h} Z" fill="${color}" ${attrs('#7a5a4a', 0.9)}/>`;

// Soft warm ground shadow under a piece.
const groundShadow = (cx, y, rx) => `<ellipse cx="${cx}" cy="${y}" rx="${rx}" ry="${f1(rx * 0.09)}" fill="#6b4a3a" opacity="0.18"/>`;

// Small round trees along a ridge; `n` evenly spaced trees per tile width so the tile repeats cleanly.
function treeRow(w, pts, n, dy, r0, colors) {
  const out = [];
  const step = w / n;
  for (let i = -1; i <= n; i++) {
    const k = ((i % n) + n) % n;
    const x = i * step + ((k * 37) % 17);
    const y = ridgeY(pts, (((x % w) + w) % w)) + dy + ((k * 13) % 9);
    const r = r0 + ((k * 7) % 5);
    out.push(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="${colors[k % colors.length]}"/><circle cx="${f1(x - r * 0.3)}" cy="${f1(y - r * 0.3)}" r="${f1(r * 0.55)}" fill="${colors[(k + 1) % colors.length]}" opacity="0.8"/>`);
  }
  return out.join('');
}

// ---- Sky ----

// Evening sky: violet-blue on top, pink and orange towards the horizon, a warm glow
// around the sun (backdrop.js puts the sun at 830, 95) and a few tinted cloud streaks.
function skySunset() {
  const streak = (x, y, w, h, c, o) => `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${h}" fill="${c}" opacity="${o}"/>`;
  return svgDoc(GAME_WIDTH, GAME_HEIGHT, `
    <defs>
      <linearGradient id="sk" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#8c97d6"/><stop offset="0.3" stop-color="#b9a6d6"/>
        <stop offset="0.52" stop-color="#f3b4b2"/><stop offset="0.75" stop-color="#ffd09a"/><stop offset="1" stop-color="#ffe6b8"/>
      </linearGradient>
      <radialGradient id="sg" gradientUnits="userSpaceOnUse" cx="830" cy="95" r="460">
        <stop offset="0" stop-color="#ffe0a8" stop-opacity="0.85"/><stop offset="0.45" stop-color="#ffc79a" stop-opacity="0.4"/><stop offset="1" stop-color="#ffc79a" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${GAME_WIDTH}" height="${GAME_HEIGHT}" fill="url(#sk)"/>
    <rect width="${GAME_WIDTH}" height="${GAME_HEIGHT}" fill="url(#sg)"/>
    ${streak(150, 205, 190, 11, '#ffb7a4', 0.5)}${streak(205, 190, 110, 6, '#ffe0c2', 0.6)}
    ${streak(520, 245, 240, 12, '#ffb09e', 0.45)}${streak(580, 230, 120, 6, '#ffe2c4', 0.55)}
    ${streak(840, 195, 130, 9, '#ffc4a4', 0.5)}${streak(330, 290, 170, 8, '#ffd2a6', 0.5)}
    ${streak(760, 300, 200, 10, '#ffbba0', 0.4)}${streak(80, 320, 120, 7, '#ffd9b0', 0.5)}`);
}

// ---- Background tiles ----

// Far away: the Danube at its bend between the forested Pilis and Börzsöny mountains, the
// river glowing in sunset colours, a cape of woods reaching into the water.
function danubeBend() {
  const w = GAME_WIDTH;
  const bank = 120;
  const quay = 190;
  const back = ridge(w, 58, [[22, 1, 0.6], [10, 3, 1.4], [4, 8]]);
  const midR = ridge(w, 86, [[14, 2, 2.1], [7, 5, 0.5], [3, 11, 1]]);
  const front = ridge(w, 106, [[9, 2, 1], [5, 6, 0.3]]);
  const houses = [];
  for (let i = 0; i < 6; i++) {
    const x = 70 + i * 160 + ((i * 29) % 30);
    houses.push(`<rect x="${x - 6}" y="${bank - 9}" width="12" height="7" fill="#f3e3cc"/><path d="M${x - 8} ${bank - 9} L${x} ${bank - 15} L${x + 8} ${bank - 9} Z" fill="#d0654a"/>`);
  }
  const capes = [200, 650].map((x) => `
    <path d="M${x - 110} ${bank - 4} Q${x - 70} ${bank - 22} ${x - 20} ${bank - 20} Q${x + 40} ${bank - 24} ${x + 80} ${bank + 6} Q${x + 70} ${bank + 24} ${x + 10} ${bank + 28} Q${x - 50} ${bank + 26} ${x - 100} ${bank + 4} Z" fill="#7d9a58"/>
    <path d="M${x - 100} ${bank + 4} Q${x - 50} ${bank + 26} ${x + 10} ${bank + 28} Q${x + 70} ${bank + 24} ${x + 80} ${bank + 6}" fill="none" stroke="#fbe0a8" stroke-width="3" opacity="0.8"/>
    ${[-80, -55, -30, -5, 20, 45, 66].map((dx, i) => `<circle cx="${x + dx}" cy="${bank - 6 + ((i * 7) % 12)}" r="${9 + (i % 3) * 2}" fill="${i % 2 ? '#98b45e' : '#6f8f4c'}"/>`).join('')}`).join('');
  const glitter = [];
  [[134, 34, 1.6, 0.65], [152, 46, 2, 0.55], [170, 60, 2.4, 0.45]].forEach(([y, gap, sw, op], r) => {
    for (let x = 14 + ((r * 31) % gap); x < w - 20; x += gap + ((x * 7) % 15)) {
      glitter.push(`<path d="M${x} ${y} q${f1(gap * 0.17)} ${f1(-gap * 0.07)} ${f1(gap * 0.34)} 0" fill="none" stroke="#fff3d0" stroke-width="${sw}" stroke-linecap="round" opacity="${op}"/>`);
    }
  });
  return svgDoc(w, 220, `
    <defs>
      <linearGradient id="rv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd596"/><stop offset="0.45" stop-color="#f5a58c"/><stop offset="1" stop-color="#c58aae"/></linearGradient>
      <linearGradient id="bk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c5b89c"/><stop offset="1" stop-color="#9fae5a"/></linearGradient>
    </defs>
    <path d="${polygon(back, w, 100)}" fill="#c4a2c4"/>
    <path d="${polygon(midR, w, 110)}" fill="#a18fb8"/>
    <path d="M${midR.map(([x, y]) => `${x} ${f1(y)}`).join(' L')}" fill="none" stroke="#ffc9a0" stroke-width="2.4" opacity="0.7"/>
    <path d="${polygon(front, w, bank + 2)}" fill="#869f66"/>
    ${treeRow(w, front, 24, 10, 10, ['#6f8f55', '#8fae5c', '#7a9a58'])}
    ${houses.join('')}
    <rect y="${bank}" width="${w}" height="${quay - bank}" fill="url(#rv)"/>
    ${glitter.join('')}
    ${capes}
    <rect y="${quay}" width="${w}" height="${220 - quay}" fill="url(#bk)"/>
    <path d="M0 ${quay} H${w}" stroke="#e8d8b0" stroke-width="3"/>`);
}

// Right behind Frankie: the wooded slopes on Frankie's side of the river, lit by the low sun.
function woodedSlope() {
  const w = GAME_WIDTH;
  const top = ridge(w, 78, [[4, 2, 0.6], [2, 6, 1.3]]);
  const stripes = [];
  for (let x = 0; x < w; x += 64) stripes.push(`<rect x="${x}" y="84" width="32" height="56" fill="#ffe9a8" opacity="0.1"/>`);
  return svgDoc(w, 140, `
    <defs><linearGradient id="ws" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b2bf5e"/><stop offset="1" stop-color="#86a24c"/></linearGradient></defs>
    ${treeRow(w, top, 20, -4, 15, ['#7d9a4c', '#a1b455', '#6a8a48'])}
    <path d="${polygon(top, w, 140)}" fill="url(#ws)"/>
    <path d="M${top.map(([x, y]) => `${x} ${f1(y + 3)}`).join(' L')}" fill="none" stroke="#dbe08a" stroke-width="3" opacity="0.8"/>
    ${stripes.join('')}`);
}

// ---- Far: the castle landmarks, riverside woods, boats and a hussar ----

// The Upper Castle (Fellegvár) on its hilltop: curtain wall with battlements, a square tower,
// a round tower and a small tower, walls running down the slope, a Hungarian flag.
function fellegvar() {
  const W = 340;
  const FOOT = 220;
  const line = attrs(STONE_LINE, 1.5);
  const roofLine = attrs(ROOF_LINE, 1.4);
  const hill = 'M0 220 C30 205 60 158 100 134 C140 112 205 108 245 128 C285 146 312 190 340 220 Z';
  const trees = [[30, 200, 10], [58, 178, 11], [80, 156, 9], [270, 160, 10], [296, 188, 11], [316, 206, 9], [112, 170, 8], [226, 168, 8]];
  const tree = ([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#7a9a50"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.3}" r="${f1(r * 0.55)}" fill="#a6bb5c"/>`;
  const sideWall = (x0, y0, x1, y1) => `<path d="M${x0} ${y0} L${x1} ${y1}" stroke="${STONE_LINE}" stroke-width="11" stroke-linecap="round"/><path d="M${x0} ${y0} L${x1} ${y1}" stroke="${STONE}" stroke-width="7.5" stroke-linecap="round"/>`;
  return svgDoc(W, FOOT + RIVER, `
    <path d="${hill}" fill="#9fb35e" ${attrs('#7d9654', 1.5)}/>
    <path d="M190 112 C230 110 280 140 340 220 L300 220 C270 170 240 140 190 112 Z" fill="#c4d072" opacity="0.7"/>
    ${trees.map(tree).join('')}
    ${sideWall(98, 126, 44, 196)}${sideWall(250, 128, 302, 192)}
    <rect x="96" y="90" width="152" height="40" fill="${STONE}" ${line}/>
    <rect x="96" y="90" width="26" height="40" fill="${STONE_SHADE}" opacity="0.6"/>
    ${battlements(98, 246, 90, STONE_LIGHT, STONE_LINE)}
    ${slits([118, 140, 190, 214, 232], 100, 12)}
    <rect x="160" y="114" width="22" height="16" fill="${SLOT}" ${attrs(STONE_LINE, 1)}/>
    <path d="M160 130 V120 Q171 108 182 120 V130 Z" fill="#5e4040"/>
    <rect x="80" y="44" width="38" height="86" fill="${STONE}" ${line}/>
    <rect x="80" y="44" width="12" height="86" fill="${STONE_SHADE}" opacity="0.6"/>
    <path d="M76 46 H122" stroke="${STONE_LINE}" stroke-width="4"/>
    <path d="${spire(99, 44, 48, 36)}" fill="${ROOF}" ${roofLine}/>
    <path d="M99 44 L111 44 L99 8 Z" fill="${ROOF_LIGHT}" opacity="0.8"/>
    ${slits([92, 106], 56, 12)}${slits([99], 82, 11)}
    <rect x="148" y="52" width="46" height="78" fill="${STONE}" ${line}/>
    <rect x="148" y="52" width="14" height="78" fill="${STONE_SHADE}" opacity="0.6"/>
    ${battlements(146, 196, 52, STONE_LIGHT, STONE_LINE, 8, 6, 7)}
    <path d="M148 94 H194" stroke="${STONE_LINE}" stroke-width="1.2" opacity="0.6"/>
    ${slits([164, 178], 62, 12)}${slits([171], 100, 11)}
    <rect x="226" y="62" width="30" height="68" fill="${STONE}" ${line}/>
    <rect x="226" y="62" width="9" height="68" fill="${STONE_SHADE}" opacity="0.6"/>
    <path d="${spire(241, 62, 38, 28)}" fill="${ROOF}" ${roofLine}/>
    ${slits([236, 247], 74, 11)}
    ${flag(171, 52, 30, 24, 1)}
    ${flag(241, 34, 22, 18, 1)}`);
}

// Solomon's Tower (Salamon-torony): the six-sided keep of the Lower Castle, stepped
// base, a ledge with small corner turrets, a pointed roof, ruined walls with trees around it.
function salamonTower() {
  const W = 200;
  const FOOT = 230;
  const line = attrs(STONE_LINE, 1.5);
  const roofLine = attrs(ROOF_LINE, 1.4);
  const tree = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#7a9a50"/><circle cx="${f1(x - r * 0.3)}" cy="${f1(y - r * 0.3)}" r="${f1(r * 0.55)}" fill="#a6bb5c"/>`;
  return svgDoc(W, FOOT + RIVER, `
    <path d="M0 230 C20 214 40 196 70 190 H130 C160 196 182 214 200 230 Z" fill="#9fb35e" ${attrs('#7d9654', 1.5)}/>
    ${tree(26, 212, 12)}${tree(176, 212, 12)}${tree(50, 200, 9)}${tree(152, 200, 9)}
    <path d="M18 218 V196 H48 V190 H66 V220 Z" fill="${STONE}" ${line}/>
    <path d="M134 220 V190 H152 V196 H182 V218 Z" fill="${STONE}" ${line}/>
    ${battlements(18, 46, 196, STONE_LIGHT, STONE_LINE, 7, 5, 6)}${battlements(154, 182, 196, STONE_LIGHT, STONE_LINE, 7, 5, 6)}
    <path d="M52 226 L58 168 H142 L148 226 Z" fill="${STONE}" ${line}/>
    <path d="M52 226 L58 168 H78 L74 226 Z" fill="${STONE_SHADE}" opacity="0.6"/>
    <path d="M90 226 V206 Q100 194 110 206 V226 Z" fill="#5e4040"/>
    <path d="M62 176 L66 100 H134 L138 176 Z" fill="${STONE}" ${line}/>
    <path d="M66 100 H134" stroke="${STONE_LINE}" stroke-width="1.2"/>
    <path d="M62 176 L66 100 H92 L90 176 Z" fill="${STONE_SHADE}" opacity="0.55"/>
    <path d="M112 100 L114 176" stroke="${STONE_LINE}" stroke-width="1.2" opacity="0.5"/>
    <path d="M70 100 L74 56 H126 L130 100 Z" fill="${STONE}" ${line}/>
    <path d="M70 100 L74 56 H92 L88 100 Z" fill="${STONE_SHADE}" opacity="0.55"/>
    <path d="M100 56 V100 M114 56 L116 100" stroke="${STONE_LINE}" stroke-width="1.1" opacity="0.5"/>
    <path d="M68 58 H132 L128 50 H72 Z" fill="${STONE_LIGHT}" ${line}/>
    ${slits([92, 108, 124], 112, 14)}${slits([84, 116], 140, 12)}${slits([100], 70, 14)}${slits([84, 116], 66, 11)}
    <path d="${spire(76, 50, 16, 24)}" fill="${ROOF}" ${roofLine}/><path d="${spire(124, 50, 16, 24)}" fill="${ROOF}" ${roofLine}/>
    <path d="M78 50 L100 6 L122 50 Z" fill="${ROOF}" ${roofLine}/>
    <path d="M100 6 L122 50 L110 50 Z" fill="${ROOF_LIGHT}" opacity="0.8"/>
    ${flag(100, 6, 24, 20, 1)}`);
}

// A dark conifer lit warm on its right side; the forested slopes of the Pilis.
function pine() {
  const tiers = [[18, 70, 90], [48, 56, 74], [78, 44, 60], [106, 34, 46]];
  const bits = tiers.map(([y, hw, w2], i) => `
    <path d="M${55 - w2 / 2} ${y + 62} L55 ${y - 14 + i * 0} L${55 + w2 / 2} ${y + 62} Z" fill="${PINE}" ${attrs(PINE_LINE, 1.3)}/>`);
  const lit = tiers.map(([y, hw, w2]) => `<path d="M55 ${y - 12} L${55 + w2 / 2} ${y + 62} L${55 + w2 / 6} ${y + 62} Z" fill="${PINE_LIGHT}" opacity="0.7"/>`);
  return svgDoc(110, 210, `
    <rect x="50" y="150" width="9" height="56" fill="#7a5436" ${attrs('#5a3a22', 1.2)}/>
    ${[...bits].reverse().join('')}${lit.join('')}
    ${groundShadow(55, 206, 30)}`);
}

// A little sailing boat on the Danube, warm light on the sail.
function sailboat() {
  return svgDoc(170, 190, `
    <path d="M10 160 q8 -3 16 0 M56 166 q8 -3 16 0 M110 162 q8 -3 16 0 M140 168 q8 -3 16 0" fill="none" stroke="#fff3d0" stroke-width="2.2" stroke-linecap="round" opacity="0.8"/>
    <path d="M82 20 V146" stroke="#8a6a4a" stroke-width="3.2" stroke-linecap="round"/>
    <path d="M86 26 Q128 80 140 138 H86 Z" fill="#fff0d0" ${attrs('#b08a6a', 1.4)}/>
    <path d="M86 26 Q104 70 112 138 H86 Z" fill="#ffd9a6" opacity="0.8"/>
    <path d="M78 52 Q50 96 38 136 H78 Z" fill="#f3b69a" ${attrs('#b08a6a', 1.4)}/>
    <path d="M24 142 H156 Q148 160 130 160 H48 Q30 160 24 142 Z" fill="#a8603e" ${attrs('#6e3a24', 1.8)}/>
    <path d="M30 148 H150" stroke="#f6e3c4" stroke-width="3"/>
    <path d="M82 20 L98 24 L82 28 Z" fill="${HU_RED}"/>`);
}

// A hussar on horseback with fur cap, plume, sabre and a lance with a pennant (side view, facing right).
function hussar() {
  const HORSE = '#8a5a3a';
  const HORSE_LINE = '#4e3020';
  const horse = `
    <path d="M44 100 Q38 112 44 128 L48 128 L50 106 Z" fill="${HORSE}" ${attrs(HORSE_LINE, 1.4)}/>
    <path d="M60 130 L58 168 L66 168 L70 134 Z M82 132 L88 168 L96 168 L92 130 Z M112 128 L122 168 L130 168 L126 124 Z M128 124 L142 160 L150 158 L140 120 Z" fill="${HORSE}" ${attrs(HORSE_LINE, 1.4)}/>
    <path d="M56 166 h14 v6 h-14 Z M86 166 h14 v6 h-14 Z M118 166 h14 v6 h-14 Z M142 156 h12 v6 h-12 Z" fill="#3a2a22"/>
    <path d="M46 104 Q46 88 76 88 H120 Q144 88 146 104 Q148 130 126 134 H68 Q46 130 46 104 Z" fill="${HORSE}" ${attrs(HORSE_LINE, 1.6)}/>
    <path d="M122 96 Q142 86 154 62 L170 66 Q172 82 160 100 L146 112 Z" fill="${HORSE}" ${attrs(HORSE_LINE, 1.6)}/>
    <path d="M156 60 Q168 50 180 60 Q186 70 178 80 Q168 82 164 74 Z" fill="${HORSE}" ${attrs(HORSE_LINE, 1.4)}/>
    <circle cx="170" cy="62" r="2" fill="#2a1a12"/>
    <path d="M148 62 Q142 74 134 92 Q150 80 156 66 Z" fill="#3a2a22"/>
    <path d="M46 104 Q30 106 28 128 Q38 120 48 116 Z" fill="#3a2a22"/>
    <path d="M70 92 H122 Q124 108 104 112 H86 Q70 110 70 92 Z" fill="${GOLD}" opacity="0.9"/>
    <path d="M70 92 H122" stroke="${GOLD_LINE}" stroke-width="1.6"/>`;
  const rider = `
    <path d="M92 90 Q90 52 100 40 H116 Q124 52 122 90 Z" fill="${HU_RED}" ${attrs('#7a2430', 1.4)}/>
    <path d="M96 56 H118 M96 64 H118 M96 72 H118" stroke="${GOLD}" stroke-width="1.6"/>
    <path d="M94 88 L86 110 L98 112 L104 92 Z" fill="#3b4a7a" ${attrs('#222a48', 1.2)}/>
    <circle cx="108" cy="30" r="9" fill="#f0c8a0" ${attrs('#9a6a4a', 1.2)}/>
    <path d="M97 28 Q96 10 108 8 Q122 10 120 28 Q108 22 97 28 Z" fill="#4a3a36" ${attrs('#2a1e1c', 1.2)}/>
    <path d="M110 8 Q116 -6 104 -10" fill="none" stroke="#f4e8d0" stroke-width="3" stroke-linecap="round"/>
    <path d="M122 54 L134 80" stroke="#7a2430" stroke-width="7" stroke-linecap="round"/>
    <path d="M130 70 L176 34" stroke="#7a5436" stroke-width="2.8" stroke-linecap="round"/>
    <path d="M176 34 L184 28" stroke="#c8c8c8" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M160 42 L176 40 L172 46 L176 52 L158 48 Z" fill="#ffffff" ${attrs('#9a8a7a', 0.8)}/>
    <path d="M90 76 L72 112" stroke="#b8b8c0" stroke-width="2.6" stroke-linecap="round"/>`;
  return svgDoc(200, 190, `${groundShadow(100, 178, 70)}${horse}${rider}`);
}

// ---- Mid: trees and the fishermen's hut (zone 1) ----

// A broad oak in warm evening colours.
function oak() {
  return svgDoc(190, 230, `
    <path d="M86 226 Q88 170 82 140 H106 Q102 170 108 226 Z" fill="#7a5436" ${attrs('#5a3a22', 1.4)}/>
    <path d="M96 150 Q70 128 56 104 M98 146 Q124 126 138 100" fill="none" stroke="#7a5436" stroke-width="7" stroke-linecap="round"/>
    ${crown([[60, 100, 40], [128, 96, 42], [96, 64, 52], [38, 128, 28], [152, 126, 30], [96, 112, 40]], LEAF)}
    ${groundShadow(96, 226, 52)}`);
}

// A weeping willow at the river, its long branches combed down.
function willow() {
  const strands = [];
  for (let i = 0; i < 17; i++) {
    const x = 34 + i * 8.6;
    const len = 70 + ((i * 29) % 40);
    strands.push(`<path d="M${f1(x)} ${86 + Math.abs(i - 8) * 1.4} Q${f1(x + (i % 2 ? 5 : -5))} ${86 + len * 0.6} ${f1(x + (i % 2 ? 2 : -2))} ${86 + len}" fill="none" stroke="${i % 2 ? '#8fb056' : '#6f9448'}" stroke-width="3.6" stroke-linecap="round"/>`);
  }
  return svgDoc(200, 220, `
    <path d="M94 216 Q98 160 90 120 H112 Q104 160 108 216 Z" fill="#7a5a3c" ${attrs('#5a3a22', 1.4)}/>
    ${crown([[64, 86, 34], [138, 84, 34], [100, 62, 44]], { ...LEAF, base: '#8cae56', light: '#c4d068' })}
    ${strands.join('')}
    ${groundShadow(100, 216, 50)}`);
}

// A small fishermen's hut with a reed roof, a net drying on its wall, a smoking chimney.
function fisherHut() {
  const reed = [];
  for (let x = 14; x < 156; x += 7) reed.push(`M${x} 74 L${x - 4} 92`);
  return svgDoc(170, 140, `
    <path d="M118 36 V16 H130 V40" fill="#c9a07a" ${attrs(WOOD_LINE, 1.2)}/>
    <path d="M124 10 Q116 0 126 -2" fill="none" stroke="#fff6e4" stroke-width="5" stroke-linecap="round" opacity="0.5" transform="translate(0 6)"/>
    <rect x="22" y="76" width="126" height="58" fill="${WOOD}" ${attrs(WOOD_LINE, 1.6)}/>
    <path d="M22 88 H148 M22 100 H148 M22 112 H148 M22 124 H148" stroke="${WOOD_LINE}" stroke-width="1" opacity="0.5"/>
    <rect x="22" y="76" width="18" height="58" fill="#8e5e36" opacity="0.5"/>
    <path d="M6 82 L85 24 L164 82 Q164 94 156 94 H14 Q6 94 6 82 Z" fill="#dfb86a" ${attrs('#8a6a2c', 1.6)}/>
    <path d="${reed.join(' ')}" stroke="#a8843c" stroke-width="1.4" opacity="0.7"/>
    <path d="M85 24 L164 82 L150 82 Z" fill="#f0cf86" opacity="0.7"/>
    <rect x="102" y="96" width="30" height="38" fill="#7a5030" ${attrs(WOOD_LINE, 1.3)}/>
    <circle cx="127" cy="116" r="2" fill="${GOLD}"/>
    <rect x="46" y="98" width="30" height="22" fill="#ffe0a0" ${attrs(WOOD_LINE, 1.5)}/>
    <path d="M61 98 V120 M46 109 H76" stroke="${WOOD_LINE}" stroke-width="1.4"/>
    <path d="M150 80 Q162 100 158 132" fill="none" stroke="#8a6a4a" stroke-width="1.4"/>
    <path d="M152 86 H162 M153 96 H163 M154 106 H164 M153 116 H162 M151 126 H160 M152 82 V132 M158 84 V130" stroke="#8a6a4a" stroke-width="1" opacity="0.8"/>
    ${groundShadow(85, 134, 70)}`);
}

// Two tall poles with a fishing net hung between them, floats and a drying fish line.
function netPoles() {
  const mesh = [];
  for (let y = 34; y < 120; y += 10) mesh.push(`M22 ${y} Q75 ${y + 16} 128 ${y}`);
  for (let x = 30; x < 125; x += 10) mesh.push(`M${x} 30 Q${x + 2} 80 ${x} 128`);
  const fish = [48, 74, 100].map((x, i) => `<path d="M${x} ${142 - i * 0} q5 -9 10 0 q-5 9 -10 0 Z" fill="#d9e0e6" ${attrs('#7a8a98', 0.8)}/><path d="M${x + 10} 142 l5 -4 v8 Z" fill="#d9e0e6"/>`);
  return svgDoc(150, 160, `
    <path d="M22 156 V6 M128 156 V6" stroke="#8a5e3c" stroke-width="6" stroke-linecap="round"/>
    <path d="M22 156 V6 M128 156 V6" stroke="#6e482c" stroke-width="1.2" opacity="0.7"/>
    <path d="${mesh.join(' ')}" fill="none" stroke="#8a7a5a" stroke-width="1" opacity="0.8"/>
    <path d="M22 28 Q75 46 128 28" fill="none" stroke="#a8683a" stroke-width="2.6"/>
    ${[30, 50, 70, 90, 110].map((x) => `<circle cx="${x}" cy="${f1(32 + 14 * Math.sin(((x - 22) / 106) * Math.PI))}" r="3.4" fill="#e8d0a0" ${attrs('#8a6a3a', 0.8)}/>`).join('')}
    <path d="M22 142 H128" stroke="#8a7a5a" stroke-width="1.4"/>
    ${fish.join('')}
    ${groundShadow(75, 157, 56)}`);
}

// ---- Mid: the castle (zone 2) ----

// A stretch of castle wall with battlements, arrow slits, a buttress and hanging pennants.
function castleWall() {
  const line = attrs(STONE_LINE, 1.6);
  const courses = [];
  for (let y = 90; y < 216; y += 12) courses.push(`M14 ${y} H246`);
  return svgDoc(260, 230, `
    <rect x="14" y="66" width="232" height="152" fill="${STONE}" ${line}/>
    <path d="${courses.join(' ')}" stroke="${STONE_LINE}" stroke-width="1" opacity="0.28"/>
    <rect x="14" y="66" width="30" height="152" fill="${STONE_SHADE}" opacity="0.5"/>
    <rect x="14" y="200" width="232" height="18" fill="#a07860" opacity="0.28"/>
    ${battlements(16, 244, 66, STONE_LIGHT, STONE_LINE, 14, 10, 12)}
    <path d="M14 70 H246" stroke="${STONE_LINE}" stroke-width="3"/>
    ${slits([64, 118, 170, 216], 92, 22)}${slits([90, 144, 196], 150, 20)}
    <rect x="96" y="166" width="52" height="52" fill="#5e4040" ${line}/>
    <path d="M96 218 V190 Q122 164 148 190 V218 Z" fill="#4a3030"/>
    <path d="M96 190 Q122 164 148 190" fill="none" stroke="${STONE_LIGHT}" stroke-width="3"/>
    <path d="M110 218 V188 M122 218 V178 M134 218 V188" stroke="#8a6a4a" stroke-width="2.4" opacity="0.8"/>
    <path d="M236 218 L246 190 V218 Z" fill="#7a9a50" opacity="0.5"/>
    ${pennant(170, 74, 26, 52, HU_RED)}${pennant(222, 74, 26, 52, HU_GREEN)}
    ${groundShadow(130, 218, 100)}`);
}

// A round corner tower with a conical roof, battlements under it and a flag on top.
function wallTower() {
  const line = attrs(STONE_LINE, 1.6);
  const courses = [];
  for (let y = 112; y < 240; y += 12) courses.push(`M20 ${y} H100`);
  return svgDoc(120, 256, `
    <rect x="20" y="96" width="80" height="148" fill="${STONE}" ${line}/>
    <path d="${courses.join(' ')}" stroke="${STONE_LINE}" stroke-width="1" opacity="0.28"/>
    <rect x="20" y="96" width="26" height="148" fill="${STONE_SHADE}" opacity="0.55"/>
    <rect x="76" y="96" width="24" height="148" fill="${STONE_LIGHT}" opacity="0.4"/>
    <rect x="14" y="90" width="92" height="10" fill="${STONE_LIGHT}" ${line}/>
    <path d="M12 92 L60 28 L108 92 Z" fill="${ROOF}" ${attrs(ROOF_LINE, 1.6)}/>
    <path d="M60 28 L108 92 L84 92 Z" fill="${ROOF_LIGHT}" opacity="0.8"/>
    ${slits([44, 60, 76], 122, 22)}${slits([60], 180, 22)}
    <path d="M52 244 V222 Q60 212 68 222 V244 Z" fill="#5e4040"/>
    ${flag(60, 30, 26, 22, 1)}
    ${groundShadow(60, 244, 40)}`);
}

// A tall standard: a pole with a long hanging banner in the national colours and a gold crest.
function bannerPole() {
  return svgDoc(90, 240, `
    <path d="M30 236 V10" stroke="#8a5e3c" stroke-width="5" stroke-linecap="round"/>
    <path d="M18 24 H72" stroke="#8a5e3c" stroke-width="4" stroke-linecap="round"/>
    <circle cx="30" cy="8" r="5" fill="${GOLD}" ${attrs(GOLD_LINE, 1)}/>
    <path d="M22 26 V150 L45 134 L68 150 V26 Z" fill="#ffffff" ${attrs('#8a7a68', 1.4)}/>
    <path d="M22 26 H68 V68 H22 Z" fill="${HU_RED}"/><path d="M22 110 V150 L45 134 L68 150 V110 Z" fill="${HU_GREEN}"/>
    <circle cx="45" cy="88" r="14" fill="${GOLD}" ${attrs(GOLD_LINE, 1.4)}/>
    <path d="M45 78 V98 M35 88 H55" stroke="#ffffff" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M22 26 V150 L45 134 L68 150 V26 Z" fill="none" ${attrs('#7a6a58', 1.2)}/>
    ${groundShadow(30, 236, 14)}`);
}

// ---- Mid: the knights' feast (zone 3) ----

// A striped tournament tent with a scalloped roof edge and a pennant.
function tent(colorA, colorB, line) {
  const wedges = [];
  const n = 8;
  const step = 170 / n;
  for (let i = 0; i < n; i += 2) wedges.push(`M95 30 L${f1(10 + i * step)} 90 H${f1(10 + (i + 1) * step)} Z`);
  const scallops = [];
  for (let i = n - 1; i >= 0; i--) scallops.push(`Q${f1(10 + (i + 0.5) * step)} 100 ${f1(10 + i * step)} 88`);
  const roof = `M10 88 L95 30 L180 88 ${scallops.join(' ')} Z`;
  return svgDoc(190, 150, `
    <defs><clipPath id="tr"><path d="${roof}"/></clipPath></defs>
    <rect x="24" y="88" width="142" height="52" fill="#f4e2c0" ${attrs(line, 1.4)}/>
    <rect x="24" y="88" width="20" height="52" fill="#e0c8a0" opacity="0.7"/>
    <path d="M76 140 V108 Q95 94 114 108 V140 Z" fill="#5a3a3a"/>
    <path d="M66 96 Q74 120 72 140 L64 140 Q64 116 58 96 Z M124 96 Q116 120 118 140 L126 140 Q126 116 132 96 Z" fill="${colorA}" opacity="0.95"/>
    <path d="${roof}" fill="${colorB}"/>
    <g clip-path="url(#tr)"><path d="${wedges.join(' ')}" fill="${colorA}"/><rect x="0" y="30" width="190" height="10" fill="#000000" opacity="0.06"/></g>
    <path d="${roof}" fill="none" ${attrs(line, 1.6)}/>
    <path d="M95 30 V6" stroke="#8a6a4a" stroke-width="2.4" stroke-linecap="round"/>
    ${pennant(96, 4, 28, 14, colorA)}
    ${groundShadow(95, 140, 78)}`);
}

// A heraldic banner between two poles: a shield with red and white stripes under a gold crown.
function heraldicBanner() {
  const stripes = [0, 2, 4, 6].map((i) => `<rect x="${24 + i * 9.5}" y="50" width="9.5" height="80" fill="${HU_RED}"/>`);
  const shield = 'M24 50 H100 V100 Q100 126 62 144 Q24 126 24 100 Z';
  return svgDoc(124, 200, `
    <defs><clipPath id="sh"><path d="${shield}"/></clipPath></defs>
    <path d="M12 196 V10 M112 196 V10" stroke="#8a5e3c" stroke-width="5" stroke-linecap="round"/>
    <circle cx="12" cy="8" r="4.5" fill="${GOLD}" ${attrs(GOLD_LINE, 1)}/><circle cx="112" cy="8" r="4.5" fill="${GOLD}" ${attrs(GOLD_LINE, 1)}/>
    <path d="M12 20 H112" stroke="#8a5e3c" stroke-width="4"/>
    <path d="M16 20 V156 L62 172 L108 156 V20 Z" fill="#f2d28a" ${attrs('#9a7a3a', 1.4)}/>
    <path d="${shield}" fill="#ffffff"/>
    <g clip-path="url(#sh)">${stripes.join('')}</g>
    <path d="${shield}" fill="none" ${attrs('#7a5a3a', 1.6)}/>
    <path d="M42 46 L44 32 L53 40 L62 28 L71 40 L80 32 L82 46 Z" fill="${GOLD}" ${attrs(GOLD_LINE, 1.2)}/>
    ${groundShadow(62, 196, 52)}`);
}

// A round straw target on a tall three-legged stand, two arrows in it. Drawn tall and thin
// so it cannot be taken for an obstacle.
function archeryTarget() {
  const rings = [[44, '#f4ead0'], [35, '#2f4f8a'], [26, '#d03a34'], [16, '#f2c040'], [6, '#d03a34']];
  return svgDoc(120, 210, `
    <path d="M60 80 L22 206 M60 80 L98 206 M60 80 V206" stroke="#8a5e3c" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path d="M38 150 H82" stroke="#8a5e3c" stroke-width="3"/>
    <circle cx="60" cy="62" r="50" fill="#d9b36a" ${attrs('#8a6a2c', 1.6)}/>
    ${rings.map(([r, c]) => `<circle cx="60" cy="62" r="${r}" fill="${c}" ${attrs('#7a5a3a', 0.8)}/>`).join('')}
    <path d="M60 62 L112 30 M63 66 L108 80" stroke="#6e482c" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M110 30 l8 -7 l-2 10 Z M106 80 l8 2 l-6 6 Z" fill="${HU_RED}"/>
    ${groundShadow(60, 206, 36)}`);
}

// ---- Near: low plants, a torch and the tournament rope ----

// Reed and bulrushes at the water.
function reeds() {
  const blade = (x, h, lean, c) => `<path d="M${x} 84 Q${x + lean * 0.4} ${84 - h * 0.6} ${x + lean} ${84 - h}" fill="none" stroke="${c}" stroke-width="3.4" stroke-linecap="round"/>`;
  const rush = (x, h, lean) => `${blade(x, h, lean, '#6f9448')}<path d="M${x + lean} ${84 - h + 12} V${84 - h - 4}" stroke="#7a4a2a" stroke-width="6.5" stroke-linecap="round"/>`;
  return svgDoc(100, 90, `
    ${blade(14, 38, -10, '#86a850')}${blade(26, 50, -6, '#6f9448')}${blade(70, 46, 8, '#86a850')}${blade(82, 36, 12, '#6f9448')}${blade(52, 44, 3, '#9ab85a')}
    ${rush(36, 66, -6)}${rush(60, 60, 7)}
    <path d="M6 86 Q50 80 94 86" fill="none" stroke="#6f9448" stroke-width="3" stroke-linecap="round"/>`);
}

// Wild flowers in the evening light: mauve, pink and gold.
function wildFlowers() {
  const f = (x, y, c) => `<path d="M${x} 62 Q${x + 2} ${y + 14} ${x} ${y}" fill="none" stroke="#6f9448" stroke-width="2.4" stroke-linecap="round"/>
    ${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="${f1(x + Math.cos((a * Math.PI) / 180) * 5)}" cy="${f1(y + Math.sin((a * Math.PI) / 180) * 5)}" rx="4.6" ry="3.2" fill="${c}" transform="rotate(${a} ${f1(x + Math.cos((a * Math.PI) / 180) * 5)} ${f1(y + Math.sin((a * Math.PI) / 180) * 5)})"/>`).join('')}
    <circle cx="${x}" cy="${y}" r="3" fill="#ffe08a"/>`;
  return svgDoc(90, 68, `
    <path d="M6 64 Q22 52 42 62 Q64 50 84 64" fill="none" stroke="#7da04c" stroke-width="5" stroke-linecap="round"/>
    ${f(18, 30, '#d98fc4')}${f(36, 18, '#f4b8a0')}${f(54, 28, '#b79ae0')}${f(70, 38, '#f6c85a')}${f(46, 42, '#d98fc4')}`);
}

// A wild rose bush with pink blossoms.
function wildRose() {
  const rose = (x, y) => `<circle cx="${x}" cy="${y}" r="5.5" fill="#f08aa4" ${attrs('#b0506a', 0.8)}/><circle cx="${x}" cy="${y}" r="2" fill="#ffe08a"/>`;
  return svgDoc(100, 76, `
    ${crown([[30, 48, 22], [58, 40, 26], [78, 52, 18]], { ...LEAF, line: '#6f8f4c' })}
    ${rose(24, 40)}${rose(46, 30)}${rose(66, 42)}${rose(76, 52)}${rose(38, 52)}`);
}

// A torch on a pole, the flame glows warm. Tall and thin, so it cannot be mistaken for a hurdle.
function torchPost() {
  return svgDoc(54, 140, `
    <defs><radialGradient id="tg"><stop offset="0" stop-color="#ffd37a" stop-opacity="0.75"/><stop offset="1" stop-color="#ffb060" stop-opacity="0"/></radialGradient></defs>
    <circle cx="27" cy="34" r="26" fill="url(#tg)"/>
    <path d="M27 134 V50" stroke="#8a5e3c" stroke-width="4.4" stroke-linecap="round"/>
    <path d="M16 38 L20 52 H34 L38 38 Z" fill="#5a4a46" ${attrs('#352a28', 1.2)}/>
    <path d="M27 14 Q38 28 34 38 H20 Q16 28 27 14 Z" fill="#f08a2a"/>
    <path d="M27 22 Q33 31 30 38 H24 Q21 31 27 22 Z" fill="#ffd24a"/>
    ${groundShadow(27, 134, 14)}`);
}

// ---- Strip: a rope between posts with small pennants, drawn pale and thin ----

function tourneyFence() {
  const colors = [HU_RED, '#ffffff', HU_GREEN];
  const flags = [28, 52, 76, 100, 124].map((x, i) => `<path d="M${x} 28 L${x + 10} 28 L${x + 5} 42 Z" fill="${colors[i % 3]}" ${attrs('#8a7a68', 0.7)}/>`);
  return svgDoc(156, 70, `
    <path d="M10 64 V16 M146 64 V16" stroke="#a8764a" stroke-width="5" stroke-linecap="round"/>
    <circle cx="10" cy="14" r="3.4" fill="${GOLD}"/><circle cx="146" cy="14" r="3.4" fill="${GOLD}"/>
    <path d="M10 22 Q78 36 146 22 M-2 22 H10 M146 22 H158" fill="none" stroke="#d8c0a0" stroke-width="2.4"/>
    ${flags.join('')}`);
}

const PIECES = {
  'sky-visegrad': [GAME_WIDTH, GAME_HEIGHT, skySunset],
  'hills-far-visegrad': [GAME_WIDTH, 220, danubeBend],
  'hills-near-visegrad': [GAME_WIDTH, 140, woodedSlope],
  fellegvar: [340, 220 + RIVER, fellegvar],
  'salamon-tower': [200, 230 + RIVER, salamonTower],
  'vg-pine': [110, 210, pine],
  'vg-sailboat': [170, 190, sailboat],
  hussar: [200, 190, hussar],
  'vg-oak': [190, 230, oak],
  'vg-willow': [200, 220, willow],
  'fisher-hut': [170, 140, fisherHut],
  'net-poles': [150, 160, netPoles],
  'castle-wall': [260, 230, castleWall],
  'wall-tower': [120, 256, wallTower],
  'banner-pole': [90, 240, bannerPole],
  'tent-red': [190, 150, () => tent('#c9473f', '#fff4e0', '#8a4a40')],
  'tent-green': [190, 150, () => tent('#4d8a5a', '#fff4e0', '#3f6a48')],
  'heraldic-banner': [124, 200, heraldicBanner],
  'archery-target': [120, 210, archeryTarget],
  reeds: [100, 90, reeds],
  'wild-flowers': [90, 68, wildFlowers],
  'wild-rose': [100, 76, wildRose],
  'torch-post': [54, 140, torchPost],
  'tourney-fence': [156, 70, tourneyFence],
};

export function visegradSvgs() {
  return Object.fromEntries(Object.entries(PIECES).map(([key, [w, h, draw]]) => [key, { w, h, svg: draw() }]));
}

export function preloadVisegrad(scene) {
  for (const [key, { w, h, svg }] of Object.entries(visegradSvgs())) loadSvg(scene, key, svg, w, h);
}
