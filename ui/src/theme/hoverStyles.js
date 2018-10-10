import { css } from 'emotion';
import base, {
  transitionRollover,
  colourRollover,
  bkgRollover,
  softTransitionRollover,
} from 'theme';

const {
  keyedPalette: { brandPrimary, brandPrimaryHighlight, oldCopper, lightPorcelain, mystic, white },
} = base;

export const brandPrimaryHighlightHover = softTransitionRollover(
  brandPrimary,
  brandPrimaryHighlight,
);

export const brandPrimaryColourHover = softTransitionRollover(oldCopper, brandPrimary);

export const mysticHover = softTransitionRollover(white, mystic);

export const whiteButtonHover = css`
  ${transitionRollover()};
  ${bkgRollover(white, lightPorcelain)};
  ${colourRollover(oldCopper, brandPrimary)};
`;

export const brandPrimaryButtonHover = css`
  ${transitionRollover()};
  ${bkgRollover(brandPrimaryHighlight, '#ec595d')};
  ${colourRollover(white, white)};
`;
