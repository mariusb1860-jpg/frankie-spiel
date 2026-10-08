import { GROUND_Y } from '../config.js';
import { FRANKIE_FEET_Y, FRANKIE_H } from '../art/frankie.js';
import { createBackdrop } from '../backdrop.js';
import { addBigButton, addMuteButton, enterFullscreen } from '../ui.js';
import * as sfx from '../audio/sfx.js';

export const TITLE_FONT = '"Arial Rounded MT Bold", "Trebuchet MS", "Segoe UI", Arial, sans-serif';

export class StartScene extends Phaser.Scene {
  constructor() {
    super('StartScene');
  }

  create() {
    this.starting = false;
    createBackdrop(this).update(0);

    this.add
      .text(480, 120, 'Frankie', {
        fontFamily: TITLE_FONT,
        fontSize: '104px',
        fontStyle: 'bold',
        color: '#ffffff',
        stroke: '#6b3e1f',
        strokeThickness: 14,
      })
      .setOrigin(0.5)
      .setShadow(0, 6, 'rgba(0,0,0,0.25)', 4);

    const sausage = this.add.image(480, 215, 'sausage').setScale(1.4).setAngle(-15);
    this.tweens.add({ targets: sausage, angle: 15, y: 205, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    const frankie = this.add
      .sprite(300, GROUND_Y, 'frankie-happy')
      .setOrigin(0.5, FRANKIE_FEET_Y / FRANKIE_H)
      .setScale(1.6);
    this.tweens.add({ targets: frankie, y: GROUND_Y - 18, duration: 420, yoyo: true, repeat: -1, ease: 'Quad.easeOut' });

    addMuteButton(this);
    addBigButton(this, 650, 330, 'btn-play', () => this.startGame());
    this.input.keyboard.on('keydown-SPACE', () => this.startGame());
    this.input.keyboard.on('keydown-ENTER', () => this.startGame());

    this.cameras.main.fadeIn(300);
  }

  startGame() {
    if (this.starting) return;
    this.starting = true;
    sfx.unlock();
    sfx.bark();
    enterFullscreen(this);
    this.scene.start('GameScene');
  }
}
