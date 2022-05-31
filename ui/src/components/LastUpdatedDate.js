import React from 'react';
import { css } from '@emotion/react';
import moment from 'moment-timezone';
import LastUpdatedDateQuery from 'components/queries/LastUpdatedDateQuery';

const LastUpdatedDate = () => (
  <LastUpdatedDateQuery>
    {({ state: { date } }) => (
      <div
        css={css`
          border: 0 !important;
          font-family: 'Open Sans', sans-serif;
          font-size: 12px;
          font-weight: normal;
          font-style: normal;
          font-stretch: normal;
          line-height: 1.33;
          letter-spacing: normal;
          color: #000;
          text-align: center;
          margin-top: -25px;
          padding-bottom: 25px;
        `}
      >
        Updated: {moment(date).format('MMMM D, YYYY')}
      </div>
    )}
  </LastUpdatedDateQuery>
);

export default LastUpdatedDate;
