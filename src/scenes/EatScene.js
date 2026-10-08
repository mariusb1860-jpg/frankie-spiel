import { GROUND_Y } from '../config.js';
import { FRANKIE_FEET_Y, FRANKIE_H } from '../art/frankie.js';
import { createBackdrop } from '../backdrop.js';
import { addBigButton, addMuteButton } from '../ui.js';
import { TITLE_FONT } from './StartScene.js';
import * as sfx from '../audio/sfx.js';

const BOWL_X = 560;
const FRANKIE_X = 445;
const FRANKIE_SCALE = 0.95;
const FRANKIE_Y = GROUND_Y - (FRANKIE_FEET_Y - FRANKIE_H / 2) * FRANKIE_SCALE; // center, so Frankie can roll around it
const BELLY_GROWTH = 0.008; // Frankie gets a little rounder with every sausage
const PACE = {
  slow: { fly: 650, anim: 'frankie-eat', pause: 250 },
  medium: { fly: 380, anim: 'frankie-eat', pause: 60 },
  fast: { fly: 240, anim: 'frankie-eat-quick', pause: 40 },
};

// Reward scene: every collected sausage flies into the bowl and Frankie eats it.
export class EatScene extends Phaser.Scene {
  constructor() {
    super('EatScene');
  }

  init(data) {
    // There is no losing: even with zero sausages Frankie gets one treat.
    this.count = Math.max(1, data.collected ?? 1);
  }

  create() {
    this.leaving = false;
    createBackdrop(this).update(0);

    this.add.image(800, GROUND_Y + 4, 'house').setOrigin(0.5, 1);
    this.add
      .text(800, GROUND_Y + 4 - 180 + 85, 'FRANKIE', { fontFamily: TITLE_FONT, fontSize: '17px', fontStyle: 'bold', color: '#6b3e1f' })
      .setOrigin(0.5);
    this.add.image(BOWL_X, GROUND_Y + 4, 'bowl').setOrigin(0.5, 1).setDepth(5);

    this.frankie = this.add.sprite(FRANKIE_X, FRANKIE_Y, 'frankie-happy').setScale(FRANKIE_SCALE).setDepth(4);

    const spacing = Math.min(52, 780 / this.count);
    const startX = 450 - ((this.count - 1) * spacing) / 2; // keeps clear of the speaker button
    this.queue = Array.from({ length: this.count }, (_, i) =>
      this.add.image(startX + i * spacing, 70, 'sausage').setScale(0.85).setDepth(6),
    );

    addMuteButton(this);
    this.cameras.main.fadeIn(400);
    this.time.delayedCall(700, () => this.feed(0));
  }

  feed(i) {
    if (i >= this.queue.length) {
      this.celebrate();
      return;
    }
    // The first sausages slowly, then faster, so a big haul does not take forever.
    const pace = i < 3 ? PACE.slow : i < 6 ? PACE.medium : PACE.fast;
    const s = this.queue[i];
    this.tweens.add({ targets: s, x: BOWL_X, duration: pace.fly, ease: 'Sine.easeInOut' });
    this.tweens.add({
      targets: s,
      y: GROUND_Y - 30,
      angle: 360,
      duration: pace.fly,
      ease: 'Quad.easeIn',
      onComplete: () => {
        sfx.plop();
        this.eat(s, pace, () => this.feed(i + 1));
      },
    });
  }

  eat(s, pace, done) {
    const f = this.frankie;
    this.tweens.add({ targets: f, x: FRANKIE_X + 22, duration: 120, yoyo: true });
    f.play(pace.anim);
    sfx.munch();
    this.tweens.add({ targets: s, scale: 0, duration: 250, delay: 100, onComplete: () => s.destroy() });
    this.crumbs(BOWL_X - 20, GROUND_Y - 40);
    this.heart(f.x + 40, f.y - 50);

    f.scaleX += BELLY_GROWTH;
    f.once('animationcomplete', () => {
      f.setTexture('frankie-happy');
      this.time.delayedCall(pace.pause, done);
    });
  }

  celebrate() {
    const f = this.frankie;
    sfx.melody();
    this.time.delayedCall(900, () => sfx.bark());

    // Happy jump with a roll, then hearts everywhere.
    this.tweens.add({ targets: f, y: FRANKIE_Y - 90, duration: 380, yoyo: true, ease: 'Quad.easeOut' });
    this.tweens.add({ targets: f, angle: -360, duration: 760, ease: 'Sine.easeInOut' });
    for (let i = 0; i < 10; i++) {
      this.time.delayedCall(i * 90, () => this.heart(f.x + Phaser.Math.Between(-120, 120), f.y - Phaser.Math.Between(0, 60)));
    }

    this.time.delayedCall(1300, () => {
      addBigButton(this, 480, 230, 'btn-replay', () => this.replay());
      this.input.keyboard.once('keydown-SPACE', () => this.replay());
      this.input.keyboard.once('keydown-ENTER', () => this.replay());
    });
  }

  replay() {
    if (this.leaving) return;
    this.leaving = true;
    sfx.unlock();
    this.scene.start('GameScene');
  }

  heart(x, y) {
    const h = this.add.image(x, y, 'heart').setDepth(8).setScale(0.6);
    this.tweens.add({ targets: h, y: y - 90, scale: 1.1, alpha: 0, duration: 1000, ease: 'Sine.easeOut', onComplete: () => h.destroy() });
  }

  crumbs(x, y) {
    for (let i = 0; i < 5; i++) {
      const c = this.add.image(x, y, 'crumb').setDepth(7);
      this.tweens.add({
        targets: c,
        x: x + Phaser.Math.Between(-40, 40),
        y: y + Phaser.Math.Between(-30, 20),
        alpha: 0,
        duration: 500,
        onComplete: () => c.destroy(),
      });
    }
  }
}
