import { css } from 'emotion';
import base from 'theme';
import doubleArrowRightWhite from 'assets/icon-doublearrow-right-white.svg';

const {
  fonts: { libreFranklin, openSans },
} = base;

export default css`
  top: 0;
  right: -314px;
  transition: right 0.8s ease;
  position: absolute;
  background: rgb(255, 255, 255);
  width: 314px;
  height: 100vh;
  box-sizing: border-box;
  font-family: ${libreFranklin};
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
    font-family: ${openSans};
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

  .model-list-scroll-container {
    max-height: calc(100vh - 132px);
    overflow-y: auto;
  }

  .model-list-models {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  .model-list-model {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 10px 10px 12px;
    border-bottom: solid 1px #cacbcf;
  }

  .model-list-model:last-of-type {
    border-bottom: none;
  }

  .model-image,
  .model-placeholder-image {
    margin-right: 8px;
  }

  .model-placeholder-image {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 74px;
    background-color: #ebf1f3;
  }

  .model-list-model-content {
    width: 162px;
  }

  .model-list-model-content h3 {
    font-family: ${libreFranklin};
    font-size: 16px;
    line-height: 1.38;
    color: #900000;
    margin: 0 0 0.5em;
  }

  .model-list-model-content p {
    margin: 0;
  }

  .model-list-model-content .available-label {
    font-size: 12px;
    font-weight: 500;
    line-height: 1.83;
    color: #64666a;
    text-transform: uppercase;
  }

  .model-list-model-content .available-date {
    font-family: Helvetica;
    font-size: 14px;
    line-height: 1.57;
    color: #323232;
  }

  .download-tsv {
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: #f3f6f7;
    border-top: solid 1px #cacbcf;
    border-bottom: solid 1px #cacbcf;
    padding: 14px 10px;
  }

  .download-tsv-btn {
    width: 100%;
    line-height: 42px;
    border-radius: 10px;
    background-color: #45b3c3;
    border: solid 1px #cacbcf;
    color: #fff;
    font-size: 15.5px;
    font-weight: 500;
    text-align: center;
    text-transform: uppercase;
  }

  .download-tsv-btn:disabled {
    opacity: 0.4;
  }

  .close {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
  }
`;
