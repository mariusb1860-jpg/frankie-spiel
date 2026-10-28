import { GAME_WIDTH } from '../config.js';
import { loadSvg, svgDoc } from './svg.js';
import { attrs, ridge, ridgeY } from './scenery.js';
import { HU_GREEN, HU_RED, cauldron, paprikaPod, paprikaString } from './puszta.js';

// Level 7 (grown-ups, only loaded after the paprika button): Budapest on the Danube. Across the
// river stand the Parliament, the Chain Bridge, Buda Castle and the Fishermen's Bastion;
// on Frankie's side the yellow tram and, at the end, the market with paprika and goulash.
// Everything here is background: soft outlines, never the strong OUTLINE.

const f1 = (n) => n.toFixed(1);
const polygon = (pts, w, h) => `M0 ${h} ${pts.map(([x, y]) => `L${x} ${f1(y)}`).join(' ')} L${w} ${h} Z`;

// Landmarks stand on the far bank: this much empty space below their foot puts the foot
// on the bank line of hills-far-budapest (far pictures sit at GROUND_Y - 45, scale ~0.56).
const RIVER = 125;
const STONE = '#e6dcc6';
const STONE_DARK = '#a89c84';
const ROOF_RED = '#b8433a';
const ROOF_LINE = '#7e2a24';
const STONE_LIGHT = '#f2ebdc';
const STONE_SHADE = '#d3c7ad';
const GLASS = '#8aa0b4';
const QUAY = '#c9c2b4';
const SLOPE = '#8fbf7a';
const ZSOLNAY = ['#e2b13c', '#4f8f5a', '#d8742e', '#5a3a2a'];
const IRON = '#3a3f45';
const RAIL = '#2f4f3a';

// ---- Small helpers ----

// A pointed (Gothic) window w wide, from its tip at y down to y + h.
const gothic = (x, y, w, h) =>
  `M${f1(x)} ${f1(y + h)} V${f1(y + w * 0.9)} Q${f1(x)} ${f1(y + w * 0.2)} ${f1(x + w / 2)} ${f1(y)} Q${f1(x + w)} ${f1(y + w * 0.2)} ${f1(x + w)} ${f1(y + w * 0.9)} V${f1(y + h)} Z`;

// A round-arched opening w wide, from its top at y down to y + h.
const roundArch = (x, y, w, h) =>
  `M${f1(x)} ${f1(y + h)} V${f1(y + w / 2)} A${f1(w / 2)} ${f1(w / 2)} 0 0 1 ${f1(x + w)} ${f1(y + w / 2)} V${f1(y + h)} Z`;

// A slim spire standing on (x, y), w wide at its foot and h high.
const spire = (x, y, w, h) => `M${f1(x - w / 2)} ${f1(y)} L${f1(x)} ${f1(y - h)} L${f1(x + w / 2)} ${f1(y)} Z`;

// Colour patterns for the tiles: a diagonal checker, or zigzag bands across the roof.
const checker = (colors) => (row, col) => colors[(Math.floor(row / 2) + col * 2 + (row % 2) * 3) % colors.length];
const zigzag = (colors) => (row) => colors[Math.floor(row / 2) % colors.length];

// Zsolnay roof tiles: rows of diamonds (w x h) coloured by pick(row, col), clipped to the roof shape.
function diamondTiles(id, shape, [x0, y0, x1, y1], w, h, pick, grout) {
  const tiles = [];
  for (let row = 0, y = y0; y <= y1 + h; row++, y += h / 2) {
    for (let col = 0, x = x0 + (row % 2 ? w / 2 : 0); x <= x1 + w; col++, x += w) {
      const c = pick(row, col);
      tiles.push(`<path d="M${f1(x)} ${f1(y - h / 2)} L${f1(x + w / 2)} ${f1(y)} L${f1(x)} ${f1(y + h / 2)} L${f1(x - w / 2)} ${f1(y)} Z" fill="${c}"${grout ? ` stroke="${grout}" stroke-width="0.6"` : ''}/>`);
    }
  }
  return `<defs><clipPath id="${id}"><path d="${shape}"/></clipPath></defs><g clip-path="url(#${id})">${tiles.join('')}</g>`;
}

// A small far-away tree on a slope.
const farTree = (x, y, r) =>
  `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="#6f9f5e"/><circle cx="${f1(x - r * 0.3)}" cy="${f1(y - r * 0.3)}" r="${f1(r * 0.55)}" fill="#86b873"/>`;

// The stone embankment at the foot of a landmark (matches the bank of the far tile).
const quayBand = (w, y) => `<rect x="0" y="${y - 8}" width="${w}" height="8" fill="${QUAY}"/><path d="M0 ${y - 7} H${w}" stroke="#ddd7cb" stroke-width="2"/>`;

// Gentle white water lines, like wake() in beach.js.
function wake(y, x0, x1) {
  const out = [];
  for (let x = x0; x < x1; x += 34) out.push(`<path d="M${x} ${y} q8 -3 16 0" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.7"/>`);
  return out.join('');
}

// Striped market awning from x0 to x1, top at y, d deep, with a scalloped lower edge.
function awning(id, [x0, x1, y, d], n, base, stripe, line) {
  const w = (x1 - x0) / n;
  const top = (i) => x0 + 6 + (i * (x1 - x0 - 12)) / n;
  const scallops = [];
  for (let i = n - 1; i >= 0; i--) scallops.push(`Q${f1(x0 + (i + 0.5) * w)} ${y + d + 9} ${f1(x0 + i * w)} ${y + d}`);
  const shape = `M${x0 + 6} ${y} H${x1 - 6} L${x1} ${y + d} ${scallops.join(' ')} Z`;
  const stripes = [];
  for (let i = 0; i < n; i += 2) {
    stripes.push(`<path d="M${f1(top(i))} ${y} H${f1(top(i + 1))} L${f1(x0 + (i + 1) * w)} ${y + d + 10} H${f1(x0 + i * w)} Z" fill="${stripe}"/>`);
  }
  return `<defs><clipPath id="${id}"><path d="${shape}"/></clipPath></defs>
    <path d="${shape}" fill="${base}"/>
    <g clip-path="url(#${id})">${stripes.join('')}<rect x="${x0}" y="${y}" width="${x1 - x0}" height="5" fill="#000000" opacity="0.1"/>
      <path d="M${x0} ${y + d - 2} H${x1}" stroke="#000000" stroke-width="3" opacity="0.08"/></g>
    <path d="${shape}" fill="none" ${attrs(line, 1.8)}/>`;
}

// A small Hungarian flag on a pole standing at (x, y), waving to the right.
function smallFlag(x, y, h, s = 1) {
  const band = (top, color) =>
    `<path d="M${x + 1} ${f1(top)} C${f1(x + 7 * s)} ${f1(top - 2 * s)} ${f1(x + 13 * s)} ${f1(top + 2 * s)} ${f1(x + 19 * s)} ${f1(top)} V${f1(top + 4 * s)} C${f1(x + 13 * s)} ${f1(top + 6 * s)} ${f1(x + 7 * s)} ${f1(top + 2 * s)} ${x + 1} ${f1(top + 4 * s)} Z" fill="${color}"/>`;
  const t = y - h + 2;
  return `<path d="M${x} ${y} V${y - h}" stroke="#8a8278" stroke-width="1.8" stroke-linecap="round"/>
    ${band(t, HU_RED)}${band(t + 4 * s, '#ffffff')}${band(t + 8 * s, HU_GREEN)}
    <path d="M${x + 1} ${f1(t)} C${f1(x + 7 * s)} ${f1(t - 2 * s)} ${f1(x + 13 * s)} ${f1(t + 2 * s)} ${f1(x + 19 * s)} ${f1(t)} V${f1(t + 12 * s)} C${f1(x + 13 * s)} ${f1(t + 14 * s)} ${f1(x + 7 * s)} ${f1(t + 10 * s)} ${x + 1} ${f1(t + 12 * s)} Z" fill="none" ${attrs('#7a6a5a', 0.8)}/>`;
}

