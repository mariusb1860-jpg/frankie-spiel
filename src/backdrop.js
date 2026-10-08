import { GAME_WIDTH, GROUND_Y, ZONES } from './config.js';

// Everything behind Frankie. Far layers move slower than near ones (parallax).
// The scenery changes along the level: garden, meadow, village (see ZONES).

const DEPTH = {
  sky: -100, sun: -95, clouds: -90, birds: -88, hillsFar: -85, far: -80,
  hillsNear: -75, mid: -70, strip: -62, near: -60, butterflies: -58, ground: -50,
};

const DECOR = {
  garden: {
    far: ['tree-pine', 'tree-pine', 'tree-birch'],
    mid: ['tree-apple', 'shed', 'tree-oak', 'tree-apple', 'tree-birch'],
    near: ['tulips', 'sunflower', 'bush', 'sunflower', 'tulips'],
    strip: 'fence',
  },
  meadow: {
    far: ['windmill', 'tree-pine', 'tree-birch', 'tree-pine', 'tree-pine'],
    mid: ['tree-oak', 'tree-birch', 'pond', 'tree-birch', 'tree-oak'],
    near: ['daisies', 'grass-tuft', 'rock', 'mushrooms', 'bush', 'grass-tuft'],
    butterflies: true,
  },
  village: {
    far: ['church', 'house-b', 'tree-pine'],
    mid: ['house-a', 'house-b', 'tree-apple', 'house-a'],
    near: ['lamp', 'bush', 'daisies', 'lamp'],
    strip: 'hedge',
  },
};

const LAYERS = [
  { name: 'far', factor: 0.3, baseY: GROUND_Y - 45, spacing: [200, 340], scale: [0.5, 0.62] },
  { name: 'mid', factor: 0.6, baseY: GROUND_Y + 6, spacing: [230, 360], scale: [0.8, 0.95] },
  { name: 'near', factor: 0.85, baseY: GROUND_Y + 6, spacing: [140, 240], scale: [0.75, 0.9] },
];
const STRIP = { factor: 0.85, baseY: GROUND_Y + 4, width: 156 };
const FLIPPABLE = ['tree-oak', 'tree-apple', 'tree-birch', 'rock', 'bush', 'grass-tuft', 'mushrooms', 'daisies'];

/**
 * @param {Phaser.Scene} scene
 * @param {{ length?: number, zone?: string }} options  length: level length (scrolling scenes);
 *   zone: fixed landscape for scenes that do not scroll.
 */
export function createBackdrop(scene, { length = GAME_WIDTH, zone = null } = {}) {
  const rng = new Phaser.Math.RandomDataGenerator(['frankie-backdrop']);
  const zoneAt = (worldX) => zone ?? (ZONES.find((z) => worldX / length <= z.until) ?? ZONES[ZONES.length - 1]).key;
  // World x at the screen centre at the moment a layer object at x is centred.
  const worldAt = (x, factor) => (x - GAME_WIDTH / 2) / factor + GAME_WIDTH / 2;
  const span = (factor) => Math.max(0, length - GAME_WIDTH) * factor + GAME_WIDTH + 120;

  scene.add.image(0, 0, 'sky').setOrigin(0).setScrollFactor(0).setDepth(DEPTH.sky);
  const rays = scene.add.image(830, 95, 'sun-rays').setScrollFactor(0).setDepth(DEPTH.sun);
  scene.add.image(830, 95, 'sun').setScrollFactor(0).setDepth(DEPTH.sun);
  scene.tweens.add({ targets: rays, angle: 360, duration: 90000, repeat: -1 });

  const tile = (y, h, key, depth) => scene.add.tileSprite(0, y, GAME_WIDTH, h, key).setOrigin(0).setScrollFactor(0).setDepth(depth);
  const tiles = [
    { sprite: tile(0, 180, 'clouds', DEPTH.clouds), factor: 0.08, drift: 0.006 },
    { sprite: tile(GROUND_Y - 235, 220, 'hills-far', DEPTH.hillsFar), factor: 0.2 },
    { sprite: tile(GROUND_Y - 120, 140, 'hills-near', DEPTH.hillsNear), factor: 0.4 },
    { sprite: tile(GROUND_Y, 80, 'ground', DEPTH.ground), factor: 1 },
  ];

  for (const layer of LAYERS) {
    for (let x = -60 + rng.between(0, 120); x < span(layer.factor); x += rng.between(...layer.spacing)) {
      const key = rng.pick(DECOR[zoneAt(worldAt(x, layer.factor))][layer.name]);
      const scale = rng.realInRange(...layer.scale);
      const img = scene.add.image(x, layer.baseY, key).setOrigin(0.5, 1).setScale(scale);
      img.setScrollFactor(layer.factor).setDepth(DEPTH[layer.name]);
      if (FLIPPABLE.includes(key)) img.setFlipX(rng.frac() < 0.5);
      if (key === 'windmill') addWindmillBlades(scene, img, layer.factor);
    }
  }

  // Continuous fence (garden) and hedge (village).
  for (let x = -40; x < span(STRIP.factor); x += STRIP.width) {
    const key = DECOR[zoneAt(worldAt(x, STRIP.factor))].strip;
    if (key) scene.add.image(x, STRIP.baseY, key).setOrigin(0, 1).setScrollFactor(STRIP.factor).setDepth(DEPTH.strip);
  }

  for (let x = 100; x < span(0.9); x += 260) {
    if (DECOR[zoneAt(worldAt(x, 0.9))].butterflies && rng.frac() < 0.7) addButterfly(scene, x, rng);
  }

  const birds = [0, 1, 2].map((i) => {
    const b = scene.add.image(0, 110 + i * 26, 'bird').setScrollFactor(0).setDepth(DEPTH.birds).setScale(0.8 - i * 0.12);
    scene.tweens.add({ targets: b, scaleY: b.scaleY * 0.4, duration: 220, yoyo: true, repeat: -1, delay: i * 90 });
    return { sprite: b, start: i * 70 };
  });

  return {
    update(scrollX, time = 0) {
      for (const { sprite, factor, drift = 0 } of tiles) sprite.tilePositionX = scrollX * factor + time * drift;
      for (const { sprite, start } of birds) {
        sprite.x = ((start + time * 0.035 - scrollX * 0.1) % (GAME_WIDTH + 400) + GAME_WIDTH + 400) % (GAME_WIDTH + 400) - 200;
      }
    },
  };
}

function addWindmillBlades(scene, mill, factor) {
  // The hub sits at (70, 64) inside the 140 x 260 windmill picture.
  const hubY = mill.y - (260 - 64) * mill.scaleY;
  const blades = scene.add.image(mill.x, hubY, 'windmill-blades').setScale(mill.scaleX * 0.85).setScrollFactor(factor).setDepth(DEPTH.far);
  scene.tweens.add({ targets: blades, angle: 360, duration: 9000, repeat: -1 });
}

function addButterfly(scene, x, rng) {
  const y = GROUND_Y - rng.between(40, 130);
  const b = scene.add.image(x, y, 'butterfly').setScrollFactor(0.9).setDepth(DEPTH.butterflies).setScale(0.8);
  scene.tweens.add({ targets: b, scaleX: 0.25, duration: 140, yoyo: true, repeat: -1 });
  scene.tweens.add({ targets: b, y: y - 30, x: x + 40, duration: 1800 + rng.between(0, 900), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
}
