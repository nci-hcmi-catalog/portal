import { css } from 'emotion';
import styled from 'react-emotion';
import facetarrow from 'assets/icon-facetarrow.svg';

import base from 'theme';
import {
  brandPrimaryColourHover,
  brandPrimaryHighlightHover,
  whiteButtonHover,
} from 'theme/hoverStyles';

const {
  fonts: { libreFranklin, openSans },
  keyedPalette: { brandPrimary, lightBlack },
} = base;

const headerHeight = '94px'; // 88px + 6px border-bottom
const grey = '#f4f5f7';

export default css`
  .ReactTable {
    flex: 1;
  }

  .ReactTable .rt-td {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 13px 5px;
  }

  /* Additional padding for scroll bars */
  .ReactTable .rt-td:last-child {
    padding-right: 18px;
  }

  .ReactTable .rt-resizable-header {
    padding: 13px 5px;
  }

  .ReactTable .rt-resizable-header-content {
    color: #353535;
    text-transform: uppercase;
    text-align: left;
    font-family: ${libreFranklin};
    font-size: 13px;
    line-height: 13px;
    font-weight: 500;
  }

  .ReactTable a {
    ${brandPrimaryColourHover};
  }

  .ReactTable.-striped .rt-thead {
    background-color: #fef7eb;
  }

  .ReactTable.-striped .rt-tr.-odd {
    background-color: #f9fafd;
  }

  .ReactTable .rt-thead {
    background-color: #ffffff;
  }

  .ReactTable .rt-tr-group {
    flex: none;
  }

  .ReactTable .-pagination {
    font-family: ${openSans};
    box-shadow: none;
  }

  .ReactTable .-pagination_button {
    font-size: 11px;
    ${whiteButtonHover};
  }

  .ReactTable .-pagination_button.-current {
    color: ${brandPrimary};
    background: #e6e6e6;
  }

  .input-range__track.input-range__track--active {
    background-color: #fc7678;
  }

  .showMore-wrapper.more,
  .showMore-wrapper.less {
    justify-content: normal;
  }

  .showMore-wrapper.more::before {
    content: '+';
    border: 1px solid #990000;
    border-radius: 100px;
    padding: 1px 5px;
    transform: scale(0.65);
    font-weight: bold;
    margin-right: 2px;
  }

  .showMore-wrapper.less::before {
    content: '-';
    border: 1px solid #990000;
    border-radius: 100px;
    padding: 1px 5px;
    transform: scale(0.65);
    font-weight: bold;
    margin-right: 2px;
  }

  .sqon-view {
    background-color: #ffffff;
    border: none;
    padding: 4px 19px 14px;
    flex: 1;
  }

  .sqon-value {
    background-color: #d3494d;
    color: #fff;
    padding: 0 7px 0 12px;
    margin-right: 4px;
    cursor: pointer;
  }

  .sqon-clear {
    background-color: #f3f6f7;
    color: #724c31;
    font-weight: bold;
  }

  .sqon-value-group {
    color: #323232;
  }

  .search-header-actions {
    position: relative;
    display: flex;
    flex-direction: row;
    height: 36px;
    padding: 0 20px;
    border-left: 1px solid #d4d6dd;
  }

  .search-header-actions .pill {
    padding: 0 15px;
    height: 36px;
    border-radius: 10px;
    border: solid 1px #cacbcf;
    font-family: 'Libre Franklin';
    font-size: 12px;
    font-weight: 500;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.67;
    letter-spacing: normal;
    text-align: center;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    ${whiteButtonHover};
  }

  .search-results-wrapper {
    background-color: ${grey};
  }

  .search-split-pane,
  .search-results-wrapper,
  .aggregations-wrapper {
    /* important to override react-split-pane inline style */
    height: calc(100vh - ${headerHeight}) !important;
    overflow-y: auto;
    position: relative !important;
  }

  .aggregations-wrapper .arrow {
    display: block;
    width: 10px;
    height: 9px;
    margin-right: 5px;
    color: ${brandPrimary};
  }

  .aggregations-wrapper .arrow::after {
    content: '';
    display: block;
    background: url(${facetarrow}) no-repeat;
    width: 10px;
    height: 9px;
  }

  .aggregation-card .header .title-wrapper .title {
    margin: 0;
  }

  .aggregation-card .header .title-wrapper {
    padding: 6px 11px;
  }

  .aggregation-card .header .title-wrapper > div {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .aggregation-card .header .title-wrapper .action-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    border-radius: 12px;
    background: #fff;
    border: solid 1px #cacbcf;
  }

  .aggregation-card .header .title-wrapper .action-icon svg {
    fill: #724c31;
    width: 12px;
    heigth: 12px;
  }

  .aggregation-card .filter {
    padding: 10px 11px;
  }

  .aggregation-card .bucket {
    padding: 0 7px;
  }

  .no-sqon-message {
    text-transform: none;
    color: #676767;
    font-weight: normal;
  }

  .search-results-wrapper > * + * {
    margin-top: 10px;
  }

  .search-results-wrapper .ReactTable {
    margin-top: 0;
    border-top: none;
  }

  .search-results-wrapper > * {
    border: 1px solid #d6d6d6;
  }

  .aggregations {
    width: 100%;
  }

  .aggregation-card .title-wrapper {
    background-color: #f4f5f7;
    padding: 8px;
  }

  .aggregation-card .title-wrapper .title {
    font-weight: bolder;
    font-size: 0.9rem;
    font-family: Open Sans, sans-serif;
    text-transform: uppercase;
    color: #900000;
  }

  .aggregation-card .title-wrapper .title-control .title {
    ${brandPrimaryHighlightHover};
  }

  .aggregation-card {
    border-left: none;
    padding: 0px !important;
    margin: 0px !important;
  }

  .aggregation-card .header {
    margin: 0;
  }

  .aggregation-card .bucket {
    padding: 4px;
  }

  .aggregation-card .bucket-item .bucket-count {
    border-radius: 5px;
    background-color: #fef7eb;
    color: #343434;
    padding-left: 10px;
    padding-right: 10px;
    font-family: Open Sans, sans-serif;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    margin-left: auto;
  }

  .aggregation-card .toggle-button .bucket-count {
    background-color: #fef7eb;
  }

  .model-name-search-wrapper .title-wrapper {
    flex: 1;
    justify-content: start;
  }

  .quick-search {
    flex: 1;
  }

  .model-name-search-label {
    font-weight: bold;
    color: #545454;
    margin-right: 16px;
    font-size: 14px;
  }

  .quick-search-result-entity-1 {
    background-color: ${brandPrimary};
    color: white;
  }

  .showMore-wrapper {
    color: ${brandPrimary};
  }

  .clickable {
    ${brandPrimaryHighlightHover};
    cursor: pointer;
    text-decoration: underline;
  }

  .Resizer {
    background: #000;
    opacity: 0.2;
    z-index: 1;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    -moz-background-clip: padding;
    -webkit-background-clip: padding;
    background-clip: padding-box;
  }

  .Resizer:hover {
    -webkit-transition: all 2s ease;
    transition: all 2s ease;
  }

  .Resizer.horizontal {
    height: 11px;
    margin: -5px 0;
    border-top: 5px solid rgba(255, 255, 255, 0);
    border-bottom: 5px solid rgba(255, 255, 255, 0);
    cursor: row-resize;
    width: 100%;
  }

  .Resizer.horizontal:hover {
    border-top: 5px solid rgba(0, 0, 0, 0.5);
    border-bottom: 5px solid rgba(0, 0, 0, 0.5);
  }

  .Resizer.vertical {
    width: 11px;
    margin: 0 -5px;
    border-left: 5px solid rgba(255, 255, 255, 0);
    border-right: 5px solid rgba(255, 255, 255, 0);
    cursor: col-resize;
  }

  .Resizer.vertical:hover {
    border-left: 5px solid rgba(0, 0, 0, 0.5);
    border-right: 5px solid rgba(0, 0, 0, 0.5);
  }
  .Resizer.disabled {
    cursor: not-allowed;
  }
  .Resizer.disabled:hover {
    border-color: transparent;
  }

  .tableToolbar button {
    background: none;
    text-transform: uppercase;
    font-family: ${libreFranklin};
    font-size: 12px;
    font-weight: 500;
    line-height: 1.67;
    ${brandPrimaryColourHover};
  }

  .tableToolbar .dropDownButtonContent {
    font-family: ${libreFranklin};
  }

  .tableToolbar .dropDownButton svg {
    stroke: '#724c31';
  }

  .dropDownHeader .dropDownContent {
    max-height: 360px;
    overflow-y: auto;
    font-size: 13px;
    box-shadow: 1px 1.7px 4px 0 ${lightBlack};
  }
`;

export const List = styled('div')`
  display: flex;
  flex-direction: column;
  width: 100%;

  > div {
    margin-bottom: 4px;
  }
`;

export const Toggle = styled('div')`
  color: ${brandPrimary};
  font-size: 11px;
  text-align: right;
  font-style: italic;
  margin: 6px 0 0 0;
`;
