import { GAME_WIDTH } from '../config.js';
import { OUTLINE, loadSvg, svgDoc } from './svg.js';
import { attrs, ridge, ridgeY } from './scenery.js';

// Level 3: the beach, like on the photos of Frankie at the North Sea: dunes with
// beach chairs, the open beach with boats on the sea, and a little harbour with a
// lighthouse. Background pieces have soft outlines; everything Frankie can touch
// (sandcastle, crab, beach ball, pier blocks, water channel) gets the strong dark outline.

const line = (w = 3) => attrs(OUTLINE, w);
const f1 = (n) => n.toFixed(1);
const GRASS = ['#8fae5a', '#6f9046', '#bdb873']; // marram grass: green, dark, dry
const STARFISH = '#f47a3a'; // orange, like Frankie's toy on the beach photo
const BLUE = '#3b7fc4';
const RED = '#e2493b';
const YELLOW = '#ffd23f';
const WOOD = '#a77b4f';
const WOOD_LINE = '#6b4a2a';

const polygon = (pts, w, h) => `M0 ${h} ${pts.map(([x, y]) => `L${x} ${f1(y)}`).join(' ')} L${w} ${h} Z`;

// ---- Small helpers ----

// A clump of marram grass growing from (x, y).
function blades(x, y, h, n, seed = 0, width = 2.6) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const lean = n === 1 ? 0 : (i / (n - 1)) * 2 - 1;
    const len = h * (0.72 + 0.28 * Math.abs(Math.sin(i * 2.1 + seed)));
    const tipX = x + lean * h * 0.5 + Math.sin(i * 1.3 + seed) * 3;
    out.push(`<path d="M${f1(x + lean * 3)} ${f1(y)} Q${f1(x + lean * h * 0.12)} ${f1(y - len * 0.65)} ${f1(tipX)} ${f1(y - len)}" fill="none" stroke="${GRASS[(i + seed) % 3]}" stroke-width="${width}" stroke-linecap="round"/>`);
  }
  return out.join('');
}

function starPath(cx, cy, outer, inner, rot) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = ((rot + i * 36) * Math.PI) / 180;
    const r = i % 2 ? inner : outer;
    pts.push(`${f1(cx + Math.cos(a) * r)} ${f1(cy + Math.sin(a) * r)}`);
  }
  return `M${pts.join(' L')} Z`;
}

function starfish(cx, cy, size, rot = -90) {
  const dots = [];
  for (let i = 0; i < 5; i++) {
    const a = ((rot + i * 72) * Math.PI) / 180;
    for (const d of [0.38, 0.66]) dots.push(`<circle cx="${f1(cx + Math.cos(a) * size * d)}" cy="${f1(cy + Math.sin(a) * size * d)}" r="${f1(Math.max(0.8, size * 0.09))}" fill="#ffc28e"/>`);
  }
  return `<path d="${starPath(cx, cy, size, size * 0.46, rot)}" fill="${STARFISH}" ${attrs('#c4562a', Math.max(1.4, size * 0.13))}/>${dots.join('')}`;
}

// A scallop shell, its hinge at (x, y).
function shell(x, y, s = 1, color = '#fff1e6') {
  return `<path d="M${x} ${y} L${f1(x - 6 * s)} ${f1(y - 3 * s)} Q${x} ${f1(y - 14 * s)} ${f1(x + 6 * s)} ${f1(y - 3 * s)} Z" fill="${color}" ${attrs('#c9a98a', 1.2)}/>
    <path d="M${x} ${y} L${f1(x - 3 * s)} ${f1(y - 8 * s)} M${x} ${y} L${x} ${f1(y - 9.5 * s)} M${x} ${y} L${f1(x + 3 * s)} ${f1(y - 8 * s)}" stroke="#d9b9a0" stroke-width="1"/>`;
}

// A paw print on the sand, toes pointing right (Frankie was here!).
function pawPrint(x, y, s = 1) {
  const toes = [[5, -4], [6.8, -1.4], [6.8, 1.4], [5, 4]].map(([dx, dy]) => `<circle cx="${dx}" cy="${dy}" r="1.5"/>`).join('');
  return `<g transform="translate(${x} ${y}) scale(${s} ${f1(s * 0.5)})" fill="#d3b276" opacity="0.8"><ellipse cx="0" cy="0" rx="3.4" ry="4"/>${toes}</g>`;
}

// Gentle water lines below a boat, so it floats.
function wake(y, x0, x1) {
  const out = [];
  for (let x = x0; x < x1; x += 34) out.push(`<path d="M${x} ${y} q8 -3 16 0" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.7"/>`);
  return out.join('');
}

// ---- Background tiles: sea, beach, sand ----

// The sea up to the horizon (with two tiny islands) and the surf at the beach.
function seaFar() {
  const w = GAME_WIDTH;
  const horizon = 72;
  const surf = 180;
  const waves = [];
  [[90, 26, 1.3, 0.35], [106, 34, 1.6, 0.4], [124, 44, 2, 0.45], [144, 56, 2.4, 0.5], [164, 70, 2.8, 0.55]].forEach(([y, gap, sw, op], r) => {
    for (let x = 10 + ((r * 37) % gap); x < w - 30; x += gap + ((x * 7) % 11)) {
      const a = gap * 0.34;
      waves.push(`<path d="M${x} ${y} q${f1(a / 2)} ${f1(-a * 0.2)} ${f1(a)} 0" fill="none" stroke="#e6f6ff" stroke-width="${sw}" stroke-linecap="round" opacity="${op}"/>`);
    }
  });
  const sparkles = [];
  for (let x = 24; x < w - 24; x += 39 + ((x * 13) % 37)) {
    sparkles.push(`<path d="M${x} ${horizon + 6 + ((x * 17) % 84)} h${4 + (x % 5)}" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" opacity="0.75"/>`);
  }
  const top = ridge(w, surf, [[2.2, 24], [1.2, 9, 1]], 4);
  const bottom = ridge(w, surf + 8, [[1.8, 24, 0.8]], 4).reverse();
  const foam = `M${top.map(([x, y]) => `${x} ${f1(y)}`).join(' L')} L${bottom.map(([x, y]) => `${x} ${f1(y)}`).join(' L')} Z`;
  return svgDoc(w, 220, `
    <defs>
      <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a6dcf3"/><stop offset="0.35" stop-color="#6cbfe8"/><stop offset="1" stop-color="#3b98d2"/></linearGradient>
      <linearGradient id="wet" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d4bb88"/><stop offset="1" stop-color="#e6d09c"/></linearGradient>
    </defs>
    <path d="M120 ${horizon + 1} C150 ${horizon - 9} 190 ${horizon - 15} 228 ${horizon - 12} C262 ${horizon - 9} 300 ${horizon - 4} 330 ${horizon + 1} Z" fill="#a8c8d6"/>
    <rect x="241" y="${horizon - 31}" width="5" height="20" fill="#c3d7e0"/><rect x="240" y="${horizon - 34}" width="7" height="4" fill="#d6a69c"/>
    <path d="M612 ${horizon + 1} C636 ${horizon - 7} 670 ${horizon - 8} 700 ${horizon + 1} Z" fill="#b3cfdb"/>
    <rect y="${horizon}" width="${w}" height="${surf - horizon + 4}" fill="url(#sea)"/>
    <rect y="${horizon}" width="${w}" height="2" fill="#d8f2fc"/>
    ${sparkles.join('')}${waves.join('')}
    <rect y="${surf + 2}" width="${w}" height="${218 - surf}" fill="url(#wet)"/>
    <path d="${foam}" fill="#ffffff" opacity="0.92"/>`);
}

