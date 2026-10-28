import { GAME_WIDTH } from '../config.js';
import { loadSvg, svgDoc } from './svg.js';
import { attrs, ridge, ridgeY } from './scenery.js';
import { HU_GREEN, HU_RED } from './puszta.js';

// Level 8 (grown-ups, only loaded after the paprika button): Lake Balaton in high summer. A turquoise
// lake with the hazy hills of the north shore; the beach resort with its striped cabins and
// lángos stand, the peninsula of Tihany with its abbey and lavender, and the Badacsony table
// mountain with the white paddle steamer and the sailing harbour.
// Everything here is background: soft outlines, never the strong OUTLINE.

const f1 = (n) => n.toFixed(1);
const polygon = (pts, w, h) => `M0 ${h} ${pts.map(([x, y]) => `L${x} ${f1(y)}`).join(' ')} L${w} ${h} Z`;

// Landmarks stand on the far shore: this much empty space below their foot puts the foot on
// the shore line of hills-far-balaton (far pictures sit at GROUND_Y - 45, scale ~0.56).
const SHORE_PAD = 135;
const LINE = '#7a6a5a'; // soft outline of the small pieces
const WALL = '#f6f0e2';
const WALL_SHADE = '#ddd3bd';
const WALL_LINE = '#a89c84';
const ROOF_RED = '#c2503c';
const ROOF_LINE = '#8a3226';
const GLASS = '#8fb2c4';
const WOOD_LIGHT = '#c99a62';
const WOOD_LINE = '#8a6a3e';
const REED = '#c9a45c';
const REED_LINE = '#94713a';
const LEAF = '#5f9e4a';
const LEAF_DARK = '#3f7a35';
const LEAF_LIGHT = '#8cc86a';
const WATER_LIGHT = '#e8f8f6';
const SAILS = ['#e04b3a', '#f3b53a', '#2e86c1', '#3aa364', '#ffffff'];

// ---- Small helpers ----

// Darker version of a '#rrggbb' colour, for outlines.
const darker = (color, k = 0.7) => {
  const n = parseInt(color.slice(1), 16);
  const ch = (s) => Math.round(((n >> s) & 0xff) * k).toString(16).padStart(2, '0');
  return `#${ch(16)}${ch(8)}${ch(0)}`;
};

// Gentle white water lines under a floating thing, like wake() in beach.js.
function wake(y, x0, x1) {
  const out = [];
  for (let x = x0; x < x1; x += 30) out.push(`<path d="M${x} ${y} q8 -3 16 0" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.7"/>`);
  return out.join('');
}

// A tileable skyline: base line with sine waves and round bumps (volcanic cones). Bumps wrap
// around the tile edge, so the left and the right end always meet.
function profile(w, base, waves, bumps, step = 8) {
  const pts = [];
  for (let x = 0; x <= w; x += step) {
    let y = base;
    for (const [amp, k, ph = 0] of waves) y -= amp * Math.sin((2 * Math.PI * k * x) / w + ph);
    for (const [c, h, s] of bumps) {
      const d = Math.min(Math.abs(x - c), w - Math.abs(x - c));
      y -= h * Math.exp(-((d / s) ** 2) / 2);
    }
    pts.push([x, y]);
  }
  return pts;
}

// A small Hungarian flag on a pole standing at (x, y), waving to the right.
function smallFlag(x, y, h, s = 1) {
  const band = (top, color) =>
    `<path d="M${x + 1} ${f1(top)} C${f1(x + 7 * s)} ${f1(top - 2 * s)} ${f1(x + 13 * s)} ${f1(top + 2 * s)} ${f1(x + 19 * s)} ${f1(top)} V${f1(top + 4 * s)} C${f1(x + 13 * s)} ${f1(top + 6 * s)} ${f1(x + 7 * s)} ${f1(top + 2 * s)} ${x + 1} ${f1(top + 4 * s)} Z" fill="${color}"/>`;
  const t = y - h + 2;
  return `<path d="M${x} ${y} V${y - h}" stroke="#8a8278" stroke-width="1.8" stroke-linecap="round"/>
    ${band(t, HU_RED)}${band(t + 4 * s, '#ffffff')}${band(t + 8 * s, HU_GREEN)}`;
}

// Striped scalloped awning from x0 to x1, top at y, d deep.
function awning(id, [x0, x1, y, d], n, base, stripe) {
  const w = (x1 - x0) / n;
  const scallops = [];
  for (let i = n - 1; i >= 0; i--) scallops.push(`Q${f1(x0 + (i + 0.5) * w)} ${y + d + 9} ${f1(x0 + i * w)} ${y + d}`);
  const shape = `M${x0 + 6} ${y} H${x1 - 6} L${x1} ${y + d} ${scallops.join(' ')} Z`;
  const stripes = [];
  for (let i = 0; i < n; i += 2) stripes.push(`<rect x="${f1(x0 + i * w)}" y="${y}" width="${f1(w)}" height="${d + 12}" fill="${stripe}"/>`);
  return `<defs><clipPath id="${id}"><path d="${shape}"/></clipPath></defs>
    <path d="${shape}" fill="${base}"/>
    <g clip-path="url(#${id})">${stripes.join('')}<rect x="${x0}" y="${y}" width="${x1 - x0}" height="5" fill="#000000" opacity="0.1"/></g>
    <path d="${shape}" fill="none" ${attrs(darker(base, 0.7), 1.6)}/>`;
}

