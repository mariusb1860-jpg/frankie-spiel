import * as sfx from './audio/sfx.js';

// Small speaker button in the top right corner, the same in every scene.
export function addMuteButton(scene) {
  const icon = () => (sfx.isMuted() ? 'icon-sound-off' : 'icon-sound-on');
  const btn = scene.add.image(912, 46, icon()).setScrollFactor(0).setDepth(100);
  btn.setInteractive({ useHandCursor: true });
  btn.on('pointerdown', () => {
    sfx.unlock();
    sfx.toggleMute();
    btn.setTexture(icon());
  });
  return btn;
}

// Big round button that gently pulses. onPress runs on pointerup,
// because browsers only allow fullscreen from a pointerup.
export function addBigButton(scene, x, y, key, onPress) {
  const btn = scene.add.image(x, y, key).setScrollFactor(0).setDepth(100);
  btn.setInteractive({ useHandCursor: true });
  scene.tweens.add({ targets: btn, scale: 1.08, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  btn.on('pointerup', onPress);
  return btn;
}

// On phones and tablets: go fullscreen and lock to landscape where the browser allows it.
export function enterFullscreen(scene) {
  if (scene.sys.game.device.os.desktop || scene.scale.isFullscreen) return;
  try {
    scene.scale.startFullscreen();
    window.screen.orientation?.lock?.('landscape').catch(() => {});
  } catch {
    // Not supported (e.g. iPhone Safari): the game still works in the normal browser view.
  }
}
