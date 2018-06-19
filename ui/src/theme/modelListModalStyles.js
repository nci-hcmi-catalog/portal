import { css } from 'emotion';
import doubleArrowRightWhite from 'assets/icon-doublearrow-right-white.svg';

export default css`
  top: 0;
  right: 0;
  position: absolute;
  background: rgb(255, 255, 255);
  width: 314px;
  height: 100vh;
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
    position: relative;
    font-size: 20px;
    font-weight: 500;
    font-style: normal;
    font-stretch: normal;
    margin: 0;
    line-height: 1.2;
    letter-spacing: normal;
    color: #ffffff;
    background: url(${doubleArrowRightWhite}) no-repeat;
    background-position: left center;
    background-size: 18px 15px;
    padding-left: 31px;
  }

  .model-list-drawer-header .count {
    position: absolute;
    right: -28px;
    bottom: 6px;
    width: 20px;
    height: 20px;
    font-family: OpenSans;
    font-weight: 500;
    font-size: 11px;
    line-height: 20px;
    text-align: center;
    color: #ffffff;
    background-color: #45b3c3;
    border: solid 1px #ffffff;
    border-radius: 10px;
  }

  .model-list-drawer-header .clear {
    font-size: 11px;
    font-weight: 500;
    text-align: center;
    color: #724c31;
    border-radius: 11px;
    background-color: #f3f6f7;
    border: solid 1px #cacbcf;
    height: 21px;
    line-height: 21px;
    padding: 0 8px;
  }

  .model-list-drawer-header .clear:disabled {
    opacity: 0.5;
  }

  .empty-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 36px 16px;
    font-family: Helvetica;
    font-size: 15px;
    line-height: 1.73;
    text-align: center;
    color: #64666a;
  }

  .empty-list p {
    margin: 24px 0 1em;
  }

  .empty-list a {
    color: #900000;
    text-decoration: none;
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

  .close {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
  }
`;
