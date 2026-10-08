// Every level plays in a world. A world sets the landscape (zones along the way,
// each with its own far / mid / near decorations), the look of gaps and blocks,
// and its colour on the level buttons.

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
};
