import { css } from 'emotion';
import facetarrow from 'assets/icon-facetarrow.svg';
import base from 'theme';

const {
  fonts: { libreFranklin, openSans },
} = base;

const headerHeight = '88px';
const grey = '#f4f5f7';
const primaryColor = '#900';
const linkColor = '#774928';

export default css`
  .ReactTable {
    flex: 1;
  }

  .ReactTable .rt-resizable-header-content {
    color: #353535;
    text-transform: uppercase;
    text-align: left;
    font-family: ${libreFranklin};
    font-weight: 500;
  }

  .ReactTable.-striped .rt-th {
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
    color: ${linkColor};
  }

  .ReactTable .-pagination_button.-current {
    color: ${primaryColor};
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
    color: ${primaryColor};
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
    color: #900;
    font-weight: bolder;
    font-size: 0.9rem;
    font-family: Open Sans, sans-serif;
    text-transform: uppercase;
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

  .quicksearch-wrapper .title-wrapper {
    flex: 1;
    justify-content: start;
  }

  .quick-search {
    flex: 1;
  }

  .quicksearch-label {
    font-weight: bold;
    color: #545454;
    margin-right: 16px;
    font-size: 14px;
  }

  .quick-search-result-entity-1 {
    background-color: ${primaryColor};
    color: white;
  }

  .showMore-wrapper {
    color: ${primaryColor};
  }

  .clickable {
    color: ${primaryColor};
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
    color: ${linkColor};
    text-transform: uppercase;
    font-family: ${libreFranklin};
    font-size: 12px;
    font-weight: 500;
    line-height: 1.67;
  }

  .tableToolbar .dropDownButtonContent {
    font-family: ${libreFranklin};
  }

  .tableToolbar .dropDownButton svg {
    stroke: ${linkColor};
  }
`;
