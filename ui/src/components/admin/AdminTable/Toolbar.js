import React from 'react';

import BulkActions from './BulkActions';

import Filter from 'components/input/Filter';

import { ToolbarMain, ToolbarSection, ToolbarText } from 'theme/adminTableStyles';

export default ({
  state: { isLoading, page, pageSize, filterValue, rowCount, selection },
  paginated = true,
  onFilterValueChange,
  type,
  onPublishClick,
  onUnpublishClick,
  onDeleteClick,
}) => {
  const [from, to] = [rowCount === 0 ? 0 : page * pageSize + 1, page * pageSize + pageSize];
  const rowCountText = paginated
    ? `Showing ${from} - ${to <= rowCount ? to : rowCount} of ${rowCount} ${type}`
    : `Showing ${rowCount} ${type}`;
  return (
    <ToolbarMain type={type}>
      {type === 'Variants' && <Filter onFilterValueChange={onFilterValueChange} />}
      <ToolbarSection>
        <ToolbarText
          css={`
            font-size: 12px;
            margin-right: 10px;
          `}
        >
          {!isLoading && rowCountText}
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
