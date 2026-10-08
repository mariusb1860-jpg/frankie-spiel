import { GAME_WIDTH, GAME_HEIGHT } from '../config.js';
import { OUTLINE as LINE, loadSvg, svgDoc } from './svg.js';

// Everything except Frankie: sausages, landscape, obstacles, buttons. All drawn with code:
// the detailed pieces as SVG, the simple ones with Phaser graphics.
const OUTLINE = 0x4a2c17;

export function createWorldTextures(scene) {
  make(scene, 'sky', GAME_WIDTH, GAME_HEIGHT, drawSky);
  make(scene, 'sun', 130, 130, drawSun);
  make(scene, 'clouds', 640, 160, drawClouds);
  make(scene, 'hills', 640, 200, drawHills);
  make(scene, 'bushes', 512, 110, drawBushes);
  make(scene, 'ground', 128, 80, drawGround);
  make(scene, 'house', 190, 180, drawHouse);
  make(scene, 'bowl', 110, 44, drawBowl);
  make(scene, 'heart', 40, 36, drawHeart);
  make(scene, 'sparkle', 28, 28, drawSparkle);
  make(scene, 'crumb', 10, 10, (g) => { g.fillStyle(0xb5562f, 1); g.fillCircle(5, 5, 4); });
  make(scene, 'drop', 12, 12, (g) => { g.fillStyle(0x5fb4ff, 1); g.fillCircle(6, 6, 5); });
  make(scene, 'btn-play', 170, 170, drawPlayButton);
  make(scene, 'btn-replay', 170, 170, drawReplayButton);
  make(scene, 'icon-sound-on', 72, 72, (g) => drawSpeaker(g, true));
  make(scene, 'icon-sound-off', 72, 72, (g) => drawSpeaker(g, false));
}

function make(scene, key, w, h, draw) {
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  draw(g, w, h);
  g.generateTexture(key, w, h);
  g.destroy();
}

function drawSky(g, w, h) {
  const top = [0x6ec1f5, 0xd9f2ff];
  const steps = 54;
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    g.fillStyle(lerpColor(top[0], top[1], t), 1);
    g.fillRect(0, Math.floor((h / steps) * i), w, Math.ceil(h / steps) + 1);
  }
}

function drawSun(g) {
  g.fillStyle(0xfff3a0, 0.5);
  g.fillCircle(65, 65, 62);
  g.fillStyle(0xffd84d, 1);
  g.fillCircle(65, 65, 44);
}

function drawClouds(g) {
  g.fillStyle(0xffffff, 0.95);
  for (const [x, y, s] of [[80, 70, 1], [330, 40, 0.8], [520, 95, 1.1]]) {
    g.fillCircle(x, y, 26 * s);
    g.fillCircle(x + 30 * s, y - 12 * s, 32 * s);
    g.fillCircle(x + 64 * s, y, 26 * s);
    g.fillRoundedRect(x - 10 * s, y, 92 * s, 24 * s, 12 * s);
  }
}

function drawHills(g, w, h) {
  hillLayer(g, w, h, 0xb9e58c, 95, [[30, 1], [14, 3]]);
  hillLayer(g, w, h, 0x9ed672, 130, [[22, 2], [10, 5]]);
}

// Tileable hills: every wave repeats a whole number of times across the width.
function hillLayer(g, w, h, color, base, waves) {
  const pts = [{ x: 0, y: h }];
  for (let x = 0; x <= w; x += 8) {
    let y = base;
    for (const [amp, k] of waves) y -= amp * Math.sin((2 * Math.PI * k * x) / w);
    pts.push({ x, y });
  }
  pts.push({ x: w, y: h });
  g.fillStyle(color, 1);
  g.fillPoints(pts, true);
}

function drawBushes(g) {
  const flowers = [0xff6b9a, 0xffd54f, 0xffffff, 0xb388ff];
  let f = 0;
  for (const [x, s] of [[60, 1], [190, 0.8], [330, 1.15], [450, 0.75]]) {
    const y = 90;
    g.fillStyle(0x4caf50, 1);
    g.fillCircle(x - 28 * s, y - 14 * s, 24 * s);
    g.fillCircle(x + 28 * s, y - 14 * s, 24 * s);
    g.fillCircle(x, y - 30 * s, 32 * s);
    g.fillRect(x - 50 * s, y - 16 * s, 100 * s, 36 * s);
    g.fillStyle(0x66c56b, 1);
    g.fillCircle(x - 8 * s, y - 40 * s, 12 * s);
    for (const [dx, dy] of [[-30, -18], [5, -30], [30, -12], [-10, -6]]) {
      g.fillStyle(flowers[f++ % flowers.length], 1);
      g.fillCircle(x + dx * s, y + dy * s, 5 * s);
    }
  }
}

