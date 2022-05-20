import { css } from '@emotion/react';

import base from 'theme';
import { whiteButtonHover } from 'theme/hoverStyles';
const {
  fonts: { openSans },
  keyedPalette: { black, bombay, elm, lightBlack, lightPorcelain, white },
} = base;

export default css`
  position: relative;

  .share-button {
    &__button {
      padding: 0 10px;
      height: 26px;
      border-radius: 10px;
      border: solid 1px ${bombay};
      font-family: ${openSans};
      font-size: 12px;
      font-weight: bold;
      font-style: normal;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      ${whiteButtonHover};
      color: ${black};
      background-color: ${white};

      &:hover {
        color: ${black};
      }
    }

    &__panel {
      position: absolute;
      width: 210px;
      background: ${white};
      box-shadow: 1px 1.7px 4px 0 ${lightBlack};
      color: ${black};
      z-index: 99;

      > div {
        font-family: ${openSans} !important;
      }
    }

    &__item {
      display: flex;
      padding: 0 10px;
      min-height: 28px;
      align-items: center;
      cursor: pointer;
      font-size: 12px;

      &:hover {
        background-color: ${lightPorcelain};
      }
    }

    &__bubble {
      display: inline-block;
      background-color: ${elm};
      color: ${white};
      padding: 2px 4px;
      border-radius: 100%;
      margin-right: 10px;

      svg {
        width: 12px;
        height: 12px;
      }
    }
  }
`;
