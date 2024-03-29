import { BaseSvg } from 'icons';

const GoogleLogo = ({ height = '12px', width = '12px', ...props }) =>
  BaseSvg({
    alt: 'Google Logo',
    svg: `<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="m4.424 12.065-.695 2.594-2.54.054a9.998 9.998 0 0 1 -.073-9.32l2.261.415.99 2.247a5.957 5.957 0 0 0 .055 4.01z" fill="#fbbb00"/><path d="m19.787 8.119a9.976 9.976 0 0 1 -3.558 9.647l-2.846-.145-.403-2.516a5.948 5.948 0 0 0 2.559-3.037h-5.34v-3.95h9.588z" fill="#518ef8"/><path d="m16.228 17.766c-4.3 3.45-10.584 2.762-14.035-1.538a9.982 9.982 0 0 1 -1.004-1.515l3.236-2.648a5.936 5.936 0 0 0 8.554 3.041z" fill="#28b446"/><path d="m16.35 2.3-3.232 2.648a5.935 5.935 0 0 0 -8.752 3.107l-3.251-2.662c2.535-4.896 8.56-6.808 13.455-4.273.634.328 1.231.724 1.78 1.18" fill="#f14336"/></g></svg>`,
    height,
    width,
    ...props,
  });

export default GoogleLogo;
