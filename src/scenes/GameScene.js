import { CONFIG, GAME_HEIGHT, GROUND_Y } from '../config.js';
import { getLevel } from '../levels.js';
import { buildLevel } from '../level.js';
import { WORLDS } from '../worlds.js';
import { createBackdrop } from '../backdrop.js';
import { DEPTH, createCourse } from '../course.js';
import { unlockLevel } from '../progress.js';
import { addMuteButton } from '../ui.js';
import { TITLE_FONT } from './StartScene.js';
import * as sfx from '../audio/sfx.js';

const HUD_Y = 34;
const HUD_GAP = 34;
const HUD_SCALE = 0.62;
const FALL_DEPTH = 24; // Frankie counts as fallen in once his paws are this far below the grass

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  init(data) {
    this.levelNo = data?.level ?? 1;
  }

  create() {
    this.level = buildLevel(getLevel(this.levelNo));
    // Levels may bring their own jump (the grown-up levels jump lower and shorter).
    // Set it every time, so a level without its own jump gets the usual one back.
    const jump = this.level.jump ?? { velocity: CONFIG.jumpVelocity, gravity: CONFIG.gravity };
    this.jumpVelocity = jump.velocity;
    this.physics.world.gravity.y = jump.gravity;
    this.collected = 0;
    this.finished = false;
    this.crashed = false;
    this.runningFrom = this.time.now + CONFIG.readyMs;
    this.jumpQueuedAt = -Infinity;
    this.lastGroundAt = -Infinity;

    const { length } = this.level;
    this.physics.world.setBounds(0, 0, length, GAME_HEIGHT);
    this.backdrop = createBackdrop(this, { world: this.level.world, length });
    this.course = createCourse(this, this.level, WORLDS[this.level.world]);

    this.createGoal();
    this.createFrankie();
    this.createHud();

    const c = this.course;
    this.physics.add.collider(this.frankie, c.ground);
    this.physics.add.collider(this.frankie, c.platforms);
    this.physics.add.overlap(this.frankie, c.sausages, (_f, s) => this.collect(s));
    this.physics.add.overlap(this.frankie, c.obstacles, (_f, o) => this.hitObstacle(o));

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
    this.frankie = this.physics.add.sprite(160, GROUND_Y - 60, 'frankie-happy').setScale(CONFIG.frankieScale).setDepth(DEPTH.frankie);
    this.frankie.body.setSize(118, 100).setOffset(40, 64); // body and head (without ears), in texture pixels
    this.frankie.setCollideWorldBounds(true);
    this.shadow = this.add.image(160, GROUND_Y + 2, 'shadow').setDepth(DEPTH.frankieShadow);
  }

  createGoal() {
    const { houseX } = this.level;
    this.add.image(houseX, GROUND_Y + 4, 'house').setOrigin(0.5, 1);
    this.add
      .text(houseX, GROUND_Y + 4 - 180 + 85, 'FRANKY', { fontFamily: TITLE_FONT, fontSize: '17px', fontStyle: 'bold', color: '#6b3e1f' })
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

  update(_time, delta) {
    // Scene clock, the same one queueJump() and the ready pause use.
    const time = this.time.now;
    const f = this.frankie;
    const onGround = f.body.blocked.down || f.body.touching.down;
    if (onGround) this.lastGroundAt = time;

    const running = time >= this.runningFrom && !this.finished && !this.crashed;
    const wantsJump = time - this.jumpQueuedAt < CONFIG.jumpBufferMs;
    const canJump = time - this.lastGroundAt < CONFIG.coyoteMs && running;
    if (wantsJump && canJump) {
      f.setVelocityY(this.jumpVelocity);
      this.jumpQueuedAt = -Infinity;
      this.lastGroundAt = -Infinity;
      sfx.jump();
    }

    if (running) {
      f.setVelocityX(this.level.speed);
      if (!onGround) {
        f.anims.stop();
        f.setTexture('frankie-jump');
      } else {
        f.play('frankie-run', true);
      }
      if (f.body.bottom > GROUND_Y + FALL_DEPTH) this.fallIn();
      else if (f.x >= this.level.goalX) this.finish();
    }

    this.updateShadow();
    this.course.update(time, delta, this.cameras.main.scrollX);
    this.backdrop.update(this.cameras.main.scrollX, time);
  }

  // Shadow on whatever is under Frankie; smaller and lighter the higher he jumps.
  updateShadow() {
    const body = this.frankie.body;
    const surface = this.course.surfaceBelow(body.center.x, body.bottom);
    if (surface === null || this.crashed) {
      this.shadow.setVisible(false);
      return;
    }
    const height = Math.max(0, surface - body.bottom);
    const k = Phaser.Math.Clamp(1 - height / 260, 0.35, 1);
    this.shadow.setVisible(true).setPosition(body.center.x, surface + 2).setDisplaySize(86 * k, 18 * k).setAlpha(k);
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
    } else if (o.kind === 'ball' || o.roll) {
      o.stopped = true;
      this.tweens.add({ targets: o, x: o.x + 320, angle: 540, duration: 900, ease: 'Cubic.easeOut' });
      this.tweens.add({ targets: o, y: o.y - 60, duration: 300, yoyo: true, ease: 'Quad.easeOut' });
    } else if (o.patrol || o.hop) {
      // A walking or hopping animal stops, hops in surprise and looks at Frankie.
      o.patrol?.stop();
      o.stopped = true;
      o.anims.stop();
      if (o.hop) {
        o.setTexture(o.kind);
        o.y = o.baseY;
        o.shadow.setDisplaySize(o.shadowW, o.shadowH).setAlpha(1);
      }
      o.setFlipX(false);
      this.tweens.add({ targets: o, y: o.y - 24, duration: 180, yoyo: true, ease: 'Quad.easeOut' });
    } else {
      this.tweens.add({ targets: o, angle: 12, duration: 90, yoyo: true, repeat: 3 });
    }
    this.restartSoon();
  }

  // Missed the jump over a gap: splash, then the level starts over.
  fallIn() {
    this.crashed = true;
    const f = this.frankie;
    f.anims.stop();
    f.setTexture('frankie-bonk');
    f.setDepth(DEPTH.fallen); // behind the water
    f.setCollideWorldBounds(false);
    f.setVelocity(0, 120);
    f.body.setAllowGravity(false);
    sfx.splash();
    sfx.oops();
    this.burst('drop', f.x, GROUND_Y + 30, 10, 80);
    this.restartSoon();
  }

  restartSoon() {
    this.time.delayedCall(CONFIG.crashMs, () => {
      this.cameras.main.fadeOut(350);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.restart({ level: this.levelNo }));
    });
  }

  // Three little stars circling above Frankie's head.
  dizzyStars() {
    const f = this.frankie;
    for (let i = 0; i < 3; i++) {
      const star = this.add.image(f.x, f.y, 'sparkle').setDepth(DEPTH.effects).setScale(0.8);
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
    unlockLevel(this.levelNo + 1);
    const f = this.frankie;
    f.setVelocityX(0);
    f.anims.stop();
    f.setTexture('frankie-happy');
    sfx.bark();
    this.tweens.add({ targets: f, scaleY: CONFIG.frankieScale * 1.1, duration: 150, yoyo: true, repeat: 2 });

    this.time.delayedCall(1300, () => {
      this.cameras.main.fadeOut(400);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('EatScene', { level: this.levelNo, collected: this.collected });
      });
    });
  }

  // Little particles that fly outwards and fade, e.g. sparkles or water drops.
  burst(key, x, y, count, spread) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
      const p = this.add.image(x, y, key).setDepth(DEPTH.effects);
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
