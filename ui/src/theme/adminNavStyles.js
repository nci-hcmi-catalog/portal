import { css } from 'emotion';
import base from 'theme';

const {
  fonts: { libreFranklin },
  transparency,
  palette,
} = base;

const navBackgroundColour = transparency[0];
const navOnState = palette[11];

export default css`
  font-family: ${libreFranklin};
  background-color: ${navBackgroundColour};
  color: white;
  display: flex;
  justify-content: space-between;
  padding: 0 30px;
  border-top: 6px solid white;
  border-bottom: 6px solid white;

  .nav {
    a {
      display: inline-block;
      position: relative;
      color: white;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      font-style: normal;
      font-stretch: normal;
      letter-spacing: normal;
      text-align: center;
      line-height: 50px;
      padding: 0 22px;
      text-transform: uppercase;

      &.active {
        background-color: ${navOnState};

        &::after {
          display: block;
          position: absolute;
          left: calc(50% - 7px);
          bottom: 0px;
          content: '';
          width: 0;
          height: 0;
          border-left: 7px solid transparent;
          border-right: 7px solid transparent;
          border-bottom: 7px solid white;
        }
      }
    }
  }
`;
