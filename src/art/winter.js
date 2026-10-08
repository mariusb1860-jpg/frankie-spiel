import { GAME_WIDTH } from '../config.js';
import { OUTLINE, loadSvg, svgDoc } from './svg.js';
import { WOOD, attrs, crown, ridge, ridgeY } from './scenery.js';

// Level 5: winter: a snowy forest, a frozen lake and a village in the snow.
// Background pieces have soft outlines; everything Frankie can touch (snowman,
// snowball, hare, ice blocks, ice hole) gets the strong dark outline.

const line = (w = 3) => attrs(OUTLINE, w);
const f1 = (n) => n.toFixed(1);
const SNOW_SHADE = '#dbe8f5';
const SNOW_LINE = '#9fb6cc';
const FIR = '#2f6447';
const FIR_DARK = '#1f4a33';
const FIR_LIGHT = '#3f7f58';

const polygon = (pts, w, h) => `M0 ${h} ${pts.map(([x, y]) => `L${x} ${f1(y)}`).join(' ')} L${w} ${h} Z`;

// Snow lying on top of something: a white band with a wavy lower edge from x0 to x1.
function snowCap(x0, x1, y, depth = 7, line2 = SNOW_LINE) {
  const n = Math.max(2, Math.round((x1 - x0) / 14));
  const step = (x1 - x0) / n;
  let d = `M${f1(x0 - 2)} ${f1(y + depth * 0.6)} Q${f1(x0)} ${f1(y - 3)} ${f1(x0 + step / 2)} ${f1(y - 2)} L${f1(x1 - step / 2)} ${f1(y - 2)} Q${f1(x1)} ${f1(y - 3)} ${f1(x1 + 2)} ${f1(y + depth * 0.6)}`;
  for (let i = n; i > 0; i--) {
    const xa = x0 + step * i;
    const xb = x0 + step * (i - 1);
    d += ` Q${f1((xa + xb) / 2)} ${f1(y + depth * (i % 2 ? 1.3 : 0.9))} ${f1(xb)} ${f1(y + depth * 0.6)}`;
  }
  return `<path d="${d} Z" fill="#ffffff" ${attrs(line2, 1.5)}/>`;
}

// ---- Background tiles: mountains, snowy meadow, snow on frozen soil ----

function mountainsFar() {
  const w = GAME_WIDTH;
  // Peaks at fixed places, so the tile repeats seamlessly (same height at 0 and at the width).
  const peaks = [[0, 46], [120, 74], [230, 24], [350, 66], [470, 34], [590, 78], [700, 20], [830, 60], [960, 46]];
  const pts = [];
  const caps = [];
  for (let i = 0; i < peaks.length - 1; i++) {
    const [x1, y1] = peaks[i];
    const [x2, y2] = peaks[i + 1];
    pts.push([x1, y1], [(x1 + x2) / 2, Math.max(y1, y2) + 34]);
  }
  pts.push(peaks[peaks.length - 1]);
  for (const [x, y] of peaks) {
    const s = 0.55 + (110 - y) / 160;
    caps.push(`<path d="M${x} ${y} L${f1(x - 34 * s)} ${f1(y + 30 * s)} L${f1(x - 22 * s)} ${f1(y + 24 * s)} L${f1(x - 12 * s)} ${f1(y + 34 * s)} L${f1(x - 2 * s)} ${f1(y + 25 * s)} L${f1(x + 10 * s)} ${f1(y + 36 * s)} L${f1(x + 20 * s)} ${f1(y + 26 * s)} L${f1(x + 34 * s)} ${f1(y + 30 * s)} Z" fill="#ffffff"/>`);
  }
  const front = ridge(w, 134, [[12, 2, 1.1], [6, 5, 0.4]]);
  const firs = [];
  for (let x = 12; x < w - 12; x += 17 + ((x * 7) % 11)) {
    const y = ridgeY(front, x);
    const h = 16 + ((x * 13) % 12);
    firs.push(`<path d="M${x} ${f1(y - h)} L${x + 6} ${f1(y + 3)} L${x - 6} ${f1(y + 3)} Z" fill="#6f9a86"/><path d="M${x} ${f1(y - h)} L${x + 2.5} ${f1(y - h + 7)} L${x - 2.5} ${f1(y - h + 7)} Z" fill="#ffffff"/>`);
  }
  return svgDoc(w, 220, `
    <defs>
      <linearGradient id="mt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a7bed6"/><stop offset="1" stop-color="#c6d6e7"/></linearGradient>
      <linearGradient id="hf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f8fc"/><stop offset="1" stop-color="#dce7f2"/></linearGradient>
    </defs>
    <path d="${polygon(pts, w, 220)}" fill="url(#mt)"/>
    ${caps.join('')}
    ${firs.join('')}
    <path d="${polygon(front, w, 220)}" fill="url(#hf)"/>`);
}

