import React from 'react';
export { default as GrowthChart } from './GrowthChart';
export { default as PrimarySiteChart } from './PrimarySiteChart';

export const ChartTooltip = ({ value, label }) => (
  <div>
    {`${label}`.startsWith('__m') ? 'No Data' : label}
    <br />
    {value} Models
  </div>
);
