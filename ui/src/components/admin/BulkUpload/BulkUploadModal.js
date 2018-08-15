import React from 'react';
import {
  BulkUploadMain,
  BulkUploadHeader,
  CloseModal,
  BulkUploadTitle,
  BulkUploadContent,
  HeaderDivider,
} from 'theme/adminBulkUploadStyles';
import SequentialTabs from './SequentialTabs';
import SequentialTab from './SequentialTab';

const UploadModal = ({ type, ...props }) => (
  <BulkUploadMain>
    <BulkUploadHeader>
      <BulkUploadTitle>{`Bulk ${type} Upload`}</BulkUploadTitle>
      <CloseModal />
    </BulkUploadHeader>
    <HeaderDivider />
    <BulkUploadContent>
      <SequentialTabs {...props} selectedTab={0}>
        <SequentialTab
          title={`Step 1:Submit ${type} list`}
          component={<span> This is step 1 </span>}
        />
        <SequentialTab
          title={`Step 2:Validate and finalize`}
          component={<span> This is step 2 </span>}
        />
      </SequentialTabs>
    </BulkUploadContent>
  </BulkUploadMain>
);

export default UploadModal;
