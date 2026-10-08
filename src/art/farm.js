import { GAME_WIDTH } from '../config.js';
import { OUTLINE, loadSvg, svgDoc } from './svg.js';
import { WOOD, attrs, crown, ridge, ridgeY } from './scenery.js';

// Level 4: the farm: fields with a tractor and a scarecrow, the farmyard with barn,
// silo and farmhouse, and the pasture with the stable. Background pieces have soft
// outlines; everything Frankie can touch (hay bale, milk can, chicken, frog, crate
// blocks, ditch) gets the strong dark outline.

const line = (w = 3) => attrs(OUTLINE, w);
const f1 = (n) => n.toFixed(1);
const RED = '#c0392b';
const RED_DARK = '#7a2418';
const STRAW = '#efcd6a';
const STRAW_DARK = '#d4ac44';
const STRAW_LINE = '#9a7420';
const TIMBER = '#5a3a22';

const polygon = (pts, w, h) => `M0 ${h} ${pts.map(([x, y]) => `L${x} ${f1(y)}`).join(' ')} L${w} ${h} Z`;

// ---- Background tiles: fields, meadow, soil ----

// Rolling hills with a patchwork of fields, hedges between them, a tiny farm and church.
function fieldsFar() {
  const w = GAME_WIDTH;
  const back = ridge(w, 86, [[22, 1, 0.6], [9, 3, 2]]);
  const front = ridge(w, 128, [[14, 2, 1.8], [6, 5, 0.3]]);
  const crops = [['#e9cd62', '#d2b24a'], ['#9fd36f', '#84bd58'], ['#c6976a', '#a77a50'], ['#b9dc7a', '#9cc860'], ['#f0d878', '#d6b955'], ['#8fcf6a', '#76b855'], ['#d9b07a', '#bf935c'], ['#c3e08a', '#a6cc6c']];
  const fields = [];
  // Bushy hedge between two fields (also at the right edge, so the tile repeats seamlessly).
  const hedge = (x0) => {
    for (let y = ridgeY(front, x0) - 2, k = 0; y < 224; y += 5, k++) {
      fields.push(`<circle cx="${x0 + (k % 2 ? 2 : -2)}" cy="${f1(y)}" r="${k % 3 ? 5.5 : 6.5}" fill="${k % 2 ? '#5f9a48' : '#6aa852'}"/>`);
    }
  };
  for (let i = 0; i < 8; i++) {
    const x0 = i * 120;
    const x1 = x0 + 120;
    const top = front.filter(([x]) => x >= x0 && x <= x1);
    const [fill, furrow] = crops[i];
    fields.push(`<path d="M${x0} 220 ${top.map(([x, y]) => `L${x} ${f1(y)}`).join(' ')} L${x1} 220 Z" fill="${fill}"/>`);
    const slant = i % 2 ? -14 : 14;
    for (let k = 1; k < 6; k++) {
      const x = x0 + k * 20;
      fields.push(`<path d="M${x} ${f1(ridgeY(front, x) + 4)} L${x + slant} 220" stroke="${furrow}" stroke-width="2.5" opacity="0.8"/>`);
    }
    hedge(x0);
  }
  hedge(w);
  const trees = [];
  for (let x = 24; x < w - 20; x += 58 + ((x * 7) % 36)) {
    const y = ridgeY(back, x);
    trees.push(`<rect x="${x - 1.5}" y="${f1(y - 6)}" width="3" height="8" fill="#7a9a6a"/><circle cx="${x}" cy="${f1(y - 12)}" r="${7 + (x % 5)}" fill="#86b778"/>`);
  }
  const by = ridgeY(back, 300);
  const cy = ridgeY(back, 700);
  return svgDoc(w, 220, `
    <defs><linearGradient id="hb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c3e2c6"/><stop offset="1" stop-color="#a9d3a4"/></linearGradient></defs>
    <path d="${polygon(back, w, 220)}" fill="url(#hb)"/>
    ${trees.join('')}
    <path d="M288 ${f1(by)} V${f1(by - 12)} L300 ${f1(by - 20)} L312 ${f1(by - 12)} V${f1(by)} Z" fill="#d98a7a"/>
    <path d="M316 ${f1(by)} V${f1(by - 18)} a5 5 0 0 1 10 0 V${f1(by)} Z" fill="#c9ccd0"/>
    <path d="M694 ${f1(cy)} V${f1(cy - 14)} H706 V${f1(cy)} Z M694 ${f1(cy - 14)} L700 ${f1(cy - 30)} L706 ${f1(cy - 14)} Z" fill="#d6d2c8"/>
    ${fields.join('')}`);
}

// Green meadow in front of the fields, with poppies and cornflowers.
function meadowNear() {
  const w = GAME_WIDTH;
  const top = ridge(w, 42, [[13, 2, 0.4], [6, 3, 1]]);
  const flowers = [];
  for (let x = 16; x < w - 10; x += 29) {
    const y = ridgeY(top, x) + 16 + ((x * 13) % 62);
    const c = ['#e53935', '#ffffff', '#4a7bd1', '#ffd54f'][x % 4];
    flowers.push(`<circle cx="${x}" cy="${y}" r="2.8" fill="${c}"/>`);
  }
  const stripes = ridge(w, 80, [[9, 2, 1.1]]);
  return svgDoc(w, 140, `
    <defs><linearGradient id="mn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9bd46f"/><stop offset="1" stop-color="#7cc25a"/></linearGradient></defs>
    <path d="${polygon(top, w, 140)}" fill="url(#mn)"/>
    <path d="M${stripes.map(([x, y]) => `${x} ${f1(y)}`).join(' L')}" fill="none" stroke="#b0e08a" stroke-width="10" opacity="0.45"/>
    ${flowers.join('')}`);
}

