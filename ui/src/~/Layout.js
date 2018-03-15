import React from 'react';
import styled from 'react-emotion';
import {
  space,
  width,
  fontSize,
  color,
  flex,
  alignItems,
  justifyContent,
  flexDirection,
} from 'styled-system';

let Box = styled.div`
  ${space}
  ${width}
  ${fontSize}
  ${color}
`;

let Row = styled.div`
  display: flex;
  ${flex}
  ${space}
  ${alignItems}
  ${justifyContent}
  ${flexDirection}
  ${color}
`;

let Col = p => <Row flexDirection="column" {...p} />;

export { Box, Row, Col };
