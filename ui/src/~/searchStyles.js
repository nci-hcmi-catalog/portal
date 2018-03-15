import { css } from 'emotion';

export default css`
  .ReactTable .rt-resizable-header-content {
    color: #900;
  }

  .ReactTable.-striped .rt-tr.-odd {
    background-color: #fff2cc;
  }

  .ReactTable .rt-thead {
    background-color: #ffffff;
  }

  .sqon-view {
    background-color: #ffffff;
    border: 1px solid #d4d6dd;
    padding: 4px 19px 14px;
  }

  .sqon-value {
    background-color: #900;
    color: #fff;
    padding: 0 7px 0 12px;
    margin-right: 4px;
    cursor: pointer;
  }

  .aggregation-card .title-wrapper .title {
    color: #900;
    font-weight: bolder;
    font-size: 0.9rem;
    font-family: Open Sans, sans-serif;
  }

  .aggregation-card {
    border-left-color: #774928 !important;
  }

  .aggregation-card .bucket-item .bucket-count {
    border-radius: 5px;
    background-color: #fff2cc;
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
`;
