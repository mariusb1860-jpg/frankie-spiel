import { CONFIG, DEBUG, GAME_HEIGHT, GAME_WIDTH } from './config.js';
import { BootScene } from './scenes/BootScene.js';
import { StartScene } from './scenes/StartScene.js';
import { GameScene } from './scenes/GameScene.js';
import { EatScene } from './scenes/EatScene.js';
import { VictoryScene } from './scenes/VictoryScene.js';

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
    // Variable step: the physics follows the real screen refresh (e.g. 59.94 Hz or 144 Hz).
    // A fixed 60 Hz step drifts against such screens and makes the game stutter now and then.
    arcade: { gravity: { y: CONFIG.gravity }, debug: DEBUG, fixedStep: false },
  },
  input: { activePointers: 3 },
  scene: [BootScene, StartScene, GameScene, EatScene, VictoryScene],
});

// Handy for automated browser tests.
window.game = game;
