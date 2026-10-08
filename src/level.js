import { CONFIG, GROUND_Y, LAYOUT } from './config.js';

// Sausage heights (center y). LOW is collected just by running,
// HIGH needs a jump, MID is in between (ends of a jump arc).
const LOW = GROUND_Y - 32;
const MID = GROUND_Y - 88;
const HIGH = GROUND_Y - 160;
const GAP = 80; // distance between sausages inside a group

const OBSTACLES = ['puddle', 'ball', 'crate'];

// Turns the compact LAYOUT into concrete sausages and obstacles.
export function buildLevel() {
  const sausages = [];
  const obstacles = [];

  for (const [kind, x] of LAYOUT) {
    if (kind === 'row') {
      sausages.push({ x: x - GAP, y: LOW }, { x, y: LOW }, { x: x + GAP, y: LOW });
    } else if (kind === 'arc') {
      sausages.push({ x: x - GAP, y: MID }, { x, y: HIGH }, { x: x + GAP, y: MID });
    } else if (kind === 'high') {
      sausages.push({ x, y: HIGH });
    } else if (OBSTACLES.includes(kind)) {
      obstacles.push({ kind, x });
    }
  }

  const length = CONFIG.levelLength;
  return {
    length,
    sausages,
    obstacles,
    goalX: length - 420, // Frankie stops here
    houseX: length - 230,
  };
}
