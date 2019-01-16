import React from 'react';
import MomentReact from 'react-moment';
import moment from 'moment-timezone';
import { FormHeader } from 'theme/adminFormStyles';

export default ({ title, updatedAt }) => (
  <FormHeader>
    <h2
      css={`
        flex-grow: 1;
      `}
    >
      {title}
    </h2>
    {updatedAt ? (
      <div
        css={`
          justify-content: right;
          font-size: 12px;
        `}
      >
        <span>{`Updated `}</span>
        <MomentReact parse="YYYY-MM-DD HH:mm" format="YYYY-MM-DD hh:mm a" tz={moment.tz.guess()}>
          {updatedAt}
        </MomentReact>
      </div>
    ) : (
      ''
    )}
  </FormHeader>
);
