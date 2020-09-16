import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';

import Toggle from 'components/input/Toggle';

import QuestionMarkIcon from 'icons/QuestionMarkIcon';

import { getNumUnexpanded } from 'utils/sqonHelpers';

const ExpandedToggle = ({ showUnexpanded, setShowUnexpanded }) => {
  const [numUnexpanded, setNumUnexpanded] = useState('');

  useEffect(() => {
    const fetchNumUnexpanded = async () => {
      const data = await getNumUnexpanded();
      setNumUnexpanded(data);
    };

    fetchNumUnexpanded();
  }, []);

  return (
    <>
      <Toggle
        id="expanded-toggle"
        initialValue={showUnexpanded}
        onValueChange={() => setShowUnexpanded(!showUnexpanded)}
      />
      <label
        htmlFor="expanded-toggle"
        css={`
          font-size: 12px;
          margin-left: 5px;
          min-width: 166px;
          text-align: right;
        `}
      >
        {showUnexpanded ? 'Hide' : 'Show'} {`${numUnexpanded} unexpanded models`}
      </label>
      <Popup
        trigger={() => (
          <div
            css={`
              display: flex;
              margin-left: 5px;
            `}
          >
            <QuestionMarkIcon />
          </div>
        )}
        on="hover"
        position={'top right'}
        width={'225px'}
        mouseEnterDelay={100}
      >
        <div
          css={`
            font-size: 12px;
          `}
        >
          <b>Expanded models</b> are available for purchase on ATCC.
          <br />
          <b>Unexpanded models</b> have passed sequencing validation QC, but are not yet available
          for purchase.
        </div>
      </Popup>
    </>
  );
};

export default ExpandedToggle;
