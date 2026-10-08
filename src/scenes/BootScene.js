import { createFrankieAnims, preloadFrankie } from '../art/frankie.js';
import { createWorldTextures, preloadWorld } from '../art/world.js';

// Turns all drawings into textures once, then shows the start screen.
export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    preloadFrankie(this);
    preloadWorld(this);
  }

  create() {
    createWorldTextures(this);
    createFrankieAnims(this);
    this.scene.start('StartScene');
  }
}
