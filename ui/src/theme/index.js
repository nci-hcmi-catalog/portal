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

const growthChartPalette = ['#ef5350', '#80deea'];

const multipleModelsChartPalette = ['#d4e157', '#0277bd'];

const mutatedGenesChartPalette = [
  '#ff6f00',
  '#26c6da',
  '#ba68c8',
  '#ffc400',
  '#00b0ff',
  '#00e676',
  '#ff4081',
  '#3949ab',
  '#26a69a',
  '#ff8a80',
];

const chartsPalette = [
  '#448aff', // 0
  '#fdd835', // 1
  '#f06292', // 2
  '#aeea00', // 3
  '#7e57c2', // 4
  '#80deea', // 5
  '#ff9100', // 6
  '#8c9eff', // 7
  '#c51162', // 8
  '#81d4fa', // 9
  '#ffff00', // 10
  '#388e3c', // 11
  '#f8bbd0', // 12
  '#2962ff', // 13
  '#d1c4e9', // 14
  '#d81b60', // 15
  '#5d4037', // 16
  '#80cbc4', // 17
  '#ff5722', // 18
  '#90a4ae', // 19
];

const base = {
  fonts: {
    openSans: openSans,
    libreFranklin: libreFranklin,
  },
  palette,
  chartsPalette,
  growthChartPalette,
  multipleModelsChartPalette,
  mutatedGenesChartPalette,
  keyedPalette: {
    // Colour names from http://chir.ag/projects/name-that-color/
    cherry: palette[0],
    brandPrimary: palette[1],
    brandPrimaryHighlight: palette[11],
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
    burntSienna: '#e58550',
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
    redOrange: '#be541a',
    aquaSpring: '#ecf7f9',
    alto: '#d8d8d8',
    elm: '#1c8292',
    whisper: '#f2f2f8',
    seaBuckthorn: '#f5a528',
    athensGray: '#f6f6f8',
    deepIron: '#cecfd3',
    bombay: '#b2b7c1',
    trout: '#525767',
    havelockBlue: '#4596de',
    athensLightGray: '#eaeaee',
    hotCinnamon: '#dd6624',
    texasRose: '#fec152',
    orangeRough: '#cf5a1a',
    mischka: '#d9d9df',
    sandyBeach: '#ffe9c3',
    graySuit: '#b9b5c6',
    crimson: '#cd0d32',
    goldenGlow: '#feda97',
    cinnabar: '#ed494c',
    morningGlory: '#8fd1db',
    mauvelous: '#f49394',
    cinderella: '#fce3e4',
    alizarinCrimson: '#df1b42',
    ironApprox: '#dcdde1',
    tiaMaria: '#d54215',
    redDamask: '#e06944',
    linen: '#fbece7',
  },
  transparency: {
    brandPrimary70: 'rgba(144,0,0,0.7)',
    brandPrimary80: 'rgba(144,0,0,0.8)',
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
      font-family: ${openSans};
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

export const visuallyHidden = css`
  position: absolute;
  height: 0;
  width: 0;
  top: -9999px;
  left: -9999px;
`;
