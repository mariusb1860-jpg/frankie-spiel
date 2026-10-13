// All tuning knobs live here (level layouts and speeds: levels.js). Change values here, not inside the scenes.

const params = new URLSearchParams(window.location.search);

// ?fast=1 shortens the levels (automated tests), ?debug=1 shows physics boxes,
// ?alle=1 unlocks every level (to try them all), ?paprika is the secret link for
// grown-ups (only the hard levels 6 and 7).
export const FAST = params.has('fast');
export const DEBUG = params.has('debug');
export const UNLOCK_ALL = params.has('alle');
export const PAPRIKA = params.has('paprika');

export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 540;
export const GROUND_Y = 460; // top edge of the grass

export const CONFIG = {
  runSpeed: 220, // px per second in level 1 (later levels set their own, see levels.js)
  jumpVelocity: -650, // with gravity: ~170 px high, ~1 s in the air
  gravity: 1250,
  jumpBufferMs: 180, // a tap shortly before landing still counts
  coyoteMs: 120, // a tap shortly after running off an edge still counts
  readyMs: 700, // Frankie waits a moment before he starts running
  crashMs: 1100, // after hitting an obstacle: dizzy pause, then the level starts over
  levelLength: 13200, // every level is this long (?fast=1 tests use shorter ones, see levels.js)
  frankieScale: 0.62,
  // Frankie's look, taken from photos of the real dog (fawn French bulldog).
  fur: {
    base: 0xd9a066, // fawn
    mask: 0x3d2e27, // dark muzzle
    earInner: 0x8a5a48, // inside of the ears
    collar: 0x3b2618, // dark leather collar
    bandana: 0x3fa9e0, // light blue gingham bandana
  },
};