function drawGround(g, w, h) {
  g.fillStyle(0x9c6b3e, 1);
  g.fillRect(0, 0, w, h);
  g.fillStyle(0x87592f, 1);
  for (const [x, y, r] of [[20, 44, 5], [70, 60, 4], [104, 38, 6], [44, 70, 3], [90, 72, 4]]) g.fillCircle(x, y, r);
  g.fillStyle(0x4a9e30, 1);
  g.fillRect(0, 0, w, 20);
  for (let x = 8; x < w; x += 16) g.fillCircle(x, 20, 8);
  g.fillStyle(0x6cc94a, 1);
  g.fillRect(0, 0, w, 14);
  for (let x = 0; x <= w; x += 16) g.fillCircle(x, 14, 7);
}

function drawHouse(g) {
  g.lineStyle(4, OUTLINE, 1);
  // Walls
  g.fillStyle(0x4f8fd6, 1);
  g.fillRect(22, 66, 146, 110);
  g.strokeRect(22, 66, 146, 110);
  // Door
  g.fillStyle(0x3a2414, 1);
  g.fillRect(65, 112, 60, 64);
  g.fillCircle(95, 112, 30);
  // Name plate
  g.fillStyle(0xfff3d6, 1);
  g.fillRoundedRect(55, 74, 80, 22, 6);
  g.strokeRoundedRect(55, 74, 80, 22, 6);
  // Roof
  const roof = [{ x: 4, y: 76 }, { x: 95, y: 6 }, { x: 186, y: 76 }, { x: 172, y: 84 }, { x: 95, y: 26 }, { x: 18, y: 84 }];
  g.fillStyle(0xd63d2e, 1);
  g.fillPoints(roof, true);
  g.strokePoints(roof, true);
}

function drawBowl(g) {
  g.lineStyle(3, OUTLINE, 1);
  const pts = [{ x: 6, y: 12 }, { x: 104, y: 12 }, { x: 90, y: 40 }, { x: 20, y: 40 }];
  g.fillStyle(0x3a7bd5, 1);
  g.fillPoints(pts, true);
  g.strokePoints(pts, true);
  g.fillStyle(0x7fb2f0, 1);
  g.fillEllipse(55, 12, 98, 14);
  g.strokeEllipse(55, 12, 98, 14);
  g.fillStyle(0xffffff, 1);
  g.fillCircle(55, 27, 6);
}

function drawHeart(g) {
  g.fillStyle(0xff4d6d, 1);
  g.fillCircle(12, 12, 10);
  g.fillCircle(28, 12, 10);
  g.fillTriangle(3, 16, 37, 16, 20, 34);
  g.fillStyle(0xffffff, 0.7);
  g.fillCircle(9, 9, 3);
}

function drawSparkle(g) {
  const pts = [];
  for (let i = 0; i < 8; i++) {
    const r = i % 2 === 0 ? 13 : 5;
    const a = (Math.PI / 4) * i - Math.PI / 2;
    pts.push({ x: 14 + r * Math.cos(a), y: 14 + r * Math.sin(a) });
  }
  g.fillStyle(0xffe066, 1);
  g.fillPoints(pts, true);
}

function roundButton(g, color) {
  g.fillStyle(0x000000, 0.2);
  g.fillCircle(85, 90, 76);
  g.fillStyle(color, 1);
  g.fillCircle(85, 82, 76);
  g.lineStyle(8, 0xffffff, 1);
  g.strokeCircle(85, 82, 72);
}

function drawPlayButton(g) {
  roundButton(g, 0x43b047);
  g.fillStyle(0xffffff, 1);
  g.fillTriangle(66, 46, 66, 118, 124, 82);
}

function drawReplayButton(g) {
  roundButton(g, 0xff9800);
  g.lineStyle(14, 0xffffff, 1);
  g.beginPath();
  g.arc(85, 82, 36, Math.PI * 0.15, Math.PI * 1.65);
  g.strokePath();
  g.fillStyle(0xffffff, 1);
  // Arrow head at the end of the arc
  g.fillTriangle(98, 26, 130, 52, 96, 66);
}