// ---- Background tiles ----

// Far away: the green Buda hills with villas, the far bank and the wide Danube.
function danubeFar() {
  const w = GAME_WIDTH;
  const hills = ridge(w, 70, [[16, 2, 0.4], [8, 5, 1.1]]);
  const bank = 118;
  const quay = 188;
  const villas = [];
  for (let x = 40; x < w - 40; x += 95 + ((x * 7) % 50)) {
    const y = ridgeY(hills, x) + 22 + ((x * 3) % 18);
    villas.push(`<rect x="${x - 7}" y="${f1(y - 7)}" width="14" height="7" fill="#efe8da"/><path d="M${x - 9} ${f1(y - 7)} L${x} ${f1(y - 13)} L${x + 9} ${f1(y - 7)} Z" fill="#c27a5a"/>`);
  }
  const trees = [];
  for (let x = 20; x < w - 20; x += 34 + ((x * 11) % 26)) trees.push(`<circle cx="${x}" cy="${f1(ridgeY(hills, x) + 6)}" r="${8 + (x % 5)}" fill="#7fae74"/>`);
  const waves = [];
  [[138, 30, 1.4, 0.4], [156, 42, 1.8, 0.45], [174, 56, 2.2, 0.5]].forEach(([y, gap, sw, op], r) => {
    for (let x = 12 + ((r * 29) % gap); x < w - 30; x += gap + ((x * 7) % 13)) {
      waves.push(`<path d="M${x} ${y} q${f1(gap * 0.17)} ${f1(-gap * 0.07)} ${f1(gap * 0.34)} 0" fill="none" stroke="#e3f1f8" stroke-width="${sw}" stroke-linecap="round" opacity="${op}"/>`);
    }
  });
  return svgDoc(w, 220, `
    <defs><linearGradient id="dn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8cc0da"/><stop offset="1" stop-color="#4f8fb5"/></linearGradient></defs>
    <path d="${polygon(hills, w, bank + 2)}" fill="#a9cf9a"/>
    ${trees.join('')}${villas.join('')}
    <rect y="${bank - 6}" width="${w}" height="8" fill="#c9c2b4"/>
    <rect y="${bank + 2}" width="${w}" height="${quay - bank}" fill="url(#dn)"/>
    ${waves.join('')}
    <rect y="${quay}" width="${w}" height="${220 - quay}" fill="#b9b2a4"/>
    <path d="M0 ${quay} H${w}" stroke="#d8d2c6" stroke-width="3"/>`);
}

// Right behind Frankie: the mown lawn of the promenade along the river.
function promenadeNear() {
  const w = GAME_WIDTH;
  const top = ridge(w, 76, [[3, 2, 0.6], [1.5, 6, 1.3]]);
  const stripes = [];
  for (let x = 0; x < w; x += 64) stripes.push(`<rect x="${x}" y="80" width="32" height="60" fill="#ffffff" opacity="0.07"/>`);
  return svgDoc(w, 140, `
    <defs><linearGradient id="pl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#93cf6c"/><stop offset="1" stop-color="#78ba58"/></linearGradient></defs>
    <path d="${polygon(top, w, 140)}" fill="url(#pl)"/>
    <path d="M${top.map(([x, y]) => `${x} ${f1(y + 3)}`).join(' L')}" fill="none" stroke="#b8e49a" stroke-width="3" opacity="0.8"/>
    ${stripes.join('')}`);
}

// ---- Far: the landmarks across the river and the boats on it ----

// The Hungarian Parliament: a long neo-Gothic front full of pinnacles, red roofs and the
// ribbed dome with its tall spire in the middle, on its embankment wall.
function parliament() {
  const W = 420;
  const line = attrs(STONE_DARK, 1.5);
  const roofLine = attrs(ROOF_LINE, 1.5);
  const windows = (x0, x1, y, h, step = 7, w = 3.6) => {
    const out = [];
    for (let x = x0; x <= x1 - w; x += step) out.push(gothic(x, y, w, h));
    return `<path d="${out.join(' ')}" fill="${GLASS}"/>`;
  };
  const pinnacles = (x0, x1, y, step, w = 4, h = 10) => {
    const out = [];
    for (let x = x0; x <= x1; x += step) out.push(spire(x, y, w, h));
    return `<path d="${out.join(' ')}" fill="${STONE}" ${attrs(STONE_DARK, 1)}/>`;
  };
  const turret = (x, top, w = 6) =>
    `<rect x="${x - w / 2}" y="${top}" width="${w}" height="${186 - top}" fill="${STONE_LIGHT}" ${attrs(STONE_DARK, 1.2)}/>
    <path d="${spire(x, top, w + 2, 18)}" fill="${STONE}" ${attrs(STONE_DARK, 1.2)}/>`;
  const eaveShade = (x, y, w) => `<rect x="${x + 1}" y="${y + 1}" width="${w - 2}" height="3" fill="${STONE_SHADE}"/>`;
  // Left half (end pavilion, long wing, inner pavilion); the right half is its mirror image.
  const half = `
    <path d="M6 108 L14 86 H40 L48 108 Z" fill="${ROOF_RED}" ${roofLine}/>
    <path d="M44 126 L52 113 H118 L126 126 Z" fill="${ROOF_RED}" ${roofLine}/>
    <path d="M122 106 L130 86 H146 L154 106 Z" fill="${ROOF_RED}" ${roofLine}/>
    <path d="M12 98 H42 M130 96 H146" stroke="#9a3830" stroke-width="1.2"/>
    <rect x="8" y="108" width="38" height="78" fill="${STONE}" ${line}/>
    <rect x="46" y="126" width="78" height="60" fill="${STONE}" ${line}/>
    <rect x="124" y="106" width="28" height="80" fill="${STONE}" ${line}/>
    ${eaveShade(8, 108, 38)}${eaveShade(46, 126, 78)}${eaveShade(124, 106, 28)}
    ${windows(13, 44, 114, 22)}${windows(13, 44, 142, 18)}
    ${windows(50, 122, 133, 15)}${windows(50, 122, 152, 13)}
    ${windows(128, 152, 112, 26)}${windows(128, 152, 145, 18)}
    <path d="M70 128 V168 M98 128 V168" stroke="${STONE_DARK}" stroke-width="1.6" opacity="0.7"/>
    ${pinnacles(52, 120, 127, 11)}
    ${pinnacles(16, 38, 108, 11, 4, 9)}
    ${turret(9, 100)}${turret(45, 100)}${turret(125, 98)}${turret(151, 98)}`;
  // The arcade along the ground floor.
  const arcade = [];
  for (let x = 12; x < W - 14; x += 9) arcade.push(roundArch(x, 172, 5, 14));
  const ribs = [-2, -1, 0, 1, 2].map((k) => `M${210 + k * 11} 68 C${210 + k * 11} 50 ${210 + k * 5} 34 210 24`).join(' ');
  const drumPinnacles = [184, 197, 210, 223, 236].map((x) => spire(x, 70, 5, 12)).join(' ');
  const tower = (x) => `
    <rect x="${x - 6}" y="58" width="12" height="60" fill="${STONE_LIGHT}" ${attrs(STONE_DARK, 1.3)}/>
    <path d="${gothic(x - 3, 64, 6, 16)} ${gothic(x - 2, 88, 4, 14)}" fill="${GLASS}"/>
    <path d="${spire(x, 58, 12, 34)}" fill="${STONE}" ${attrs(STONE_DARK, 1.3)}/>
    <path d="${spire(x - 6, 58, 4, 12)} ${spire(x + 6, 58, 4, 12)}" fill="${STONE}" ${attrs(STONE_DARK, 1)}/>`;
  return svgDoc(W, 200 + RIVER, `
    <defs><linearGradient id="pd" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d4664f"/><stop offset="0.55" stop-color="#c0503e"/><stop offset="1" stop-color="#9c3a2c"/></linearGradient></defs>
    <rect x="186" y="66" width="48" height="40" fill="${STONE}" ${line}/>
    <path d="${[188, 197, 206, 215, 224].map((x) => gothic(x + 1.5, 76, 5, 22)).join(' ')}" fill="${GLASS}"/>
    <path d="M182 68 C182 46 194 32 210 24 C226 32 238 46 238 68 Z" fill="url(#pd)" ${attrs(ROOF_LINE, 1.5)}/>
    <path d="${ribs}" fill="none" stroke="${STONE}" stroke-width="1.8" stroke-linecap="round"/>
    <path d="${drumPinnacles}" fill="${STONE}" ${attrs(STONE_DARK, 1)}/>
    <rect x="205" y="14" width="10" height="12" fill="${STONE_LIGHT}" ${attrs(STONE_DARK, 1.2)}/>
    <path d="${gothic(208.5, 16, 3, 8)}" fill="${GLASS}"/>
    <path d="${spire(210, 15, 7, 11)}" fill="${STONE}" ${attrs(STONE_DARK, 1.2)}/>
    ${half}
    <g transform="matrix(-1 0 0 1 ${W} 0)">${half}</g>
    <path d="M150 116 L160 102 H260 L270 116 Z" fill="${ROOF_RED}" ${roofLine}/>
    <rect x="152" y="116" width="116" height="70" fill="${STONE}" ${line}/>
    ${eaveShade(152, 116, 116)}
    ${windows(157, 266, 123, 20)}${windows(157, 266, 149, 16)}
    ${pinnacles(158, 262, 116, 13)}
    ${tower(168)}${tower(252)}
    <path d="M8 169 H412" stroke="${STONE_DARK}" stroke-width="1.4"/>
    <path d="${arcade.join(' ')}" fill="#b3a78e"/>
    <rect x="0" y="186" width="${W}" height="14" fill="#9c958a"/>
    <path d="M0 187 H${W}" stroke="#b9b3a8" stroke-width="2"/>
    <path d="${Array.from({ length: 23 }, (_, i) => `M${10 + i * 18} 190 V200`).join(' ')}" stroke="#8a8378" stroke-width="0.8"/>`);
}

