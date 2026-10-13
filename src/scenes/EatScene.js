import { GROUND_Y } from '../config.js';
import { FRANKIE_FEET_Y, FRANKIE_H } from '../art/frankie.js';
import { createBackdrop } from '../backdrop.js';
import { getLevel, isFinale } from '../levels.js';
import { addBigButton, addMuteButton } from '../ui.js';
import { TITLE_FONT } from './StartScene.js';
import * as sfx from '../audio/sfx.js';

const BOWL_X = 560;
const FRANKIE_X = 445;
const FRANKIE_SCALE = 0.95;
const FRANKIE_Y = GROUND_Y - (FRANKIE_FEET_Y - FRANKIE_H / 2) * FRANKIE_SCALE; // center, so Frankie can roll around it
const BELLY_GROWTH = 0.008; // Frankie gets a little rounder with every sausage
const EAT_MS = 6000; // all sausages together take about this long (plus the last flight)
const DANCES = ['danceHop', 'danceRoll', 'danceWiggle'];

// Reward scene: Frankie arrives at his house, does a happy dance,
// then all collected sausages fly into the bowl and he eats them.
export class EatScene extends Phaser.Scene {
  constructor() {
    super('EatScene');
  }

  init(data) {
    this.levelNo = data.level ?? 1;
    // Even with zero sausages Frankie gets one treat.
    this.count = Math.max(1, data.collected ?? 1);
  }

  create() {
    this.leaving = false;
    this.backdrop = createBackdrop(this, { world: getLevel(this.levelNo).world, zone: 'last' });

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
    this.time.delayedCall(500, () => this[this.pickDance()](() => this.feedAll()));
  }

  update() {
    this.backdrop.update(0, this.time.now);
  }

  // A different dance than last time, so it does not get boring.
  pickDance() {
    const last = this.registry.get('lastDance');
    const options = DANCES.filter((d) => d !== last);
    const dance = Phaser.Utils.Array.GetRandom(options);
    this.registry.set('lastDance', dance);
    return dance;
  }

  // Dance 1: three hops, looking left and right.
  danceHop(done) {
    const f = this.frankie;
    sfx.bark();
    this.tweens.chain({
      targets: f,
      tweens: [0, 1, 2].map((i) => ({
        y: FRANKIE_Y - 70,
        duration: 230,
        yoyo: true,
        ease: 'Quad.easeOut',
        onStart: () => {
          f.setFlipX(i % 2 === 0);
          sfx.jump();
        },
      })),
      onComplete: () => {
        f.setFlipX(false);
        done();
      },
    });
  }

  // Dance 2: a big jump with a somersault, then a little bounce.
  danceRoll(done) {
    const f = this.frankie;
    sfx.jump();
    this.tweens.add({ targets: f, angle: -360, duration: 800, ease: 'Sine.easeInOut' });
    this.tweens.chain({
      targets: f,
      tweens: [
        { y: FRANKIE_Y - 110, duration: 400, yoyo: true, ease: 'Quad.easeOut' },
        { scaleY: FRANKIE_SCALE * 0.82, duration: 110, yoyo: true },
        { y: FRANKIE_Y - 30, duration: 170, yoyo: true, ease: 'Quad.easeOut' },
      ],
      onComplete: () => {
        f.setAngle(0);
        sfx.bark();
        this.hearts(5);
        this.time.delayedCall(300, done);
      },
    });
  }

  // Dance 3: wiggle from side to side while music notes float up.
  danceWiggle(done) {
    const f = this.frankie;
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
        done();
      },
    });
    this.tweens.add({ targets: f, scaleY: FRANKIE_SCALE * 0.9, duration: 150, yoyo: true, repeat: 5 });
  }

  // All sausages fly into the bowl one after the other while Frankie keeps munching.
  feedAll() {
    const f = this.frankie;
    const gap = Phaser.Math.Clamp(EAT_MS / this.count, 280, 900);
    const fly = Math.min(600, gap * 1.5);
    this.tweens.add({ targets: f, x: FRANKIE_X + 18, duration: 200 });
    f.play('frankie-chomp');
    this.queue.forEach((s, i) => {
      this.time.delayedCall(i * gap, () => this.flyToBowl(s, fly, i));
    });
  }

  flyToBowl(s, fly, i) {
    this.tweens.add({ targets: s, x: BOWL_X, duration: fly, ease: 'Sine.easeInOut' });
    this.tweens.add({
      targets: s,
      y: GROUND_Y - 30,
      angle: 360,
      duration: fly,
      ease: 'Quad.easeIn',
      onComplete: () => {
        sfx.munch();
        this.crumbs(BOWL_X - 20, GROUND_Y - 40);
        if (i % 2 === 0) this.heart(this.frankie.x + 40, this.frankie.y - 50);
        this.frankie.scaleX += BELLY_GROWTH;
        this.tweens.add({ targets: s, scale: 0, duration: 180, onComplete: () => s.destroy() });
        if (i === this.queue.length - 1) this.time.delayedCall(350, () => this.finale());
      },
    });
  }

  finale() {
    const f = this.frankie;
    f.anims.stop();
    f.setTexture('frankie-happy');
    sfx.bark();
    this.tweens.add({ targets: f, x: FRANKIE_X, duration: 200 });
    this.tweens.add({ targets: f, y: FRANKIE_Y - 40, duration: 200, yoyo: true, ease: 'Quad.easeOut' });
    this.hearts(8);

    // After the last level of a group (5, or 7 for grown-ups) the big celebration starts by itself.
    if (isFinale(this.levelNo)) {
      this.time.delayedCall(1400, () => {
        this.cameras.main.fadeOut(400);
        this.cameras.main.once('camerafadeoutcomplete', () => this.leave('VictoryScene', { level: this.levelNo }));
      });
      return;
    }

    // Two big buttons: play this level again, and on to the next level
    // (after the last level that exists: back to the level selection).
    this.time.delayedCall(700, () => {
      const hasNext = Boolean(getLevel(this.levelNo + 1));
      const next = hasNext ? () => this.playLevel(this.levelNo + 1) : () => this.leave('StartScene');
      addBigButton(this, 390, 230, 'btn-replay', () => this.playLevel(this.levelNo), { pulse: false });
      addBigButton(this, 570, 230, hasNext ? 'btn-next' : 'btn-home', next);
      this.input.keyboard.once('keydown-SPACE', next);
      this.input.keyboard.once('keydown-ENTER', next);
    });
  }

  playLevel(level) {
    this.leave('GameScene', { level });
  }

  leave(sceneKey, data) {
    if (this.leaving) return;
    this.leaving = true;
    sfx.unlock();
    this.scene.start(sceneKey, data);
  }

  hearts(n) {
    const f = this.frankie;
    for (let i = 0; i < n; i++) {
      this.time.delayedCall(i * 90, () => this.heart(f.x + Phaser.Math.Between(-120, 120), f.y - Phaser.Math.Between(0, 60)));
    }
  }

  note() {
    const f = this.frankie;
    const n = this.add.image(f.x + Phaser.Math.Between(-50, 60), f.y - 60, 'note').setDepth(8).setScale(0.8);
    this.tweens.add({ targets: n, y: n.y - 110, x: n.x + Phaser.Math.Between(-30, 30), alpha: 0, duration: 1200, onComplete: () => n.destroy() });
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
