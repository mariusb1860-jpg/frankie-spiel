// Helpers for art written as SVG code: smooth curves and clean outlines,
// turned into Phaser textures while the game loads.

export const OUTLINE = '#4a2c17';

export function hex(color) {
  return `#${color.toString(16).padStart(6, '0')}`;
}

export function shade(color, factor) {
  const ch = (s) => Math.min(255, Math.round(((color >> s) & 0xff) * factor));
  return (ch(16) << 16) | (ch(8) << 8) | ch(0);
}

export function svgDoc(width, height, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${body}</svg>`;
}

// Queues an SVG string in the Phaser loader. Call from a scene's preload().
export function loadSvg(scene, key, svg, width, height) {
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  scene.load.svg(key, url, { width, height });
  scene.load.once('complete', () => URL.revokeObjectURL(url));
}