function snowNear() {
  const w = GAME_WIDTH;
  const top = ridge(w, 46, [[12, 2, 0.6], [6, 3, 1.4]]);
  const drifts = [];
  for (let x = 30; x < w - 60; x += 110 + ((x * 7) % 40)) {
    const y = ridgeY(top, x) + 22 + ((x * 3) % 30);
    drifts.push(`<path d="M${x} ${y} q20 -6 40 0" fill="none" stroke="#c9d9ea" stroke-width="3" stroke-linecap="round" opacity="0.8"/>`);
  }
  const twigs = [];
  for (let x = 50; x < w - 40; x += 130 + ((x * 11) % 50)) {
    const y = ridgeY(top, x) + 10;
    twigs.push(`<path d="M${x} ${y} l-6 -14 M${x} ${y} l2 -18 M${x} ${y} l8 -12" fill="none" stroke="#8a7a6a" stroke-width="2" stroke-linecap="round"/>`);
  }
  const sparkles = [];
  for (let x = 20; x < w - 10; x += 33) sparkles.push(`<circle cx="${x}" cy="${f1(ridgeY(top, x) + 14 + ((x * 13) % 60))}" r="1.6" fill="#ffffff"/>`);
  return svgDoc(w, 140, `
    <defs><linearGradient id="sn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbfdff"/><stop offset="1" stop-color="#e3edf7"/></linearGradient></defs>
    <path d="${polygon(top, w, 140)}" fill="url(#sn)"/>
    <path d="M${top.map(([x, y]) => `${x} ${f1(y + 4)}`).join(' L')}" fill="none" stroke="#d3e1ef" stroke-width="4" opacity="0.7"/>
    ${drifts.join('')}${twigs.join('')}${sparkles.join('')}`);
}

