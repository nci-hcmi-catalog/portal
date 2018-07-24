import { css } from 'emotion';

const [openSans, libreFranklin] = ['"Open Sans", sans-serif', '"Libre Franklin", sans-seif'];

export default {
  fonts: {
    openSans: openSans,
    libreFranklin: libreFranklin,
  },
  palette: [
    '#790c2a',
    '#900000',
    '#e82e2a',
    '#f84d52',
    '#fa7477',
    '#f25e46',
    '#fd7746',
    '#ef904b',
    '#fdab40',
    '#f8bb4a',
    '#fae8ca',
    '#d3494d',
    '#f3f6f7',
  ],
  transparency: ['rgb(144,0,0,0.7)'],
  buttons: {
    primary: {
      backgroundColor: 'rgb(144,0,0,0.7)',
      color: 'white',
    },
    pillBase: css`
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-family: ${libreFranklin};
      background-color: #ffffff;
      color: #734d32;
      font-size: 12px;
      font-weight: 500;
      font-style: normal;
      font-stretch: normal;
      letter-spacing: normal;
      text-align: center;
      text-transform: uppercase;
      line-height: 30px;
      padding: 0 15px;
      border-radius: 10px;
      border: solid 1px #cacbcf;
    `,
  },
  chart: {
    tooltip: {
      container: {
        border: '1px #aaaaaa solid',
        background: 'rgb(240, 240, 240)',
        fontSize: '11px',
        textAlign: 'center',
        fontWeight: 'bold',
      },
    },
  },
};
