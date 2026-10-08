import { GAME_WIDTH, GROUND_Y } from './config.js';

// Sky, clouds, hills, bushes and grass. Layers stay on screen and scroll their
// pattern at different speeds (parallax), so even a long level needs no huge images.
export function createBackdrop(scene) {
  scene.add.image(0, 0, 'sky').setOrigin(0).setScrollFactor(0);
  scene.add.image(830, 95, 'sun').setScrollFactor(0);

  const layer = (y, h, key, factor) => ({
    sprite: scene.add.tileSprite(0, y, GAME_WIDTH, h, key).setOrigin(0).setScrollFactor(0),
    factor,
  });
  const layers = [
    layer(20, 160, 'clouds', 0.15),
    layer(GROUND_Y - 190, 200, 'hills', 0.3),
    layer(GROUND_Y - 100, 110, 'bushes', 0.6),
    layer(GROUND_Y, 80, 'ground', 1),
  ];

  return {
    update(scrollX, time = 0) {
      for (const { sprite, factor } of layers) sprite.tilePositionX = scrollX * factor;
      layers[0].sprite.tilePositionX += time * 0.01; // clouds drift slowly
    },
  };
}
