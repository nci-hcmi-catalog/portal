import { css } from 'emotion';
import styled from 'react-emotion';
import base from 'theme';

import { AdminContent } from 'theme/adminStyles';
import { Col } from 'theme/system';

const {
  fonts: { libreFranklin },
  keyedPalette: { athensGray, deepIron, elm, mineShaft, pelorousapprox, porcelain, white },
} = base;

const borderColour = porcelain;

export const AdminDictionaryContent = styled(AdminContent)`
  display: flex;
  flex-direction: row;
  width: calc(100% - 280px);
  min-height: 416px;
  z-index: 1;
  padding: 24px 28px;
  label: admin-dictionary-content;
`;

export const AdminDictionaryContentColumn = styled(Col)`
  width: 50%;
`;

export const FieldValues = styled(AdminDictionaryContentColumn)`
  border-right: 1px solid ${borderColour}
`;

export const DependentValues = styled(AdminDictionaryContentColumn)`
  padding-left: 28px;
`;

export const DictionaryColumnHeading = styled('h2')`
  margin-top: 0;
  font-family: ${libreFranklin};
  font-size: 14px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.71;
  letter-spacing: normal;
`;

export const disabledPill = css`
  background-color: ${deepIron};
  &:hover {
    background-color: ${deepIron};
  }
`;

export const cancelPill = css`
  background-color: ${white};
  color: ${mineShaft};
  &:hover {
    background-color: ${athensGray};
    color: ${mineShaft};
  }
`;

export const actionPill = css`
  background-color: ${elm};
  &:hover {
    background-color: ${pelorousapprox};
  }
`;