// A round blossom cluster for beds and baskets.
const blossom = (x, y, r, c) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="${c}"/><circle cx="${f1(x - r * 0.3)}" cy="${f1(y - r * 0.3)}" r="${f1(r * 0.4)}" fill="#ffffff" opacity="0.4"/>`;

// A little far-away tree on a slope.
const farTree = (x, y, r, c = '#6f9f5e', l = '#86b873') =>
  `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="${c}"/><circle cx="${f1(x - r * 0.3)}" cy="${f1(y - r * 0.3)}" r="${f1(r * 0.55)}" fill="${l}"/>`;

// ---- Background tiles ----

// Far away: the hazy hills of the north shore with villages and vineyards, the wide turquoise
// lake with a few tiny sails. The shore line is at y 114 (where the landmarks stand).
function lakeFar() {
  const w = GAME_WIDTH;
  const shore = 114;
  const back = profile(w, 74, [[5, 2, 0.5], [3, 5, 1.1]], [[130, 30, 80], [330, 18, 60], [560, 34, 70], [820, 26, 75]]);
  const front = profile(w, 96, [[5, 3, 0.2], [2.5, 8, 1.4]], [[60, 14, 60], [250, 10, 50], [470, 15, 70], [690, 12, 55], [900, 14, 60]]);
  const rows = [];
  for (let x = 20; x < w - 20; x += 17) {
    const y = ridgeY(front, x);
    rows.push(`<path d="M${x} ${f1(y + 3)} L${x + 4} ${shore - 4}" stroke="#7fb283" stroke-width="2" opacity="0.5"/>`);
  }
  const houses = [];
  for (let x = 30; x < w - 40; x += 62 + ((x * 7) % 40)) {
    const y = shore - 6 - ((x * 3) % 9);
    houses.push(`<rect x="${x - 4}" y="${y - 4}" width="8" height="5" fill="#f4eee0"/><path d="M${x - 5} ${y - 4} L${x} ${y - 9} L${x + 5} ${y - 4} Z" fill="#c8704f"/>`);
  }
  const trees = [];
  for (let x = 12; x < w - 12; x += 26 + ((x * 11) % 22)) trees.push(farTree(x, shore - 3 - ((x * 5) % 7), 5 + (x % 3), '#6aa070', '#86bb88'));
  const waves = [];
  [[128, 28, 1.2, 0.4], [142, 36, 1.5, 0.45], [157, 46, 1.9, 0.5], [172, 60, 2.3, 0.55]].forEach(([y, gap, sw, op], r) => {
    for (let x = 10 + ((r * 31) % gap); x < w - 30; x += gap + ((x * 7) % 13)) {
      waves.push(`<path d="M${x} ${y} q${f1(gap * 0.17)} ${f1(-gap * 0.07)} ${f1(gap * 0.34)} 0" fill="none" stroke="${WATER_LIGHT}" stroke-width="${sw}" stroke-linecap="round" opacity="${op}"/>`);
    }
  });
  const sparkles = [];
  for (let x = 24; x < w - 24; x += 41 + ((x * 13) % 37)) sparkles.push(`<path d="M${x} ${shore + 8 + ((x * 17) % 64)} h${4 + (x % 5)}" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" opacity="0.7"/>`);
  // Tiny sails far out on the lake.
  const sails = [[120, 124, '#ffffff'], [290, 131, '#ffd7a0'], [470, 122, '#ffffff'], [640, 129, '#f6b6a8'], [815, 123, '#ffffff'], [905, 134, '#ffe9b0']]
    .map(([x, y, c]) => `<path d="M${x} ${y} V${y - 11} L${x + 7} ${y - 2} Z" fill="${c}"/><path d="M${x - 5} ${y} H${x + 8} L${x + 5} ${y + 2} H${x - 3} Z" fill="#b8c8cc"/>`).join('');
  return svgDoc(w, 220, `
    <defs>
      <linearGradient id="lk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9adcd2"/><stop offset="0.4" stop-color="#4fbfb4"/><stop offset="1" stop-color="#1f9a98"/></linearGradient>
    </defs>
    <path d="${polygon(back, w, shore)}" fill="#b4d3d2"/>
    <path d="${polygon(front, w, shore)}" fill="#9fcaa0"/>
    ${rows.join('')}
    ${trees.join('')}${houses.join('')}
    <rect y="${shore - 2}" width="${w}" height="5" fill="#d8cfa0"/>
    <rect y="${shore + 3}" width="${w}" height="${220 - shore - 3}" fill="url(#lk)"/>
    <rect y="${shore + 3}" width="${w}" height="2" fill="#d6f2ee"/>
    ${sparkles.join('')}${waves.join('')}${sails}`);
}

// Right behind Frankie: the green shore meadow with reeds, little flowers and mown stripes.
function meadowNear() {
  const w = GAME_WIDTH;
  const top = ridge(w, 76, [[3, 2, 0.6], [1.5, 6, 1.3]]);
  const stripes = [];
  for (let x = 0; x < w; x += 64) stripes.push(`<rect x="${x}" y="80" width="32" height="60" fill="#ffffff" opacity="0.07"/>`);
  const reeds = [];
  for (let x = 44; x < w - 44; x += 118 + ((x * 7) % 60)) {
    const y = ridgeY(top, x) + 5;
    for (const [dx, h, lean] of [[-6, 26, -3], [0, 34, 1], [6, 28, 4]]) {
      reeds.push(`<path d="M${x + dx} ${f1(y)} Q${x + dx + lean * 0.4} ${f1(y - h * 0.6)} ${x + dx + lean} ${f1(y - h)}" fill="none" stroke="#8aa85a" stroke-width="2" stroke-linecap="round"/>`);
    }
    reeds.push(`<ellipse cx="${x + 1}" cy="${f1(y - 36)}" rx="2.2" ry="5.5" fill="#8a6a46"/>`);
  }
  const flowers = [];
  const cols = ['#ffffff', '#f6d44a', '#d98ad0', '#ffffff'];
  for (let x = 20, i = 0; x < w - 20; x += 33 + ((x * 11) % 25), i++) {
    const y = ridgeY(top, x) + 14 + ((x * 5) % 24);
    flowers.push(`<circle cx="${x}" cy="${y}" r="2.2" fill="${cols[i % 4]}"/><circle cx="${x}" cy="${y}" r="0.9" fill="#e8b73a"/>`);
  }
  return svgDoc(w, 140, `
    <defs><linearGradient id="mn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#97d072"/><stop offset="1" stop-color="#76b856"/></linearGradient></defs>
    <path d="${polygon(top, w, 140)}" fill="url(#mn)"/>
    <path d="M${top.map(([x, y]) => `${x} ${f1(y + 3)}`).join(' L')}" fill="none" stroke="#bfe8a0" stroke-width="3" opacity="0.8"/>
    ${stripes.join('')}${reeds.join('')}${flowers.join('')}`);
}

// ---- Far: boats, the slide and the landmarks ----

// A small sailing boat with two sails (the main sail may be striped), seen from the side.
function sailboat(main, jib, hull, stripes = null) {
  const sailLine = attrs(LINE, 1.2);
  const mainPath = 'M63 14 Q92 60 100 114 H63 Z';
  const bands = stripes
    ? `<defs><clipPath id="sc"><path d="${mainPath}"/></clipPath></defs><g clip-path="url(#sc)">${stripes.map((c, i) => `<rect x="60" y="${14 + i * (100 / stripes.length)}" width="44" height="${100 / stripes.length + 1}" fill="${c}"/>`).join('')}</g>`
    : `<path d="${mainPath}" fill="${main}"/>`;
  return svgDoc(120, 160, `
    <ellipse cx="60" cy="146" rx="46" ry="5" fill="#0d6f72" opacity="0.18"/>
    <path d="M60 8 V122" stroke="#8a8278" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M60 8 l15 4 -15 4 Z" fill="${HU_RED}"/>
    <path d="M57 26 Q36 64 24 112 H57 Z" fill="${jib}" ${sailLine}/>
    ${bands}
    <path d="${mainPath}" fill="none" ${sailLine}/>
    <path d="M62 114 H102" stroke="#8a8278" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M16 118 H104 Q98 138 84 142 H38 Q24 138 16 118 Z" fill="${hull}" ${attrs(darker(hull, 0.65), 1.4)}/>
    <path d="M19 124 H101" stroke="#ffffff" stroke-width="3" opacity="0.85"/>
    ${wake(147, 8, 112)}`);
}

