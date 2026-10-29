import { GAME_WIDTH } from '../config.js';
import { loadSvg, svgDoc } from './svg.js';
import { attrs, crown, ridge, ridgeY } from './scenery.js';

// Level 11, Munich (grown-ups, only loaded after the pretzel button): a sunny late-summer day
// in the English Garden, on Marienplatz and at the Viktualienmarkt.
// Everything here is background: soft outlines, never the strong OUTLINE.

export const f1 = (n) => n.toFixed(1);
export const polygon = (pts, w, h) => `M0 ${h} ${pts.map(([x, y]) => `L${f1(x)} ${f1(y)}`).join(' ')} L${w} ${h} Z`;

// Landmarks stand on the horizon of hills-far-muenchen: far pictures sit at GROUND_Y - 45 with
// scale ~0.56, so this much empty space below their foot puts the foot on the meadow line (y 128).
const FOOT_GAP = 111;
const MEADOW = 128;

const BLUE = '#3d84c6';
const BLUE_DARK = '#2a609a';
const BLUE_LIGHT = '#9cc6ea';
const CREAM = '#fbf5e4';
const WOOD = '#b98a58';
const WOOD_LIGHT = '#d6a874';
const WOOD_DARK = '#8a5e38';
const WOOD_LINE = '#6e4a2c';
const STONE = '#ddd2b8';
const STONE_LIGHT = '#f1e9d4';
const STONE_SHADE = '#b8aa8e';
const STONE_LINE = '#7b6f5a';
const BRICK = '#c9694b';
const BRICK_LIGHT = '#dd8a68';
const BRICK_SHADE = '#a5513a';
const BRICK_LINE = '#6f3426';
const COPPER = '#6fae96';
const COPPER_LIGHT = '#a4d6c0';
const COPPER_LINE = '#3f7561';
const ROOF = '#c4593f';
const ROOF_LIGHT = '#e07c58';
const ROOF_LINE = '#7d332b';
const SLATE = '#7d8e94';
const SLATE_LIGHT = '#a3b3b6';
const SLATE_LINE = '#4a5a60';
const GOLD = '#f2b83c';
const GOLD_LINE = '#9a6e1c';
const GLASS = '#8fb1cf';
const DARK = '#5e4a46';
const LEAF = { line: '#3f6b36', base: '#62a547', shade: '#4a8639', light: '#8cc65c', dots: '#b8dc7c' };
const DEEP_LEAF = { line: '#2f5a2c', base: '#4a8a3a', shade: '#3a7432', light: '#6aaa4c', dots: '#92c45e' };
const GREEN_ROOF = '#4d8a5a';

// ---- Small helpers ----

const soft = (color, w = 1.5) => attrs(color, w);

// Soft ground shadow under a piece.
export const groundShadow = (cx, y, rx, o = 0.2) => `<ellipse cx="${cx}" cy="${y}" rx="${rx}" ry="${f1(Math.min(rx * 0.1, 6))}" fill="#4a5a30" opacity="${o}"/>`;

// A pointed (Gothic) window w wide, from its tip at y down to y + h.
export const gothic = (x, y, w, h) =>
  `M${f1(x)} ${f1(y + h)} V${f1(y + w * 0.9)} Q${f1(x)} ${f1(y + w * 0.2)} ${f1(x + w / 2)} ${f1(y)} Q${f1(x + w)} ${f1(y + w * 0.2)} ${f1(x + w)} ${f1(y + w * 0.9)} V${f1(y + h)} Z`;

// A round-arched window or door w wide, from its top at y down to y + h.
export const arch = (x, y, w, h) => `M${f1(x)} ${f1(y + h)} V${f1(y + w / 2)} A${f1(w / 2)} ${f1(w / 2)} 0 0 1 ${f1(x + w)} ${f1(y + w / 2)} V${f1(y + h)} Z`;

// A slim spire standing on (x, y), w wide at its foot and h high.
export const spire = (x, y, w, h) => `M${f1(x - w / 2)} ${f1(y)} L${f1(x)} ${f1(y - h)} L${f1(x + w / 2)} ${f1(y)} Z`;

// A pagoda roof with up-turned eaves: w wide at the eaves (y), h high, tw wide at the top.
function pagodaRoof(cx, y, w, h, tw, fill, light, lineColor) {
  const l = cx - w / 2;
  const r = cx + w / 2;
  const bend = (w - tw) * 0.2;
  const d = `M${f1(l)} ${f1(y - 6)} Q${f1(l + w * 0.06)} ${f1(y + 5)} ${f1(l + w * 0.2)} ${f1(y)} L${f1(r - w * 0.2)} ${f1(y)} Q${f1(r - w * 0.06)} ${f1(y + 5)} ${f1(r)} ${f1(y - 6)} Q${f1(cx + tw / 2 + bend)} ${f1(y - h * 0.22)} ${f1(cx + tw / 2)} ${f1(y - h)} L${f1(cx - tw / 2)} ${f1(y - h)} Q${f1(cx - tw / 2 - bend)} ${f1(y - h * 0.22)} ${f1(l)} ${f1(y - 6)} Z`;
  const ribs = [0.2, 0.35, 0.5, 0.65, 0.8].map((t) => `M${f1(cx + (t - 0.5) * w * 0.8)} ${f1(y - 1)} L${f1(cx + (t - 0.5) * tw)} ${f1(y - h)}`).join(' ');
  return `<path d="${d}" fill="${fill}" ${soft(lineColor, 1.6)}/>
    <path d="M${f1(l + 4)} ${f1(y - 6)} Q${f1(cx - tw / 2 - bend)} ${f1(y - h * 0.22)} ${f1(cx - tw / 2)} ${f1(y - h)} L${f1(cx - tw * 0.1)} ${f1(y - h)} L${f1(cx - w * 0.14)} ${f1(y - 2)} Z" fill="${light}" opacity="0.55"/>
    <path d="${ribs}" stroke="${lineColor}" stroke-width="0.9" opacity="0.55" fill="none"/>`;
}

// A small flower box with red and pink geraniums, x/y = top left, w wide.
function flowerBox(x, y, w) {
  const blooms = [];
  for (let i = 0, cx = x + 4; cx < x + w - 2; i++, cx += 6) {
    const c = ['#e5484d', '#f2788a', '#d83a45'][i % 3];
    blooms.push(`<circle cx="${f1(cx)}" cy="${f1(y - 1 - (i % 2) * 2)}" r="3.4" fill="${c}"/><circle cx="${f1(cx - 2)}" cy="${f1(y + 1)}" r="2.6" fill="#5c9a46"/>`);
  }
  return `${blooms.join('')}<rect x="${x}" y="${y + 2}" width="${w}" height="6" rx="1.2" fill="#8a5a38" ${soft('#5a3a22', 1)}/>`;
}

// A square window with white frame, mullions, optional shutters and flower box.
function windowRect(x, y, w, h, { shutters = null, box = false } = {}) {
  const sh = shutters
    ? `<rect x="${f1(x - w * 0.36)}" y="${y}" width="${f1(w * 0.3)}" height="${h}" fill="${shutters}" ${soft('#3a5a3e', 0.8)}/><rect x="${f1(x + w * 1.06)}" y="${y}" width="${f1(w * 0.3)}" height="${h}" fill="${shutters}" ${soft('#3a5a3e', 0.8)}/>`
    : '';
  return `${sh}<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${GLASS}" ${soft('#fffdf4', 2.2)}/>
    <path d="M${f1(x + w / 2)} ${y} V${y + h} M${x} ${f1(y + h * 0.42)} H${x + w}" stroke="#fffdf4" stroke-width="1.5"/>
    <rect x="${f1(x + w * 0.1)}" y="${f1(y + h * 0.08)}" width="${f1(w * 0.28)}" height="${f1(h * 0.3)}" fill="#ffffff" opacity="0.35"/>
    ${box ? flowerBox(x - 2, y + h - 3, w + 4) : `<rect x="${x - 2}" y="${y + h}" width="${w + 4}" height="3" fill="${STONE_LIGHT}" ${soft(STONE_LINE, 0.8)}/>`}`;
}

// Bavarian white and blue lozenges over a rectangle clip, x/y = top left.
export function lozenges(x, y, w, h, size = 12) {
  const out = [];
  for (let j = 0; j * size < h + size; j++) {
    for (let i = 0; i * size < w + size; i++) {
      if ((i + j) % 2 === 0) out.push(`M${f1(x + i * size + size / 2)} ${f1(y + j * size)} l${size / 2} ${size / 2} l${-size / 2} ${size / 2} l${-size / 2} ${-size / 2} Z`);
    }
  }
  return out.join(' ');
}

