import { CONFIG } from '../config.js';

// Frankie is drawn with code: a little English bulldog seen from the side, facing right.
export const FRANKIE_W = 132;
export const FRANKIE_H = 104;
export const FRANKIE_FEET_Y = 100; // y of the paws inside the texture

const OUTLINE = 0x4a2c17;
const NOSE = 0x2b1a10;
const MOUTH = 0x6b2222;
const TONGUE = 0xff7a8a;
const BLUSH = 0xff9aa8;

const DEFAULT_POSE = { legs: [0, 0], legLen: null, bob: 0, tail: 0, eyes: 'open', mouth: 'closed' };

const POSES = {
  run0: { legs: [-6, 6], tail: -3 },
  run1: { legs: [0, 0], bob: -2 },
  run2: { legs: [6, -6], tail: 3 },
  run3: { legs: [0, 0], bob: -2 },
  jump: { legs: [-8, 8], legLen: 18, bob: -3, tail: -5, mouth: 'tongue' },
  stumble: { legs: [4, -4], bob: 2, eyes: 'dizzy', mouth: 'open' },
  happy: { eyes: 'happy', mouth: 'tongue', tail: -4 },
  eat0: { eyes: 'happy', mouth: 'open' },
  eat1: { eyes: 'happy', mouth: 'chew' },
};

export function createFrankieTextures(scene) {
  for (const [name, pose] of Object.entries(POSES)) {
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
    drawFrankie(g, { ...DEFAULT_POSE, ...pose });
    g.generateTexture(`frankie-${name}`, FRANKIE_W, FRANKIE_H);
    g.destroy();
  }

  scene.anims.create({
    key: 'frankie-run',
    frames: ['run0', 'run1', 'run2', 'run3'].map((f) => ({ key: `frankie-${f}` })),
    frameRate: 10,
    repeat: -1,
  });
  scene.anims.create({
    key: 'frankie-eat',
    frames: ['eat0', 'eat1', 'eat0', 'eat1', 'eat0', 'eat1'].map((f) => ({ key: `frankie-${f}` })),
    frameRate: 9,
  });
  scene.anims.create({
    key: 'frankie-eat-quick',
    frames: ['eat0', 'eat1'].map((f) => ({ key: `frankie-${f}` })),
    frameRate: 9,
  });
}

function shade(color, factor) {
  const r = Math.min(255, Math.round(((color >> 16) & 0xff) * factor));
  const g = Math.min(255, Math.round(((color >> 8) & 0xff) * factor));
  const b = Math.min(255, Math.round((color & 0xff) * factor));
  return (r << 16) | (g << 8) | b;
}

function drawFrankie(g, p) {
  const { base, patch, collar } = CONFIG.fur;
  const by = p.bob;
  const legTop = 70 + by;
  const legLen = p.legLen ?? FRANKIE_FEET_Y - legTop;
  g.lineStyle(3, OUTLINE, 1);

  // Tail (stubby)
  shape(g, base, () => g.fillCircle(14, 50 + by + p.tail, 6), () => g.strokeCircle(14, 50 + by + p.tail, 6));

  // Far legs (behind the body, a bit darker)
  leg(g, 30 + p.legs[1], legTop, legLen, shade(base, 0.82));
  leg(g, 80 + p.legs[0], legTop, legLen, shade(base, 0.82));

  // Body
  shape(g, base, () => g.fillEllipse(52, 62 + by, 80, 48), () => g.strokeEllipse(52, 62 + by, 80, 48));
  g.fillStyle(patch, 1);
  g.fillEllipse(40, 52 + by, 30, 18);

  // Near legs
  leg(g, 24 + p.legs[0], legTop, legLen, base);
  leg(g, 72 + p.legs[1], legTop, legLen, base);

  // Collar around the neck (the head covers its upper end)
  const collarPts = [
    { x: 63, y: 56 + by }, { x: 73, y: 53 + by }, { x: 81, y: 79 + by }, { x: 72, y: 82 + by },
  ];
  shape(g, collar, () => g.fillPoints(collarPts, true), () => g.strokePoints(collarPts, true));
  shape(g, 0xffd54f, () => g.fillCircle(79, 85 + by, 4.5), () => g.strokeCircle(79, 85 + by, 4.5));

  // Big round head
  shape(g, base, () => g.fillCircle(93, 44 + by, 29), () => g.strokeCircle(93, 44 + by, 29));
  g.fillStyle(patch, 1);
  g.fillCircle(84, 35 + by, 13);

  // Rose ear, folded
  const ear = [{ x: 69, y: 27 + by }, { x: 83, y: 12 + by }, { x: 88, y: 29 + by }];
  shape(g, shade(patch, 0.8), () => g.fillPoints(ear, true), () => g.strokePoints(ear, true));

  drawMouth(g, p, by, base);

  drawEyes(g, p, by);
}

