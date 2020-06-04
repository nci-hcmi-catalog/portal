import { css } from 'emotion';
import modelListDefaultBlue from 'assets/icon-modellist-empty-blue.svg';
import modelListNotEmptyBlue from 'assets/icon-modellist-full-blue.svg';

export default css`
  .model-list-icon__wrapper {
    display: flex;
    align-items: center;
  }

  .model-list-icon {
    position: relative;
    display: block;
    width: 28px;
    height: 32px;
    margin-left: 8px;
    background: url(${modelListDefaultBlue}) no-repeat;
    background-size: 21px auto;
    cursor: pointer;
  }
  .model-list-icon.not-empty {
    background: url(${modelListNotEmptyBlue}) no-repeat;
    background-size: 28px auto;
  }
  .model-list-icon span.count {
    position: absolute;
    display: block;
    width: 18px;
    height: 17px;
    line-height: 17px;
    font-size: 10.5px;
    text-align: center;
    bottom: 0px;
    right: -1px;
    color: #fff;
  }
`;
