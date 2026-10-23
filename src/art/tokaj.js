import { GAME_WIDTH } from '../config.js';
import { loadSvg, svgDoc } from './svg.js';
import { attrs, crown, ridge, ridgeY, trunk } from './scenery.js';
import { HU_GREEN, HU_RED } from './puszta.js';

// Level 9 (grown-ups, only loaded with ?paprika): the Tokaj vineyards in autumn.
// Golden and orange leaves, purple grapes, cream-coloured loess cellars and the grape harvest.
// Everything here is background: soft outlines, never the strong OUTLINE.

const f1 = (n) => n.toFixed(1);
const polygon = (pts, w, h) => `M0 ${h} ${pts.map(([x, y]) => `L${x} ${f1(y)}`).join(' ')} L${w} ${h} Z`;

const GOLD = '#e0aa3a';
const ORANGE = '#d2692a';
const RUST = '#a8402a';
const LEAF_GREEN = '#9aa83c';
const LEAF_LINE = '#8a5a22';
const GRAPE = '#6a2f6e';
const GRAPE_DARK = '#4a1f4e';
const GRAPE_GOLD = '#d4c04a';
const LOESS = '#ead9ae';
const LOESS_DARK = '#b9a272';
const LOESS_SHADE = '#d6c08c';
const WALL = '#f4efe2';
const WALL_LINE = '#a8a090';
const ROOF = '#b4553a';
const ROOF_LINE = '#7e3626';
const TIMBER = '#8a5a33';
const TIMBER_DARK = '#5a3a1e';
const AUTUMN = [GOLD, ORANGE, '#c9892e', LEAF_GREEN, RUST];

// ---- Small helpers ----

// A bunch of grapes hanging from (x, y), s times its normal size.
function grapes(x, y, s = 1, fill = GRAPE, dark = GRAPE_DARK) {
  const r = 3.4 * s;
  const pts = [[-6, 0], [0, 0], [6, 0], [-3, 5], [3, 5], [0, 10]];
  return `<path d="M${x} ${f1(y - 5 * s)} V${y}" stroke="${LEAF_LINE}" stroke-width="1.4" stroke-linecap="round"/>
    ${pts.map(([dx, dy]) => `<circle cx="${f1(x + dx * s)}" cy="${f1(y + dy * s + r)}" r="${f1(r)}" fill="${fill}" ${attrs(dark, 0.9)}/>`).join('')}
    ${pts.map(([dx, dy]) => `<circle cx="${f1(x + dx * s - r * 0.3)}" cy="${f1(y + dy * s + r * 0.7)}" r="${f1(r * 0.28)}" fill="#ffffff" opacity="0.4"/>`).join('')}`;
}

