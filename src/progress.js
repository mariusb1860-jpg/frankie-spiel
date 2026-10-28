import { UNLOCK_ALL } from './config.js';
import { isGrownUps } from './mode.js';

// Remembers on this device how far the child got (highest level that is open).
// If the browser blocks storage (private mode), progress lasts until the page is closed.

// The grown-up levels keep their own progress, so grown-up progress never opens the child's levels on a shared device.
// The names stay "frankie-...": renaming them would lose the progress saved before.
const key = () => (isGrownUps() ? 'frankie-unlocked-paprika' : 'frankie-unlocked');
const inMemory = { 'frankie-unlocked': 1, 'frankie-unlocked-paprika': 1 };

function stored() {
  try {
    return Number.parseInt(window.localStorage.getItem(key()), 10) || 1;
  } catch {
    return 1;
  }
}

/** Highest level the child may play (?alle=1 opens all of them). */
export function unlockedLevel() {
  return UNLOCK_ALL ? Infinity : Math.max(stored(), inMemory[key()]);
}

export function unlockLevel(n) {
  inMemory[key()] = Math.max(inMemory[key()], n);
  if (n <= stored()) return;
  try {
    window.localStorage.setItem(key(), String(n));
  } catch {
    // Storage blocked: inMemory keeps the level open for this visit.
  }
}
