import { GAME_WIDTH } from '../config.js';
import { loadSvg, svgDoc } from './svg.js';

// Landscape pieces as SVG: sky, hills, trees, garden, meadow and village.
// Background outlines are softer than Frankie's, so he stays the eye-catcher.

const WOOD = '#5a3a1e';
const LEAF_LINE = '#2f5f2c';

const attrs = (color, w = 2.5) => `stroke="${color}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

// A leafy crown from circles: thick outline pass, base colour, shade and light.
function crown(circles, { line = LEAF_LINE, base = '#4f9e3f', shade = '#3f8a35', light = '#6dbb4f', dots = '#8fd36a' } = {}) {
  const outline = circles.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${line}" stroke="${line}" stroke-width="6"/>`);
  const fills = circles.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${base}"/>`);
  const shades = circles.map(([x, y, r]) => `<circle cx="${x + r * 0.25}" cy="${y + r * 0.3}" r="${r * 0.62}" fill="${shade}" opacity="0.7"/>`);
  const lights = circles.map(([x, y, r]) => `<circle cx="${x - r * 0.3}" cy="${y - r * 0.32}" r="${r * 0.45}" fill="${light}"/>`);
  const sparkle = circles.map(([x, y, r]) => `<circle cx="${x - r * 0.45}" cy="${y - r * 0.45}" r="${Math.max(2, r * 0.12)}" fill="${dots}"/>`);
  return [...outline, ...fills, ...shades, ...lights, ...sparkle].join('');
}

function sun() {
  return svgDoc(220, 220, `
    <defs>
      <radialGradient id="glow"><stop offset="0" stop-color="#fffbe0" stop-opacity="0.95"/><stop offset="0.28" stop-color="#fff1a8" stop-opacity="0.6"/>
        <stop offset="0.6" stop-color="#ffe27a" stop-opacity="0.18"/><stop offset="1" stop-color="#ffe27a" stop-opacity="0"/></radialGradient>
      <radialGradient id="core" cx="0.42" cy="0.4" r="0.62"><stop offset="0" stop-color="#fffef5"/><stop offset="0.45" stop-color="#fff0a0"/><stop offset="1" stop-color="#ffcb45"/></radialGradient>
    </defs>
    <circle cx="110" cy="110" r="110" fill="url(#glow)"/>
    <circle cx="110" cy="110" r="40" fill="url(#core)"/>`);
}

function sunRays() {
  const rays = [];
  for (let i = 0; i < 18; i++) {
    const a = (Math.PI * 2 * i) / 18;
    const len = i % 2 ? 120 : 155;
    const w = 0.07;
    const p = (r, d) => `${(170 + Math.cos(a + d) * r).toFixed(1)},${(170 + Math.sin(a + d) * r).toFixed(1)}`;
    rays.push(`<polygon points="${p(46, -w)} ${p(len, 0)} ${p(46, w)}"/>`);
  }
  return svgDoc(340, 340, `
    <defs><radialGradient id="r" gradientUnits="userSpaceOnUse" cx="170" cy="170" r="165">
      <stop offset="0.25" stop-color="#fff6c4" stop-opacity="0.55"/><stop offset="1" stop-color="#fff6c4" stop-opacity="0"/></radialGradient></defs>
    <g fill="url(#r)">${rays.join('')}</g>`);
}

function cloud(x, y, s) {
  const puffs = [[-52, 12, 28], [-24, -8, 38], [18, -20, 44], [56, -4, 32], [84, 12, 22]];
  const shapes = puffs.map(([dx, dy, r]) => `<circle cx="${x + dx * s}" cy="${y + dy * s}" r="${r * s}"/>`).join('');
  return `
    <ellipse cx="${x + 14 * s}" cy="${y + 30 * s}" rx="${92 * s}" ry="${10 * s}" fill="#c6d8ea" opacity="0.45"/>
    <g fill="url(#cl)">${shapes}<rect x="${x - 74 * s}" y="${y}" width="${170 * s}" height="${28 * s}" rx="${14 * s}"/></g>
    <circle cx="${x + 6 * s}" cy="${y - 30 * s}" r="${16 * s}" fill="#fff"/>`;
}

