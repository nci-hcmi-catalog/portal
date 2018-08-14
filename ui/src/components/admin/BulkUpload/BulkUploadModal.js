import React from 'react';
import {
  BulkUploadMain,
  BulkUploadHeader,
  CloseModal,
  BulkUploadTitle,
  BulkUploadContent,
} from 'theme/adminBulkUploadStyles';
import { HeaderSeparator } from '../../../theme/adminBulkUploadStyles';
import SequentialTabs from './SequentialTabs';

const UploadModal = ({ type, ...props }) => (
  <BulkUploadMain>
    <BulkUploadHeader>
      <BulkUploadTitle>{`Bulk ${type} Upload`}</BulkUploadTitle>
      <CloseModal />
    </BulkUploadHeader>
    <HeaderSeparator />
    <BulkUploadContent>
      <SequentialTabs type={type} {...props} />
    </BulkUploadContent>
  </BulkUploadMain>
);

export default UploadModal;