// A mass of leaves: circles in autumn colours inside the box, with one soft outline around the lot.
function foliage(x0, x1, y0, y1, colors = AUTUMN, r = 9, step = 12) {
  const dots = [];
  for (let j = 0, y = y0; y <= y1; j++, y += step * 0.75) {
    for (let i = 0, x = x0 + (j % 2) * step * 0.5; x <= x1; i++, x += step) dots.push([x, y, r + ((i * 3 + j * 5) % 3), colors[(i * 2 + j * 3) % colors.length]]);
  }
  return `${dots.map(([x, y, rr]) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${rr + 1.5}" fill="${LEAF_LINE}"/>`).join('')}
    ${dots.map(([x, y, rr, c]) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${rr}" fill="${c}"/>`).join('')}
    ${dots.map(([x, y, rr]) => `<circle cx="${f1(x - rr * 0.3)}" cy="${f1(y - rr * 0.3)}" r="${f1(rr * 0.4)}" fill="#ffffff" opacity="0.2"/>`).join('')}`;
}

// A wooden post standing on y, centred on x and h high.
const post = (x, y, h, w = 6, color = TIMBER) =>
  `<rect x="${f1(x - w / 2)}" y="${y - h}" width="${w}" height="${h}" rx="1.5" fill="${color}" ${attrs(TIMBER_DARK, 1.2)}/>`;

// A round-arched opening w wide, from its top at y down to y + h.
const roundArch = (x, y, w, h) =>
  `M${f1(x)} ${f1(y + h)} V${f1(y + w / 2)} A${f1(w / 2)} ${f1(w / 2)} 0 0 1 ${f1(x + w)} ${f1(y + w / 2)} V${f1(y + h)} Z`;

// A wooden door in a round arch, with planks and an iron ring.
function archDoor(x, y, w, h) {
  const cx = x + w / 2;
  return `<path d="${roundArch(x - 3, y - 3, w + 6, h + 3)}" fill="${LOESS_DARK}"/>
    <path d="${roundArch(x, y, w, h)}" fill="#7a4a28" ${attrs(TIMBER_DARK, 1.4)}/>
    <path d="M${cx} ${y} V${y + h} M${f1(x + w * 0.27)} ${f1(y + 3)} V${y + h} M${f1(x + w * 0.73)} ${f1(y + 3)} V${y + h}" stroke="#5a3418" stroke-width="1.2"/>
    <path d="M${x + 2} ${f1(y + h * 0.35)} H${x + w - 2} M${x + 2} ${f1(y + h * 0.75)} H${x + w - 2}" stroke="#4a2a14" stroke-width="2.2"/>
    <circle cx="${f1(cx - 3)}" cy="${f1(y + h * 0.58)}" r="2" fill="none" stroke="#2f2f2f" stroke-width="1.2"/>`;
}

// A string of red, white and green bunting from (x0, y0) to (x1, y1), sagging by sag.
function bunting(x0, y0, x1, y1, sag, n = 9) {
  const out = [`<path d="M${x0} ${y0} Q${f1((x0 + x1) / 2)} ${f1((y0 + y1) / 2 + sag * 2)} ${x1} ${y1}" fill="none" stroke="#5a4a3a" stroke-width="1.4"/>`];
  const cols = [HU_RED, '#ffffff', HU_GREEN];
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    const x = x0 + (x1 - x0) * t;
    const y = y0 + (y1 - y0) * t + sag * 2 * t * (1 - t);
    out.push(`<path d="M${f1(x - 6)} ${f1(y - 1)} L${f1(x + 6)} ${f1(y - 1)} L${f1(x)} ${f1(y + 13)} Z" fill="${cols[i % 3]}" ${attrs('#7a6a5a', 0.9)}/>`);
  }
  return out.join('');
}

// ---- Background tiles ----

// Far away: dusty ridges with the bald cone of the Kopasz hill in the middle, and golden
// hills covered in vine rows that follow the slopes, with press houses and autumn trees.
function hillsFar() {
  const w = GAME_WIDTH;
  const back = ridge(w, 104, [[18, 2, 0.5], [8, 5, 1.2]]).map(([x, y]) => [x, y - 62 * Math.exp(-(((x - 480) / 100) ** 2))]);
  const mid = ridge(w, 136, [[22, 2, 2], [9, 5, 0.3]]);
  const front = ridge(w, 170, [[12, 3, 0.8], [5, 7]]);
  const stripes = (pts, from, to, step, color, width, op) => {
    const out = [];
    for (let d = from; d <= to; d += step) out.push(`<path d="M${pts.map(([x, y]) => `${x} ${f1(y + d)}`).join(' L')}" fill="none" stroke="${color}" stroke-width="${width}" opacity="${op}"/>`);
    return out.join('');
  };
  const trees = [];
  for (let x = 24; x < w - 10; x += 38 + ((x * 7) % 30)) {
    const y = ridgeY(mid, x) + 5;
    const c = AUTUMN[(x >> 3) % 3];
    trees.push(`<circle cx="${x}" cy="${f1(y)}" r="${8 + (x % 4)}" fill="${c}" ${attrs(LEAF_LINE, 1)}/><circle cx="${x - 3}" cy="${f1(y - 3)}" r="3.5" fill="#ffffff" opacity="0.2"/>`);
  }
  const houses = [];
  for (const x of [150, 380, 640, 850]) {
    const y = ridgeY(front, x) + 6;
    houses.push(`<rect x="${x - 8}" y="${y - 8}" width="16" height="8" fill="${WALL}" ${attrs(WALL_LINE, 0.8)}/><path d="M${x - 10} ${y - 8} L${x} ${y - 15} L${x + 10} ${y - 8} Z" fill="${ROOF}" ${attrs(ROOF_LINE, 0.8)}/>`);
  }
  return svgDoc(w, 220, `
    <path d="${polygon(back, w, 220)}" fill="#c9b3b8"/>
    ${stripes(back, 8, 70, 7, '#ae8f98', 2, 0.45)}
    <path d="${polygon(mid, w, 220)}" fill="#dcb45c"/>
    ${stripes(mid, 6, 80, 8, '#b0832c', 2.6, 0.4)}
    ${stripes(mid, 10, 80, 16, '#d2692a', 2, 0.25)}
    ${trees.join('')}
    <path d="${polygon(front, w, 220)}" fill="#cfa648"/>
    ${stripes(front, 5, 60, 8, '#8f7a2e', 2.6, 0.4)}
    ${houses.join('')}`);
}

// Close behind Frankie: low terraces of the vineyard in gold and green, joining the grass of the ground.
function hillsNear() {
  const w = GAME_WIDTH;
  const top = ridge(w, 72, [[6, 3, 0.6], [3, 8, 1.3]]);
  const out = [];
  for (let d = 10; d < 70; d += 11) {
    out.push(`<path d="M${top.map(([x, y]) => `${x} ${f1(y + d)}`).join(' L')}" fill="none" stroke="#7c8a2e" stroke-width="3" opacity="0.35"/>`);
    out.push(`<path d="M${top.map(([x, y]) => `${x} ${f1(y + d - 3)}`).join(' L')}" fill="none" stroke="#f0d482" stroke-width="2" opacity="0.4"/>`);
  }
  const vines = [];
  for (let d = 10, r = 0; d < 70; d += 11, r++) {
    for (let x = 6 + (r % 2) * 9; x < w; x += 18) vines.push(`<circle cx="${x}" cy="${f1(ridgeY(top, x) + d - 4)}" r="3.4" fill="${AUTUMN[((x / 9) + r) % 5 | 0]}" opacity="0.85"/>`);
  }
  return svgDoc(w, 140, `
    <defs><linearGradient id="tn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d6ae4a"/><stop offset="1" stop-color="#9cb345"/></linearGradient></defs>
    <path d="${polygon(top, w, 140)}" fill="url(#tn)"/>
    <path d="M${top.map(([x, y]) => `${x} ${f1(y + 3)}`).join(' L')}" fill="none" stroke="#f0d482" stroke-width="3" opacity="0.8"/>
    ${out.join('')}${vines.join('')}`);
}

// ---- Zone 1: vineyard on the slope ----

// A row of vines on a wooden trellis seen from the side: wires, a band of autumn leaves, hanging grapes.
function vineRowDraw(colors, fruit, dark) {
  return svgDoc(220, 130, `
    <ellipse cx="110" cy="124" rx="100" ry="5" fill="#000000" opacity="0.1"/>
    ${[18, 74, 130, 186].map((x) => post(x, 124, 98, 6)).join('')}
    <path d="M18 52 H186 M18 74 H186" stroke="#5a4a3a" stroke-width="1.4"/>
    ${foliage(14, 192, 36, 70, colors, 9, 13)}
    ${[26, 52, 80, 104, 132, 160, 184].map((x, i) => grapes(x, 76 + (i % 3) * 5, 1.1, fruit, dark)).join('')}`);
}
const vineRow = () => vineRowDraw(AUTUMN, GRAPE, GRAPE_DARK);
const vineRowGold = () => vineRowDraw([GOLD, '#e8c04a', ORANGE, GOLD, '#c9892e'], GRAPE_GOLD, '#8a7a22');

// A small white press house (présház) with a red tiled roof, an arched door and a vine on the wall.
function pressHouse() {
  const tiles = [];
  for (let y = 62, r = 0; y < 100; y += 8, r++) tiles.push(`<path d="M${30 + r * 6} ${y} H${190 - r * 6}" stroke="${ROOF_LINE}" stroke-width="1.2" opacity="0.6"/>`);
  return svgDoc(220, 200, `
    <ellipse cx="110" cy="190" rx="98" ry="6" fill="#000000" opacity="0.1"/>
    <rect x="30" y="100" width="160" height="88" fill="${WALL}" ${attrs(WALL_LINE, 1.6)}/>
    <rect x="30" y="170" width="160" height="18" fill="${LOESS_DARK}" opacity="0.7"/>
    <path d="M18 100 L58 52 H162 L202 100 Z" fill="${ROOF}" ${attrs(ROOF_LINE, 2)}/>
    ${tiles.join('')}
    <rect x="146" y="30" width="16" height="32" fill="#e6dcc6" ${attrs(WALL_LINE, 1.4)}/>
    <rect x="143" y="26" width="22" height="6" rx="1.5" fill="#cfc4ae" ${attrs(WALL_LINE, 1.2)}/>
    <path d="M70 188 V138 A18 18 0 0 1 106 138 V188 Z" fill="#7a4a28" ${attrs(TIMBER_DARK, 1.6)}/>
    <path d="M88 124 V188 M76 140 V188 M100 140 V188" stroke="#5a3418" stroke-width="1.2"/>
    <circle cx="97" cy="160" r="2" fill="#2f2f2f"/>
    <rect x="126" y="124" width="36" height="28" fill="#8aa6b8" ${attrs(TIMBER_DARK, 1.6)}/>
    <path d="M144 124 V152 M126 138 H162" stroke="${TIMBER_DARK}" stroke-width="1.6"/>
    <path d="M122 154 H166" stroke="#c9ad7a" stroke-width="4"/>
    ${foliage(34, 66, 116, 176, [GOLD, ORANGE, RUST], 7, 10)}
    ${grapes(46, 150, 0.9)}${grapes(60, 160, 0.9)}${grapes(40, 128, 0.8)}`);
}

// A little whitewashed stone chapel with a slim tower, on a golden knoll. Far landmark.
function chapel() {
  return svgDoc(170, 210, `
    <path d="M0 210 C10 168 40 150 85 150 C130 150 160 168 170 210 Z" fill="#d8b250" ${attrs('#a8832a', 1.5)}/>
    <path d="M14 196 C30 176 60 168 85 168 M96 168 C120 168 144 176 156 194 M26 206 C50 190 80 186 100 186" fill="none" stroke="#a8832a" stroke-width="2.4" opacity="0.5"/>
    <rect x="44" y="100" width="82" height="58" fill="${WALL}" ${attrs(WALL_LINE, 1.6)}/>
    <path d="M38 102 L85 66 L132 102 Z" fill="${ROOF}" ${attrs(ROOF_LINE, 1.8)}/>
    <rect x="76" y="40" width="18" height="56" fill="${WALL}" ${attrs(WALL_LINE, 1.6)}/>
    <path d="M72 42 L85 8 L98 42 Z" fill="${ROOF}" ${attrs(ROOF_LINE, 1.6)}/>
    <path d="M85 8 V0 M80 4 H90" stroke="#4a4a4a" stroke-width="2" stroke-linecap="round"/>
    <path d="${roundArch(81, 50, 8, 14)}" fill="#6a4a30"/>
    <path d="M74 158 V132 A11 11 0 0 1 96 132 V158 Z" fill="#7a4a28" ${attrs(TIMBER_DARK, 1.4)}/>
    <path d="M52 114 V132 M118 114 V132" stroke="#6a8aa0" stroke-width="7" stroke-linecap="round"/>
    <circle cx="36" cy="150" r="10" fill="${ORANGE}" ${attrs(LEAF_LINE, 1.2)}/><circle cx="34" cy="146" r="4" fill="#ffffff" opacity="0.2"/>`);
}

// An autumn tree: a trunk and a crown in the given colours (walnut gold, chestnut orange).
function autumnTree(w, h, trunkX, circles, colors) {
  return svgDoc(w, h, `
    ${trunk(trunkX, h * 0.5, h - 2, 13)}
    <path d="M${trunkX - 4} ${h * 0.6} L${trunkX - 28} ${h * 0.46} M${trunkX + 4} ${h * 0.56} L${trunkX + 26} ${h * 0.44}" ${attrs(TIMBER_DARK, 6)}/>
    <path d="M${trunkX - 4} ${h * 0.6} L${trunkX - 28} ${h * 0.46} M${trunkX + 4} ${h * 0.56} L${trunkX + 26} ${h * 0.44}" stroke="${TIMBER}" stroke-width="3" stroke-linecap="round"/>
    ${crown(circles, colors)}`);
}
const walnut = () => autumnTree(220, 260, 110, [[56, 118, 40], [102, 78, 52], [152, 86, 48], [176, 124, 36], [130, 128, 42], [82, 140, 34], [116, 44, 34]],
  { line: LEAF_LINE, base: '#dcaa3a', shade: '#b9852a', light: '#efc860', dots: '#f7dc8c' });
const chestnut = () => autumnTree(200, 250, 100, [[52, 122, 36], [92, 84, 46], [142, 92, 44], [160, 130, 32], [118, 130, 38], [70, 142, 30]],
  { line: '#7a3a1c', base: '#d2692a', shade: '#a84a22', light: '#e88a42', dots: '#f4b070' });

// A small vineyard patch on a hill, for the far layer.
function vineSlope() {
  const rows = [];
  for (let k = 0; k < 7; k++) rows.push(`<path d="M${6 + k * 4} ${100 - k * 11} Q120 ${52 - k * 6} ${234 - k * 4} ${100 - k * 11}" fill="none" stroke="#8f7a2e" stroke-width="2.6" opacity="0.45"/>`);
  return svgDoc(240, 112, `
    <path d="M0 112 C10 60 70 28 120 28 C176 28 232 60 240 112 Z" fill="#d6ae4a" ${attrs('#a8832a', 1.4)}/>
    ${rows.join('')}
    <circle cx="60" cy="52" r="9" fill="${ORANGE}" ${attrs(LEAF_LINE, 1)}/><circle cx="188" cy="58" r="8" fill="${GOLD}" ${attrs(LEAF_LINE, 1)}/>`);
}

// ---- Near: low plants only ----

function asters() {
  const stem = (x, h, c) => `<path d="M${x} 66 Q${x + 2} ${66 - h / 2} ${x} ${66 - h}" fill="none" stroke="#5f8a38" stroke-width="2" stroke-linecap="round"/>
    ${[0, 45, 90, 135].map((a) => `<ellipse cx="${x}" cy="${66 - h}" rx="7" ry="2.4" transform="rotate(${a} ${x} ${66 - h})" fill="${c}" ${attrs('#4a2f5e', 0.6)}/>`).join('')}<circle cx="${x}" cy="${66 - h}" r="2.4" fill="#f0c43a"/>`;
  return svgDoc(100, 70, `<path d="M8 66 H92" stroke="#6a9a3a" stroke-width="4" stroke-linecap="round"/>${stem(20, 30, '#a070c8')}${stem(42, 42, '#8a5ab8')}${stem(62, 32, '#c090d8')}${stem(80, 24, '#a070c8')}`);
}

function leafScatter() {
  const leaves = [[14, 28, 0, GOLD], [32, 22, 40, ORANGE], [50, 30, -30, RUST], [68, 20, 20, GOLD], [86, 28, -50, ORANGE], [100, 22, 30, '#c9892e']];
  return svgDoc(116, 40, leaves.map(([x, y, a, c]) => `<ellipse cx="${x}" cy="${y}" rx="8" ry="4.5" transform="rotate(${a} ${x} ${y})" fill="${c}" ${attrs(LEAF_LINE, 0.9)}/><path d="M${x - 6} ${y} H${x + 6}" transform="rotate(${a} ${x} ${y})" stroke="${LEAF_LINE}" stroke-width="0.8"/>`).join(''));
}

// A young vine stock with a few leaves and one bunch, low enough to never look like a block.
function vineLow() {
  return svgDoc(90, 76, `
    <path d="M45 72 Q40 56 46 40 M46 50 Q58 44 66 34 M44 56 Q32 50 24 42" fill="none" stroke="${TIMBER}" stroke-width="3.5" stroke-linecap="round"/>
    ${foliage(20, 72, 28, 48, AUTUMN, 7, 10)}
    ${grapes(42, 48, 0.9)}`);
}

// A low autumn bush in gold and rust.
function autumnBush() {
  return svgDoc(120, 76, `<path d="M8 74 H112" stroke="#6a9a3a" stroke-width="4" stroke-linecap="round"/>${crown([[34, 50, 22], [60, 40, 28], [86, 52, 22], [60, 58, 20]], { line: LEAF_LINE, base: ORANGE, shade: RUST, light: GOLD, dots: '#f7dc8c' })}`);
}

// A slim wooden lamp post with a warm lantern, for the path between the vineyards.
function lantern() {
  return svgDoc(50, 140, `
    <rect x="21" y="40" width="8" height="98" rx="2" fill="${TIMBER}" ${attrs(TIMBER_DARK, 1.2)}/>
    <path d="M25 44 H8" stroke="${TIMBER_DARK}" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M8 44 V52" stroke="#4a4a4a" stroke-width="1.4"/>
    <rect x="1" y="52" width="14" height="18" rx="3" fill="#ffe08a" ${attrs('#7a5a2a', 1.4)}/>
    <path d="M0 52 L8 44 L16 52 Z" fill="#4a3a2a"/>
    <circle cx="8" cy="61" r="12" fill="#ffd060" opacity="0.2"/>`);
}

// ---- Zone 2: the cellar row ----

// A cream-coloured loess hillside with two arched cellar doors dug in, vines on top.
function cellarHill() {
  return svgDoc(330, 220, `
    <ellipse cx="165" cy="214" rx="150" ry="6" fill="#000000" opacity="0.1"/>
    <path d="M0 216 C4 150 30 84 100 66 C150 52 210 56 252 84 C300 110 326 160 330 216 Z" fill="${LOESS}" ${attrs(LOESS_DARK, 2)}/>
    <path d="M30 150 Q60 100 110 88 M230 100 Q290 130 306 190 M120 70 Q170 62 220 76" fill="none" stroke="${LOESS_SHADE}" stroke-width="5" stroke-linecap="round" opacity="0.7"/>
    <path d="M66 70 C90 56 120 50 150 52 C190 50 230 62 252 82 C220 76 170 70 130 72 C100 72 80 76 66 70 Z" fill="${LEAF_GREEN}" ${attrs('#6a7a28', 1.2)}/>
    ${foliage(80, 240, 54, 66, AUTUMN, 6, 10)}
    <rect x="196" y="40" width="10" height="26" fill="#e6dcc6" ${attrs(WALL_LINE, 1.2)}/>
    <rect x="193" y="36" width="16" height="6" rx="1.5" fill="#cfc4ae" ${attrs(WALL_LINE, 1.2)}/>
    ${archDoor(86, 130, 52, 84)}${archDoor(190, 138, 48, 76)}
    <path d="M80 214 H148 M184 214 H244" stroke="${LOESS_DARK}" stroke-width="4" stroke-linecap="round"/>
    <path d="M110 112 q8 -10 16 0 M214 120 q8 -10 16 0" fill="none" stroke="#c9892e" stroke-width="2" opacity="0.7"/>`);
}

// One cellar door in a low loess wall with a vine over it.
function cellarDoor() {
  return svgDoc(190, 170, `
    <ellipse cx="95" cy="164" rx="84" ry="5" fill="#000000" opacity="0.1"/>
    <path d="M6 166 C8 100 40 56 95 50 C150 56 182 100 184 166 Z" fill="${LOESS}" ${attrs(LOESS_DARK, 2)}/>
    <path d="M24 130 Q40 86 80 66" fill="none" stroke="${LOESS_SHADE}" stroke-width="5" stroke-linecap="round" opacity="0.7"/>
    ${archDoor(66, 96, 58, 70)}
    ${foliage(50, 140, 70, 92, AUTUMN, 7, 11)}
    ${grapes(76, 94, 0.9)}${grapes(112, 96, 0.9)}`);
}

// A big old wooden wine press: a slatted basket on a stone base, a thick screw and a long lever.
function winePress() {
  const slats = [];
  for (let x = 72; x <= 148; x += 9) slats.push(`<path d="M${x} 110 V164" stroke="${TIMBER_DARK}" stroke-width="1.2"/>`);
  return svgDoc(230, 200, `
    <ellipse cx="115" cy="190" rx="100" ry="6" fill="#000000" opacity="0.1"/>
    <path d="M50 186 L60 160 H170 L180 186 Z" fill="#b8b0a0" ${attrs('#7a7468', 1.6)}/>
    <path d="M70 160 L72 110 H148 L150 160 Z" fill="#a8703a" ${attrs(TIMBER_DARK, 1.8)}/>
    ${slats.join('')}
    <path d="M66 126 H154 M68 148 H152" stroke="#4a4a4a" stroke-width="3.5"/>
    ${post(52, 160, 124, 12)}${post(178, 160, 124, 12)}
    <rect x="46" y="30" width="138" height="16" rx="3" fill="#a8703a" ${attrs(TIMBER_DARK, 1.8)}/>
    <rect x="102" y="46" width="26" height="64" rx="4" fill="#8a5a33" ${attrs(TIMBER_DARK, 1.6)}/>
    <path d="M102 58 H128 M102 70 H128 M102 82 H128 M102 94 H128" stroke="${TIMBER_DARK}" stroke-width="1.4"/>
    <path d="M10 14 L220 6" ${attrs(TIMBER_DARK, 9)}/><path d="M10 14 L220 6" stroke="#a8703a" stroke-width="5" stroke-linecap="round"/>
    <rect x="104" y="6" width="22" height="26" rx="4" fill="#8a5a33" ${attrs(TIMBER_DARK, 1.6)}/>
    ${grapes(84, 108, 0.9)}${grapes(136, 108, 0.9)}`);
}

// A very big old barrel on a stone cradle. It stands far back in the mid layer.
function bigBarrel() {
  const staves = [];
  for (let x = 40; x <= 150; x += 18) staves.push(`<path d="M${x} 30 Q${x + (x - 95) * 0.06} 90 ${x} 150" fill="none" stroke="${TIMBER_DARK}" stroke-width="1.1" opacity="0.7"/>`);
  return svgDoc(190, 170, `
    <ellipse cx="95" cy="164" rx="86" ry="5" fill="#000000" opacity="0.1"/>
    <path d="M20 164 L30 146 H160 L170 164 Z" fill="#b8b0a0" ${attrs('#7a7468', 1.6)}/>
    <path d="M30 40 Q95 6 160 40 Q176 90 160 138 Q95 160 30 138 Q14 90 30 40 Z" fill="#a8703a" ${attrs(TIMBER_DARK, 2)}/>
    ${staves.join('')}
    <path d="M26 56 Q95 28 164 56 M20 98 Q95 114 170 98 M26 128 Q95 146 164 128" fill="none" stroke="#4a4a4a" stroke-width="5"/>
    <path d="M36 50 Q60 36 86 32" fill="none" stroke="#ddb070" stroke-width="4" stroke-linecap="round" opacity="0.7"/>
    <ellipse cx="95" cy="96" rx="28" ry="26" fill="#8a5a33" ${attrs(TIMBER_DARK, 1.6)}/>
    <circle cx="95" cy="96" r="6" fill="#c9892e" ${attrs(TIMBER_DARK, 1.2)}/>
    ${grapes(95, 62, 1, GRAPE_GOLD, '#8a7a22')}`);
}

// A garden arbour: wooden posts and beams under a roof of vines with heavy purple grapes.
function arbour() {
  return svgDoc(250, 200, `
    <ellipse cx="125" cy="192" rx="108" ry="6" fill="#000000" opacity="0.1"/>
    ${post(26, 190, 150, 9)}${post(224, 190, 150, 9)}
    <rect x="12" y="34" width="226" height="10" rx="2" fill="${TIMBER}" ${attrs(TIMBER_DARK, 1.4)}/>
    ${[40, 86, 132, 178, 214].map((x) => `<rect x="${x}" y="24" width="6" height="22" rx="1.5" fill="${TIMBER}" ${attrs(TIMBER_DARK, 1)}/>`).join('')}
    ${foliage(12, 238, 28, 62, AUTUMN, 10, 14)}
    ${[34, 66, 98, 130, 164, 196, 224].map((x, i) => grapes(x, 64 + (i % 2) * 6, 1.25)).join('')}
    ${foliage(14, 36, 70, 160, [GOLD, ORANGE, LEAF_GREEN], 6, 10)}
    ${foliage(214, 236, 70, 150, [GOLD, ORANGE, RUST], 6, 10)}`);
}

// ---- Strip: a low trellis fence ----

// Strips are laid out every 156 px; the pattern has a period of 78 px (posts) so the fence goes on seamlessly.
function trellisStrip() {
  const posts = [];
  const leaves = [];
  for (let x = 10; x < 170; x += 78) posts.push(`<rect x="${x - 3}" y="14" width="6" height="42" rx="1.5" fill="${TIMBER}" ${attrs(TIMBER_DARK, 1.1)}/>`);
  for (let x = 6; x < 160; x += 13) leaves.push(`<circle cx="${x}" cy="${26 + ((x * 7) % 11)}" r="7" fill="${AUTUMN[((x / 13) | 0) % 5]}" ${attrs(LEAF_LINE, 0.8)}/>`);
  return svgDoc(160, 60, `
    <path d="M0 24 H160 M0 38 H160" stroke="#5a4a3a" stroke-width="1.6"/>
    ${posts.join('')}${leaves.join('')}`);
}

// ---- Zone 3: the harvest feast ----

// A brown horse pulling a wooden cart full of grape baskets, going right.
function harvestCart() {
  const HORSE = '#8a5230';
  const HL = '#4e2c16';
  const leg = (pts, c) => `<path d="M${pts}" fill="none" stroke="${HL}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><path d="M${pts}" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
  const wheel = (x) => `<circle cx="${x}" cy="150" r="26" fill="#c9a06a" ${attrs(TIMBER_DARK, 3)}/><circle cx="${x}" cy="150" r="20" fill="none" stroke="${TIMBER_DARK}" stroke-width="1.4"/><circle cx="${x}" cy="150" r="5" fill="${TIMBER_DARK}"/>${[0, 45, 90, 135].map((a) => `<path d="M${x} 130 V170" transform="rotate(${a} ${x} 150)" stroke="${TIMBER_DARK}" stroke-width="2.2"/>`).join('')}`;
  const basket = (x, y) => `<path d="M${x} ${y} H${x + 36} L${x + 33} ${y + 24} H${x + 3} Z" fill="#c9a06a" ${attrs(TIMBER_DARK, 1.3)}/><path d="M${x + 2} ${y + 8} H${x + 34} M${x + 3} ${y + 16} H${x + 33}" stroke="${TIMBER_DARK}" stroke-width="1"/>
    ${[6, 14, 22, 30].map((d, i) => `<circle cx="${x + d}" cy="${y - 2 + (i % 2) * 2}" r="5" fill="${i % 2 ? GRAPE : '#7e3a82'}" ${attrs(GRAPE_DARK, 0.8)}/>`).join('')}`;
  return svgDoc(300, 190, `
    <ellipse cx="150" cy="178" rx="136" ry="6" fill="#000000" opacity="0.1"/>
    ${leg('206 118 L208 146 L206 172', '#74421f')}${leg('248 118 L252 146 L250 172', '#74421f')}
    ${leg('196 118 L196 146 L195 172', HORSE)}${leg('260 118 L264 146 L262 172', HORSE)}
    <path d="M266 84 C282 86 290 112 284 138 C280 126 276 118 276 108 C274 120 270 128 264 132 C268 116 268 96 262 90 Z" fill="#3a2414" ${attrs('#1f130a', 1.2)}/>
    <path d="M192 90 C210 82 240 82 262 86 C274 90 276 108 268 120 C256 128 220 126 200 124 C190 118 188 98 192 90 Z" fill="${HORSE}" ${attrs(HL, 2)}/>
    <path d="M226 86 C232 66 244 54 256 50 L264 40 C270 38 280 42 286 52 L294 66 C296 72 292 76 286 74 L272 64 C262 70 254 84 244 98 Z" fill="${HORSE}" ${attrs(HL, 2)}/>
    <path d="M254 50 L258 38 L264 46 Z" fill="${HORSE}" ${attrs(HL, 1.2)}/>
    <path d="M252 52 C244 58 238 70 232 84 L238 86 C242 74 246 64 254 56 Z" fill="#3a2414"/>
    <circle cx="280" cy="52" r="2" fill="#1b0f08"/>
    <path d="M186 96 L120 108 M186 112 L120 118" stroke="${TIMBER_DARK}" stroke-width="4" stroke-linecap="round"/>
    <path d="M40 78 H190 L180 138 H50 Z" fill="#b88850" ${attrs(TIMBER_DARK, 2)}/>
    <path d="M46 98 H184 M48 118 H182" stroke="${TIMBER_DARK}" stroke-width="1.2"/>
    ${basket(54, 56)}${basket(96, 52)}${basket(138, 56)}
    ${basket(72, 34)}${basket(118, 30)}
    ${wheel(78)}${wheel(158)}`);
}

// Two garlands of red, white and green bunting between two wooden poles.
function buntingPoles() {
  return svgDoc(270, 180, `
    <ellipse cx="135" cy="174" rx="110" ry="5" fill="#000000" opacity="0.08"/>
    ${post(14, 174, 150, 7)}${post(256, 174, 150, 7)}
    ${bunting(14, 30, 256, 30, 28, 11)}
    ${bunting(14, 58, 256, 58, 20, 11)}
    <circle cx="14" cy="24" r="5" fill="${GOLD}" ${attrs(TIMBER_DARK, 1)}/><circle cx="256" cy="24" r="5" fill="${GOLD}" ${attrs(TIMBER_DARK, 1)}/>`);
}

// A market stall with a red-and-white striped awning and grapes hanging in front. Mid layer.
function grapeStall() {
  const stripes = [];
  for (let i = 0; i < 6; i += 2) stripes.push(`<path d="M${22 + i * 22} 40 H${22 + (i + 1) * 22} L${16 + (i + 1) * 24} 70 H${16 + i * 24} Z" fill="#ffffff"/>`);
  return svgDoc(190, 180, `
    <ellipse cx="95" cy="172" rx="82" ry="5" fill="#000000" opacity="0.1"/>
    ${post(20, 170, 130, 7)}${post(170, 170, 130, 7)}
    <path d="M22 40 H168 L176 70 H14 Z" fill="${HU_RED}"/>
    ${stripes.join('')}
    <path d="M14 70 H176" stroke="#7a1a20" stroke-width="2"/>
    <path d="M22 40 H168 L176 70 H14 Z" fill="none" ${attrs('#7a1a20', 1.6)}/>
    <rect x="22" y="118" width="146" height="50" fill="#c9a06a" ${attrs(TIMBER_DARK, 1.8)}/>
    <path d="M22 134 H168" stroke="${TIMBER_DARK}" stroke-width="1.2"/>
    ${[40, 62, 84, 106, 128, 150].map((x, i) => `<circle cx="${x}" cy="${112 + (i % 2) * 2}" r="8" fill="${i % 2 ? GRAPE : GRAPE_GOLD}" ${attrs(GRAPE_DARK, 1)}/>`).join('')}
    ${[50, 98, 140].map((x) => grapes(x, 76, 1.5)).join('')}`);
}

// Two grape pickers with wooden back baskets (puttony) full of grapes, far away.
function pickers() {
  const person = (x, tint, coat) => `
    <path d="M${x - 6} 96 V76 M${x + 6} 96 V76" stroke="#3a3a4a" stroke-width="5" stroke-linecap="round"/>
    <rect x="${x - 9}" y="48" width="18" height="30" rx="5" fill="${coat}" ${attrs('#4a3a2a', 1.2)}/>
    <circle cx="${x + 2}" cy="40" r="7" fill="#f0c9a0" ${attrs('#8a6a4a', 1)}/>
    <path d="M${x - 6} 36 Q${x + 2} 26 ${x + 10} 36 Z" fill="${tint}" ${attrs('#4a3a2a', 1)}/>
    <path d="M${x - 14} 52 L${x - 18} 20 H${x - 2} L${x - 3} 52 Z" fill="#b88850" ${attrs(TIMBER_DARK, 1.2)}/>
    <circle cx="${x - 13}" cy="19" r="4" fill="${GRAPE}"/><circle cx="${x - 7}" cy="17" r="4" fill="#7e3a82"/>
    <path d="M${x - 8} 52 L${x - 14} 44" stroke="#f0c9a0" stroke-width="3.5" stroke-linecap="round"/>`;
  return svgDoc(110, 100, `<ellipse cx="55" cy="97" rx="46" ry="3" fill="#000000" opacity="0.1"/>${person(34, '#c9892e', '#7a5a8a')}${person(78, '#8a3a2a', '#5a7a4a')}`);
}

// The little town of Tokaj at the Tisza: the church with its tower, red-roofed houses and the river.
function tokajTown() {
  const houses = [[20, 118, 46, 28, 0], [70, 124, 40, 22, 1], [300, 114, 52, 32, 0], [358, 124, 42, 22, 1], [252, 128, 40, 20, 0]];
  return svgDoc(420, 210, `
    <path d="M0 150 C40 124 90 116 140 120 L280 120 C330 114 380 124 420 148 V150 Z" fill="#d6ae4a" ${attrs('#a8832a', 1.2)}/>
    ${houses.map(([x, y, w, h, t]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${WALL}" ${attrs(WALL_LINE, 1.2)}/>
      <path d="M${x - 4} ${y} L${x + w / 2} ${y - 16} L${x + w + 4} ${y} Z" fill="${t ? '#c9783a' : ROOF}" ${attrs(ROOF_LINE, 1.2)}/>
      <rect x="${x + w * 0.3}" y="${y + h * 0.35}" width="7" height="8" fill="#8aa6b8"/><rect x="${x + w * 0.6}" y="${y + h * 0.35}" width="7" height="8" fill="#8aa6b8"/>`).join('')}
    <rect x="150" y="88" width="46" height="62" fill="${WALL}" ${attrs(WALL_LINE, 1.4)}/>
    <path d="M144 90 L173 62 L202 90 Z" fill="${ROOF}" ${attrs(ROOF_LINE, 1.4)}/>
    <rect x="196" y="44" width="30" height="106" fill="${WALL}" ${attrs(WALL_LINE, 1.4)}/>
    <rect x="193" y="40" width="36" height="6" fill="#d6cfc0" ${attrs(WALL_LINE, 1)}/>
    <path d="M196 40 L211 6 L226 40 Z" fill="#4a7a6a" ${attrs('#2a4a3e', 1.4)}/>
    <path d="M211 6 V0 M207 3 H215" stroke="#d8b84a" stroke-width="2" stroke-linecap="round"/>
    <path d="${roundArch(205, 54, 12, 22)}" fill="#6a4a30"/>
    <circle cx="211" cy="94" r="8" fill="#f0e8d0" ${attrs('#6a4a30', 1.2)}/><path d="M211 89 V94 L215 96" stroke="#4a3a2a" stroke-width="1.2" fill="none"/>
    <path d="M160 150 V130 A8 8 0 0 1 176 130 V150 Z" fill="#7a4a28"/>
    <circle cx="124" cy="132" r="12" fill="${ORANGE}" ${attrs(LEAF_LINE, 1)}/><circle cx="244" cy="136" r="11" fill="${GOLD}" ${attrs(LEAF_LINE, 1)}/>
    <rect y="150" width="420" height="30" fill="#7fa9bc"/><path d="M0 150 H420" stroke="#c9c2b4" stroke-width="5"/>
    ${[16, 74, 130, 188, 246, 306, 362].map((x, i) => `<path d="M${x} ${162 + (i % 2) * 8} q8 -3 16 0" fill="none" stroke="#e3f1f8" stroke-width="2" stroke-linecap="round" opacity="0.7"/>`).join('')}`);
}

// The Kopasz hill: a bald, steep cone with vineyard terraces winding around it. Far landmark.
function kopaszHill() {
  const rows = [];
  for (let k = 0; k < 8; k++) rows.push(`<path d="M${30 + k * 14} ${192 - k * 17} Q170 ${180 - k * 17} ${310 - k * 14} ${192 - k * 17}" fill="none" stroke="#8f7a2e" stroke-width="2.6" opacity="0.5"/>`);
  return svgDoc(340, 200, `
    <path d="M0 200 C40 196 70 170 100 128 C128 90 140 50 170 50 C200 50 212 90 240 128 C270 170 300 196 340 200 Z" fill="#d9b457" ${attrs('#a8832a', 1.6)}/>
    ${rows.join('')}
    <path d="M144 70 C150 52 190 52 196 70 C184 62 156 62 144 70 Z" fill="#cdb592" ${attrs('#a89270', 1)}/>
    <circle cx="60" cy="184" r="9" fill="${ORANGE}" ${attrs(LEAF_LINE, 1)}/><circle cx="282" cy="184" r="9" fill="${GOLD}" ${attrs(LEAF_LINE, 1)}/>`);
}

const PIECES = {
  'hills-far-tokaj': [GAME_WIDTH, 220, hillsFar],
  'hills-near-tokaj': [GAME_WIDTH, 140, hillsNear],
  'vine-row': [220, 130, vineRow],
  'vine-row-gold': [220, 130, vineRowGold],
  presshaz: [220, 200, pressHouse],
  'chapel-hill': [170, 210, chapel],
  'tree-walnut': [220, 260, walnut],
  'tree-chestnut': [200, 250, chestnut],
  'vine-slope': [240, 112, vineSlope],
  asters: [100, 70, asters],
  'leaf-scatter': [116, 40, leafScatter],
  'vine-low': [90, 76, vineLow],
  'autumn-bush': [120, 76, autumnBush],
  lantern: [50, 140, lantern],
  'cellar-hill': [330, 220, cellarHill],
  'cellar-door': [190, 170, cellarDoor],
  'wine-press': [230, 200, winePress],
  'big-barrel': [190, 170, bigBarrel],
  arbour: [250, 200, arbour],
  'trellis-strip': [160, 60, trellisStrip],
  'harvest-cart': [300, 190, harvestCart],
  'bunting-poles': [270, 180, buntingPoles],
  'grape-stall': [190, 180, grapeStall],
  pickers: [110, 100, pickers],
  'tokaj-town': [420, 210, tokajTown],
  'kopasz-hill': [340, 200, kopaszHill],
};

export function tokajSvgs() {
  return Object.fromEntries(Object.entries(PIECES).map(([key, [w, h, draw]]) => [key, { w, h, svg: draw() }]));
}

export function preloadTokaj(scene) {
  for (const [key, { w, h, svg }] of Object.entries(tokajSvgs())) loadSvg(scene, key, svg, w, h);
}
