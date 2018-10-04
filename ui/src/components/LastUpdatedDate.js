import React from 'react';
import moment from 'moment';
import LastUpdatedDateQuery from 'components/queries/LastUpdatedDateQuery';

export default () => (
  <LastUpdatedDateQuery>
    {({ state: { date } }) => (
      <div
        css={`
          border: 0 !important;
          font-family: 'Open Sans', sans-serif;
          font-size: 12px;
          font-weight: normal;
          font-style: normal;
          font-stretch: normal;
          line-height: 2.17;
          letter-spacing: normal;
          text-align: center;
          color: #64666a;
        `}
      >
        Updated: {moment(date).format('MMMM D, YYYY')}
      </div>
    )}
  </LastUpdatedDateQuery>
);
