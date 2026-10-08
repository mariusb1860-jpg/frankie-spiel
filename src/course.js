import { GAME_WIDTH, GROUND_Y } from './config.js';
import { BLOCK } from './level.js';

// Builds everything Frankie runs on and bumps into: ground (with gaps), floating
// blocks, sausages and obstacles. Each of these gets a dark outline and a shadow,
// so it stands out from the hazy background.

export const DEPTH = { blocks: 1, shadows: 2, frankieShadow: 3, things: 4, fallen: 4.5, gap: 5, frankie: 10, effects: 20 };

// How each obstacle sits and collides. Hit boxes are smaller than the pictures,
// so a near miss still counts as a jump over.
// y: centre of the picture; box: [width, height, offsetX, offsetY] in picture pixels;
// circle: [radius, offsetX, offsetY]; flat: lies on the ground (no shadow);
// scale: picture size; patrol: walks this many px left and right of its spot
// (patrolSpeed: px per second); roll: rolls towards Frankie at this speed (px per
// second) as soon as it comes into view; hop: { height, ms, pause, air } jumps up
// and down (ms in the air with picture `air`, pause on the ground), with
// { steps, step } it hops `steps` times `step` px to the left and back again.
export const OBSTACLE_TYPES = {
  puddle: { y: GROUND_Y + 3, box: [64, 10, 23, 8], flat: true },
  ball: { y: GROUND_Y - 21, circle: [14, 8, 8] },
  crate: { y: GROUND_Y - 24, box: [34, 34, 8, 16] },
  stump: { y: GROUND_Y - 24, box: [34, 30, 13, 20] },
  log: { y: GROUND_Y - 20, box: [52, 18, 22, 22] },
  hedgehog: { y: GROUND_Y - 23, scale: 1.2, box: [20, 14, 20, 23], patrol: 50, anim: 'hedgehog-walk' },
  sandcastle: { y: GROUND_Y - 29, box: [44, 32, 14, 26] },
  crab: { y: GROUND_Y - 21, box: [30, 18, 17, 24], patrol: 60, anim: 'crab-walk' },
  beachball: { y: GROUND_Y - 23, circle: [17, 8, 8], roll: 90 },
  haybale: { y: GROUND_Y - 26, box: [38, 34, 12, 18] },
  milkcan: { y: GROUND_Y - 25, box: [22, 36, 9, 15] },
  chicken: { y: GROUND_Y - 24, box: [24, 26, 15, 20], patrol: 70, patrolSpeed: 45, anim: 'chicken-walk' },
  frog: { y: GROUND_Y - 20, box: [30, 20, 9, 18], hop: { height: 45, ms: 520, pause: 900, air: 'frog-jump' } },
  snowman: { y: GROUND_Y - 37, box: [30, 44, 13, 31] },
  snowball: { y: GROUND_Y - 21, circle: [16, 7, 7], roll: 100 },
  rabbit: { y: GROUND_Y - 22, box: [26, 24, 14, 22], hop: { height: 38, ms: 420, pause: 380, air: 'rabbit-jump', steps: 3, step: 40 } },
};
const PATROL_SPEED = 40; // px per second, unless the type sets its own
const ROLL_START = GAME_WIDTH + 50; // rolling starts once this close to the left screen edge

export function createCourse(scene, level, world) {
  const ground = createGround(scene, level, world);
  const platforms = createPlatforms(scene, level, world);
  const sausages = createSausages(scene, level);
  const { obstacles, movers, rollers, hoppers } = createObstacles(scene, level);

  return {
    ground,
    platforms,
    sausages,
    obstacles,

    /** Top of whatever is under x at or below `bottom` (blocks or ground); null above water. */
    surfaceBelow(x, bottom) {
      let top = null;
      for (const p of level.platforms) {
        if (x >= p.x0 && x <= p.x1 && p.top >= bottom - 8 && (top === null || p.top < top)) top = p.top;
      }
      if (top !== null) return top;
      return level.gaps.some((g) => x > g.x0 && x < g.x1) ? null : GROUND_Y;
    },

    /** time: scene clock, delta: ms since the last frame, scrollX: left edge of the screen in the world. */
    update(time, delta, scrollX) {
      for (const r of rollers) roll(scene, r, delta, scrollX, level.gaps);
      for (const h of hoppers) hop(h, time);
      for (const m of movers) m.shadow.x = m.x;
    },
  };
}

export function addShadow(scene, x, y, width, alpha = 1) {
  return scene.add.image(x, y, 'shadow').setDisplaySize(width, Math.min(22, width * 0.24)).setAlpha(alpha).setDepth(DEPTH.shadows);
}

// The ground is split at every gap; each piece is a thick solid block, so even
// a hiccup on a slow tablet cannot make Frankie fall through it.
function createGround(scene, level, world) {
  const pieces = [];
  let start = 0;
  for (const gap of [...level.gaps, { x0: level.length, x1: level.length }]) {
    if (gap.x0 > start) {
      const piece = scene.add.zone((start + gap.x0) / 2, GROUND_Y + 150, gap.x0 - start, 300);
      scene.physics.add.existing(piece, true);
      pieces.push(piece);
    }
    start = gap.x1;
  }
  for (const gap of level.gaps) addGapPicture(scene, gap, world.gap);
  return pieces;
}

