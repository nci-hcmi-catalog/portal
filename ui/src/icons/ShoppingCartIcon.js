import { BaseSvg } from 'icons';

export default ({ fill = '#900000', ...props }) =>
  BaseSvg({
    svg: `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88 78"><defs><style>.cls-1{fill:${fill};}</style></defs><title>icon-shopping-card</title><path class="cls-1" d="M3.09,0a3,3,0,0,0-.68,5.94L9,7.39c3.51,16.79,7.33,33.51,11,50.26A3,3,0,0,0,23,60H75.7c4.06.06,4.06-6.06,0-6H25.42l-1.33-6H78.35a3,3,0,0,0,2.93-2.35l6.65-30A3,3,0,0,0,85,12q-34.43,0-68.86,0L14.51,4.26a3,3,0,0,0-2.29-2.32L3.69.08A3.09,3.09,0,0,0,3.09,0ZM35.5,62a8,8,0,1,0,8,8A8,8,0,0,0,35.5,62Zm28,0a8,8,0,1,0,8,8A8,8,0,0,0,63.5,62Z"/></svg>`,
    ...props,
  });
