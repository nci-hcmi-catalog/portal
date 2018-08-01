import styled from 'react-emotion';
import { Row, Col } from 'theme/system';
import { css } from 'emotion';

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

export const ReactTableStyle = ({ scrollbarSize: { scrollbarWidth } } = {}) => css`
  &.ReactTable .rt-thead.-header {
    padding-right: ${scrollbarWidth}px;
  }
  &.ReactTable {
    width: 100%;
    box-sizing: border-box;
    .rt-tbody {
      overflow-y: scroll;
      overflow-x: hidden;
    }
  }
  .-pageJump {
    border: solid 1px lightgrey;
    border-radius: 5px;
  }
  .ReactTable .-pagination_button {
    cursor: pointer;
    padding-left: 10px;
    padding-right: 10px;
    color: grey;
    user-select: none;
  }
  .ReactTable .-pagination_button.-current {
    background: lightgrey;
    color: #f0f1f6;
  }
  label: admin-table-footer;
`;