// The dry beach behind Frankie's path: ripples, shells, starfish and a trail of paw prints.
function beachNear() {
  const w = GAME_WIDTH;
  const top = ridge(w, 76, [[5, 2, 0.6], [2.5, 7, 1.3]]);
  const ripples = [];
  for (let r = 0; r < 4; r++) {
    for (let x = 20 + r * 23; x < w - 60; x += 74 + ((x * 11) % 30)) {
      ripples.push(`<path d="M${x} ${92 + r * 10} q12 -3 24 0 q12 3 24 0" fill="none" stroke="#dcc08a" stroke-width="2" stroke-linecap="round" opacity="0.6"/>`);
    }
  }
  const things = [];
  let i = 0;
  for (let x = 70; x < w - 40; x += 140 + ((x * 13) % 70)) {
    const y = 98 + ((x * 7) % 14);
    things.push(i % 3 === 1 ? starfish(x, y, 7, -90 + (x % 40)) : shell(x, y, 1, i % 2 ? '#ffe3d6' : '#fff4e8'));
    i++;
  }
  const paws = [];
  for (let k = 0, x = 14; x < w - 14; k++, x += 34) paws.push(pawPrint(x, 114 + (k % 2 ? 4 : -2), 0.9));
  const tufts = [];
  for (let x = 40; x < w - 40; x += 96 + ((x * 7) % 50)) tufts.push(blades(x, ridgeY(top, x) + 7, 22 + ((x * 3) % 10), 7, x % 3, 2.2));
  return svgDoc(w, 140, `
    <defs><linearGradient id="bn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4dfaa"/><stop offset="1" stop-color="#e8cc90"/></linearGradient></defs>
    <path d="${polygon(top, w, 140)}" fill="url(#bn)"/>
    <path d="M${top.map(([x, y]) => `${x} ${f1(y + 3)}`).join(' L')}" fill="none" stroke="#fff4d2" stroke-width="3" opacity="0.8"/>
    ${ripples.join('')}${paws.join('')}${things.join('')}${tufts.join('')}`);
}

// Frankie's path: dry sand on top, layered sand with shells and pebbles below.
function groundBeach() {
  const w = 256;
  const layer = (y, amp, color, width, op) => {
    const pts = ridge(w, y, [[amp, 2]], 8);
    return `<path d="M${pts.map(([x, yy]) => `${x} ${f1(yy)}`).join(' L')}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" opacity="${op}"/>`;
  };
  const pebbles = [[40, 44, 4, '#b9aa95'], [96, 70, 3, '#a89a86'], [150, 50, 5, '#c2b5a2'], [210, 66, 3.5, '#b0a28e'], [236, 38, 2.5, '#c9bca8']];
  const edge = ridge(w, 13, [[1.6, 8]], 4)
    .reverse()
    .map(([x, y]) => `L${x} ${f1(y)}`)
    .join(' ');
  return svgDoc(w, 80, `
    <defs><linearGradient id="sd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8c987"/><stop offset="1" stop-color="#c99f5e"/></linearGradient></defs>
    <rect width="${w}" height="80" fill="url(#sd)"/>
    ${layer(32, 3, '#d9b473', 3, 0.8)}${layer(56, 4, '#bd9355', 3, 0.6)}
    ${pebbles.map(([x, y, r, c]) => `<ellipse cx="${x}" cy="${y}" rx="${f1(r * 1.4)}" ry="${r}" fill="${c}"/><ellipse cx="${f1(x - r * 0.4)}" cy="${f1(y - r * 0.35)}" rx="${f1(r * 0.6)}" ry="${f1(r * 0.32)}" fill="#e6dccc"/>`).join('')}
    ${shell(70, 54, 0.9, '#fff0e4')}${shell(180, 38, 0.8, '#ffe0d2')}${shell(128, 74, 0.7, '#fff6ea')}
    <path d="M0 0 H${w} ${edge} Z" fill="#f6e2aa"/>
    <rect width="${w}" height="4" fill="#fcefc8"/>
    <path d="M10 8 q7 -2.5 14 0 M52 9 q7 -2.5 14 0 M98 7 q7 -2.5 14 0 M146 9 q7 -2.5 14 0 M192 8 q7 -2.5 14 0 M232 9 q7 -2.5 14 0" fill="none" stroke="#e2c88d" stroke-width="2" stroke-linecap="round"/>`);
}

// ---- Far: dunes and boats on the sea ----

function dune(variant) {
  const shape = variant
    ? 'M0 200 C50 168 110 104 190 92 C250 84 290 112 330 108 C390 102 440 70 480 74 C520 80 545 150 560 200 Z'
    : 'M0 200 C70 150 150 74 260 64 C350 56 430 96 490 146 C522 172 545 188 560 200 Z';
  const shadow = variant
    ? 'M480 74 C520 80 545 150 560 200 H430 C470 160 470 110 480 74 Z'
    : 'M300 62 C380 70 440 110 490 146 C522 172 545 188 560 200 H390 C410 160 370 104 300 62 Z';
  const tufts = (variant
    ? [[120, 112], [190, 94], [260, 100], [330, 106], [420, 82], [480, 76], [520, 104]]
    : [[110, 128], [160, 96], [230, 70], [300, 64], [370, 82], [430, 112]]
  ).map(([x, y], i) => blades(x, y + 6, 22 + (i % 3) * 6, 7, i, 2.6));
  return svgDoc(560, 200, `
    <defs><linearGradient id="d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3dfab"/><stop offset="1" stop-color="#e2c389"/></linearGradient></defs>
    <path d="${shape}" fill="url(#d)" ${attrs('#c9a96c', 2.5)}/>
    <path d="${shadow}" fill="#d6b779" opacity="0.5"/>
    ${tufts.join('')}`);
}

