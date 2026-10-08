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
const sandcastle = thing('sandcastle');
const crab = thing('crab'); // walks sideways, back and forth
const beachball = thing('beachball'); // rolls towards Frankie
const haybale = thing('haybale');
const milkcan = thing('milkcan');
const chicken = thing('chicken'); // walks back and forth, a bit faster
const frog = thing('frog'); // hops up and down
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
  {
    // Level 3, beach: faster again, three water channels (the widest one only over
    // the pier), crabs walking sideways and beach balls rolling towards Frankie.
    world: 'beach',
    speed: 244,
    layout: [
      row(700),
      sandcastle(1400),
      high(2000),
      stream(2550, 140),
      crab(3200),
      arc(3850),
      blocks(4300, 5, { sausages: 3 }),
      blocks(4480, 4, { tier: 2, sausages: 2 }),
      beachball(5400),
      sandcastle(6050),
      blocks(6550, 12, { sausages: 3 }), // the pier: the channel below is too wide to jump over
      stream(6860, 400),
      row(7750),
      crab(8400),
      high(9000),
      beachball(9800),
      stream(10450, 160),
      sandcastle(11100),
      high(11650),
      crab(12200),
    ],
    fast: {
      length: 3600,
      layout: [row(600), sandcastle(1000), blocks(1340, 10, { sausages: 2 }), stream(1580, 340), crab(2150), beachball(3100)],
    },
  },
  {
    // Level 4, farm: faster, four ditches, chickens, hopping frogs and long
    // paths of crates (one with a second floor).
    world: 'farm',
    speed: 256,
    layout: [
      row(700),
      haybale(1350),
      high(1950),
      stream(2500, 150),
      chicken(3150),
      arc(3800),
      // A long crate path over the next ditch, with a second floor. Sausages on the
      // lower path only before the upper one starts, so all of them can be reached.
      blocks(4250, 4, { sausages: 2 }),
      blocks(4442, 10),
      blocks(4450, 5, { tier: 2, sausages: 2 }),
      stream(4700, 150),
      frog(5550),
      haybale(6150),
      stream(6800, 160),
      row(7450),
      chicken(8100),
      high(8700),
      milkcan(9300),
      blocks(9800, 10, { sausages: 4 }),
      stream(10050, 170),
      frog(10850),
      high(11400),
      haybale(12000),
    ],
    fast: {
      length: 3600,
      layout: [row(600), haybale(1000), blocks(1350, 8, { sausages: 2 }), stream(1550, 150), chicken(2150), frog(2750), high(3050)],
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
