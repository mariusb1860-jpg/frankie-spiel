import { loadSvg } from './svg.js';

// Level 8, Lake Balaton (grown-ups, only loaded with ?paprika).
// Everything here is background: soft outlines, never the strong OUTLINE.

const PIECES = {};

export function balatonSvgs() {
  return Object.fromEntries(Object.entries(PIECES).map(([key, [w, h, draw]]) => [key, { w, h, svg: draw() }]));
}

export function preloadBalaton(scene) {
  for (const [key, { w, h, svg }] of Object.entries(balatonSvgs())) loadSvg(scene, key, svg, w, h);
}
