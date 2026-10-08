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
    this.crashed = false;
    this.runningFrom = this.time.now + CONFIG.readyMs;
    this.jumpQueuedAt = -Infinity;
    this.lastGroundAt = -Infinity;

    const { length } = this.level;
    this.physics.world.setBounds(0, 0, length, GAME_HEIGHT);
    this.backdrop = createBackdrop(this, { length });

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
    this.frankie = this.physics.add.sprite(160, GROUND_Y - 60, 'frankie-happy').setScale(CONFIG.frankieScale).setDepth(10);
    this.frankie.body.setSize(118, 100).setOffset(40, 34); // body and head, in texture pixels
    this.frankie.setCollideWorldBounds(true);
  }

  createSausages() {
    this.sausages = this.physics.add.group({ allowGravity: false });
    for (const { x, y } of this.level.sausages) {
      const s = this.sausages.create(x, y, 'sausage');
      s.body.moves = false;
      this.tweens.add({ targets: s, y: y - 8, duration: 700 + (x % 300), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
  }

  // Hit boxes are smaller than the pictures, so a near miss still counts as a jump over.
  createObstacles() {
    this.obstacles = this.physics.add.group({ allowGravity: false });
    for (const { kind, x } of this.level.obstacles) {
      const o = this.obstacles.create(x, 0, kind);
      o.kind = kind;
      o.body.moves = false;
      if (kind === 'puddle') {
        o.y = GROUND_Y + 3;
        o.body.setSize(64, 10).setOffset(23, 8);
      } else if (kind === 'ball') {
        o.y = GROUND_Y - 21;
        o.body.setCircle(14, 8, 8);
      } else {
        o.y = GROUND_Y - 24;
        o.body.setSize(34, 34).setOffset(8, 16);
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
    // Soft panel behind the counter, so it stays readable in front of clouds.
    const width = this.level.sausages.length * HUD_GAP + 14;
    this.add.graphics().setScrollFactor(0).setDepth(49).fillStyle(0x2f5d8a, 0.35).fillRoundedRect(10, HUD_Y - 19, width, 38, 19);
    this.slots = this.level.sausages.map((_, i) =>
      this.add.image(34 + i * HUD_GAP, HUD_Y, 'sausage-slot').setScale(HUD_SCALE).setScrollFactor(0).setDepth(50),
    );
    addMuteButton(this);
  }

  queueJump() {
    this.jumpQueuedAt = this.time.now;
  }

  update() {
    // Scene clock, the same one queueJump() and the ready pause use.
    const time = this.time.now;
    const f = this.frankie;
    const onGround = f.body.blocked.down || f.body.touching.down;
    if (onGround) this.lastGroundAt = time;

    const running = time >= this.runningFrom && !this.finished && !this.crashed;
    const wantsJump = time - this.jumpQueuedAt < CONFIG.jumpBufferMs;
    const canJump = time - this.lastGroundAt < CONFIG.coyoteMs && running;
    if (wantsJump && canJump) {
      f.setVelocityY(CONFIG.jumpVelocity);
      this.jumpQueuedAt = -Infinity;
      this.lastGroundAt = -Infinity;
      sfx.jump();
    }

    if (running) {
      f.setVelocityX(CONFIG.runSpeed);
      if (!onGround) {
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

  // Bumping into an obstacle: Frankie gets dizzy, then the level starts over.
  hitObstacle(o) {
    if (this.crashed || this.finished) return;
    this.crashed = true;
    o.body.enable = false;
    const f = this.frankie;
    f.anims.stop();
    f.setTexture('frankie-bonk');
    f.setVelocity(-90, -260);
    f.setDragX(240);
    sfx.oops();
    this.dizzyStars();

    if (o.kind === 'puddle') {
      sfx.splash();
      this.burst('drop', o.x, o.y - 6, 8, 70);
    } else if (o.kind === 'ball') {
      this.tweens.add({ targets: o, x: o.x + 320, angle: 540, duration: 900, ease: 'Cubic.easeOut' });
      this.tweens.add({ targets: o, y: o.y - 60, duration: 300, yoyo: true, ease: 'Quad.easeOut' });
    } else {
      this.tweens.add({ targets: o, angle: 12, duration: 90, yoyo: true, repeat: 3 });
    }

    this.time.delayedCall(CONFIG.crashMs, () => {
      this.cameras.main.fadeOut(350);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.restart());
    });
  }

  // Three little stars circling above Frankie's head.
  dizzyStars() {
    const f = this.frankie;
    for (let i = 0; i < 3; i++) {
      const star = this.add.image(f.x, f.y, 'sparkle').setDepth(20).setScale(0.8);
      this.tweens.addCounter({
        from: 0,
        to: 1,
        duration: CONFIG.crashMs,
        onUpdate: (tw) => {
          const a = tw.getValue() * Math.PI * 4 + (i * Math.PI * 2) / 3;
          star.setPosition(f.x + 18 + Math.cos(a) * 30, f.y - 52 + Math.sin(a) * 9);
        },
        onComplete: () => star.destroy(),
      });
    }
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