// Frankie's path: thick snow on top (it bulges over the edge), frozen soil below.
function groundWinter() {
  const w = 256;
  const stones = [[40, 58, 6], [120, 70, 5], [184, 52, 7], [236, 68, 4]];
  const edge = [];
  for (let x = 256; x > 0; x -= 32) edge.push(`Q${x - 16} ${x % 64 ? 24 : 20} ${x - 32} 17`);
  const sparkles = [[20, 6], [70, 9], [112, 5], [160, 8], [214, 6], [244, 10]].map(([x, y]) => `<path d="M${x} ${y - 2.5} L${x + 1.2} ${y} L${x} ${y + 2.5} L${x - 1.2} ${y} Z" fill="#bfe3ff"/>`);
  return svgDoc(w, 80, `
    <defs>
      <linearGradient id="soil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7b675b"/><stop offset="1" stop-color="#5a4a41"/></linearGradient>
      <linearGradient id="snow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="0.6" stop-color="#f2f7fc"/><stop offset="1" stop-color="#d4e3f1"/></linearGradient>
    </defs>
    <rect width="${w}" height="80" fill="url(#soil)"/>
    ${stones.map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${f1(r * 1.3)}" ry="${r}" fill="#8f8a88"/><ellipse cx="${f1(x - r * 0.3)}" cy="${f1(y - r * 0.35)}" rx="${f1(r * 0.6)}" ry="${f1(r * 0.35)}" fill="#c9d3dc"/>`).join('')}
    <path d="M66 40 q10 8 4 18 M200 36 q-8 10 2 20" fill="none" stroke="#4a3a32" stroke-width="2" opacity="0.6"/>
    <path d="M0 0 H${w} V17 ${edge.join(' ')} Z" fill="url(#snow)"/>
    <rect width="${w}" height="3" fill="#ffffff"/>
    ${sparkles.join('')}`);
}

// ---- Trees, houses and more ----

// Fir with snow lying on every layer of branches.
function firSnow() {
  const tiers = [];
  for (let i = 0; i < 6; i++) {
    const bottom = 262 - i * 40;
    const hw = 70 - i * 11;
    const top = bottom - 74;
    // Snow covers the upper part of the layer; the layer above hides most of it,
    // so a white band with a wavy lower edge stays visible on each layer.
    const k = 0.66;
    const sy = top + 74 * k;
    const n = 4;
    let snow = `M75 ${top} L${f1(75 + hw * k)} ${f1(sy)}`;
    for (let s = n; s > 0; s--) {
      const xa = 75 - hw * k + ((2 * hw * k) / n) * s;
      const xb = 75 - hw * k + ((2 * hw * k) / n) * (s - 1);
      snow += ` Q${f1((xa + xb) / 2)} ${f1(sy + 7)} ${f1(xb)} ${f1(sy)}`;
    }
    tiers.push(`<path d="M75 ${top} L${75 + hw} ${bottom} Q75 ${bottom + 8} ${75 - hw} ${bottom} Z" fill="${FIR}" ${attrs(FIR_DARK, 2.5)}/>
      <path d="M75 ${top + 6} L${f1(75 - hw + 8)} ${bottom - 2} L${f1(75 - hw * 0.25)} ${bottom - 4} Z" fill="${FIR_LIGHT}"/>
      <path d="${snow} Z" fill="#ffffff" ${attrs(SNOW_LINE, 1.2)}/>`);
  }
  return svgDoc(150, 300, `
    <rect x="68" y="250" width="14" height="48" fill="#7a4e2c" ${attrs(WOOD, 2.5)}/>
    ${tiers.join('')}`);
}

// Bare winter tree with snow along its branches.
function bareTree() {
  const branches = 'M90 236 C88 190 86 150 90 110 M90 150 C70 130 50 120 30 100 M90 128 C110 108 130 100 152 86 M90 110 C84 80 80 60 72 36 M90 112 C100 84 108 64 120 44 M60 118 C54 104 50 92 44 80 M126 98 C134 88 142 76 146 62 M78 70 C70 60 62 52 52 46';
  return svgDoc(180, 240, `
    <path d="M80 238 L84 140 L96 140 L100 238 Z" fill="#6b5446" ${attrs('#4a382e', 2.5)}/>
    <path d="${branches}" fill="none" stroke="#5e4a3e" stroke-width="7" stroke-linecap="round"/>
    <path d="${branches}" fill="none" stroke="#7a6252" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M30 98 C50 116 70 126 88 146 M152 84 C130 98 110 106 92 124 M72 34 C80 58 84 78 90 106 M120 42 C108 62 100 82 92 108" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" transform="translate(0 -4)"/>
    <ellipse cx="90" cy="236" rx="30" ry="5" fill="#ffffff"/>`);
}

// Log cabin with a thick snowy roof, warm windows and smoke from the chimney.
function cabin() {
  const logs = [];
  for (let row = 0, y = 104; y < 176; row++, y += 12) logs.push(`<rect x="24" y="${y}" width="172" height="12" rx="6" fill="${row % 2 ? '#9a6a3e' : '#a87648'}" ${attrs('#5e3b20', 1.5)}/>`);
  return svgDoc(220, 180, `
    <circle cx="160" cy="18" r="9" fill="#eef2f6" opacity="0.8"/><circle cx="172" cy="8" r="6" fill="#eef2f6" opacity="0.6"/>
    <rect x="150" y="30" width="18" height="40" fill="#8a7a72" ${attrs('#5a4a42', 2)}/>
    ${logs.join('')}
    <rect x="40" y="116" width="40" height="32" fill="#ffd56a" ${attrs('#5e3b20', 3)}/>
    <path d="M60 116 V148 M40 132 H80" stroke="#5e3b20" stroke-width="2.5"/>
    <rect x="150" y="118" width="30" height="58" fill="#7a4a24" ${attrs('#4a2a14', 2.5)}/>
    <circle cx="165" cy="136" r="7" fill="none" stroke="#3f8a52" stroke-width="4"/><circle cx="165" cy="130" r="1.8" fill="#e53935"/>
    <path d="M8 108 L110 40 L212 108 Z" fill="#7a4e2c" ${attrs('#4a2f1c', 2.5)}/>
    <path d="M2 110 Q6 98 18 100 L110 34 L202 100 Q214 98 218 110 Q200 118 182 112 Q160 120 140 112 Q120 120 100 112 Q80 120 60 112 Q40 120 24 112 Q12 118 2 110 Z" fill="#ffffff" ${attrs(SNOW_LINE, 2)}/>
    ${snowCap(148, 170, 30, 5)}`);
}

// Frozen pond: ice with skate tracks, snowy stones and reeds.
function icePond() {
  const reeds = [[30, 70], [40, 64], [282, 66], [292, 72]]
    .map(([x, y]) => `<path d="M${x} 90 Q${x - 2} ${y + 10} ${x + 1} ${y - 20}" fill="none" stroke="#8a7a52" stroke-width="3" stroke-linecap="round"/><rect x="${x - 2.5}" y="${y - 30}" width="6" height="16" rx="3" fill="#6b4a2a"/><ellipse cx="${x + 0.5}" cy="${y - 31}" rx="4" ry="2.5" fill="#ffffff"/>`)
    .join('');
  const stones = [[52, 52], [84, 44], [236, 44], [268, 54]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="12" ry="7" fill="#a6a9ad" ${attrs('#76797d', 2)}/><ellipse cx="${x}" cy="${y - 4}" rx="10" ry="3.5" fill="#ffffff"/>`).join('');
  return svgDoc(320, 92, `
    <defs><linearGradient id="ice" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e6f7ff"/><stop offset="1" stop-color="#a8daf2"/></linearGradient></defs>
    ${stones}
    <ellipse cx="160" cy="66" rx="140" ry="24" fill="url(#ice)" ${attrs('#7fb6d6', 2.5)}/>
    <path d="M90 64 Q130 56 170 66 T250 64 M110 74 Q150 68 200 76" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" opacity="0.9"/>
    <path d="M60 60 L80 56 M230 72 L246 70" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
    ${reeds}`);
}

