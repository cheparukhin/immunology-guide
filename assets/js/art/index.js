// Self & Other — illustration library (entry point). Full reference: docs/ART.md.
//
//   import { tCell, cancerCell, placeOnMembrane, tcr, breathe } from './art/index.js';
//
// No dependencies. Works with or without GSAP.

export * from './palette.js';
export * from './svg.js';
export * from './shapes.js';
export * from './defs.js';
export * from './registry.js';
export * from './molecules.js';
export * from './keys.js';
export * from './groove.js';
export * from './organelles.js';
export * from './bodymap.js';
export * from './cells.js';
export * from './pathogens.js';
export * from './scenes.js';
export * from './animate.js';
export * from './sprites.js';

import { CELLS } from './cells.js';
import { MOLECULES } from './molecules.js';
import { PATHOGENS } from './pathogens.js';
import { SCENES } from './scenes.js';
import { ORGANELLES } from './organelles.js';
import { mhcGroove } from './groove.js';
import { bodyMap, organIcon } from './bodymap.js';

/** Every factory by name: FACTORIES.tCell, FACTORIES.mhc1, FACTORIES.lymphNode, … */
export const FACTORIES = Object.freeze({ ...CELLS, ...MOLECULES, ...PATHOGENS, ...SCENES, ...ORGANELLES, mhcGroove, bodyMap, organIcon });
