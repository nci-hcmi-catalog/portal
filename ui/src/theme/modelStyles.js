import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { Row } from 'theme/system';
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
    elm,
    mischka,
    lightPorcelain,
    sandyBeach,
    tiaMaria,
    valencia,
    white,
  },
} = base;

export const VariantBlurb = styled(Row)`
  background: ${athensGray};
  font-family: ${openSans};
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  padding: 10px;
  margin-bottom: 5px;

  > * {
    padding-right: 4px;
  }

  a {
    padding-left: 4px;
  }
`;

export const TooltipLink = styled('a')`
  color: ${brandPrimary} !important;
  text-decoration: underline;

  &:hover {
    color: ${valencia} !important;
  }
`;

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
      border: 1px solid ${elm};
      color: ${elm};
      padding: 2px 8px;

      &--unexpanded {
        border-color: ${tiaMaria};
        color: ${tiaMaria};
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
      &--selected {
        background-color: ${crimson};
        border-color: ${crimson};
        color: ${white};

        &:hover {
          background-color: ${brandPrimary};
          color: ${white};
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
      padding-top: 0;
      margin: 8px;
      border: 2px solid ${athensLightGray};
      min-height: 92px;

      &--callout {
        background: ${athensGray};
        padding: 16px;
        font-size: 13px;
        font-weight: normal;
      }
    }

    &__card-title {
      color: ${black};
      background-color: ${sandyBeach};
      border-radius: 8px;
      font-size: 14px;
      font-weight: bold;
      margin: 0;
      display: inline-block;
      padding: 2px 15px;
      text-transform: uppercase;
      max-width: calc(100% - 32px);
      transform: translateY(-12px);
    }

    &__card-description {
      &--with-image {
        display: flex;
      }
    }

    &__card-logo {
      width: 63px;
      height: 59px;
    }

    &__card-instruction {
      font-weight: bold;
    }

    &__callout-button {
      display: inline-block;
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

    th:first-of-type {
      text-align: left;
    }
  }

  .image-caption {
    font-family: ${openSans};
    font-size: 11px;
    font-weight: bold;
    color: ${black};

    &:not(:first-of-type) {
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

    tr:nth-of-type(even) {
      background: ${white};
    }

    tr:nth-of-type(odd) {
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
      display: inline-block;
      margin: 4px 4px 0 0;
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