// Village house with snow on the roof, icicles and warm light in the windows.
function snowHouse(wall, roof, w, h) {
  const wallTop = 84;
  const eave = wallTop + 4;
  const apexY = 22;
  // The snow covers the roof down to a wavy line a little above the eaves.
  const k = 0.78;
  const sy = apexY + (eave - apexY) * k;
  const sx0 = w / 2 - (w * 0.48) * k;
  const sx1 = w / 2 + (w * 0.48) * k;
  const waves = [];
  for (let i = 6; i > 0; i--) {
    const xa = sx0 + ((sx1 - sx0) / 6) * i;
    const xb = sx0 + ((sx1 - sx0) / 6) * (i - 1);
    waves.push(`Q${f1((xa + xb) / 2)} ${f1(sy + 9)} ${f1(xb)} ${f1(sy)}`);
  }
  const icicles = [];
  for (let x = w * 0.12; x < w * 0.9; x += 17) icicles.push(`<path d="M${f1(x)} ${eave + 1} l3 ${9 + (Math.round(x) % 3) * 3} l3 ${-(9 + (Math.round(x) % 3) * 3)} Z" fill="#e6f6ff" ${attrs('#9fc6dc', 1)}/>`);
  const win = (x, y) => `<rect x="${f1(x)}" y="${y}" width="32" height="32" fill="#ffd56a" ${attrs('#ffffff', 4.5)}/><path d="M${f1(x + 16)} ${y} V${y + 32} M${f1(x)} ${y + 16} H${f1(x + 32)}" stroke="#ffffff" stroke-width="3"/>${snowCap(x - 3, x + 35, y + 33, 4)}`;
  return svgDoc(w, h, `
    <rect x="${w * 0.66}" y="16" width="18" height="44" fill="#a0523d" ${attrs('#5a2a1e', 2.5)}/>
    ${snowCap(w * 0.66 - 1, w * 0.66 + 19, 16, 5)}
    <rect x="${w * 0.08}" y="${wallTop}" width="${w * 0.84}" height="${h - wallTop - 2}" fill="${wall}" ${attrs('#5a4030', 3)}/>
    <path d="M${w * 0.02} ${eave} L${w / 2} ${apexY} L${w * 0.98} ${eave} Z" fill="${roof}" ${attrs('#4e1f18', 3)}/>
    <path d="M${w / 2} ${apexY - 5} L${f1(sx1 + 3)} ${f1(sy)} ${waves.join(' ')} L${f1(sx0 - 3)} ${f1(sy)} Z" fill="#ffffff" ${attrs(SNOW_LINE, 2)}/>
    ${icicles.join('')}
    ${win(w * 0.13, wallTop + 20)}${win(w * 0.13, wallTop + 74)}
    <rect x="${w * 0.58}" y="${h - 72}" width="38" height="70" rx="4" fill="#7a4a1c" ${attrs('#4e2f12', 2.5)}/>
    <circle cx="${w * 0.58 + 19}" cy="${h - 52}" r="9" fill="none" stroke="#3f8a52" stroke-width="5"/><circle cx="${w * 0.58 + 19}" cy="${h - 60}" r="2.5" fill="#e53935"/>
    <circle cx="${w * 0.58 + 30}" cy="${h - 34}" r="3" fill="#ffd54f"/>`);
}

