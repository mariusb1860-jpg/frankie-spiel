import { UNLOCK_ALL } from './config.js';
import { groupOf } from './levels.js';
import { getMode } from './mode.js';

// Remembers on this device how far the child got (highest level that is open).
// If the browser blocks storage (private mode), progress lasts until the page is closed.

// Each part of the game keeps its own progress, so grown-up progress never opens the child's levels on a shared device.
// The names stay "frankie-...": renaming them would lose the progress saved before.
const KEYS = { kids: 'frankie-unlocked', paprika: 'frankie-unlocked-paprika', bayern: 'frankie-unlocked-bayern' };
const inMemory = Object.fromEntries(Object.values(KEYS).map((k) => [k, 1]));

function stored(key) {
  try {
    return Number.parseInt(window.localStorage.getItem(key), 10) || 1;
  } catch {
    return 1;
  }
}

/** Highest level the child may play in the part shown now (?alle=1 opens all of them). */
export function unlockedLevel() {
  const key = KEYS[getMode()];
  return UNLOCK_ALL ? Infinity : Math.max(stored(key), inMemory[key]);
}

/** Opens level n. It counts for the part of the level just finished (n - 1), whichever part is shown. */
export function unlockLevel(n) {
  const key = KEYS[groupOf(n - 1)];
  inMemory[key] = Math.max(inMemory[key], n);
  if (n <= stored(key)) return;
  try {
    window.localStorage.setItem(key, String(n));
  } catch {
    // Storage blocked: inMemory keeps the level open for this visit.
  }
}