// The Chain Bridge: two stone pylons like triumphal arches standing in the river, the
// chains swinging over their tops, the deck through the arches, a lion at each end.
function chainBridge() {
  const W = 600;
  const H = 220 + RIVER;
  const DECK = 168;
  const FOOT = H - 40;
  const spans = [
    [[0, 170], [75, 150], [150, 52]],
    [[150, 52], [300, 260], [450, 52]],
    [[450, 52], [525, 150], [600, 170]],
  ];
  const at = (p, t) => [0, 1].map((i) => (1 - t) ** 2 * p[0][i] + 2 * t * (1 - t) * p[1][i] + t * t * p[2][i]);
  const chains = spans.map((p) => `M${p[0][0]} ${p[0][1]} Q${p[1][0]} ${p[1][1]} ${p[2][0]} ${p[2][1]}`).join(' ');
  const hangers = [];
  for (const p of spans) {
    const n = Math.round((p[2][0] - p[0][0]) / 15);
    for (let k = 1; k < n; k++) {
      const [x, y] = at(p, k / n);
      if (Math.abs(x - 150) < 36 || Math.abs(x - 450) < 36 || DECK - y < 8) continue;
      hangers.push(`M${f1(x)} ${f1(y)} V${DECK - 3}`);
    }
  }
  const lattice = [];
  for (let x = 0; x < W; x += 12) lattice.push(`M${x} ${DECK + 3} L${x + 6} ${DECK + 9} L${x + 12} ${DECK + 3}`);
  const posts = [];
  for (let x = 4; x < W; x += 10) posts.push(`M${x} ${DECK - 5} V${DECK}`);
  const pylon = (cx) => `
    <rect x="${cx - 34}" y="${DECK}" width="68" height="${FOOT - DECK}" fill="#ddd3bc" ${attrs(STONE_DARK, 1.5)}/>
    <rect x="${cx - 33}" y="${FOOT - 28}" width="66" height="27" fill="#b3a891"/>
    <path d="M${cx - 34} ${DECK + 40} H${cx + 34} M${cx - 34} ${DECK + 72} H${cx + 34} M${cx - 34} ${DECK + 104} H${cx + 34}" stroke="${STONE_DARK}" stroke-width="1.2" opacity="0.7"/>
    <rect x="${cx - 30}" y="62" width="60" height="${DECK - 62}" fill="${STONE}" ${attrs(STONE_DARK, 1.5)}/>
    <rect x="${cx - 29}" y="68" width="8" height="${DECK - 68}" fill="${STONE_LIGHT}"/>
    <rect x="${cx + 21}" y="68" width="8" height="${DECK - 68}" fill="${STONE_SHADE}"/>
    <path d="${roundArch(cx - 20, 94, 40, DECK - 94)}" fill="${STONE_SHADE}"/>
    <path d="${roundArch(cx - 14, 100, 28, DECK - 100)}" fill="#6f8fa6" ${attrs(STONE_DARK, 1.5)}/>
    <path d="M${cx - 14} 120 V${DECK} M${cx - 8} 108 V${DECK}" stroke="#5f7d93" stroke-width="2" opacity="0.6"/>
    <rect x="${cx - 3}" y="92" width="6" height="9" fill="${STONE_LIGHT}" ${attrs(STONE_DARK, 1)}/>
    <rect x="${cx - 32}" y="78" width="64" height="7" fill="${STONE_SHADE}" ${attrs(STONE_DARK, 1.2)}/>
    <rect x="${cx - 34}" y="56" width="68" height="8" fill="${STONE_LIGHT}" ${attrs(STONE_DARK, 1.3)}/>
    <rect x="${cx - 25}" y="46" width="50" height="10" fill="${STONE}" ${attrs(STONE_DARK, 1.3)}/>
    ${wake(FOOT - 3, cx - 56, cx - 30)}${wake(FOOT - 3, cx + 36, cx + 60)}`;
  // A lion lying on its pedestal, looking left; (x, y) is the front of its paws.
  const lion = (x, y) => `<g transform="translate(${x} ${y})">
    <path d="M27 -3 C32 -3 33 -9 29 -11" fill="none" stroke="#8f8570" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M2 0 C2 -6 6 -9 12 -9 H21 C26 -9 28 -6 28 -2 V0 Z" fill="#c9bfa8" ${attrs('#8f8570', 1.2)}/>
    <path d="M0 0 H11 V-3 H2 Q0 -3 0 -1 Z" fill="#d6ccb5" ${attrs('#8f8570', 1)}/>
    <circle cx="6" cy="-10" r="5.6" fill="#b9ad94" ${attrs('#8f8570', 1.2)}/>
    <circle cx="3.6" cy="-9.6" r="3.2" fill="#d6ccb5"/></g>`;
  const abutment = `
    <rect x="-2" y="158" width="50" height="62" fill="${STONE}" ${attrs(STONE_DARK, 1.5)}/>
    <path d="M0 178 H48 M0 198 H48 M16 158 V178 M32 178 V198 M16 198 V220" stroke="${STONE_DARK}" stroke-width="1.1" opacity="0.7"/>
    <rect x="-4" y="152" width="54" height="7" fill="${STONE_LIGHT}" ${attrs(STONE_DARK, 1.2)}/>
    <rect x="8" y="140" width="30" height="12" fill="${STONE_SHADE}" ${attrs(STONE_DARK, 1.2)}/>
    ${lion(9, 140)}`;
  return svgDoc(W, H, `
    ${pylon(150)}${pylon(450)}
    <path d="${hangers.join(' ')}" stroke="#4a5058" stroke-width="1.5"/>
    <path d="${posts.join(' ')} M0 ${DECK - 5} H${W}" stroke="#5d646c" stroke-width="1.3"/>
    <rect x="0" y="${DECK}" width="${W}" height="11" fill="#5d646c"/>
    <path d="M0 ${DECK + 1} H${W}" stroke="#8d959e" stroke-width="2"/>
    <path d="${lattice.join(' ')}" fill="none" stroke="#7d858e" stroke-width="1"/>
    <path d="${chains}" fill="none" stroke="${IRON}" stroke-width="6" stroke-linecap="round"/>
    <path d="${chains}" fill="none" stroke="#69717a" stroke-width="2" stroke-dasharray="5 4"/>
    ${abutment}
    <g transform="matrix(-1 0 0 1 ${W} 0)">${abutment}</g>`);
}

