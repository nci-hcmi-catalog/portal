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
    min-width: 250px;
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
  }

  .pagination {
    margin-left: 20px;
    background: #fff;
    height: 35px;
    border-radius: 10px;
    background-color: #ffffff;
    border: solid 1px #cacbcf;
    align-items: center;
    font-family: LibreFranklin;
    font-size: 14px;
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
    display: flex;
    align-items: center;
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
    font-size: 12px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.57;
  }
  .entity-horizontal-table td.heading {
    color: #64666a;
    text-transform: uppercase;
    font-size: 10px;
    font-weight: 500;
    font-style: normal;
    font-stretch: normal;
    width: 210px;
  }

  .model-footer-bar {
    background-color: #ebf1f3;
    color: #724c31;
    align-items: center;
    justify-content: space-between;
    padding: 35px 30px;
  }

  .model-footer-bar a {
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
`;
