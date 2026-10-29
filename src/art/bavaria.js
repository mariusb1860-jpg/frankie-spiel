import { GAME_WIDTH } from '../config.js';
import { loadSvg, svgDoc } from './svg.js';
import { attrs } from './scenery.js';

// Pieces shared by the Bavarian levels 11-15 (only loaded after the pretzel button): the white
// and blue bunting of the celebration after level 15.

const f1 = (n) => n.toFixed(1);
export const BAVARIAN_BLUE = '#2f7fc9';
export const BAVARIAN_BLUE_DARK = '#1d5a96';

// Two garlands of white and blue pennants across the top of the screen, each with a lozenge
// in the other colour (like the Bavarian flag).
function buntingBayern() {
  const flags = [];
  const strings = [];
  for (const [x0, x1] of [[-20, 490], [470, 980]]) {
    const mid = (x0 + x1) / 2;
    const at = (t) => [x0 + (x1 - x0) * t, 12 + 4 * 52 * t * (1 - t)];
    strings.push(`<path d="M${x0} 12 Q${mid} 116 ${x1} 12" fill="none" stroke="#6b4a2a" stroke-width="2.5"/>`);
    for (let i = 1; i < 12; i++) {
      const [x, y] = at(i / 12);
      const blue = (i + (x0 > 0 ? 1 : 0)) % 2 === 0;
      const [fill, lozenge] = blue ? [BAVARIAN_BLUE, '#ffffff'] : ['#ffffff', BAVARIAN_BLUE];
      flags.push(`<path d="M${f1(x - 15)} ${f1(y)} L${f1(x + 15)} ${f1(y)} L${f1(x)} ${f1(y + 32)} Z" fill="${fill}" ${attrs('#3a4a6a', 2)}/>`);
      flags.push(`<path d="M${f1(x)} ${f1(y + 4)} L${f1(x + 5)} ${f1(y + 11)} L${f1(x)} ${f1(y + 18)} L${f1(x - 5)} ${f1(y + 11)} Z" fill="${lozenge}"/>`);
    }
  }
  return svgDoc(GAME_WIDTH, 110, `${strings.join('')}${flags.join('')}`);
}

const PIECES = {
  'bunting-bayern': [GAME_WIDTH, 110, buntingBayern],
};

export function bavariaSvgs() {
  return Object.fromEntries(Object.entries(PIECES).map(([key, [w, h, draw]]) => [key, { w, h, svg: draw() }]));
}

export function preloadBavaria(scene) {
  for (const [key, { w, h, svg }] of Object.entries(bavariaSvgs())) loadSvg(scene, key, svg, w, h);
}
