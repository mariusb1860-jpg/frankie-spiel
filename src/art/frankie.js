import { CONFIG } from '../config.js';
import { OUTLINE, hex, loadSvg, shade, svgDoc } from './svg.js';

// Frankie: a fawn French bulldog (drawn from photos). Body seen from the side,
// head turned a bit towards the viewer (both eyes visible), facing right.
// Big upright bat ears, black mask, dark collar with a light blue gingham bandana.
export const FRANKIE_W = 190;
export const FRANKIE_H = 170;
const TOP = 30; // room above the head for the ears
export const FRANKIE_FEET_Y = 134 + TOP; // y of the paws inside the texture

const NOSE = '#120c0a';
const MOUTH = '#5a1f1f';
const TONGUE = '#ff7d8f';
const BLUSH = '#ff8a7a';
const EYE = '#2e1a10';

const RUN_LEGS = [
  { nf: 22, ff: -18, nb: -20, fb: 18 },
  { nf: 0, ff: 0, nb: 0, fb: 0 },
  { nf: -22, ff: 18, nb: 20, fb: -18 },
  { nf: 0, ff: 0, nb: 0, fb: 0 },
];
const STILL = { nf: 0, ff: 0, nb: 0, fb: 0 };

const DEFAULT_POSE = { legs: STILL, bob: 0, tail: 0, ears: 0, tilt: 0, eyes: 'open', mouth: 'smile' };

const POSES = {
  run0: { legs: RUN_LEGS[0], tail: -12, ears: -4 },
  run1: { legs: RUN_LEGS[1], bob: -3, tail: 0, ears: 3 },
  run2: { legs: RUN_LEGS[2], tail: 12, ears: -4 },
  run3: { legs: RUN_LEGS[3], bob: -3, tail: 0, ears: 3 },
  jump: { legs: { nf: -45, ff: -35, nb: 40, fb: 30 }, bob: -2, ears: -12, tail: -20, mouth: 'open' },
  bonk: { legs: { nf: 10, ff: -6, nb: -8, fb: 6 }, bob: 2, tilt: 8, ears: 6, eyes: 'dizzy', mouth: 'oh' },
  happy: { eyes: 'happy', mouth: 'tongue', tail: -15, ears: -3 },
  eat0: { eyes: 'happy', mouth: 'open', tilt: 4 },
  eat1: { eyes: 'happy', mouth: 'chew', tilt: 4 },
};

export function frankieSvg(name) {
  const pose = { ...DEFAULT_POSE, ...POSES[name] };
  return svgDoc(FRANKIE_W, FRANKIE_H, `<g transform="translate(0 ${TOP})">${drawFrankie(pose)}</g>`);
}

export function preloadFrankie(scene) {
  for (const name of Object.keys(POSES)) {
    loadSvg(scene, `frankie-${name}`, frankieSvg(name), FRANKIE_W, FRANKIE_H);
  }
}

export function createFrankieAnims(scene) {
  const frames = (names) => names.map((f) => ({ key: `frankie-${f}` }));
  scene.anims.create({ key: 'frankie-run', frames: frames(['run0', 'run1', 'run2', 'run3']), frameRate: 10, repeat: -1 });
  scene.anims.create({ key: 'frankie-chomp', frames: frames(['eat0', 'eat1']), frameRate: 8, repeat: -1 });
}