// A pedal boat with a striped canopy and a little slide at the back, as on every Balaton beach.
function pedalBoat(canopy) {
  return svgDoc(120, 90, `
    <ellipse cx="60" cy="82" rx="50" ry="4" fill="#0d6f72" opacity="0.18"/>
    <path d="M100 42 Q120 44 116 70" fill="none" stroke="#c9972a" stroke-width="9" stroke-linecap="round"/>
    <path d="M100 42 Q120 44 116 70" fill="none" stroke="#f3c23a" stroke-width="6" stroke-linecap="round"/>
    <path d="M30 56 V30 M90 56 V30" stroke="#8a8278" stroke-width="2.6"/>
    <defs><clipPath id="pc"><path d="M18 31 Q60 8 102 31 Z"/></clipPath></defs>
    <path d="M18 31 Q60 8 102 31 Z" fill="#ffffff"/>
    <g clip-path="url(#pc)">${[0, 2, 4, 6].map((i) => `<rect x="${18 + i * 12}" y="6" width="12" height="28" fill="${canopy}"/>`).join('')}</g>
    <path d="M18 31 Q60 8 102 31 Z" fill="none" ${attrs(darker(canopy, 0.65), 1.4)}/>
    <path d="M34 52 H86" stroke="#6a6258" stroke-width="3" stroke-linecap="round"/>
    <path d="M8 62 Q8 55 20 55 H100 Q112 55 112 62 Q108 76 96 77 H24 Q12 76 8 62 Z" fill="#fbf7ee" ${attrs(LINE, 1.3)}/>
    <path d="M12 64 H108" stroke="${canopy}" stroke-width="4"/>
    ${wake(81, 6, 112)}`);
}

// A big water slide into the lake: two tubes winding down from a blue tower.
function waterSlide() {
  const tube = (d, c) => `<path d="${d}" fill="none" stroke="${darker(c, 0.62)}" stroke-width="16" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="12" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" opacity="0.5" transform="translate(-2 -3)"/>`;
  return svgDoc(200, 230, `
    <ellipse cx="150" cy="218" rx="40" ry="5" fill="#0d6f72" opacity="0.18"/>
    <path d="M40 62 L32 218 M76 62 L86 218 M38 110 L82 150 M82 110 L36 150 M35 170 L84 200 M84 170 L34 204" fill="none" stroke="#3f7fb0" stroke-width="5" stroke-linecap="round"/>
    <path d="M40 62 L32 218 M76 62 L86 218" fill="none" stroke="#7fb4dc" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
    ${tube('M72 100 C120 90 176 112 150 156 C130 190 120 196 160 214', '#3a9ad0')}
    ${tube('M70 70 C130 56 190 100 160 140 C132 176 92 170 118 208', '#f3c23a')}
    <rect x="28" y="56" width="56" height="8" rx="2" fill="#5a9bd0" ${attrs('#2f6a96', 1.3)}/>
    <path d="M30 56 V36 M82 56 V36" stroke="#2f6a96" stroke-width="2.5"/>
    <path d="M24 38 L56 18 L88 38 Z" fill="#f3c23a" ${attrs('#a67c10', 1.4)}/>
    ${smallFlag(56, 18, 20)}
    <path d="M150 220 q10 -16 20 0 M136 222 q6 -10 12 0" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.85"/>
    ${wake(224, 100, 190)}`);
}

// The abbey of Tihany: a white baroque church with two towers on a green hill above the lake.
function tihanyAbbey() {
  const W = 360;
  const FOOT = 190;
  const hill = `M0 ${FOOT} C30 ${FOOT - 5} 56 156 90 124 C120 100 150 92 180 92 C210 92 240 100 270 124 C304 156 330 ${FOOT - 5} ${W} ${FOOT} Z`;
  const trees = [[20, 184, 6], [40, 176, 7], [58, 160, 7], [76, 142, 7], [96, 126, 7], [118, 112, 6], [250, 112, 6], [268, 124, 7], [290, 142, 7], [306, 160, 7], [322, 176, 7], [342, 184, 6], [40, 188, 6], [100, 160, 6], [260, 160, 6], [320, 190, 5]];
  const terraces = [112, 132, 154, 176].map((y, i) => `<path d="M${40 - i * 8} ${y + 14} Q180 ${y - 20} ${320 + i * 8} ${y + 14}" fill="none" stroke="#6a9a58" stroke-width="1.4" opacity="0.5"/>`).join('');
  const roof = '#b8503c';
  const wallLine = attrs(WALL_LINE, 1.3);
  // A tower with a baroque cap: shaft, belfry window, bulb and lantern.
  const tower = (x) => `
    <rect x="${x - 11}" y="40" width="22" height="58" fill="${WALL}" ${wallLine}/>
    <rect x="${x - 11}" y="40" width="5" height="58" fill="${WALL_SHADE}"/>
    <path d="M${x - 4} 62 V54 Q${x} 49 ${x + 4} 54 V62 Z" fill="#5f6f7a"/>
    <path d="M${x - 13} 42 H${x + 13} L${x + 9} 36 H${x - 9} Z" fill="#cfe0d4" ${attrs('#7a9a88', 1.2)}/>
    <path d="M${x - 9} 36 C${x - 13} 26 ${x - 6} 20 ${x} 12 C${x + 6} 20 ${x + 13} 26 ${x + 9} 36 Z" fill="#7fb6a0" ${attrs('#4a8470', 1.3)}/>
    <path d="M${x} 12 V0" stroke="#b9a05a" stroke-width="1.8"/><circle cx="${x}" cy="1" r="1.8" fill="#d6b64a"/>`;
  return svgDoc(W, FOOT + SHORE_PAD, `
    <path d="${hill}" fill="#9cc884" ${attrs('#6f9e5c', 1.5)}/>
    ${terraces}${trees.map(([x, y, r]) => farTree(x, y, r)).join('')}
    <path d="M70 100 H138 V120 H62 Z M222 100 H290 L298 120 H222 Z" fill="#d6ceb8" ${attrs(WALL_LINE, 1.2)}/>
    <path d="M74 84 H134 L138 100 H70 Z M226 84 H286 L290 100 H222 Z" fill="${roof}" ${attrs(ROOF_LINE, 1.3)}/>
    <rect x="76" y="100" width="56" height="20" fill="${WALL}" ${wallLine}/>
    <rect x="228" y="100" width="56" height="20" fill="${WALL}" ${wallLine}/>
    <path d="${[84, 96, 108, 120].map((x) => `M${x} 104 h5 v9 h-5 Z`).join(' ')} ${[236, 248, 260, 272].map((x) => `M${x} 104 h5 v9 h-5 Z`).join(' ')}" fill="${GLASS}"/>
    ${tower(158)}${tower(202)}
    <rect x="146" y="56" width="68" height="64" fill="${WALL}" ${wallLine}/>
    <path d="M142 58 H218 L210 50 Q180 34 150 50 Z" fill="#f2ead8" ${wallLine}/>
    <circle cx="180" cy="46" r="5" fill="${GLASS}" ${attrs(WALL_LINE, 1)}/>
    <path d="M168 120 V92 Q168 80 180 80 Q192 80 192 92 V120 Z" fill="#6a5a4a" ${attrs(WALL_LINE, 1.2)}/>
    <path d="M160 70 H200" stroke="${WALL_LINE}" stroke-width="1.2"/>
    ${[150, 160, 200, 210].map((x) => `<rect x="${x - 2}" y="80" width="4" height="40" fill="#fffaf0" opacity="0.8"/>`).join('')}
    <path d="M138 122 H222" stroke="${WALL_LINE}" stroke-width="1.6"/>
    <rect y="${FOOT - 3}" width="${W}" height="5" fill="#d8cfa0"/>
    <path d="M10 ${FOOT + 4} q8 -4 16 0 M120 ${FOOT + 5} q8 -4 16 0 M250 ${FOOT + 4} q8 -4 16 0 M330 ${FOOT + 5} q8 -4 16 0" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.7"/>`);
}

