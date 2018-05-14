import { css } from 'emotion';

let headerHeight = '88px';
let grey = '#f4f5f7';
let primaryColor = '#900';

export default css`
  .ReactTable {
    flex: 1;
  }

  .ReactTable .rt-resizable-header-content {
    color: #353535;
    text-transform: uppercase;
    text-align: left;
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

  .sqon-view {
    background-color: #ffffff;
    border: none;
    padding: 4px 19px 14px;
    flex: 1;
  }

  .sqon-value {
    background-color: ${primaryColor};
    color: #fff;
    padding: 0 7px 0 12px;
    margin-right: 4px;
    cursor: pointer;
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
`;