// Buda Castle on its hill: a wooded slope with walls, the long palace on top and the
// green copper dome with its lantern in the middle.
function budaCastle() {
  const W = 360;
  const FOOT = 170;
  const GREEN = '#6fa58c';
  const GREEN_LINE = '#4a7a64';
  const hill = `M0 ${FOOT} C22 167 36 158 46 150 C54 142 60 132 68 128 H292 C300 132 306 142 314 150 C324 158 338 167 ${W} ${FOOT} Z`;
  const trees = [[22, 163, 6], [42, 156, 7], [62, 150, 8], [86, 152, 8], [110, 156, 7], [134, 150, 7], [158, 156, 8], [182, 150, 7],
    [206, 156, 8], [230, 150, 7], [254, 155, 8], [278, 150, 8], [300, 152, 7], [320, 157, 7], [340, 163, 6], [74, 162, 6], [146, 162, 6], [218, 162, 6], [290, 162, 6]];
  const win = [];
  for (let x = 104; x < 148; x += 9) win.push(`M${x} 96 h4 v7 h-4 Z M${x} 110 h4 v8 h-4 Z`, `M${W - x - 4} 96 h4 v7 h-4 Z M${W - x - 4} 110 h4 v8 h-4 Z`);
  for (const x of [78, 88, 268, 278]) win.push(`M${x} 90 h4 v9 h-4 Z M${x} 106 h4 v11 h-4 Z`);
  const columns = [155, 165, 175, 185, 195].map((x) => `<rect x="${x}" y="86" width="5" height="32" fill="${STONE_LIGHT}"/>`).join('');
  const statues = [154, 167, 180, 193, 206].map((x) => `<path d="M${x - 1.6} 72 V66 Q${x} 62 ${x + 1.6} 66 V72 Z" fill="${STONE_LIGHT}" ${attrs(STONE_DARK, 0.8)}/>`).join('');
  const drumCols = [165, 172, 180, 188, 195].map((x) => `<rect x="${x - 1.5}" y="46" width="3" height="28" fill="${STONE_LIGHT}"/>`).join('');
  const drumWin = [168, 176, 184, 191].map((x) => `M${x - 1.5} 70 V56 Q${x} 52 ${x + 1.5} 56 V70 Z`).join(' ');
  return svgDoc(W, FOOT + RIVER, `
    <path d="${hill}" fill="${SLOPE}" ${attrs('#73a463', 1.5)}/>
    ${trees.map(([x, y, r]) => farTree(x, y, r)).join('')}
    <path d="M58 122 H302 L306 140 H54 Z" fill="#d9cfb8" ${attrs(STONE_DARK, 1.4)}/>
    <path d="${Array.from({ length: 12 }, (_, i) => `M${66 + i * 21} 123 V139`).join(' ')}" stroke="${STONE_DARK}" stroke-width="1.2" opacity="0.6"/>
    <path d="M58 127 H302" stroke="${STONE_SHADE}" stroke-width="2"/>
    <rect x="162" y="42" width="36" height="34" fill="${STONE}" ${attrs(STONE_DARK, 1.4)}/>
    <path d="${drumWin}" fill="${GLASS}"/>
    ${drumCols}
    <rect x="158" y="38" width="44" height="5" fill="${STONE_LIGHT}" ${attrs(STONE_DARK, 1)}/>
    <path d="M161 39 C161 25 168 15 180 11 C192 15 199 25 199 39 Z" fill="${GREEN}" ${attrs(GREEN_LINE, 1.4)}/>
    <path d="M170 38 C170 27 174 17 180 12 M190 38 C190 27 186 17 180 12 M180 12 V38" fill="none" stroke="#9ccbb4" stroke-width="1.5"/>
    <path d="M165 33 C166 25 170 19 175 15" fill="none" stroke="#a8d6c0" stroke-width="2.5" stroke-linecap="round" opacity="0.7"/>
    <rect x="176" y="4" width="8" height="9" fill="${STONE_LIGHT}" ${attrs(STONE_DARK, 1)}/>
    <path d="M175 5 Q180 -1 185 5 Z" fill="${GREEN}" ${attrs(GREEN_LINE, 1)}/>
    <path d="M70 90 L78 78 H282 L290 90 Z" fill="#7f9a8a" ${attrs('#5f7a6a', 1.4)}/>
    <path d="M70 84 L76 72 H94 L100 84 Z M260 84 L266 72 H284 L290 84 Z" fill="#7f9a8a" ${attrs('#5f7a6a', 1.4)}/>
    <rect x="72" y="90" width="216" height="34" fill="${STONE}" ${attrs(STONE_DARK, 1.4)}/>
    <rect x="72" y="84" width="26" height="40" fill="${STONE}" ${attrs(STONE_DARK, 1.4)}/>
    <rect x="262" y="84" width="26" height="40" fill="${STONE}" ${attrs(STONE_DARK, 1.4)}/>
    <path d="M73 91 H287" stroke="${STONE_SHADE}" stroke-width="2.5"/>
    <path d="M100 107 H150 M210 107 H260" stroke="${STONE_SHADE}" stroke-width="1.6"/>
    <rect x="150" y="80" width="60" height="44" fill="${STONE}" ${attrs(STONE_DARK, 1.4)}/>
    <rect x="152" y="86" width="56" height="34" fill="${STONE_SHADE}"/>
    ${columns}
    <rect x="148" y="78" width="64" height="7" fill="${STONE_LIGHT}" ${attrs(STONE_DARK, 1.2)}/>
    <path d="M150 72 H210 V78 H150 Z" fill="none" ${attrs(STONE_DARK, 1)}/>
    <path d="${Array.from({ length: 15 }, (_, i) => `M${152 + i * 4} 73 V78`).join(' ')}" stroke="${STONE_DARK}" stroke-width="0.9"/>
    ${statues}
    <rect x="148" y="118" width="64" height="5" fill="${STONE_LIGHT}" ${attrs(STONE_DARK, 1)}/>
    <path d="${win.join(' ')}" fill="${GLASS}"/>
    ${quayBand(W, FOOT)}`);
}

