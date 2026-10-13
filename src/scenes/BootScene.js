import { createFrankieAnims, preloadFrankie } from '../art/frankie.js';
import { createWorldTextures, preloadWorld } from '../art/world.js';
import { preloadScenery } from '../art/scenery.js';
import { createForestAnims, preloadForest } from '../art/forest.js';
import { createBeachAnims, preloadBeach } from '../art/beach.js';
import { createFarmAnims, preloadFarm } from '../art/farm.js';
import { preloadWinter } from '../art/winter.js';
import { preloadParty } from '../art/party.js';
import { PAPRIKA } from '../config.js';
import { preloadPuszta } from '../art/puszta.js';
import { preloadBudapest } from '../art/budapest.js';

// Turns all drawings into textures once, then shows the start screen.
// Meanwhile a bar fills up (no text: the child cannot read yet).
export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    const bar = this.add.graphics();
    const draw = (progress) => {
      bar.clear();
      bar.fillStyle(0xffffff, 0.7).fillRoundedRect(330, 258, 300, 24, 12);
      bar.fillStyle(0xd9673f, 1).fillRoundedRect(330, 258, Math.max(24, 300 * progress), 24, 12);
    };
    draw(0);
    this.load.on('progress', draw);

    preloadFrankie(this);
    preloadWorld(this);
    preloadScenery(this);
    preloadForest(this);
    preloadBeach(this);
    preloadFarm(this);
    preloadWinter(this);
    preloadParty(this);
    // The grown-up worlds are only needed with the secret link (?paprika).
    if (PAPRIKA) {
      preloadPuszta(this);
      preloadBudapest(this);
    }
  }

  create() {
    createWorldTextures(this);
    createFrankieAnims(this);
    createForestAnims(this);
    createBeachAnims(this);
    createFarmAnims(this);
    this.scene.start('StartScene');
  }
}