function clouds() {
  return svgDoc(GAME_WIDTH, 180, `
    <defs><linearGradient id="cl" x1="0" y1="0" x2="0" y2="1"><stop offset="0.3" stop-color="#ffffff"/><stop offset="1" stop-color="#dce8f4"/></linearGradient></defs>
    ${cloud(130, 70, 0.9)}${cloud(390, 110, 0.65)}${cloud(620, 60, 1)}${cloud(855, 115, 0.6)}`);
}

// Tileable wave line: every wave repeats a whole number of times across the width.
function ridge(w, base, waves, step = 8) {
  const pts = [];
  for (let x = 0; x <= w; x += step) {
    let y = base;
    for (const [amp, k, ph = 0] of waves) y -= amp * Math.sin((2 * Math.PI * k * x) / w + ph);
    pts.push([x, y]);
  }
  return pts;
}

function ridgeY(pts, x) {
  const i = Math.min(pts.length - 1, Math.round(x / 8));
  return pts[i][1];
}

function hillsFar() {
  const w = GAME_WIDTH;
  const back = ridge(w, 95, [[30, 1], [14, 3, 1]]);
  const front = ridge(w, 130, [[22, 2, 2], [9, 5]]);
  const poly = (pts) => `M0 220 ${pts.map(([x, y]) => `L${x} ${y.toFixed(1)}`).join(' ')} L${w} 220 Z`;
  const trees = [];
  for (let x = 30; x < w - 20; x += 46 + ((x * 7) % 30)) {
    const y = ridgeY(front, x);
    trees.push(`<rect x="${x - 1.5}" y="${y - 6}" width="3" height="8" fill="#7a9a6a"/><circle cx="${x}" cy="${y - 12}" r="${7 + (x % 5)}" fill="#86b778"/>`);
  }
  return svgDoc(w, 220, `
    <defs>
      <linearGradient id="hb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c3e2c6"/><stop offset="1" stop-color="#a9d3a4"/></linearGradient>
      <linearGradient id="hf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a8d995"/><stop offset="1" stop-color="#93cb7e"/></linearGradient>
    </defs>
    <path d="${poly(back)}" fill="url(#hb)"/>
    ${trees.join('')}
    <path d="${poly(front)}" fill="url(#hf)"/>`);
}

function hillsNear() {
  const w = GAME_WIDTH;
  const top = ridge(w, 40, [[16, 2, 0.5], [8, 3]]);
  const poly = `M0 140 ${top.map(([x, y]) => `L${x} ${y.toFixed(1)}`).join(' ')} L${w} 140 Z`;
  const flowers = [];
  for (let x = 20; x < w - 10; x += 37) {
    const y = ridgeY(top, x) + 18 + ((x * 13) % 60);
    const c = ['#ffffff', '#ffe066', '#ff9ec4', '#c9a7ff'][x % 4];
    flowers.push(`<circle cx="${x}" cy="${y}" r="2.6" fill="${c}"/>`);
  }
  const stripes = ridge(w, 75, [[10, 2, 1.2]]);
  return svgDoc(w, 140, `
    <defs><linearGradient id="hn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#93d46c"/><stop offset="1" stop-color="#78c257"/></linearGradient></defs>
    <path d="${poly}" fill="url(#hn)"/>
    <path d="M0 ${stripes[0][1]} ${stripes.map(([x, y]) => `L${x} ${y.toFixed(1)}`).join(' ')}" fill="none" stroke="#a5dc80" stroke-width="10" opacity="0.5"/>
    ${flowers.join('')}`);
}

