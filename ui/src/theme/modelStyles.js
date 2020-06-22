import { css } from 'emotion';

import { whiteButtonHover } from 'theme/hoverStyles';
import base from 'theme';

const {
  fonts: { openSans },
  keyedPalette: {
    athensGray,
    athensLightGray,
    black,
    bombay,
    brandPrimary,
    crimson,
    deepIron,
    elm,
    goldenGlow,
    green,
    mischka,
    redOrange,
    lightPorcelain,
    pelorousapprox,
    white,
  },
} = base;

export default css`
  .model-bar {
    background-color: ${athensGray};
    color: ${black};
    border: 1px solid ${mischka};
    align-items: center;
    justify-content: space-between;
    padding: 10px 18px;

    &__group {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    &__heading {
      font-family: ${openSans};
      font-size: 26px;
      font-weight: normal;
      line-height: 1.15;
      margin: 0;
    }

    &__pill {
      margin-left: 18px;
      font-family: ${openSans};
      font-size: 14px;
      font-weight: bold;
      line-height: 1;
      background-color: ${white};
      border-radius: 8px;
      border: 1px solid ${green};
      color: ${green};
      padding: 2px 8px;

      &--unexpanded {
        border-color: ${redOrange};
        color: ${redOrange};
      }
    }

    &__back {
      text-decoration: none;
      font-family: ${openSans};
      font-size: 12px;
      font-weight: 600;
      color: ${black};
      margin-right: 8px;
    }

    &__action {
      padding: 0 10px;
      height: 26px;
      border-radius: 10px;
      border-width: 0;
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
      color: ${white};
      background-color: ${elm};
      margin-left: 8px;

      &:hover {
        color: ${white};
        background-color: ${pelorousapprox};
      }

      &--selected {
        background-color: ${crimson};

        &:hover {
          background-color: ${brandPrimary};
        }
      }
    }
  }

  .pagination {
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 10px;
    background-color: ${athensGray};
    border: solid 1px ${mischka};
    font-family: ${openSans};
    font-size: 11px;
    font-weight: 500;
    line-height: 1.27;
    color: ${black};
    overflow: hidden;

    &__item {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &__link {
      text-decoration: none;
      font-family: ${openSans};
      font-size: 11px;
      color: ${brandPrimary};
      background-color: ${white};
      width: 78px;
      height: 28px;
      transition: 0.25s background-color ease;

      span {
        padding-bottom: 2px;
      }

      &:hover {
        background-color: ${lightPorcelain};
      }
    }

    &__status {
      height: 28px;
      border: 1px solid ${mischka};
      border-top: 0;
      border-bottom: 0;
      transition: opacity 0.5s ease-in;
      flex: 1 1 auto;
      padding: 0 12px;
    }
  }

  .model-section {
    padding: 0 8px;
    margin-top: 16px;

    .row {
      justify-content: space-between;
      align-items: start;
    }

    .two-col {
      width: 50%;
    }

    .three-col {
      width: calc(100% / 3);
    }

    &__card {
      position: relative;
      padding: 18px;
      margin: 8px;
      border: 2px solid ${athensLightGray};
      min-height: 92px;
    }

    &__card-title {
      color: ${black};
      background-color: ${goldenGlow};
      border-radius: 8px;
      font-size: 14px;
      font-weight: bold;
      margin: 0;
      display: inline-block;
      padding: 2px 15px;
      position: absolute;
      bottom: calc(100% - 10px);
      text-transform: uppercase;
      max-width: calc(100% - 32px);
    }
  }

  .model-details {
    display: flex;
    flex-direction: column;

    &--empty {
      align-items: center;
      margin-bottom: -5px;
      padding-top: 5px;
    }

    &__empty-message {
      font-family: ${openSans};
      font-size: 12px;
      font-weight: normal;
      color: ${black};
      margin: 5px 0 0;
    }
  }

  .multiple-models {
    display: flex;
    flex-direction: column;

    &__model {
      display: flex;
      padding: 10px 0;
      border-bottom: 1px solid ${mischka};

      &:last-of-type {
        border-bottom: none;
        padding-bottom: 0;
      }
    }

    &__model-icon {
      margin-right: 5px;
    }

    &__model-text {
      height: 30px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }

  .model-text {
    &__name {
      color: ${brandPrimary};
      font-family: ${openSans};
      font-size: 11px;
      font-weight: bold;
    }

    &__type {
      color: ${black};
      font-family: ${openSans};
      font-size: 11px;
      font-weight: normal;
    }
  }

  .molecular-characterizations-table {
    width: 100%;
    border-collapse: collapse;
    text-align: center;

    tr th,
    tr td {
      border-bottom: 1px solid ${bombay};
      border-right: 1px solid ${bombay};
      font-family: ${openSans};
      font-size: 12px;
      font-weight: normal;
      padding: 4px;
    }

    th:last-child,
    td:last-child {
      border-right: none;
    }

    tr:last-child {
      td,
      th {
        border-bottom: none;
      }
    }

    th:first-child {
      text-align: left;
    }
  }

  .image-caption {
    font-family: ${openSans};
    font-size: 11px;
    font-weight: bold;
    color: ${black};

    &:not(:first-child) {
      padding-left: 8px;
    }

    &:not(:last-child) {
      border-right: 1px solid ${black};
      padding-right: 8px;
    }
  }

  .entity-horizontal-table {
    color: ${black};
    width: 100%;
    text-align: left;

    tr:nth-child(even) {
      background: ${white};
    }

    tr:nth-child(odd) {
      background: ${athensGray};
    }

    td {
      font-size: 13px;
      font-weight: normal;
      line-height: 1.54;
      font-family: ${openSans};
      padding: 1px;

      &.content {
        font-weight: bold;
        padding-right: 10px;
      }

      &.heading {
        padding-left: 10px;
        padding-right: 10px;
        width: 180px;
      }

      ul {
        padding-inline-start: 0;
        margin: 0;
        list-style: none;
      }
    }
  }

  .external-resources {
    &__link {
      padding: 0 10px;
      height: 26px;
      border-radius: 10px;
      border-width: 0;
      font-family: ${openSans};
      font-size: 12px;
      font-weight: bold;
      font-style: normal;
      text-transform: uppercase;
      display: inline-block;
      line-height: 26px;
      cursor: pointer;
      ${whiteButtonHover};
      color: ${white};
      background-color: ${elm};
      margin: 4px 4px 0 0;

      &:hover {
        color: ${white};
        background-color: ${pelorousapprox};
      }

      &--disabled {
        background-color: ${deepIron};
        cursor: not-allowed;

        &:hover {
          color: ${white};
          background-color: ${deepIron};
        }
      }
    }
  }

  .model-carousel-bar {
    background-color: ${white};
    align-items: center;
    justify-content: center;

    &--top {
      margin-top: 12px;
    }

    &--bottom {
      margin-bottom: 12px;
    }
  }

  .model-actions {
    position: relative;
  }

  .toolbar {
    font-family: ${openSans};
    font-size: 12px;
    font-weight: normal;
    line-height: 1.33;
    color: ${black};
    z-index: 1;
    padding-bottom: 8px;
    align-items: flex-end;
  }
`;
