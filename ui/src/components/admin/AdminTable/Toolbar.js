import React from 'react';

import TextInput from '@arranger/components/dist/Input';
import BulkActions from './BulkActions';

import FilterIcon from 'icons/FilterIcon';

import { ToolbarMain, ToolbarSection, ToolbarText } from 'theme/adminTableStyles';

export default ({
  state: { isLoading, page, pageSize, filterValue, rowCount, selection },
  onFilterValueChange,
  type,
  onPublishClick,
  onUnpublishClick,
  onDeleteClick,
}) => {
  const [from, to] = [page * pageSize + 1, page * pageSize + pageSize];
  return (
    <ToolbarMain>
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
      <ToolbarSection>
        <TextInput
          icon={<FilterIcon height={10} width={10} css={'margin: 0 0 0 5px;'} />}
          type="text"
          placeholder="Filter"
          value={filterValue}
          onChange={({ target: { value } }) => onFilterValueChange(value)}
          css={`
            height: 37px;
            line-height: 37px;
          `}
        />
        <ToolbarText
          css={`
            line-height: 37px;
            padding-left: 28px;
            color: #64666a;
          `}
        >
          {!isLoading &&
            `Showing ${from} - ${to <= rowCount ? to : rowCount} of ${rowCount} ${type}`}
        </ToolbarText>
      </ToolbarSection>
    </ToolbarMain>
  );
};
