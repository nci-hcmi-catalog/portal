import { css } from '@emotion/react';
import base, {
  transitionRollover,
  colourRollover,
  bkgRollover,
  softTransitionRollover,
  softTransitionRolloverBkgHover,
} from 'theme';

const {
  keyedPalette: {
    brandPrimary,
    brandPrimaryHighlight,
    oldCopper,
    lightPorcelain,
    white,
    burntSienna,
    whisper,
  },
} = base;

export const brandPrimaryHighlightHover = softTransitionRollover(
  brandPrimary,
  brandPrimaryHighlight,
);

export const brandPrimaryColourHover = softTransitionRollover(oldCopper, brandPrimary);

export const whiteHover = softTransitionRollover(white, '#E5E5E5');

export const whiteButtonHover = css`
  ${transitionRollover()};
  ${bkgRollover(white, lightPorcelain)};
  ${colourRollover(oldCopper, brandPrimary)};
`;

export const brandPrimaryButtonHover = css`
  ${transitionRollover()};
  ${bkgRollover(brandPrimaryHighlight, burntSienna)};
  ${colourRollover(white, white)};
`;

export const adminPillHover = (colour, bkgColour) => css`
  ${transitionRollover()};
  ${bkgRollover(bkgColour.base, bkgColour.hover)};
  ${colourRollover(colour.base, colour.hover)};
`;

export const verticalTabHover = softTransitionRolloverBkgHover(whisper, 0);
