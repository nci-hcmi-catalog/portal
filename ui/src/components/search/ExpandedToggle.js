import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';

import Toggle from 'components/input/Toggle';

import QuestionMarkIcon from 'icons/QuestionMarkIcon';

import { useExpandedUnexpanded } from 'providers/ExpandedUnexpanded';

import { getNumUnexpanded } from 'utils/sqonHelpers';

const ExpandedToggle = ({ sqon }) => {
  const { showUnexpanded, setShowUnexpanded } = useExpandedUnexpanded();
  const [numUnexpanded, setNumUnexpanded] = useState('');

  useEffect(() => {
    const fetchNumUnexpanded = async () => {
      const data = await getNumUnexpanded(sqon);
      setNumUnexpanded(data);
    };

    fetchNumUnexpanded(sqon);
  }, [sqon]);

  return (
    <>
      <Toggle
        disabled={numUnexpanded === 0}
        id="expanded-toggle"
        initialValue={showUnexpanded}
        onValueChange={() => setShowUnexpanded(!showUnexpanded)}
      />
      <label
        htmlFor="expanded-toggle"
        css={`
          font-size: 12px;
          margin-left: 5px;
          min-width: 180px;
          text-align: right;
        `}
      >
        {showUnexpanded ? 'Exclude' : 'Include'}{' '}
        {`${numUnexpanded} unexpanded model${numUnexpanded !== 1 ? 's' : ''}`}
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