// The Fishermen's Bastion: white terraces with arcades and five pointed turrets on the
// hill, and behind it the tower of the Matthias Church with its colourful tiled roof.
function fishermensBastion() {
  const W = 300;
  const FOOT = 150;
  const WHITE = '#f6f2e8';
  const WHITE_LINE = '#b8b0a0';
  const SLATE = '#8a8f96';
  const hill = `M0 ${FOOT} C20 146 34 134 46 124 C54 118 60 116 66 116 H234 C240 116 246 118 254 124 C266 134 280 146 ${W} ${FOOT} Z`;
  const trees = [[22, 140, 7], [42, 132, 8], [70, 134, 8], [96, 128, 7], [124, 136, 8], [150, 130, 7], [178, 136, 8], [204, 128, 7], [230, 134, 8], [258, 132, 8], [280, 140, 7], [110, 142, 6], [190, 142, 6]];
  const nave = 'M112 76 L124 52 H196 L206 76 Z';
  const spireShape = 'M216 46 L227 4 L238 46 Z';
  const arches = (x0, x1, y, w, h, step) => {
    const out = [];
    for (let x = x0; x <= x1 - w; x += step) out.push(roundArch(x, y, w, h));
    return `<path d="${out.join(' ')}" fill="#a9b3bc"/>`;
  };
  const turret = (x, top, base, w) => `
    <rect x="${f1(x - w / 2)}" y="${top}" width="${w}" height="${base - top}" fill="${WHITE}" ${attrs(WHITE_LINE, 1.3)}/>
    <path d="${roundArch(x - w / 6, top + 6, w / 3, Math.min(14, (base - top) * 0.4))}" fill="#a9b3bc"/>
    <rect x="${f1(x - w / 2 - 1.5)}" y="${top - 3}" width="${w + 3}" height="4" fill="${WHITE}" ${attrs(WHITE_LINE, 1)}/>
    <path d="${spire(x, top - 3, w + 4, w * 1.7)}" fill="${SLATE}" ${attrs('#62666c', 1.3)}/>
    <path d="M${f1(x - 1)} ${f1(top - 4 - w * 1.5)} L${f1(x - w / 2)} ${top - 4}" stroke="#a9aeb5" stroke-width="1.6" stroke-linecap="round"/>`;
  return svgDoc(W, FOOT + RIVER, `
    <path d="${hill}" fill="${SLOPE}" ${attrs('#73a463', 1.5)}/>
    ${trees.map(([x, y, r]) => farTree(x, y, r)).join('')}
    <rect x="112" y="74" width="94" height="26" fill="${STONE}" ${attrs(STONE_DARK, 1.2)}/>
    ${diamondTiles('mr', nave, [112, 52, 206, 76], 9, 8, zigzag(['#e2b13c', '#d8742e', '#4f8f5a', '#d8742e']))}
    <path d="${nave}" fill="none" ${attrs('#6a4a2a', 1.3)}/>
    <rect x="217" y="44" width="20" height="60" fill="${STONE}" ${attrs(STONE_DARK, 1.3)}/>
    <path d="${gothic(222, 52, 4, 16)} ${gothic(228, 52, 4, 16)} ${gothic(224.5, 76, 5, 14)}" fill="${GLASS}"/>
    <path d="M217 72 H237" stroke="${STONE_DARK}" stroke-width="1.4"/>
    ${diamondTiles('ms', spireShape, [216, 4, 238, 46], 6, 6, zigzag(['#d8742e', '#e2b13c', '#4f8f5a']))}
    <path d="${spireShape}" fill="none" ${attrs('#6a4a2a', 1.3)}/>
    <path d="${spire(216, 46, 4, 10)} ${spire(238, 46, 4, 10)}" fill="${STONE}" ${attrs(STONE_DARK, 1)}/>
    <rect x="76" y="76" width="148" height="24" fill="${WHITE}" ${attrs(WHITE_LINE, 1.4)}/>
    ${arches(82, 220, 80, 9, 18, 14)}
    <path d="M76 76 H224" stroke="${WHITE}" stroke-width="3"/>
    <path d="${Array.from({ length: 19 }, (_, i) => `M${77 + i * 8} 76 V72 H${81 + i * 8} V76`).join(' ')}" fill="none" stroke="${WHITE_LINE}" stroke-width="1"/>
    <rect x="36" y="100" width="228" height="20" fill="${WHITE}" ${attrs(WHITE_LINE, 1.4)}/>
    ${arches(42, 262, 103, 8, 15, 12)}
    <path d="M36 101 H264" stroke="${WHITE}" stroke-width="2"/>
    ${turret(96, 66, 100, 16)}${turret(204, 66, 100, 16)}
    ${turret(150, 52, 100, 22)}
    ${turret(48, 92, 120, 14)}${turret(252, 92, 120, 14)}
    ${quayBand(W, FOOT)}`);
}

// A white Danube excursion boat, bow to the left, a small flag at the stern.
function danubeBoat() {
  const windows = [];
  for (let x = 42; x < 168; x += 13) windows.push(`<rect x="${x}" y="70" width="9" height="12" rx="2" fill="#5f8fc0"/>`);
  const rail = [];
  for (let x = 74; x <= 170; x += 8) rail.push(`M${x} 56 V64`);
  return svgDoc(200, 150, `
    ${wake(118, 40, 190)}
    <path d="M30 113 Q18 112 9 103 M24 117 Q12 116 4 108" fill="none" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" opacity="0.8"/>
    <path d="M182 92 V56" stroke="#8a96a6" stroke-width="2" stroke-linecap="round"/>
    <path d="M183 57 C188 55 193 59 198 57 V61 C193 63 188 59 183 61 Z" fill="${HU_RED}"/>
    <path d="M183 61 C188 59 193 63 198 61 V65 C193 67 188 63 183 65 Z" fill="#ffffff"/>
    <path d="M183 65 C188 63 193 67 198 65 V69 C193 71 188 67 183 69 Z" fill="${HU_GREEN}"/>
    <path d="M183 57 C188 55 193 59 198 57 V69 C193 71 188 67 183 69 Z" fill="none" ${attrs('#7a6a5a', 0.8)}/>
    <path d="M${rail.join(' ')} M70 56 H172" stroke="#c4ccd6" stroke-width="1.4"/>
    <path d="M72 44 H174 V48 H72 Z" fill="#ffffff" ${attrs('#8a96a6', 1.5)}/>
    <path d="M72 48 H174" stroke="#2d4f86" stroke-width="2"/>
    <path d="M90 48 V64 M126 48 V64 M162 48 V64" stroke="#8a96a6" stroke-width="1.5"/>
    <rect x="40" y="44" width="30" height="20" rx="3" fill="#ffffff" ${attrs('#8a96a6', 1.5)}/>
    <rect x="44" y="48" width="9" height="7" rx="1.5" fill="#5f8fc0"/><rect x="56" y="48" width="9" height="7" rx="1.5" fill="#5f8fc0"/>
    <path d="M38 44 H72" stroke="#2d4f86" stroke-width="2.5" stroke-linecap="round"/>
    <rect x="32" y="64" width="146" height="28" rx="3" fill="#ffffff" ${attrs('#8a96a6', 1.8)}/>
    ${windows.join('')}
    <path d="M4 87 L196 91 C196 103 190 112 180 112 H28 Z" fill="#2d4f86" ${attrs('#1d2f50', 2)}/>
    <path d="M10 92 L194 95" stroke="#ffffff" stroke-width="2.5"/>
    <path d="M26 106 H184" stroke="#4f74ad" stroke-width="2" opacity="0.7"/>`);
}

