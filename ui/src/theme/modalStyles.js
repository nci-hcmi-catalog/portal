import { css } from 'emotion';

export default css`
  top: 50%;
  left: 50%;
  right: auto;
  bottom: auto;
  position: absolute;
  border: 1px solid rgb(204, 204, 204);
  background: rgb(255, 255, 255);
  border-radius: 4px;
  transform: translate(-50%, -50%);
  width: 95%;
  max-width: 1000px;
  max-height: 95%;
  box-sizing: border-box;
  padding: 20px 20px;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 5px 15px;
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
  padding-bottom: 80px;

  .modal-body {
    height: 100%;
    overflow-y: auto;
  }

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

  ul.red-bullets,
  ul.checkmark-bullets {
    list-style-type: none;
    text-align: justify;
    list-style-position: outside;
  }

  .red-bullets li:before {
    background-color: #900;
    border-radius: 50%;
    content: '';
    display: inline-block;
    margin: auto 10px;
    height: 10px;
    width: 10px;
  }

  .checkmark-bullets li {
    margin-left: 0;
    position: relative;
    padding-left: 32px;
  }

  .checkmark-bullets li:before {
    content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 90 90'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill:%23900000;%7D%3C/style%3E%3C/defs%3E%3Cpath class='cls-1' d='M45,0A45,45,0,1,0,90,45,45.07,45.07,0,0,0,45,0Zm0,85.8A40.75,40.75,0,1,1,85.8,45.1,40.84,40.84,0,0,1,45,85.8Z'/%3E%3Cpath class='cls-1' d='M60.4,32.4c-6.9,7.1-13.8,14.1-20.7,21.2-3.6-3.7-7.1-7.4-10.7-11.1-1.9-2-4.9,1-3,3,4.1,4.2,8.1,8.4,12.2,12.6a2.17,2.17,0,0,0,3,0C48.6,50.5,56,42.9,63.4,35.4,65.2,33.4,62.3,30.4,60.4,32.4Z'/%3E%3C/svg%3E");
    width: 22px;
    height: 22px;
    position: absolute;
    top: 8px;
    left: 0;
  }
`;
