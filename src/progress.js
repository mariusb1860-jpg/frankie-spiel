import { UNLOCK_ALL } from './config.js';

// Remembers on this device how far the child got (highest level that is open).
// If the browser blocks storage (private mode), progress lasts until the page is closed.

const KEY = 'frankie-unlocked';
let inMemory = 1;

function stored() {
  try {
    return Number.parseInt(window.localStorage.getItem(KEY), 10) || 1;
  } catch {
    return 1;
  }
}

/** Highest level the child may play (?alle=1 opens all of them). */
export function unlockedLevel() {
  return UNLOCK_ALL ? Infinity : Math.max(stored(), inMemory);
}

export function unlockLevel(n) {
  inMemory = Math.max(inMemory, n);
  if (n <= stored()) return;
  try {
    window.localStorage.setItem(KEY, String(n));
  } catch {
    // Storage blocked: inMemory keeps the level open for this visit.
  }
}
