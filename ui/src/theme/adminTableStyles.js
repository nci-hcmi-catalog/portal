import styled from 'react-emotion';
import { Row, Col } from 'theme/system';

export const Table = styled(Col)`
  min-height: 50px;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-top: 6px solid white;
  border-bottom: 6px solid white;
  label: admin-table;
`;

export const TableHeader = styled(Row)`
  min-height: 50px;
  align-items: center;
  label: admin-table-header;
`;

export const TableFooter = styled(Row)`
  min-height: 50px;
  align-items: center;
  padding: 20px;
  label: admin-table-footer;
`;
