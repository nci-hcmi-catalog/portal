import { css } from 'emotion';

export default css`
  top: 0;
  right: 0;
  position: absolute;
  background: rgb(255, 255, 255);
  width: 200px;
  box-sizing: border-box;
  padding: 20px 20px;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  font-family: 'Open Sans';
  font-size: 16px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 2;
  letter-spacing: normal;
  text-align: left;
  color: #323232;
  padding-bottom: 75px;

  .modal-footer {
    display: flex;
    background-color: #f3f6f7;
    padding: 1em;
    margin-top: 1em;
    justify-content: space-between;
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 0px;
    justify-content: flex-end;
  }

  h1 {
    font-family: 'Libre Franklin';
    font-size: 20px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.2;
    letter-spacing: normal;
    text-align: left;
    color: #900000;
    border-bottom: 1px #cacbcf solid;
    padding-bottom: 22px;
  }

  button {
    border-radius: 10px;
    background-color: #900000;
    border: solid 1px #cacbcf;
    padding: 5px 10px;
    font-family: 'Libre Franklin';
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