function sailboat(hull, sail, stripe) {
  return svgDoc(130, 175, `
    ${wake(141, 14, 116)}
    <path d="M8 118 H122 L108 136 H22 Z" fill="${hull}" ${attrs('#2a3448', 2.5)}/>
    <path d="M12 124 H118" stroke="#ffffff" stroke-width="2.5"/>
    <rect x="63" y="14" width="4" height="106" fill="#8a6a4a"/>
    <path d="M69 18 Q98 68 114 112 H69 Z" fill="${sail}" ${attrs('#9aa6b2', 2)}/>
    <path d="M73 46 Q90 78 100 112" fill="none" stroke="${stripe}" stroke-width="6" opacity="0.85"/>
    <path d="M61 28 Q40 72 20 112 H61 Z" fill="#ffffff" ${attrs('#9aa6b2', 2)}/>
    <path d="M67 10 L80 14 L67 18 Z" fill="${RED}"/>`);
}

function ferry() {
  const windows = [];
  for (let x = 52; x < 186; x += 14) windows.push(`<rect x="${x}" y="70" width="8" height="7" rx="1.5" fill="#5f8fc0"/>`);
  for (let x = 78; x < 160; x += 14) windows.push(`<rect x="${x}" y="49" width="8" height="7" rx="1.5" fill="#5f8fc0"/>`);
  return svgDoc(250, 150, `
    ${wake(119, 20, 230)}
    <path d="M10 88 H240 L226 112 H26 Z" fill="#2d4f86" ${attrs('#1d2f50', 2.5)}/>
    <path d="M14 95 H236" stroke="#ffffff" stroke-width="3"/>
    <rect x="44" y="62" width="150" height="26" rx="3" fill="#ffffff" ${attrs('#8a96a6', 2)}/>
    <rect x="70" y="42" width="96" height="22" rx="3" fill="#ffffff" ${attrs('#8a96a6', 2)}/>
    ${windows.join('')}
    <rect x="172" y="18" width="18" height="26" fill="${RED}" ${attrs('#7a2a20', 2)}/>
    <rect x="172" y="18" width="18" height="6" fill="#2b2b2b"/>
    <circle cx="186" cy="10" r="5" fill="#e8ecf0" opacity="0.8"/><circle cx="198" cy="5" r="4" fill="#e8ecf0" opacity="0.6"/>
    <path d="M100 42 V24 M100 24 L120 34" stroke="#8a96a6" stroke-width="2"/>`);
}

// Fishing boat with its outriggers and nets, and a few gulls following it.
function cutter() {
  const net = [];
  for (let i = 0; i < 4; i++) net.push(`<path d="M${24 + i * 5} ${74 + i * 4} L${36 - i} ${96}" stroke="#7d8f62" stroke-width="1.2"/>`);
  return svgDoc(210, 160, `
    ${wake(130, 20, 190)}
    <path d="M84 98 V22" stroke="#5a4a3a" stroke-width="4"/>
    <path d="M84 30 L20 72 M84 30 L150 16" stroke="#5a4a3a" stroke-width="3" stroke-linecap="round"/>
    <path d="M20 72 L16 96 H44 Z" fill="#a8b88a" opacity="0.8" ${attrs('#6b7f52', 1.5)}/>
    ${net.join('')}
    <path d="M10 96 Q22 120 40 122 H170 Q190 118 200 92 Z" fill="#c8432f" ${attrs('#6e2418', 2.5)}/>
    <path d="M16 104 H194" stroke="#ffffff" stroke-width="3"/>
    <rect x="120" y="62" width="50" height="34" rx="3" fill="#ffffff" ${attrs('#8a96a6', 2)}/>
    <rect x="128" y="70" width="14" height="10" rx="1.5" fill="#9fd0f0"/><rect x="148" y="70" width="14" height="10" rx="1.5" fill="#9fd0f0"/>
    <path d="M126 62 L130 54 H160 L164 62 Z" fill="${BLUE}" ${attrs('#24466e', 1.5)}/>
    <path d="M84 22 L96 26 L84 30 Z" fill="${YELLOW}"/>
    <path d="M40 30 q4 -4 8 0 q4 -4 8 0 M60 16 q3 -3 6 0 q3 -3 6 0" fill="none" stroke="#5a6670" stroke-width="2" stroke-linecap="round"/>`);
}

// ---- Mid: beach chairs, parasols, lifeguard, lighthouse and harbour ----

// A wicker beach chair (Strandkorb) with striped cushions and a number plate.
function beachChair(stripe, number) {
  const soft = '#a08850';
  const hood = 'M14 106 V54 C14 22 40 8 60 8 C80 8 106 22 106 54 V106 Z';
  const opening = 'M25 104 V58 C25 34 42 22 60 22 C78 22 95 34 95 58 V104 Z';
  const weave = [];
  for (let row = 0, y = 12; y < 166; row++, y += 7) {
    weave.push(`<path d="M0 ${y} H120" stroke="#d6c08a" stroke-width="1.5"/>`);
    for (let x = row % 2 ? 4 : 8; x < 120; x += 8) weave.push(`<path d="M${x} ${y - 5.5} v4" stroke="#d6c08a" stroke-width="1.3"/>`);
  }
  const stripes = [];
  for (let x = 20; x < 100; x += 12) stripes.push(`<rect x="${x}" y="18" width="6" height="92" fill="${stripe}"/>`);
  return svgDoc(120, 170, `
    <defs>
      <clipPath id="body"><path d="${hood}"/><rect x="8" y="100" width="104" height="62" rx="6"/></clipPath>
      <clipPath id="open"><path d="${opening}"/></clipPath>
    </defs>
    <rect x="18" y="156" width="22" height="12" rx="3" fill="${WOOD}" ${attrs(WOOD_LINE, 2)}/>
    <rect x="80" y="156" width="22" height="12" rx="3" fill="${WOOD}" ${attrs(WOOD_LINE, 2)}/>
    <path d="${hood}" fill="#efe0b8"/>
    <rect x="8" y="100" width="104" height="62" rx="6" fill="#efe0b8"/>
    <g clip-path="url(#body)">${weave.join('')}</g>
    <path d="${hood}" fill="none" ${attrs(soft, 2.5)}/>
    <rect x="8" y="100" width="104" height="62" rx="6" fill="none" ${attrs(soft, 2.5)}/>
    <path d="${opening}" fill="#fbf7ef"/>
    <g clip-path="url(#open)">${stripes.join('')}<rect x="20" y="18" width="80" height="20" fill="#000000" opacity="0.08"/></g>
    <path d="${opening}" fill="none" ${attrs(soft, 2)}/>
    <rect x="22" y="92" width="76" height="13" rx="4" fill="${stripe}" ${attrs(soft, 2)}/>
    <path d="M30 98.5 H90" stroke="#ffffff" stroke-width="3" stroke-dasharray="6 6"/>
    <rect x="2" y="94" width="26" height="8" rx="3" fill="#b9874f" ${attrs(WOOD_LINE, 2)}/>
    <rect x="92" y="94" width="26" height="8" rx="3" fill="#b9874f" ${attrs(WOOD_LINE, 2)}/>
    <rect x="47" y="112" width="26" height="15" rx="3" fill="#fffaf0" ${attrs(soft, 1.5)}/>
    <text x="60" y="124" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#2f4f7f" text-anchor="middle">${number}</text>`);
}

