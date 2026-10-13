import { GROUND_Y } from '../config.js';
import { FRANKIE_FEET_Y, FRANKIE_H } from '../art/frankie.js';
import { BALLOONS } from '../art/party.js';
import { createBackdrop } from '../backdrop.js';
import { LEVELS } from '../levels.js';
import { WORLDS } from '../worlds.js';
import { addBigButton, addMuteButton } from '../ui.js';
import * as sfx from '../audio/sfx.js';

const FRANKIE_X = 300;
const FRANKIE_SCALE = 0.95;
const FRANKIE_Y = GROUND_Y - (FRANKIE_FEET_Y - FRANKIE_H / 2) * FRANKIE_SCALE; // centre, so Frankie can spin around it
const TROPHY_X = 530;
const STAR_Y = 150;
const STAR_GAP = 100;
const HOME_X = 790;
const HOME_Y = 255;
const HOME_Y_SEVEN_STARS = 280; // the 7th star stands right above the button
const COLORS = [0xe53935, 0xffd23f, 0x43b047, 0x3b7fc4, 0xff8a3d, 0xa259d9, 0xff6b9a];

// The big celebration after the last level: one star for every world played so far flies in,
// the sausage trophy rises, confetti, balloons and fireworks, and Frankie jumps
// for joy. Then the home button leads back to the level selection.
export class VictoryScene extends Phaser.Scene {
  constructor() {
    super('VictoryScene');
  }

  init(data) {
    // The level just finished: 5 for the child's game, 7 for the grown-ups.
    this.lastLevel = data?.level ?? 5;
  }

  create() {
    this.leaving = false;
    this.backdrop = createBackdrop(this, { zone: 'garden' });
    this.add.image(0, 0, 'bunting').setOrigin(0).setDepth(30);
    this.add.image(FRANKIE_X, GROUND_Y + 2, 'shadow').setDisplaySize(130, 22).setDepth(9);
    this.frankie = this.add.sprite(FRANKIE_X, FRANKIE_Y, 'frankie-happy').setScale(FRANKIE_SCALE).setDepth(10);
    addMuteButton(this);
    this.cameras.main.fadeIn(500);

    sfx.fanfare();
    this.flyInStars();
    this.time.delayedCall(2100, () => this.showTrophy());
    this.time.delayedCall(2700, () => {
      this.time.addEvent({ delay: 110, loop: true, callback: () => this.confetti() });
      this.jumpForJoy();
    });
    this.time.delayedCall(3400, () => this.time.addEvent({ delay: 500, repeat: 8, callback: () => this.balloon() }));
    this.time.delayedCall(4000, () => this.time.addEvent({ delay: 950, repeat: 7, callback: () => this.firework() }));
    this.time.delayedCall(8200, () => this.showHomeButton());
  }

  update() {
    this.backdrop.update(0, this.time.now);
  }

  // One star in the colour of every world played so far (levels 1 up to the one just finished).
  flyInStars() {
    const colors = LEVELS.slice(0, this.lastLevel).map((l) => WORLDS[l.world].color);
    const x0 = 480 - ((colors.length - 1) * STAR_GAP) / 2;
    colors.forEach((color, i) => {
      const x = x0 + i * STAR_GAP;
      const star = this.add.image(x, 620, 'star-big').setTint(color).setDepth(35).setScale(0.6);
      this.tweens.add({
        targets: star,
        y: STAR_Y,
        scale: 1,
        angle: 360,
        delay: 300 + i * 350,
        duration: 650,
        ease: 'Back.easeOut',
        onComplete: () => {
          sfx.collect();
          this.burst(x, STAR_Y, color, 8, 60);
          this.tweens.add({ targets: star, scale: 1.12, duration: 500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: i * 120 });
        },
      });
    });
  }

  showTrophy() {
    const rays = this.add.image(TROPHY_X, GROUND_Y - 110, 'sun-rays').setTint(0xffd54f).setAlpha(0).setDepth(7);
    this.tweens.add({ targets: rays, alpha: 0.9, duration: 600 });
    this.tweens.add({ targets: rays, angle: 360, duration: 12000, repeat: -1 });
    const trophy = this.add.image(TROPHY_X, GROUND_Y + 4, 'trophy').setOrigin(0.5, 1).setDepth(8).setScale(0);
    this.tweens.add({ targets: trophy, scale: 1, duration: 700, ease: 'Back.easeOut' });
    sfx.bark();
    this.time.delayedCall(500, () => this.burst(TROPHY_X, GROUND_Y - 120, 0xffd23f, 12, 110));
  }