// The Badacsony table mountain: a flat basalt top with steep organ-pipe cliffs and vineyards on its slopes.
function badacsony() {
  const W = 380;
  const FOOT = 210;
  const shape = `M0 ${FOOT} C30 ${FOOT - 4} 62 150 82 112 C92 92 98 72 106 52 H274 C282 72 288 92 298 112 C318 150 350 ${FOOT - 4} ${W} ${FOOT} Z`;
  // Vineyard rows following the slope, clipped to the mountain.
  const rows = [];
  for (let y = 100; y < FOOT; y += 7) rows.push(`<path d="M0 ${y} Q190 ${y - 26} ${W} ${y}" fill="none" stroke="#4f8a3f" stroke-width="2.2" opacity="0.55"/>`);
  const pipes = [];
  for (let x = 108; x < 274; x += 7) pipes.push(`M${x} 54 L${x + 1 + (x % 3)} 100`);
  const flank = [];
  for (let x = 84; x < 108; x += 6) flank.push(`M${x} 108 L${x + 7} 60`);
  for (let x = 274; x < 298; x += 6) flank.push(`M${x} 60 L${x + 4} 108`);
  const trees = [];
  for (let x = 112; x < 270; x += 14 + ((x * 3) % 8)) trees.push(farTree(x, 49 - ((x * 5) % 5), 6 + (x % 3), '#5d9150', '#7aae66'));
  const houses = [[96, 130], [270, 128], [150, 150], [230, 148], [64, 168], [316, 168], [186, 176]].map(([x, y]) =>
    `<rect x="${x - 4}" y="${y - 4}" width="8" height="5" fill="#f6f0e2"/><path d="M${x - 5} ${y - 4} L${x} ${y - 9} L${x + 5} ${y - 4} Z" fill="#b8503c"/>`).join('');
  return svgDoc(W, FOOT + SHORE_PAD, `
    <defs><clipPath id="bm"><path d="${shape}"/></clipPath>
      <linearGradient id="bv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a6cf86"/><stop offset="1" stop-color="#8ec078"/></linearGradient></defs>
    <path d="${shape}" fill="url(#bv)"/>
    <g clip-path="url(#bm)">${rows.join('')}
      <path d="M0 ${FOOT - 22} Q190 ${FOOT - 50} ${W} ${FOOT - 22} V${FOOT} H0 Z" fill="#6aa060" opacity="0.5"/>
      <path d="M90 54 H290 L296 112 Q190 96 84 112 Z" fill="#8f8a84"/>
      <path d="M90 54 H290 L296 112 Q190 96 84 112 Z" fill="#b8b0a4" opacity="0.35"/>
      <path d="${pipes.join(' ')} ${flank.join(' ')}" stroke="#6f6a64" stroke-width="1.4" opacity="0.7"/>
      <path d="M98 110 Q190 94 292 110" fill="none" stroke="#7a9a66" stroke-width="5" opacity="0.7"/>
    </g>
    ${trees.join('')}
    <path d="M106 52 H274" stroke="#a09a90" stroke-width="2"/>
    <path d="${shape}" fill="none" ${attrs('#6f9e5c', 1.5)}/>
    ${houses}
    <rect y="${FOOT - 3}" width="${W}" height="5" fill="#d8cfa0"/>
    <path d="M14 ${FOOT + 5} q8 -4 16 0 M130 ${FOOT + 6} q8 -4 16 0 M260 ${FOOT + 5} q8 -4 16 0 M340 ${FOOT + 6} q8 -4 16 0" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.7"/>`);
}

// The white Balaton paddle steamer with its red-black funnel and the paddle box amidships.
function paddleSteamer() {
  const W = 260;
  const windows = (x0, x1, y, h) => {
    const out = [];
    for (let x = x0; x <= x1 - 8; x += 12) out.push(`<rect x="${x}" y="${y}" width="8" height="${h}" rx="1.5"/>`);
    return `<g fill="${GLASS}">${out.join('')}</g>`;
  };
  const spokes = [0, 30, 60, 90, 120, 150].map((a) => `<path d="M0 0 L${f1(24 * Math.cos((a * Math.PI) / 180))} ${f1(-24 * Math.sin((a * Math.PI) / 180))}" stroke="#a89c84" stroke-width="1.6"/>`).join('');
  return svgDoc(W, 150, `
    <ellipse cx="130" cy="140" rx="112" ry="5" fill="#0d6f72" opacity="0.18"/>
    <path d="M118 28 q-6 -10 4 -16 q-2 -10 12 -10 q12 -2 14 8 q10 2 6 12 Z" fill="#e9eef0" opacity="0.8"/>
    <rect x="116" y="30" width="22" height="30" fill="#2f3438" ${attrs('#1a1e22', 1.3)}/>
    <rect x="116" y="42" width="22" height="9" fill="${HU_RED}"/>
    <rect x="113" y="28" width="28" height="5" rx="1.5" fill="#2f3438"/>
    <rect x="76" y="62" width="106" height="20" fill="${WALL}" ${attrs(WALL_LINE, 1.3)}/>
    ${windows(82, 178, 68, 9)}
    <rect x="72" y="58" width="114" height="6" rx="2" fill="#e9e2d0" ${attrs(WALL_LINE, 1.2)}/>
    <rect x="36" y="82" width="190" height="24" fill="${WALL}" ${attrs(WALL_LINE, 1.3)}/>
    ${windows(42, 90, 89, 10)}${windows(170, 222, 89, 10)}
    <path d="M30 80 H232" stroke="${WALL_LINE}" stroke-width="2"/>
    <path d="M96 106 A34 34 0 0 1 164 106 Z" fill="#e9e2d0" ${attrs(WALL_LINE, 1.4)}/>
    <g transform="translate(130 104)"><circle r="26" fill="#f6f0e2" opacity="0.8"/>${spokes}<circle r="4" fill="#8a8278"/></g>
    <path d="M96 106 A34 34 0 0 1 164 106" fill="none" stroke="${WALL_LINE}" stroke-width="1.4"/>
    <path d="M8 104 H246 L230 134 H28 Z" fill="${WALL}" ${attrs(WALL_LINE, 1.4)}/>
    <path d="M14 114 H240" stroke="${HU_RED}" stroke-width="5"/>
    <path d="M24 128 H232" stroke="${HU_GREEN}" stroke-width="3"/>
    ${smallFlag(232, 90, 24, 0.9)}
    <path d="M232 106 V90" stroke="#8a8278" stroke-width="1.8"/>
    ${wake(138, 6, 250)}
    <path d="M6 134 q10 -8 22 0 q10 6 24 -2" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.85"/>`);
}

