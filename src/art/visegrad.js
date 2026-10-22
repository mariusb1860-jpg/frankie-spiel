import { loadSvg } from './svg.js';

// Level 10, Visegrád castle at the Danube bend at sunset (grown-ups, only loaded with ?paprika).
// Everything here is background: soft outlines, never the strong OUTLINE.

const PIECES = {};

export function visegradSvgs() {
  return Object.fromEntries(Object.entries(PIECES).map(([key, [w, h, draw]]) => [key, { w, h, svg: draw() }]));
}

export function preloadVisegrad(scene) {
  for (const [key, { w, h, svg }] of Object.entries(visegradSvgs())) loadSvg(scene, key, svg, w, h);
}