function parasol(c1, c2, rim) {
  const edge = [8, 27, 46, 65, 84, 103, 122];
  const panels = edge
    .slice(0, -1)
    .map((x, i) => `<path d="M65 14 L${x} 60 Q${(x + edge[i + 1]) / 2} 69 ${edge[i + 1]} 60 Z" fill="${i % 2 ? c2 : c1}"/>`)
    .join('');
  const scallops = edge
    .slice(0, -1)
    .map((x, i) => `Q${(x + edge[i + 1]) / 2} 69 ${edge[i + 1]} 60`)
    .join(' ');
  return svgDoc(130, 175, `
    <rect x="63" y="20" width="4.5" height="152" rx="2" fill="#f4f1ea" ${attrs('#8a8678', 1.5)}/>
    ${panels}
    <path d="M65 14 L46 60 M65 14 L84 60" stroke="#000000" stroke-opacity="0.12" stroke-width="2"/>
    <path d="M65 14 L8 60 ${scallops} Z" fill="none" ${attrs(rim, 2.5)}/>
    <circle cx="65" cy="12" r="4" fill="#f4f1ea" ${attrs('#8a8678', 1.5)}/>`);
}

function lifeguardTower() {
  const post = (x1, y1, x2, y2, c) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${WOOD_LINE}" stroke-width="10" stroke-linecap="round"/><path d="M${x1} ${y1} L${x2} ${y2}" stroke="${c}" stroke-width="6" stroke-linecap="round"/>`;
  const rungs = [220, 200, 180, 160, 140, 124].map((y) => `<path d="M${f1(58 + (236 - y) * 0.033)} ${y} H${f1(72 - (236 - y) * 0.033)}" stroke="#c9a06a" stroke-width="3"/>`);
  return svgDoc(130, 240, `
    ${post(46, 236, 50, 112, '#93693f')}${post(84, 236, 80, 112, '#93693f')}
    ${post(26, 236, 34, 112, WOOD)}${post(104, 236, 96, 112, WOOD)}
    <path d="M30 214 L100 146 M100 214 L30 146" stroke="#8a6038" stroke-width="5" stroke-linecap="round"/>
    <path d="M58 236 L62 116 M72 236 L68 116" stroke="#c9a06a" stroke-width="3.5"/>
    ${rungs.join('')}
    <rect x="20" y="104" width="90" height="12" rx="2" fill="#b9874f" ${attrs(WOOD_LINE, 2.5)}/>
    <rect x="28" y="54" width="74" height="52" fill="#f7f2e8" ${attrs('#8a7f70', 2.5)}/>
    ${[40, 52, 64, 76, 88].map((x) => `<path d="M${x} 57 V103" stroke="#e1d9ca" stroke-width="2"/>`).join('')}
    <rect x="40" y="62" width="50" height="22" rx="2" fill="#a7d8f5" ${attrs('#ffffff', 3)}/>
    <path d="M65 62 V84" stroke="#ffffff" stroke-width="3"/>
    <circle cx="92" cy="94" r="7" fill="none" stroke="${RED}" stroke-width="4.5"/>
    <circle cx="92" cy="94" r="7" fill="none" stroke="#ffffff" stroke-width="4.5" stroke-dasharray="5.5 5.5"/>
    <path d="M18 58 L65 28 L112 58 Z" fill="${RED}" ${attrs('#8a2a20', 2.5)}/>
    <path d="M65 28 V4" stroke="#8a8678" stroke-width="2.5" stroke-linecap="round"/>
    <rect x="66" y="5" width="24" height="7" fill="${YELLOW}"/><rect x="66" y="12" width="24" height="7" fill="${RED}"/>
    <rect x="66" y="5" width="24" height="14" fill="none" ${attrs('#8a6a2a', 1.2)}/>`);
}

