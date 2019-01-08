import { css } from 'emotion';
import {
  brandPrimaryHighlightHover,
  brandPrimaryColourHover,
  whiteHover,
  whiteButtonHover,
  brandPrimaryButtonHover,
} from 'theme/hoverStyles';
import plusWhite from 'assets/icon-plus-white.svg';
import selectedModel from 'assets/icon-selected-model.svg';

export default css`
  .model-bar {
    background-color: rgba(144, 0, 0, 0.7);
    color: #ffffff;
    align-items: center;
    justify-content: space-between;
    padding: 0 35px;
  }

  .model-bar h2 {
    font-family: 'Libre Franklin';
    font-size: 23px;
    font-weight: 500;
    font-style: normal;
    font-stretch: normal;
    line-height: 0.86;
    letter-spacing: normal;
    text-align: left;
    min-width: 250px;
  }

  .model-bar .clickable {
    cursor: pointer;
    ${whiteHover};
    text-decoration: none;
    font-family: 'Libre Franklin';
    font-size: 12px;
    font-weight: 500;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.67;
    letter-spacing: normal;
    text-align: left;
  }

  .model-bar .model-bar-actions {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .pagination {
    display: flex;
    flex-direction: row;
    background: #fff;
    border-radius: 10px;
    background-color: #ffffff;
    border: solid 1px #cacbcf;
    margin: 0 16px;
    align-items: center;
    font-family: 'Open Sans';
    font-size: 12px;
    font-weight: 500;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.68;
    letter-spacing: normal;
    text-align: left;
    color: #323232;
  }

  .pagination a {
    text-decoration: none;
    font-family: 'Libre Franklin';
    font-size: 12px;
    padding: 6px 12px;
    ${brandPrimaryColourHover};
  }

  .model-section {
    font-family: 'Libre Franklin';
    padding: 22px 35px;
    margin: 6px 0 10px 0;
  }

  .model-section h3 {
    font-size: 20px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.2;
    letter-spacing: normal;
    text-align: left;
    color: #900000;
    display: flex;
    align-items: center;
    margin-top: 0;
  }

  .model-section .row {
    justify-content: space-between;
    align-items: start;
  }

  .model-section .three-col {
    width: 31%;
    min-width: 440px;
  }

  .model-section .two-col {
    width: 48%;
    min-width: 440px;
  }

  .model-section .model-details-header {
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .model-section .model-details-header h3 {
    margin: 0;
  }

  .model-details-header .select-model {
    background: url(${plusWhite}) no-repeat;
    background-size: 16px 16px;
    background-position: 23px center;
    padding: 0 24px 0 46px;
    border: solid 1px #cacbcf;
    ${brandPrimaryButtonHover};
  }

  .model-details-header .select-model.selected {
    background: url(${selectedModel}) no-repeat;
    background-size: 12px 12px;
    background-position: 15px center;
    padding: 0 15px 0 34px;
    background-color: #45b3c3;
  }

  .image-caption {
    font-family: 'Open Sans';
    font-size: 11px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 13px;
    height: 13px;
    letter-spacing: normal;
    text-align: left;
    color: #323232;
  }

  .image-caption:not(:first-of-type) {
    padding-left: 8px;
  }

  .image-caption:not(:last-child) {
    border-right: 1px solid #323232;
    padding-right: 8px;
  }

  .entity-horizontal-table {
    color: #323232;
    border: solid 1px #cacbcf;
    border-collapse: collapse;
    width: 100%;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.71;
    letter-spacing: normal;
    text-align: left;
  }

  .entity-horizontal-table tr:nth-of-type(even) {
    background: #ffffff;
  }

  .entity-horizontal-table tr:nth-of-type(odd) {
    background: #f8fafb;
  }

  .entity-horizontal-table td {
    padding: 10px;
    font-size: 12px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.57;
    font-family: 'Open Sans';
    font-size: 14px;
    border: 0;
  }

  .entity-horizontal-table td.content {
    border-left: 0;
    border-top: solid 1px #cacbcf;
    border-bottom: solid 1px #cacbcf;
    border-right: solid 1px #cacbcf;
  }

  .entity-horizontal-table td.heading {
    border-left: solid 1px #cacbcf;
    border-top: solid 1px #cacbcf;
    border-bottom: solid 1px #cacbcf;
    border-right: 0;
    color: #64666a;
    text-transform: uppercase;
    font-size: 12px;
    font-weight: 500;
    font-style: normal;
    font-stretch: normal;
    width: 200px;
    font-family: 'Libre Franklin';
  }

  .model-footer-bar {
    background-color: #ebf1f3;
    color: #724c31;
    align-items: center;
    justify-content: space-between;
    padding: 35px 30px;
  }

  .model-footer-bar .clickable {
    cursor: pointer;
    font-family: 'Libre Franklin';
    font-size: 12px;
    font-weight: 500;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.67;
    letter-spacing: normal;
    text-align: left;
    ${brandPrimaryColourHover};
    text-decoration: none;
    text-transform: uppercase;
  }

  .model-actions {
    position: relative;
  }

  .pill {
    padding: 0 15px;
    height: 30px;
    border-radius: 10px;
    background-color: #ffffff;
    border: solid 1px #cacbcf;
    font-family: 'Libre Franklin';
    font-size: 12px;
    font-weight: 500;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.67;
    letter-spacing: normal;
    text-align: center;
    color: #734d32;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    ${whiteButtonHover};
  }

  .toolbar {
    background-color: #ffffff;
    border-right: solid 1px #cacbcf;
    border-top: solid 1px #cacbcf;
    border-left: solid 1px #cacbcf;
    border-bottom: 0;
    padding: 20px 24px;
    font-family: 'Open Sans';
    font-size: 12px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 2.17;
    letter-spacing: normal;
    text-align: left;
    color: #64666a;
    z-index: 1;
  }

  .tabs-title {
    border: solid 1px #cacbcf;
    cursor: pointer;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    padding: 18px 40px;
    margin-right: 10px;
    background-color: #ebf1f3;
    font-family: 'Libre Franklin';
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    border-bottom: 0;
    border-top: solid 1px #cacbcf;
    border-left: solid 1px #cacbcf;
    border-right: solid 1px #cacbcf;
    position: relative;
    top: 1px;
    z-index: 0;
    ${brandPrimaryHighlightHover};
  }

  .tabs-title.active-tab {
    border-top: solid 1px #cacbcf;
    border-left: solid 1px #cacbcf;
    border-right: solid 1px #cacbcf;
    border-bottom: 0;
    background-color: #fff;
    z-index: 2;
    color: #000;
  }

  .ReactTable {
    border-right: 1px solid #cacbcf;
    border-top: 1px solid #cacbcf;
    border-left: 1px solid #cacbcf;
    border-bottom: 0;
  }

  .ReactTable .rt-tbody .rt-td {
    border-right: 0;
    border-bottom: 1px solid #cacbcf;
  }

  .ReactTable.-striped .rt-th {
    border-right: 0;
    border-top: 0;
    border-left: 0;
    border-bottom: 1px solid #cacbcf;
  }

  .ReactTable a {
    ${brandPrimaryHighlightHover};
  }

  a.external-link {
    ${brandPrimaryHighlightHover};
  }
`;
