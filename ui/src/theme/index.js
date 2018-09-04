import { css } from 'emotion';

const [openSans, libreFranklin] = ['"Open Sans", sans-serif', '"Libre Franklin", sans-seif'];

const palette = [
  '#790c2a', // 0   - cherry
  '#900000', // 1   - brandPrimary
  '#e82e2a', // 2   - crimson
  '#f84d52', // 3   - carnation
  '#fa7477', // 4   - froly
  '#f25e46', // 5   - flamingo
  '#fd7746', // 6   - coral
  '#ef904b', // 7   - jaffa
  '#fdab40', // 8   - yellowOrange
  '#f8bb4a', // 9   - casablanca
  '#fae8ca', // 10  - champagne
  '#d3494d', // 11  - valencia
  '#f3f6f7', // 12  - lightPorcelain
  '#e1e5e7', // 13  - porcelain
];

export default {
  fonts: {
    openSans: openSans,
    libreFranklin: libreFranklin,
  },
  palette: palette,
  keyedPalette: {
    // Colour names from http://chir.ag/projects/name-that-color/
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
    black: '#000000',
    white: '#ffffff',
    mineShaft: '#343434',
    sienna: '#d57046',
    pelorousapprox: '#45b3c3',
    dustyGray: '#969696',
    iron: '#cdd4d9',
    mystic: '#ebf1f3',
    lightBlack: 'rgba(0, 0, 0, 0.23)',
    darkBlack: 'rgba(0, 0, 0, 0.35)',
    shuttleGrey: '#64666a',
    silver: '#c0c0c0',
    frenchGrey: '#CACBCF',
    dodgerBlue: '#3B99FC',
    silverChalice: '#A8A8A8',
    dawnPink: '#F3E4E4',
  },
  transparency: {
    brandPrimary70: 'rgb(144,0,0,0.7)',
    brandPrimary20: 'rgb(144,0,0,0.2)',
    white70: 'rgba(255,255,255, 0.7)',
    pelorousapprox20: 'rgb(69,179,195,0.2)',
  },
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