function ground() {
  const w = 256;
  const stones = [[30, 50, 7], [95, 66, 5], [150, 44, 8], [210, 62, 6], [60, 74, 4], [182, 76, 4]];
  const blades = [];
  for (let x = 4; x < w; x += 9) {
    const h = 6 + ((x * 7) % 7);
    blades.push(`<path d="M${x} 14 L${x + 2.5} ${14 - h} L${x + 5} 14 Z" fill="${x % 2 ? '#79d156' : '#5fbe41'}"/>`);
  }
  const edge = ridge(w, 18, [[2.5, 8]], 4)
    .reverse()
    .map(([x, y]) => `L${x} ${y.toFixed(1)}`)
    .join(' ');
  return svgDoc(w, 80, `
    <defs><linearGradient id="soil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a87444"/><stop offset="1" stop-color="#83552f"/></linearGradient></defs>
    <rect width="${w}" height="80" fill="url(#soil)"/>
    ${stones.map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r * 1.3}" ry="${r}" fill="#8f8a83"/><ellipse cx="${x - r * 0.3}" cy="${y - r * 0.35}" rx="${r * 0.6}" ry="${r * 0.35}" fill="#b9b4ac"/>`).join('')}
    <path d="M70 30 q10 8 4 18 M190 28 q-8 10 2 20" fill="none" stroke="#6b4325" stroke-width="2" opacity="0.6"/>
    <path d="M0 0 H${w} ${edge} Z" fill="#4a9e30"/>
    <rect width="${w}" height="12" fill="#6cc94a"/>
    ${blades.join('')}
    <circle cx="40" cy="7" r="2.5" fill="#fff"/><circle cx="168" cy="6" r="2.5" fill="#ffe066"/>`);
}

function trunk(x, top, bottom, w) {
  return `<path d="M${x - w} ${bottom} L${x - w * 0.7} ${top} L${x + w * 0.7} ${top} L${x + w} ${bottom} Z" fill="#8a5a33" ${attrs(WOOD, 3)}/>
    <path d="M${x - 3} ${bottom - 20} v-30 M${x + 4} ${bottom - 45} v-25" stroke="#6b4325" stroke-width="2" stroke-linecap="round"/>`;
}

function oak() {
  return svgDoc(220, 260, `
    ${trunk(110, 120, 258, 15)}
    <path d="M104 160 L80 128 M118 150 L140 124" ${attrs(WOOD, 7)}/>
    <path d="M104 160 L80 128 M118 150 L140 124" stroke="#8a5a33" stroke-width="3.5" stroke-linecap="round"/>
    ${crown([[58, 112, 40], [100, 74, 52], [152, 82, 48], [176, 122, 36], [132, 126, 42], [82, 138, 34], [116, 40, 36]])}`);
}

function appleTree() {
  const apples = [[70, 95], [120, 70], [150, 110], [95, 125], [135, 140], [60, 130], [165, 80], [105, 100]];
  return svgDoc(210, 230, `
    ${trunk(105, 140, 228, 13)}
    ${crown([[62, 110, 38], [100, 78, 48], [146, 92, 44], [120, 132, 38], [78, 140, 30], [160, 132, 28]], { base: '#5aa944', light: '#7cc95a' })}
    ${apples.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6.5" fill="#e53935" ${attrs('#8b1d1d', 2)}/><circle cx="${x - 2}" cy="${y - 2}" r="1.8" fill="#fff" opacity="0.8"/>`).join('')}`);
}

function birch() {
  const marks = [[60, 230, 10], [66, 200, 7], [58, 172, 9], [65, 150, 6], [60, 128, 8]];
  return svgDoc(130, 260, `
    <path d="M56 258 L58 110 L70 110 L74 258 Z" fill="#f4f1e8" ${attrs('#5b5b5b', 2.5)}/>
    ${marks.map(([x, y, w]) => `<path d="M${x} ${y} h${w}" stroke="#3a3a3a" stroke-width="3" stroke-linecap="round"/>`).join('')}
    ${crown([[40, 120, 26], [64, 88, 34], [92, 118, 28], [64, 140, 24], [66, 50, 28], [36, 80, 22], [96, 78, 22]], { base: '#86c95a', shade: '#6fb04a', light: '#a6dd78', dots: '#c3ec9c', line: '#3f7a2a' })}`);
}