// ---- Mid: the beach resort, Tihany and the harbour ----

// A row of striped wooden changing cabins with pitched roofs and little round windows.
function changingCabins() {
  const colors = ['#e04b3a', '#f3b53a', '#2e86c1', '#3aa364'];
  const cabin = (x, c, i) => {
    const stripes = [];
    for (let k = 0; k < 8; k += 2) stripes.push(`<rect x="${x + k * 7}" y="52" width="7" height="98" fill="${c}"/>`);
    return `
      <rect x="${x}" y="52" width="56" height="98" fill="#fffaf0"/>
      ${stripes.join('')}
      <rect x="${x}" y="52" width="56" height="98" fill="none" ${attrs(darker(c, 0.6), 1.5)}/>
      <path d="M${x - 5} 54 L${x + 28} 28 L${x + 61} 54 Z" fill="${darker(c, 0.82)}" ${attrs(darker(c, 0.55), 1.5)}/>
      <path d="M${x - 5} 54 H${x + 61}" stroke="${darker(c, 0.55)}" stroke-width="3"/>
      <rect x="${x + 14}" y="80" width="28" height="70" rx="2" fill="#fff6e4" ${attrs(WOOD_LINE, 1.4)}/>
      <path d="M${x + 21} 84 V148 M${x + 28} 84 V148 M${x + 35} 84 V148" stroke="${WOOD_LINE}" stroke-width="1" opacity="0.5"/>
      <circle cx="${x + 28}" cy="94" r="6" fill="${GLASS}" ${attrs(WOOD_LINE, 1.3)}/>
      <circle cx="${x + 37}" cy="118" r="1.8" fill="#6a5a4a"/>
      ${i % 2 ? `<path d="M${x + 28} 28 V16" stroke="#8a8278" stroke-width="1.6"/><path d="M${x + 28} 16 l11 3 -11 3 Z" fill="${c}"/>` : ''}`;
  };
  return svgDoc(280, 160, `
    ${colors.map((c, i) => cabin(8 + i * 66, c, i)).join('')}
    <path d="M4 152 H276" stroke="#b9a87a" stroke-width="3" opacity="0.5"/>`);
}

// A lángos stand: wooden counter, striped awning and a round sign with a lángos on it (no text).
function langosStand() {
  const lang = (cx, cy, r) => `
    <ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${f1(r * 0.78)}" fill="#e0a63c" ${attrs('#9a6a1c', 1.4)}/>
    <ellipse cx="${cx}" cy="${cy}" rx="${f1(r * 0.78)}" ry="${f1(r * 0.58)}" fill="#f1c860"/>
    <path d="M${f1(cx - r * 0.5)} ${f1(cy - r * 0.1)} q${f1(r * 0.4)} ${f1(-r * 0.4)} ${f1(r * 0.8)} 0 q${f1(-r * 0.3)} ${f1(r * 0.5)} ${f1(-r * 0.8)} 0 Z" fill="#fff6e0" opacity="0.9"/>
    <path d="M${f1(cx - r * 0.4)} ${f1(cy + r * 0.3)} q${f1(r * 0.2)} ${f1(r * 0.4)} ${f1(r * 0.3)} 0 M${f1(cx + r * 0.1)} ${f1(cy + r * 0.35)} q${f1(r * 0.2)} ${f1(r * 0.3)} ${f1(r * 0.3)} 0" fill="none" stroke="#f6e27a" stroke-width="2" stroke-linecap="round"/>
    ${[[-0.45, -0.3], [0.4, -0.25], [0.3, 0.3]].map(([dx, dy]) => `<circle cx="${f1(cx + r * dx)}" cy="${f1(cy + r * dy)}" r="${f1(r * 0.07)}" fill="#c98a2a"/>`).join('')}`;
  return svgDoc(180, 190, `
    <path d="M30 60 V160 M150 60 V160" stroke="#7a5a32" stroke-width="5" stroke-linecap="round"/>
    <rect x="30" y="78" width="120" height="36" fill="#4a362a"/>
    <path d="M44 100 H70 M106 100 H136" stroke="#6a523a" stroke-width="3"/>
    <rect x="18" y="108" width="144" height="10" rx="2" fill="#d8aa6a" ${attrs(WOOD_LINE, 1.4)}/>
    <rect x="22" y="118" width="136" height="60" fill="${WOOD_LIGHT}" ${attrs(WOOD_LINE, 1.5)}/>
    <path d="M22 130 H158 M22 142 H158 M22 154 H158 M22 166 H158" stroke="${WOOD_LINE}" stroke-width="1" opacity="0.55"/>
    <circle cx="90" cy="148" r="14" fill="#f3b53a" ${attrs('#a67c10', 1.4)}/>
    <circle cx="90" cy="148" r="9" fill="#fbe28a"/>
    <ellipse cx="60" cy="106" rx="18" ry="3.5" fill="#f6f0e2" ${attrs(LINE, 1)}/>${lang(60, 102, 13)}
    <ellipse cx="124" cy="106" rx="18" ry="3.5" fill="#f6f0e2" ${attrs(LINE, 1)}/>${lang(124, 102, 13)}
    ${awning('la', [12, 168, 58, 26], 8, '#d93a30', '#fffaf0')}
    <path d="M90 56 V40" stroke="#7a5a32" stroke-width="4"/>
    <circle cx="90" cy="24" r="23" fill="#fff6e0" ${attrs(WOOD_LINE, 2)}/>
    <circle cx="90" cy="24" r="19" fill="none" stroke="${HU_RED}" stroke-width="2.5"/>
    ${lang(90, 24, 14)}
    ${smallFlag(160, 60, 26, 0.9)}`);
}

// A weeping willow with long drooping branches.
function willow() {
  const strands = [];
  for (let x = 28; x <= 212; x += 8) {
    const d = (x - 120) / 92;
    const y0 = 60 + 44 * d * d;
    const len = 96 + ((x * 7) % 38) - 34 * d * d;
    const sway = ((x * 5) % 9) - 4;
    const path = `M${x} ${f1(y0)} C${x - 7} ${f1(y0 + len * 0.35)} ${x + 7 + sway} ${f1(y0 + len * 0.7)} ${x + sway} ${f1(y0 + len)}`;
    strands.push(`<path d="${path}" fill="none" stroke="#4a8a3a" stroke-width="5" stroke-linecap="round" opacity="0.55"/><path d="${path}" fill="none" stroke="${x % 16 ? LEAF_LIGHT : '#a9d878'}" stroke-width="2.8" stroke-linecap="round"/>`);
  }
  return svgDoc(240, 270, `
    <path d="M108 268 C110 230 102 196 100 168 C98 148 108 132 120 122 C132 132 142 150 140 170 C138 198 134 232 134 268 Z" fill="#7a5a3e" ${attrs('#4a3220', 1.5)}/>
    <path d="M112 200 C108 180 106 160 110 144" fill="none" stroke="#a07a54" stroke-width="3" opacity="0.7"/>
    <path d="M118 130 C96 118 74 112 56 98 M124 128 C148 116 170 108 190 96" fill="none" stroke="#6a4a30" stroke-width="5" stroke-linecap="round"/>
    <path d="M26 100 C20 60 60 22 120 20 C180 22 220 60 214 100 C180 82 60 82 26 100 Z" fill="#7fb85a" ${attrs('#4a8a3a', 1.5)}/>
    <path d="M60 66 C70 40 100 28 126 28" fill="none" stroke="#a9d878" stroke-width="5" stroke-linecap="round" opacity="0.8"/>
    ${strands.join('')}`);
}

