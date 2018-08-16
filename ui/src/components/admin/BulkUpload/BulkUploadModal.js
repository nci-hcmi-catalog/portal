import React from 'react';
import {
  BulkUploadMain,
  BulkUploadHeader,
  CloseModal,
  BulkUploadTitle,
  BulkUploadContent,
  SectionDivider,
} from 'theme/adminBulkUploadStyles';
import SequentialTabs from './SequentialTabs';
import SequentialTab from './SequentialTab';
import BulkUploadResult from './BulkUploadResult';
import BulkUploadInput from './BulkUploadInput';
import Component from 'react-component-component';
import BulkUploadControls from './BulkUploadControls';

const UploadModal = ({ type, ...props }) => (
  <Component
    initialState={{
      selectedTab: 0,
    }}
  >
    {({ state: { selectedTab }, setState }) => {
      return (
        <BulkUploadMain>
          <BulkUploadHeader>
            <BulkUploadTitle>{`Bulk ${type} Upload`}</BulkUploadTitle>
            <CloseModal />
          </BulkUploadHeader>
          <SectionDivider />
          <BulkUploadContent>
            <SequentialTabs
              {...props}
              selectedTab={selectedTab}
              onSelectionChanged={index => setState({ selectedTab: index })}
            >
              <SequentialTab
                title={`Step 1:Submit ${type} list`}
                component={
                  <BulkUploadInput
                    {...props}
                    {...{
                      type,
                    }}
                  />
                }
              />
              <SequentialTab
                title={`Step 2:Validate and finalize`}
                component={
                  <BulkUploadResult
                    {...props}
                    {...{
                      type,
                    }}
                  />
                }
              />
            </SequentialTabs>
            <BulkUploadControls controlSet={selectedTab} />
          </BulkUploadContent>
        </BulkUploadMain>
      );
    }}
  </Component>
);

export default UploadModal;
