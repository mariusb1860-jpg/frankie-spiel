import { CONFIG, DEBUG, GAME_HEIGHT, GAME_WIDTH } from './config.js';
import { BootScene } from './scenes/BootScene.js';
import { StartScene } from './scenes/StartScene.js';
import { GameScene } from './scenes/GameScene.js';
import { EatScene } from './scenes/EatScene.js';

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#8fd3ff',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: CONFIG.gravity }, debug: DEBUG },
  },
  input: { activePointers: 3 },
  scene: [BootScene, StartScene, GameScene, EatScene],
});

// Handy for automated browser tests.
window.game = game;