// A whitewashed fisherman's house with a thick thatched roof and a net drying on poles.
function fisherHouse() {
  const bands = [];
  for (let y = 62; y < 108; y += 8) bands.push(`<path d="M${24 - (y - 56) * 0.2} ${y} Q90 ${y + 6} ${156 + (y - 56) * 0.2} ${y}" fill="none" stroke="${REED_LINE}" stroke-width="1.2" opacity="0.55"/>`);
  const net = [];
  for (let i = 0; i <= 6; i++) net.push(`M${166 + i * 4} 96 L${160 + i * 5} 150 M${166 + i * 4} 96 L${176 + i * 4} 150`);
  for (let y = 108; y < 150; y += 11) net.push(`M164 ${y} Q182 ${y + 6} 198 ${y}`);
  return svgDoc(210, 160, `
    <rect x="34" y="92" width="112" height="60" fill="${WALL}" ${attrs(WALL_LINE, 1.5)}/>
    <rect x="34" y="144" width="112" height="8" fill="${WALL_SHADE}"/>
    <path d="M14 98 C26 70 52 46 90 38 C128 46 154 70 166 98 C130 108 50 108 14 98 Z" fill="${REED}" ${attrs(REED_LINE, 1.6)}/>
    ${bands.join('')}
    <path d="M30 92 C60 100 120 100 150 92" fill="none" stroke="${REED_LINE}" stroke-width="2"/>
    <rect x="104" y="30" width="12" height="22" fill="#e6dccb" ${attrs(WALL_LINE, 1.2)}/>
    <rect x="102" y="28" width="16" height="4" fill="#cfc4ae"/>
    <rect x="46" y="110" width="26" height="42" rx="2" fill="#3a7ab0" ${attrs('#24547e', 1.4)}/>
    <path d="M50 114 V148 M59 114 V148 M68 114 V148" stroke="#6aa6d4" stroke-width="1.3" opacity="0.8"/>
    <circle cx="68" cy="132" r="1.8" fill="#f3e6b0"/>
    <rect x="94" y="108" width="34" height="26" fill="${GLASS}" ${attrs('#24547e', 1.4)}/>
    <path d="M111 108 V134 M94 121 H128" stroke="#ffffff" stroke-width="2"/>
    <rect x="86" y="108" width="9" height="26" fill="#3a7ab0"/><rect x="127" y="108" width="9" height="26" fill="#3a7ab0"/>
    <rect x="90" y="134" width="42" height="6" fill="#8a5a3a"/>
    ${[96, 106, 116, 124].map((x, i) => blossom(x, 132, 3.4, ['#e04b6a', '#f6a8b8', '#e04b6a', '#ffffff'][i])).join('')}
    <path d="M166 96 V154 M198 96 V154" stroke="#7a5a32" stroke-width="4" stroke-linecap="round"/>
    <path d="M166 96 H198 L196 150 Q182 158 168 150 Z" fill="#9fb8c4" opacity="0.4"/>
    <path d="${net.join(' ')}" fill="none" stroke="#5f7f90" stroke-width="1.2"/>
    <path d="M166 96 H198" stroke="#7a5a32" stroke-width="3"/>`);
}

// A lavender field on a gentle slope: dotted rows in three tones of violet.
function lavenderField() {
  const W = 300;
  const bankY = (x) => 44 + 74 * Math.abs((x - 150) / 150) ** 1.8;
  const tones = [['#a98bd0', '#c9b3e6'], ['#8a63b5', '#ad8ad4'], ['#7a52a6', '#9a74c4']];
  const rows = [];
  for (let r = 0; r < 4; r++) {
    const pts = [];
    for (let x = 20; x <= W - 20; x += 6) {
      const y = bankY(x) + 10 + r * 13;
      if (y < 112) pts.push(`${x} ${f1(y)}`);
    }
    const [c, hl] = tones[r % 3];
    const d = `M${pts.join(' L')}`;
    rows.push(`<path d="${d}" fill="none" stroke="#5f8a4a" stroke-width="5" opacity="0.55" transform="translate(0 4)"/>
      <path d="${d}" fill="none" stroke="${c}" stroke-width="12" stroke-linecap="round" stroke-dasharray="0.1 8"/>
      <path d="${d}" fill="none" stroke="${hl}" stroke-width="5" stroke-linecap="round" stroke-dasharray="0.1 8" transform="translate(-2 -3)"/>`);
  }
  return svgDoc(W, 120, `
    <path d="M0 118 C30 100 70 46 150 44 C230 46 270 100 ${W} 118 Z" fill="#a8bd7c" ${attrs('#7a9a56', 1.5)}/>
    ${rows.join('')}`);
}

// Harbour: a long white harbour-master's house with a red roof, the masts of the sailing
// boats rising behind it and a garland of pennants between them.
function harborMasts() {
  const masts = [34, 70, 112, 154, 196];
  const tops = [34, 12, 40, 18, 44];
  const pennants = [];
  const garland = (x0, y0, x1, y1) => {
    const n = 5;
    let d = `M${x0} ${y0}`;
    for (let i = 1; i <= n; i++) {
      const t = i / n;
      d += ` L${f1(x0 + (x1 - x0) * t)} ${f1(y0 + (y1 - y0) * t + 8 * Math.sin(Math.PI * t))}`;
    }
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n;
      const x = x0 + (x1 - x0) * t;
      const y = y0 + (y1 - y0) * t + 8 * Math.sin(Math.PI * t);
      pennants.push(`<path d="M${f1(x - 4)} ${f1(y)} L${f1(x + 4)} ${f1(y)} L${f1(x)} ${f1(y + 9)} Z" fill="${SAILS[i % 5]}"/>`);
    }
    return `<path d="${d}" fill="none" stroke="#6a6258" stroke-width="1"/>`;
  };
  const lines = garland(70, 14, 112, 42) + garland(112, 42, 154, 20) + garland(154, 20, 196, 46);
  return svgDoc(240, 230, `
    ${masts.map((x, i) => `<path d="M${x} ${tops[i]} V190" stroke="#8a8f94" stroke-width="3" stroke-linecap="round"/><path d="M${x} ${tops[i] + 20} L${x + 22} 190 M${x} ${tops[i] + 20} L${x - 22} 190" stroke="#aab0b4" stroke-width="1"/><circle cx="${x}" cy="${tops[i]}" r="2.4" fill="#d6b64a"/>`).join('')}
    ${lines}${pennants.join('')}
    <path d="M10 196 L40 174 H206 L232 196 Z" fill="${ROOF_RED}" ${attrs(ROOF_LINE, 1.5)}/>
    <path d="M44 182 H202 M30 190 H216" stroke="${ROOF_LINE}" stroke-width="1" opacity="0.5"/>
    <rect x="18" y="196" width="204" height="30" fill="${WALL}" ${attrs(WALL_LINE, 1.5)}/>
    <path d="${[28, 62, 96, 130, 164, 198].map((x) => `M${x} 226 V210 Q${x + 8} 200 ${x + 16} 210 V226 Z`).join(' ')}" fill="#4f6f86"/>
    <rect x="102" y="150" width="36" height="28" fill="${WALL}" ${attrs(WALL_LINE, 1.4)}/>
    <path d="M98 152 L120 136 L142 152 Z" fill="${ROOF_RED}" ${attrs(ROOF_LINE, 1.4)}/>
    <circle cx="120" cy="162" r="5" fill="${GLASS}" ${attrs(WALL_LINE, 1)}/>
    ${smallFlag(120, 136, 22, 0.9)}`);
}

