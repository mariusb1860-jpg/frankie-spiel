import { CONFIG } from '../config.js';
import { OUTLINE, hex, loadSvg, shade, svgDoc } from './svg.js';

// Frankie: a cute little English bulldog. Body seen from the side, head turned
// a bit towards the viewer (both eyes visible), facing right.
export const FRANKIE_W = 180;
export const FRANKIE_H = 140;
export const FRANKIE_FEET_Y = 134; // y of the paws inside the texture

const NOSE = '#2b1a10';
const MOUTH = '#6b2222';
const TONGUE = '#ff7d8f';
const BLUSH = '#ff9aa8';
const TAG = '#ffd54f';

const RUN_LEGS = [
  { nf: 22, ff: -18, nb: -20, fb: 18 },
  { nf: 0, ff: 0, nb: 0, fb: 0 },
  { nf: -22, ff: 18, nb: 20, fb: -18 },
  { nf: 0, ff: 0, nb: 0, fb: 0 },
];
const STILL = { nf: 0, ff: 0, nb: 0, fb: 0 };

const DEFAULT_POSE = { legs: STILL, bob: 0, tail: 0, ears: 0, tilt: 0, eyes: 'open', mouth: 'smile' };

const POSES = {
  run0: { legs: RUN_LEGS[0], tail: -12, ears: -6 },
  run1: { legs: RUN_LEGS[1], bob: -3, tail: 0, ears: 4 },
  run2: { legs: RUN_LEGS[2], tail: 12, ears: -6 },
  run3: { legs: RUN_LEGS[3], bob: -3, tail: 0, ears: 4 },
  jump: { legs: { nf: -45, ff: -35, nb: 40, fb: 30 }, bob: -2, ears: -18, tail: -20, mouth: 'open' },
  bonk: { legs: { nf: 10, ff: -6, nb: -8, fb: 6 }, bob: 2, tilt: 10, ears: 14, eyes: 'dizzy', mouth: 'oh' },
  happy: { eyes: 'happy', mouth: 'tongue', tail: -15 },
  eat0: { eyes: 'happy', mouth: 'open', tilt: 4 },
  eat1: { eyes: 'happy', mouth: 'chew', tilt: 4 },
};

export function frankieSvg(name) {
  return svgDoc(FRANKIE_W, FRANKIE_H, drawFrankie({ ...DEFAULT_POSE, ...POSES[name] }));
}

export function preloadFrankie(scene) {
  for (const name of Object.keys(POSES)) {
    loadSvg(scene, `frankie-${name}`, frankieSvg(name), FRANKIE_W, FRANKIE_H);
  }
}

export function createFrankieAnims(scene) {
  const frames = (names) => names.map((f) => ({ key: `frankie-${f}` }));
  scene.anims.create({ key: 'frankie-run', frames: frames(['run0', 'run1', 'run2', 'run3']), frameRate: 10, repeat: -1 });
  scene.anims.create({ key: 'frankie-eat', frames: frames(['eat0', 'eat1', 'eat0', 'eat1', 'eat0', 'eat1']), frameRate: 9 });
  scene.anims.create({ key: 'frankie-eat-quick', frames: frames(['eat0', 'eat1']), frameRate: 9 });
}

