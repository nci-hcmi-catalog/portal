import React from 'react';
import Moment from 'react-moment';
import Popup from 'reactjs-popup';
import withDeleteModal from '../DeleteModal';
import AdminEditPencilIcon from 'icons/AdminEditPencilIcon';
import DeleteIcon from 'icons/TrashIcon';

import { schemaArr } from '../schema/user';
import { ActionPill, Actions, ToolbarText } from '../../../theme/adminTableStyles';

const selectedColumns = ['name', 'email', 'status', 'createdAt', 'updatedAt'];

const deleteUser = id => console.log(`Will delete ${id}`);
export const columns = schemaArr
  .filter(field => selectedColumns.indexOf(field.accessor) !== -1)
  .map(field => {
    field.Header = field.displayName;
    return field;
  });

const userManagerCustomColumns = [
  {
    Header: 'Created',
    accessor: 'createdAt',
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
    Cell: ({ original: { _id, name, email } }) => {
      return (
        <Actions>
          <ActionPill secondary marginRight="6px">
            <AdminEditPencilIcon
              css={`
                width: 12px;
                height: 12px;
              `}
            />
            Edit
          </ActionPill>
          {withDeleteModal({
            next: () => deleteUser(_id),
            target: `${name}(${email})`,
          })(
            <ActionPill secondary marginRight="6px">
              <DeleteIcon
                css={`
                  width: 12px;
                  height: 12px;
                  font-weight: normal;
                `}
              />
              Delete
            </ActionPill>,
          )}
        </Actions>
      );
    },
  },
];

export const UserTableColumns = columns
  .filter(col => ['name', 'email', 'status'].includes(col.accessor))
  .concat(userManagerCustomColumns);