// Frankie's path: grass on top, dark field soil with roots and stones.
function groundFarm() {
  const w = 256;
  const stones = [[34, 54, 6], [118, 70, 5], [176, 46, 7], [230, 66, 5]];
  const blades = [];
  for (let x = 4; x < w; x += 9) {
    const h = 6 + ((x * 7) % 7);
    blades.push(`<path d="M${x} 14 L${x + 2.5} ${14 - h} L${x + 5} 14 Z" fill="${x % 2 ? '#7fd05a' : '#62bb44'}"/>`);
  }
  const edge = ridge(w, 18, [[2.5, 8]], 4)
    .reverse()
    .map(([x, y]) => `L${x} ${f1(y)}`)
    .join(' ');
  return svgDoc(w, 80, `
    <defs><linearGradient id="soil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a5a34"/><stop offset="1" stop-color="#6a4226"/></linearGradient></defs>
    <rect width="${w}" height="80" fill="url(#soil)"/>
    ${stones.map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${f1(r * 1.3)}" ry="${r}" fill="#8f8a83"/><ellipse cx="${f1(x - r * 0.3)}" cy="${f1(y - r * 0.35)}" rx="${f1(r * 0.6)}" ry="${f1(r * 0.35)}" fill="#b9b4ac"/>`).join('')}
    <path d="M64 24 q8 12 2 24 q-4 6 2 12 M200 22 q-8 10 0 22 M140 30 q6 8 0 16" fill="none" stroke="#4e321c" stroke-width="2.2" opacity="0.6"/>
    <path d="M0 0 H${w} ${edge} Z" fill="#4e9a35"/>
    <rect width="${w}" height="12" fill="#74c24f"/>
    ${blades.join('')}
    <circle cx="44" cy="7" r="2.5" fill="#ffffff"/><circle cx="150" cy="6" r="2.5" fill="#ffd54f"/><circle cx="214" cy="7" r="2.3" fill="#e53935"/>`);
}

// ---- Far: animals on the hills ----
// The animal sits at the top of its picture; the empty space below lifts it onto the
// far fields, so the meadow in front does not hide its legs.
const LIFT = 90;

function cow() {
  const spots = [[44, 40, 9, 7], [70, 50, 7, 6], [92, 38, 8, 6], [60, 30, 5, 4]];
  return svgDoc(150, 100 + LIFT, `
    <g ${attrs('#4a4a4a', 2.5)}>
      <path d="M36 94 V64 M50 94 V66 M92 94 V66 M106 94 V64" fill="none" stroke-width="7"/>
    </g>
    <path d="M36 94 V64 M50 94 V66 M92 94 V66 M106 94 V64" fill="none" stroke="#ffffff" stroke-width="3.5"/>
    <path d="M118 46 Q132 52 128 72" fill="none" stroke="#4a4a4a" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="128" cy="74" r="3" fill="#4a4a4a"/>
    <path d="M28 36 Q30 22 54 22 H100 Q120 24 120 46 Q120 70 100 70 H50 Q28 70 28 50 Z" fill="#ffffff" ${attrs('#4a4a4a', 2.5)}/>
    ${spots.map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#2f2f2f"/>`).join('')}
    <ellipse cx="96" cy="70" rx="8" ry="4" fill="#f4a8b4"/>
    <path d="M10 30 Q8 14 22 14 Q34 14 34 30 Q34 46 22 48 Q10 46 10 30 Z" fill="#ffffff" ${attrs('#4a4a4a', 2.5)}/>
    <ellipse cx="18" cy="42" rx="10" ry="7" fill="#f4a8b4" ${attrs('#b8707c', 1.5)}/>
    <circle cx="14" cy="42" r="1.4" fill="#8a4a52"/><circle cx="21" cy="42" r="1.4" fill="#8a4a52"/>
    <circle cx="16" cy="26" r="2" fill="#1b1b1b"/>
    <path d="M14 15 q-6 -8 -2 -10 M28 15 q6 -8 2 -10" fill="none" stroke="#e8dcc0" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="34" cy="20" rx="6" ry="3" fill="#ffffff" ${attrs('#4a4a4a', 1.5)}/>`);
}

function sheep() {
  const wool = [[30, 30, 12], [46, 24, 13], [62, 26, 13], [76, 32, 12], [70, 44, 12], [52, 46, 13], [36, 44, 12]];
  return svgDoc(110, 80 + LIFT, `
    <path d="M38 74 V54 M50 74 V56 M66 74 V56 M76 74 V54" fill="none" stroke="#3a3a3a" stroke-width="5" stroke-linecap="round"/>
    ${wool.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r + 2}" fill="#8a8478"/>`).join('')}
    ${wool.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fbf8f0"/>`).join('')}
    ${wool.map(([x, y, r]) => `<circle cx="${f1(x - r * 0.3)}" cy="${f1(y - r * 0.3)}" r="${f1(r * 0.45)}" fill="#ffffff"/>`).join('')}
    <ellipse cx="18" cy="32" rx="10" ry="12" fill="#3a3a3a"/>
    <ellipse cx="12" cy="22" rx="5" ry="3" fill="#3a3a3a" transform="rotate(-30 12 22)"/>
    <circle cx="15" cy="30" r="1.8" fill="#ffffff"/>
    <circle cx="22" cy="20" r="6" fill="#fbf8f0"/>`);
}

// ---- Mid: tractor, scarecrow, barn, silo, farmhouse, stable, coop ----

function tractor() {
  const tread = [];
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI * 2) / 16;
    tread.push(`<rect x="${f1(52 + Math.cos(a) * 35 - 3)}" y="${f1(110 + Math.sin(a) * 35 - 3)}" width="6" height="6" rx="1" fill="#2b2b2b" transform="rotate(${f1((a * 180) / Math.PI)} ${f1(52 + Math.cos(a) * 35)} ${f1(110 + Math.sin(a) * 35)})"/>`);
  }
  const wheel = (cx, cy, r, rim) => `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#2f2f2f" ${attrs('#141414', 2.5)}/>
    <circle cx="${cx}" cy="${cy}" r="${rim}" fill="#f2c230" ${attrs('#a07c10', 2)}/>
    <circle cx="${cx}" cy="${cy}" r="${f1(rim * 0.4)}" fill="${RED}" ${attrs(RED_DARK, 1.5)}/>`;
  return svgDoc(200, 150, `
    <circle cx="146" cy="28" r="7" fill="#e3e3e3" opacity="0.8"/><circle cx="156" cy="18" r="5" fill="#e8e8e8" opacity="0.6"/>
    <rect x="138" y="40" width="7" height="40" rx="2" fill="#5a5a5a" ${attrs('#2f2f2f', 1.5)}/>
    <path d="M84 76 H178 Q190 76 190 88 V106 H84 Z" fill="${RED}" ${attrs(RED_DARK, 2.5)}/>
    <path d="M182 82 V102 M176 82 V102" stroke="${RED_DARK}" stroke-width="2"/>
    <circle cx="186" cy="80" r="4" fill="#fff3a0" ${attrs('#a07c10', 1.5)}/>
    <path d="M28 24 H98 V30 H28 Z" fill="${RED}" ${attrs(RED_DARK, 2.5)}/>
    <path d="M34 30 V80 M92 30 V80" stroke="${RED_DARK}" stroke-width="5"/>
    <rect x="37" y="32" width="52" height="40" rx="3" fill="#bfe3f5" opacity="0.85"/>
    <path d="M44 38 L58 38 L44 56 Z" fill="#ffffff" opacity="0.6"/>
    <path d="M60 60 q8 -10 18 -4" fill="none" stroke="#3a3a3a" stroke-width="3" stroke-linecap="round"/>
    <path d="M26 82 Q30 66 52 66 Q78 66 84 88 V96 H26 Z" fill="${RED}" ${attrs(RED_DARK, 2.5)}/>
    ${tread.join('')}
    ${wheel(52, 110, 34, 19)}
    ${wheel(160, 124, 20, 10)}
    <path d="M136 104 Q140 96 160 96 Q178 96 184 106" fill="none" stroke="${RED}" stroke-width="7" stroke-linecap="round"/>`);
}

function scarecrow() {
  const checks = [];
  for (let x = 30; x < 82; x += 8) checks.push(`<path d="M${x} 66 V128" stroke="#ffffff" stroke-width="2.5" opacity="0.55"/>`);
  for (let y = 70; y < 128; y += 8) checks.push(`<path d="M10 ${y} H100" stroke="#ffffff" stroke-width="2.5" opacity="0.55"/>`);
  return svgDoc(110, 190, `
    <defs><clipPath id="shirt"><path d="M36 66 H74 L80 128 H30 Z M14 70 H96 V86 H14 Z"/></clipPath></defs>
    <rect x="51" y="56" width="8" height="134" fill="#8a5a33" ${attrs(WOOD, 2)}/>
    <rect x="10" y="74" width="90" height="7" rx="2" fill="#8a5a33" ${attrs(WOOD, 2)}/>
    <path d="M14 82 l-8 4 M14 78 l-9 -2 M96 82 l8 4 M96 78 l9 -2 M40 128 l-4 10 M50 128 l-1 12 M62 128 l2 12 M72 128 l5 10" stroke="${STRAW_DARK}" stroke-width="3" stroke-linecap="round"/>
    <path d="M36 66 H74 L80 128 H30 Z" fill="#d9473a"/>
    <path d="M14 70 H96 V86 H14 Z" fill="#d9473a"/>
    <g clip-path="url(#shirt)">${checks.join('')}</g>
    <path d="M36 66 H74 L80 128 H30 Z M14 70 H96 V86 H14 Z" fill="none" ${attrs('#7a2418', 2)}/>
    <rect x="46" y="98" width="14" height="12" fill="#4a7bd1" ${attrs('#2a4a8a', 1.5)}/>
    <circle cx="55" cy="48" r="17" fill="#e6c88e" ${attrs('#9a7a4a', 2.5)}/>
    <circle cx="48" cy="45" r="2.8" fill="#2b2b2b"/><circle cx="62" cy="45" r="2.8" fill="#2b2b2b"/>
    <path d="M55 48 l-3 6 h6 Z" fill="#f08a2a"/>
    <path d="M46 56 Q55 62 64 56" fill="none" stroke="#5a3a22" stroke-width="2" stroke-linecap="round" stroke-dasharray="2.5 2"/>
    <ellipse cx="55" cy="34" rx="28" ry="6" fill="${STRAW}" ${attrs(STRAW_LINE, 2)}/>
    <path d="M42 34 V20 Q55 12 68 20 V34 Z" fill="${STRAW}" ${attrs(STRAW_LINE, 2)}/>
    <path d="M42 28 H68" stroke="#4a7bd1" stroke-width="4"/>
    <circle cx="70" cy="27" r="4" fill="#ff6b9a"/><circle cx="70" cy="27" r="1.5" fill="#ffd54f"/>
    <path d="M18 72 Q20 62 28 64 Q30 70 26 74 Z" fill="#2b2b2b"/>
    <circle cx="24" cy="64" r="4" fill="#2b2b2b"/><path d="M20 63 l-5 1 l5 2 Z" fill="#f2b632"/>`);
}

function barn() {
  const boards = [];
  for (let x = 34; x < 216; x += 12) boards.push(`<path d="M${x} 96 V216" stroke="#a5301f" stroke-width="2"/>`);
  const door = (x) => `<rect x="${x}" y="136" width="36" height="80" fill="${RED}" ${attrs('#ffffff', 4)}/><path d="M${x} 136 L${x + 36} 216 M${x + 36} 136 L${x} 216" stroke="#ffffff" stroke-width="4"/>`;
  const win = (x) => `<rect x="${x}" y="110" width="24" height="22" fill="#3a2a1a" ${attrs('#ffffff', 3.5)}/><path d="M${x + 12} 110 V132 M${x} 121 H${x + 24}" stroke="#ffffff" stroke-width="2"/>`;
  return svgDoc(240, 220, `
    <rect x="24" y="92" width="192" height="126" fill="${RED}" ${attrs(RED_DARK, 2.5)}/>
    ${boards.join('')}
    <path d="M10 98 L36 46 L120 14 L204 46 L230 98 Z" fill="#6e5a4c" ${attrs('#3e2f26', 2.5)}/>
    <path d="M36 46 L204 46" stroke="#5a4a3e" stroke-width="2"/>
    <path d="M28 98 L44 60 L120 32 L196 60 L212 98 Z" fill="${RED}" ${attrs(RED_DARK, 2)}/>
    <path d="M28 98 L44 60 L120 32 L196 60 L212 98" fill="none" stroke="#ffffff" stroke-width="4" stroke-linejoin="round"/>
    <rect x="102" y="56" width="36" height="32" fill="#3a2a1a" ${attrs('#ffffff', 3.5)}/>
    <path d="M104 88 q6 -10 12 -2 q6 -12 12 -2 q4 -6 8 2 Z" fill="${STRAW}"/>
    ${door(84)}${door(120)}
    ${win(40)}${win(176)}
    <path d="M120 14 V2" stroke="#3e2f26" stroke-width="2"/>
    <path d="M112 2 q4 -4 8 0 q2 -3 6 -1 l-2 4 Z" fill="#3e2f26"/>`);
}

function silo() {
  const rings = [];
  for (let y = 70; y < 246; y += 22) rings.push(`<path d="M12 ${y} H78" stroke="#8fa0a8" stroke-width="2"/>`);
  const rungs = [];
  for (let y = 70; y < 240; y += 12) rungs.push(`<path d="M80 ${y} H90" stroke="#6a7a82" stroke-width="2"/>`);
  return svgDoc(96, 250, `
    <defs><linearGradient id="sl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e3eaee"/><stop offset="0.45" stop-color="#cfd8dc"/><stop offset="1" stop-color="#93a3ab"/></linearGradient></defs>
    <rect x="12" y="46" width="66" height="202" fill="url(#sl)" ${attrs('#5f6f77', 2.5)}/>
    ${rings.join('')}
    <path d="M12 48 Q45 -2 78 48 Z" fill="#9aa8ae" ${attrs('#5f6f77', 2.5)}/>
    <path d="M24 38 Q40 12 52 10" fill="none" stroke="#ffffff" stroke-width="3" opacity="0.6" stroke-linecap="round"/>
    <circle cx="45" cy="14" r="4" fill="#7d8b91"/>
    <path d="M80 60 V246 M90 60 V246" stroke="#6a7a82" stroke-width="2.5"/>
    ${rungs.join('')}
    <rect x="34" y="214" width="22" height="34" fill="#6a4a2a" ${attrs('#3e2a18', 2)}/>`);
}

// Half-timbered farmhouse with a red tiled roof and flower boxes.
function farmhouse() {
  const timber = `<path d="M24 96 H196 M24 150 H196 M24 206 H196 M24 96 V206 M70 96 V206 M150 96 V206 M196 96 V206 M24 96 L70 150 M70 96 L24 150 M150 96 L196 150 M196 96 L150 150 M110 150 V206" fill="none" stroke="${TIMBER}" stroke-width="6" stroke-linecap="square"/>`;
  const win = (x, y) => `<rect x="${x}" y="${y}" width="26" height="28" fill="#cfeaff" ${attrs('#ffffff', 3.5)}/><path d="M${x + 13} ${y} V${y + 28} M${x} ${y + 13} H${x + 26}" stroke="#ffffff" stroke-width="2.5"/>
    <rect x="${x - 8}" y="${y}" width="7" height="28" fill="#4f8a4f" ${attrs('#2f5a2f', 1.5)}/><rect x="${x + 27}" y="${y}" width="7" height="28" fill="#4f8a4f" ${attrs('#2f5a2f', 1.5)}/>
    <rect x="${x - 3}" y="${y + 28}" width="32" height="7" rx="2" fill="#8a5a33"/>
    <circle cx="${x + 4}" cy="${y + 27}" r="3.5" fill="#e53935"/><circle cx="${x + 13}" cy="${y + 26}" r="3.5" fill="#ffd54f"/><circle cx="${x + 22}" cy="${y + 27}" r="3.5" fill="#e53935"/>`;
  return svgDoc(220, 210, `
    <rect x="24" y="96" width="172" height="110" fill="#fbf3e0" ${attrs('#9a8f80', 2)}/>
    ${timber}
    ${win(84, 108)}${win(84, 162)}
    <path d="M160 206 V170 a14 14 0 0 1 28 0 V206 Z" fill="#8a5a33" ${attrs(TIMBER, 2.5)}/>
    <circle cx="182" cy="188" r="2.2" fill="#ffd54f"/>
    <rect x="148" y="16" width="16" height="36" fill="#a0523d" ${attrs('#5a2a1e', 2)}/>
    <path d="M6 102 L110 18 L214 102 L202 108 L110 34 L18 108 Z" fill="#c8553d" ${attrs('#6e2a20', 2.5)}/>
    <path d="M110 34 L18 108 H202 Z" fill="#fbf3e0" ${attrs('#9a8f80', 2)}/>
    <path d="M110 34 V96 M64 72 L110 96 M156 72 L110 96 M40 92 H180" fill="none" stroke="${TIMBER}" stroke-width="5"/>
    <circle cx="110" cy="66" r="9" fill="#cfeaff" ${attrs('#ffffff', 3)}/>`);
}

// Wooden stable; a horse looks out of the half-open door.
function stable() {
  const planks = [];
  for (let x = 22; x < 210; x += 11) planks.push(`<path d="M${x} 66 V168" stroke="#8a5a30" stroke-width="2"/>`);
  return svgDoc(230, 170, `
    <rect x="14" y="62" width="202" height="106" fill="#a8743f" ${attrs('#5a3a1e', 2.5)}/>
    ${planks.join('')}
    <path d="M4 68 L115 14 L226 68 L214 74 L115 28 L16 74 Z" fill="#6f5a3e" ${attrs('#3e2f20', 2.5)}/>
    <path d="M24 66 L115 24 L206 66 Z" fill="#a8743f"/>
    <rect x="98" y="34" width="34" height="26" fill="#3a2a1a" ${attrs('#e8d8b8', 3)}/>
    <path d="M100 60 q6 -8 10 -1 q6 -10 12 -1 q4 -5 8 1 Z" fill="${STRAW}"/>
    <rect x="34" y="96" width="56" height="72" fill="#7a4e28" ${attrs('#e8d8b8', 3)}/>
    <rect x="34" y="96" width="56" height="34" fill="#3a2a1a"/>
    <path d="M34 130 H90 M34 130 L90 168 M90 130 L34 168" stroke="#e8d8b8" stroke-width="3"/>
    <path d="M48 132 Q42 106 54 96 Q62 88 72 92 Q84 98 82 110 L78 116 Q74 124 66 122 L62 132 Z" fill="#8a5230" ${attrs('#4a2a14', 2)}/>
    <path d="M58 94 Q54 86 60 82 L64 92 Z M68 92 L72 82 Q78 86 74 94 Z" fill="#8a5230" ${attrs('#4a2a14', 1.5)}/>
    <path d="M60 96 Q58 104 70 112" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
    <path d="M50 98 Q46 112 50 128" fill="none" stroke="#3a2010" stroke-width="5" stroke-linecap="round"/>
    <circle cx="68" cy="102" r="2" fill="#1b1b1b"/>
    <ellipse cx="78" cy="114" rx="5" ry="4" fill="#6a3a20"/>
    <rect x="140" y="96" width="56" height="72" fill="#7a4e28" ${attrs('#e8d8b8', 3)}/>
    <path d="M140 130 H196 M140 96 L196 130 M196 96 L140 130 M140 130 L196 168 M196 130 L140 168" stroke="#e8d8b8" stroke-width="3"/>`);
}

function chickenCoop() {
  return svgDoc(120, 120, `
    <path d="M28 120 V92 M92 120 V92" stroke="#6b4a2a" stroke-width="6"/>
    <path d="M6 118 L40 92" stroke="#a87444" stroke-width="7" stroke-linecap="round"/>
    <path d="M10 115 L13 113 M18 109 L21 107 M26 103 L29 101" stroke="#6b4a2a" stroke-width="2"/>
    <rect x="22" y="48" width="78" height="46" fill="#d9473a" ${attrs(RED_DARK, 2.5)}/>
    <path d="M22 60 H100 M22 72 H100 M22 84 H100" stroke="#b8341f" stroke-width="1.5"/>
    <path d="M40 94 V76 a10 10 0 0 1 20 0 V94 Z" fill="#3a2a1a"/>
    <path d="M14 52 L61 20 L108 52 Z" fill="#f4efe4" ${attrs('#9a8f80', 2.5)}/>
    <rect x="72" y="58" width="16" height="14" fill="#fff3a0" ${attrs('#ffffff', 2.5)}/>
    <path d="M42 92 q8 -6 16 0" fill="none" stroke="${STRAW}" stroke-width="3"/>`);
}

// ---- Near: wheat, poppies, dandelions ----

function wheatStalks(x0, x1, base, h, seed = 0) {
  const out = [];
  for (let x = x0; x < x1; x += 5) {
    const k = (x * 7 + seed) % 11;
    const top = base - h + k * 1.6;
    const lean = ((x + seed) % 5) - 2;
    out.push(`<path d="M${x} ${base} Q${x + lean} ${f1((base + top) / 2)} ${x + lean * 1.6} ${f1(top + 8)}" fill="none" stroke="${k % 3 ? '#d9b443' : '#c49a32'}" stroke-width="1.8"/>`);
    out.push(`<ellipse cx="${f1(x + lean * 1.7)}" cy="${f1(top + 3)}" rx="2.6" ry="7" fill="${k % 2 ? '#f0cf5a' : '#e3bd47'}" ${attrs('#b8902c', 1)} transform="rotate(${lean * 4} ${f1(x + lean * 1.7)} ${f1(top + 3)})"/>`);
  }
  return out.join('');
}

function wheatTuft() {
  return svgDoc(80, 80, wheatStalks(10, 72, 80, 70, 3));
}

function poppies() {
  const flower = (x, y, s) => `
    <path d="M${x} ${y} Q${x - 3} ${f1(y + 20 * s)} ${x} 70" fill="none" stroke="#5aa944" stroke-width="2.5"/>
    <circle cx="${f1(x - 5 * s)}" cy="${y}" r="${f1(6 * s)}" fill="#e53935"/><circle cx="${f1(x + 5 * s)}" cy="${y}" r="${f1(6 * s)}" fill="#e53935"/>
    <circle cx="${x}" cy="${f1(y - 4 * s)}" r="${f1(6 * s)}" fill="#ef5350"/><circle cx="${x}" cy="${f1(y + 1 * s)}" r="${f1(2.6 * s)}" fill="#2b2b2b"/>`;
  return svgDoc(100, 70, `
    <path d="M14 70 Q20 50 30 44 M84 70 Q80 54 72 48" fill="none" stroke="#5aa944" stroke-width="3"/>
    ${flower(24, 30, 1)}${flower(50, 22, 1.15)}${flower(76, 34, 0.9)}
    <circle cx="38" cy="50" r="4" fill="#4a7bd1"/><circle cx="62" cy="54" r="3.5" fill="#4a7bd1"/>`);
}

function dandelions() {
  const puff = [];
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI * 2) / 12;
    puff.push(`<path d="M66 22 L${f1(66 + Math.cos(a) * 10)} ${f1(22 + Math.sin(a) * 10)}" stroke="#ffffff" stroke-width="1.2"/><circle cx="${f1(66 + Math.cos(a) * 10)}" cy="${f1(22 + Math.sin(a) * 10)}" r="1.6" fill="#ffffff"/>`);
  }
  return svgDoc(90, 60, `
    <path d="M24 60 Q22 44 26 30 M66 60 Q68 44 66 24 M44 60 Q46 50 46 40" fill="none" stroke="#5aa944" stroke-width="2.5"/>
    <path d="M8 60 Q14 46 30 50 Q20 54 22 60 Z M60 60 Q74 44 84 52 Q74 54 76 60 Z" fill="#62bb44"/>
    <circle cx="26" cy="28" r="7" fill="#ffd23f" ${attrs('#d9a520', 1.5)}/><circle cx="46" cy="38" r="5.5" fill="#ffd23f" ${attrs('#d9a520', 1.5)}/>
    ${puff.join('')}`);
}

// ---- Strips: wheat field and paddock fence ----

function wheatStrip() {
  return svgDoc(160, 90, `${wheatStalks(-2, 162, 90, 76, 1)}${wheatStalks(1, 160, 90, 64, 5)}`);
}

function paddockFence() {
  return svgDoc(160, 70, `
    <path d="M0 22 H160 M0 38 H160 M0 54 H160" stroke="${WOOD}" stroke-width="8" stroke-linecap="round"/>
    <path d="M0 22 H160 M0 38 H160 M0 54 H160" stroke="#b07a46" stroke-width="4" stroke-linecap="round"/>
    <rect x="10" y="10" width="12" height="60" rx="3" fill="#8a5a33" ${attrs(WOOD, 2.5)}/>
    <rect x="90" y="10" width="12" height="60" rx="3" fill="#8a5a33" ${attrs(WOOD, 2.5)}/>`);
}

// ---- Things Frankie can bump into or stand on ----

// Round hay bale lying on its side, seen a little from the front.
function haybale() {
  const straw = [];
  for (let y = 10; y < 50; y += 6) straw.push(`<path d="M${24 + (y % 4)} ${y} H${50 - Math.abs(y - 28) * 0.3}" stroke="${STRAW_LINE}" stroke-width="1.4" opacity="0.6"/>`);
  return svgDoc(64, 56, `
    <path d="M22 4 H44 Q60 4 60 28 Q60 52 44 52 H22 Z" fill="${STRAW_DARK}" ${line()}/>
    ${straw.join('')}
    <path d="M36 5 Q40 28 36 51 M48 6 Q53 28 48 50" fill="none" stroke="#7a4e28" stroke-width="2"/>
    <ellipse cx="22" cy="28" rx="17" ry="24" fill="${STRAW}" ${line()}/>
    <ellipse cx="22" cy="28" rx="11" ry="16" fill="none" stroke="${STRAW_DARK}" stroke-width="2.2"/>
    <ellipse cx="22" cy="28" rx="5.5" ry="8" fill="none" stroke="${STRAW_DARK}" stroke-width="2"/>
    <path d="M22 28 l2 -2" stroke="${STRAW_LINE}" stroke-width="2" stroke-linecap="round"/>
    <path d="M8 12 l-4 -3 M5 26 l-4 0 M7 42 l-4 3 M16 6 l-1 -4" stroke="${STRAW_DARK}" stroke-width="2" stroke-linecap="round"/>`);
}

function milkcan() {
  return svgDoc(40, 54, `
    <defs><linearGradient id="mc" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c3ccd3"/><stop offset="0.35" stop-color="#f1f4f6"/><stop offset="1" stop-color="#8e9aa3"/></linearGradient></defs>
    <path d="M7 18 Q4 22 4 26 L5 50 Q5 52 8 52 H32 Q35 52 35 50 L36 26 Q36 22 33 18 Z" fill="url(#mc)" ${line()}/>
    <path d="M13 18 V10 H27 V18 Z" fill="url(#mc)" ${line(2.5)}/>
    <rect x="10" y="5" width="20" height="6" rx="2" fill="#b9c3ca" ${line(2.5)}/>
    <circle cx="20" cy="4" r="2.6" fill="#b9c3ca" ${line(2)}/>
    <path d="M5 30 H35" stroke="#4a7bd1" stroke-width="4"/>
    <path d="M4 22 q-4 4 0 8 M36 22 q4 4 0 8" fill="none" ${line(2.5)}/>
    <path d="M12 26 V46" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" opacity="0.8"/>`);
}

// White hen with a red comb, looking left; two frames for walking.
function chicken(step) {
  const legs = step ? [[24, 18], [32, 37]] : [[24, 23], [32, 32]];
  const head = step ? 3 : 0;
  return svgDoc(54, 52, `
    ${legs.map(([x, fx]) => `<path d="M${x} 38 L${fx} 49 M${fx - 4} 49.5 H${fx + 4}" fill="none" ${line(5)}/><path d="M${x} 38 L${fx} 49 M${fx - 4} 49.5 H${fx + 4}" fill="none" stroke="#f2a93a" stroke-width="2.4" stroke-linecap="round"/>`).join('')}
    <path d="M40 14 Q48 4 52 8 Q50 14 46 18 Q52 12 54 18 Q50 24 44 24 Z" fill="#f4efe4" ${line(2.5)}/>
    <path d="M14 ${28 + head} Q12 16 24 14 Q36 12 44 20 Q50 28 44 35 Q38 41 28 41 Q16 41 14 ${28 + head} Z" fill="#ffffff" ${line()}/>
    <path d="M26 24 Q36 20 40 28 Q34 34 26 30 Z" fill="#ece6da" ${line(2)}/>
    <g transform="translate(0 ${head})">
      <path d="M9 7 q2 -6 5 -2 q2 -5 5 -1 q3 -4 4 2 Z" fill="#e53935" ${line(2)}/>
      <circle cx="15" cy="15" r="8.5" fill="#ffffff" ${line()}/>
      <path d="M7 14 L1 17 L7 19 Z" fill="#f2b632" ${line(2)}/>
      <path d="M9 20 q-1 6 3 6 q3 -2 1 -6 Z" fill="#e53935" ${line(1.8)}/>
      <circle cx="13" cy="13" r="1.9" fill="#1b120b"/>
    </g>`);
}

// Green frog: sitting, and stretched out while it hops.
function frog(jumping) {
  const eyes = (y) => `
    <circle cx="16" cy="${y}" r="6.5" fill="#6cc04a" ${line(2.5)}/><circle cx="31" cy="${y}" r="6.5" fill="#6cc04a" ${line(2.5)}/>
    <circle cx="16" cy="${y}" r="4" fill="#ffffff"/><circle cx="31" cy="${y}" r="4" fill="#ffffff"/>
    <circle cx="15" cy="${y + 0.5}" r="2.1" fill="#1b120b"/><circle cx="30" cy="${y + 0.5}" r="2.1" fill="#1b120b"/>`;
  if (jumping) {
    return svgDoc(48, 44, `
      <path d="M14 30 Q6 36 4 44 M34 30 Q42 36 44 44" fill="none" ${line(6)}/>
      <path d="M14 30 Q6 36 4 44 M34 30 Q42 36 44 44" fill="none" stroke="#5cb03c" stroke-width="3" stroke-linecap="round"/>
      <path d="M12 20 Q2 14 4 6 M36 20 Q46 14 44 6" fill="none" ${line(5)}/>
      <path d="M12 20 Q2 14 4 6 M36 20 Q46 14 44 6" fill="none" stroke="#5cb03c" stroke-width="2.4" stroke-linecap="round"/>
      <ellipse cx="24" cy="24" rx="15" ry="11" fill="#6cc04a" ${line()}/>
      <ellipse cx="24" cy="28" rx="9" ry="5.5" fill="#c9eb9a"/>
      ${eyes(13)}
      <path d="M18 22 Q24 27 30 22" fill="none" ${line(2)}/>`);
  }
  return svgDoc(48, 44, `
    <ellipse cx="9" cy="36" rx="8" ry="6" fill="#5cb03c" ${line(2.5)}/><ellipse cx="39" cy="36" rx="8" ry="6" fill="#5cb03c" ${line(2.5)}/>
    <path d="M4 26 Q4 16 24 16 Q44 16 44 26 Q44 40 24 40 Q4 40 4 26 Z" fill="#6cc04a" ${line()}/>
    <ellipse cx="24" cy="32" rx="12" ry="6" fill="#c9eb9a"/>
    <path d="M17 41 h-4 M35 41 h-4" fill="none" ${line(4)}/>
    <circle cx="12" cy="26" r="1.6" fill="#3f8a2a"/><circle cx="37" cy="27" r="1.4" fill="#3f8a2a"/><circle cx="33" cy="22" r="1.2" fill="#3f8a2a"/>
    ${eyes(14)}
    <path d="M15 26 Q24 32 33 26" fill="none" ${line(2)}/>
    <circle cx="11" cy="28" r="2" fill="#ff9e8a" opacity="0.7"/><circle cx="37" cy="29" r="2" fill="#ff9e8a" opacity="0.7"/>`);
}

// One wooden crate of a floating block path; an apple is painted on the side.
function blockCrate() {
  return svgDoc(48, 32, `
    <rect x="1.5" y="1.5" width="45" height="29" rx="3" fill="#d9a560"/>
    <rect x="1.5" y="1.5" width="45" height="8" rx="3" fill="#e9bd78"/>
    <path d="M1.5 10 H46.5 M1.5 20.5 H46.5" stroke="#a8692a" stroke-width="2"/>
    <path d="M8 3 V29 M40 3 V29" stroke="#b97a38" stroke-width="3"/>
    <circle cx="24" cy="18" r="5" fill="#e53935" opacity="0.85"/><path d="M24 13 q1 -3 3 -3" fill="none" stroke="#5a3a22" stroke-width="1.5"/>
    <path d="M26 12 q3 -2 5 0 q-3 2 -5 0 Z" fill="#5aa944"/>
    <path d="M6 5 H42" stroke="#f6d49a" stroke-width="2" stroke-linecap="round"/>
    <rect x="1.5" y="1.5" width="45" height="29" rx="3" fill="none" ${line()}/>`);
}

// Ditch with muddy water: middle part (tiles sideways) and the left bank (mirrored for the right).
function gapFarmMid() {
  return svgDoc(64, 80, `
    <defs>
      <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5e3d22"/><stop offset="1" stop-color="#3a2414"/></linearGradient>
      <linearGradient id="mud" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9a9a5a"/><stop offset="1" stop-color="#5a5530"/></linearGradient>
    </defs>
    <rect width="64" height="80" fill="url(#wall)"/>
    <path d="M10 8 q4 10 0 18 M46 6 q-4 12 2 22" fill="none" stroke="#2e1c10" stroke-width="2" opacity="0.6"/>
    <rect y="30" width="64" height="50" fill="url(#mud)"/>
    <rect y="30" width="64" height="3" fill="#c8c890"/>
    <circle cx="10" cy="34" r="2.5" fill="#7cc24a"/><circle cx="16" cy="35" r="2" fill="#62a83a"/><circle cx="42" cy="34" r="2.6" fill="#7cc24a"/><circle cx="50" cy="35.5" r="2" fill="#62a83a"/>
    <path d="M24 50 Q30 47 36 50 M8 64 Q14 61 20 64 M44 70 Q50 68 56 70" fill="none" stroke="#c8c890" stroke-width="2" stroke-linecap="round" opacity="0.7"/>`);
}

function gapFarmBank() {
  return svgDoc(18, 80, `
    <path d="M4 10 Q10 30 8 52 Q10 66 6 80 H18 V8 Z" fill="#6a4226"/>
    <path d="M0 0 H18 V12 Q16 18 12 14 Q8 12 0 13 Z" fill="#4e9a35"/>
    <rect width="18" height="11" fill="#74c24f"/>
    <path d="M17 6 Q11 28 13 50 Q15 66 11 80" fill="none" ${line()}/>
    <path d="M18 4 Q15 12 11 13" fill="none" ${line(2.5)}/>`);
}

const PIECES = {
  'hills-far-farm': [GAME_WIDTH, 220, fieldsFar],
  'hills-near-farm': [GAME_WIDTH, 140, meadowNear],
  'ground-farm': [256, 80, groundFarm],
  cow: [150, 100 + LIFT, cow],
  sheep: [110, 80 + LIFT, sheep],
  tractor: [200, 150, tractor],
  scarecrow: [110, 190, scarecrow],
  barn: [240, 220, barn],
  silo: [96, 250, silo],
  farmhouse: [220, 210, farmhouse],
  stable: [230, 170, stable],
  'chicken-coop': [120, 120, chickenCoop],
  'wheat-tuft': [80, 80, wheatTuft],
  poppies: [100, 70, poppies],
  dandelions: [90, 60, dandelions],
  'wheat-strip': [160, 90, wheatStrip],
  'paddock-fence': [160, 70, paddockFence],
  haybale: [64, 56, haybale],
  milkcan: [40, 54, milkcan],
  chicken: [54, 52, () => chicken(0)],
  'chicken-2': [54, 52, () => chicken(1)],
  frog: [48, 44, () => frog(false)],
  'frog-jump': [48, 44, () => frog(true)],
  'block-crate': [48, 32, blockCrate],
  'gap-farm-mid': [64, 80, gapFarmMid],
  'gap-farm-bank': [18, 80, gapFarmBank],
};

export function farmSvgs() {
  return Object.fromEntries(Object.entries(PIECES).map(([key, [w, h, draw]]) => [key, { w, h, svg: draw() }]));
}

export function preloadFarm(scene) {
  for (const [key, { w, h, svg }] of Object.entries(farmSvgs())) loadSvg(scene, key, svg, w, h);
}

export function createFarmAnims(scene) {
  scene.anims.create({ key: 'chicken-walk', frames: [{ key: 'chicken' }, { key: 'chicken-2' }], frameRate: 8, repeat: -1 });
}
