const ChartTooltip = ({ value, label }) => (
  <div>
    {`${label}`.startsWith('__m') ? 'No Data' : label}
    <br />
    {value} Model{value !== 1 ? 's' : ''}
  </div>
);

export default ChartTooltip;