function drawFrankie(p) {
  const { fur: c } = CONFIG;
  const fur = hex(c.base);
  const furDark = hex(shade(c.base, 0.86));
  const furShade = hex(shade(c.base, 0.78));
  const furLight = hex(shade(c.base, 1.1));
  const mask = hex(c.mask);
  const earInner = hex(c.earInner);
  const line = (w = 3) => `stroke="${OUTLINE}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

  // Compact, muscular body with a little tuck-up at the belly.
  const bodyPath = 'M38 80 C34 60 58 54 86 56 C108 58 122 66 122 86 C122 104 108 110 92 108 C80 106 70 104 60 106 C46 108 40 100 38 80 Z';
  const headPath =
    'M94 48 C92 26 112 18 132 18 C152 18 172 26 170 48 C170 68 166 80 150 86 C140 90 122 90 112 86 C98 80 94 68 94 48 Z';

  const legPart = (x, color, angle, pivotY) => `
    <g transform="rotate(${angle} ${x + 8} ${pivotY})">
      <rect x="${x}" y="${pivotY - 4}" width="17" height="${130 - pivotY}" rx="8.5" fill="${color}" ${line()}/>
      <ellipse cx="${x + 10}" cy="129" rx="12" ry="6.5" fill="${color}" ${line()}/>
      <path d="M${x + 8} 126 v5 M${x + 13} 126 v5" ${line(1.6)}/>
    </g>`;

  // Bat ear: outer fawn shape and dark inner part, rotating around its base.
  const ear = (outer, inner, pivot, angle) => `
      <g transform="rotate(${angle} ${pivot})">
        <path d="${outer}" fill="${fur}" ${line()}/>
        <path d="${inner}" fill="${earInner}"/>
      </g>`;

  return `
  <defs>
    <clipPath id="body"><path d="${bodyPath}"/></clipPath>
    <clipPath id="head"><path d="${headPath}"/></clipPath>
    <linearGradient id="maskg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${hex(shade(c.mask, 1.45))}"/><stop offset="0.5" stop-color="${mask}"/><stop offset="1" stop-color="${hex(shade(c.mask, 0.8))}"/>
    </linearGradient>
    <pattern id="gingham" width="8" height="8" patternUnits="userSpaceOnUse">
      <rect width="8" height="8" fill="#ffffff"/>
      <rect width="4" height="8" fill="${hex(c.bandana)}" opacity="0.6"/>
      <rect width="8" height="4" fill="${hex(c.bandana)}" opacity="0.6"/>
    </pattern>
  </defs>

  <!-- far legs, a bit darker -->
  ${legPart(46, furDark, p.legs.fb, 96)}
  ${legPart(102, furDark, p.legs.ff, 94)}

  <g transform="translate(0 ${p.bob})">
    <!-- tiny stub tail -->
    <g transform="rotate(${p.tail} 42 66)">
      <ellipse cx="37" cy="63" rx="6.5" ry="5" transform="rotate(-35 37 63)" fill="${fur}" ${line()}/>
    </g>

    <!-- body: shaded back and belly, lighter chest -->
    <path d="${bodyPath}" fill="${fur}" ${line()}/>
    <g clip-path="url(#body)">
      <ellipse cx="70" cy="112" rx="50" ry="14" fill="${furShade}" opacity="0.55"/>
      <ellipse cx="112" cy="86" rx="14" ry="22" fill="${furLight}" opacity="0.8"/>
      <ellipse cx="62" cy="58" rx="26" ry="6" fill="${furLight}" opacity="0.5"/>
    </g>
    <path d="${bodyPath}" fill="none" ${line()}/>
  </g>

  <!-- near legs: round haunch at the back, sturdy front leg -->
  ${legPart(41, fur, p.legs.nb, 98)}
  <ellipse cx="53" cy="${90 + p.bob}" rx="16" ry="17" fill="${fur}"/>
  <path d="M38 ${84 + p.bob} C35 ${98 + p.bob} 44 ${108 + p.bob} 59 ${106 + p.bob}" fill="none" ${line()}/>
  ${legPart(98, fur, p.legs.nf, 92)}

  <g transform="translate(0 ${p.bob})">
    <!-- gingham bandana on the chest, dark leather collar above it -->
    <path d="M99 66 L127 94 Q118 108 104 116 Q100 92 99 66 Z" fill="url(#gingham)" ${line(2.5)}/>
    <path d="M100 62 Q106 86 124 96" fill="none" stroke="${OUTLINE}" stroke-width="11" stroke-linecap="round"/>
    <path d="M100 62 Q106 86 124 96" fill="none" stroke="${hex(c.collar)}" stroke-width="7" stroke-linecap="round"/>
    <circle cx="113" cy="87" r="2.6" fill="#c9a24a"/>

    <g transform="rotate(${p.tilt} 132 62)">
      <!-- big upright bat ears -->
      ${ear('M101 40 C88 22 86 -2 96 -11 C108 -17 126 4 131 24 Z', 'M106 32 C96 18 95 0 101 -4 C110 -6 120 10 124 23 Z', '114 30', -p.ears)}
      ${ear('M144 24 C150 4 160 -16 172 -13 C182 -8 180 18 169 40 Z', 'M150 23 C155 8 162 -6 170 -6 C175 0 173 16 166 30 Z', '158 30', p.ears)}

      <!-- square head with wrinkles and darker eye areas -->
      <path d="${headPath}" fill="${fur}" ${line()}/>
      <g clip-path="url(#head)">
        <ellipse cx="119" cy="46" rx="11" ry="10" fill="${furShade}" opacity="0.7"/>
        <ellipse cx="152" cy="46" rx="10" ry="10" fill="${furShade}" opacity="0.7"/>
        <ellipse cx="132" cy="24" rx="26" ry="6" fill="${furLight}" opacity="0.6"/>
      </g>
      <path d="${headPath}" fill="none" ${line()}/>
      <path d="M120 31 Q132 25 144 31 M124 37 Q132 33 140 37 M135 40 V49" fill="none" stroke="${furShade}" stroke-width="2.2" stroke-linecap="round"/>

      ${p.eyes === 'happy' ? blushes() : ''}
      ${drawMuzzle(p, mask, line)}
      ${drawEyes(p, line)}
    </g>
  </g>`;
}

function blushes() {
  return `
      <ellipse cx="109" cy="62" rx="6" ry="3.5" fill="${BLUSH}" opacity="0.45"/>
      <ellipse cx="163" cy="62" rx="4.5" ry="3.5" fill="${BLUSH}" opacity="0.45"/>`;
}

// Short black mask with two soft jowls; the dip between them is the mouth.
const MUZZLE_PATH =
  'M117 66 C117 56 126 54 137 56 C148 54 157 56 157 66 C157 76 151 81 144 80 C141 79.5 139 78 137 77 C135 78 133 79.5 130 80 C123 81 117 76 117 66 Z';

function drawMuzzle(p, mask, line) {
  const puffed = p.mouth === 'chew' ? 'transform="translate(137 68) scale(1.1) translate(-137 -68)"' : '';
  let mouth = '';
  if (p.mouth === 'open') {
    mouth = `
      <ellipse cx="137" cy="81" rx="7.5" ry="6.5" fill="${MOUTH}" ${line(2.5)}/>
      <ellipse cx="137" cy="84.5" rx="4.5" ry="2.3" fill="${TONGUE}"/>`;
  } else if (p.mouth === 'oh') {
    mouth = `<ellipse cx="137" cy="80" rx="4" ry="4.5" fill="${MOUTH}" ${line(2.5)}/>`;
  } else if (p.mouth === 'tongue') {
    mouth = `
      <path d="M132.5 76 C132 89 142 89 141.5 76 Z" fill="${TONGUE}" ${line(2.5)}/>
      <path d="M137 79 V84" stroke="#d9586b" stroke-width="1.6" stroke-linecap="round"/>`;
  }

  return `
      <ellipse cx="137" cy="82" rx="7.5" ry="4.5" fill="${mask}" ${line()}/>
      <path d="${MUZZLE_PATH}" fill="url(#maskg)" ${line()} ${puffed}/>
      <path d="M137 65 V76" stroke="#000" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
      ${mouth}
      <path d="M129.5 59 C129.5 53.5 144.5 53.5 144.5 59 C144.5 63.5 140.5 66 137 66 C133.5 66 129.5 63.5 129.5 59 Z" fill="${NOSE}" stroke="#7a6052" stroke-width="1.5"/>
      <ellipse cx="134" cy="57" rx="3" ry="1.5" fill="#fff" opacity="0.6"/>
      <ellipse cx="134" cy="61.5" rx="1.5" ry="1" fill="#4a3a34"/><ellipse cx="140" cy="61.5" rx="1.5" ry="1" fill="#4a3a34"/>`;
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
      <ellipse cx="${cx}" cy="${cy}" rx="7" ry="7.5" fill="${EYE}" stroke="#1b0f08" stroke-width="2"/>
      <ellipse cx="${cx + 0.5}" cy="${cy + 1}" rx="4" ry="4.5" fill="#120a06"/>
      <circle cx="${cx + 2.2}" cy="${cy - 3}" r="2.6" fill="#fff"/>
      <circle cx="${cx - 2.2}" cy="${cy + 3}" r="1.2" fill="#fff"/>`;
    })
    .join('');
}
