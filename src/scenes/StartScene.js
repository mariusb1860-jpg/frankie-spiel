import { GROUND_Y } from '../config.js';
import { FRANKIE_FEET_Y, FRANKIE_H } from '../art/frankie.js';
import { createBackdrop } from '../backdrop.js';
import { getLevel, shownLevels } from '../levels.js';
import { unlockedLevel } from '../progress.js';
import { addBigButton, addMuteButton, enterFullscreen } from '../ui.js';
import * as sfx from '../audio/sfx.js';

export const TITLE_FONT = '"Arial Rounded MT Bold", "Trebuchet MS", "Segoe UI", Arial, sans-serif';

const BUTTON_Y = 305;
const BUTTON_X0 = 340;
const BUTTON_GAP = 122;
const ROW = 5; // the button row is laid out for five buttons

// Start screen with the level selection: one round button per level, in the
// colour of its world. Levels not reached yet show a lock.
export class StartScene extends Phaser.Scene {
  constructor() {
    super('StartScene');
  }

  create() {
    this.starting = false;
    this.backdrop = createBackdrop(this, { zone: 'garden' });

    this.add
      .text(480, 105, 'Franky', {
        fontFamily: TITLE_FONT,
        fontSize: '104px',
        fontStyle: 'bold',
        color: '#ffffff',
        stroke: '#6b3e1f',
        strokeThickness: 14,
      })
      .setOrigin(0.5)
      .setShadow(0, 6, 'rgba(0,0,0,0.25)', 4);

    const sausage = this.add.image(480, 196, 'sausage').setScale(1.3).setAngle(-15);
    this.tweens.add({ targets: sausage, angle: 15, y: 188, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    const frankie = this.add
      .sprite(160, GROUND_Y, 'frankie-happy')
      .setOrigin(0.5, FRANKIE_FEET_Y / FRANKIE_H)
      .setScale(1.05);
    this.tweens.add({ targets: frankie, y: GROUND_Y - 18, duration: 420, yoyo: true, repeat: -1, ease: 'Quad.easeOut' });

    // One button per level of the shown group (1-5, or 6-10 with the secret link),
    // centred where the five buttons of the child's game stand.
    const levels = shownLevels();
    const isOpen = (n) => Boolean(getLevel(n)) && (n === levels[0] || n <= unlockedLevel());
    this.playable = levels.filter(isOpen);
    // Only the newest open level pulses, so the child knows where to tap.
    const newest = this.playable[this.playable.length - 1];
    const x0 = BUTTON_X0 + ((ROW - levels.length) * BUTTON_GAP) / 2;
    levels.forEach((n, i) => this.addLevelButton(n, x0 + i * BUTTON_GAP, isOpen(n), n === newest));

    addMuteButton(this);
    // Keyboard: Space/Enter starts the newest open level, a number key that level (0 = level 10).
    this.input.keyboard.on('keydown-SPACE', () => this.startGame(newest));
    this.input.keyboard.on('keydown-ENTER', () => this.startGame(newest));
    this.input.keyboard.on('keydown', (event) => {
      const n = event.key === '0' ? 10 : Number(event.key);
      if (this.playable.includes(n)) this.startGame(n);
    });

    this.cameras.main.fadeIn(300);
  }

  addLevelButton(n, x, open, isNewest) {
    if (!open) {
      this.add.image(x, BUTTON_Y, 'btn-level-locked').setDepth(100);
      return;
    }
    const def = getLevel(n);
    addBigButton(this, x, BUTTON_Y, `btn-level-${def.world}`, () => this.startGame(n), { pulse: isNewest });
    const label = this.add
      .text(x, BUTTON_Y - 4, String(n), { fontFamily: `"Arial Black", ${TITLE_FONT}`, fontSize: '58px', color: '#ffffff', stroke: '#2b3a2b', strokeThickness: 8 })
      .setOrigin(0.5)
      .setDepth(101);
    if (isNewest) this.tweens.add({ targets: label, scale: 1.08, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  update() {
    this.backdrop.update(0, this.time.now);
  }

  startGame(level) {
    if (this.starting || !level) return;
    this.starting = true;
    sfx.unlock();
    sfx.bark();
    enterFullscreen(this);
    this.scene.start('GameScene', { level });
  }
}
