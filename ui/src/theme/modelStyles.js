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
  }

  .pagination {
    background: #fff;
    height: 35px;
    border-radius: 10px;
    background-color: #ffffff;
    border: solid 1px #cacbcf;
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
    color: #900000;
    text-decoration: none;
    font-family: 'Libre Franklin';
    font-size: 12px;

    padding: 6px 0px 6px 6px;
    width: 204px;
    transition: opacity 0.5s ease-in;
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

  .image-caption {
    font-family: 'Open Sans';
    font-size: 14px;
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
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.71;
    letter-spacing: normal;
    text-align: left;
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
    font-size: 12px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.57;
    font-family: 'Open Sans';
    font-size: 14px;
  }
  .entity-horizontal-table td.heading {
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
    color: #724c31;
    text-decoration: none;
    text-transform: uppercase;
  }

  .pill {
    padding: 0 10px;
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
  }
`;