// Red and white lighthouse on a stone base; its light gets a moving beam in the game.
function lighthouse() {
  const tower = 'M33 256 L45 88 H85 L97 256 Z';
  return svgDoc(130, 300, `
    <defs>
      <clipPath id="tw"><path d="${tower}"/></clipPath>
      <radialGradient id="glow"><stop offset="0" stop-color="#fff6b0" stop-opacity="0.9"/><stop offset="1" stop-color="#fff6b0" stop-opacity="0"/></radialGradient>
    </defs>
    <circle cx="65" cy="62" r="34" fill="url(#glow)"/>
    <path d="M12 298 L22 252 H108 L118 298 Z" fill="#a39f97" ${attrs('#6d6961', 2.5)}/>
    <path d="M18 270 H112 M26 284 H104 M40 254 V270 M70 254 V270 M95 254 V270 M55 270 V284 M85 270 V284" stroke="#7f7b73" stroke-width="2" opacity="0.6"/>
    <path d="${tower}" fill="#ffffff"/>
    <g clip-path="url(#tw)">
      <rect x="20" y="104" width="90" height="30" fill="${RED}"/>
      <rect x="20" y="162" width="90" height="30" fill="${RED}"/>
      <rect x="20" y="220" width="90" height="30" fill="${RED}"/>
      <rect x="70" y="80" width="40" height="180" fill="#000000" opacity="0.08"/>
    </g>
    <path d="${tower}" fill="none" ${attrs('#7a6f66', 2.5)}/>
    <path d="M57 256 V238 a8 8 0 0 1 16 0 V256 Z" fill="#2f5f9a" ${attrs('#1f3f6a', 2)}/>
    <rect x="61" y="140" width="8" height="12" rx="2" fill="#2f4f6f"/>
    <rect x="61" y="198" width="8" height="12" rx="2" fill="#2f4f6f"/>
    <rect x="47" y="48" width="36" height="32" fill="#fff3a0" ${attrs('#4a4a52', 2.5)}/>
    <path d="M59 48 V80 M71 48 V80" stroke="#4a4a52" stroke-width="2"/>
    <rect x="34" y="80" width="62" height="9" rx="2" fill="#3f4048" ${attrs('#2a2a30', 1.5)}/>
    <path d="M36 80 V70 H94 V80 M48 70 V80 M60 70 V80 M72 70 V80 M84 70 V80" fill="none" stroke="#3f4048" stroke-width="2"/>
    <path d="M42 50 Q65 18 88 50 Z" fill="${RED}" ${attrs('#8a2a20', 2.5)}/>
    <circle cx="65" cy="24" r="4" fill="#3f4048"/>
    <path d="M65 20 V8" stroke="#3f4048" stroke-width="2"/>`);
}

// Soft light cone; it sweeps left and right from the lighthouse lamp.
function lightBeam() {
  return svgDoc(320, 60, `
    <defs><linearGradient id="lb" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff8c8" stop-opacity="0.85"/><stop offset="1" stop-color="#fff8c8" stop-opacity="0"/></linearGradient></defs>
    <path d="M0 26 L320 0 V60 L0 34 Z" fill="url(#lb)"/>`);
}

// Red brick house with a stepped gable, like in the old harbour towns.
function brickHouse() {
  const gable = 'M22 104 V86 H38 V70 H54 V54 H70 V38 H86 V24 H104 V38 H120 V54 H136 V70 H152 V86 H168 V104 Z';
  const bricks = [];
  for (let row = 0, y = 30; y < 226; row++, y += 8) {
    bricks.push(`<path d="M0 ${y} H190" stroke="#e8b4a0" stroke-width="1.2" opacity="0.45"/>`);
    for (let x = row % 2 ? 6 : 14; x < 190; x += 16) bricks.push(`<path d="M${x} ${y} v8" stroke="#e8b4a0" stroke-width="1.2" opacity="0.45"/>`);
  }
  const win = (x, y) => `
    <rect x="${x}" y="${y}" width="26" height="32" fill="#cfeaff" ${attrs('#ffffff', 4)}/>
    <path d="M${x + 13} ${y} V${y + 32} M${x} ${y + 14} H${x + 26}" stroke="#ffffff" stroke-width="3"/>
    <rect x="${x - 3}" y="${y + 33}" width="32" height="6" rx="2" fill="#8a5a33"/>
    <circle cx="${x + 4}" cy="${y + 32}" r="3.5" fill="#ff6b9a"/><circle cx="${x + 13}" cy="${y + 31}" r="3.5" fill="#ffd54f"/><circle cx="${x + 22}" cy="${y + 32}" r="3.5" fill="#ff6b9a"/>`;
  return svgDoc(190, 230, `
    <defs><clipPath id="hw"><path d="${gable}"/><rect x="22" y="100" width="146" height="128"/></clipPath></defs>
    <path d="${gable}" fill="#b5523e"/>
    <rect x="22" y="100" width="146" height="128" fill="#b5523e"/>
    <g clip-path="url(#hw)">${bricks.join('')}</g>
    <path d="${gable}" fill="none" ${attrs('#6e2a20', 2.5)}/>
    <rect x="22" y="100" width="146" height="128" fill="none" ${attrs('#6e2a20', 2.5)}/>
    <path d="M18 104 H172" stroke="#efe8dc" stroke-width="5" stroke-linecap="round"/>
    <circle cx="95" cy="66" r="12" fill="#cfeaff" ${attrs('#ffffff', 4)}/>
    <path d="M95 54 V78 M83 66 H107" stroke="#ffffff" stroke-width="2.5"/>
    ${win(38, 120)}${win(126, 120)}
    <path d="M80 228 V186 a15 15 0 0 1 30 0 V228 Z" fill="#2f6b4f" ${attrs('#1d4030', 2.5)}/>
    <path d="M86 192 h18 M86 206 h18" stroke="#ffffff" stroke-width="2" opacity="0.35"/>
    <circle cx="103" cy="210" r="2.5" fill="#ffd54f"/>`);
}

// White Frisian house with a thick thatched roof.
function frisianHouse() {
  const roof = 'M4 118 Q22 110 36 64 Q62 22 115 18 Q168 22 194 64 Q208 110 226 118 Z';
  const straw = [];
  for (let x = 8; x < 226; x += 8) {
    const y0 = 30 + Math.abs(x - 115) * 0.5;
    straw.push(`<path d="M${x} ${f1(y0)} q2 14 -1 ${f1(26 + (x % 3) * 6)}" fill="none" stroke="${x % 16 ? '#a07e44' : '#d9bb7c'}" stroke-width="2" stroke-linecap="round" opacity="0.8"/>`);
  }
  const win = (x) => `<rect x="${x}" y="134" width="26" height="28" fill="#cfeaff" ${attrs(BLUE, 3)}/><path d="M${x + 13} 134 V162 M${x} 148 H${x + 26}" stroke="#ffffff" stroke-width="2.5"/>`;
  return svgDoc(230, 200, `
    <defs><clipPath id="rf"><path d="${roof}"/></clipPath></defs>
    <rect x="26" y="104" width="178" height="94" fill="#fbf7ee" ${attrs('#9a8f80', 2.5)}/>
    <rect x="27" y="186" width="176" height="11" fill="#b5523e"/>
    ${win(40)}${win(76)}${win(160)}
    <path d="M118 198 V150 H146 V198 Z" fill="#2f5f9a" ${attrs('#1f3f6a', 2.5)}/>
    <path d="M122 156 h20 v12 h-20 Z" fill="#cfeaff"/>
    <circle cx="140" cy="178" r="2.2" fill="#ffd54f"/>
    <rect x="152" y="12" width="15" height="26" fill="#b5523e" ${attrs('#6e2a20', 2)}/>
    <path d="${roof}" fill="#c4a062"/>
    <g clip-path="url(#rf)">${straw.join('')}</g>
    <path d="${roof}" fill="none" ${attrs('#7d6234', 2.5)}/>
    <path d="M70 30 Q115 12 160 30" fill="none" stroke="#6f8f4a" stroke-width="6" stroke-linecap="round"/>
    <path d="M96 76 Q115 56 134 76 Z" fill="#b28d52" ${attrs('#7d6234', 2)}/>
    <rect x="105" y="70" width="20" height="16" fill="#cfeaff" ${attrs('#ffffff', 3)}/>`);
}

