import React from 'react';

import BulkActions from './BulkActions';

import Filter from 'components/input/Filter';

import { ToolbarMain, ToolbarSection, ToolbarText } from 'theme/adminTableStyles';

export default ({
  state: { isLoading, page, pageSize, filterValue, rowCount, selection },
  onFilterValueChange,
  type,
  onPublishClick,
  onUnpublishClick,
  onDeleteClick,
}) => {
  const [from, to] = [rowCount === 0 ? 0 : page * pageSize + 1, page * pageSize + pageSize];
  return (
    <ToolbarMain>
      {type === 'Variants' && (
        <ToolbarSection>
          <Filter onFilterValueChange={onFilterValueChange} />
        </ToolbarSection>
      )}
      <ToolbarSection>
        <ToolbarText
          css={`
            font-size: 12px;
            margin-right: 10px;
          `}
        >
          {!isLoading &&
            `Showing ${from} - ${to <= rowCount ? to : rowCount} of ${rowCount} ${type}`}
        </ToolbarText>
        {type !== 'Variants' && <Filter onFilterValueChange={onFilterValueChange} />}
      </ToolbarSection>
      {type === 'Models' && (
        <BulkActions
          {...{
            onPublishClick,
            onUnpublishClick,
            onDeleteClick,
            hasSelection: selection.length > 0,
          }}
        />
      )}
    </ToolbarMain>
  );
};
