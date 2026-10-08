import { createFrankieTextures } from '../art/frankie.js';
import { createWorldTextures } from '../art/world.js';

// Draws every texture once, then shows the start screen.
export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    createWorldTextures(this);
    createFrankieTextures(this);
    this.scene.start('StartScene');
  }
}
