// Which part of the game the start screen shows: the child's levels 1-5 ('kids'), behind the
// paprika button the hard levels 6-10 for grown-ups ('paprika'), behind the pretzel button the
// Bavarian levels 11-15 for grown-ups ('bayern'). Kept in memory only: every visit of the link
// starts with the child's levels.
export const MODES = ['kids', 'paprika', 'bayern'];

let mode = 'kids';

export function getMode() {
  return mode;
}

export function setMode(m) {
  mode = m;
}