// Small round trees along a ridge: n evenly spaced trees per tile width, so the tile repeats cleanly.
export function treeRow(w, pts, n, dy, r0, colors) {
  const out = [];
  const step = w / n;
  for (let i = -1; i <= n; i++) {
    const k = ((i % n) + n) % n;
    const x = i * step + ((k * 37) % 17);
    const y = ridgeY(pts, ((x % w) + w) % w) + dy + ((k * 13) % 9);
    const r = r0 + ((k * 7) % 5);
    out.push(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="${colors[k % colors.length]}"/><circle cx="${f1(x - r * 0.3)}" cy="${f1(y - r * 0.3)}" r="${f1(r * 0.55)}" fill="${colors[(k + 1) % colors.length]}" opacity="0.8"/>`);
  }
  return out.join('');
}

// ---- Background tiles ----

// Far away: the Alps faintly on the horizon, the roofs and towers of the city, the green belt
// of the park and the meadow in front. Nothing crosses the left or right edge, so it tiles.
function hillsFar() {
  const w = GAME_WIDTH;
  const alps = ridge(w, 60, [[24, 1, 0.5], [13, 3, 1.4], [6, 7, 0.3], [3, 13]]);
  const alps2 = ridge(w, 74, [[14, 2, 2.2], [7, 5, 0.6], [3, 11]]);
  const treeLine = ridge(w, 120, [[5, 2, 1], [3, 6, 0.4]]);
  // Snow caps: the band just under every peak that rises above y 56, with a ragged lower edge.
  const capEdge = alps.map(([x, y]) => [x, y + Math.max(0, (56 - y) * 0.7) + (y < 56 ? 2.5 * Math.sin(x * 0.9) : 0)]);
  // City skyline: pale blue-violet silhouettes with a few church towers and domes.
  const sil = '#b9bfd6';
  const silLight = '#cbd0e2';
  const roofCol = '#c3a6b4';
  const towers = [
    { x: 150, w: 14, h: 52, dome: true }, { x: 176, w: 14, h: 46, dome: true },
    { x: 395, w: 12, h: 58, dome: false }, { x: 640, w: 11, h: 48, dome: false },
    { x: 770, w: 13, h: 50, dome: true }, { x: 60, w: 10, h: 40, dome: false },
  ];
  const houses = [];
  for (let x = 24; x < w - 50; x += 30 + ((x * 7) % 19)) {
    const hw = 22 + ((x * 3) % 14);
    const hh = 16 + ((x * 5) % 20);
    houses.push(`<rect x="${x}" y="${MEADOW - 14 - hh}" width="${hw}" height="${hh + 8}" fill="${sil}"/><path d="M${x - 2} ${MEADOW - 14 - hh} L${x + hw / 2} ${MEADOW - 24 - hh} L${x + hw + 2} ${MEADOW - 14 - hh} Z" fill="${roofCol}"/>`);
  }
  const tw = towers.map(({ x, w: tww, h, dome }) => {
    const top = MEADOW - 10 - h;
    return `<rect x="${x - tww / 2}" y="${top}" width="${tww}" height="${h + 6}" fill="${silLight}"/>
      ${dome
        ? `<path d="M${x - tww / 2 - 1} ${top} Q${x - tww / 2 - 4} ${top - 10} ${x} ${top - 20} Q${x + tww / 2 + 4} ${top - 10} ${x + tww / 2 + 1} ${top} Z" fill="#9fc0b8"/><path d="M${x} ${top - 20} V${top - 28}" stroke="#9aa0bd" stroke-width="1.6"/>`
        : `<path d="M${x - tww / 2 - 1} ${top} L${x} ${top - 24} L${x + tww / 2 + 1} ${top} Z" fill="${roofCol}"/>`}`;
  });
  const meadowStripes = [];
  for (let x = 0; x < w; x += 80) meadowStripes.push(`<path d="M${x} ${MEADOW + 4} L${x + 40} ${MEADOW + 4} L${x + 80} 220 L${x + 40} 220 Z" fill="#ffffff" opacity="0.1"/>`);
  const blooms = [];
  for (let i = 0; i < 46; i++) {
    const x = (i * 211) % w;
    const y = MEADOW + 12 + ((i * 53) % 74);
    blooms.push(`<circle cx="${x}" cy="${y}" r="${1.4 + (i % 3) * 0.5}" fill="${['#fff3b0', '#ffffff', '#f6c4d0'][i % 3]}" opacity="0.7"/>`);
  }
  return svgDoc(w, 220, `
    <defs>
      <linearGradient id="mw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b6d77c"/><stop offset="1" stop-color="#8fc15e"/></linearGradient>
    </defs>
    <path d="${polygon(alps, w, 120)}" fill="#bccae0"/>
    <path d="M${alps.map(([x, y]) => `${x} ${f1(y)}`).join(' L')} L${capEdge.slice().reverse().map(([x, y]) => `${x} ${f1(y)}`).join(' L')} Z" fill="#f6f9fd"/>
    <path d="${polygon(alps2, w, 120)}" fill="#cfdbec"/>
    ${houses.join('')}${tw.join('')}
    <path d="${polygon(treeLine, w, MEADOW + 2)}" fill="#7fae66"/>
    ${treeRow(w, treeLine, 26, 6, 11, ['#6ea05c', '#8cb866', '#78aa60'])}
    <rect y="${MEADOW}" width="${w}" height="${220 - MEADOW}" fill="url(#mw)"/>
    ${meadowStripes.join('')}${blooms.join('')}
    <path d="M0 ${MEADOW} H${w}" stroke="#d8eaa0" stroke-width="2.4" opacity="0.8"/>`);
}

// Right behind Frankie: the tree belt of the park with a few roofs, and the lawn in front.
function hillsNear() {
  const w = GAME_WIDTH;
  const top = ridge(w, 74, [[5, 2, 0.4], [2.5, 6, 1.3]]);
  const belt = ridge(w, 58, [[7, 3, 1.1], [4, 7, 0.2]]);
  const stripes = [];
  for (let x = 0; x < w; x += 64) stripes.push(`<rect x="${x}" y="86" width="32" height="54" fill="#f6f6a8" opacity="0.1"/>`);
  const roofs = [120, 470, 800].map((x, i) => {
    const y = ridgeY(belt, x) + 12;
    const c = i === 1 ? '#c98a5a' : ROOF;
    return `<rect x="${x - 17}" y="${y - 6}" width="34" height="22" fill="${i === 1 ? '#f2dfae' : '#f4e2c4'}"/><path d="M${x - 21} ${y - 6} L${x - 8} ${y - 24} L${x + 8} ${y - 24} L${x + 21} ${y - 6} Z" fill="${c}"/><rect x="${x + 8}" y="${y - 30}" width="5" height="10" fill="#a88a78"/>`;
  });
  return svgDoc(w, 140, `
    <defs><linearGradient id="ln" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a8cf68"/><stop offset="1" stop-color="#82b650"/></linearGradient></defs>
    <path d="${polygon(belt, w, 100)}" fill="#6a9c52"/>
    ${roofs.join('')}
    ${treeRow(w, belt, 22, -2, 15, ['#5f9a4c', '#7bb258', '#6aa653'])}
    ${treeRow(w, top, 18, 0, 17, ['#73ac55', '#92c466', '#80b85c'])}
    <path d="${polygon(top, w, 140)}" fill="url(#ln)"/>
    <path d="M${top.map(([x, y]) => `${x} ${f1(y + 3)}`).join(' L')}" fill="none" stroke="#d8ee94" stroke-width="3" opacity="0.8"/>
    ${stripes.join('')}`);
}

// ---- Far: the landmarks ----

// The Chinese Tower: a five-storey wooden pagoda with a round gallery for the brass band at its foot.
function chineseTower() {
  const W = 200;
  const H = 262;
  const cx = 100;
  const storey = (y0, y1, bw) => {
    const x = cx - bw / 2;
    const posts = [];
    for (let px = x + 7; px < x + bw - 4; px += 11) posts.push(`<path d="M${f1(px)} ${y0} V${y1}" stroke="${WOOD_LINE}" stroke-width="1.4" opacity="0.7"/>`);
    return `<rect x="${f1(x)}" y="${y0}" width="${bw}" height="${y1 - y0}" fill="${WOOD}" ${soft(WOOD_LINE, 1.4)}/>
      <rect x="${f1(x)}" y="${y0}" width="${f1(bw * 0.28)}" height="${y1 - y0}" fill="${WOOD_DARK}" opacity="0.4"/>
      ${posts.join('')}
      <rect x="${f1(x + 4)}" y="${y0 + 5}" width="${bw - 8}" height="${y1 - y0 - 10}" fill="#7a4a34" opacity="0.5"/>
      <path d="M${f1(x)} ${y0 + 2} H${f1(x + bw)}" stroke="${GOLD}" stroke-width="2.4"/>`;
  };
  const gallery = [];
  for (let px = 58; px <= 142; px += 12) gallery.push(`<rect x="${px - 2}" y="226" width="4" height="26" fill="${WOOD}" ${soft(WOOD_LINE, 0.9)}/>`);
  const bunting = [64, 80, 96, 112, 128].map((x, i) => `<path d="M${x} 224 l5 0 l-2.5 7 Z" fill="${i % 2 ? BLUE : '#ffffff'}"/>`).join('');
  const crowns = [[26, 238, 22], [48, 224, 20], [176, 236, 22], [154, 224, 18]];
  return svgDoc(W, H + FOOT_GAP, `
    ${crown(crowns, DEEP_LEAF)}
    <ellipse cx="${cx}" cy="${H - 1}" rx="76" ry="6" fill="#e9dcb0" ${soft('#b8a878', 1)}/>
    <rect x="52" y="224" width="96" height="30" fill="#4a3226" ${soft(WOOD_LINE, 1.4)}/>
    ${gallery.join('')}
    <path d="M50 226 H150" stroke="${WOOD_LINE}" stroke-width="3"/>
    ${bunting}
    ${[[70, 242], [88, 244], [106, 242], [124, 244]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${GOLD}"/>`).join('')}
    ${storey(190, 208, 68)}${storey(150, 164, 56)}${storey(112, 124, 46)}${storey(76, 86, 36)}
    ${pagodaRoof(cx, 226, 154, 28, 74, '#5a4a40', '#8a7468', '#2f2622')}
    ${pagodaRoof(cx, 190, 122, 26, 58, '#5a4a40', '#8a7468', '#2f2622')}
    ${pagodaRoof(cx, 150, 98, 24, 48, '#5a4a40', '#8a7468', '#2f2622')}
    ${pagodaRoof(cx, 112, 78, 22, 38, '#5a4a40', '#8a7468', '#2f2622')}
    ${pagodaRoof(cx, 76, 58, 26, 14, '#5a4a40', '#8a7468', '#2f2622')}
    ${[190, 150, 112, 76].map((y, i) => [-14, 0, 14].map((dx) => `<path d="${arch(cx + dx - 4, y + 6, 8, [10, 7, 6, 6][i])}" fill="#3a2a22"/>`).join('')).join('')}
    <path d="M${cx} 50 V16" stroke="${GOLD_LINE}" stroke-width="3" stroke-linecap="round"/>
    <circle cx="${cx}" cy="34" r="4.2" fill="${GOLD}" ${soft(GOLD_LINE, 1)}/>
    <circle cx="${cx}" cy="20" r="3" fill="${GOLD}" ${soft(GOLD_LINE, 1)}/>
    <path d="M${cx} 16 V8" stroke="${GOLD_LINE}" stroke-width="2" stroke-linecap="round"/>
    ${groundShadow(cx, H, 90)}`);
}

// The Monopteros: a round temple with slim columns on a grassy hill, linden trees beside it.
function monopteros() {
  const W = 260;
  const H = 262;
  const cols = [];
  for (let i = 0; i < 9; i++) {
    const x = 78 + i * 13;
    const edge = i === 0 || i === 8;
    cols.push(`<rect x="${x - 2.4}" y="100" width="4.8" height="${edge ? 40 : 46}" fill="#f4eddc" ${soft('#a8a08a', 0.9)}/><rect x="${x + 0.4}" y="100" width="1.8" height="${edge ? 40 : 46}" fill="#d8cdb4" opacity="0.8"/>`);
  }
  return svgDoc(W, H + FOOT_GAP, `
    <defs><linearGradient id="hl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b6d878"/><stop offset="1" stop-color="#86b858"/></linearGradient></defs>
    ${crown([[36, 192, 26], [32, 218, 22], [220, 190, 28], [222, 216, 22]], LEAF)}
    <path d="M0 ${H} C30 ${H - 2} 44 192 66 166 Q130 156 194 166 C216 192 230 ${H - 2} 260 ${H} Z" fill="url(#hl)" ${soft('#6a9a48', 1.5)}/>
    <path d="M122 ${H} C118 232 134 210 130 190 C128 180 134 172 134 164 H146 C146 182 152 202 146 ${H} Z" fill="#e8dcb0" opacity="0.85"/>
    <path d="M70 142 H190 V156 H70 Z" fill="${STONE}" ${soft(STONE_LINE, 1.3)}/>
    <path d="M62 156 H198 V164 H62 Z" fill="${STONE_LIGHT}" ${soft(STONE_LINE, 1.3)}/>
    <rect x="82" y="104" width="96" height="38" fill="#6a6a62" opacity="0.5"/>
    ${cols.join('')}
    <path d="M68 100 H192 V110 H68 Z" fill="${STONE_LIGHT}" ${soft(STONE_LINE, 1.3)}/>
    <path d="M62 100 L82 66 H178 L198 100 Z" fill="#9aa8a0" ${soft('#5a6a62', 1.4)}/>
    <path d="M62 100 L82 66 H116 L102 100 Z" fill="#b8c6bc" opacity="0.6"/>
    <path d="M96 66 Q130 48 164 66 Z" fill="#8a9a92" ${soft('#5a6a62', 1.2)}/>
    <path d="M130 54 V44" stroke="${STONE_LINE}" stroke-width="3" stroke-linecap="round"/>
    <circle cx="130" cy="42" r="3" fill="${GOLD}"/>
    ${[90, 170].map((x) => `<circle cx="${x}" cy="168" r="3" fill="${STONE_SHADE}"/>`).join('')}
    ${groundShadow(130, H, 120, 0.15)}`);
}

// The New Town Hall: a long neo-Gothic facade with pointed windows and gables, corner turrets
// and the tall central tower with its pointed copper roof.
function rathaus() {
  const W = 380;
  const H = 300;
  const line = soft(STONE_LINE, 1.4);
  const wins = [];
  const gables = [];
  for (const [y0, hh] of [[196, 20], [228, 20], [258, 18]]) {
    for (let x = 36; x < 340; x += 21) {
      if (x > 140 && x < 232) continue;
      wins.push(gothic(x, y0, 9, hh));
    }
  }
  for (let x = 40; x < 340; x += 42) {
    if (x > 130 && x < 250) continue;
    gables.push(`<path d="M${x - 14} 184 L${x} 160 L${x + 14} 184 Z" fill="${STONE_LIGHT}" ${line}/><path d="${gothic(x - 4, 166, 8, 14)}" fill="#7d8aa0"/><path d="M${x} 160 V150" stroke="${STONE_LINE}" stroke-width="2.4"/><circle cx="${x}" cy="148" r="2.2" fill="${STONE_LIGHT}" ${soft(STONE_LINE, 0.8)}/>`);
  }
  const arcade = [];
  for (let x = 30; x < 350; x += 21) {
    if (x > 140 && x < 232) continue;
    arcade.push(arch(x, 282, 12, 18));
  }
  const turret = (x) => `
    <rect x="${x - 17}" y="130" width="34" height="${H - 130}" fill="${STONE}" ${line}/>
    <rect x="${x - 17}" y="130" width="10" height="${H - 130}" fill="${STONE_SHADE}" opacity="0.5"/>
    <path d="${gothic(x - 5, 144, 10, 22)}" fill="#7d8aa0"/><path d="${gothic(x - 5, 180, 10, 22)}" fill="#7d8aa0"/>
    <path d="${spire(x, 130, 40, 66)}" fill="${COPPER}" ${soft(COPPER_LINE, 1.4)}/>
    <path d="M${x} 64 L${x - 20} 130 L${x - 4} 130 Z" fill="${COPPER_LIGHT}" opacity="0.7"/>
    <circle cx="${x}" cy="62" r="2.4" fill="${GOLD}"/>`;
  return svgDoc(W, H + FOOT_GAP, `
    <rect x="18" y="170" width="344" height="${H - 170}" fill="${STONE}" ${line}/>
    <rect x="18" y="170" width="344" height="14" fill="${STONE_LIGHT}"/>
    <path d="M18 184 H362 M18 218 H362 M18 250 H362 M18 280 H362" stroke="${STONE_SHADE}" stroke-width="2"/>
    <path d="M18 160 L40 142 H340 L362 160 V184 H18 Z" fill="${SLATE}" ${soft(SLATE_LINE, 1.4)}/>
    <path d="M18 160 L40 142 H190 L170 184 H18 Z" fill="${SLATE_LIGHT}" opacity="0.5"/>
    ${gables.join('')}
    <path d="${wins.join(' ')}" fill="#7d8aa0" ${soft('#4a566a', 0.8)}/>
    <path d="${arcade.join(' ')}" fill="#5a4a46"/>
    ${turret(34)}${turret(346)}
    <rect x="144" y="94" width="92" height="${H - 94}" fill="${STONE}" ${line}/>
    <rect x="144" y="94" width="26" height="${H - 94}" fill="${STONE_SHADE}" opacity="0.5"/>
    <path d="M144 126 H236 M144 160 H236 M144 200 H236 M144 240 H236" stroke="${STONE_SHADE}" stroke-width="2"/>
    ${[[158, 104], [190, 104], [210, 104], [166, 170], [210, 170]].map(([x, y]) => `<path d="${gothic(x - 5, y, 10, 24)}" fill="#7d8aa0" ${soft('#4a566a', 0.8)}/>`).join('')}
    <rect x="160" y="132" width="60" height="26" fill="#d9b86a" ${soft(STONE_LINE, 1.2)}/>
    <path d="M168 138 H212 M168 146 H212" stroke="#b83a3a" stroke-width="4"/>
    <path d="M168 142 H212" stroke="#3a6ab0" stroke-width="3"/>
    <path d="${gothic(172, 214, 12, 30)} ${gothic(196, 214, 12, 30)}" fill="${DARK}"/>
    <rect x="156" y="62" width="68" height="34" fill="${STONE}" ${line}/>
    <path d="${gothic(168, 68, 10, 20)} ${gothic(202, 68, 10, 20)}" fill="#7d8aa0"/>
    <path d="M150 62 H230" stroke="${STONE_LINE}" stroke-width="3.4"/>
    <path d="${spire(190, 62, 76, 56)}" fill="${COPPER}" ${soft(COPPER_LINE, 1.5)}/>
    <path d="M190 6 L152 62 L178 62 Z" fill="${COPPER_LIGHT}" opacity="0.75"/>
    <path d="M190 6 V0" stroke="${GOLD_LINE}" stroke-width="2.4"/>
    <circle cx="190" cy="14" r="3.2" fill="${GOLD}" ${soft(GOLD_LINE, 0.8)}/>
    ${[154, 226].map((x) => `<path d="${spire(x, 94, 14, 34)}" fill="${COPPER}" ${soft(COPPER_LINE, 1)}/>`).join('')}
    ${groundShadow(190, H, 170)}`);
}

// The Frauenkirche: two brick towers with green onion domes and the huge steep roof between them.
function frauenkirche() {
  const W = 270;
  const H = 290;
  const tower = (cx) => {
    const x = cx - 28;
    return `
      <rect x="${x}" y="108" width="56" height="${H - 108}" fill="${BRICK}" ${soft(BRICK_LINE, 1.5)}/>
      <rect x="${x}" y="108" width="16" height="${H - 108}" fill="${BRICK_SHADE}" opacity="0.5"/>
      <path d="M${x} 150 H${x + 56} M${x} 200 H${x + 56}" stroke="${BRICK_LINE}" stroke-width="1.6" opacity="0.6"/>
      <path d="${arch(cx - 10, 118, 8, 26)} ${arch(cx + 2, 118, 8, 26)}" fill="#4a2a24"/>
      <path d="${gothic(cx - 4, 160, 8, 24)} ${gothic(cx - 4, 210, 8, 26)}" fill="#4a2a24"/>
      <path d="M${x - 4} 108 H${x + 60}" stroke="${BRICK_LINE}" stroke-width="4"/>
      <path d="M${cx - 30} 108 Q${cx - 40} 64 ${cx - 12} 52 Q${cx - 4} 44 ${cx - 6} 30 L${cx + 6} 30 Q${cx + 4} 44 ${cx + 12} 52 Q${cx + 40} 64 ${cx + 30} 108 Z" fill="${COPPER}" ${soft(COPPER_LINE, 1.6)}/>
      <path d="M${cx - 30} 108 Q${cx - 40} 64 ${cx - 12} 52 Q${cx - 4} 44 ${cx - 6} 30 L${cx - 1} 30 Q${cx - 14} 60 ${cx - 14} 108 Z" fill="${COPPER_LIGHT}" opacity="0.65"/>
      <path d="M${cx - 31} 90 Q${cx} 98 ${cx + 31} 90" fill="none" stroke="${COPPER_LINE}" stroke-width="1.2" opacity="0.6"/>
      <circle cx="${cx}" cy="24" r="5" fill="${COPPER}" ${soft(COPPER_LINE, 1.2)}/>
      <path d="M${cx} 20 V4 M${cx - 4} 10 H${cx + 4}" stroke="${GOLD}" stroke-width="2.6" stroke-linecap="round"/>`;
  };
  const tiles = [];
  for (let y = 98; y < 150; y += 7) tiles.push(`M62 ${y} H208`);
  const buttress = [];
  for (let x = 90; x < 190; x += 20) buttress.push(`<rect x="${x}" y="158" width="9" height="${H - 158}" fill="${BRICK_SHADE}" opacity="0.55"/>`);
  return svgDoc(W, H + FOOT_GAP, `
    <path d="M58 150 L74 84 H196 L212 150 Z" fill="#a8483a" ${soft(ROOF_LINE, 1.6)}/>
    <path d="${tiles.join(' ')}" stroke="${ROOF_LINE}" stroke-width="1" opacity="0.5"/>
    <path d="M58 150 L74 84 H110 L102 150 Z" fill="${ROOF_LIGHT}" opacity="0.45"/>
    <rect x="62" y="150" width="146" height="${H - 150}" fill="${BRICK}" ${soft(BRICK_LINE, 1.5)}/>
    ${buttress.join('')}
    <path d="M64 168 H206" stroke="${BRICK_LINE}" stroke-width="1.4" opacity="0.6"/>
    <path d="${gothic(115, 176, 14, 40)} ${gothic(141, 176, 14, 40)}" fill="#4a2a24"/>
    <path d="${arch(118, 236, 34, 54)}" fill="#6a3a2c" ${soft(BRICK_LINE, 1.4)}/>
    <path d="M118 262 H152" stroke="${BRICK_LINE}" stroke-width="1.2"/>
    ${tower(48)}${tower(222)}
    ${groundShadow(135, H, 124)}`);
}

// The Mariensäule on Marienplatz: a slim red column with the golden Madonna on a crescent moon.
function mariensaeule() {
  const W = 110;
  const H = 300;
  const putti = [26, 46, 66, 86].map((x, i) => `<circle cx="${x}" cy="${H - 22}" r="3.4" fill="${GOLD}"/><path d="M${x} ${H - 18} v8" stroke="${GOLD}" stroke-width="3.4" stroke-linecap="round"/>`);
  return svgDoc(W, H + FOOT_GAP, `
    <path d="M14 ${H} V${H - 12} H96 V${H}" fill="${STONE_SHADE}" ${soft(STONE_LINE, 1.3)}/>
    <path d="M20 ${H - 12} V${H - 36} H90 V${H - 12}" fill="${STONE}" ${soft(STONE_LINE, 1.3)}/>
    ${putti.join('')}
    <path d="M26 ${H - 36} V${H - 46} H84 V${H - 36}" fill="${STONE_LIGHT}" ${soft(STONE_LINE, 1.3)}/>
    <path d="M42 ${H - 46} V${H - 66} H68 V${H - 46}" fill="${STONE}" ${soft(STONE_LINE, 1.3)}/>
    <path d="M48 ${H - 66} L50 90 H60 L62 ${H - 66} Z" fill="#c4786c" ${soft('#7a3f38', 1.3)}/>
    <path d="M50 ${H - 66} L51 90 H54 L53 ${H - 66} Z" fill="#e0a090" opacity="0.8"/>
    <path d="M44 90 H66 V82 H44 Z" fill="${STONE_LIGHT}" ${soft(STONE_LINE, 1.3)}/>
    <path d="M47 82 Q55 70 63 82 Z" fill="${GOLD}" ${soft(GOLD_LINE, 1)}/>
    <path d="M38 58 Q55 76 72 58 Q55 66 38 58 Z" fill="${GOLD}" ${soft(GOLD_LINE, 1.1)}/>
    <path d="M47 62 Q55 46 63 62 L58 36 H52 Z" fill="${GOLD}" ${soft(GOLD_LINE, 1.1)}/>
    <circle cx="55" cy="30" r="5.4" fill="#f6d27a" ${soft(GOLD_LINE, 1)}/>
    <path d="M50 26 L52 21 L55 24 L58 21 L60 26 Z" fill="${GOLD}" ${soft(GOLD_LINE, 0.8)}/>
    <path d="M70 62 L70 24" stroke="${GOLD_LINE}" stroke-width="1.8"/><circle cx="70" cy="22" r="2.2" fill="${GOLD}"/>
    ${[[55, 12], [43, 18], [67, 18], [37, 28], [73, 32]].map(([x, y]) => `<path d="M${x} ${y - 3} l1 2 l2 0 l-1.6 1.6 l0.6 2.2 l-2 -1.2 l-2 1.2 l0.6 -2.2 l-1.6 -1.6 l2 0 Z" fill="${GOLD}"/>`).join('')}
    ${groundShadow(55, H, 50)}`);
}

// The Alter Peter: the slim tower of St. Peter with its dark-green onion spire, next to the church roof.
function alterPeter() {
  const W = 160;
  const H = 290;
  const cx = 104;
  return svgDoc(W, H + FOOT_GAP, `
    <path d="M6 ${H} V218 L32 182 L58 218 V${H} Z" fill="#f2e6c4" ${soft('#9a8a64', 1.3)}/>
    <path d="M2 220 L32 176 L62 220 Z" fill="${ROOF}" ${soft(ROOF_LINE, 1.4)}/>
    <path d="M2 220 L32 176 L32 220 Z" fill="${ROOF_LIGHT}" opacity="0.45"/>
    <path d="${arch(24, 238, 16, 28)} ${arch(8, 230, 8, 18)}" fill="#7a6a5a"/>
    <rect x="${cx - 22}" y="112" width="44" height="${H - 112}" fill="#f0e0b6" ${soft('#9a8a64', 1.5)}/>
    <rect x="${cx - 22}" y="112" width="12" height="${H - 112}" fill="#d8c694" opacity="0.7"/>
    <path d="M${cx - 22} 168 H${cx + 22} M${cx - 22} 214 H${cx + 22}" stroke="#b8a678" stroke-width="2"/>
    <path d="${arch(cx - 5, 130, 10, 26)}" fill="#6a5a4a"/>
    <path d="${arch(cx - 5, 226, 10, 24)}" fill="#6a5a4a"/>
    <circle cx="${cx}" cy="190" r="9" fill="#fffdf0" ${soft('#6a5a4a', 1.4)}/>
    <path d="M${cx} 190 V184 M${cx} 190 L${cx + 4} 192" stroke="#3a2a22" stroke-width="1.3" stroke-linecap="round"/>
    <path d="M${cx - 25} 112 H${cx + 25}" stroke="#9a8a64" stroke-width="4"/>
    <rect x="${cx - 16}" y="78" width="32" height="34" fill="#f4e8c8" ${soft('#9a8a64', 1.3)}/>
    <path d="${arch(cx - 10, 86, 7, 20)} ${arch(cx + 3, 86, 7, 20)}" fill="#6a5a4a"/>
    <path d="M${cx - 20} 78 H${cx + 20}" stroke="#9a8a64" stroke-width="3.4"/>
    <path d="M${cx - 19} 78 Q${cx - 26} 56 ${cx - 8} 46 Q${cx - 3} 40 ${cx - 4} 30 L${cx + 4} 30 Q${cx + 3} 40 ${cx + 8} 46 Q${cx + 26} 56 ${cx + 19} 78 Z" fill="${COPPER}" ${soft(COPPER_LINE, 1.5)}/>
    <path d="M${cx - 19} 78 Q${cx - 26} 56 ${cx - 8} 46 Q${cx - 3} 40 ${cx - 4} 30 L${cx - 1} 30 Q${cx - 10} 54 ${cx - 9} 78 Z" fill="${COPPER_LIGHT}" opacity="0.65"/>
    <path d="M${cx - 6} 30 Q${cx - 10} 22 ${cx - 2} 18 Q${cx - 4} 12 ${cx} 4 Q${cx + 4} 12 ${cx + 2} 18 Q${cx + 10} 22 ${cx + 6} 30 Z" fill="${COPPER}" ${soft(COPPER_LINE, 1.2)}/>
    <path d="M${cx} 4 V-2" stroke="${GOLD}" stroke-width="2.4"/>
    ${groundShadow(80, H, 76)}`);
}

// The Maibaum on the Viktualienmarkt: a tall white and blue striped pole with a wreath on top
// and the painted signs of the market crafts.
function maibaum() {
  const W = 130;
  const H = 340;
  const cx = 65;
  // One diagonal band every 22 px: the white and blue spiral of the pole.
  const bands = [];
  for (let y = -30; y < H + 20; y += 22) bands.push(`M${cx - 12} ${y + 10} L${cx + 12} ${y - 2} V${y + 9} L${cx - 12} ${y + 21} Z`);
  const plaque = (x, y, bg, icon) => `<path d="M${x - 15} ${y} H${x + 15} V${y + 26} Q${x} ${y + 44} ${x - 15} ${y + 26} Z" fill="${bg}" ${soft('#4a3a2e', 1.3)}/>${icon(x, y + 16)}`;
  const icons = {
    pretzel: (x, y) => `<path d="M${x - 8} ${y + 6} C${x - 12} ${y - 6} ${x - 2} ${y - 8} ${x} ${y - 2} C${x + 2} ${y - 8} ${x + 12} ${y - 6} ${x + 8} ${y + 6} C${x + 4} ${y + 10} ${x - 4} ${y + 10} ${x - 8} ${y + 6} Z M${x - 6} ${y - 1} L${x + 6} ${y + 6} M${x + 6} ${y - 1} L${x - 6} ${y + 6}" fill="none" stroke="#a8641e" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`,
    barrel: (x, y) => `<path d="M${x - 8} ${y - 8} Q${x - 12} ${y} ${x - 8} ${y + 8} H${x + 8} Q${x + 12} ${y} ${x + 8} ${y - 8} Z" fill="#b8783a" stroke="#6e4a2c" stroke-width="1.2"/><path d="M${x - 10} ${y - 3} H${x + 10} M${x - 10} ${y + 3} H${x + 10}" stroke="#4a4a52" stroke-width="1.6"/>`,
    key: (x, y) => `<circle cx="${x - 5}" cy="${y - 3}" r="4" fill="none" stroke="#d9a21c" stroke-width="2.6"/><path d="M${x - 2} ${y} L${x + 8} ${y + 8} M${x + 4} ${y + 6} v4 M${x + 7} ${y + 8} v4" stroke="#d9a21c" stroke-width="2.6" stroke-linecap="round" fill="none"/>`,
    scissors: (x, y) => `<path d="M${x - 7} ${y - 8} L${x + 7} ${y + 8} M${x + 7} ${y - 8} L${x - 7} ${y + 8}" stroke="#5a606a" stroke-width="2.4" stroke-linecap="round"/><circle cx="${x - 6}" cy="${y + 8}" r="3" fill="none" stroke="#c0392b" stroke-width="2"/><circle cx="${x + 6}" cy="${y + 8}" r="3" fill="none" stroke="#c0392b" stroke-width="2"/>`,
    fish: (x, y) => `<path d="M${x - 9} ${y} Q${x} ${y - 9} ${x + 6} ${y} Q${x} ${y + 9} ${x - 9} ${y} Z M${x + 6} ${y} L${x + 11} ${y - 5} V${y + 5} Z" fill="#7ab0d8" stroke="#3a6a98" stroke-width="1.2" stroke-linejoin="round"/>`,
    hat: (x, y) => `<path d="M${x - 11} ${y + 4} Q${x} ${y + 8} ${x + 11} ${y + 4} L${x + 4} ${y - 8} H${x - 4} Z" fill="#4a7a5a" stroke="#2f5240" stroke-width="1.2" stroke-linejoin="round"/><path d="M${x + 3} ${y - 6} l5 -6" stroke="#e0e0d0" stroke-width="2" stroke-linecap="round"/>`,
    bread: (x, y) => `<ellipse cx="${x}" cy="${y}" rx="10" ry="6.5" fill="#d89a4a" stroke="#8a5a22" stroke-width="1.2"/><path d="M${x - 5} ${y - 3} l3 6 M${x} ${y - 4} l3 7 M${x + 5} ${y - 3} l2 6" stroke="#8a5a22" stroke-width="1.2" stroke-linecap="round"/>`,
    hammer: (x, y) => `<path d="M${x - 8} ${y + 9} L${x + 4} ${y - 4}" stroke="#7a4a2a" stroke-width="3" stroke-linecap="round"/><path d="M${x - 2} ${y - 10} L${x + 10} ${y - 1} L${x + 6} ${y + 3} L${x - 6} ${y - 6} Z" fill="#6a707a" stroke="#3a3f48" stroke-width="1"/>`,
  };
  const rows = [
    [64, 'pretzel', 'barrel', '#fff6d8', '#9cc6ea'],
    [112, 'key', 'scissors', '#f4d2b4', '#fff6d8'],
    [160, 'fish', 'bread', '#cfe6f6', '#f6e6a8'],
    [208, 'hat', 'hammer', '#fff6d8', '#d8e8c4'],
    [256, 'barrel', 'pretzel', '#9cc6ea', '#fff6d8'],
  ];
  const arms = rows.map(([y, a, b, ca, cb]) => `
    <path d="M${cx - 38} ${y} H${cx + 38}" stroke="${WOOD_DARK}" stroke-width="5" stroke-linecap="round"/>
    <path d="M${cx - 38} ${y} H${cx + 38}" stroke="${WOOD_LIGHT}" stroke-width="2" stroke-linecap="round"/>
    ${plaque(cx - 38, y + 2, ca, icons[a])}${plaque(cx + 38, y + 2, cb, icons[b])}`).join('');
  const figs = [88, 136, 184, 232, 280].map((y, i) => `<circle cx="${cx - 18}" cy="${y}" r="4" fill="#f2c9a0" ${soft('#8a5a3a', 0.8)}/><rect x="${cx - 22}" y="${y + 4}" width="8" height="9" rx="3" fill="${i % 2 ? '#c9473f' : BLUE}"/>
    <circle cx="${cx + 18}" cy="${y + 6}" r="4" fill="#f2c9a0" ${soft('#8a5a3a', 0.8)}/><rect x="${cx + 14}" y="${y + 10}" width="8" height="9" rx="3" fill="${i % 2 ? BLUE : '#5c9a46'}"/>`).join('');
  return svgDoc(W, H + FOOT_GAP, `
    <defs><clipPath id="pole"><path d="M${cx - 5.5} ${H - 22} L${cx - 4} 30 H${cx + 4} L${cx + 5.5} ${H - 22} Z"/></clipPath></defs>
    <path d="M${cx - 5.5} ${H - 22} L${cx - 4} 30 H${cx + 4} L${cx + 5.5} ${H - 22} Z" fill="#ffffff"/>
    <g clip-path="url(#pole)"><path d="${bands.join(' ')}" fill="${BLUE}"/></g>
    <path d="M${cx - 5.5} ${H - 22} L${cx - 4} 30 H${cx + 4} L${cx + 5.5} ${H - 22} Z" fill="none" ${soft(BLUE_DARK, 1)}/>
    ${arms}${figs}
    <circle cx="${cx}" cy="24" r="14" fill="none" stroke="#5c9a46" stroke-width="7"/>
    <circle cx="${cx}" cy="24" r="14" fill="none" stroke="#86c05a" stroke-width="2.4" stroke-dasharray="3 5"/>
    ${[[-14, 24], [14, 24], [0, 10]].map(([dx, y], i) => `<circle cx="${cx + dx}" cy="${y}" r="2.6" fill="${['#e5484d', '#f6c85a', '#ffffff'][i]}"/>`).join('')}
    <path d="M${cx} 10 V0" stroke="${GOLD_LINE}" stroke-width="2.4"/><path d="M${cx} 8 l-5 -2 l5 -9 l5 9 Z" fill="${GOLD}" ${soft(GOLD_LINE, 0.8)}/>
    <path d="M${cx - 8} 36 C${cx - 22} 46 ${cx - 20} 62 ${cx - 24} 66 M${cx + 8} 36 C${cx + 22} 46 ${cx + 20} 62 ${cx + 24} 66" fill="none" stroke="#3d84c6" stroke-width="2.6" stroke-linecap="round"/>
    <rect x="${cx - 20}" y="${H - 22}" width="40" height="22" rx="2" fill="${STONE}" ${soft(STONE_LINE, 1.3)}/>
    <path d="M${cx - 20} ${H - 14} H${cx + 20}" stroke="${STONE_SHADE}" stroke-width="1.6"/>
    ${groundShadow(cx, H, 50)}`);
}

// ---- Far and mid: trees, row of houses, surfer ----

// A big old tree of the English Garden: thick trunk, broad crown.
function bigTree() {
  return svgDoc(270, 280, `
    <path d="M110 276 C118 250 122 224 120 190 C112 176 92 160 78 144 L88 138 C102 150 116 160 124 170 C130 150 140 136 160 120 L166 128 C150 144 142 156 142 176 C148 200 146 250 158 276 Z" fill="#7a5a3c" ${soft('#4a3322', 1.8)}/>
    <path d="M112 276 C120 250 124 224 122 190 L126 190 C128 224 126 252 120 276 Z" fill="#5a3f2a" opacity="0.7"/>
    <path d="M122 206 l8 -22 M136 232 l4 -26" stroke="#4a3322" stroke-width="1.6" stroke-linecap="round" opacity="0.7"/>
    ${crown([[52, 120, 38], [92, 76, 50], [148, 58, 50], [204, 86, 46], [226, 130, 34], [180, 140, 44], [118, 130, 46], [66, 156, 30]], LEAF)}
    ${groundShadow(135, 276, 70)}`);
}

// A small round linden for the far layer: low enough not to hide the landmarks behind it.
function linden() {
  return svgDoc(130, 140, `
    <path d="M58 138 C62 124 62 112 60 96 H72 C70 112 72 126 76 138 Z" fill="#7a5a3c" ${soft('#4a3322', 1.4)}/>
    ${crown([[40, 66, 26], [66, 44, 32], [94, 64, 26], [66, 78, 28]], LEAF)}
    ${groundShadow(66, 138, 34)}`);
}

// A horse chestnut of the beer garden: dense dark crown with spiky green fruits.
function chestnut() {
  const fruit = ([x, y]) => `<circle cx="${x}" cy="${y}" r="5.4" fill="#8ab650" ${soft('#4a7a30', 1)}/><path d="M${x - 5} ${y} l-2 0 M${x + 5} ${y} l2 0 M${x} ${y - 5} l0 -2 M${x} ${y + 5} l0 2 M${x - 3.5} ${y - 3.5} l-1.4 -1.4 M${x + 3.5} ${y + 3.5} l1.4 1.4" stroke="#4a7a30" stroke-width="1.2" stroke-linecap="round"/>`;
  return svgDoc(210, 250, `
    <path d="M92 246 C98 220 100 196 96 168 L114 168 C112 196 116 222 124 246 Z" fill="#6a4a32" ${soft('#3f2a1c', 1.6)}/>
    <path d="M96 246 C102 222 104 200 100 172 L105 172 C106 202 108 224 106 246 Z" fill="#4a3322" opacity="0.6"/>
    <g transform="translate(0 22)">${crown([[50, 118, 34], [88, 74, 42], [138, 70, 44], [170, 110, 34], [128, 118, 44], [78, 130, 38], [108, 36, 28]], DEEP_LEAF)}
    ${[[70, 150], [126, 156], [150, 134], [44, 134], [100, 112], [160, 90]].map(fruit).join('')}</g>
    <ellipse cx="105" cy="246" rx="52" ry="6" fill="#e0d4a0" opacity="0.7"/>`);
}

// A row of town houses far away: gabled facades in sunny pastel colours.
function rowFar() {
  const W = 340;
  const H = 170;
  const hs = [
    { x: 8, w: 66, h: 110, c: '#f0d28c', roof: ROOF, gable: 'step' },
    { x: 74, w: 58, h: 130, c: '#f3bdae', roof: '#b8503c', gable: 'tri' },
    { x: 132, w: 70, h: 96, c: '#cfe4c8', roof: ROOF, gable: 'tri' },
    { x: 202, w: 60, h: 124, c: '#f6e6b8', roof: '#a8483a', gable: 'step' },
    { x: 262, w: 70, h: 104, c: '#c4dcea', roof: ROOF, gable: 'tri' },
  ];
  const out = hs.map(({ x, w, h, c, roof, gable }) => {
    const top = H - h;
    const cx = x + w / 2;
    const roofPath = gable === 'step'
      ? `M${x - 2} ${top} V${top - 8} H${x + w * 0.2} V${top - 16} H${x + w * 0.36} V${top - 24} H${x + w * 0.64} V${top - 16} H${x + w * 0.8} V${top - 8} H${x + w + 2} V${top} Z`
      : `M${x - 3} ${top} L${cx} ${top - 26} L${x + w + 3} ${top} Z`;
    const wins = [];
    for (let fy = top + 14; fy < H - 24; fy += 24) {
      for (let wx = x + 11; wx < x + w - 10; wx += 17) wins.push(`<rect x="${wx}" y="${fy}" width="7" height="11" fill="#7f9db8" ${soft('#fffdf4', 1.2)}/>`);
    }
    return `<rect x="${x}" y="${top}" width="${w}" height="${h}" fill="${c}" ${soft('#a89a80', 1.2)}/>
      <path d="${roofPath}" fill="${gable === 'step' ? c : roof}" ${soft(gable === 'step' ? '#a89a80' : ROOF_LINE, 1.2)}/>
      ${wins.join('')}
      <path d="${arch(cx - 6, H - 26, 12, 26)}" fill="#7a5a48"/>`;
  });
  return svgDoc(W, H, `${out.join('')}<rect x="0" y="${H - 3}" width="${W}" height="3" fill="#b8a888"/>`);
}

// A surfer riding the standing wave of the Eisbach, a stone wall and a tree behind.
function surfer() {
  return svgDoc(190, 120, `
    <defs><linearGradient id="eb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ccdbc"/><stop offset="1" stop-color="#5aa89a"/></linearGradient></defs>
    ${crown([[140, 36, 26], [118, 24, 22], [160, 50, 20]], LEAF)}
    <path d="M0 82 V54 H190 V82 Z" fill="${STONE}" ${soft(STONE_LINE, 1.4)}/>
    <path d="M0 62 H190 M30 54 V62 M80 54 V62 M130 54 V62 M60 62 V72 M110 62 V72 M160 62 V72" stroke="${STONE_SHADE}" stroke-width="1.6"/>
    <rect y="82" width="190" height="38" fill="url(#eb)"/>
    <path d="M10 96 q10 -3 20 0 M120 108 q12 -3 24 0 M150 92 q10 -3 20 0 M20 112 q10 -3 20 0" fill="none" stroke="#c8ece0" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
    <path d="M52 112 Q62 88 82 84 Q100 82 106 96 Q112 106 136 112 Z" fill="#a8e0d0" ${soft('#4a9a8a', 1.2)}/>
    <path d="M60 104 Q74 90 96 92 Q106 94 110 104 Q96 100 84 104 Q72 108 60 104 Z" fill="#ffffff" opacity="0.92"/>
    <path d="M84 96 q-4 -6 0 -10 M96 98 q3 -7 8 -8" fill="none" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M70 90 Q92 82 114 92 L108 96 Q90 90 72 94 Z" fill="#f2a73c" ${soft('#a8641e', 1)}/>
    <path d="M86 88 L84 68 M94 88 L98 68" stroke="#2c3e50" stroke-width="4.4" stroke-linecap="round"/>
    <path d="M82 70 H100 L98 50 H86 Z" fill="#2c3e50"/>
    <path d="M86 54 L66 62 M98 54 L116 44" stroke="#2c3e50" stroke-width="3.6" stroke-linecap="round"/>
    <circle cx="92" cy="42" r="6.2" fill="#e8b890"/>
    <path d="M86 40 Q92 30 99 40 Q94 36 86 40 Z" fill="#5a3a22"/>
    <path d="M116 44 L124 18" stroke="#d9d4c0" stroke-width="1.6"/>
    <path d="M124 18 H138" stroke="#d9d4c0" stroke-width="1.6"/>
    ${groundShadow(95, 118, 60, 0.12)}`);
}

// ---- Mid: houses, stalls, beer garden ----

// A tall town house with a stepped gable, window boxes and a shop with an awning.
function townhouseA() {
  const W = 210;
  const H = 300;
  const x0 = 24;
  const w = 162;
  const gable = `M${x0 - 2} 74 V62 H${x0 + 20} V48 H${x0 + 40} V34 H${x0 + 60} V20 H${x0 + 80} L${x0 + 81} 10 L${x0 + 82} 20 H${x0 + 102} V34 H${x0 + 122} V48 H${x0 + 142} V62 H${x0 + w + 2} V74 Z`;
  const wins = [];
  [92, 146, 200].forEach((y, fi) => {
    [50, 98, 146].forEach((cx) => wins.push(windowRect(cx - 9, y, 18, 32, { shutters: fi === 1 ? '#4d8a5a' : null, box: fi < 2 })));
  });
  return svgDoc(W, H, `
    <rect x="${x0}" y="70" width="${w}" height="${H - 70}" fill="#f1d08a" ${soft('#a8864a', 1.5)}/>
    <rect x="${x0}" y="70" width="34" height="${H - 70}" fill="#d9b468" opacity="0.4"/>
    <path d="${gable}" fill="#f1d08a" ${soft('#a8864a', 1.5)}/>
    <path d="M${x0 + 60} 22 H${x0 + 104} V56 H${x0 + 60} Z" fill="#fff3d0" opacity="0.35"/>
    <path d="${arch(x0 + 66, 34, 30, 34)}" fill="${GLASS}" ${soft('#fffdf4', 2.4)}/>
    <path d="M${x0 + 81} 34 V68 M${x0 + 66} 54 H${x0 + 96}" stroke="#fffdf4" stroke-width="1.6"/>
    <path d="M${x0} 84 H${x0 + w} M${x0} 138 H${x0 + w} M${x0} 192 H${x0 + w}" stroke="#fff3d0" stroke-width="3"/>
    ${wins.join('')}
    <rect x="${x0 + 8}" y="250" width="${w - 16}" height="50" fill="#fff3d0" ${soft('#a8864a', 1)}/>
    <path d="${arch(x0 + 14, 256, 36, 44)}" fill="#6a4a3a" ${soft('#fffdf4', 2)}/>
    <path d="M${x0 + 32} 256 V300" stroke="#fffdf4" stroke-width="1.6"/>
    <rect x="${x0 + 62}" y="262" width="84" height="38" fill="${GLASS}" ${soft('#fffdf4', 2.2)}/>
    <path d="M${x0 + 62} 262 H${x0 + 146} L${x0 + 152} 240 H${x0 + 56} Z" fill="${BLUE}" ${soft(BLUE_DARK, 1.2)}/>
    <path d="M${x0 + 62} 240 L${x0 + 74} 262 M${x0 + 90} 240 L${x0 + 98} 262 M${x0 + 118} 240 L${x0 + 122} 262 M${x0 + 144} 240 L${x0 + 146} 262" stroke="#ffffff" stroke-width="7"/>
    <path d="M${x0 + 56} 240 H${x0 + 152}" stroke="${BLUE_DARK}" stroke-width="1.5"/>
    ${[0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${x0 + 70 + i * 13}" cy="${275}" r="4" fill="${['#e5484d', '#f6c85a', '#8cc65c', '#e5484d', '#f2a73c', '#8cc65c'][i]}"/>`).join('')}
    ${groundShadow(105, H - 1, 95)}`);
}

// A pastel house with a bay window under a copper cone, hipped roof with dormers and green shutters.
function townhouseB() {
  const W = 230;
  const H = 280;
  const wins = [];
  [138, 196].forEach((y, fi) => {
    [112, 152, 186].forEach((cx) => wins.push(windowRect(cx - 9, y, 18, 30, { shutters: '#4d8a5a', box: fi === 0 })));
  });
  return svgDoc(W, H, `
    <path d="M24 108 L44 40 H186 L206 108 Z" fill="${ROOF}" ${soft(ROOF_LINE, 1.6)}/>
    <path d="M24 108 L44 40 H100 L84 108 Z" fill="${ROOF_LIGHT}" opacity="0.45"/>
    ${[56, 70, 84, 98].map((y) => `<path d="M${f1(24 + (108 - y) * 0.1)} ${y} H${f1(206 - (108 - y) * 0.1)}" stroke="${ROOF_LINE}" stroke-width="1" opacity="0.45"/>`).join('')}
    <rect x="144" y="26" width="9" height="18" fill="#b89a86" ${soft('#7a5a48', 1)}/>
    ${[78, 152].map((x) => `<rect x="${x}" y="64" width="30" height="34" fill="#f4e2c4" ${soft('#a8864a', 1.2)}/><path d="M${x - 4} 66 L${x + 15} 48 L${x + 34} 66 Z" fill="${ROOF}" ${soft(ROOF_LINE, 1.2)}/><rect x="${x + 7}" y="72" width="16" height="20" fill="${GLASS}" ${soft('#fffdf4', 1.8)}/>`).join('')}
    <rect x="24" y="108" width="182" height="${H - 108}" fill="#f2c4b4" ${soft('#b8806e', 1.5)}/>
    <rect x="24" y="108" width="30" height="${H - 108}" fill="#d9a090" opacity="0.4"/>
    <path d="M24 122 H206" stroke="#fff3e6" stroke-width="3"/>
    ${wins.join('')}
    <path d="M32 134 H82 V212 H32 Z" fill="#f6d4c6" ${soft('#b8806e', 1.3)}/>
    <path d="M30 134 L57 100 L84 134 Z" fill="${COPPER}" ${soft(COPPER_LINE, 1.4)}/>
    <path d="M30 134 L57 100 L57 134 Z" fill="${COPPER_LIGHT}" opacity="0.6"/>
    <path d="M57 100 V92" stroke="${GOLD_LINE}" stroke-width="2"/><circle cx="57" cy="90" r="2.6" fill="${GOLD}"/>
    ${[38, 56].map((x) => `<rect x="${x}" y="150" width="14" height="32" fill="${GLASS}" ${soft('#fffdf4', 1.8)}/>`).join('')}
    <path d="M52 150 V182 M38 166 H70" stroke="#fffdf4" stroke-width="1.4"/>
    ${flowerBox(34, 182, 46)}
    <path d="M24 226 H206" stroke="#fff3e6" stroke-width="3"/>
    <path d="${arch(40, 234, 30, 46)}" fill="#6a4a3a" ${soft('#fff3e6', 2)}/>
    <rect x="96" y="238" width="96" height="42" fill="${GLASS}" ${soft('#fff3e6', 2.2)}/>
    <path d="M96 258 H192 M144 238 V280" stroke="#fff3e6" stroke-width="1.6"/>
    <path d="M92 238 H196 V228 H92 Z" fill="#4d8a5a" ${soft('#2f5a3a', 1)}/>
    ${groundShadow(115, H - 1, 100)}`);
}

// A market stall with a white and blue striped awning: pretzels, rolls and bread on the counter.
function marketStall() {
  const W = 240;
  const H = 200;
  const stripes = [];
  const n = 12;
  for (let i = 0; i < n; i++) {
    const xt0 = 40 + (i * 160) / n;
    const xt1 = 40 + ((i + 1) * 160) / n;
    const xb0 = 18 + (i * 204) / n;
    const xb1 = 18 + ((i + 1) * 204) / n;
    stripes.push(`<path d="M${f1(xt0)} 30 L${f1(xt1)} 30 L${f1(xb1)} 70 L${f1(xb0)} 70 Z" fill="${i % 2 ? BLUE : '#ffffff'}"/>`);
  }
  const scallops = [];
  for (let i = 0; i < n; i++) {
    const xb0 = 18 + (i * 204) / n;
    const xb1 = 18 + ((i + 1) * 204) / n;
    scallops.push(`<path d="M${f1(xb0)} 70 Q${f1((xb0 + xb1) / 2)} 86 ${f1(xb1)} 70 Z" fill="${i % 2 ? BLUE : '#ffffff'}" ${soft(BLUE_DARK, 1)}/>`);
  }
  const pretzels = [60, 100, 140, 180].map((x, i) => `<path d="M${x - 9} ${106 + (i % 2) * 4} C${x - 13} ${94 + (i % 2) * 4} ${x - 2} ${92 + (i % 2) * 4} ${x} ${99 + (i % 2) * 4} C${x + 2} ${92 + (i % 2) * 4} ${x + 13} ${94 + (i % 2) * 4} ${x + 9} ${106 + (i % 2) * 4} C${x + 5} ${110 + (i % 2) * 4} ${x - 5} ${110 + (i % 2) * 4} ${x - 9} ${106 + (i % 2) * 4} Z M${x - 6} ${99 + (i % 2) * 4} L${x + 6} ${107 + (i % 2) * 4} M${x + 6} ${99 + (i % 2) * 4} L${x - 6} ${107 + (i % 2) * 4}" fill="none" stroke="#a8641e" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>`);
  return svgDoc(W, H, `
    <defs><clipPath id="sp"><rect x="76" y="144" width="88" height="34" rx="3"/></clipPath></defs>
    <path d="M30 70 V${H - 1} M210 70 V${H - 1}" stroke="${WOOD_DARK}" stroke-width="7" stroke-linecap="round"/>
    <rect x="34" y="70" width="172" height="58" fill="#f6e8c8" opacity="0.5"/>
    <path d="M44 84 q12 8 24 0 M66 90 V112 M130 84 q12 8 24 0" fill="none" stroke="#a8864a" stroke-width="1.5" opacity="0.6"/>
    <path d="M60 66 V92 M116 66 V90 M170 66 V92" stroke="#6a5a4a" stroke-width="1.2"/>
    ${[[60, 98], [116, 96], [170, 98]].map(([x, y]) => `<path d="M${x - 11} ${y} Q${x} ${y + 12} ${x + 11} ${y} Z" fill="#d89a4a" ${soft('#8a5a22', 1)}/><path d="M${x - 5} ${y + 2} l2 4 M${x + 1} ${y + 2} l2 5" stroke="#8a5a22" stroke-width="1"/>`).join('')}
    ${stripes.join('')}
    <path d="M40 30 H200" stroke="${BLUE_DARK}" stroke-width="2"/>
    ${scallops.join('')}
    <rect x="22" y="124" width="196" height="12" rx="2" fill="${WOOD_LIGHT}" ${soft(WOOD_LINE, 1.4)}/>
    <rect x="28" y="136" width="184" height="${H - 136}" fill="${WOOD}" ${soft(WOOD_LINE, 1.4)}/>
    <path d="M28 150 H212 M28 166 H212 M28 182 H212" stroke="${WOOD_LINE}" stroke-width="1.2" opacity="0.55"/>
    <rect x="76" y="144" width="88" height="34" rx="3" fill="${BLUE}" ${soft(BLUE_DARK, 1.2)}/>
    <g clip-path="url(#sp)"><path d="${lozenges(76, 144, 88, 34, 8)}" fill="#ffffff" opacity="0.9"/></g>
    ${[[40, 122], [200, 122]].map(([x, y]) => `<path d="M${x - 14} ${y} H${x + 14} L${x + 11} ${y - 14} H${x - 11} Z" fill="#c89a62" ${soft('#8a5e38', 1.2)}/>${[-6, 0, 6].map((d, i) => `<ellipse cx="${x + d}" cy="${y - 14}" rx="5" ry="3.6" fill="#d89a4a" ${soft('#8a5a22', 0.9)}/>`).join('')}`).join('')}
    <path d="M50 ${H - 1} h26 M164 ${H - 1} h26" stroke="${WOOD_LINE}" stroke-width="1" opacity="0"/>
    ${groundShadow(120, H - 1, 100)}`);
}

// A fruit and vegetable stand: tiered baskets of apples, pears, tomatoes and radishes, a green and white awning.
function fruitStand() {
  const W = 220;
  const H = 190;
  const fruits = (x, y, n, c, c2, r = 5) => Array.from({ length: n }, (_, i) => `<circle cx="${x + i * (r * 1.8)}" cy="${y - (i % 2) * 3}" r="${r}" fill="${c}" ${soft(c2, 0.9)}/>`).join('');
  const tray = (x, y, w, fill) => `<path d="M${x} ${y} H${x + w} L${x + w - 6} ${y + 16} H${x + 6} Z" fill="${fill}" ${soft(WOOD_LINE, 1.2)}/><path d="M${x + 3} ${y + 5} H${x + w - 3}" stroke="${WOOD_LINE}" stroke-width="0.9" opacity="0.5"/>`;
  const stripes = [];
  for (let i = 0; i < 10; i++) {
    const xt0 = 40 + (i * 140) / 10;
    const xb0 = 14 + (i * 192) / 10;
    stripes.push(`<path d="M${f1(xt0)} 26 L${f1(xt0 + 14)} 26 L${f1(xb0 + 19.2)} 62 L${f1(xb0)} 62 Z" fill="${i % 2 ? '#5c9a46' : '#ffffff'}"/>`);
  }
  const scallops = Array.from({ length: 10 }, (_, i) => {
    const xb0 = 14 + (i * 192) / 10;
    return `<path d="M${f1(xb0)} 62 Q${f1(xb0 + 9.6)} 76 ${f1(xb0 + 19.2)} 62 Z" fill="${i % 2 ? '#5c9a46' : '#ffffff'}" ${soft('#3a6a30', 1)}/>`;
  });
  return svgDoc(W, H, `
    <path d="M26 62 V${H - 1} M194 62 V${H - 1}" stroke="${WOOD_DARK}" stroke-width="6" stroke-linecap="round"/>
    ${stripes.join('')}${scallops.join('')}
    <path d="M40 26 H180" stroke="#3a6a30" stroke-width="2"/>
    ${[48, 80, 112, 144].map((x) => `<path d="M${x} 66 V82" stroke="#6a5a4a" stroke-width="1.2"/><circle cx="${x}" cy="86" r="4" fill="#f6c85a" ${soft('#a8801c', 0.8)}/>`).join('')}
    <path d="M24 ${H - 54} H196 V${H - 2} H24 Z" fill="${WOOD}" ${soft(WOOD_LINE, 1.4)}/>
    <path d="M24 ${H - 38} H196 M24 ${H - 22} H196" stroke="${WOOD_LINE}" stroke-width="1.2" opacity="0.5"/>
    ${tray(32, 96, 70, '#d6a874')}${tray(118, 96, 70, '#d6a874')}
    ${fruits(42, 94, 6, '#e5484d', '#8b1d1d')}${fruits(128, 94, 6, '#8cc65c', '#4a7a30')}
    ${tray(44, 122, 70, '#d6a874')}${tray(124, 122, 56, '#d6a874')}
    ${fruits(52, 120, 6, '#f2a73c', '#a8641e')}${fruits(132, 120, 4, '#c0392b', '#7a1f18')}
    <path d="M24 ${H - 56} H196" stroke="${WOOD_LIGHT}" stroke-width="6"/>
    ${[[34, 150], [64, 152], [94, 150], [124, 152], [154, 150]].map(([x, y], i) => `<ellipse cx="${x + 10}" cy="${y}" rx="14" ry="7" fill="${['#e5484d', '#f2d24a', '#7aae4a', '#e8742a', '#8a4a8a'][i]}" ${soft('#4a3322', 0.9)}/>`).join('')}
    ${groundShadow(110, H - 1, 96)}`);
}

// A beer garden table under a white and blue parasol, with benches, mugs and a pretzel.
function beerTable() {
  const W = 250;
  const H = 210;
  return svgDoc(W, H, `
    <path d="M125 44 V120" stroke="${WOOD_DARK}" stroke-width="5" stroke-linecap="round"/>
    <defs><clipPath id="pa"><path d="M20 78 Q125 -16 230 78 Z"/></clipPath></defs>
    <path d="M20 78 Q125 -16 230 78 Z" fill="#ffffff"/>
    <g clip-path="url(#pa)"><path d="${lozenges(14, 16, 224, 70, 16)}" fill="${BLUE}"/></g>
        <path d="M20 78 Q38 90 62 78 Q82 92 104 78 Q126 92 148 78 Q170 92 190 78 Q212 88 230 78 Q218 64 210 62 H40 Q30 64 20 78 Z" fill="#ffffff" ${soft(BLUE_DARK, 1.2)}/>
    <circle cx="125" cy="22" r="3" fill="${GOLD}"/>
    <path d="M40 118 H210 V128 H40 Z" fill="${WOOD_LIGHT}" ${soft(WOOD_LINE, 1.4)}/>
    <path d="M48 128 L40 ${H - 8} M202 128 L210 ${H - 8}" stroke="${WOOD_DARK}" stroke-width="5" stroke-linecap="round"/>
    <path d="M30 156 H220 V164 H30 Z" fill="${WOOD}" ${soft(WOOD_LINE, 1.3)}/>
    <path d="M36 164 V${H - 6} M214 164 V${H - 6}" stroke="${WOOD_DARK}" stroke-width="4.4" stroke-linecap="round"/>
    ${[[70, 118], [150, 118], [182, 118]].map(([x, y]) => `<path d="M${x - 8} ${y - 24} H${x + 8} V${y} H${x - 8} Z" fill="#ffd05a" ${soft('#a8801c', 1)}/><path d="M${x + 8} ${y - 19} q8 0 8 9 q0 6 -8 6" fill="none" stroke="#e8e4d8" stroke-width="2.6"/><path d="M${x - 9} ${y - 24} q2 -8 9 -5 q7 -3 9 5 Z" fill="#ffffff" ${soft('#d8d0b8', 0.8)}/><path d="M${x - 4} ${y - 18} V${y - 4}" stroke="#fff3c4" stroke-width="2" stroke-linecap="round"/>`).join('')}
    <path d="M98 ${118 - 6} C94 ${118 - 18} 106 ${118 - 20} 108 ${118 - 12} C110 ${118 - 20} 122 ${118 - 18} 118 ${118 - 6} C114 ${118 - 2} 102 ${118 - 2} 98 ${118 - 6} Z" fill="none" stroke="#a8641e" stroke-width="3.2" stroke-linecap="round"/>
    ${groundShadow(125, H - 2, 112)}`);
}

// ---- Near: low plants, a bench, a lamp, flower buckets ----

// Wild flowers of the meadow: buttercups, daisies and harebells.
function meadowFlowers() {
  const flower = (x, y, c, r = 4) => `<path d="M${x} 66 Q${x + 2} ${y + 16} ${x} ${y}" fill="none" stroke="#6a9a48" stroke-width="2.2" stroke-linecap="round"/>
    ${[0, 72, 144, 216, 288].map((a) => `<circle cx="${f1(x + Math.cos((a * Math.PI) / 180) * r)}" cy="${f1(y + Math.sin((a * Math.PI) / 180) * r)}" r="${f1(r * 0.82)}" fill="${c}"/>`).join('')}
    <circle cx="${x}" cy="${y}" r="${f1(r * 0.6)}" fill="#f2a73c"/>`;
  const bell = (x, y) => `<path d="M${x} 66 Q${x + 4} ${y + 14} ${x} ${y}" fill="none" stroke="#6a9a48" stroke-width="2" stroke-linecap="round"/><path d="M${x - 4} ${y + 2} Q${x} ${y - 8} ${x + 4} ${y + 2} Z" fill="#8a7ad0"/>`;
  return svgDoc(110, 72, `
    <path d="M4 68 Q24 54 44 66 Q68 52 106 68" fill="none" stroke="#7aa850" stroke-width="5" stroke-linecap="round"/>
    ${flower(18, 38, '#f6d84a')}${flower(40, 26, '#ffffff')}${flower(62, 34, '#f6d84a', 3.4)}${flower(84, 24, '#ffffff', 3.6)}${flower(96, 44, '#f6d84a', 3.4)}
    ${bell(30, 44)}${bell(52, 40)}${bell(74, 46)}`);
}

// A park bench with wooden slats and iron ends, light and thin.
function bench() {
  return svgDoc(140, 84, `
    <path d="M14 70 V44 Q14 36 22 36 M126 70 V44 Q126 36 118 36" fill="none" stroke="#6a727c" stroke-width="4.6" stroke-linecap="round"/>
    <path d="M18 70 V50 M122 70 V50" stroke="#6a727c" stroke-width="4" stroke-linecap="round"/>
    <rect x="14" y="14" width="112" height="7" rx="2" fill="${WOOD_LIGHT}" ${soft(WOOD_LINE, 1)}/>
    <rect x="14" y="25" width="112" height="7" rx="2" fill="${WOOD_LIGHT}" ${soft(WOOD_LINE, 1)}/>
    <rect x="10" y="44" width="120" height="7" rx="2" fill="${WOOD}" ${soft(WOOD_LINE, 1.1)}/>
    <rect x="10" y="53" width="120" height="6" rx="2" fill="${WOOD}" ${soft(WOOD_LINE, 1.1)}/>
    <path d="M26 14 V36 M114 14 V36" stroke="#6a727c" stroke-width="3.6" stroke-linecap="round"/>
    ${groundShadow(70, 80, 62, 0.16)}`);
}

// A tall flower stand: a slim iron post with a bowl of red geraniums on top. It stands high and
// thin, so nobody takes it for something to jump over.
function geraniums() {
  const blooms = [[24, 34], [40, 24], [56, 32], [68, 40], [32, 46], [58, 50], [46, 40]];
  return svgDoc(92, 150, `
    <path d="M46 74 V146 M46 118 L30 146 M46 118 L62 146" fill="none" stroke="#3e5a52" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M36 112 H56" stroke="#3e5a52" stroke-width="2.4" stroke-linecap="round"/>
    ${crown([[26, 46, 14], [46, 40, 17], [66, 46, 14]], { ...LEAF, line: '#4a7a3a' })}
    <path d="M14 56 Q10 76 20 90 M78 56 Q82 76 72 90" fill="none" stroke="#5c9a46" stroke-width="4" stroke-linecap="round"/>
    ${blooms.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="6.2" fill="${['#e5484d', '#f2788a', '#d83a45'][i % 3]}" ${soft('#a8242e', 0.9)}/><circle cx="${x - 2}" cy="${y - 2}" r="1.9" fill="#ffffff" opacity="0.5"/>`).join('')}
    <circle cx="16" cy="78" r="4.4" fill="#f2788a"/><circle cx="76" cy="80" r="4.4" fill="#e5484d"/>
    <path d="M22 60 H70 Q68 76 46 80 Q24 76 22 60 Z" fill="#4a6a62" ${soft('#2f4a42', 1.3)}/>
    <path d="M24 64 H68" stroke="#7a9a90" stroke-width="2" opacity="0.7"/>
    ${groundShadow(46, 147, 24, 0.16)}`);
}

// A cast-iron street lamp of the old town: tall and slim, so nobody takes it for a hurdle.
function lamp() {
  return svgDoc(56, 200, `
    <defs><radialGradient id="lg"><stop offset="0" stop-color="#fff0b0" stop-opacity="0.8"/><stop offset="1" stop-color="#ffe08a" stop-opacity="0"/></radialGradient></defs>
    <circle cx="28" cy="34" r="26" fill="url(#lg)"/>
    <path d="M28 196 V60" stroke="#3e5a52" stroke-width="5" stroke-linecap="round"/>
    <path d="M20 196 Q24 184 26 176 H30 Q32 184 36 196 Z" fill="#3e5a52" ${soft('#26403a', 1)}/>
    <path d="M22 150 H34 L33 142 H23 Z" fill="#3e5a52"/>
    <path d="M24 66 H32 V58 H24 Z" fill="#3e5a52"/>
    <path d="M18 56 L21 26 H35 L38 56 Z" fill="#fff0b0" ${soft('#3e5a52', 2.2)}/>
    <path d="M24 30 L22 54" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" opacity="0.7"/>
    <path d="M15 28 L28 12 L41 28 Z" fill="#3e5a52" ${soft('#26403a', 1.2)}/>
    <circle cx="28" cy="10" r="3" fill="#3e5a52"/>
    <path d="M28 120 Q16 118 14 106 M28 120 Q40 118 42 106" fill="none" stroke="#3e5a52" stroke-width="2.4" stroke-linecap="round"/>
    ${groundShadow(28, 197, 16, 0.18)}`);
}

// Buckets of cut flowers: sunflowers, dahlias and asters.
function flowerBuckets() {
  const flower = (x, y, c, r, core) => `<path d="M${x} ${y} V70" stroke="#5c8a3a" stroke-width="2.4" stroke-linecap="round"/>
    ${Array.from({ length: 10 }, (_, i) => `<ellipse cx="${f1(x + Math.cos((i * 36 * Math.PI) / 180) * r)}" cy="${f1(y + Math.sin((i * 36 * Math.PI) / 180) * r)}" rx="${f1(r * 0.62)}" ry="${f1(r * 0.34)}" fill="${c}" transform="rotate(${i * 36} ${f1(x + Math.cos((i * 36 * Math.PI) / 180) * r)} ${f1(y + Math.sin((i * 36 * Math.PI) / 180) * r)})"/>`).join('')}
    <circle cx="${x}" cy="${y}" r="${f1(r * 0.62)}" fill="${core}"/>`;
  const bucket = (x, w) => `<path d="M${x} 66 H${x + w} L${x + w - 5} 100 H${x + 5} Z" fill="#b4c0c8" ${soft('#7a8890', 1.2)}/><path d="M${x + 3} 74 H${x + w - 3}" stroke="#c4ccd4" stroke-width="2" opacity="0.8"/>`;
  return svgDoc(130, 116, `<g transform="translate(0 8)">
    ${flower(24, 22, '#f6c21a', 11, '#6a4a22')}${flower(50, 12, '#f6c21a', 12, '#6a4a22')}${flower(80, 26, '#f6c21a', 10, '#6a4a22')}
    ${flower(36, 40, '#e8567a', 8, '#f6d84a')}${flower(66, 44, '#c46ad0', 8, '#f6d84a')}${flower(100, 40, '#8a7ad0', 7, '#f6d84a')}${flower(112, 56, '#ffffff', 6, '#f6c21a')}
    ${bucket(8, 46)}${bucket(58, 42)}${bucket(102, 22)}
    ${groundShadow(65, 102, 56, 0.16)}</g>`);
}

// ---- Strips: a clipped hedge and a garland of white and blue pennants ----

// A low clipped hedge; the top edge repeats exactly, so the strip joins without a seam.
function hedgeStrip() {
  const w = 156;
  const pts = [];
  for (let x = -10; x <= w + 10; x += 4) pts.push([x, 26 + 2.6 * Math.sin((2 * Math.PI * 6 * x) / w) + 0.9 * Math.sin((2 * Math.PI * 12 * x) / w)]);
  const dots = [];
  for (let i = 0; i < 26; i++) dots.push(`<circle cx="${(i * 37) % w}" cy="${36 + ((i * 17) % 20)}" r="${2 + (i % 3)}" fill="${i % 2 ? '#8cc65c' : '#4a8a3a'}" opacity="0.7"/>`);
  const blooms = [14, 52, 90, 128].map((x, i) => `<circle cx="${x}" cy="${34 + (i % 2) * 8}" r="2.6" fill="${i % 2 ? '#ffffff' : '#f6c4d0'}"/>`);
  return svgDoc(w, 70, `
    <defs><linearGradient id="hg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6aa650"/><stop offset="1" stop-color="#4a8a3a"/></linearGradient></defs>
    <path d="M-10 70 ${pts.map(([x, y]) => `L${x} ${f1(y)}`).join(' ')} L${w + 10} 70 Z" fill="url(#hg)"/>
    <path d="M${pts.map(([x, y]) => `${x} ${f1(y + 2)}`).join(' L')}" fill="none" stroke="#a8d878" stroke-width="3" opacity="0.8"/>
    <path d="M${pts.map(([x, y]) => `${x} ${f1(y)}`).join(' L')}" fill="none" stroke="#3a6a34" stroke-width="1.6" opacity="0.7"/>
    ${dots.join('')}${blooms.join('')}`);
}

// A garland of pennants between posts; the rope sags between the posts and is level at both
// edges, so the strip joins without a seam.
function buntingStrip() {
  const w = 156;
  const cubic = (p0, p1, p2, p3, t) => {
    const u = 1 - t;
    return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
  };
  // Height of the rope at x on the left half (the right half mirrors it).
  const ropeY = (x) => {
    let best = 30;
    let bestDx = 1e9;
    for (let i = 0; i <= 200; i++) {
      const t = i / 200;
      const dx = Math.abs(cubic(0, 40, 62, 78, t) - x);
      if (dx < bestDx) { bestDx = dx; best = cubic(30, 30, 24, 12, t); }
    }
    return best;
  };
  const flags = [12, 28, 44, 60, 96, 112, 128, 144].map((x, i) => {
    const y = ropeY(x < 78 ? x : w - x);
    return `<path d="M${f1(x - 4.6)} ${f1(y)} L${f1(x + 4.6)} ${f1(y)} L${f1(x)} ${f1(y + 12)} Z" fill="${i % 2 ? BLUE : '#ffffff'}" ${soft(BLUE_DARK, 0.7)}/>`;
  });
  return svgDoc(w, 70, `
    <path d="M78 66 V8" stroke="#b08a5e" stroke-width="5" stroke-linecap="round"/>
    <circle cx="78" cy="7" r="3" fill="${GOLD}"/>
    <path d="M0 30 C40 30 62 24 78 12 C94 24 116 30 156 30" fill="none" stroke="#d8c8a8" stroke-width="2"/>
    ${flags.join('')}`);
}

// ---- All pieces ----

const PIECES = {
  'hills-far-muenchen': [GAME_WIDTH, 220, hillsFar],
  'hills-near-muenchen': [GAME_WIDTH, 140, hillsNear],
  'mu-chinese-tower': [200, 262 + FOOT_GAP, chineseTower],
  'mu-monopteros': [260, 262 + FOOT_GAP, monopteros],
  'mu-rathaus': [380, 300 + FOOT_GAP, rathaus],
  'mu-frauenkirche': [270, 290 + FOOT_GAP, frauenkirche],
  'mu-mariensaeule': [110, 300 + FOOT_GAP, mariensaeule],
  'mu-alter-peter': [160, 290 + FOOT_GAP, alterPeter],
  'mu-maibaum': [130, 340 + FOOT_GAP, maibaum],
  'mu-big-tree': [270, 280, bigTree],
  'mu-chestnut': [210, 250, chestnut],
  'mu-linden': [130, 140, linden],
  'mu-row-far': [340, 170, rowFar],
  'mu-surfer': [190, 120, surfer],
  'mu-townhouse-a': [210, 300, townhouseA],
  'mu-townhouse-b': [230, 280, townhouseB],
  'mu-market-stall': [240, 200, marketStall],
  'mu-fruit-stand': [220, 190, fruitStand],
  'mu-beer-table': [250, 210, beerTable],
  'mu-meadow-flowers': [110, 72, meadowFlowers],
  'mu-bench': [140, 84, bench],
  'mu-geraniums': [92, 150, geraniums],
  'mu-lamp': [56, 200, lamp],
  'mu-flower-buckets': [130, 116, flowerBuckets],
  'mu-strip-hedge': [156, 70, hedgeStrip],
  'mu-strip-bunting': [156, 70, buntingStrip],
};

export function muenchenSvgs() {
  return Object.fromEntries(Object.entries(PIECES).map(([key, [w, h, draw]]) => [key, { w, h, svg: draw() }]));
}

export function preloadMuenchen(scene) {
  for (const [key, { w, h, svg }] of Object.entries(muenchenSvgs())) loadSvg(scene, key, svg, w, h);
}
