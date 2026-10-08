import { GAME_WIDTH, GAME_HEIGHT } from '../config.js';
import { OUTLINE as LINE, loadSvg, svgDoc } from './svg.js';

// Everything except Frankie: sausages, landscape, obstacles, buttons. All drawn with code:
// the detailed pieces as SVG, the simple ones with Phaser graphics.
const OUTLINE = 0x4a2c17;

export function createWorldTextures(scene) {
  make(scene, 'sky', GAME_WIDTH, GAME_HEIGHT, drawSky);
  make(scene, 'note', 30, 40, drawNote);
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

function drawNote(g) {
  g.fillStyle(0x7e57c2, 1);
  g.fillEllipse(10, 32, 16, 12);
  g.fillRect(15, 4, 4, 28);
  g.fillTriangle(15, 4, 28, 12, 15, 16);
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
    // Frankie's dog house; the name plate (95, 85) gets its text in the scene.
    house: {
      w: 190,
      h: 180,
      svg: svgDoc(190, 180, `
        <rect x="24" y="66" width="142" height="110" fill="#4f8fd6" ${line}/>
        ${[48, 72, 96, 120, 144].map((x) => `<path d="M${x} 70 V174" stroke="#3f7ac0" stroke-width="2.5"/>`).join('')}
        <path d="M66 176 V122 a29 29 0 0 1 58 0 V176 Z" fill="#3a2414" ${line}/>
        <path d="M74 176 V124 a21 21 0 0 1 42 0 V176 Z" fill="#24160b"/>
        <rect x="55" y="74" width="80" height="22" rx="7" fill="#fff3d6" ${line}/>
        <path d="M2 80 L95 6 L188 80 L174 88 L95 26 L16 88 Z" fill="#d63d2e" ${line}/>
        <path d="M30 70 L95 18 M160 70 L95 18" stroke="#a82c20" stroke-width="2.5" opacity="0.7"/>
        <path d="M40 60 L52 50 M64 42 L76 32 M150 60 L138 50 M126 42 L114 32" stroke="#ff6f5e" stroke-width="3" stroke-linecap="round"/>
        <g fill="#fff6e8" ${line}><circle cx="146" cy="160" r="4"/><circle cx="146" cy="168" r="4"/><circle cx="168" cy="160" r="4"/><circle cx="168" cy="168" r="4"/></g>
        <rect x="145" y="160" width="24" height="8" fill="#fff6e8"/>`),
    },
    bowl: {
      w: 110,
      h: 44,
      svg: svgDoc(110, 44, `
        <defs><linearGradient id="bw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a8fe0"/><stop offset="1" stop-color="#2f67b8"/></linearGradient></defs>
        <path d="M6 12 H104 L92 41 H18 Z" fill="url(#bw)" ${line}/>
        <ellipse cx="55" cy="12" rx="49" ry="7.5" fill="#8fbdf2" ${line}/>
        <ellipse cx="55" cy="12" rx="40" ry="4" fill="#2a4f86" opacity="0.5"/>
        <g fill="#fff" opacity="0.9"><ellipse cx="55" cy="30" rx="5" ry="4"/><circle cx="48" cy="24" r="2.2"/><circle cx="53" cy="22" r="2.2"/><circle cx="58" cy="22" r="2.2"/><circle cx="63" cy="24" r="2.2"/></g>`),
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
