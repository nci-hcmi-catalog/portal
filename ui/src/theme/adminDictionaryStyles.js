import styled from 'react-emotion';

import { AdminContent } from 'theme/adminStyles';

export const AdminDictionaryContent = styled(AdminContent)`
  display: flex;
  flex-direction: column;
  width: calc(100% - 280px);
  min-height: 416px;
  z-index: 1;
  padding: 24px 22px;
  label: admin-dictionary-content;
`;
