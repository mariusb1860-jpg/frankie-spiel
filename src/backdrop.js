import { GAME_WIDTH, GROUND_Y } from './config.js';
import { WORLDS } from './worlds.js';

// Everything behind Frankie. Far layers move slower than near ones (parallax).
// The scenery changes along the level (see the zones in worlds.js).
// A light haze sits between the background and the play area, so the background
// looks far away and nobody mistakes a flower or a butterfly for an obstacle.

const DEPTH = {
  sky: -100, sun: -95, clouds: -90, birds: -88, hillsFar: -85, far: -80,
  hillsNear: -75, mid: -70, beams: -66, strip: -62, near: -60, butterflies: -58, haze: -55, ground: -50,
};

const LAYERS = [
  { name: 'far', factor: 0.3, baseY: GROUND_Y - 45, spacing: [200, 340], scale: [0.5, 0.62] },
  { name: 'mid', factor: 0.6, baseY: GROUND_Y + 6, spacing: [230, 360], scale: [0.8, 0.95] },
  { name: 'near', factor: 0.85, baseY: GROUND_Y + 6, spacing: [140, 240], scale: [0.75, 0.9] },
];
const STRIP = { factor: 0.85, baseY: GROUND_Y + 4, width: 156 };
const FLIPPABLE = [
  'tree-oak', 'tree-apple', 'tree-birch', 'tree-beech', 'rock', 'mossy-rock', 'bush', 'berry-bush',
  'grass-tuft', 'mushrooms', 'daisies', 'fern', 'log-pile', 'deer',
  'dune', 'dune-2', 'sailboat', 'sailboat-2', 'ferry', 'cutter', 'marram', 'shell-pile',
  'cow', 'sheep', 'tractor', 'scarecrow', 'chicken-coop', 'wheat-tuft', 'poppies', 'dandelions',
];

/**
 * @param {Phaser.Scene} scene
 * @param {{ world?: string, length?: number, zone?: string }} options
 *   world: key in WORLDS; length: level length (scrolling scenes);
 *   zone: fixed landscape for scenes that do not scroll ('first', 'last' or a zone key).
 */
export function createBackdrop(scene, { world = 'garden', length = GAME_WIDTH, zone = null } = {}) {
  const def = WORLDS[world];
  // Fixed seed per world: the landscape looks the same every time (garden keeps its original seed).
  const rng = new Phaser.Math.RandomDataGenerator([world === 'garden' ? 'frankie-backdrop' : `frankie-backdrop-${world}`]);
  const fixedZone = zone === 'first' ? def.zones[0] : zone === 'last' ? def.zones[def.zones.length - 1] : def.zones.find((z) => z.key === zone);
  const zoneAt = (worldX) => fixedZone ?? def.zones.find((z) => worldX / length <= z.until) ?? def.zones[def.zones.length - 1];
  // World x at the screen centre at the moment a layer object at x is centred.
  const worldAt = (x, factor) => (x - GAME_WIDTH / 2) / factor + GAME_WIDTH / 2;
  const span = (factor) => Math.max(0, length - GAME_WIDTH) * factor + GAME_WIDTH + 120;
  const density = def.density ?? 1;

  scene.add.image(0, 0, 'sky').setOrigin(0).setScrollFactor(0).setDepth(DEPTH.sky);
  const rays = scene.add.image(830, 95, 'sun-rays').setScrollFactor(0).setDepth(DEPTH.sun);
  scene.add.image(830, 95, 'sun').setScrollFactor(0).setDepth(DEPTH.sun);
  scene.tweens.add({ targets: rays, angle: 360, duration: 90000, repeat: -1 });

  const tile = (y, h, key, depth) => scene.add.tileSprite(0, y, GAME_WIDTH, h, key).setOrigin(0).setScrollFactor(0).setDepth(depth);
  const tiles = [
    { sprite: tile(0, 180, 'clouds', DEPTH.clouds), factor: 0.08, drift: 0.006 },
    { sprite: tile(GROUND_Y - 235, 220, def.tiles.hillsFar, DEPTH.hillsFar), factor: 0.2 },
    { sprite: tile(GROUND_Y - 120, 140, def.tiles.hillsNear, DEPTH.hillsNear), factor: 0.4 },
    { sprite: tile(GROUND_Y, 80, def.tiles.ground, DEPTH.ground), factor: 1 },
  ];
  scene.add.image(0, 0, 'haze').setOrigin(0).setScrollFactor(0).setDepth(DEPTH.haze);

  for (const layer of LAYERS) {
    const [min, max] = layer.spacing.map((s) => Math.round(s * density));
    for (let x = -60 + rng.between(0, 120); x < span(layer.factor); x += rng.between(min, max)) {
      const key = rng.pick(zoneAt(worldAt(x, layer.factor))[layer.name]);
      const scale = rng.realInRange(...layer.scale);
      if (key === 'sunbeam') {
        addSunbeam(scene, x, layer.factor, scale);
        continue;
      }
      const img = scene.add.image(x, layer.baseY, key).setOrigin(0.5, 1).setScale(scale);
      img.setScrollFactor(layer.factor).setDepth(DEPTH[layer.name]);
      if (FLIPPABLE.includes(key)) img.setFlipX(rng.frac() < 0.5);
      if (key === 'windmill') addWindmillBlades(scene, img, layer.factor);
      if (key === 'lighthouse') addLighthouseBeam(scene, img, layer.factor);
    }
  }

  // Continuous fences and hedges.
  for (let x = -40; x < span(STRIP.factor); x += STRIP.width) {
    const key = zoneAt(worldAt(x, STRIP.factor)).strip;
    if (key) scene.add.image(x, STRIP.baseY, key).setOrigin(0, 1).setScrollFactor(STRIP.factor).setDepth(DEPTH.strip);
  }

  for (let x = 100; x < span(0.9); x += 260) {
    if (zoneAt(worldAt(x, 0.9)).butterflies && rng.frac() < 0.7) addButterfly(scene, x, rng);
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

// The lighthouse lamp sends out a beam that sweeps from one side to the other.
function addLighthouseBeam(scene, tower, factor) {
  // The lamp sits at (65, 64) inside the 130 x 300 lighthouse picture.
  const lampY = tower.y - (300 - 64) * tower.scaleY;
  const beam = scene.add.image(tower.x, lampY, 'light-beam').setOrigin(0, 0.5).setScale(tower.scaleX * 0.9);
  beam.setScrollFactor(factor).setDepth(DEPTH.mid).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.6);
  scene.tweens.add({ targets: beam, scaleX: -beam.scaleX, duration: 2600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
}

// Light falling through the tree tops, hanging from the top of the screen.
function addSunbeam(scene, x, factor, scale) {
  const beam = scene.add.image(x, 0, 'sunbeam').setOrigin(0.5, 0).setScale(scale * 1.1).setScrollFactor(factor).setDepth(DEPTH.beams);
  beam.setAlpha(0.55).setBlendMode(Phaser.BlendModes.ADD);
  scene.tweens.add({ targets: beam, alpha: 0.3, duration: 2600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
}

function addButterfly(scene, x, rng) {
  const y = GROUND_Y - rng.between(40, 130);
  const b = scene.add.image(x, y, 'butterfly').setScrollFactor(0.9).setDepth(DEPTH.butterflies).setScale(0.65);
  scene.tweens.add({ targets: b, scaleX: 0.2, duration: 140, yoyo: true, repeat: -1 });
  scene.tweens.add({ targets: b, y: y - 30, x: x + 40, duration: 1800 + rng.between(0, 900), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
}
