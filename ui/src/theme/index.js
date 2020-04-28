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

const growthChartPalette = ['#29818e', '#d9373c', '#636aab'];

const chartsPalette = [
  '#851330', // 0
  '#f09f32', // 1
  '#de3337', // 2
  '#cddc3a', // 3
  '#4caf53', // 4
  '#f77679', // 5
  '#f8a85f', // 6
  '#7cced9', // 7
  '#64b79c', // 8
  '#266574', // 9
  '#dfc4ac', // 10
  '#e3703e', // 11
  '#fee83b', // 12
  '#e13331', // 13
  '#edbb48', // 14
  '#81a856', // 15
  '#785548', // 16
  '#df9966', // 17
  '#ea5153', // 18
  '#84d0c5', // 19
  '#9b2620', // 20
  '#7dc274', // 21
  '#f9da6d', // 22
  '#009689', // 23
  '#fd7747', // 24
  '#6368ad', // 25
  '#edcbc1',
  '#1b9fb2',
  '#fdaa42',
  '#f25e46',
  '#4dac9e',
  '#f0458b',
  '#8ac14a',
  '#f4d494',
  '#8f93cb',
  '#fdc009',
  '#f34336',
  '#02bbd4',
  '#fe9802',
  '#de376f',
];

const base = {
  fonts: {
    openSans: openSans,
    libreFranklin: libreFranklin,
  },
  palette,
  chartsPalette,
  growthChartPalette,
  keyedPalette: {
    // Colour names from http://chir.ag/projects/name-that-color/
    cherry: palette[0],
    brandPrimary: palette[1],
    brandPrimaryHighlight: palette[11],
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
    mineShaft: '#323232',
    sienna: '#d57046',
    burntSienna: '#EC595D',
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
    oldLace: '#FDF4E9',
    oldCopper: '#724c31',
    green: '#3f8342',
    redOrange: '#b55a36',
    aquaSpring: '#ecf7f9',
    alto: '#d8d8d8',
    elm: '#1c8292',
    whisper: '#f2f2f8',
    seaBuckthorn: '#f5a528',
    athensGray: '#f6f6f8',
    deepIron: '#cecfd3',
  },
  transparency: {
    brandPrimary70: 'rgba(144,0,0,0.7)',
    brandPrimary20: 'rgba(144,0,0,0.2)',
    yellowOrange20: 'rgba(253,171,64,0.2)',
    white70: 'rgba(255,255,255, 0.7)',
    pelorousapprox20: 'rgba(69,179,195,0.2)',
  },
  buttons: {
    primary: {
      backgroundColor: 'rgba(144,0,0,0.7)',
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

export default base;

export const transitionRollover = (transitionSpeed = '0.25s') => css`
  transition: opacity ${transitionSpeed} ease, background-color ${transitionSpeed} ease,
    color ${transitionSpeed} ease, border-color ${transitionSpeed} ease;

  &:hover {
    transition: opacity 0s, background-color 0s, color 0s, border-color 0s;
  }
`;

export const colourRollover = (baseColour, hoverColour) =>
  css`
    color: ${baseColour};
    text-decoration: none;
    &:hover {
      color: ${hoverColour};
    }
  `;

export const bkgRollover = (baseColour, hoverColour) =>
  css`
    background-color: ${baseColour};

    &:hover {
      background-color: ${hoverColour};
    }
  `;

export const svgRollover = (baseColour, hoverColour) =>
  css`
    fill: ${baseColour} !important;

    &:hover {
      fill: ${hoverColour} !important;
    }
  `;

export const softTransitionRollover = (baseColour, hoverColour, transitionSpeed) =>
  css`
    ${transitionRollover(transitionSpeed)};
    ${colourRollover(baseColour, hoverColour)};
    ${svgRollover(baseColour, hoverColour)};
  `;

export const softTransitionRolloverBkg = (baseColour, hoverColour, transitionSpeed) =>
  css`
    ${transitionRollover(transitionSpeed)};
    ${bkgRollover(baseColour, hoverColour)};
    ${svgRollover(baseColour, hoverColour)};
  `;

export const softTransitionRolloverBkgHover = (hoverColour, transitionSpeed) =>
  css`
    ${transitionRollover(transitionSpeed)};
    &:hover {
      background-color: ${hoverColour};
    }
  `;
