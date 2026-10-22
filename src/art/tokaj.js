import { loadSvg } from './svg.js';

// Level 9, the Tokaj vineyards in autumn (grown-ups, only loaded with ?paprika).
// Everything here is background: soft outlines, never the strong OUTLINE.

const PIECES = {};

export function tokajSvgs() {
  return Object.fromEntries(Object.entries(PIECES).map(([key, [w, h, draw]]) => [key, { w, h, svg: draw() }]));
}

export function preloadTokaj(scene) {
  for (const [key, { w, h, svg }] of Object.entries(tokajSvgs())) loadSvg(scene, key, svg, w, h);
}
