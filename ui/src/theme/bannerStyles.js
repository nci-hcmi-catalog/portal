import styled from '@emotion/styled';
import ReactMarkdown from 'react-markdown';

import { BANNER_TYPES } from '../utils/constants';

import base from 'theme';
import { Row } from 'theme/system';

const {
  keyedPalette: { brandPrimary, valencia },
} = base;

export const BannerWrapper = styled('section')`
  display: flex;
  width: 100%;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1rem;
  background-color: ${({ type }) => {
    switch (type) {
      case BANNER_TYPES.critical:
        return '#ffebe9';
      case BANNER_TYPES.warning:
        return '#fff8c5';
      case BANNER_TYPES.info:
      default:
        return '#ddf4ff';
    }
  }};
  color: #1f2328;
  border-bottom: ${({ type }) => {
    switch (type) {
      case BANNER_TYPES.critical:
        return `1px solid #d1242f`;
      case BANNER_TYPES.warning:
        return `1px solid #9a6700`;
      case BANNER_TYPES.info:
      default:
        return `1px solid #0969da`;
    }
  }};
`;

export const BannerContent = styled(Row)`
  display: flex;
  align-items: center;
  gap: 1rem;
  svg {
    min-width: 1.25rem;
  }
  p {
    margin: 0;
  }
`;

export const BannerText = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-right: 0.5rem;
`;

export const BannerTitle = styled(ReactMarkdown)`
  font-weight: bold;
  font-size: 1.125rem;
  a {
    color: ${brandPrimary} !important;
    text-decoration: underline;

    &:hover {
      color: ${valencia} !important;
    }
  }
`;

export const BannerMessage = styled(ReactMarkdown)`
  p:not(:last-child) {
    margin-bottom: 0.25rem;
  }
  a {
    color: ${brandPrimary} !important;
    text-decoration: underline;

    &:hover {
      color: ${valencia} !important;
    }
  }
`;

export const DismissButton = styled('button')`
  display: flex;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin: 0;

  svg {
    margin: 0;
  }
`;
