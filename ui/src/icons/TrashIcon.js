import { BaseSvg } from 'icons';

const TrashIcon = ({ width = '12px', height = '12px', fill = '#1c8292', ...props }) =>
  BaseSvg({
    alt: 'Trash Icon',
    width,
    height,
    svg: `<svg viewBox="0 0 19 20" xmlns="http://www.w3.org/2000/svg"><path d="m17.391 2.609h-4.348v-1.652c0-.653-.565-.957-1.304-.957h-5.217c-.74 0-1.305.304-1.305.957v1.652h-4.347c-.48 0-.87.391-.87.87 0 .478.391.869.87.869h.434v11.522c0 2.26 1.696 4.13 3.74 4.13h8.565c1.826 0 3.304-1.652 3.304-3.696v-11.956h.435c.478 0 .87-.391.87-.87 0-.478-.348-.87-.827-.87zm-10.434-1.305h4.347v1.306h-4.347zm-.435 13.913c0 .479-.392.87-.87.87s-.87-.391-.87-.87v-7.826c0-.478.392-.87.87-.87s.87.392.87.87zm3.478 0c0 .479-.391.87-.87.87-.478 0-.87-.391-.87-.87v-7.826c0-.478.392-.87.87-.87.479 0 .87.392.87.87zm3.478 0c0 .479-.391.87-.87.87-.478 0-.869-.391-.869-.87v-7.826c0-.478.391-.87.87-.87.478 0 .87.392.87.87v7.826z" fill="${fill}" fill-rule="evenodd"/></svg>`,
    ...props,
  });

export default TrashIcon;
