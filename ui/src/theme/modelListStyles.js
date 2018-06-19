import { css } from 'emotion';
import modelListDefaultWhite from 'assets/icon-modellist-empty-white.svg';
import modelListNotEmptyWhite from 'assets/icon-modellist-full-white.svg';
import modelListDefaultRed from 'assets/icon-modellist-empty-red.svg';
import modelListNotEmptyRed from 'assets/icon-modellist-full-red.svg';

export default css`
  .model-list-icon {
    position: relative;
    display: block;
    width: 29px;
    height: 33px;
    margin-left: 32px;
    background: url(${modelListDefaultWhite}) no-repeat;
    background-size: 22px auto;
    cursor: pointer;
  }
  .model-list-icon.not-empty {
    background: url(${modelListNotEmptyWhite}) no-repeat;
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
    right: 0px;
    color: #fff;
  }
  .search-header-model-list.model-list-icon {
    background: url(${modelListDefaultRed}) no-repeat;
    width: 32px;
    height: 36px;
    background-size: 24px auto;
    margin-left: 20px;
  }
  .search-header-model-list.model-list-icon.not-empty {
    background: url(${modelListNotEmptyRed}) no-repeat;
  }
`;
