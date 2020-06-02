import { css } from 'emotion';
import modelListDefaultWhite from 'assets/icon-modellist-empty-white.svg';
import modelListNotEmptyWhite from 'assets/icon-modellist-full-white.svg';
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
    background: url(${modelListDefaultBlue}) no-repeat;
    width: 28px;
    height: 32px;
    background-size: 21px auto;
    margin-left: 8px;
  }
  .search-header-model-list.model-list-icon.not-empty {
    background: url(${modelListNotEmptyBlue}) no-repeat;
    background-size: 28px auto;
  }

  .search-header-model-list.model-list-icon span.count {
    right: -1px;
  }
`;
