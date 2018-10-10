import base, {
  transitionRollover,
  colourRollover,
  bkgRollover,
  softTransitionRollover,
  softTransitionRolloverBkg,
} from 'theme';

const {
  keyedPalette: { brandPrimary, brandPrimaryHighlight, oldCopper, mystic, white },
} = base;

export const brandPrimaryHighlightHover = softTransitionRollover(
  brandPrimary,
  brandPrimaryHighlight,
);

export const brandPrimaryColourHover = softTransitionRollover(oldCopper, brandPrimary);

export const mysticHover = softTransitionRollover(white, mystic);
