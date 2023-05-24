import { css } from '@emotion/react';
import base from 'theme';

const {
  keyedPalette: { crimson, white },
} = base;

export default css`
  .model-list-button__wrapper {
    display: flex;
    align-items: center;
  }

  .model-list-button {
    position: relative;
    margin-left: 8px;
    cursor: pointer;
  }

  .model-list-button span.count {
    position: absolute;
    display: block;
    min-width: 16px;
    padding: 0 4px;
    height: 16px;
    line-height: 16px;
    font-size: 10.5px;
    text-align: center;
    top: -9px;
    right: -6px;
    color: ${white};
    background-color: ${crimson};
    border-radius: 8px;
  }
`;
