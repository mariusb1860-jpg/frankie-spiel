import { GROUND_Y } from './config.js';

// Sausage heights (center y). LOW is collected just by running,
// HIGH needs a jump, MID is in between (ends of a jump arc).
const LOW = GROUND_Y - 32;
const MID = GROUND_Y - 88;
const HIGH = GROUND_Y - 160;
const GAP = 80; // distance between sausages inside a group

export const BLOCK = 48; // width of one floating block
export const BLOCK_HEIGHT = 32;
// Top edge of the floating blocks: tier 1 can be reached from the ground (Frankie
// jumps about 170 px high), tier 2 only from tier 1.
export const TIER_TOP = { 1: GROUND_Y - 130, 2: GROUND_Y - 235 };
const ON_BLOCK = 30; // sausages on blocks float this far above the block

// Turns a level definition (see levels.js) into concrete sausages, obstacles, gaps and blocks.
export function buildLevel(def) {
  const sausages = [];
  const obstacles = [];
  const gaps = [];
  const platforms = [];

  for (const item of def.layout) {
    const { kind, x } = item;
    if (kind === 'row') {
      sausages.push({ x: x - GAP, y: LOW }, { x, y: LOW }, { x: x + GAP, y: LOW });
    } else if (kind === 'arc') {
      sausages.push({ x: x - GAP, y: MID }, { x, y: HIGH }, { x: x + GAP, y: MID });
    } else if (kind === 'high') {
      sausages.push({ x, y: HIGH });
    } else if (kind === 'gap') {
      gaps.push({ x0: x - item.width / 2, x1: x + item.width / 2 });
    } else if (kind === 'blocks') {
      const top = TIER_TOP[item.tier];
      const x1 = x + item.tiles * BLOCK;
      platforms.push({ x0: x, x1, top, tiles: item.tiles, tier: item.tier });
      // Sausages spread evenly over the blocks.
      for (let i = 0; i < item.sausages; i++) {
        sausages.push({ x: x + ((x1 - x) * (i + 0.5)) / item.sausages, y: top - ON_BLOCK });
      }
    } else {
      obstacles.push({ kind, x });
    }
  }

  const { length } = def;
  gaps.sort((a, b) => a.x0 - b.x0);
  return {
    number: def.number,
    world: def.world,
    speed: def.speed,
    length,
    sausages,
    obstacles,
    gaps,
    platforms,
    goalX: length - 420, // Frankie stops here
    houseX: length - 230,
  };
}
