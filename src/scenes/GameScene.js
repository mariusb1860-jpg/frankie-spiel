import { CONFIG, GAME_HEIGHT, GROUND_Y } from '../config.js';
import { buildLevel } from '../level.js';
import { createBackdrop } from '../backdrop.js';
import { addMuteButton } from '../ui.js';
import { TITLE_FONT } from './StartScene.js';
import * as sfx from '../audio/sfx.js';

const HUD_Y = 34;
const HUD_GAP = 34;
const HUD_SCALE = 0.62;

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    this.level = buildLevel();
    this.collected = 0;
    this.finished = false;
    this.stumbling = false;
    this.jumpQueuedAt = -Infinity;
    this.lastGroundAt = -Infinity;

    const { length } = this.level;
    this.physics.world.setBounds(0, 0, length, GAME_HEIGHT);
    this.backdrop = createBackdrop(this);

    const ground = this.add.zone(length / 2, GROUND_Y + 40, length, 80);
    this.physics.add.existing(ground, true);

    this.createGoal();
    this.createSausages();
    this.createObstacles();
    this.createFrankie();
    this.createHud();

    this.physics.add.collider(this.frankie, ground);
    this.physics.add.overlap(this.frankie, this.sausages, (_f, s) => this.collect(s));
    this.physics.add.overlap(this.frankie, this.obstacles, (_f, o) => this.hitObstacle(o));

    const cam = this.cameras.main;
    cam.setBounds(0, 0, length, GAME_HEIGHT);
    cam.startFollow(this.frankie, true, 1, 1);
    cam.setFollowOffset(-230, 0);
    cam.fadeIn(300);

    // One-button game: tap anywhere, Space, Arrow Up or W makes Frankie jump.
    this.input.on('pointerdown', (_pointer, over) => {
      sfx.unlock();
      if (over.length === 0) this.queueJump();
    });
    for (const key of ['SPACE', 'UP', 'W']) this.input.keyboard.on(`keydown-${key}`, () => this.queueJump());
  }

  createFrankie() {
    this.frankie = this.physics.add.sprite(160, GROUND_Y - 60, 'frankie-run0').setScale(CONFIG.frankieScale).setDepth(10);
    this.frankie.body.setSize(84, 62).setOffset(24, 38);
    this.frankie.setCollideWorldBounds(true);
    this.frankie.play('frankie-run');
  }

  createSausages() {
    this.sausages = this.physics.add.group({ allowGravity: false });
    for (const { x, y } of this.level.sausages) {
      const s = this.sausages.create(x, y, 'sausage');
      s.body.moves = false;
      this.tweens.add({ targets: s, y: y - 8, duration: 700 + (x % 300), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
  }

  createObstacles() {
    this.obstacles = this.physics.add.group({ allowGravity: false });
    for (const { kind, x } of this.level.obstacles) {
      const o = this.obstacles.create(x, 0, kind);
      o.kind = kind;
      o.body.moves = false;
      if (kind === 'puddle') {
        o.y = GROUND_Y + 3;
        o.body.setSize(86, 14);
      } else if (kind === 'ball') {
        o.y = GROUND_Y - 24;
        o.body.setCircle(21, 5, 5);
      } else {
        o.y = GROUND_Y - 27;
        o.body.setSize(48, 50);
      }
    }
  }

  createGoal() {
    const { houseX } = this.level;
    this.add.image(houseX, GROUND_Y + 4, 'house').setOrigin(0.5, 1);
    this.add
      .text(houseX, GROUND_Y + 4 - 180 + 85, 'FRANKIE', { fontFamily: TITLE_FONT, fontSize: '17px', fontStyle: 'bold', color: '#6b3e1f' })
      .setOrigin(0.5);
    this.bowl = this.add.image(houseX - 115, GROUND_Y + 4, 'bowl').setOrigin(0.5, 1);
  }

  createHud() {
    this.slots = this.level.sausages.map((_, i) =>
      this.add.image(34 + i * HUD_GAP, HUD_Y, 'sausage-slot').setScale(HUD_SCALE).setScrollFactor(0).setDepth(50),
    );
    addMuteButton(this);
  }

  queueJump() {
    this.jumpQueuedAt = this.time.now;
  }

  update(time) {
    const f = this.frankie;
    const onGround = f.body.blocked.down || f.body.touching.down;
    if (onGround) this.lastGroundAt = time;

    const wantsJump = time - this.jumpQueuedAt < CONFIG.jumpBufferMs;
    const canJump = time - this.lastGroundAt < CONFIG.coyoteMs && !this.stumbling && !this.finished;
    if (wantsJump && canJump) {
      f.setVelocityY(CONFIG.jumpVelocity);
      this.jumpQueuedAt = -Infinity;
      this.lastGroundAt = -Infinity;
      sfx.jump();
    }

    if (!this.finished) {
      if (!this.stumbling) f.setVelocityX(CONFIG.runSpeed);
      if (this.stumbling) {
        f.anims.stop();
        f.setTexture('frankie-stumble');
      } else if (!onGround) {
        f.anims.stop();
        f.setTexture('frankie-jump');
      } else {
        f.play('frankie-run', true);
      }
      if (f.x >= this.level.goalX) this.finish();
    }

    this.backdrop.update(this.cameras.main.scrollX, time);
  }

  collect(s) {
    s.body.enable = false;
    this.tweens.killTweensOf(s);
    const cam = this.cameras.main;
    const slot = this.slots[this.collected];
    this.collected += 1;
    sfx.collect();
    this.burst('sparkle', s.x, s.y, 5, 50);

    // Fly from the world into the counter at the top.
    const flyer = this.add.image(s.x - cam.scrollX, s.y - cam.scrollY, 'sausage').setScrollFactor(0).setDepth(60);
    s.destroy();
    this.tweens.add({
      targets: flyer,
      x: slot.x,
      y: slot.y,
      scale: HUD_SCALE,
      duration: 450,
      ease: 'Cubic.easeIn',
      onComplete: () => {
        flyer.destroy();
        slot.setTexture('sausage');
        this.tweens.add({ targets: slot, scale: HUD_SCALE * 1.5, duration: 120, yoyo: true });
      },
    });
  }

  hitObstacle(o) {
    if (o.hit || this.stumbling || this.finished) return;
    o.hit = true;
    o.body.enable = false;
    this.stumbling = true;
    this.frankie.setVelocity(CONFIG.stumbleSpeed, -220);
    sfx.oops();
    this.burst('sparkle', this.frankie.x + 20, this.frankie.y - 40, 3, 40);

    if (o.kind === 'puddle') {
      sfx.splash();
      this.burst('drop', o.x, o.y - 6, 8, 70);
    } else if (o.kind === 'ball') {
      this.tweens.add({ targets: o, x: o.x + 320, angle: 540, duration: 900, ease: 'Cubic.easeOut' });
      this.tweens.add({ targets: o, y: o.y - 60, duration: 300, yoyo: true, ease: 'Quad.easeOut' });
    } else {
      this.tweens.add({ targets: o, angle: 12, duration: 90, yoyo: true, repeat: 3 });
    }

    // Stumbling is only a short pause: nothing is lost.
    this.time.delayedCall(CONFIG.stumbleMs, () => {
      this.stumbling = false;
    });
  }

  finish() {
    this.finished = true;
    const f = this.frankie;
    f.setVelocityX(0);
    f.anims.stop();
    f.setTexture('frankie-happy');
    sfx.bark();
    this.tweens.add({ targets: f, scaleY: CONFIG.frankieScale * 1.1, duration: 150, yoyo: true, repeat: 2 });

    this.time.delayedCall(1300, () => {
      this.cameras.main.fadeOut(400);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('EatScene', { collected: this.collected, total: this.level.sausages.length });
      });
    });
  }

  // Little particles that fly outwards and fade, e.g. sparkles or water drops.
  burst(key, x, y, count, spread) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
      const p = this.add.image(x, y, key).setDepth(20);
      this.tweens.add({
        targets: p,
        x: x + Math.cos(angle) * spread,
        y: y + Math.sin(angle) * spread,
        alpha: 0,
        scale: 0.4,
        duration: 500,
        onComplete: () => p.destroy(),
      });
    }
  }
}