function pine() {
  const layer = (y, w, h) => `<path d="M60 ${y - h} L${60 + w} ${y} L${60 - w} ${y} Z" fill="#2f7a4a" ${attrs('#1f4f31', 3)}/>
    <path d="M60 ${y - h} L${60 - w} ${y} L${60 - w * 0.2} ${y} Z" fill="#3f9a5a"/>`;
  return svgDoc(120, 240, `
    <rect x="53" y="190" width="14" height="48" fill="#7a4e2c" ${attrs(WOOD, 2.5)}/>
    ${layer(200, 54, 70)}${layer(160, 46, 64)}${layer(120, 38, 58)}${layer(82, 28, 52)}`);
}

function shed() {
  const planks = [40, 60, 80, 100, 120, 140, 160].map((x) => `<path d="M${x} 66 V168" stroke="#a8692a" stroke-width="2"/>`).join('');
  return svgDoc(200, 172, `
    <rect x="20" y="62" width="160" height="108" fill="#d39a5a" ${attrs(WOOD, 3)}/>
    ${planks}
    <rect x="36" y="88" width="42" height="36" fill="#bfe3ff" ${attrs('#fffaf0', 5)}/>
    <path d="M57 88 V124 M36 106 H78" stroke="#fffaf0" stroke-width="4"/>
    <rect x="34" y="86" width="46" height="40" fill="none" ${attrs(WOOD, 2)}/>
    <rect x="110" y="96" width="50" height="74" fill="#a8692a" ${attrs(WOOD, 3)}/>
    <path d="M114 100 L156 166 M114 100 H156 M114 166 H156" stroke="#7a4a1c" stroke-width="4" stroke-linecap="round"/>
    <circle cx="150" cy="134" r="3" fill="#ffd54f"/>
    <path d="M4 70 L100 8 L196 70 L184 76 L100 24 L16 76 Z" fill="#8b3a2e" ${attrs('#4e1f18', 3)}/>
    <path d="M30 60 L100 16 M50 66 L100 34 M170 60 L100 16" stroke="#6e2a20" stroke-width="2" opacity="0.6"/>
    <path d="M86 150 h22 l-4 20 h-14 Z" fill="#c8553d" ${attrs('#6e2a20', 2)}/>
    <circle cx="92" cy="146" r="6" fill="#ff6b9a"/><circle cx="102" cy="144" r="6" fill="#ffd54f"/><circle cx="97" cy="138" r="5" fill="#fff"/>`);
}

function fence() {
  const pickets = [8, 48, 88, 128]
    .map((x) => `<path d="M${x} 78 V18 L${x + 12} 4 L${x + 24} 18 V78 Z" fill="#fffaf0" ${attrs('#7a6a5a', 2.5)}/><path d="M${x + 18} 20 V76" stroke="#e3dccd" stroke-width="5"/>`)
    .join('');
  return svgDoc(160, 80, `
    <rect x="0" y="28" width="160" height="10" fill="#efe6d6" ${attrs('#7a6a5a', 2)}/>
    <rect x="0" y="56" width="160" height="10" fill="#efe6d6" ${attrs('#7a6a5a', 2)}/>
    ${pickets}`);
}

function tulips() {
  const colors = ['#e53935', '#ffd54f', '#ff6b9a', '#e53935', '#ff9800', '#ff6b9a', '#ffd54f'];
  const flowers = colors
    .map((c, i) => {
      const x = 22 + i * 22;
      const y = 22 + (i % 2) * 10;
      return `<path d="M${x} 66 Q${x - 2} ${y + 20} ${x} ${y + 8}" fill="none" stroke="#3f8a35" stroke-width="3"/>
        <ellipse cx="${x - 6}" cy="${y + 34}" rx="4" ry="10" transform="rotate(-25 ${x - 6} ${y + 34})" fill="#5aa944"/>
        <path d="M${x - 8} ${y} Q${x - 9} ${y + 12} ${x} ${y + 12} Q${x + 9} ${y + 12} ${x + 8} ${y} L${x + 4} ${y + 5} L${x} ${y - 2} L${x - 4} ${y + 5} Z" fill="${c}" ${attrs('#7a2a1a', 1.8)}/>`;
    })
    .join('');
  return svgDoc(180, 80, `
    <ellipse cx="90" cy="72" rx="86" ry="10" fill="#7a4e2c"/>
    <ellipse cx="90" cy="69" rx="80" ry="6" fill="#8f5d35"/>
    ${flowers}`);
}

