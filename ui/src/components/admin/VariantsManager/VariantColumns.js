import React from 'react';
import Popup from 'reactjs-popup';
import Moment from 'react-moment';
import AdminEditPencilIcon from 'icons/AdminEditPencilIcon';
import { schemaArr } from '../schema/model';
import { ActionPill, Actions, ToolbarText } from '../../../theme/adminTableStyles';

const selectedColumns = ['name', 'type', 'createdAt', 'updatedAt'];

export const columns = schemaArr
  .filter(field => selectedColumns.indexOf(field.accessor) !== -1)
  .map(field => {
    field.Header = field.displayName;
    return field;
  });

const variantManagerCustomColumns = [
  {
    Header: 'Updated',
    accessor: 'updatedAt',
    Cell: row => {
      const value = row.value;
      return (
        <Popup
          trigger={() => <Moment fromNow>{value}</Moment>}
          position="top"
          offset={0}
          on="hover"
          mouseLeaveDelay={30}
          mouseEnterDelay={10}
          contentStyle={{
            padding: '0px',
            border: 'none',
            width: 'max-content',
          }}
          arrow={true}
        >
          <ToolbarText>
            <Moment parse="YYYY-MM-DD HH:mm">{value}</Moment>
          </ToolbarText>
        </Popup>
      );
    },
  },
  {
    Header: 'Actions',
    accessor: 'name',
    Cell: row => {
      const data = row;
      return (
        <Actions>
          <ActionPill secondary marginRight="6px" to={''}>
            <AdminEditPencilIcon
              css={`
                width: 12px;
                height: 12px;
              `}
            />
            Delete
          </ActionPill>
        </Actions>
      );
    },
  },
];

export const VariantTableColumns = columns
  .filter(col => ['name', 'type'].includes(col.accessor))
  .concat(variantManagerCustomColumns);