function churchSnow() {
  return svgDoc(150, 260, `
    <rect x="70" y="150" width="76" height="108" fill="#e6dccd" ${attrs('#8a7f70', 2)}/>
    <path d="M64 154 L108 116 L150 154 Z" fill="#b5675a" ${attrs('#7a4038', 2)}/>
    <path d="M62 156 L108 112 L152 156 Q130 162 108 156 Q86 162 62 156 Z" fill="#ffffff"/>
    <rect x="18" y="80" width="52" height="178" fill="#efe6d8" ${attrs('#8a7f70', 2)}/>
    <path d="M12 84 L44 4 L76 84 Z" fill="#7d8f9e" ${attrs('#56636e', 2)}/>
    <path d="M44 4 L33 32 Q38 36 44 32 Q50 37 55 32 Z" fill="#ffffff" ${attrs(SNOW_LINE, 1.2)}/>
    <path d="M10 86 L16 70 Q30 76 44 70 Q58 76 72 70 L78 86 Q62 92 44 86 Q26 92 10 86 Z" fill="#ffffff" ${attrs(SNOW_LINE, 1.2)}/>
    <circle cx="44" cy="110" r="14" fill="#fff" ${attrs('#8a7f70', 2)}/>
    <path d="M44 110 V100 M44 110 H52" stroke="#56636e" stroke-width="2" stroke-linecap="round"/>
    <path d="M34 200 v-20 a10 10 0 0 1 20 0 v20 Z M98 210 v-16 a8 8 0 0 1 16 0 v16 Z" fill="#ffd56a"/>`);
}

