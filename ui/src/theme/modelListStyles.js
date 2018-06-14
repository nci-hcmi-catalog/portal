import { css } from 'emotion';
import modelListDefaultWhite from 'assets/icon-modellist-empty-white.svg';
import modelListNotEmptyWhite from 'assets/icon-modellist-full-white.svg';

export default css`
  .model-list-icon {
    position: relative;
    display: block;
    width: 29px;
    height: 33px;
    margin-left: 32px;
    background: url(${modelListDefaultWhite}) no-repeat;
    background-size: 22px auto;
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
  }
`;