// Water between two banks; the bank outlines sit exactly on the edges of the gap.
function addGapPicture(scene, { x0, x1 }, style) {
  const water = scene.add.tileSprite(x0, GROUND_Y, x1 - x0, 80, `${style}-mid`).setOrigin(0).setDepth(DEPTH.gap);
  scene.tweens.add({ targets: water, tilePositionX: 64, duration: 2600, repeat: -1 });
  scene.add.image(x0 + 4, GROUND_Y, `${style}-bank`).setOrigin(1, 0).setDepth(DEPTH.gap);
  scene.add.image(x1 - 4, GROUND_Y, `${style}-bank`).setOrigin(0, 0).setFlipX(true).setDepth(DEPTH.gap);
}

function createPlatforms(scene, level, world) {
  const zones = [];
  for (const p of level.platforms) {
    for (let i = 0; i < p.tiles; i++) {
      scene.add.image(p.x0 + i * BLOCK, p.top, world.block).setOrigin(0).setDepth(DEPTH.blocks);
    }
    addShadow(scene, (p.x0 + p.x1) / 2, GROUND_Y + 2, (p.x1 - p.x0) * 0.9, 0.45);
    const zone = scene.add.zone((p.x0 + p.x1) / 2, p.top + 8, p.x1 - p.x0, 16);
    scene.physics.add.existing(zone, true);
    // Only the top is solid: Frankie jumps up through the blocks and lands on them.
    Object.assign(zone.body.checkCollision, { down: false, left: false, right: false });
    zones.push(zone);
  }
  return zones;
}

function createSausages(scene, level) {
  const group = scene.physics.add.group({ allowGravity: false });
  for (const { x, y } of level.sausages) {
    const s = group.create(x, y, 'sausage').setDepth(DEPTH.things);
    s.body.moves = false;
    scene.tweens.add({ targets: s, y: y - 8, duration: 700 + (x % 300), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }
  return group;
}

function createObstacles(scene, level) {
  const group = scene.physics.add.group({ allowGravity: false });
  const movers = []; // everything that moves; their shadows follow them
  const rollers = [];
  const hoppers = [];
  for (const { kind, x } of level.obstacles) {
    const type = OBSTACLE_TYPES[kind];
    const o = group.create(x, type.y, kind).setDepth(DEPTH.things).setScale(type.scale ?? 1);
    o.kind = kind;
    o.body.moves = false;
    if (type.circle) {
      o.body.setCircle(...type.circle);
    } else {
      const [w, h, ox, oy] = type.box;
      o.body.setSize(w, h).setOffset(ox, oy);
    }
    if (!type.flat) o.shadow = addShadow(scene, x, GROUND_Y + 2, o.displayWidth * 0.9);
    if (type.patrol) {
      startPatrol(scene, o, type);
      movers.push(o);
    } else if (type.roll) {
      o.roll = type.roll;
      rollers.push(o);
      movers.push(o);
    } else if (type.hop) {
      o.hop = type.hop;
      Object.assign(o, { baseX: o.x, baseY: o.y, hopStart: scene.time.now, shadowW: o.shadow.displayWidth, shadowH: o.shadow.displayHeight });
      hoppers.push(o);
      movers.push(o);
    }
  }
  return { obstacles: group, movers, rollers, hoppers };
}

// Walks left and right around its spot. The picture looks left.
function startPatrol(scene, o, type) {
  o.x -= type.patrol;
  o.setFlipX(true);
  if (type.anim) o.play(type.anim);
  o.patrol = scene.tweens.add({
    targets: o,
    x: o.x + type.patrol * 2,
    duration: ((type.patrol * 2) / (type.patrolSpeed ?? PATROL_SPEED)) * 1000,
    ease: 'Sine.easeInOut',
    yoyo: true,
    repeat: -1,
    onYoyo: () => o.setFlipX(false),
    onRepeat: () => o.setFlipX(true),
  });
}

// Rolls towards Frankie once it is on screen, turning like a real ball.
// If it reaches a gap, it drops into the water.
function roll(scene, o, delta, scrollX, gaps) {
  if (o.stopped || (!o.rolling && o.x - scrollX > ROLL_START)) return;
  o.rolling = true;
  const dx = (o.roll * delta) / 1000;
  o.x -= dx;
  o.angle -= Phaser.Math.RadToDeg(dx / (o.displayWidth / 2));
  if (gaps.some((g) => o.x > g.x0 && o.x < g.x1)) {
    o.stopped = true;
    o.body.enable = false;
    o.shadow.setVisible(false);
    scene.tweens.add({ targets: o, y: o.y + 70, alpha: 0, duration: 500, ease: 'Quad.easeIn' });
  }
}

// Jumps up and down on a steady beat; with steps it hops to the left and back.
// The picture looks left.
function hop(o, time) {
  if (o.stopped) return;
  const { height, ms, pause, air, steps = 0, step = 0 } = o.hop;
  const t = time - o.hopStart;
  const n = Math.floor(t / (ms + pause)); // hops so far
  const k = Math.min(1, (t - n * (ms + pause)) / ms); // progress of the current hop, 1 = landed
  const lift = height * 4 * k * (1 - k);
  o.y = o.baseY - lift;
  const key = k < 1 && air ? air : o.kind;
  if (o.texture.key !== key) o.setTexture(key);
  if (steps) {
    const along = (i) => {
      const j = i % (2 * steps);
      return j <= steps ? j : 2 * steps - j;
    };
    const from = along(n);
    const to = along(n + 1);
    o.x = o.baseX - (from + (to - from) * k) * step;
    o.setFlipX(to < from);
  }
  // The shadow stays on the ground and gets smaller while the animal is in the air.
  const s = 1 - lift / 160;
  o.shadow.setDisplaySize(o.shadowW * s, o.shadowH * s).setAlpha(s);
}