// A little fish stall with a striped awning and a fish on its sign.
function fishStall() {
  const boards = [];
  for (let x = 30; x < 150; x += 12) boards.push(`<path d="M${x} 52 V154" stroke="#34689f" stroke-width="2"/>`);
  // Awning with a scalloped lower edge (drawn from right to left) and blue stripes.
  const scallops = [];
  const stripes = [];
  for (let i = 0; i < 10; i++) {
    const x = 158 - (i + 1) * 14.6;
    scallops.push(`Q${f1(x + 7.3)} 72 ${f1(x)} 62`);
    stripes.push(`<rect x="${f1(12 + i * 14.6)}" y="38" width="7.3" height="36" fill="${BLUE}"/>`);
  }
  const awning = `M12 38 H158 V62 ${scallops.join(' ')} Z`;
  const fish = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="0" rx="12" ry="6" fill="${c}" ${attrs('#8a4a2a', 1.5)}/><path d="M10 0 L20 -6 V6 Z" fill="${c}" ${attrs('#8a4a2a', 1.5)}/><circle cx="-6" cy="-1.5" r="1.5" fill="#2b2b2b"/></g>`;
  return svgDoc(170, 160, `
    <defs><clipPath id="aw"><path d="${awning}"/></clipPath></defs>
    <rect x="18" y="50" width="134" height="106" fill="#3f78b5" ${attrs('#24466e', 2.5)}/>
    ${boards.join('')}
    <rect x="32" y="74" width="106" height="34" fill="#24323f"/>
    ${fish(58, 88, 0.8, '#f2a65a')}${fish(86, 92, 0.8, '#d9d0c0')}${fish(114, 88, 0.8, '#f2a65a')}
    <rect x="26" y="104" width="118" height="9" rx="2" fill="#c9a06a" ${attrs('#7a5a3a', 2)}/>
    <path d="${awning}" fill="#ffffff"/>
    <g clip-path="url(#aw)">${stripes.join('')}</g>
    <path d="${awning}" fill="none" ${attrs('#24466e', 2)}/>
    <rect x="22" y="14" width="126" height="22" rx="4" fill="#ffffff" ${attrs('#8a96a6', 2)}/>
    ${fish(85, 25, 1.1, STARFISH)}`);
}

// ---- Near: grass, shells, posts ----

function marram() {
  return svgDoc(110, 72, `
    <ellipse cx="55" cy="70" rx="50" ry="10" fill="#ead19a"/>
    ${blades(40, 68, 46, 9, 1)}${blades(66, 68, 52, 10, 2)}${blades(86, 70, 34, 6, 0)}`);
}

// A small sand mound with shells and an orange starfish.
function shellPile() {
  return svgDoc(110, 46, `
    <path d="M4 46 Q20 26 55 24 Q90 26 106 46 Z" fill="#efd7a0" ${attrs('#cdb07a', 2)}/>
    ${starfish(58, 31, 11, -100)}
    ${shell(30, 41, 1.3, '#fff2e8')}${shell(84, 39, 1.1, '#ffd9c9')}
    ${blades(14, 45, 22, 4, 1, 2)}${blades(98, 45, 18, 4, 2, 2)}`);
}

function lifebuoyPost() {
  return svgDoc(50, 120, `
    <rect x="20" y="10" width="11" height="110" rx="3" fill="${WOOD}" ${attrs(WOOD_LINE, 2)}/>
    <circle cx="25.5" cy="52" r="15" fill="none" stroke="${RED}" stroke-width="8"/>
    <circle cx="25.5" cy="52" r="15" fill="none" stroke="#ffffff" stroke-width="8" stroke-dasharray="11.78 11.78"/>
    <circle cx="25.5" cy="52" r="19" fill="none" stroke="#8a2a20" stroke-width="1.5"/>
    <circle cx="25.5" cy="52" r="11" fill="none" stroke="#8a2a20" stroke-width="1.5"/>`);
}

// A gull resting on a wooden post.
function gullPost() {
  return svgDoc(60, 130, `
    <rect x="22" y="46" width="14" height="84" rx="3" fill="#9a8a76" ${attrs('#6b5a46', 2)}/>
    <path d="M22 56 H36 M22 72 H36" stroke="#7d6c58" stroke-width="2"/>
    <path d="M26 38 L25 47 M33 38 L34 47" stroke="#e8a33a" stroke-width="2"/>
    <path d="M8 30 L18 33 L18 27 Z" fill="#3a3a3a"/>
    <ellipse cx="28" cy="31" rx="14" ry="8.5" fill="#ffffff" ${attrs('#8a96a6', 1.5)}/>
    <path d="M17 29 Q28 21 38 28 Q30 33 17 29 Z" fill="#b7c0c8"/>
    <circle cx="40" cy="22" r="6.5" fill="#ffffff" ${attrs('#8a96a6', 1.5)}/>
    <path d="M45 22 L53 23 L45 25.5 Z" fill="#f2b632"/>
    <circle cx="42" cy="20.5" r="1.3" fill="#2b2b2b"/>`);
}

// ---- Strips: continuous fences ----

// Brushwood fence that keeps the sand on the dunes.
function duneFence() {
  const sticks = [];
  for (let x = 4; x < 160; x += 7) {
    const h = 40 + ((x * 13) % 14);
    sticks.push(`<rect x="${x}" y="${70 - h}" width="4" height="${h}" rx="1.5" fill="${x % 2 ? '#a89480' : '#8f7c68'}"/>`);
  }
  return svgDoc(160, 70, `
    ${sticks.join('')}
    <path d="M0 40 H160 M0 56 H160" stroke="#6b5a4a" stroke-width="1.5"/>`);
}

// Railing along the harbour promenade.
function quayRail() {
  return svgDoc(160, 64, `
    <path d="M0 18 H160 M0 38 H160" stroke="#24466e" stroke-width="6" stroke-linecap="round"/>
    <path d="M0 18 H160 M0 38 H160" stroke="#4f86c6" stroke-width="3"/>
    <path d="M-62 24 Q-27 36 8 24 M18 24 Q53 36 88 24 M98 24 Q133 36 168 24" fill="none" stroke="#e8dcc0" stroke-width="2.5"/>
    <rect x="8" y="10" width="10" height="54" rx="2" fill="#f4f1ea" ${attrs('#8a8678', 2)}/>
    <rect x="88" y="10" width="10" height="54" rx="2" fill="#f4f1ea" ${attrs('#8a8678', 2)}/>`);
}

// ---- Things Frankie can bump into or stand on ----

function sandcastle() {
  const sand = '#efd08a';
  // Battlements along the top from (x0, y + 6) to (x1, y + 6): three teeth, two notches.
  const battlements = (x0, x1, y) => {
    const w = (x1 - x0) / 5;
    return `V${y} H${f1(x0 + w)} V${y + 5} H${f1(x0 + 2 * w)} V${y} H${f1(x0 + 3 * w)} V${y + 5} H${f1(x0 + 4 * w)} V${y} H${x1} V${y + 6}`;
  };
  const grains = [[14, 44], [20, 36], [56, 40], [61, 48], [30, 30], [44, 34], [38, 46]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.1" fill="#c99f55"/>`).join('');
  return svgDoc(72, 62, `
    <path d="M2 60 Q6 47 18 45 H54 Q66 47 70 60 Z" fill="#dcb46e" ${line()}/>
    <path d="M20 50 V22 ${battlements(20, 52, 16)} V50 Z" fill="${sand}" ${line()}/>
    <path d="M7 54 L10 28 ${battlements(10, 24, 22)} L27 54 Z" fill="${sand}" ${line()}/>
    <path d="M45 54 L48 28 ${battlements(48, 62, 22)} L65 54 Z" fill="${sand}" ${line()}/>
    <path d="M30 50 V41 a6 6 0 0 1 12 0 V50 Z" fill="#9c7740" ${line(2.5)}/>
    <path d="M15 36 v6 M56 36 v6" stroke="#9c7740" stroke-width="3" stroke-linecap="round"/>
    <path d="M36 16 V3" stroke="#8a5a33" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M37 3 L49 6.5 L37 10 Z" fill="${RED}" ${line(2)}/>
    ${grains}
    ${shell(26, 31, 0.7, '#ffffff')}${shell(46, 29, 0.6, '#ffd9c9')}`);
}

