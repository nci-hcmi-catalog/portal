import React from 'react';
import LastUpdatedDateQuery from 'components/queries/LastUpdatedDateQuery';

export default () => (
  <LastUpdatedDateQuery>{({ state: { date } }) => <div>{date}</div>}</LastUpdatedDateQuery>
);
