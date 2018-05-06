import { css } from 'emotion';

let headerHeight = '88px';
let leftColumnWidth = '300px';
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

  .search-results-wrapper,
  .aggregations-wrapper {
    width: ${leftColumnWidth};
    height: calc(100vh - ${headerHeight});
    overflow-y: auto;
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
`;
