import { css } from 'emotion';

export default css`
  .model-bar {
    background-color: rgb(144, 0, 0, 0.7);
    color: #ffffff;
    align-items: center;
    justify-content: space-between;
    padding: 0 35px;
  }
  .model-bar h2 {
    font-family: 'Libre Franklin';
    font-size: 28px;
    font-weight: 500;
    font-style: normal;
    font-stretch: normal;
    line-height: 0.86;
    letter-spacing: normal;
    text-align: left;
  }
  .model-bar a {
    color: #fff;
    text-decoration: none;
    font-family: 'Libre Franklin';
    font-size: 12px;
    font-weight: 500;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.67;
    letter-spacing: normal;
    text-align: left;
    color: #ffffff;
    text-transform: uppercase;
  }
  .model-bar .pagination {
    margin-left: 20px;
    background: #fff;
    width: 653px;
    height: 35px;
    border-radius: 10px;
    background-color: #ffffff;
    border: solid 1px #cacbcf;
    color: #323232;
    align-items: center;
  }

  .model-section {
    font-family: 'Libre Franklin';
    padding: 35px;
    margin: 10px 0;
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
  }

  .model-section .row {
    justify-content: space-between;
    align-items: start;
  }

  .image-caption {
    font-size: 12px;
    font-weight: normal;
    font-style: oblique;
    font-stretch: normal;
    line-height: 2;
    letter-spacing: normal;
    text-align: left;
    color: #64666a;
  }

  .entity-horizontal-table {
    color: #323232;
    border: solid 1px #cacbcf;
    border-collapse: collapse;
    width: 100%;
  }
  .entity-horizontal-table tr:nth-child(even) {
    background: #ffffff;
  }
  .entity-horizontal-table tr:nth-child(odd) {
    background: #f8fafb;
  }
  .entity-horizontal-table td {
    padding: 10px;
    border: solid 1px #cacbcf;
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.57;
  }
  .entity-horizontal-table td.heading {
    color: #64666a;
    text-transform: uppercase;
    font-size: 12px;
    font-weight: 500;
    font-style: normal;
    font-stretch: normal;
  }
`;