// A Badacsony wine-press house: white walls, steep roof, an arched veranda with grape vines.
function pressHouse() {
  const tiles = [];
  for (let y = 54; y < 92; y += 8) tiles.push(`<path d="M${22 + (y - 54) * 1.2} ${y} H${178 - (y - 54) * 1.2}" stroke="${ROOF_LINE}" stroke-width="1" opacity="0.55"/>`);
  const cols = [34, 66, 100, 134, 166];
  const grapes = (x, y) => `<g>${[[0, 0], [5, 2], [-5, 3], [2, 7], [-2, 8], [0, 13]].map(([dx, dy]) => `<circle cx="${x + dx}" cy="${y + dy}" r="3.3" fill="#6a3a8a"/><circle cx="${x + dx - 1}" cy="${y + dy - 1}" r="1" fill="#a07ac0" opacity="0.8"/>`).join('')}</g>`;
  return svgDoc(200, 160, `
    <rect x="24" y="94" width="152" height="58" fill="${WALL}" ${attrs(WALL_LINE, 1.5)}/>
    <path d="M14 96 L100 24 L186 96 Z" fill="#b5553f" ${attrs(ROOF_LINE, 1.6)}/>
    ${tiles.join('')}
    <circle cx="100" cy="68" r="7" fill="${GLASS}" ${attrs(WALL_LINE, 1.3)}/>
    <path d="M24 94 H176" stroke="${WALL_LINE}" stroke-width="2"/>
    <path d="${[0, 1, 2, 3].map((i) => `M${cols[i] + 6} 150 V116 Q${(cols[i] + cols[i + 1]) / 2} 100 ${cols[i + 1] - 6} 116 V150 Z`).join(' ')}" fill="#5a4636"/>
    ${cols.map((x) => `<rect x="${x - 5}" y="96" width="10" height="56" fill="#9a6e44" ${attrs(WOOD_LINE, 1.3)}/>`).join('')}
    <path d="M22 100 Q60 114 100 100 Q140 114 178 100" fill="none" stroke="${LEAF_DARK}" stroke-width="5" stroke-linecap="round"/>
    ${[40, 76, 118, 150].map((x, i) => `<ellipse cx="${x}" cy="${104 + (i % 2) * 2}" rx="9" ry="6" fill="${LEAF}" ${attrs(LEAF_DARK, 1)}/>`).join('')}
    ${[52, 92, 136].map((x) => grapes(x, 110)).join('')}
    <path d="M10 154 H190" stroke="#b9a87a" stroke-width="3" opacity="0.5"/>`);
}

// ---- Near: low plants, a lamp ----

function reeds() {
  const stems = [[18, 62, -8], [34, 80, -3], [50, 70, 4], [64, 84, 2], [78, 66, 9], [92, 74, 12], [26, 52, -12], [70, 56, 14]];
  const out = stems.map(([x, h, lean]) =>
    `<path d="M${x} 88 Q${x + lean * 0.3} ${88 - h * 0.6} ${x + lean} ${88 - h}" fill="none" stroke="#6a8a40" stroke-width="3.2" stroke-linecap="round"/>
     <path d="M${x} 88 Q${x + lean * 0.3 + 3} ${88 - h * 0.55} ${x + lean + 6} ${88 - h * 0.75}" fill="none" stroke="#8aa85a" stroke-width="2.2" stroke-linecap="round"/>`).join('');
  const cattails = [[34, 80, -3], [64, 84, 2], [92, 74, 12]].map(([x, h, lean]) =>
    `<ellipse cx="${x + lean}" cy="${88 - h - 6}" rx="3.6" ry="9" fill="#8a5a36" ${attrs('#5a3a22', 1)} transform="rotate(${lean * 1.2} ${x + lean} ${88 - h - 6})"/>`).join('');
  return svgDoc(120, 90, `${out}${cattails}
    <ellipse cx="55" cy="88" rx="44" ry="3" fill="#4a6a30" opacity="0.35"/>`);
}

function flowerBed() {
  const blooms = [[22, 28, 8, '#e8559a'], [40, 22, 9, '#c04ac0'], [58, 26, 8, '#f6a8c8'], [76, 22, 9, '#e8559a'], [92, 30, 8, '#ffffff'], [30, 40, 8, '#ffffff'], [50, 38, 9, '#e8559a'], [70, 40, 8, '#c04ac0'], [86, 42, 7, '#f6a8c8'], [58, 14, 6, '#ffffff'], [44, 48, 6, '#c04ac0'], [18, 44, 6, '#f6a8c8']];
  return svgDoc(110, 60, `
    <ellipse cx="55" cy="40" rx="50" ry="17" fill="${LEAF}" ${attrs(LEAF_DARK, 1.4)}/>
    <ellipse cx="55" cy="34" rx="46" ry="14" fill="${LEAF_LIGHT}" opacity="0.7"/>
    ${blooms.map(([x, y, r, c]) => blossom(x, y, r, c)).join('')}`);
}

function lavenderTuft() {
  const stems = [[14, 36, -5], [24, 46, -2], [34, 38, 2], [44, 48, 5], [54, 36, 7], [64, 42, 9], [20, 30, -9], [48, 32, 3]];
  return svgDoc(80, 60, `
    <ellipse cx="40" cy="55" rx="34" ry="4" fill="#4a6a30" opacity="0.3"/>
    ${stems.map(([x, h, lean]) => `<path d="M${x} 56 Q${x + lean * 0.4} ${56 - h * 0.6} ${x + lean} ${56 - h}" fill="none" stroke="#6a8a4a" stroke-width="2" stroke-linecap="round"/>
      <path d="M${x + lean} ${56 - h} l0 -13" stroke="#8a63b5" stroke-width="6" stroke-linecap="round"/>
      <path d="M${x + lean - 1} ${56 - h - 1} l0 -9" stroke="#b79ae0" stroke-width="2.5" stroke-linecap="round" opacity="0.8"/>`).join('')}`);
}