function sunflower() {
  const petals = [];
  for (let i = 0; i < 14; i++) {
    const a = (360 / 14) * i;
    petals.push(`<ellipse cx="40" cy="20" rx="5.5" ry="13" transform="rotate(${a} 40 34)" fill="#ffcc33" ${attrs('#c48a12', 1.5)}/>`);
  }
  return svgDoc(80, 170, `
    <path d="M40 168 Q36 110 40 46" fill="none" stroke="#3f8a35" stroke-width="5" stroke-linecap="round"/>
    <path d="M39 110 Q18 92 10 104 Q22 118 39 112 Z M41 88 Q62 70 70 82 Q58 96 41 90 Z" fill="#5aa944" ${attrs('#2f5f2c', 2)}/>
    ${petals.join('')}
    <circle cx="40" cy="34" r="12" fill="#6b3e1f" ${attrs('#3a2010', 2)}/>
    <circle cx="36" cy="31" r="1.6" fill="#8b5a2b"/><circle cx="43" cy="30" r="1.6" fill="#8b5a2b"/><circle cx="40" cy="37" r="1.6" fill="#8b5a2b"/>`);
}

function bush() {
  const flowers = [[40, 38, '#ff6b9a'], [78, 26, '#fff'], [112, 40, '#ffd54f'], [60, 56, '#c9a7ff'], [100, 62, '#fff'], [134, 58, '#ff6b9a']];
  return svgDoc(170, 92, `
    ${crown([[38, 62, 28], [70, 44, 34], [108, 46, 32], [136, 64, 26], [86, 70, 26]], { base: '#4caf50', shade: '#3f9a43', light: '#66c56b', dots: '#8ad88d', line: '#2e6b30' })}
    ${flowers.map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="4.5" fill="${c}"/><circle cx="${x}" cy="${y}" r="1.6" fill="#ffb300"/>`).join('')}`);
}

function pond() {
  const reeds = [[30, 70], [40, 64], [48, 72], [282, 66], [292, 72], [272, 74]]
    .map(([x, y]) => `<path d="M${x} 90 Q${x - 2} ${y + 10} ${x + 1} ${y - 20}" fill="none" stroke="#4f8a35" stroke-width="3" stroke-linecap="round"/><rect x="${x - 2.5}" y="${y - 30}" width="6" height="16" rx="3" fill="#7a4e2c"/>`)
    .join('');
  const stones = [[50, 52], [80, 44], [120, 40], [200, 40], [240, 45], [270, 54]]
    .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="12" ry="7" fill="#9e9a92" ${attrs('#6b675f', 2)}/>`)
    .join('');
  return svgDoc(320, 92, `
    <defs><linearGradient id="w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc6ff"/><stop offset="1" stop-color="#3d8fd6"/></linearGradient></defs>
    ${stones}
    <ellipse cx="160" cy="66" rx="140" ry="24" fill="url(#w)" ${attrs('#2f6fa8', 2.5)}/>
    <path d="M90 62 Q110 58 130 62 M180 72 Q200 68 220 72" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity="0.7"/>
    <path d="M110 70 a12 7 0 1 0 10 -6 l-8 4 Z" fill="#5aa944" ${attrs('#2f5f2c', 1.5)}/>
    <path d="M200 60 a10 6 0 1 0 8 -5 l-7 3 Z" fill="#5aa944" ${attrs('#2f5f2c', 1.5)}/>
    <circle cx="206" cy="58" r="4" fill="#ff9ec4"/><circle cx="206" cy="58" r="1.6" fill="#ffd54f"/>
    ${reeds}`);
}

