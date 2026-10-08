import { createFrankieAnims, preloadFrankie } from '../art/frankie.js';
import { createWorldTextures, preloadWorld } from '../art/world.js';
import { preloadScenery } from '../art/scenery.js';
import { createForestAnims, preloadForest } from '../art/forest.js';
import { createBeachAnims, preloadBeach } from '../art/beach.js';

// Turns all drawings into textures once, then shows the start screen.
export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    preloadFrankie(this);
    preloadWorld(this);
    preloadScenery(this);
    preloadForest(this);
    preloadBeach(this);
  }

  create() {
    createWorldTextures(this);
    createFrankieAnims(this);
    createForestAnims(this);
    createBeachAnims(this);
    this.scene.start('StartScene');
  }
}