// Decorated Christmas tree with lights and a star.
function xmasTree() {
  const tiers = [[214, 62], [170, 50], [128, 38], [90, 27]];
  const balls = [[48, 200, '#e53935'], [92, 196, '#ffd23f'], [70, 160, '#4a7bd1'], [104, 152, '#e53935'], [56, 124, '#ffd23f'], [86, 112, '#e53935'], [72, 86, '#4a7bd1'], [40, 172, '#ffffff'], [110, 184, '#4a7bd1']];
  return svgDoc(150, 250, `
    <rect x="66" y="210" width="18" height="38" fill="#7a4e2c" ${attrs(WOOD, 2.5)}/>
    ${tiers.map(([y, hw]) => `<path d="M75 ${y - 66} L${75 + hw} ${y} L${75 - hw} ${y} Z" fill="${FIR}" ${attrs(FIR_DARK, 2.5)}/><path d="M75 ${y - 66} L${75 - hw} ${y} L${f1(75 - hw * 0.25)} ${y} Z" fill="${FIR_LIGHT}"/>`).join('')}
    <path d="M30 196 Q75 176 122 192 M38 158 Q75 140 112 154 M48 120 Q75 104 102 116" fill="none" stroke="#ffe680" stroke-width="2" stroke-dasharray="2 7" stroke-linecap="round"/>
    ${balls.map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="5.5" fill="${c}" ${attrs('#5a2a1e', 1.2)}/><circle cx="${x - 1.5}" cy="${y - 1.5}" r="1.5" fill="#ffffff" opacity="0.8"/>`).join('')}
    <path d="M75 8 L80 20 L93 20 L83 28 L87 41 L75 33 L63 41 L67 28 L57 20 L70 20 Z" fill="#ffd23f" ${attrs('#b08a1a', 2)}/>`);
}

function lampSnow() {
  return svgDoc(60, 180, `
    <circle cx="30" cy="27" r="22" fill="#fff3b0" opacity="0.35"/>
    <rect x="26" y="40" width="8" height="136" fill="#2f4f3f" ${attrs('#1f332a', 2)}/>
    <rect x="18" y="168" width="24" height="10" rx="3" fill="#2f4f3f"/>
    <path d="M15 40 L19 14 H41 L45 40 Z" fill="#fff3b0" ${attrs('#1f332a', 2.5)}/>
    <path d="M13 16 L30 4 L47 16 Z" fill="#2f4f3f" ${attrs('#1f332a', 2)}/>
    <path d="M12 16 Q20 6 30 3 Q40 6 48 16 Q40 13 30 14 Q20 13 12 16 Z" fill="#ffffff"/>`);
}

// ---- Near: snowy bushes, rocks, reeds and holly ----

function snowBush() {
  return svgDoc(150, 84, `
    ${crown([[36, 58, 26], [66, 40, 30], [102, 42, 30], [126, 60, 22], [80, 64, 24]], { base: '#3f7f52', shade: '#2f6a44', light: '#4f9a62', dots: '#6fb47e', line: '#24503a' })}
    <path d="M14 46 Q20 28 40 30 Q50 14 70 16 Q90 10 104 20 Q124 22 130 40 Q120 34 108 36 Q96 28 84 32 Q70 26 58 34 Q44 30 34 40 Q24 38 14 46 Z" fill="#ffffff" ${attrs(SNOW_LINE, 1.5)}/>`);
}

function snowRock() {
  return svgDoc(110, 60, `
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a9adb3"/><stop offset="1" stop-color="#7e8288"/></linearGradient></defs>
    <path d="M6 58 C4 36 22 14 50 12 C78 10 104 30 104 58 Z" fill="url(#g)" ${attrs('#5f6268', 2.5)}/>
    <path d="M14 30 C26 12 56 4 82 14 C96 20 100 30 100 34 C90 28 80 30 70 26 C60 32 50 26 40 30 C30 26 22 32 14 30 Z" fill="#ffffff" ${attrs(SNOW_LINE, 1.5)}/>`);
}

function snowReeds() {
  const reeds = [[20, 18], [32, 8], [46, 14], [58, 4], [72, 12]];
  return svgDoc(90, 80, `
    ${reeds.map(([x, y]) => `<path d="M${x} 80 Q${x - 3} ${y + 30} ${x + 2} ${y + 14}" fill="none" stroke="#a89a6a" stroke-width="3" stroke-linecap="round"/><rect x="${x - 1}" y="${y}" width="6" height="16" rx="3" fill="#7a5a32"/><ellipse cx="${x + 2}" cy="${y}" rx="4" ry="2.5" fill="#ffffff"/>`).join('')}
    <ellipse cx="45" cy="78" rx="42" ry="6" fill="#ffffff"/>`);
}

function holly() {
  const leaf = (x, y, a) => `<path d="M0 0 q6 -6 12 -2 q4 -6 10 -2 q4 4 10 2 q-4 8 -10 4 q-6 6 -12 2 q-6 2 -10 -4 Z" transform="translate(${x} ${y}) rotate(${a})" fill="#2f7a46" ${attrs('#1f4a33', 1.5)}/>`;
  return svgDoc(100, 60, `
    ${leaf(14, 44, -20)}${leaf(46, 40, 10)}${leaf(52, 30, -50)}${leaf(30, 30, -150)}
    <circle cx="46" cy="38" r="5" fill="#e53935" ${attrs('#8a1a1a', 1.2)}/><circle cx="54" cy="42" r="5" fill="#e53935" ${attrs('#8a1a1a', 1.2)}/><circle cx="50" cy="33" r="5" fill="#e53935" ${attrs('#8a1a1a', 1.2)}/>
    <path d="M6 56 Q30 44 54 50 Q74 44 96 56 Z" fill="#ffffff"/>`);
}

// ---- Strip: snowy picket fence ----

function snowFence() {
  const pickets = [8, 48, 88, 128]
    .map((x) => `<path d="M${x} 70 V18 L${x + 12} 6 L${x + 24} 18 V70 Z" fill="#8a5a33" ${attrs(WOOD, 2.5)}/><path d="M${x - 1} 18 L${x + 12} 4 L${x + 25} 18 Q${x + 12} 14 ${x - 1} 18 Z" fill="#ffffff"/>`)
    .join('');
  return svgDoc(160, 72, `
    <rect x="0" y="28" width="160" height="10" fill="#a87444" ${attrs(WOOD, 2)}/>
    <rect x="0" y="52" width="160" height="10" fill="#a87444" ${attrs(WOOD, 2)}/>
    ${pickets}
    <path d="M0 28 Q20 22 40 27 Q60 22 80 27 Q100 22 120 27 Q140 22 160 28 Z M0 52 Q20 47 40 51 Q60 47 80 51 Q100 47 120 51 Q140 47 160 52 Z" fill="#ffffff"/>`);
}

// ---- Things Frankie can bump into or stand on ----

// Snowman looking at Frankie, with a red scarf and a carrot nose.
function snowman() {
  return svgDoc(56, 78, `
    <path d="M12 34 L1 24 M4 27 L1 21 M44 34 L55 22 M52 25 L56 20" fill="none" stroke="#6b4a2a" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="28" cy="58" r="18" fill="#ffffff" ${line()}/>
    <path d="M14 66 Q28 76 42 66" fill="none" stroke="${SNOW_SHADE}" stroke-width="4" stroke-linecap="round"/>
    <circle cx="28" cy="30" r="13" fill="#ffffff" ${line()}/>
    <path d="M14 40 Q28 46 42 40 L42 45 Q28 51 14 45 Z" fill="#e53935" ${line(2.5)}/>
    <path d="M36 44 L40 58 L34 58 L31 46 Z" fill="#e53935" ${line(2)}/>
    <path d="M18 44 V48 M24 46 V50 M30 46 V50" stroke="#ffffff" stroke-width="1.6"/>
    <circle cx="28" cy="54" r="2" fill="#2b2b2b"/><circle cx="28" cy="62" r="2" fill="#2b2b2b"/>
    <circle cx="22.5" cy="27" r="2" fill="#1b1b1b"/><circle cx="31" cy="27" r="2" fill="#1b1b1b"/>
    <path d="M24 31 L12 33.5 L24 35 Z" fill="#f2862a" ${line(1.8)}/>
    <path d="M22 37 q5 3 10 0" fill="none" stroke="#1b1b1b" stroke-width="1.8" stroke-linecap="round"/>
    <rect x="17" y="17" width="22" height="4" rx="1.5" fill="#2b2b2b" ${line(2)}/>
    <rect x="20" y="3" width="16" height="15" rx="1.5" fill="#2b2b2b" ${line(2)}/>
    <rect x="20" y="13" width="16" height="3" fill="#e53935"/>`);
}

// Big snowball; the lumps show that it turns while rolling.
function snowball() {
  return svgDoc(46, 46, `
    <defs><radialGradient id="sb" cx="0.38" cy="0.32" r="0.75"><stop offset="0" stop-color="#ffffff"/><stop offset="0.6" stop-color="#eef4fa"/><stop offset="1" stop-color="#c3d5e7"/></radialGradient></defs>
    <circle cx="23" cy="23" r="19.5" fill="url(#sb)" ${line()}/>
    <path d="M12 16 q4 -3 8 0 M28 30 q4 -3 8 0 M16 32 q3 -2 6 0 M30 12 q3 -2 6 1" fill="none" stroke="#b3c7db" stroke-width="2" stroke-linecap="round"/>
    <circle cx="21" cy="24" r="2" fill="#c9d8e8"/><circle cx="33" cy="21" r="1.6" fill="#c9d8e8"/>`);
}

// Brown hare with a white tail, looking left: sitting, and stretched out while hopping.
function hare(jumping) {
  if (jumping) {
    // Moved down a little, so the body sits where it sits in the sitting picture.
    return svgDoc(54, 48, `<g transform="translate(0 8)">
      <path d="M38 30 L52 38 M14 30 L4 36" fill="none" ${line(6)}/>
      <path d="M38 30 L52 38 M14 30 L4 36" fill="none" stroke="#a5805e" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="44" cy="22" rx="5" ry="4.5" fill="#ffffff" ${line(2)}/>
      <path d="M8 22 Q10 12 26 12 Q42 12 44 22 Q42 32 26 32 Q12 32 8 22 Z" fill="#b08866" ${line()}/>
      <ellipse cx="22" cy="26" rx="9" ry="4.5" fill="#f2e2cc"/>
      <path d="M14 13 Q20 2 32 2 Q28 8 18 15 Z" fill="#b08866" ${line(2.5)}/>
      <path d="M12 16 Q16 6 26 4 Q24 10 16 17 Z" fill="#c99a78" ${line(2.5)}/>
      <circle cx="12" cy="18" r="1.9" fill="#1b120b"/>
      <circle cx="6.5" cy="21" r="1.6" fill="#f08a9a"/></g>`);
  }
  return svgDoc(54, 48, `
    <ellipse cx="42" cy="34" rx="5.5" ry="5" fill="#ffffff" ${line(2)}/>
    <path d="M14 46 Q8 40 14 30 Q20 20 32 22 Q44 24 44 36 Q44 46 34 46 Z" fill="#b08866" ${line()}/>
    <ellipse cx="34" cy="44" rx="9" ry="4" fill="#9a7454" ${line(2)}/>
    <ellipse cx="22" cy="38" rx="7" ry="6" fill="#f2e2cc"/>
    <path d="M16 46 h6 M22 46 h6" fill="none" ${line(3)}/>
    <path d="M18 22 Q12 2 18 0 Q24 4 22 20 Z" fill="#b08866" ${line(2.5)}/>
    <path d="M24 22 Q26 2 32 2 Q36 8 28 22 Z" fill="#b08866" ${line(2.5)}/>
    <path d="M19 18 Q16 6 18 3 M27 19 Q29 8 31 5" fill="none" stroke="#f2b8c0" stroke-width="2.4" stroke-linecap="round"/>
    <circle cx="18" cy="28" r="9.5" fill="#b08866" ${line()}/>
    <ellipse cx="13" cy="31" rx="5" ry="4" fill="#f2e2cc"/>
    <circle cx="15" cy="26" r="2" fill="#1b120b"/><circle cx="15.6" cy="25.4" r="0.7" fill="#ffffff"/>
    <circle cx="9" cy="30" r="1.7" fill="#f08a9a"/>`);
}

// One ice block with a snow cap (Frankie can stand on it).
function blockIce() {
  return svgDoc(48, 32, `
    <defs><linearGradient id="ib" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e6f8ff"/><stop offset="1" stop-color="#9fd8f2"/></linearGradient></defs>
    <rect x="1.5" y="1.5" width="45" height="29" rx="4" fill="url(#ib)"/>
    <path d="M10 26 L20 12 M26 27 L36 13 M38 27 L44 18" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" opacity="0.8"/>
    <path d="M1.5 9 V6 Q1.5 1.5 6 1.5 H42 Q46.5 1.5 46.5 6 V9 Q42 12 37 9 Q32 13 26 9 Q20 12 15 9 Q9 13 1.5 9 Z" fill="#ffffff"/>
    <rect x="1.5" y="1.5" width="45" height="29" rx="4" fill="none" ${line()}/>`);
}

// Ice hole: ice wall, dark cold water with floating ice; the left edge is mirrored for the right.
function gapWinterMid() {
  return svgDoc(64, 80, `
    <defs>
      <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d6f1fc"/><stop offset="1" stop-color="#93c9e6"/></linearGradient>
      <linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f6f96"/><stop offset="1" stop-color="#10304a"/></linearGradient>
    </defs>
    <rect width="64" height="80" fill="url(#wall)"/>
    <path d="M8 6 L18 24 M40 4 L52 22" stroke="#ffffff" stroke-width="2.5" opacity="0.7"/>
    <rect y="30" width="64" height="50" fill="url(#water)"/>
    <rect y="30" width="64" height="2.5" fill="#e6f8ff"/>
    <path d="M10 34 L18 33 L20 37 L12 38 Z M40 35 L50 34 L52 38 L42 39 Z" fill="#e6f8ff" opacity="0.9"/>
    <path d="M24 52 Q30 49 36 52 M8 66 Q14 63 20 66 M44 70 Q50 68 56 70" fill="none" stroke="#6fa8cf" stroke-width="2" stroke-linecap="round" opacity="0.7"/>`);
}

function gapWinterBank() {
  return svgDoc(18, 80, `
    <path d="M5 14 Q10 30 8 52 Q10 66 6 80 H18 V12 Z" fill="#a8d8f0"/>
    <path d="M0 0 H18 V15 Q15 22 11 17 Q7 20 0 17 Z" fill="#f2f7fc"/>
    <rect width="18" height="3" fill="#ffffff"/>
    <path d="M17 8 Q11 28 13 50 Q15 66 11 80" fill="none" ${line()}/>
    <path d="M18 6 Q15 16 10 18" fill="none" ${line(2.5)}/>`);
}

// Snowflakes for the snowfall: a tile that repeats in every direction.
function snowflakes() {
  const flakes = [];
  for (let i = 0; i < 46; i++) {
    const x = (i * 97 + (i % 7) * 13) % 256;
    const y = (i * 61 + (i % 5) * 29) % 256;
    const r = 1.3 + ((i * 7) % 5) * 0.45;
    flakes.push(`<circle cx="${x}" cy="${y}" r="${f1(r)}" fill="#ffffff" opacity="${f1(0.55 + ((i * 3) % 5) * 0.1)}"/>`);
  }
  return svgDoc(256, 256, flakes.join(''));
}

const PIECES = {
  'hills-far-winter': [GAME_WIDTH, 220, mountainsFar],
  'hills-near-winter': [GAME_WIDTH, 140, snowNear],
  'ground-winter': [256, 80, groundWinter],
  'fir-snow': [150, 300, firSnow],
  'bare-tree': [180, 240, bareTree],
  cabin: [220, 180, cabin],
  'ice-pond': [320, 92, icePond],
  'house-snow': [230, 220, () => snowHouse('#ffe0a3', '#c8553d', 230, 220)],
  'house-snow-2': [200, 210, () => snowHouse('#cfe3f0', '#8b5a3c', 200, 210)],
  'church-snow': [150, 260, churchSnow],
  'xmas-tree': [150, 250, xmasTree],
  'lamp-snow': [60, 180, lampSnow],
  'snow-bush': [150, 84, snowBush],
  'snow-rock': [110, 60, snowRock],
  'snow-reeds': [90, 80, snowReeds],
  holly: [100, 60, holly],
  'snow-fence': [160, 72, snowFence],
  snowman: [56, 78, snowman],
  snowball: [46, 46, snowball],
  rabbit: [54, 48, () => hare(false)],
  'rabbit-jump': [54, 48, () => hare(true)],
  'block-ice': [48, 32, blockIce],
  'gap-winter-mid': [64, 80, gapWinterMid],
  'gap-winter-bank': [18, 80, gapWinterBank],
  snowflakes: [256, 256, snowflakes],
};

export function winterSvgs() {
  return Object.fromEntries(Object.entries(PIECES).map(([key, [w, h, draw]]) => [key, { w, h, svg: draw() }]));
}

export function preloadWinter(scene) {
  for (const [key, { w, h, svg }] of Object.entries(winterSvgs())) loadSvg(scene, key, svg, w, h);
}
