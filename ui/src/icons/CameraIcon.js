import { BaseSvg } from 'icons';

const CameraIcon = ({ fill = '#900000', height = '30px', width = '30px', ...props }) =>
  BaseSvg({
    alt: 'Camera Icon',
    height,
    width,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90"><defs><style>.cls-1{fill:${fill};}</style></defs><path class="cls-1" d="M45,0A45,45,0,1,0,90,45,45.05,45.05,0,0,0,45,0Zm0,86.54A41.54,41.54,0,1,1,86.54,45,41.59,41.59,0,0,1,45,86.54Z"/><path class="cls-1" d="M64,30.34H40.54V29a4.17,4.17,0,0,0-4.19-4.19H30.69A4.17,4.17,0,0,0,26.5,29v1.32H26a5.12,5.12,0,0,0-5.12,5.12V60.05A5.11,5.11,0,0,0,26,65.17H64a5.12,5.12,0,0,0,5.12-5.12V35.46A5.12,5.12,0,0,0,64,30.34ZM30.22,29a.37.37,0,0,1,.39-.39h5.66a.37.37,0,0,1,.39.39v1.32H30.15V29Zm35.14,31A1.39,1.39,0,0,1,64,61.44H26a1.39,1.39,0,0,1-1.4-1.39V35.46a1.39,1.39,0,0,1,1.4-1.4H64a1.39,1.39,0,0,1,1.4,1.4Z"/><path class="cls-1" d="M45,36.86A10.94,10.94,0,1,0,55.9,47.79,10.92,10.92,0,0,0,45,36.86Zm0,18.07a7.14,7.14,0,1,1,7.14-7.14A7.12,7.12,0,0,1,45,54.93Z"/><circle class="cls-1" cx="60.32" cy="37.94" r="2.4"/><path class="cls-1" d="M31.85,36.08H28.36a1.86,1.86,0,0,0,0,3.72h3.49a1.86,1.86,0,0,0,0-3.72Z"/></svg>`,
    ...props,
  });

export default CameraIcon;