function rock() {
  return svgDoc(90, 52, `
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b8b3aa"/><stop offset="1" stop-color="#8c877f"/></linearGradient></defs>
    <path d="M6 50 C4 30 18 12 40 10 C62 8 84 24 86 50 Z" fill="url(#g)" ${attrs('#5f5b54', 2.5)}/>
    <path d="M24 22 Q36 16 46 18" fill="none" stroke="#dcd8d0" stroke-width="3" stroke-linecap="round"/>
    <path d="M56 30 l6 8 l-3 7" fill="none" stroke="#6f6a62" stroke-width="2"/>`);
}

function mushrooms() {
  const shroom = (x, s) => `
    <rect x="${x - 6 * s}" y="${50 - 22 * s}" width="${12 * s}" height="${22 * s}" rx="${4 * s}" fill="#fff6e8" ${attrs('#8a7a6a', 2)}/>
    <path d="M${x - 20 * s} ${50 - 20 * s} Q${x} ${50 - 50 * s} ${x + 20 * s} ${50 - 20 * s} Z" fill="#e53935" ${attrs('#7a1a1a', 2)}/>
    <circle cx="${x - 7 * s}" cy="${50 - 30 * s}" r="${3 * s}" fill="#fff"/><circle cx="${x + 6 * s}" cy="${50 - 34 * s}" r="${2.5 * s}" fill="#fff"/><circle cx="${x + 12 * s}" cy="${50 - 25 * s}" r="${2 * s}" fill="#fff"/>`;
  return svgDoc(80, 52, `${shroom(28, 1)}${shroom(58, 0.7)}`);
}

function grassTuft() {
  const blades = [[10, 30], [20, 10], [30, 22], [40, 4], [50, 18], [60, 8], [70, 26], [80, 16]]
    .map(([x, top], i) => `<path d="M${x - 5} 60 Q${x} ${top + 20} ${x + (i % 2 ? 6 : -6)} ${top} Q${x + 2} ${top + 22} ${x + 5} 60 Z" fill="${i % 2 ? '#5fbe41' : '#79d156'}"/>`)
    .join('');
  return svgDoc(90, 60, blades);
}

function daisies() {
  const flower = (x, y) => {
    const petals = [];
    for (let i = 0; i < 8; i++) petals.push(`<ellipse cx="${x}" cy="${y - 5}" rx="2.4" ry="5" transform="rotate(${i * 45} ${x} ${y})" fill="#fff"/>`);
    return `<path d="M${x} ${y} V50" stroke="#4f9e3f" stroke-width="2"/>${petals.join('')}<circle cx="${x}" cy="${y}" r="3" fill="#ffc107"/>`;
  };
  return svgDoc(120, 52, `
    <ellipse cx="60" cy="48" rx="58" ry="6" fill="#5fbe41"/>
    ${flower(18, 30)}${flower(40, 22)}${flower(62, 32)}${flower(84, 20)}${flower(104, 30)}`);
}

function windmill() {
  return svgDoc(140, 260, `
    <path d="M36 260 L52 70 L88 70 L104 260 Z" fill="#eef1f4" ${attrs('#6b7280', 2.5)}/>
    <path d="M42 200 H98 M46 150 H94 M49 110 H91" stroke="#c9ced6" stroke-width="3"/>
    <path d="M60 260 V228 a10 10 0 0 1 20 0 V260 Z" fill="#8a5a33"/>
    <rect x="63" y="160" width="14" height="18" rx="2" fill="#7fb2d9"/>
    <rect x="64" y="104" width="12" height="14" rx="2" fill="#7fb2d9"/>
    <path d="M44 74 Q70 36 96 74 Z" fill="#b44a3a" ${attrs('#6e2a20', 2.5)}/>`);
}

