import { createFrankieAnims, preloadFrankie } from '../art/frankie.js';
import { createWorldTextures, preloadWorld } from '../art/world.js';
import { preloadScenery } from '../art/scenery.js';
import { createForestAnims, preloadForest } from '../art/forest.js';
import { createBeachAnims, preloadBeach } from '../art/beach.js';
import { createFarmAnims, preloadFarm } from '../art/farm.js';
import { preloadWinter } from '../art/winter.js';
import { preloadParty } from '../art/party.js';
import { getMode } from '../mode.js';
import { preloadPuszta } from '../art/puszta.js';
import { preloadBudapest } from '../art/budapest.js';
import { preloadBalaton } from '../art/balaton.js';
import { preloadTokaj } from '../art/tokaj.js';
import { preloadVisegrad } from '../art/visegrad.js';
import { preloadBavaria } from '../art/bavaria.js';

// The worlds of the grown-up parts load only when their button is pressed for the first time
// (most visitors are children): paprika = levels 6-10, pretzel = levels 11-15.
const MODE_ART = {
  paprika: { preload: [preloadPuszta, preloadBudapest, preloadBalaton, preloadTokaj, preloadVisegrad] },
  bayern: { preload: [preloadBavaria] },
};
const loadedArt = new Set();

/** True once the drawings of this part of the game are textures (the child's part always is). */
export function hasArt(mode) {
  return !MODE_ART[mode] || loadedArt.has(mode);
}

// Turns all drawings into textures once, then shows the start screen.
// Meanwhile a bar fills up (no text: the child cannot read yet).
// Started again with { artOnly: true } to load only the worlds of the part just chosen.
export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  init(data) {
    this.artOnly = Boolean(data?.artOnly);
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

    if (!this.artOnly) {
      preloadFrankie(this);
      preloadWorld(this);
      preloadScenery(this);
      preloadForest(this);
      preloadBeach(this);
      preloadFarm(this);
      preloadWinter(this);
      preloadParty(this);
    }
    const mode = getMode();
    if (!hasArt(mode)) MODE_ART[mode].preload.forEach((load) => load(this));
  }

  create() {
    const mode = getMode();
    if (!hasArt(mode)) {
      loadedArt.add(mode);
      MODE_ART[mode].anims?.(this);
    }
    if (!this.artOnly) {
      createWorldTextures(this);
      createFrankieAnims(this);
      createForestAnims(this);
      createBeachAnims(this);
      createFarmAnims(this);
    }
    this.scene.start('StartScene');
  }
}