// A cast-iron promenade lamp with two hanging baskets of geraniums.
function balatonLamp() {
  const basket = (x, y) => `<path d="M${x - 7} ${y} Q${x} ${y + 9} ${x + 7} ${y} Z" fill="#6a4a30" ${attrs('#3f2a18', 1)}/>${blossom(x - 4, y - 3, 4, '#e0344a')}${blossom(x + 3, y - 4, 4.5, '#e0344a')}${blossom(x, y - 7, 3.6, '#f27a8a')}<path d="M${x - 4} ${y - 2} q4 -3 8 0" stroke="${LEAF_DARK}" stroke-width="2" fill="none"/>`;
  return svgDoc(60, 140, `
    <path d="M30 138 V40" stroke="#2f4a3a" stroke-width="4" stroke-linecap="round"/>
    <path d="M24 138 H36 L33 124 H27 Z" fill="#2f4a3a"/>
    <path d="M30 70 Q14 70 10 58 M30 70 Q46 70 50 58" fill="none" stroke="#2f4a3a" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M10 58 V64 M50 58 V64" stroke="#8a8278" stroke-width="1"/>
    ${basket(10, 68)}${basket(50, 68)}
    <path d="M22 38 H38 L36 26 H24 Z" fill="#fbf0c0" ${attrs('#2f4a3a', 1.6)}/>
    <path d="M20 26 L30 16 L40 26 Z" fill="#2f4a3a"/>
    <circle cx="30" cy="14" r="2.2" fill="#2f4a3a"/>`);
}

function hydrangea() {
  const balls = [[26, 34, 14, '#6a9ae0'], [48, 26, 15, '#8ab0ee'], [70, 32, 14, '#c07ad0'], [88, 40, 11, '#6a9ae0'], [38, 44, 11, '#e08ac0'], [60, 44, 12, '#6a9ae0'], [14, 46, 9, '#8ab0ee']];
  return svgDoc(110, 72, `
    <ellipse cx="55" cy="46" rx="50" ry="22" fill="${LEAF}" ${attrs(LEAF_DARK, 1.4)}/>
    ${balls.map(([x, y, r, c]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" ${attrs(darker(c, 0.65), 1)}/><circle cx="${x - r * 0.3}" cy="${y - r * 0.3}" r="${f1(r * 0.4)}" fill="#ffffff" opacity="0.3"/>`).join('')}
    <ellipse cx="55" cy="68" rx="44" ry="3" fill="#4a6a30" opacity="0.3"/>`);
}

// ---- Strips: the promenade railing and the lavender hedge ----

// Strips are laid out every 156 px (the pictures are 160 wide, so they overlap a little).
// White railing with two bars, round post heads and window boxes of geraniums.
function promenadeRail() {
  const posts = [];
  const boxes = [];
  for (const x of [10, 90]) {
    posts.push(`<rect x="${x - 3.5}" y="20" width="7" height="50" rx="1.5" fill="#f4f0e6" ${attrs('#9a9486', 1.3)}/>
      <circle cx="${x}" cy="15" r="5" fill="#f4f0e6" ${attrs('#9a9486', 1.3)}/>`);
    const bx = x + 14;
    boxes.push(`<path d="M${bx} 30 H${bx + 52} L${bx + 49} 44 H${bx + 3} Z" fill="#c07a4a" ${attrs('#7a4a28', 1.3)}/>
      ${[8, 20, 32, 44].map((d, i) => blossom(bx + d, 25 - (i % 2) * 3, 5.5, i % 2 ? '#e0344a' : '#f27a8a')).join('')}
      <path d="M${bx + 6} 28 q6 -6 12 0 q6 -6 12 0 q6 -6 12 0" stroke="${LEAF_DARK}" stroke-width="2.4" fill="none"/>`);
  }
  return svgDoc(160, 70, `
    <path d="M0 30 H160 M0 54 H160" stroke="#9a9486" stroke-width="5"/>
    <path d="M0 30 H160 M0 54 H160" stroke="#f4f0e6" stroke-width="3"/>
    ${posts.join('')}${boxes.join('')}`);
}

// Low lavender border: many thin violet spikes in soft tones, so it reads as a flower bed.
function lavenderStrip() {
  const spikes = [];
  const tones = ['#8a63b5', '#a283c8', '#b79ae0', '#7a52a6'];
  for (let x = 4; x < 158; x += 5) {
    const h = 16 + ((x * 7) % 11);
    const lean = ((x * 3) % 7) - 3;
    spikes.push(`<path d="M${x} 62 Q${x + lean * 0.5} ${62 - h * 0.5} ${x + lean} ${62 - h}" fill="none" stroke="#6f9a52" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M${x + lean} ${62 - h} v-9" stroke="${tones[(x / 5) % 4 | 0]}" stroke-width="4.5" stroke-linecap="round" opacity="0.9"/>`);
  }
  return svgDoc(160, 70, `
    <ellipse cx="80" cy="62" rx="80" ry="5" fill="#6a8a4a" opacity="0.4"/>
    ${spikes.join('')}`);
}

const PIECES = {
  'hills-far-balaton': [GAME_WIDTH, 220, lakeFar],
  'hills-near-balaton': [GAME_WIDTH, 140, meadowNear],
  'sail-red': [120, 160, () => sailboat('#ffffff', '#f6e8c8', '#c8432f')],
  'sail-rainbow': [120, 160, () => sailboat('', '#ffffff', '#2e86c1', ['#e04b3a', '#f3b53a', '#3aa364', '#2e86c1', '#8a5ab0'])],
  'sail-yellow': [120, 160, () => sailboat('#f3c23a', '#ffffff', '#2d4f86')],
  'sail-blue': [120, 160, () => sailboat('#4a8fcf', '#fff7e0', '#e0e6ea')],
  'pedal-boat': [120, 90, () => pedalBoat('#e04b3a')],
  'pedal-boat-2': [120, 90, () => pedalBoat('#2e86c1')],
  'water-slide': [200, 230, waterSlide],
  'tihany-abbey': [360, 190 + SHORE_PAD, tihanyAbbey],
  badacsony: [380, 210 + SHORE_PAD, badacsony],
  'paddle-steamer': [260, 150, paddleSteamer],
  'changing-cabins': [280, 160, changingCabins],
  'langos-stand': [180, 190, langosStand],
  willow: [240, 270, willow],
  'fisher-house': [210, 160, fisherHouse],
  'lavender-field': [300, 120, lavenderField],
  'harbor-masts': [240, 230, harborMasts],
  'press-house': [200, 160, pressHouse],
  reeds: [120, 90, reeds],
  'flower-bed': [110, 60, flowerBed],
  'lavender-tuft': [80, 60, lavenderTuft],
  'balaton-lamp': [60, 140, balatonLamp],
  hydrangea: [110, 72, hydrangea],
  'promenade-rail': [160, 70, promenadeRail],
  'lavender-strip': [160, 70, lavenderStrip],
};

export function balatonSvgs() {
  return Object.fromEntries(Object.entries(PIECES).map(([key, [w, h, draw]]) => [key, { w, h, svg: draw() }]));
}

export function preloadBalaton(scene) {
  for (const [key, { w, h, svg }] of Object.entries(balatonSvgs())) loadSvg(scene, key, svg, w, h);
}