function drawFrankie(p) {
  const fur = hex(CONFIG.fur.base);
  const furDark = hex(shade(CONFIG.fur.base, 0.86));
  const muzzle = '#fffdf8';
  const patch = hex(CONFIG.fur.patch);
  const ear = hex(shade(CONFIG.fur.patch, 0.85));
  const collar = hex(CONFIG.fur.collar);
  const line = (w = 3) => `stroke="${OUTLINE}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

  const bodyPath = 'M38 80 C34 60 58 52 86 56 C108 58 122 68 122 86 C122 104 104 112 80 111 C58 111 40 106 38 80 Z';
  const headPath =
    'M94 48 C92 26 112 18 132 18 C152 18 172 26 170 48 C170 68 166 80 150 86 C140 90 122 90 112 86 C98 80 94 68 94 48 Z';

  const legPart = (x, color, angle, pivotY) => `
    <g transform="rotate(${angle} ${x + 8} ${pivotY})">
      <rect x="${x}" y="${pivotY - 4}" width="18" height="${130 - pivotY}" rx="9" fill="${color}" ${line()}/>
      <ellipse cx="${x + 10}" cy="129" rx="12.5" ry="6.5" fill="${color}" ${line()}/>
      <path d="M${x + 8} 126 v5 M${x + 13} 126 v5" ${line(1.6)}/>
    </g>`;

  return `
  <defs>
    <clipPath id="body"><path d="${bodyPath}"/></clipPath>
    <clipPath id="head"><path d="${headPath}"/></clipPath>
  </defs>

  <!-- far legs, a bit darker -->
  ${legPart(46, furDark, p.legs.fb, 96)}
  ${legPart(102, furDark, p.legs.ff, 94)}

  <g transform="translate(0 ${p.bob})">
    <!-- stubby tail -->
    <g transform="rotate(${p.tail} 42 66)">
      <ellipse cx="36" cy="62" rx="7.5" ry="5.5" transform="rotate(-35 36 62)" fill="${fur}" ${line()}/>
    </g>

    <!-- body with a brown spot -->
    <path d="${bodyPath}" fill="${fur}" ${line()}/>
    <ellipse cx="62" cy="62" rx="21" ry="12" fill="${patch}" clip-path="url(#body)"/>
    <path d="${bodyPath}" fill="none" ${line()}/>
  </g>

  <!-- near legs: round haunch at the back, sturdy front leg -->
  ${legPart(41, fur, p.legs.nb, 98)}
  <ellipse cx="53" cy="${90 + p.bob}" rx="16" ry="17" fill="${fur}"/>
  <path d="M38 ${84 + p.bob} C35 ${98 + p.bob} 44 ${108 + p.bob} 59 ${106 + p.bob}" fill="none" ${line()}/>
  ${legPart(98, fur, p.legs.nf, 92)}

  <g transform="translate(0 ${p.bob})">
    <!-- collar under the chin, tag in front -->
    <path d="M100 62 Q106 86 124 96" fill="none" stroke="${OUTLINE}" stroke-width="13" stroke-linecap="round"/>
    <path d="M100 62 Q106 86 124 96" fill="none" stroke="${collar}" stroke-width="8" stroke-linecap="round"/>
    <circle cx="125" cy="103" r="5.5" fill="${TAG}" ${line(2.5)}/>

    <g transform="rotate(${p.tilt} 132 62)">
      <!-- small folded rose ears -->
      <g transform="rotate(${-p.ears} 110 26)">
        <path d="M114 22 C104 14 90 18 88 30 C92 35 100 33 107 30 Z" fill="${ear}" ${line()}/>
      </g>
      <g transform="rotate(${p.ears} 154 26)">
        <path d="M150 22 C160 14 174 18 176 30 C172 35 164 33 157 30 Z" fill="${ear}" ${line()}/>
      </g>

      <!-- head with a brown eye patch -->
      <path d="${headPath}" fill="${fur}" ${line()}/>
      <ellipse cx="115" cy="40" rx="18" ry="18" fill="${patch}" clip-path="url(#head)"/>
      <path d="${headPath}" fill="none" ${line()}/>
      <path d="M124 29 Q132 25 140 29 M127 34 Q132 31 137 34" fill="none" ${line(2)} opacity="0.55"/>

      ${p.eyes !== 'dizzy' ? blushes() : ''}
      ${drawMuzzle(p, muzzle, line)}
      ${drawEyes(p, line)}
    </g>
  </g>`;
}

function blushes() {
  return `
      <ellipse cx="108" cy="64" rx="6" ry="3.5" fill="${BLUSH}" opacity="0.55"/>
      <ellipse cx="164" cy="64" rx="4.5" ry="3.5" fill="${BLUSH}" opacity="0.55"/>`;
}

// Wide muzzle with two hanging jowls; the dip between them is the mouth.
const MUZZLE_PATH =
  'M108 66 C108 54 122 52 137 56 C152 52 166 54 166 66 C166 80 156 86 148 84 C143 83 140 80 137 78 C134 80 131 83 126 84 C118 86 108 80 108 66 Z';

function drawMuzzle(p, muzzle, line) {
  const puffed = p.mouth === 'chew' ? 'transform="translate(137 70) scale(1.1) translate(-137 -70)"' : '';
  let mouth = '';
  if (p.mouth === 'open') {
    mouth = `
      <ellipse cx="137" cy="81" rx="7.5" ry="6.5" fill="${MOUTH}" ${line(2.5)}/>
      <ellipse cx="137" cy="84.5" rx="4.5" ry="2.3" fill="${TONGUE}"/>`;
  } else if (p.mouth === 'oh') {
    mouth = `<ellipse cx="137" cy="80" rx="4" ry="4.5" fill="${MOUTH}" ${line(2.5)}/>`;
  } else if (p.mouth === 'tongue') {
    mouth = `
      <path d="M132.5 77 C132 90 142 90 141.5 77 Z" fill="${TONGUE}" ${line(2.5)}/>
      <path d="M137 80 V85" stroke="#d9586b" stroke-width="1.6" stroke-linecap="round"/>`;
  }

  return `
      <!-- chin (little underbite) peeks out between the jowls -->
      <ellipse cx="137" cy="84" rx="9" ry="5" fill="${muzzle}" ${line()}/>
      <path d="${MUZZLE_PATH}" fill="${muzzle}" ${line()} ${puffed}/>
      <path d="M137 66 V77" ${line(2.5)}/>
      ${mouth}
      <path d="M129 59 C129 53 145 53 145 59 C145 64 140 67 137 67 C134 67 129 64 129 59 Z" fill="${NOSE}"/>
      <ellipse cx="133.5" cy="57" rx="3.2" ry="1.7" fill="#fff" opacity="0.7"/>`;
}

function drawEyes(p, line) {
  return [119, 152]
    .map((cx) => {
      const cy = 45;
      if (p.eyes === 'happy') {
        return `<path d="M${cx - 6} ${cy + 2} Q${cx} ${cy - 6} ${cx + 6} ${cy + 2}" fill="none" ${line(3.2)}/>`;
      }
      if (p.eyes === 'dizzy') {
        return `<path d="M${cx - 5} ${cy - 5} L${cx + 5} ${cy + 5} M${cx - 5} ${cy + 5} L${cx + 5} ${cy - 5}" fill="none" ${line(3)}/>`;
      }
      return `
      <ellipse cx="${cx}" cy="${cy}" rx="6.5" ry="7.5" fill="#1b120b"/>
      <circle cx="${cx + 2}" cy="${cy - 3}" r="2.6" fill="#fff"/>
      <circle cx="${cx - 2}" cy="${cy + 3}" r="1.2" fill="#fff"/>`;
    })
    .join('');
}