function drawSpeaker(g, on) {
  g.fillStyle(0xffffff, 0.85);
  g.fillCircle(36, 36, 32);
  g.fillStyle(0x37474f, 1);
  g.fillRect(16, 28, 10, 16);
  g.fillTriangle(24, 36, 40, 18, 40, 54);
  g.fillRect(24, 28, 6, 16);
  g.lineStyle(4, 0x37474f, 1);
  if (on) {
    g.beginPath();
    g.arc(42, 36, 8, -Math.PI / 3, Math.PI / 3);
    g.strokePath();
    g.beginPath();
    g.arc(42, 36, 15, -Math.PI / 3, Math.PI / 3);
    g.strokePath();
  } else {
    g.lineStyle(5, 0xe53935, 1);
    g.lineBetween(46, 26, 60, 46);
    g.lineBetween(60, 26, 46, 46);
  }
}

function lerpColor(a, b, t) {
  const ch = (c, s) => (c >> s) & 0xff;
  const mix = (s) => Math.round(ch(a, s) + (ch(b, s) - ch(a, s)) * t);
  return (mix(16) << 16) | (mix(8) << 8) | mix(0);
}

const line = `stroke="${LINE}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
const SAUSAGE_PATH = 'M8 15 C8 9 14 7 20 8 C28 10 34 10 42 8 C48 7 54 9 54 15 C54 22 48 25 42 24 C34 23 28 23 20 24 C14 25 8 22 8 15 Z';

export function worldSvgs() {
  return {
    sausage: {
      w: 62,
      h: 32,
      svg: svgDoc(62, 32, `
        <defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ec825c"/><stop offset="1" stop-color="#b8472f"/>
        </linearGradient></defs>
        <circle cx="6" cy="15" r="3.5" fill="#8e3b2a"/>
        <circle cx="56" cy="15" r="3.5" fill="#8e3b2a"/>
        <path d="${SAUSAGE_PATH}" fill="url(#s)" ${line}/>
        <path d="M24 13 l4 8 M32 13 l4 8 M40 12 l4 8" stroke="#9c3a26" stroke-width="2" stroke-linecap="round" opacity="0.55"/>
        <path d="M15 12 C24 13 34 13 46 11" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity="0.6"/>`),
    },
    'sausage-slot': {
      w: 62,
      h: 32,
      svg: svgDoc(62, 32, `<path d="${SAUSAGE_PATH}" fill="#fff" fill-opacity="0.35" stroke="#fff" stroke-opacity="0.8" stroke-width="3"/>`),
    },
    crate: {
      w: 50,
      h: 50,
      svg: svgDoc(50, 50, `
        <rect x="2.5" y="2.5" width="45" height="45" rx="4" fill="#d9a050" ${line}/>
        <rect x="8" y="8" width="34" height="34" rx="2" fill="#e7b466" stroke="#a8692a" stroke-width="4"/>
        <path d="M10 40 L40 10" stroke="#a8692a" stroke-width="6" stroke-linecap="round"/>
        <g fill="#7a4a1c"><circle cx="7" cy="7" r="1.8"/><circle cx="43" cy="7" r="1.8"/><circle cx="7" cy="43" r="1.8"/><circle cx="43" cy="43" r="1.8"/></g>
        <rect x="2.5" y="2.5" width="45" height="45" rx="4" fill="none" ${line}/>`),
    },
    ball: {
      w: 44,
      h: 44,
      svg: svgDoc(44, 44, `
        <defs><clipPath id="b"><circle cx="22" cy="22" r="19.5"/></clipPath></defs>
        <g clip-path="url(#b)">
          <rect width="44" height="44" fill="#ff5a5a"/>
          <ellipse cx="0" cy="22" rx="12" ry="26" fill="#4fa3ff"/>
          <ellipse cx="44" cy="22" rx="12" ry="26" fill="#ffd54f"/>
          <ellipse cx="22" cy="22" rx="6" ry="24" fill="#fff"/>
        </g>
        <circle cx="22" cy="22" r="19.5" fill="none" ${line}/>
        <ellipse cx="14" cy="12" rx="5" ry="3" fill="#fff" opacity="0.75" transform="rotate(-35 14 12)"/>`),
    },
    puddle: {
      w: 110,
      h: 26,
      svg: svgDoc(110, 26, `
        <ellipse cx="55" cy="14" rx="52" ry="10.5" fill="#3d8fd6"/>
        <ellipse cx="55" cy="12.5" rx="46" ry="7.5" fill="#7cc6ff"/>
        <path d="M30 11 Q38 9 46 11 M64 14 Q72 12 80 14" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="0.8"/>`),
    },
  };
}

// SVG pieces go through the loader, so call this from preload().
export function preloadWorld(scene) {
  for (const [key, { svg, w, h }] of Object.entries(worldSvgs())) loadSvg(scene, key, svg, w, h);
}