function drawMouth(g, p, by, base) {
  const jawY = (p.mouth === 'open' ? 66 : 59) + by;
  const muzzle = shade(base, 1.03);

  if (p.mouth === 'open') {
    g.fillStyle(MOUTH, 1);
    g.fillEllipse(114, 64 + by, 20, 14);
  }
  if (p.mouth === 'tongue') {
    shape(g, TONGUE, () => g.fillEllipse(111, 72 + by, 9, 15), () => g.strokeEllipse(111, 72 + by, 9, 15));
  }

  // Short flat muzzle with hanging jowls, wrinkles and a big nose
  shape(g, muzzle, () => g.fillEllipse(107, 59 + by, 20, 15), () => g.strokeEllipse(107, 59 + by, 20, 15));
  shape(g, muzzle, () => g.fillEllipse(114, 51 + by, 28, 22), () => g.strokeEllipse(114, 51 + by, 28, 22));
  g.lineStyle(2, OUTLINE, 0.7);
  arc(g, 107, 36 + by, 6, 1.15, 1.85);
  arc(g, 111, 40 + by, 5, 1.15, 1.85);
  g.lineStyle(3, OUTLINE, 1);
  g.fillStyle(NOSE, 1);
  g.fillEllipse(123, 44 + by, 12, 9);
  g.fillStyle(0xffffff, 0.6);
  g.fillCircle(121, 42 + by, 1.6);

  // Lower jaw sticks out (underbite) with two tiny teeth over the lip
  shape(g, base, () => g.fillRoundedRect(106, jawY, 22, 9, 4), () => g.strokeRoundedRect(106, jawY, 22, 9, 4));
  g.fillStyle(0xffffff, 1);
  g.lineStyle(1.5, OUTLINE, 1);
  for (const tx of [114, 121]) {
    g.fillRoundedRect(tx, jawY - 4, 4, 6, 1.5);
    g.strokeRoundedRect(tx, jawY - 4, 4, 6, 1.5);
  }
  g.lineStyle(3, OUTLINE, 1);

  if (p.mouth === 'chew') {
    shape(g, base, () => g.fillCircle(101, 57 + by, 9), () => g.strokeCircle(101, 57 + by, 9));
  }
  if (p.eyes === 'happy') {
    g.fillStyle(BLUSH, 0.6);
    g.fillEllipse(96, 54 + by, 11, 6);
  }
}

function drawEyes(g, p, by) {
  const ex = 99;
  const ey = 36 + by;
  if (p.eyes === 'happy') {
    g.lineStyle(3, OUTLINE, 1);
    arc(g, ex, ey + 3, 6, 1.1, 1.9);
  } else if (p.eyes === 'dizzy') {
    g.lineStyle(3, OUTLINE, 1);
    g.lineBetween(ex - 5, ey - 5, ex + 5, ey + 5);
    g.lineBetween(ex - 5, ey + 5, ex + 5, ey - 5);
  } else {
    shape(g, 0xffffff, () => g.fillCircle(ex, ey, 7), () => g.strokeCircle(ex, ey, 7));
    g.fillStyle(0x1b120b, 1);
    g.fillCircle(ex + 2, ey + 0.5, 4.5);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(ex + 3.5, ey - 1.5, 1.7);
  }
}

function leg(g, x, top, len, color) {
  shape(g, color, () => g.fillRoundedRect(x, top, 15, len, 6), () => g.strokeRoundedRect(x, top, 15, len, 6));
  const pawY = top + len - 3;
  shape(g, color, () => g.fillEllipse(x + 9, pawY, 20, 9), () => g.strokeEllipse(x + 9, pawY, 20, 9));
}

// Fills then outlines one shape.
function shape(g, color, fill, stroke) {
  g.fillStyle(color, 1);
  fill();
  stroke();
}

// Arc stroke; start/end given in multiples of PI.
function arc(g, x, y, r, start, end) {
  g.beginPath();
  g.arc(x, y, r, Math.PI * start, Math.PI * end);
  g.strokePath();
}
