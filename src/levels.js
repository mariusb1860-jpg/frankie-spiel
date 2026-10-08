import { CONFIG, FAST } from './config.js';

// The levels. Each layout is a list of what comes where (x in px from the start).
// Every level has 20 sausages; Frankie stops at the dog house at the end.

const row = (x) => ({ kind: 'row', x }); // 3 sausages on the ground
const arc = (x) => ({ kind: 'arc', x }); // 3 sausages along one jump
const high = (x) => ({ kind: 'high', x }); // 1 sausage that needs a jump
const thing = (kind) => (x) => ({ kind, x });
const puddle = thing('puddle');
const ball = thing('ball');
const crate = thing('crate');
const stump = thing('stump');
const log = thing('log');
const hedgehog = thing('hedgehog'); // walks back and forth
// A gap in the ground with water; x is its middle. Falling in = start again.
const stream = (x, width) => ({ kind: 'gap', x, width });
// Floating blocks (48 px each) starting at x. tier 1 is reachable from the ground,
// tier 2 only from tier 1. Sausages lie on top.
const blocks = (x, tiles, { tier = 1, sausages = 0 } = {}) => ({ kind: 'blocks', x, tiles, tier, sausages });

export const LEVELS = [
  {
    // Level 1 is finished: Marius wants it exactly like this.
    world: 'garden',
    speed: CONFIG.runSpeed,
    layout: [
      row(700), puddle(1500), high(2250), arc(3000), ball(3800), high(4550), crate(5300), row(6050),
      high(6800), puddle(7550), arc(8300), ball(9100), high(9850), crate(10600), row(11350), high(12000),
    ],
    fast: { length: 2600, layout: [row(600), high(1050), crate(1450), arc(1850)] },
  },
  {
    // Level 2, forest: a bit faster, first blocks, two streams, walking hedgehogs.
    world: 'forest',
    speed: 232,
    layout: [
      row(700),
      stump(1450),
      blocks(2050, 5, { sausages: 3 }),
      high(2800),
      stream(3350, 130),
      hedgehog(4050),
      arc(4750),
      log(5400),
      blocks(6000, 5, { sausages: 2 }),
      blocks(6200, 5, { tier: 2, sausages: 2 }),
      puddle(6950),
      row(7550),
      blocks(8130, 6, { sausages: 1 }), // a bridge over the next stream (jumping over works too)
      stream(8250, 140),
      hedgehog(9050),
      high(9750),
      stump(10450),
      log(11150),
      high(11850),
    ],
    fast: {
      length: 3400,
      layout: [row(600), blocks(950, 4, { sausages: 2 }), stream(1550, 130), hedgehog(2050), log(2550), high(2900)],
    },
  },
];

// How many levels are planned (the start screen shows a button for each).
export const PLANNED_LEVELS = 5;

/** Level definition for level number n (1-based), with its length; null if not built yet. */
export function getLevel(n) {
  const def = LEVELS[n - 1];
  if (!def) return null;
  return FAST ? { ...def, number: n, ...def.fast } : { ...def, number: n, length: CONFIG.levelLength };
}