// ---- Mid: tram, market hall and stalls ----

// The yellow Budapest tram, seen from the side, with its pantograph on the overhead wire.
function tram() {
  const BODY = '#f2c230';
  const BODY_LINE = '#9a7a10';
  const mullions = [];
  for (const x of [40, 106, 130, 154, 222]) mullions.push(`<rect x="${x - 2}" y="46" width="4" height="32" fill="${BODY}"/>`);
  const door = (x) => `
    <rect x="${x}" y="44" width="22" height="68" fill="${BODY}" ${attrs(BODY_LINE, 1.5)}/>
    <rect x="${x + 3}" y="48" width="7" height="44" rx="1.5" fill="#cfe6f5" ${attrs(BODY_LINE, 1)}/>
    <rect x="${x + 12}" y="48" width="7" height="44" rx="1.5" fill="#cfe6f5" ${attrs(BODY_LINE, 1)}/>
    <path d="M${x + 11} 44 V112" stroke="${BODY_LINE}" stroke-width="1.2"/>`;
  const bogie = (x) => `
    <rect x="${x - 28}" y="108" width="56" height="12" rx="4" fill="#3a3a3a"/>
    <circle cx="${x - 14}" cy="122" r="7.5" fill="#2b2b2b"/><circle cx="${x + 14}" cy="122" r="7.5" fill="#2b2b2b"/>
    <circle cx="${x - 14}" cy="122" r="2.6" fill="#8a8a8a"/><circle cx="${x + 14}" cy="122" r="2.6" fill="#8a8a8a"/>`;
  return svgDoc(260, 130, `
    <defs><linearGradient id="tw" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="260" y2="0">
      <stop offset="0" stop-color="#4a4a4a" stop-opacity="0"/><stop offset="0.2" stop-color="#4a4a4a" stop-opacity="0.7"/>
      <stop offset="0.8" stop-color="#4a4a4a" stop-opacity="0.7"/><stop offset="1" stop-color="#4a4a4a" stop-opacity="0"/></linearGradient></defs>
    <path d="M0 1.5 H260" stroke="url(#tw)" stroke-width="1.2"/>
    ${bogie(58)}${bogie(202)}
    <rect x="104" y="20" width="54" height="10" rx="2" fill="#c8c8c0" ${attrs('#8a8a82', 1.2)}/>
    <path d="M124 21 H138" stroke="#3a3a3a" stroke-width="3" stroke-linecap="round"/>
    <path d="M131 20 L121 12 L131 4 L141 12 Z" fill="none" stroke="#3a3a3a" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M121 2.5 H141" stroke="#3a3a3a" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M131 4 V2.5" stroke="#3a3a3a" stroke-width="1.8"/>
    <path d="M10 112 V50 Q10 36 26 36 H234 Q250 36 250 50 V112 Z" fill="${BODY}" ${attrs(BODY_LINE, 2)}/>
    <path d="M18 37 Q20 28 34 28 H226 Q240 28 242 37 Z" fill="#f6f5ef" ${attrs('#a8a89c', 1.5)}/>
    <path d="M16 78 V52 Q16 46 24 46 H236 Q244 46 244 52 V78 Z" fill="#cfe6f5" ${attrs(BODY_LINE, 1.5)}/>
    ${mullions.join('')}
    <path d="M24 50 L34 50 L22 70 Z M150 50 L162 50 L142 74 Z" fill="#ffffff" opacity="0.5"/>
    <path d="M11 84 H249" stroke="#ffffff" stroke-width="3"/>
    <path d="M11 104 H249 V112 H11 Z" fill="#d9a81e"/>
    ${door(62)}${door(178)}
    <rect x="14" y="38" width="22" height="6" rx="1.5" fill="#3a3a3a"/><rect x="224" y="38" width="22" height="6" rx="1.5" fill="#3a3a3a"/>
    <circle cx="16" cy="96" r="3.5" fill="#fffbe0" ${attrs(BODY_LINE, 1)}/><circle cx="244" cy="96" r="3.5" fill="#fff0c0" ${attrs(BODY_LINE, 1)}/>`);
}

// The Great Market Hall: brick front with stone bands, the big arched gate and the steep
// roof covered in coloured Zsolnay tiles, two corner turrets with spires.
function marketHall() {
  const BRICK = '#c8643a';
  const BRICK_LINE = '#8a3e22';
  const BAND = '#efe0c8';
  const roof = 'M18 120 L54 40 H246 L282 120 Z';
  const front = 'M96 230 V92 L150 46 L204 92 V230 Z';
  const turretRoof = (x) => `M${x - 11} 62 L${x} 16 L${x + 11} 62 Z`;
  const bricks = [];
  for (let y = 126; y < 230; y += 6) bricks.push(`M20 ${y} H280`);
  for (let y = 96; y < 126; y += 6) bricks.push(`M96 ${y} H204`);
  const winRow = (y, h, fill) => [32, 54, 76, 212, 234, 256].map((x) => `<path d="${roundArch(x, y, 12, h)}" fill="${fill}" stroke="${BAND}" stroke-width="2.5"/>`).join('');
  const turret = (x) => `
    <rect x="${x - 9}" y="62" width="18" height="168" fill="${BRICK}" ${attrs(BRICK_LINE, 1.5)}/>
    <path d="M${x - 9} 100 H${x + 9} M${x - 9} 140 H${x + 9} M${x - 9} 180 H${x + 9}" stroke="${BAND}" stroke-width="3"/>
    <path d="${roundArch(x - 3, 70, 6, 18)} ${roundArch(x - 3, 110, 6, 18)}" fill="#5a3a2a"/>
    <rect x="${x - 11}" y="60" width="22" height="4" fill="${BAND}" ${attrs(BRICK_LINE, 1)}/>`;
  return svgDoc(300, 230, `
    <defs><clipPath id="mb"><rect x="20" y="120" width="260" height="110"/><path d="${front}"/></clipPath></defs>
    ${diamondTiles('mh', roof, [18, 40, 282, 120], 14, 12, checker(ZSOLNAY), '#4a2e20')}
    <path d="${roof}" fill="none" ${attrs('#5a3a2a', 2)}/>
    <path d="M54 40 H246" stroke="#3e2a1e" stroke-width="3"/>
    <rect x="20" y="120" width="260" height="110" fill="${BRICK}" ${attrs(BRICK_LINE, 2)}/>
    <path d="${front}" fill="${BRICK}" ${attrs(BRICK_LINE, 2)}/>
    <g clip-path="url(#mb)"><path d="${bricks.join(' ')}" stroke="#a84e2a" stroke-width="1" opacity="0.45"/></g>
    <rect x="16" y="116" width="268" height="6" fill="${BAND}" ${attrs(BRICK_LINE, 1.2)}/>
    <path d="M20 160 H280 M20 206 H280" stroke="${BAND}" stroke-width="4"/>
    <path d="M94 93 L150 45 L206 93" fill="none" stroke="${BAND}" stroke-width="5" stroke-linejoin="round"/>
    ${winRow(130, 22, GLASS)}${winRow(170, 30, '#5a3a2a')}
    <path d="${roundArch(120, 74, 60, 66)}" fill="${GLASS}" stroke="${BAND}" stroke-width="4"/>
    <path d="M140 80 V140 M160 80 V140 M120 112 H180" stroke="${BAND}" stroke-width="2.5"/>
    <circle cx="150" cy="64" r="7" fill="${GLASS}" stroke="${BAND}" stroke-width="3"/>
    <path d="${roundArch(122, 150, 56, 80)}" fill="#5a3a2a" stroke="${BAND}" stroke-width="5"/>
    <path d="M128 230 V178 A22 22 0 0 1 172 178 V230" fill="none" stroke="#7a5238" stroke-width="2"/>
    <path d="M150 158 V230" stroke="#7a5238" stroke-width="2"/>
    ${turret(96)}${turret(204)}
    ${diamondTiles('mt', `${turretRoof(96)} ${turretRoof(204)}`, [84, 16, 216, 62], 7, 7, zigzag(['#4f8f5a', '#e2b13c', '#d8742e']))}
    <path d="${turretRoof(96)} ${turretRoof(204)}" fill="none" ${attrs('#4a2e20', 1.5)}/>
    <path d="M96 16 V8 M204 16 V8" stroke="#5a3a2a" stroke-width="2" stroke-linecap="round"/>
    <circle cx="96" cy="7" r="2.2" fill="#e2b13c"/><circle cx="204" cy="7" r="2.2" fill="#e2b13c"/>`);
}

