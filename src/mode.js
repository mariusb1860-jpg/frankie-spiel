// Which half of the game is shown: the child's levels 1-5 or, behind the paprika button on
// the start screen, the hard levels 6-10 for grown-ups. Kept in memory only: every visit of
// the link starts with the child's levels.
let grownUps = false;

export function isGrownUps() {
  return grownUps;
}

export function setGrownUps(on) {
  grownUps = on;
}