function windmillBlades() {
  const blade = (a) => `<g transform="rotate(${a} 80 80)">
      <rect x="76" y="6" width="8" height="74" fill="#a0a7b2"/>
      <rect x="84" y="10" width="18" height="62" fill="#f7f7f2" ${attrs('#8a909a', 1.5)}/>
      <path d="M84 24 H102 M84 40 H102 M84 56 H102" stroke="#c9ced6" stroke-width="1.5"/>
    </g>`;
  return svgDoc(160, 160, `${[0, 90, 180, 270].map(blade).join('')}<circle cx="80" cy="80" r="7" fill="#6b7280"/>`);
}

function house(wall, roof, w, h, round = false) {
  const roofTop = 20;
  const wallTop = 80;
  const tiles = [];
  for (let y = wallTop - 12; y > roofTop + 10; y -= 12) tiles.push(`<path d="M0 ${y} H${w}" stroke="#000" stroke-opacity="0.15" stroke-width="2"/>`);
  const win = (x, y) => `
    <rect x="${x}" y="${y}" width="34" height="34" fill="#cfeaff" ${attrs('#ffffff', 5)}/>
    <path d="M${x + 17} ${y} V${y + 34} M${x} ${y + 17} H${x + 34}" stroke="#fff" stroke-width="3"/>
    <path d="M${x} ${y} Q${x + 8} ${y + 14} ${x + 4} ${y + 34} L${x} ${y + 34} Z M${x + 34} ${y} Q${x + 26} ${y + 14} ${x + 30} ${y + 34} L${x + 34} ${y + 34} Z" fill="#ff8a80"/>
    <rect x="${x - 3}" y="${y + 34}" width="40" height="8" fill="#8a5a33"/>
    <circle cx="${x + 6}" cy="${y + 32}" r="4" fill="#ff6b9a"/><circle cx="${x + 17}" cy="${y + 31}" r="4" fill="#ffd54f"/><circle cx="${x + 28}" cy="${y + 32}" r="4" fill="#ff6b9a"/>`;
  return svgDoc(w, h, `
    <rect x="${w * 0.66}" y="${roofTop + 6}" width="18" height="40" fill="#a0523d" ${attrs('#5a2a1e', 2.5)}/>
    <rect x="${w * 0.08}" y="${wallTop}" width="${w * 0.84}" height="${h - wallTop - 2}" fill="${wall}" ${attrs('#5a4030', 3)}/>
    <defs><clipPath id="roof"><path d="M${w * 0.02} ${wallTop + 4} L${w / 2} ${roofTop} L${w * 0.98} ${wallTop + 4} Z"/></clipPath></defs>
    <path d="M${w * 0.02} ${wallTop + 4} L${w / 2} ${roofTop} L${w * 0.98} ${wallTop + 4} Z" fill="${roof}" ${attrs('#4e1f18', 3)}/>
    <g clip-path="url(#roof)">${tiles.join('')}</g>
    ${round ? `<circle cx="${w / 2}" cy="${wallTop - 18}" r="11" fill="#cfeaff" ${attrs('#fff', 4)}/>` : ''}
    ${win(w * 0.16, wallTop + 22)}
    <rect x="${w * 0.58}" y="${h - 72}" width="38" height="70" rx="4" fill="#7a4a1c" ${attrs('#4e2f12', 2.5)}/>
    <circle cx="${w * 0.58 + 30}" cy="${h - 36}" r="3" fill="#ffd54f"/>`);
}

function church() {
  return svgDoc(150, 260, `
    <rect x="70" y="150" width="76" height="108" fill="#e6dccd" ${attrs('#8a7f70', 2)}/>
    <path d="M64 154 L108 116 L150 154 Z" fill="#b5675a" ${attrs('#7a4038', 2)}/>
    <rect x="18" y="80" width="52" height="178" fill="#efe6d8" ${attrs('#8a7f70', 2)}/>
    <path d="M12 84 L44 4 L76 84 Z" fill="#7d8f9e" ${attrs('#56636e', 2)}/>
    <circle cx="44" cy="110" r="14" fill="#fff" ${attrs('#8a7f70', 2)}/>
    <path d="M44 110 V100 M44 110 H52" stroke="#56636e" stroke-width="2" stroke-linecap="round"/>
    <path d="M34 200 v-20 a10 10 0 0 1 20 0 v20 Z M98 210 v-16 a8 8 0 0 1 16 0 v16 Z" fill="#9fb8cc"/>`);
}

