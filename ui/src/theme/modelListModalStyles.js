import { css } from 'emotion';

export default css`
  top: 0;
  right: 0;
  position: absolute;
  background: rgb(255, 255, 255);
  width: 314px;
  box-sizing: border-box;
  font-family: 'Libre Franklin', sans-serif;
  font-size: 16px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;

  .model-list-drawer-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background-color: rgb(144, 0, 0, 0.7);
  }

  .model-list-drawer-header h2 {
    font-size: 20px;
    font-weight: 500;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.2;
    letter-spacing: normal;
    color: #ffffff;
  }

  .model-list-drawer-header .clear {
  }

  button {
    border-radius: 10px;
    background-color: #900000;
    border: solid 1px #cacbcf;
    padding: 5px 10px;
    font-size: 14px;
    text-transform: uppercase;
    font-weight: 500;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.67;
    letter-spacing: normal;
    text-align: center;
    color: #ffffff;
    cursor: pointer;
  }
`;