// Red crab looking at Frankie, claws up; two frames for walking sideways.
function crab(step) {
  const legs = [];
  for (let i = 0; i < 3; i++) {
    const lift = (i + step) % 2 ? 3 : 0;
    const y = 27 + i * 3;
    for (const side of [-1, 1]) {
      const x0 = 32 + side * (13 - i * 2);
      const kx = 32 + side * (22 + i * 2);
      const fx = 32 + side * (25 + i * 3);
      const d = `M${x0} ${y} L${kx} ${y - 3 - lift} L${fx} ${40 - lift}`;
      legs.push(`<path d="${d}" fill="none" ${line(5)}/><path d="${d}" fill="none" stroke="#d9472f" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`);
    }
  }
  // Round pincers with a notch on top; the notch opens and closes while walking.
  const open = step ? 3 : 0;
  const claw = (side) => {
    const cx = 32 + side * 22;
    const cy = 12;
    const n = 2 + open;
    const arm = `M${32 + side * 13} 22 Q${32 + side * 20} 21 ${cx} ${cy + 5}`;
    return `<path d="${arm}" fill="none" ${line(6)}/><path d="${arm}" fill="none" stroke="#e8553a" stroke-width="3" stroke-linecap="round"/>
      <path d="M${cx - 7} ${cy + 3} C${cx - 9} ${cy - 5} ${cx - 6} ${cy - 10} ${cx - n} ${cy - 9} L${cx} ${cy - 2 - open} L${cx + n} ${cy - 9} C${cx + 6} ${cy - 10} ${cx + 9} ${cy - 5} ${cx + 7} ${cy + 3} C${cx + 4} ${cy + 7} ${cx - 4} ${cy + 7} ${cx - 7} ${cy + 3} Z" fill="#e8553a" ${line(2.5)}/>
      <path d="M${cx - 4} ${cy - 3} q1 -3 3 -4" fill="none" stroke="#ff9e7a" stroke-width="1.6" stroke-linecap="round"/>`;
  };
  return svgDoc(64, 46, `<g transform="translate(0 4)">
    ${legs.join('')}
    ${claw(-1)}${claw(1)}
    <path d="M27 18 L25 8 M37 18 L39 8" fill="none" ${line(2.5)}/>
    <ellipse cx="32" cy="26" rx="17" ry="11.5" fill="#e8553a" ${line()}/>
    <ellipse cx="29" cy="22" rx="10" ry="5" fill="#ff8a5c"/>
    <circle cx="25" cy="7" r="4" fill="#ffffff" ${line(2)}/><circle cx="39" cy="7" r="4" fill="#ffffff" ${line(2)}/>
    <circle cx="24" cy="7.5" r="2" fill="#1b120b"/><circle cx="38" cy="7.5" r="2" fill="#1b120b"/>
    <path d="M27 30 Q32 33.5 37 30" fill="none" ${line(2)}/>
    <circle cx="22" cy="28" r="2.2" fill="#ff9e8a" opacity="0.8"/><circle cx="42" cy="28" r="2.2" fill="#ff9e8a" opacity="0.8"/></g>`);
}

