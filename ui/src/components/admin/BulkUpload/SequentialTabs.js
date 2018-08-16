import React from 'react';
import Component from 'react-component-component';
import {
  SequentialTabsHeader,
  SequentialTabTitle,
  SequentialTabsContent,
} from 'theme/adminBulkUploadStyles';

const SequentialTabs = ({ children, selectedTab, onSelectionChanged, ...props }) => (
  <Component
    initialState={{
      selected: selectedTab || 0,
    }}
    key={selectedTab} // create new instance of this component whenever a parent component changes this prop
  >
    {({ state: { selected }, setState }) => {
      const handleSelectionChange = newIdx => {
        typeof onSelectionChanged === 'function'
          ? onSelectionChanged(newIdx) // change state only if this prop is not provided
          : setState({ selected: newIdx });
      };
      return (
        <>
          {' '}
          <SequentialTabsHeader>
            {' '}
            {(children || []).map(
              (child, index) =>
                index === selected ? (
                  <SequentialTabTitle
                    active={true}
                    onClick={child.props.disableClick ? {} : () => handleSelectionChange(index)}
                    text={child.props.title || ''}
                  />
                ) : (
                  <SequentialTabTitle
                    text={child.props.title || ''}
                    onClick={child.props.disableClick ? {} : () => handleSelectionChange(index)}
                  />
                ),
            )}{' '}
          </SequentialTabsHeader>{' '}
          <SequentialTabsContent>
            {' '}
            {(children || []).length > selected ? (
              children[selected]
            ) : (
              <div
                css={`
                  display: none;
                `}
              />
            )}{' '}
          </SequentialTabsContent>
        </>
      );
    }}
  </Component>
);

export default SequentialTabs;
