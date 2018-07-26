import { css } from 'emotion';

const [openSans, libreFranklin] = ['"Open Sans", sans-serif', '"Libre Franklin", sans-seif'];

const palette = [
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
  '#e1e5e7',
];

export default {
  fonts: {
    openSans: openSans,
    libreFranklin: libreFranklin,
  },
  palette: palette,
  keyedPalette: {
    cherry: palette[0],
    brandPrimary: palette[1],
    crimson: palette[2],
    carnation: palette[3],
    froly: palette[4],
    flamingo: palette[5],
    coral: palette[6],
    jaffa: palette[7],
    yellowOrange: palette[8],
    casablanca: palette[9],
    champagne: palette[10],
    valencia: palette[11],
    lightPorcelain: palette[12],
    porcelain: palette[13],
  },
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