  // Three big happy jumps (the middle one with a somersault), then a wiggle with music.
  jumpForJoy() {
    const f = this.frankie;
    const jump = (i) => ({
      y: FRANKIE_Y - 120,
      duration: 380,
      yoyo: true,
      ease: 'Quad.easeOut',
      onStart: () => {
        sfx.jump();
        if (i === 1) this.tweens.add({ targets: f, angle: -360, duration: 760, onComplete: () => f.setAngle(0) });
      },
      onComplete: () => this.hearts(3),
    });
    this.tweens.chain({
      targets: f,
      tweens: [jump(0), jump(1), jump(2)],
      onComplete: () => {
        sfx.bark();
        sfx.melody();
        for (let i = 0; i < 5; i++) this.time.delayedCall(i * 300, () => this.note());
        this.tweens.add({
          targets: f,
          angle: { from: -14, to: 14 },
          duration: 150,
          yoyo: true,
          repeat: 5,
          ease: 'Sine.easeInOut',
          onComplete: () => {
            f.setAngle(0);
            // Keep bouncing happily until the child goes home.
            this.tweens.add({ targets: f, y: FRANKIE_Y - 22, duration: 420, yoyo: true, repeat: -1, ease: 'Quad.easeOut' });
          },
        });
      },
    });
  }

  confetti() {
    const x = Phaser.Math.Between(0, 960);
    const c = this.add.image(x, -20, 'confetti').setTint(Phaser.Utils.Array.GetRandom(COLORS)).setDepth(40);
    c.setAngle(Phaser.Math.Between(0, 360));
    this.tweens.add({ targets: c, scaleX: 0.2, duration: 200, yoyo: true, repeat: -1 });
    this.tweens.add({
      targets: c,
      y: GROUND_Y + 8,
      x: x + Phaser.Math.Between(-80, 80),
      angle: c.angle + Phaser.Math.Between(-540, 540),
      duration: Phaser.Math.Between(3200, 5200),
      ease: 'Sine.easeIn',
      onComplete: () => {
        this.tweens.add({
          targets: c,
          alpha: 0,
          duration: 600,
          onComplete: () => {
            this.tweens.killTweensOf(c);
            c.destroy();
          },
        });
      },
    });
  }

  balloon() {
    const x = Phaser.Math.Between(40, 920);
    const b = this.add.image(x, 640, `balloon-${Phaser.Math.Between(0, BALLOONS - 1)}`).setDepth(6).setScale(Phaser.Math.FloatBetween(0.8, 1.1));
    this.tweens.add({ targets: b, x: x + Phaser.Math.Between(-50, 50), angle: { from: -6, to: 6 }, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.tweens.add({
      targets: b,
      y: -140,
      duration: Phaser.Math.Between(5500, 7500),
      ease: 'Sine.easeIn',
      onComplete: () => {
        this.tweens.killTweensOf(b);
        b.destroy();
      },
    });
  }

  firework() {
    const x = Phaser.Math.Between(120, 660);
    const y = Phaser.Math.Between(110, 230);
    const color = Phaser.Utils.Array.GetRandom(COLORS);
    sfx.firework();
    const flash = this.add.image(x, y, 'spark').setTintFill(color).setScale(2.4).setDepth(5);
    this.tweens.add({ targets: flash, scale: 0.5, alpha: 0, duration: 350, onComplete: () => flash.destroy() });
    this.burst(x, y, color, 18, 120, 1.4);
  }

  // Coloured sparks that fly outwards and fade out at the end.
  burst(x, y, color, count, spread, scale = 0.8) {
    for (let i = 0; i < count; i++) {
      const a = (Math.PI * 2 * i) / count;
      const p = this.add.image(x, y, 'spark').setTintFill(color).setScale(scale).setDepth(5);
      this.tweens.add({
        targets: p,
        x: x + Math.cos(a) * spread,
        y: y + Math.sin(a) * spread + 25,
        scale: scale * 0.5,
        angle: 180,
        duration: 900,
        ease: 'Cubic.easeOut',
        onComplete: () => p.destroy(),
      });
      this.tweens.add({ targets: p, alpha: 0, delay: 450, duration: 450 });
    }
  }

  hearts(n) {
    const f = this.frankie;
    for (let i = 0; i < n; i++) {
      this.time.delayedCall(i * 90, () => {
        const h = this.add.image(f.x + Phaser.Math.Between(-90, 90), f.y - Phaser.Math.Between(20, 70), 'heart').setDepth(12).setScale(0.6);
        this.tweens.add({ targets: h, y: h.y - 90, scale: 1.1, alpha: 0, duration: 1000, ease: 'Sine.easeOut', onComplete: () => h.destroy() });
      });
    }
  }

  note() {
    const f = this.frankie;
    const n = this.add.image(f.x + Phaser.Math.Between(-50, 60), f.y - 60, 'note').setDepth(12).setScale(0.8);
    this.tweens.add({ targets: n, y: n.y - 110, x: n.x + Phaser.Math.Between(-30, 30), alpha: 0, duration: 1200, onComplete: () => n.destroy() });
  }

  showHomeButton() {
    const home = () => this.goHome();
    addBigButton(this, HOME_X, this.lastLevel > 5 ? HOME_Y_SEVEN_STARS : HOME_Y, 'btn-home', home);
    this.input.keyboard.once('keydown-SPACE', home);
    this.input.keyboard.once('keydown-ENTER', home);
  }

  goHome() {
    if (this.leaving) return;
    this.leaving = true;
    sfx.unlock();
    this.scene.start('StartScene');
  }
}