// Wooden counter of a market stall with a white cloth embroidered in red and green.
function counter(x0, x1, top) {
  const planks = [];
  for (let x = x0 + 14; x < x1; x += 14) planks.push(`M${x} ${top + 8} V170`);
  // The cloth hangs over the front edge; its lower edge is a row of points.
  const edge = [];
  for (let x = x0 + 2, k = 0; x < x1 - 2; x += 4, k++) edge.push(`${x} ${top + (k % 2 ? 19 : 14)}`);
  edge.push(`${x1 - 2} ${top + 14}`);
  const stitches = [];
  for (let x = x0 + 6, k = 0; x < x1 - 4; x += 8, k++) stitches.push(`<circle cx="${x}" cy="${top + 10}" r="1.6" fill="${k % 2 ? HU_GREEN : HU_RED}"/>`);
  return `
    <rect x="${x0}" y="${top + 4}" width="${x1 - x0}" height="${170 - top - 4}" fill="#a8743f" ${attrs('#6e4a26', 1.8)}/>
    <path d="${planks.join(' ')}" stroke="#8a5a33" stroke-width="1.5"/>
    <path d="M${x0 + 2} ${top + 6} H${x1 - 2} L${edge.reverse().join(' L')} Z" fill="#fbf7ee" ${attrs('#cfc6b4', 1)}/>
    ${stitches.join('')}
    <rect x="${x0 - 3}" y="${top}" width="${x1 - x0 + 6}" height="6" rx="1.5" fill="#c08a52" ${attrs('#6e4a26', 1.5)}/>`;
}

// A woven basket heaped with paprika, standing on the counter at (x, y).
function basket(x, y, colors) {
  // Pods lie on their sides, stems in the middle, in three layers above the rim.
  const pods = [[-1, -23, 0.5, 84], [1, -23, 0.5, -84], [-3, -28, 0.46, 100], [3, -28, 0.46, -100], [-7, -32, 0.42, -94], [5, -33, 0.38, 98]];
  return `
    ${pods.map(([dx, dy, s, a], i) => paprikaPod(x + dx, y + dy, s, a, colors[i % colors.length])).join('')}
    <path d="M${x - 19} ${y - 18} L${x - 15} ${y} H${x + 15} L${x + 19} ${y - 18} Z" fill="#c9a05a" ${attrs('#8a6a3a', 1.6)}/>
    <path d="M${x - 18} ${y - 12} H${x + 18} M${x - 16} ${y - 6} H${x + 16}" stroke="#a8803c" stroke-width="1.4"/>
    <path d="M${x - 8} ${y - 18} V${y} M${x} ${y - 18} V${y} M${x + 8} ${y - 18} V${y}" stroke="#a8803c" stroke-width="1" opacity="0.7"/>
    <rect x="${x - 21}" y="${y - 21}" width="42" height="4" rx="2" fill="#d8b46c" ${attrs('#8a6a3a', 1.3)}/>`;
}

// The two posts and the dark back wall of a market stall.
function stallFrame(top) {
  const post = (x) => `<rect x="${x - 3.5}" y="${top}" width="7" height="${170 - top}" fill="#8a5a33" ${attrs('#5a3a1e', 1.5)}/><path d="M${x - 1} ${top + 4} V166" stroke="#a8743f" stroke-width="1.5"/>`;
  return `
    <rect x="12" y="${top}" width="156" height="${170 - top}" fill="#6e5038"/>
    <path d="M12 ${top + 6} H168" stroke="#5a3e2a" stroke-width="10" opacity="0.5"/>
    ${post(10)}${post(170)}`;
}

// Market stall with strings of dried paprika, baskets of fresh pods and a painted sign.
function paprikaStall() {
  return svgDoc(180, 170, `
    ${stallFrame(44)}
    ${paprikaString(30, 58, 4)}${paprikaString(90, 58, 3)}${paprikaString(150, 58, 4)}
    ${awning('pa', [4, 176, 38, 24], 10, '#ffffff', '#d7261e', '#8f1a14')}
    <path d="M62 38 V30 M118 38 V30" stroke="#5a3a1e" stroke-width="1.6"/>
    <rect x="52" y="8" width="76" height="24" rx="4" fill="#f4ead2" ${attrs('#8a6a3a', 1.8)}/>
    <rect x="56" y="12" width="68" height="16" rx="2" fill="none" stroke="#d8c8a0" stroke-width="1.2"/>
    ${paprikaPod(68, 20, 0.62, -90)}
    <path d="M66 21 C64 18 62 15 64 12" fill="none" stroke="#3f7a2e" stroke-width="2" stroke-linecap="round"/>
    ${counter(10, 170, 118)}
    ${basket(56, 120, ['#d7261e', '#b8201a'])}
    ${basket(124, 120, ['#d7261e', '#e2b13c', '#b8201a', '#7fae3a'])}`);
}

// Goulash stall: the steaming cauldron on a little brick stove, bowls of soup and a flag.
function goulashStall() {
  const steam = (x, y, s) => {
    const [a, b, c, d] = [5, 9, 15, 14].map((n) => f1(n * s));
    return `<path d="M${x} ${y} c-${a} -${a} ${a} -${b} 0 -${c} c-${a} -${a} ${a} -${b} 0 -${d}" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.7"/>`;
  };
  const bowl = (x, y) => `
    <path d="M${x - 10} ${y - 6} C${x - 10} ${y} ${x - 6} ${y + 2} ${x} ${y + 2} C${x + 6} ${y + 2} ${x + 10} ${y} ${x + 10} ${y - 6} Z" fill="#f1e8d6" ${attrs('#a89c84', 1.3)}/>
    <ellipse cx="${x}" cy="${y - 6}" rx="10" ry="2.6" fill="#b5401f" ${attrs('#a89c84', 1)}/>
    <path d="M${x - 6} ${y - 3} H${x + 6}" stroke="${HU_RED}" stroke-width="1.4" opacity="0.6"/>
    ${steam(x, y - 9, 0.55)}`;
  return svgDoc(180, 170, `
    ${stallFrame(40)}
    ${paprikaString(150, 54, 3)}
    <path d="M126 54 L132 74" stroke="#8a6a3a" stroke-width="2.5" stroke-linecap="round"/>
    <ellipse cx="133" cy="77" rx="5" ry="3.5" fill="#8a6a3a"/>
    ${counter(10, 60, 132)}${counter(120, 170, 132)}
    <rect x="58" y="134" width="64" height="36" fill="#b5523e" ${attrs('#6e2a20', 1.8)}/>
    <path d="M58 146 H122 M58 158 H122 M74 134 V146 M106 134 V146 M66 146 V158 M90 146 V158 M114 146 V158" stroke="#8a3a2a" stroke-width="1.2"/>
    <path d="${roundArch(78, 148, 24, 22)}" fill="#3a2010"/>
    <path d="M82 170 C80 162 86 158 86 152 C89 158 92 156 92 152 C96 158 100 162 98 170 Z" fill="#f39a1e"/>
    <path d="M86 170 C86 164 89 162 90 158 C92 162 95 164 94 170 Z" fill="#ffd23f"/>
    <rect x="56" y="130" width="68" height="5" rx="1.5" fill="#7a3a2a" ${attrs('#4a2018', 1.2)}/>
    ${cauldron(90, 96, 1.1)}
    ${steam(78, 82, 1)}${steam(92, 78, 1.15)}${steam(104, 84, 0.9)}
    ${bowl(26, 132)}${bowl(46, 132)}${bowl(146, 132)}
    ${awning('ga', [4, 176, 18, 24], 10, '#ffffff', '#4f8f5a', '#2f5f3a')}
    ${smallFlag(16, 18, 18)}`);
}

