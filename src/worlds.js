// Every level plays in a world. A world sets the landscape (zones along the way,
// each with its own far / mid / near decorations), the look of gaps and blocks,
// and its colour on the level buttons. Decorations are picked at random; null in a list
// is an empty slot. `landmarks` are far pictures that appear exactly once per zone.
// Optional per world: `sky` (sky picture), `snow`, `density`, and `flip` (more decoration
// keys that may be mirrored at random, on top of the shared list in backdrop.js).

export const WORLDS = {
  garden: {
    color: 0x43b047,
    tiles: { hillsFar: 'hills-far', hillsNear: 'hills-near', ground: 'ground' },
    gap: null, // level 1 has no gaps
    block: 'block-wood',
    zones: [
      {
        key: 'garden',
        until: 1 / 3,
        far: ['tree-pine', 'tree-pine', 'tree-birch'],
        mid: ['tree-apple', 'shed', 'tree-oak', 'tree-apple', 'tree-birch'],
        near: ['tulips', 'sunflower', 'bush', 'sunflower', 'tulips'],
        strip: 'fence',
      },
      {
        key: 'meadow',
        until: 2 / 3,
        far: ['windmill', 'tree-pine', 'tree-birch', 'tree-pine', 'tree-pine'],
        mid: ['tree-oak', 'tree-birch', 'pond', 'tree-birch', 'tree-oak'],
        near: ['daisies', 'grass-tuft', 'rock', 'mushrooms', 'bush', 'grass-tuft'],
        butterflies: true,
      },
      {
        key: 'village',
        until: 1,
        far: ['church', 'house-b', 'tree-pine'],
        mid: ['house-a', 'house-b', 'tree-apple', 'house-a'],
        near: ['lamp', 'bush', 'daisies', 'lamp'],
        strip: 'hedge',
      },
    ],
  },

  forest: {
    color: 0x2e7d32,
    tiles: { hillsFar: 'hills-far-forest', hillsNear: 'hills-near-forest', ground: 'ground-forest' },
    gap: 'gap-forest',
    block: 'block-wood',
    density: 0.8, // trees stand closer together than in the garden
    zones: [
      {
        key: 'forest-edge',
        until: 1 / 3,
        far: ['tree-pine', 'tree-fir', 'tree-pine', 'tree-fir', 'deer', 'tree-pine'],
        mid: ['tree-oak', 'tree-birch', 'tree-fir', 'tree-beech', 'hunter-stand', 'tree-fir'],
        near: ['fern', 'berry-bush', 'mushrooms', 'mossy-rock', 'grass-tuft'],
      },
      {
        key: 'deep-forest',
        until: 2 / 3,
        far: ['tree-fir', 'tree-pine', 'tree-fir'],
        mid: ['tree-fir', 'tree-beech', 'sunbeam', 'tree-fir', 'tree-beech', 'tree-fir'],
        near: ['fern', 'fern', 'mossy-rock', 'mushrooms', 'log-pile', 'berry-bush'],
      },
      {
        key: 'clearing',
        until: 1,
        far: ['tree-fir', 'tree-pine', 'deer', 'tree-fir'],
        mid: ['tree-beech', 'tree-oak', 'tree-birch', 'tree-beech', 'hunter-stand', 'tree-oak', 'tree-birch'],
        near: ['daisies', 'grass-tuft', 'bush', 'fern', 'mushrooms'],
        strip: 'rail-fence',
        butterflies: true,
      },
    ],
  },

  beach: {
    color: 0x29a3d6,
    tiles: { hillsFar: 'hills-far-beach', hillsNear: 'hills-near-beach', ground: 'ground-beach' },
    gap: 'gap-beach',
    block: 'block-pier',
    zones: [
      {
        key: 'dunes',
        until: 1 / 3,
        far: ['dune', 'dune-2', 'dune', 'dune-2', 'sailboat'],
        mid: ['beach-chair', 'beach-chair-red', 'beach-chair', 'parasol', 'beach-chair-red', 'lifeguard'],
        near: ['marram', 'marram', 'shell-pile', 'marram'],
        strip: 'dune-fence',
      },
      {
        key: 'shore',
        until: 2 / 3,
        far: ['sailboat', 'sailboat-2', 'ferry', 'sailboat', 'cutter', 'sailboat-2'],
        mid: ['parasol', 'beach-chair', 'parasol-2', 'lifeguard', 'beach-chair-red', 'parasol-2', 'beach-chair'],
        near: ['shell-pile', 'marram', 'gull-post', 'shell-pile', 'marram'],
      },
      {
        key: 'harbor',
        until: 1,
        far: ['cutter', 'sailboat', 'ferry', 'cutter', 'sailboat-2'],
        mid: ['lighthouse', 'brick-house', 'fish-stall', 'frisian-house', 'brick-house', 'fish-stall'],
        near: ['lifebuoy-post', 'gull-post', 'marram', 'lifebuoy-post'],
        strip: 'quay-rail',
      },
    ],
  },

  farm: {
    color: 0xe0702a,
    tiles: { hillsFar: 'hills-far-farm', hillsNear: 'hills-near-farm', ground: 'ground-farm' },
    gap: 'gap-farm',
    block: 'block-crate',
    zones: [
      {
        key: 'fields',
        until: 1 / 3,
        far: ['tree-oak', 'tree-pine', 'windmill', 'tree-oak', 'tree-birch'],
        mid: ['tractor', 'scarecrow', 'tree-apple', 'tree-oak', 'tractor', 'tree-birch'],
        near: ['wheat-tuft', 'poppies', 'grass-tuft', 'wheat-tuft', 'dandelions'],
        strip: 'wheat-strip',
      },
      {
        key: 'farmyard',
        until: 2 / 3,
        far: ['cow', 'sheep', 'tree-oak', 'cow', 'sheep', 'tree-pine'],
        mid: ['barn', 'silo', 'farmhouse', 'chicken-coop', 'tree-apple', 'tractor'],
        near: ['dandelions', 'grass-tuft', 'poppies', 'bush'],
      },
      {
        key: 'pasture',
        until: 1,
        far: ['cow', 'sheep', 'sheep', 'tree-oak', 'cow'],
        mid: ['stable', 'tree-apple', 'tree-oak', 'barn', 'tree-birch'],
        near: ['daisies', 'grass-tuft', 'dandelions', 'poppies'],
        strip: 'paddock-fence',
        butterflies: true,
      },
    ],
  },

  winter: {
    color: 0x7fb8e6,
    sky: 'sky-winter', // paler winter sky
    snow: true, // falling snow behind the haze
    tiles: { hillsFar: 'hills-far-winter', hillsNear: 'hills-near-winter', ground: 'ground-winter' },
    gap: 'gap-winter',
    block: 'block-ice',
    density: 0.85,
    zones: [
      {
        key: 'snowy-forest',
        until: 1 / 3,
        far: ['fir-snow', 'fir-snow', 'deer', 'fir-snow', 'bare-tree'],
        mid: ['fir-snow', 'bare-tree', 'fir-snow', 'cabin', 'fir-snow', 'bare-tree'],
        near: ['snow-bush', 'snow-rock', 'holly', 'snow-bush'],
      },
      {
        key: 'frozen-lake',
        until: 2 / 3,
        far: ['fir-snow', 'bare-tree', 'fir-snow', 'deer'],
        mid: ['ice-pond', 'bare-tree', 'fir-snow', 'ice-pond', 'cabin', 'fir-snow'],
        near: ['snow-reeds', 'snow-rock', 'snow-reeds', 'snow-bush'],
      },
      {
        key: 'snow-village',
        until: 1,
        far: ['church-snow', 'house-snow-2', 'fir-snow', 'house-snow'],
        mid: ['house-snow', 'xmas-tree', 'house-snow-2', 'fir-snow', 'house-snow'],
        near: ['lamp-snow', 'snow-bush', 'holly', 'lamp-snow'],
        strip: 'snow-fence',
      },
    ],
  },

  // Level 6, only for grown-ups (secret link ?paprika): the Hungarian Puszta. Ground,
  // ditches and crates come from the farm; the crates now hold paprika.
  puszta: {
    color: 0xce2939, // red of the Hungarian flag
    tiles: { hillsFar: 'hills-far-puszta', hillsNear: 'hills-near-puszta', ground: 'ground-farm' },
    gap: 'gap-farm',
    block: 'block-crate',
    zones: [
      {
        key: 'paprika-fields',
        until: 1 / 3,
        far: ['poplar', 'poplar', 'grey-cattle', 'poplar'],
        mid: ['paprika-house', 'flag-hu', 'haystack-puszta', 'paprika-house', 'well-sweep'],
        near: ['paprika-plant', 'paprika-plant', 'sunflower', 'paprika-plant', 'grass-tuft'],
        strip: 'paprika-strip',
      },
      {
        key: 'puszta',
        until: 2 / 3,
        far: ['grey-cattle', 'racka-sheep', 'csikos', 'grey-cattle', 'racka-sheep', 'poplar'],
        mid: ['well-sweep', 'haystack-puszta', 'goulash-pot', 'haystack-puszta', 'well-sweep'],
        near: ['steppe-grass', 'thistle', 'steppe-grass', 'grass-tuft'],
        butterflies: true,
      },
      {
        key: 'goulash-feast',
        until: 1,
        far: ['poplar', 'grey-cattle', 'poplar'],
        mid: ['paprika-house', 'goulash-pot', 'flag-hu', 'paprika-house', 'goulash-pot'],
        near: ['paprika-plant', 'bush', 'steppe-grass', 'sunflower'],
        strip: 'bunting-fence',
      },
    ],
  },

  // Level 7, only for grown-ups (secret link ?paprika): Budapest on the Danube. Ground and
  // brooks come from the forest, the jetties from the beach.
  budapest: {
    color: 0x477050, // green of the Hungarian flag
    tiles: { hillsFar: 'hills-far-budapest', hillsNear: 'hills-near-budapest', ground: 'ground-forest' },
    gap: 'gap-forest',
    block: 'block-pier',
    zones: [
      {
        key: 'danube-bank',
        until: 1 / 3,
        landmarks: ['parliament'],
        far: ['danube-boat', null, null],
        mid: ['tram-yellow', 'tree-oak', 'flag-hu', 'tree-birch', 'tram-yellow'],
        near: ['lamp', 'flower-tub', 'bush', 'lamp'],
        strip: 'danube-rail',
      },
      {
        key: 'chain-bridge',
        until: 2 / 3,
        landmarks: ['chain-bridge', 'buda-castle'],
        far: ['danube-boat', null, null],
        mid: ['tree-oak', 'tram-yellow', 'flag-hu', 'tree-birch'],
        near: ['lamp', 'flower-tub', 'lamp', 'daisies'],
        strip: 'danube-rail',
      },
      {
        key: 'market',
        until: 1,
        landmarks: ['fishermens-bastion'],
        far: ['danube-boat', null, null],
        mid: ['market-hall', 'paprika-stall', 'goulash-stall', 'flag-hu', 'paprika-stall'],
        near: ['flower-tub', 'lamp', 'bush'],
      },
    ],
  },

  // ---- World of level 8 (grown-ups) ----
  // Level 8, only for grown-ups: Lake Balaton in high summer. Ground, ditches and blocks come
  // from the beach, but the lake is turquoise and the shore is a meadow with reeds.
  balaton: {
    color: 0x16a6a0, // turquoise of the lake
    tiles: { hillsFar: 'hills-far-balaton', hillsNear: 'hills-near-balaton', ground: 'ground-beach' },
    gap: 'gap-beach',
    block: 'block-pier',
    flip: [
      'sail-red', 'sail-rainbow', 'sail-yellow', 'sail-blue', 'pedal-boat', 'pedal-boat-2', 'water-slide',
      'changing-cabins', 'langos-stand', 'willow', 'fisher-house', 'lavender-field', 'press-house',
      'reeds', 'flower-bed', 'lavender-tuft', 'balaton-lamp', 'hydrangea',
    ],
    zones: [
      {
        key: 'balaton-beach',
        until: 1 / 3,
        far: ['sail-red', 'pedal-boat', 'water-slide', 'sail-rainbow', 'pedal-boat-2', 'sail-blue', null],
        mid: ['changing-cabins', 'willow', 'langos-stand', 'poplar', 'changing-cabins', 'willow', 'flag-hu'],
        near: ['reeds', 'flower-bed', 'reeds', 'daisies', 'flower-bed'],
      },
      {
        key: 'tihany',
        until: 2 / 3,
        landmarks: ['tihany-abbey'],
        far: ['sail-rainbow', 'sail-yellow', 'sail-red', 'sail-blue', null, 'sail-yellow'],
        mid: ['lavender-field', 'fisher-house', 'willow', 'lavender-field', 'fisher-house', 'poplar'],
        near: ['lavender-tuft', 'reeds', 'lavender-tuft', 'daisies', 'lavender-tuft'],
        strip: 'lavender-strip',
      },
      {
        key: 'badacsony',
        until: 1,
        landmarks: ['badacsony'],
        far: ['paddle-steamer', null, 'sail-blue', 'sail-red', null, 'sail-yellow'],
        mid: ['harbor-masts', 'press-house', 'flag-hu', 'harbor-masts', 'willow', 'press-house'],
        near: ['balaton-lamp', 'hydrangea', 'balaton-lamp', 'flower-bed', 'hydrangea'],
        strip: 'promenade-rail',
      },
    ],
  },

  // ---- World of level 9 (grown-ups) ----
  // Level 9, only for grown-ups: the Tokaj vineyards in autumn. Placeholder with the farm pictures.
  tokaj: {
    color: 0x8e2453, // wine red
    tiles: { hillsFar: 'hills-far-farm', hillsNear: 'hills-near-farm', ground: 'ground-farm' },
    gap: 'gap-farm',
    block: 'block-wood',
    zones: [
      { key: 'tokaj-1', until: 1 / 3, far: ['tree-oak'], mid: ['barn'], near: ['grass-tuft'] },
      { key: 'tokaj-2', until: 2 / 3, far: ['tree-pine'], mid: ['silo'], near: ['poppies'] },
      { key: 'tokaj-3', until: 1, far: ['tree-birch'], mid: ['farmhouse'], near: ['daisies'] },
    ],
  },

  // ---- World of level 10 (grown-ups) ----
  // Level 10, only for grown-ups: Visegrád castle at the Danube bend at sunset. Placeholder with the forest pictures.
  visegrad: {
    color: 0xe0a800, // gold
    tiles: { hillsFar: 'hills-far-forest', hillsNear: 'hills-near-forest', ground: 'ground-forest' },
    gap: 'gap-forest',
    block: 'block-wood',
    zones: [
      { key: 'visegrad-1', until: 1 / 3, far: ['tree-fir'], mid: ['tree-oak'], near: ['fern'] },
      { key: 'visegrad-2', until: 2 / 3, far: ['tree-pine'], mid: ['tree-beech'], near: ['mushrooms'] },
      { key: 'visegrad-3', until: 1, far: ['deer'], mid: ['hunter-stand'], near: ['bush'] },
    ],
  },
};
