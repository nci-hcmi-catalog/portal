import React from 'react';
import Popup from 'reactjs-popup';

import { ModelSingleContext } from '../ModelSingleController';

import { Pill } from 'theme/adminControlsStyles';
import AdminModelPublishIcon from 'icons/AdminModelPublishIcon';

export default props => (
  <ModelSingleContext.Consumer>
    {({
      state: {
        form: { isReadyToPublish, values, errors },
      },
      publishForm,
    }) => (
      <Popup
        trigger={() => (
          <Pill
            disabled={!isReadyToPublish}
            onClick={() => isReadyToPublish && publishForm(values)}
            {...props}
          >
            <AdminModelPublishIcon css={'margin-right: 10px;'} height={16} width={15} />Publish
          </Pill>
        )}
        position="top center"
        contentStyle={{
          padding: '6px 12px',
          border: 'none',
          borderRadius: '10px',
          fontFamily: "'Open Sans', sans-serif",
          fontSize: '13px',
          width: 'max-content',
        }}
        on="hover"
        offsetY={2}
        // If button is disabled (not ready to publish) show the tooltip,
        // like normal, otherwise delay it for a very long time (since there
        // is no way to disable it all together) and in case someone actually
        // hovers for 100 seconds then show them a nice message
        mouseEnterDelay={!isReadyToPublish > 0 ? 100 : 100 * 1000}
      >
        {Object.keys(errors).length > 0
          ? 'Please complete all required fields before publishing'
          : !isReadyToPublish
            ? 'No new changes to publish'
            : 'Ready to Publish =)'}
      </Popup>
    )}
  </ModelSingleContext.Consumer>
);
