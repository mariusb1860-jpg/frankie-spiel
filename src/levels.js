import { CONFIG, FAST, PAPRIKA } from './config.js';

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
const snowman = thing('snowman');
const snowball = thing('snowball'); // rolls towards Frankie
const rabbit = thing('rabbit'); // hops a little way to the left and back
// A gap in the ground with water; x is its middle. Falling in = start again.
const stream = (x, width) => ({ kind: 'gap', x, width });
// Floating blocks (48 px each) starting at x. tier 1 is reachable from the ground,
// tier 2 only from tier 1. Sausages lie on top.
const blocks = (x, tiles, { tier = 1, sausages = 0 } = {}) => ({ kind: 'blocks', x, tiles, tier, sausages });

// Kept for one release so browsers with cached old scenes still load; remove later. Nothing uses it.
export const PLANNED_LEVELS = 5;

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
  {
    // Level 5, winter: the fastest level. Five ice holes (two of them only over
    // the ice blocks), snowmen, rolling snowballs and hopping hares.
    world: 'winter',
    speed: 268,
    layout: [
      row(700),
      snowman(1300),
      high(1850),
      stream(2400, 150),
      rabbit(3050),
      arc(3650),
      blocks(4100, 13, { sausages: 4 }), // ice bridge: the hole below is too wide to jump over
      stream(4410, 420),
      snowball(5450),
      snowman(5950),
      stream(6500, 160),
      blocks(7000, 4, { sausages: 1 }),
      blocks(7180, 5, { tier: 2, sausages: 2 }),
      rabbit(8050),
      arc(8600),
      blocks(9100, 13, { sausages: 3 }), // second ice bridge
      stream(9410, 420),
      snowball(10450),
      stream(11000, 170),
      snowman(11600),
      rabbit(12150),
    ],
    fast: {
      length: 3800,
      layout: [row(600), snowman(1000), blocks(1300, 12, { sausages: 2 }), stream(1590, 400), snowball(2700), rabbit(3150)],
    },
  },
  {
    // Level 6, Puszta: only for grown-ups (secret link ?paprika). Faster, a lower and
    // shorter jump, animals 1.4 times as fast, chains of obstacles and stepping stones.
    world: 'puszta',
    speed: 290,
    jump: { velocity: -788, gravity: 2020 }, // ~147 px high, ~0.78 s in the air
    animalSpeed: 1.4,
    layout: [
      row(650),
      haybale(1150),
      milkcan(1450), // two in a row: land and jump again
      high(1800),
      stream(2150, 190),
      hedgehog(2550),
      arc(2950),
      stream(3350, 200),
      crate(3680), // right behind the ditch
      frog(4000),
      chicken(4300),
      // Stepping stones: crates over a ditch far too wide to jump, one hop per crate.
      blocks(4600, 2, { sausages: 1 }),
      blocks(4800, 2),
      blocks(5000, 2, { sausages: 1 }),
      blocks(5200, 2),
      stream(4950, 560),
      log(5650),
      rabbit(5950),
      row(6300),
      stump(6650),
      stream(6950, 210),
      puddle(7300), // right behind the ditch
      high(7550),
      chicken(7850),
      haybale(8150),
      // A staircase over a wide ditch: up to the second floor, then down on the far side.
      blocks(8450, 4, { sausages: 1 }),
      blocks(8600, 4, { tier: 2, sausages: 2 }),
      stream(8700, 420),
      hedgehog(9250),
      milkcan(9550),
      crate(9850), // three in a row
      arc(10200),
      stream(10550, 220),
      frog(10850),
      rabbit(11150),
      log(11450),
      high(11750),
      haybale(12050),
    ],
    fast: {
      length: 3600,
      layout: [row(600), haybale(1000), stream(1350, 190), hedgehog(1750), blocks(2050, 4, { sausages: 2 }), frog(2650), high(3000)],
    },
  },
  {
    // Level 7, Budapest: only for grown-ups. The fastest level, the shortest jump and
    // animals at 1.7 times speed; long chains, single-block stepping stones, rolling balls
    // that meet Frankie just behind a brook. Only hedgehogs walk here: at this speed a
    // chicken or a hopping rabbit leaves under 0.10 s to jump (measured), a hedgehog at
    // least 0.115 s in every phase. At 1.8 times speed the hedgehog dropped to about 0.10 s.
    world: 'budapest',
    speed: 310,
    jump: { velocity: -913, gravity: 2766 }, // ~143 px high, ~0.66 s in the air
    animalSpeed: 1.7,
    layout: [
      row(600),
      crate(950),
      ball(1220),
      log(1490), // three in a row
      stream(1830, 200),
      hedgehog(2200),
      ball(2450),
      high(2450), // the sausage hangs right above the ball
      hedgehog(2750),
      log(3020),
      puddle(3290),
      stream(3620, 215),
      beachball(4100), // starts rolling when Frankie is at ~3350, meets him at ~3850 (solid ground, 120 px behind the brook)
      crate(4230),
      arc(4230), // the jump over the crate collects the arc
      // Stepping stones: single blocks over a brook far too wide to jump.
      blocks(4520, 1),
      blocks(4710, 1, { sausages: 1 }),
      blocks(4900, 1),
      blocks(5090, 1, { sausages: 1 }),
      stream(4870, 640),
      crate(5500),
      hedgehog(5780),
      ball(6050),
      stream(6380, 220),
      log(6630), // right behind the brook
      row(6950),
      hedgehog(7250),
      hedgehog(7520),
      stream(7860, 225),
      puddle(8110), // right behind the brook
      log(8400),
      high(8400),
      beachball(8950), // meets Frankie at ~8700, between the log and the ball
      ball(9270),
      log(9540),
      // A staircase over a wide brook: up to the second floor, then down on the far side.
      blocks(9850, 3, { sausages: 1 }),
      blocks(10010, 3, { tier: 2, sausages: 2 }),
      stream(10090, 420),
      hedgehog(10620),
      stream(10920, 210),
      hedgehog(11220),
      crate(11500),
      arc(11500),
      hedgehog(11800),
      crate(12070),
      stream(12350, 225),
      high(12600),
    ],
    fast: {
      length: 3600,
      layout: [row(600), crate(1000), ball(1270), stream(1650, 210), beachball(2400), blocks(2700, 3, { sausages: 2 }), high(3200)],
    },
  },

  // ---- Level 8 (grown-ups) ----
  {
    // Level 8, Lake Balaton: only for grown-ups. Faster again, a shorter jump, animals at
    // 1.7 times speed. What makes it hard: pairs of obstacles only 176 px apart (the first jump
    // must go late, the second follows on landing), gaps of 272-274 px (jump window about
    // 0.12 s), a rolling beach ball released right behind a gap, jetty stepping stones and a
    // staircase that both end in an obstacle on the landing. Crabs are replaced by hedgehogs:
    // a crab (wide hit box) leaves only about 0.06 s at 1.7 times speed (measured), a hedgehog
    // at least 0.15 s in every phase.
    world: 'balaton',
    speed: 320,
    jump: { velocity: -942, gravity: 2943 }, // ~143 px high, ~0.64 s in the air
    animalSpeed: 1.7,
    layout: [
      row(650),
      sandcastle(920),
      crate(1096), // pair 176 px apart
      puddle(1341),
      ball(1519),
      high(1519), // the sausage hangs right above the ball
      stream(1830, 272),
      hedgehog(2251),
      sandcastle(2581),
      crate(2757), // pair
      puddle(3002),
      stream(3309, 274),
      beachball(3879), // starts rolling when Frankie is at ~3130, meets him at ~3640, 190 px behind the gap
      sandcastle(3906),
      crate(4082), // pair
      row(4322), // breather
      hedgehog(4572),
      sandcastle(4902),
      puddle(5078), // pair
      stream(5409, 272),
      crate(5780),
      hedgehog(6030),
      ball(6330),
      high(6330),
      crate(6506), // pair
      high(6506),
      // Jetty stepping stones: single blocks over water far too wide to jump; the last one
      // ends 52 px before the bank, and a sandcastle waits on the landing.
      blocks(6776, 1),
      blocks(6966, 1, { sausages: 1 }),
      blocks(7156, 1),
      blocks(7346, 1, { sausages: 1 }),
      stream(7126, 640),
      sandcastle(7541),
      hedgehog(7803),
      puddle(8103),
      sandcastle(8281),
      stream(8613, 274),
      row(8990), // breather
      sandcastle(9240),
      crate(9416), // pair
      puddle(9661),
      ball(9839),
      arc(9839),
      stream(10171, 274),
      hedgehog(10558),
      sandcastle(10888),
      crate(11064), // pair
      // A staircase over a wide water: up to the second floor, then walk off its end
      // straight into a sandcastle.
      blocks(11309, 3, { sausages: 1 }),
      blocks(11469, 3, { tier: 2, sausages: 2 }),
      stream(11549, 420),
      sandcastle(11859),
      hedgehog(12149),
      ball(12434),
      crate(12610), // pair
    ],
    fast: {
      length: 3600,
      layout: [row(600), sandcastle(960), crate(1136), puddle(1381), stream(1590, 272), hedgehog(2110), sandcastle(2440), crate(2616), beachball(3143)],
    },
  },

  // ---- Level 9 (grown-ups) ----
  {
    // Level 9, Tokaj vineyards: the jump reaches ~205 px, so ditches of 264 px leave only ~0.13 s
    // to take off; hedgehogs (1.7 times speed) leave ~0.13 s in their worst phase. Obstacles come
    // in chains of 222 px with an obstacle right behind a ditch, and two ditches in a row with a
    // short island. New: a long two-floor terrace over a 716 px ditch that ends in a hop down to
    // the far block, a staircase that ends in a chain, a hedgehog under a block row. No chickens
    // or hopping rabbits (under 0.10 s at this speed, see level 7): only hedgehogs walk and frogs
    // hop on the spot. The hedgehog is 285 px or more from the next hazard (it needs the room).
    world: 'tokaj',
    speed: 330,
    jump: { velocity: -972, gravity: 3136 }, // ~143 px high, ~0.62 s in the air
    animalSpeed: 1.7,
    layout: [
      row(500),
      crate(783), // the first pair is only 182 px apart
      haybale(965),
      milkcan(1187),
      ball(1409),
      stump(1631),
      arc(1631),
      stream(1878, 264), // 264 px: the jump reaches ~205 px, only ~0.13 s to take off
      log(2085), // right behind the ditch
      hedgehog(2375),
      ball(2665),
      stream(2912, 264),
      puddle(3114),
      hedgehog(3404),
      stump(3694),
      stream(3941, 264),
      frog(4153),
      hedgehog(4443),
      // Staircase over a wide ditch: up to the second floor, then down on the far side, into a chain.
      blocks(4963, 3, { sausages: 1 }),
      blocks(5123, 3, { tier: 2, sausages: 2 }),
      stream(5205, 404),
      crate(5647),
      arc(5647),
      stump(5869),
      haybale(6051),
      hedgehog(6341),
      milkcan(6631),
      stream(6878, 264),
      crate(7080),
      arc(7080),
      hedgehog(7370),
      stump(7660),
      stream(7907, 264),
      milkcan(8114),
      hedgehog(8404),
      puddle(8694),
      log(8880),
      crate(9102),
      high(9102),
      // Terrace: first floor, up to the second floor, then a hop down to the third block, over a wide ditch.
      blocks(9462, 3, { sausages: 1 }),
      blocks(9682, 4, { tier: 2, sausages: 2 }),
      blocks(10004, 5, { sausages: 1 }),
      stream(9880, 716),
      crate(10478),
      milkcan(10700),
      blocks(10912, 6), // the hedgehog walks under these blocks
      hedgehog(11000),
      ball(11290),
      stream(11557, 264),
      stream(11971, 264),
      crate(12173),
      milkcan(12395),
      log(12591),
    ],
    fast: {
      length: 3600,
      layout: [row(500), crate(900), haybale(1082), stump(1304), stream(1551, 264), log(1758), arc(1758), hedgehog(2048), ball(2338), stream(2585, 264), puddle(2787), high(2787)],
    },
  },

  // ---- Level 10 (grown-ups) ----
  {
    // Level 10, Visegrád at the Danube bend: the finale (work in progress, layout v5 from the builder, 43 hazards, not yet measured).
    world: 'visegrad',
    speed: 340,
    jump: { velocity: -1005, gravity: 3349 }, // ~142 px high, ~0.60 s in the air
    animalSpeed: 1.7,
    layout: [
      row(560),
      crate(800),
      high(800),
      haybale(984),
      milkcan(1208),
      stream(1532, 268),
      arc(1532),
      log(1738),
      hedgehog(2028),
      stump(2318),
      puddle(2514),
      ball(2710),
      stream(3034, 268),
      crate(3240),
      stream(3480, 268),
      arc(3480),
      hedgehog(3904),
      beachball(4664),
      crate(4844),
      haybale(5036),
      stump(5228),
      milkcan(5424),
      stream(5748, 268),
      frog(6062),
      hedgehog(6352),
      blocks(6662, 3, { sausages: 1 }),
      blocks(6822, 3, { tier: 2, sausages: 2 }),
      stream(6904, 404),
      crate(7336),
      haybale(7528),
      milkcan(7728),
      stream(8052, 268),
      log(8258),
      hedgehog(8548),
      beachball(8978),
      crate(9168),
      haybale(9364),
      stump(9560),
      milkcan(9756),
      ball(9952),
      stream(10276, 268),
      crate(10482),
      stream(10722, 268),
      hedgehog(11146),
      milkcan(11436),
      stump(11632),
      puddle(11828),
      stream(12152, 268),
      log(12358),
    ],
    fast: {
      length: 3600,
      layout: [row(520), crate(840), high(840), haybale(1024), milkcan(1248), ball(1432), stream(1672, 268), arc(1690), log(1872), hedgehog(2117), stump(2392), puddle(2576), stream(2816, 268), arc(2834)],
    },
  },
];

// Levels 1-5 are the child's game. Levels 6 to 10 are very hard levels for grown-ups;
// only the secret link (?paprika) shows them, and then only them.
const KIDS = [1, 2, 3, 4, 5];
const GROWN_UPS = [6, 7, 8, 9, 10];

/** Level numbers that get a button on the start screen. */
export function shownLevels() {
  return PAPRIKA ? GROWN_UPS : KIDS;
}

/** True for the last level of its group (5 or 10): the big celebration follows it. */
export function isFinale(n) {
  return n === KIDS[KIDS.length - 1] || n === GROWN_UPS[GROWN_UPS.length - 1];
}

/** Level definition for level number n (1-based), with its length; null if not built yet. */
export function getLevel(n) {
  const def = LEVELS[n - 1];
  if (!def) return null;
  return FAST ? { ...def, number: n, ...def.fast } : { ...def, number: n, length: CONFIG.levelLength };
}
