import { css } from 'emotion';
import base from 'theme';
import { brandPrimaryHighlightHover } from 'theme/hoverStyles';

const {
  keyedPalette: {
    alto,
    athensGray,
    athensLightGray,
    black,
    bombay,
    crimson,
    deepIron,
    elm,
    lightPorcelain,
    pelorousapprox,
    mischka,
    white,
  },
  fonts: { libreFranklin, openSans },
} = base;

export default css`
  top: 0;
  right: -314px;
  transition: right 0.8s ease;
  position: absolute;
  background: rgb(255, 255, 255);
  width: 314px;
  height: 100vh;
  box-sizing: border-box;
  font-family: ${libreFranklin};
  font-size: 16px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;

  .model-list-drawer-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 18px 10px;
    background-image: linear-gradient(to bottom, ${athensGray} 9%, ${athensLightGray} 91%);
    border-bottom: 1px solid ${mischka};
  }

  .model-list-drawer-header h2 {
    display: flex;
    align-items: center;
    position: relative;
    font-family: ${openSans};
    font-size: 20px;
    font-weight: bold;
    margin: 0;
    cursor: pointer;
    color: ${black};

    svg {
      fill: ${crimson};
    }
  }

  .model-list-drawer-header .count {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    font-family: ${openSans};
    font-weight: bold;
    font-size: 10px;
    color: ${white};
    background-color: ${crimson};
    border-radius: 100%;
    margin-left: 10px;
  }

  .model-list-drawer-header .clear,
  .download-tsv-btn {
    font-family: ${openSans};
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    color: ${black};
    border-radius: 10px;
    background-color: ${white};
    border: solid 1px ${bombay};
    height: 28px;
    line-height: 28px;
    padding: 0 10px;
    cursor: pointer;
    text-transform: uppercase;

    &:not([disabled]):hover {
      background-color: ${lightPorcelain};
    }
  }

  .download-tsv-btn:not([disabled]) {
    color: ${white};
    background-color: ${elm};
    border-color: ${elm};
    transition: background 0.25s ease;

    &:hover {
      color: ${white};
      background-color: ${pelorousapprox};
      border-color: ${pelorousapprox};
    }
  }

  .model-list-drawer-header .clear:disabled,
  .download-tsv-btn:disabled {
    cursor: not-allowed;
    color: ${white};
    background-color: ${deepIron};
    border-color: ${deepIron};
  }

  .empty-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 36px 16px;
    font-family: ${openSans};
    font-size: 12px;
    line-height: 1.67;
    text-align: center;
    color: ${black};
  }

  .empty-list a {
    ${brandPrimaryHighlightHover};
    text-decoration: none;
  }

  .model-list-scroll-container {
    max-height: calc(100vh - 132px);
    overflow-y: auto;
  }

  .model-list-models {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  .model-list-model {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 8px 10px 8px 8px;
    border-bottom: solid 1px ${alto};
  }

  .model-list-model:last-of-type {
    border-bottom: none;
  }

  .model-image,
  .model-placeholder-image {
    margin-right: 8px;
  }

  .model-placeholder-image {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 74px;
    background-color: #ebf1f3;
  }

  .model-list-model-content {
    width: 162px;
  }

  .model-list-model-content h3,
  .model-list-model-content .available-date {
    font-family: ${openSans};
    font-size: 12px;
    line-height: 1.5;
    color: ${black};
    font-weight: bold;
    margin: 0 0 4px;
  }

  .model-list-model-content .available-label {
    font-family: ${openSans};
    font-size: 12px;
    line-height: 1.5;
    color: ${black};
    font-weight: normal;
    margin: 0 0 2px;
  }

  .download-tsv {
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-image: linear-gradient(to bottom, ${athensGray} 9%, ${athensLightGray} 91%);
    border-bottom: 1px solid ${mischka};
    padding: 8px 0;
  }

  .close {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
  }
`;
