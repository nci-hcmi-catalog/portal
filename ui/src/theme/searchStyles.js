import { css } from 'emotion';

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
    background-color: #900;
    color: #fff;
    padding: 0 7px 0 12px;
    margin-right: 4px;
    cursor: pointer;
  }

  .aggregations {
    padding-top: 8px;
    height: calc(100vh - 50px);
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
    border-left-color: #774928 !important;
    padding: 0px !important;
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

  .showMore-wrapper {
    color: #900;
  }
  .clickable {
    color: #900;
    cursor: pointer;
    text-decoration: underline;
  }
`;