// Beach ball with coloured panels around a white cap; it turns while it rolls.
function beachball() {
  const colors = [RED, '#ffffff', BLUE, '#ffffff', YELLOW, '#ffffff'];
  const pole = [25, 14];
  const panels = colors.map((c, i) => {
    const a1 = ((i * 60 - 90) * Math.PI) / 180;
    const a2 = (((i + 1) * 60 - 90) * Math.PI) / 180;
    const p = (a) => `${f1(pole[0] + Math.cos(a) * 60)} ${f1(pole[1] + Math.sin(a) * 60)}`;
    return `<path d="M${pole[0]} ${pole[1]} L${p(a1)} L${p(a2)} Z" fill="${c}"/>`;
  });
  return svgDoc(50, 50, `
    <defs>
      <clipPath id="bb"><circle cx="25" cy="25" r="21.5"/></clipPath>
      <radialGradient id="shine" cx="0.36" cy="0.3" r="0.8"><stop offset="0" stop-color="#ffffff" stop-opacity="0.4"/><stop offset="0.55" stop-color="#ffffff" stop-opacity="0"/><stop offset="1" stop-color="#000000" stop-opacity="0.22"/></radialGradient>
    </defs>
    <g clip-path="url(#bb)">${panels.join('')}</g>
    <circle cx="25" cy="25" r="21.5" fill="url(#shine)"/>
    <ellipse cx="25" cy="14" rx="5" ry="3.4" fill="#ffffff" ${line(1.8)}/>
    <circle cx="25" cy="25" r="21.5" fill="none" ${line()}/>
    <ellipse cx="16" cy="13" rx="5" ry="2.6" fill="#ffffff" opacity="0.7" transform="rotate(-35 16 13)"/>`);
}

// One plank block of the wooden pier (Frankie can stand on it).
function blockPier() {
  return svgDoc(48, 32, `
    <rect x="1.5" y="1.5" width="45" height="29" rx="4" fill="#b08a62"/>
    <rect x="1.5" y="1.5" width="45" height="11" rx="4" fill="#d2ab7a"/>
    <path d="M1.5 13 H46.5 M1.5 22 H46.5" stroke="#7d5f3f" stroke-width="2"/>
    <path d="M10 17 H22 M28 18 H40 M8 26 H28 M32 26 H42" stroke="#94704a" stroke-width="1.3" stroke-linecap="round"/>
    <circle cx="6" cy="7.5" r="1.4" fill="#5a4330"/><circle cx="42" cy="7.5" r="1.4" fill="#5a4330"/>
    <circle cx="6" cy="17.5" r="1.3" fill="#5a4330"/><circle cx="42" cy="17.5" r="1.3" fill="#5a4330"/>
    <path d="M7 4.5 H41" stroke="#efd09c" stroke-width="2" stroke-linecap="round"/>
    <rect x="1.5" y="1.5" width="45" height="29" rx="4" fill="none" ${line()}/>`);
}

// Water channel through the sand: middle part (tiles sideways) and the left bank (mirrored for the right).
function gapBeachMid() {
  return svgDoc(64, 80, `
    <defs>
      <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b48d55"/><stop offset="1" stop-color="#8a6a3c"/></linearGradient>
      <linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5ed0e6"/><stop offset="1" stop-color="#1f7fb8"/></linearGradient>
    </defs>
    <rect width="64" height="80" fill="url(#wall)"/>
    <path d="M0 12 Q16 9 32 12 T64 12 M0 22 Q16 19 32 22 T64 22" fill="none" stroke="#9c7844" stroke-width="2" opacity="0.6"/>
    <rect y="30" width="64" height="50" fill="url(#water)"/>
    <path d="M0 30 Q8 27 16 30 T32 30 T48 30 T64 30 V34 H0 Z" fill="#ffffff" opacity="0.9"/>
    <path d="M6 46 Q14 43 22 46 M36 58 Q44 55 52 58 M20 70 Q26 68 32 70" fill="none" stroke="#e6fbff" stroke-width="2" stroke-linecap="round" opacity="0.8"/>`);
}

function gapBeachBank() {
  return svgDoc(18, 80, `
    <path d="M5 12 Q10 30 8 52 Q10 66 6 80 H18 V8 Z" fill="#a8844e"/>
    <path d="M0 0 H18 V11 Q14 15 9 13 Q4 12 0 13 Z" fill="#f6e2aa"/>
    <rect width="18" height="4" fill="#fcefc8"/>
    <path d="M17 6 Q11 28 13 50 Q15 66 11 80" fill="none" ${line()}/>
    <path d="M18 4 Q15 12 10 13" fill="none" ${line(2.5)}/>`);
}

const PIECES = {
  'hills-far-beach': [GAME_WIDTH, 220, seaFar],
  'hills-near-beach': [GAME_WIDTH, 140, beachNear],
  'ground-beach': [256, 80, groundBeach],
  dune: [560, 200, () => dune(0)],
  'dune-2': [560, 200, () => dune(1)],
  sailboat: [130, 175, () => sailboat('#2d4f86', '#ffffff', RED)],
  'sailboat-2': [130, 175, () => sailboat('#c8432f', '#fff7e0', BLUE)],
  ferry: [250, 150, ferry],
  cutter: [210, 160, cutter],
  'beach-chair': [120, 170, () => beachChair(BLUE, 17)],
  'beach-chair-red': [120, 170, () => beachChair(RED, 42)],
  parasol: [130, 175, () => parasol(RED, '#fff4e0', '#8a2a20')],
  'parasol-2': [130, 175, () => parasol(BLUE, YELLOW, '#24466e')],
  lifeguard: [130, 240, lifeguardTower],
  lighthouse: [130, 300, lighthouse],
  'light-beam': [320, 60, lightBeam],
  'brick-house': [190, 230, brickHouse],
  'frisian-house': [230, 200, frisianHouse],
  'fish-stall': [170, 160, fishStall],
  marram: [110, 72, marram],
  'shell-pile': [110, 46, shellPile],
  'lifebuoy-post': [50, 120, lifebuoyPost],
  'gull-post': [60, 130, gullPost],
  'dune-fence': [160, 70, duneFence],
  'quay-rail': [160, 64, quayRail],
  sandcastle: [72, 62, sandcastle],
  crab: [64, 46, () => crab(0)],
  'crab-2': [64, 46, () => crab(1)],
  beachball: [50, 50, beachball],
  'block-pier': [48, 32, blockPier],
  'gap-beach-mid': [64, 80, gapBeachMid],
  'gap-beach-bank': [18, 80, gapBeachBank],
};

export function beachSvgs() {
  return Object.fromEntries(Object.entries(PIECES).map(([key, [w, h, draw]]) => [key, { w, h, svg: draw() }]));
}

export function preloadBeach(scene) {
  for (const [key, { w, h, svg }] of Object.entries(beachSvgs())) loadSvg(scene, key, svg, w, h);
}

export function createBeachAnims(scene) {
  scene.anims.create({ key: 'crab-walk', frames: [{ key: 'crab' }, { key: 'crab-2' }], frameRate: 8, repeat: -1 });
}