function lamp() {
  return svgDoc(50, 180, `
    <rect x="21" y="40" width="8" height="136" fill="#2f4f3f" ${attrs('#1f332a', 2)}/>
    <rect x="13" y="168" width="24" height="10" rx="3" fill="#2f4f3f"/>
    <path d="M10 40 L14 14 H36 L40 40 Z" fill="#fff3b0" ${attrs('#1f332a', 2.5)}/>
    <path d="M8 16 L25 4 L42 16 Z" fill="#2f4f3f" ${attrs('#1f332a', 2)}/>`);
}

function hedge() {
  return svgDoc(200, 80, `
    ${crown([[24, 46, 24], [62, 38, 28], [102, 40, 28], [142, 38, 28], [178, 46, 24]], { base: '#3f9a43', shade: '#2f7f35', light: '#58b45c', dots: '#7ccd7f', line: '#245a28' })}
    <rect x="2" y="50" width="196" height="30" fill="#3f9a43"/>`);
}

function butterfly() {
  return svgDoc(40, 32, `
    <ellipse cx="11" cy="11" rx="10" ry="9" fill="#ff9800" ${attrs('#5a2a0a', 1.5)}/>
    <ellipse cx="29" cy="11" rx="10" ry="9" fill="#ff9800" ${attrs('#5a2a0a', 1.5)}/>
    <ellipse cx="13" cy="24" rx="7" ry="6" fill="#ffd54f" ${attrs('#5a2a0a', 1.5)}/>
    <ellipse cx="27" cy="24" rx="7" ry="6" fill="#ffd54f" ${attrs('#5a2a0a', 1.5)}/>
    <circle cx="10" cy="10" r="3" fill="#fff"/><circle cx="30" cy="10" r="3" fill="#fff"/>
    <rect x="18.5" y="6" width="3" height="22" rx="1.5" fill="#3a2010"/>`);
}

function bird() {
  return svgDoc(34, 16, `<path d="M2 6 Q9 0 17 9 Q25 0 32 6" fill="none" stroke="#4a5560" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>`);
}

const PIECES = {
  sun: [220, 220, sun],
  'sun-rays': [340, 340, sunRays],
  clouds: [GAME_WIDTH, 180, clouds],
  'hills-far': [GAME_WIDTH, 220, hillsFar],
  'hills-near': [GAME_WIDTH, 140, hillsNear],
  ground: [256, 80, ground],
  'tree-oak': [220, 260, oak],
  'tree-apple': [210, 230, appleTree],
  'tree-birch': [130, 260, birch],
  'tree-pine': [120, 240, pine],
  shed: [200, 172, shed],
  fence: [160, 80, fence],
  tulips: [180, 80, tulips],
  sunflower: [80, 170, sunflower],
  bush: [170, 92, bush],
  pond: [320, 92, pond],
  rock: [90, 52, rock],
  mushrooms: [80, 52, mushrooms],
  'grass-tuft': [90, 60, grassTuft],
  daisies: [120, 52, daisies],
  windmill: [140, 260, windmill],
  'windmill-blades': [160, 160, windmillBlades],
  'house-a': [230, 220, () => house('#ffe0a3', '#c8553d', 230, 220)],
  'house-b': [200, 210, () => house('#cfe3f0', '#8b5a3c', 200, 210, true)],
  church: [150, 260, church],
  lamp: [50, 180, lamp],
  hedge: [200, 80, hedge],
  butterfly: [40, 32, butterfly],
  bird: [34, 16, bird],
};

export function scenerySvgs() {
  return Object.fromEntries(Object.entries(PIECES).map(([key, [w, h, draw]]) => [key, { w, h, svg: draw() }]));
}

export function preloadScenery(scene) {
  for (const [key, { w, h, svg }] of Object.entries(scenerySvgs())) loadSvg(scene, key, svg, w, h);
}
