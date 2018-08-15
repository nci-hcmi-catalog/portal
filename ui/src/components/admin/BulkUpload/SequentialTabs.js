import React from 'react';
import Component from 'react-component-component';
import { SequentialTabsHeader } from 'theme/adminBulkUploadStyles';
import { SequentialTabTitle, SequentialTabsContent } from 'theme/adminBulkUploadStyles';

const SequentialTabs = ({ children, selectedTab, ...props }) => (
  <Component
    initialState={{
      selectedTab: selectedTab || 0,
    }}
  >
    {({ state: { selectedTab }, setState }) => {
      return (
        <>
          {' '}
          <SequentialTabsHeader>
            {' '}
            {(children || []).map(
              (child, index) =>
                index === selectedTab ? (
                  <SequentialTabTitle
                    active={true}
                    onClick={child.props.disableClick ? {} : () => setState({ selectedTab: index })}
                    text={child.props.title || ''}
                  />
                ) : (
                  <SequentialTabTitle
                    text={child.props.title || ''}
                    onClick={child.props.disableClick ? {} : () => setState({ selectedTab: index })}
                  />
                ),
            )}{' '}
          </SequentialTabsHeader>
          <SequentialTabsContent>
            {(children || []).length > selectedTab ? (
              children[selectedTab]
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
