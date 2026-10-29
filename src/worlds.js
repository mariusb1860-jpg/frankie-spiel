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

  // Level 6, only for grown-ups (paprika button): the Hungarian Puszta. Ground,
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

  // Level 7, only for grown-ups (paprika button): Budapest on the Danube. Ground and
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
  // Level 9, only for grown-ups: the Tokaj vineyards in autumn (vineyard, cellar row, harvest feast).
  tokaj: {
    color: 0x8e2453, // wine red
    tiles: { hillsFar: 'hills-far-tokaj', hillsNear: 'hills-near-tokaj', ground: 'ground-farm' },
    gap: 'gap-farm',
    block: 'block-wood',
    flip: ['vine-row', 'vine-row-gold', 'tree-walnut', 'tree-chestnut', 'vine-slope', 'asters', 'leaf-scatter', 'vine-low', 'autumn-bush', 'arbour', 'cellar-door', 'pickers'],
    zones: [
      {
        key: 'vineyard',
        until: 1 / 3,
        landmarks: ['chapel-hill'],
        far: ['vine-slope', 'tree-walnut', null, 'tree-chestnut'],
        mid: ['vine-row', 'presshaz', 'tree-walnut', 'vine-row-gold', 'tree-chestnut', 'vine-row'],
        near: ['vine-low', 'asters', 'leaf-scatter', 'autumn-bush', 'lantern'],
        strip: 'trellis-strip',
      },
      {
        key: 'cellar-row',
        until: 2 / 3,
        landmarks: ['kopasz-hill'],
        far: ['vine-slope', 'big-barrel', 'tree-walnut'],
        mid: ['cellar-hill', 'wine-press', 'cellar-door', 'arbour', 'cellar-hill', 'tree-chestnut'],
        near: ['asters', 'leaf-scatter', 'lantern', 'vine-low'],
        strip: 'trellis-strip',
      },
      {
        key: 'harvest-feast',
        until: 1,
        landmarks: ['tokaj-town'],
        far: ['pickers', 'tree-chestnut', null, 'pickers'],
        mid: ['harvest-cart', 'bunting-poles', 'grape-stall', 'flag-hu', 'tree-chestnut', 'tree-walnut', 'arbour'],
        near: ['asters', 'autumn-bush', 'leaf-scatter', 'lantern'],
      },
    ],
  },

  // ---- World of level 10 (grown-ups) ----
  // Level 10, only for grown-ups: Visegrád castle at the Danube bend at sunset (finale). Ground,
  // brooks and blocks come from the forest.
  visegrad: {
    color: 0xe0a800, // gold
    sky: 'sky-visegrad',
    tiles: { hillsFar: 'hills-far-visegrad', hillsNear: 'hills-near-visegrad', ground: 'ground-forest' },
    gap: 'gap-forest',
    block: 'block-wood',
    flip: ['vg-oak', 'vg-willow', 'vg-pine', 'vg-sailboat', 'vg-reeds', 'wild-flowers', 'wild-rose', 'tent-red', 'tent-green', 'net-poles'],
    zones: [
      {
        key: 'danube-bend',
        until: 1 / 3,
        far: ['vg-pine', 'danube-boat', 'vg-pine', 'vg-sailboat', null],
        mid: ['vg-oak', 'fisher-hut', 'vg-willow', 'net-poles', 'vg-oak', 'vg-willow'],
        near: ['vg-reeds', 'wild-flowers', 'wild-rose', 'vg-reeds', 'wild-flowers'],
      },
      {
        key: 'castle-hill',
        until: 2 / 3,
        landmarks: ['fellegvar', 'salamon-tower'],
        far: ['vg-pine', 'vg-sailboat', 'vg-pine', null],
        mid: ['castle-wall', 'wall-tower', 'banner-pole', 'vg-oak', 'castle-wall', 'banner-pole'],
        near: ['torch-post', 'wild-rose', 'wild-flowers', 'torch-post'],
      },
      {
        key: 'knights-feast',
        until: 1,
        far: ['hussar', 'vg-pine', 'hussar', 'vg-pine', 'danube-boat'],
        mid: ['tent-red', 'heraldic-banner', 'tent-green', 'archery-target', 'banner-pole', 'tent-red', 'heraldic-banner'],
        near: ['torch-post', 'wild-flowers', 'torch-post', 'wild-rose'],
        strip: 'tourney-fence',
      },
    ],
  },

  // ---- Worlds of levels 11 to 15 (grown-ups, Bavaria, only loaded after the pretzel button) ----
  // Each of them has its own drawings (src/art/muenchen.js, alm.js, koenigssee.js, neuschwanstein.js, wiesn.js).
  // Level 11, Munich on a sunny late-summer day: English Garden, Marienplatz, Viktualienmarkt.
  muenchen: {
    color: 0xe6a817, // Munich yellow
    tiles: { hillsFar: 'hills-far-muenchen', hillsNear: 'hills-near-muenchen', ground: 'ground' },
    gap: 'gap-forest', // the Eisbach
    block: 'block-crate', // market crates
    // Landmarks and buildings with signs or asymmetric details are not mirrored.
    flip: ['mu-big-tree', 'mu-chestnut', 'mu-linden', 'mu-row-far', 'mu-surfer', 'mu-market-stall', 'mu-fruit-stand', 'mu-beer-table', 'mu-meadow-flowers', 'mu-bench', 'mu-geraniums', 'mu-flower-buckets'],
    zones: [
      {
        key: 'englischer-garten',
        until: 1 / 3,
        landmarks: ['mu-chinese-tower', 'mu-monopteros'],
        far: ['mu-linden', 'mu-surfer', 'mu-linden', null, 'mu-linden', null],
        mid: ['mu-big-tree', 'mu-beer-table', 'mu-chestnut', 'mu-beer-table', null, 'mu-big-tree'],
        near: ['mu-meadow-flowers', 'mu-bench', 'mu-meadow-flowers', 'daisies', 'grass-tuft'],
        strip: 'mu-strip-hedge',
      },
      {
        key: 'marienplatz',
        until: 2 / 3,
        landmarks: ['mu-rathaus', 'mu-mariensaeule', 'mu-frauenkirche'],
        far: ['mu-row-far', null, 'mu-linden', 'mu-row-far', null],
        mid: ['mu-townhouse-a', 'mu-townhouse-b', 'mu-townhouse-b', 'mu-townhouse-a', null],
        near: ['mu-lamp', 'mu-geraniums', 'mu-lamp', 'mu-geraniums', 'mu-meadow-flowers'],
      },
      {
        key: 'viktualienmarkt',
        until: 1,
        landmarks: ['mu-alter-peter', 'mu-maibaum'],
        far: ['mu-row-far', 'mu-linden', null, 'mu-row-far', null],
        mid: ['mu-market-stall', 'mu-fruit-stand', 'mu-beer-table', null, 'mu-market-stall', 'mu-fruit-stand'],
        near: ['mu-flower-buckets', 'mu-lamp', 'mu-meadow-flowers', 'mu-geraniums', 'mu-lamp'],
        strip: 'mu-strip-bunting',
      },
    ],
  },
  // Level 12, the Bavarian Alps in high summer: alpine pasture with cows and a chapel, the alpine
  // hut with a summit cross, then the rocky foot of the Zugspitze. Own drawings in src/art/alm.js.
  alm: {
    color: 0x5b9e3a, // alpine meadow green
    tiles: { hillsFar: 'hills-far-alm', hillsNear: 'hills-near-alm', ground: 'ground' },
    gap: 'gap-forest', // a mountain brook
    block: 'block-wood',
    // Landmarks are not mirrored; animals, trees and plants look natural either way.
    flip: ['alm-fir', 'alm-firs', 'alm-cows-far', 'alm-hikers', 'alm-cow', 'alm-cow-bell', 'alm-fir-big', 'alm-hay-rack', 'alm-shrine', 'alm-trough', 'alm-woodpile', 'alm-boulders', 'alm-pine', 'alm-gentian', 'alm-edelweiss', 'alm-alpenrose'],
    zones: [
      {
        key: 'almwiese',
        until: 1 / 3,
        landmarks: ['alm-chapel'],
        far: ['alm-fir', 'alm-cows-far', null, 'alm-firs', 'alm-cows-far', null],
        mid: ['alm-cow', 'alm-hay-rack', 'alm-fir-big', 'alm-cow-bell', 'alm-cow', null, 'alm-hay-rack', 'alm-shrine', 'alm-cow-bell', null],
        near: ['alm-gentian', 'alm-edelweiss', 'alm-alpenrose', 'grass-tuft', 'alm-gentian'],
        strip: 'alm-strip-fence',
      },
      {
        key: 'almhuette',
        until: 2 / 3,
        landmarks: ['alm-hut', 'alm-summit'],
        far: ['alm-firs', 'alm-hikers', null, 'alm-fir', null],
        mid: ['alm-trough', 'alm-woodpile', 'alm-fir-big', 'alm-cow', null, 'alm-hay-rack', 'alm-trough', null],
        near: ['alm-alpenrose', 'alm-edelweiss', 'alm-gentian'],
        strip: 'alm-strip-fence',
      },
      {
        key: 'zugspitze',
        until: 1,
        landmarks: ['alm-gondola', 'alm-zugspitze'],
        far: ['alm-fir', 'alm-boulders', 'alm-hikers', null, 'alm-firs', 'alm-boulders'],
        mid: ['alm-pine', 'alm-fir-big', 'alm-pine', null, 'alm-pine', 'alm-fir-big', null],
        near: ['alm-edelweiss', 'alm-gentian', 'alm-alpenrose', 'grass-tuft', 'alm-gentian'],
      },
    ],
  },
  // Level 13, Lake Königssee on a clear morning: mountain forest on the way down (Watzmann peeking
  // through), the lake with St. Bartholomä and the tour boats, then the boat landing at Schönau with
  // the Jenner. Own drawings in src/art/koenigssee.js; the lake lies in the far tile and in far pieces
  // only, the ground, inlets and jetty boards come from the forest and the beach.
  koenigssee: {
    color: 0x1f8a8a, // emerald green of the lake
    tiles: { hillsFar: 'hills-far-koenigssee', hillsNear: 'hills-near-koenigssee', ground: 'ground-forest' },
    gap: 'gap-forest', // water inlets
    block: 'block-pier', // jetty boards
    // Landmarks, the signpost and the kiosk are not mirrored; trees, boats, reeds and plants look natural either way.
    flip: ['ks-spruce', 'ks-spruces', 'ks-deer-far', 'ks-boat-far', 'ks-jetty-far', 'ks-islet', 'ks-spruce-big', 'ks-beech', 'ks-bridge', 'ks-boathouse', 'ks-boathouse-row', 'ks-viewpoint', 'ks-reeds-big', 'ks-ferns', 'ks-harebell', 'ks-reed-tuft'],
    zones: [
      {
        key: 'bergwald',
        until: 1 / 3,
        landmarks: ['ks-watzmann'],
        far: ['ks-spruce', 'ks-spruces', 'ks-deer-far', null, 'ks-spruce', 'ks-spruces'],
        mid: ['ks-spruce-big', 'ks-beech', 'ks-signpost', 'ks-spruce-big', 'ks-bridge', 'ks-beech', null, 'ks-spruce-big'],
        near: ['ks-ferns', 'ks-harebell', 'grass-tuft', 'ks-ferns', 'ks-harebell'],
      },
      {
        key: 'bartholomae',
        until: 2 / 3,
        landmarks: ['ks-bartholomae'],
        far: ['ks-boat-far', 'ks-islet', null, 'ks-boat-far', 'ks-islet', null],
        mid: ['ks-reeds-big', 'ks-beech', 'ks-spruce-big', null, 'ks-beech', null, 'ks-spruce-big', null],
        near: ['ks-harebell', 'ks-reed-tuft', 'grass-tuft', 'ks-harebell'],
        strip: 'ks-strip-reeds',
      },
      {
        key: 'bootssteg',
        until: 1,
        landmarks: ['ks-jenner'],
        far: ['ks-jetty-far', 'ks-boat-far', null, 'ks-boat-far', 'ks-spruces', null],
        mid: ['ks-boathouse', 'ks-kiosk', 'ks-boathouse-row', 'ks-viewpoint', 'ks-beech', 'ks-boathouse', 'ks-spruce-big', null],
        near: ['ks-ferns', 'ks-harebell', 'ks-reed-tuft', 'grass-tuft'],
        strip: 'ks-strip-rail',
      },
    ],
  },
  // Level 14, a golden autumn afternoon in the Allgäu below the fairy-tale castle: the mountain forest of
  // the Pöllat gorge with Hohenschwangau, the view from the Marienbrücke with Neuschwanstein, then the
  // Alpsee and Schwansee with lanterns and a royal banner. Own drawings in src/art/neuschwanstein.js;
  // the water lies in far pieces only, the ground, gorge gaps and wooden blocks come from the forest.
  neuschwanstein: {
    color: 0x7b4fb3, // royal purple of the fairy-tale king
    tiles: { hillsFar: 'hills-far-neuschwanstein', hillsNear: 'hills-near-neuschwanstein', ground: 'ground-forest' },
    gap: 'gap-forest', // the gorge
    block: 'block-wood',
    // Landmarks, the bridge, the lantern and the banner are not mirrored; trees, rocks, animals and plants look natural either way.
    flip: ['ns-larch', 'ns-forest-group', 'ns-rocks-far', 'ns-waterfall', 'ns-swan-pond', 'ns-horses-far', 'ns-spruce-big', 'ns-maple', 'ns-beech-gold', 'ns-gorge-wall', 'ns-ferns-gold', 'ns-crocus', 'ns-leaves'],
    zones: [
      {
        key: 'bergwald',
        until: 1 / 3,
        landmarks: ['ns-hohenschwangau'],
        far: ['ns-larch', 'ns-forest-group', 'ns-rocks-far', 'ns-waterfall', 'ns-carriage-far', null, 'ns-forest-group', 'ns-larch', 'ns-rocks-far', 'ns-forest-group', 'ns-waterfall', null],
        mid: ['ns-spruce-big', 'ns-maple', 'ns-beech-gold', 'ns-spruce-big', 'ns-maple', null, 'ns-beech-gold', 'ns-spruce-big'],
        near: ['ns-ferns-gold', 'ns-leaves', 'ns-crocus', 'grass-tuft', 'ns-ferns-gold'],
        strip: 'ns-strip-fence',
      },
      {
        key: 'marienbruecke',
        until: 2 / 3,
        landmarks: ['ns-neuschwanstein'],
        far: ['ns-bridge-far', 'ns-larch', 'ns-forest-group', 'ns-waterfall', null, 'ns-rocks-far', 'ns-larch'],
        mid: ['ns-gorge-wall', 'ns-spruce-big', 'ns-maple', 'ns-beech-gold', null, 'ns-spruce-big', 'ns-gorge-wall', 'ns-maple', 'ns-beech-gold', null],
        near: ['ns-ferns-gold', 'ns-leaves', 'ns-ferns-gold', 'ns-crocus'],
      },
      {
        key: 'alpsee',
        until: 1,
        landmarks: ['ns-alpsee-castle'],
        far: ['ns-swan-pond', 'ns-horses-far', 'ns-larch', 'ns-forest-group', null, 'ns-swan-pond', 'ns-horses-far'],
        mid: ['ns-lantern', 'ns-banner', 'ns-maple', 'ns-lantern', 'ns-beech-gold', 'ns-banner', null, 'ns-lantern'],
        near: ['ns-crocus', 'ns-leaves', 'ns-ferns-gold', 'grass-tuft'],
        strip: 'ns-strip-rail',
      },
    ],
  },
  // Level 15, the Oktoberfest on a sunny late-September day: the entrance with the Bavaria statue, the beer
  // tents with the church of St. Paul behind them, then the fairground with the Ferris wheel. Own drawings in
  // src/art/wiesn.js; the ground, mud ditches and crates come from the farm and the market.
  wiesn: {
    color: 0x2f7fc9, // Bavarian blue
    tiles: { hillsFar: 'hills-far-wiesn', hillsNear: 'hills-near-wiesn', ground: 'ground-farm' },
    gap: 'gap-farm', // muddy ditches
    block: 'block-crate',
    // Landmarks are not mirrored; trees, tents, stalls, rides and plants look natural either way.
    flip: ['wi-tree', 'wi-visitors-far', 'wi-band-stage', 'wi-dray', 'wi-chestnut', 'wi-tent-a', 'wi-tent-b', 'wi-tent-c', 'wi-chain-swing', 'wi-carousel', 'wi-heart-stall', 'wi-candy-stall', 'wi-balloons', 'wi-flowers'],
    zones: [
      {
        key: 'bavaria',
        until: 1 / 3,
        landmarks: ['wi-gate', 'wi-bavaria'],
        far: ['wi-tree', 'wi-visitors-far', 'wi-band-stage', null, 'wi-tree', 'wi-visitors-far'],
        mid: ['wi-chestnut', 'wi-heart-stall', 'wi-chestnut', 'wi-balloons', 'wi-candy-stall', 'wi-chestnut', null],
        near: ['wi-flowers', 'wi-sign', 'wi-garland-pole', 'wi-flowers', 'grass-tuft'],
        strip: 'wi-strip-bunting',
      },
      {
        key: 'bierzelte',
        until: 2 / 3,
        landmarks: ['wi-paulskirche'],
        far: ['wi-dray', 'wi-tree', 'wi-visitors-far', null, 'wi-tree', 'wi-band-stage', null],
        mid: ['wi-tent-a', 'wi-tent-b', 'wi-tent-c', null, 'wi-heart-stall', 'wi-chestnut', null, 'wi-tent-a', 'wi-tent-b', 'wi-tent-c'],
        near: ['wi-garland-pole', 'wi-flowers', 'wi-sign', 'wi-garland-pole', 'wi-flowers'],
        strip: 'wi-strip-bunting',
      },
      {
        key: 'fahrgeschaefte',
        until: 1,
        landmarks: ['wi-coaster', 'wi-riesenrad'],
        far: ['wi-tree', 'wi-visitors-far', null, 'wi-band-stage', 'wi-tree', null],
        mid: ['wi-chain-swing', 'wi-carousel', 'wi-candy-stall', 'wi-balloons', 'wi-chain-swing', 'wi-carousel', 'wi-candy-stall', null],
        near: ['wi-flowers', 'wi-garland-pole', 'wi-sign', 'wi-flowers'],
      },
    ],
  },
};
