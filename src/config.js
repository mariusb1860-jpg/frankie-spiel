// All tuning knobs live here. Change values here, not inside the scenes.

const params = new URLSearchParams(window.location.search);

// ?fast=1 shortens the level (automated tests), ?debug=1 shows physics boxes.
export const FAST = params.has('fast');
export const DEBUG = params.has('debug');

export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 540;
export const GROUND_Y = 460; // top edge of the grass

export const CONFIG = {
  runSpeed: 220, // px per second
  jumpVelocity: -650, // with gravity: ~170 px high, ~1 s in the air
  gravity: 1250,
  jumpBufferMs: 180, // a tap shortly before landing still counts
  coyoteMs: 120, // a tap shortly after running off an edge still counts
  readyMs: 700, // Frankie waits a moment before he starts running
  crashMs: 1100, // after hitting an obstacle: dizzy pause, then the level starts over
  levelLength: FAST ? 2600 : 13200,
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

// Level layout: what appears where (x in px). 'row' = 3 sausages on the ground,
// 'arc' = 3 sausages along a jump, 'high' = 1 sausage that needs a jump.
const LAYOUT_FULL = [
  ['row', 700],
  ['puddle', 1500],
  ['high', 2250],
  ['arc', 3000],
  ['ball', 3800],
  ['high', 4550],
  ['crate', 5300],
  ['row', 6050],
  ['high', 6800],
  ['puddle', 7550],
  ['arc', 8300],
  ['ball', 9100],
  ['high', 9850],
  ['crate', 10600],
  ['row', 11350],
  ['high', 12000],
];

const LAYOUT_FAST = [
  ['row', 600],
  ['high', 1050],
  ['crate', 1450],
  ['arc', 1850],
];

export const LAYOUT = FAST ? LAYOUT_FAST : LAYOUT_FULL;

// The landscape changes along the way: garden, meadow, village (share of the level length).
export const ZONES = [
  { key: 'garden', until: 1 / 3 },
  { key: 'meadow', until: 2 / 3 },
  { key: 'village', until: 1 },
];