// ---- Near ----

// Round stone tub with red and white geraniums.
function flowerTub() {
  const leaves = [[16, 30, 10], [30, 26, 12], [44, 24, 12], [56, 30, 9], [24, 20, 9], [48, 16, 9], [36, 14, 8]];
  const head = (x, y, c, line) => {
    const florets = [];
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI * 2 * i) / 6 + 0.3;
      florets.push(`<circle cx="${f1(x + Math.cos(a) * 3.8)}" cy="${f1(y + Math.sin(a) * 3.8)}" r="2.7" fill="${c}" ${attrs(line, 0.7)}/>`);
    }
    return `${florets.join('')}<circle cx="${x}" cy="${y}" r="2.6" fill="${c}"/><circle cx="${x}" cy="${y}" r="0.9" fill="#f2c14e"/>`;
  };
  const heads = [[18, 20, 'r'], [33, 11, 'w'], [48, 9, 'r'], [58, 21, 'w'], [26, 28, 'w'], [42, 24, 'r'], [11, 30, 'r']];
  return svgDoc(70, 60, `
    <path d="M18 30 L18 22 M33 30 V13 M48 28 V12 M42 30 V24 M56 30 L58 22" stroke="#3f7a2e" stroke-width="1.6" stroke-linecap="round"/>
    ${leaves.map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${f1(r * 0.7)}" fill="#4f8f3a" ${attrs('#2f6a24', 1.3)}/>`).join('')}
    ${leaves.map(([x, y, r]) => `<ellipse cx="${f1(x - r * 0.3)}" cy="${f1(y - r * 0.25)}" rx="${f1(r * 0.45)}" ry="${f1(r * 0.28)}" fill="#6aa84f"/>`).join('')}
    ${heads.map(([x, y, k]) => (k === 'r' ? head(x, y, '#d93a3a', '#9a2222') : head(x, y, '#ffffff', '#b8b8b0'))).join('')}
    <path d="M11 38 H59 L55 52 Q54 55 50 55 H20 Q16 55 15 52 Z" fill="#a8a29a" ${attrs('#79736b', 1.5)}/>
    <path d="M14 45 H56" stroke="#bdb7ae" stroke-width="2"/>
    <path d="M17 40 L20 52" stroke="#c4beb5" stroke-width="2.5" stroke-linecap="round" opacity="0.8"/>
    <rect x="8" y="32" width="54" height="7" rx="3" fill="#bdb7ae" ${attrs('#79736b', 1.5)}/>
    <rect x="22" y="54" width="26" height="6" rx="1.5" fill="#97918a" ${attrs('#79736b', 1.2)}/>`);
}

// ---- Strip: the cast-iron railing of the Danube promenade ----

// Strips are laid out every 156 px; drawing everything with that period makes them seamless.
const PERIOD = 156;

// Dark green cast-iron railing: posts with ball heads, two bars and rings between them.
function danubeRail() {
  const posts = [];
  const rings = [];
  for (let shift = -PERIOD; shift <= PERIOD; shift += PERIOD) {
    for (const x of [10 + shift, 10 + PERIOD / 2 + shift]) {
      if (x < -90 || x > 250) continue;
      rings.push(`<circle cx="${x + 26}" cy="39" r="8.5" fill="none" stroke="${RAIL}" stroke-width="2.4"/><circle cx="${x + 52}" cy="39" r="8.5" fill="none" stroke="${RAIL}" stroke-width="2.4"/>`);
      rings.push(`<circle cx="${x + 13}" cy="39" r="2.6" fill="${RAIL}"/><circle cx="${x + 39}" cy="39" r="2.6" fill="${RAIL}"/><circle cx="${x + 65}" cy="39" r="2.6" fill="${RAIL}"/>`);
      posts.push(`
        <rect x="${x - 3.5}" y="18" width="7" height="52" rx="1.5" fill="${RAIL}" ${attrs('#1c3024', 1.4)}/>
        <path d="M${x - 1.5} 22 V66" stroke="#4f7a5e" stroke-width="1.4"/>
        <rect x="${x - 5.5}" y="62" width="11" height="8" rx="1.5" fill="${RAIL}" ${attrs('#1c3024', 1.4)}/>
        <rect x="${x - 5}" y="17" width="10" height="3" rx="1" fill="${RAIL}" ${attrs('#1c3024', 1.2)}/>
        <circle cx="${x}" cy="12" r="5" fill="${RAIL}" ${attrs('#1c3024', 1.4)}/>
        <circle cx="${x - 1.6}" cy="10.4" r="1.5" fill="#6f9a7e"/>`);
    }
  }
  return svgDoc(160, 70, `
    ${rings.join('')}
    <path d="M0 28 H160 M0 50 H160" stroke="#1c3024" stroke-width="5"/>
    <path d="M0 28 H160 M0 50 H160" stroke="${RAIL}" stroke-width="3"/>
    <path d="M0 27 H160 M0 49 H160" stroke="#4f7a5e" stroke-width="1"/>
    ${posts.join('')}`);
}

const PIECES = {
  'hills-far-budapest': [GAME_WIDTH, 220, danubeFar],
  'hills-near-budapest': [GAME_WIDTH, 140, promenadeNear],
  parliament: [420, 200 + RIVER, parliament],
  'chain-bridge': [600, 220 + RIVER, chainBridge],
  'buda-castle': [360, 170 + RIVER, budaCastle],
  'fishermens-bastion': [300, 150 + RIVER, fishermensBastion],
  'danube-boat': [200, 150, danubeBoat],
  'tram-yellow': [260, 130, tram],
  'market-hall': [300, 230, marketHall],
  'paprika-stall': [180, 170, paprikaStall],
  'goulash-stall': [180, 170, goulashStall],
  'flower-tub': [70, 60, flowerTub],
  'danube-rail': [160, 70, danubeRail],
};

export function budapestSvgs() {
  return Object.fromEntries(Object.entries(PIECES).map(([key, [w, h, draw]]) => [key, { w, h, svg: draw() }]));
}

export function preloadBudapest(scene) {
  for (const [key, { w, h, svg }] of Object.entries(budapestSvgs())) loadSvg(scene, key, svg, w, h);
}
