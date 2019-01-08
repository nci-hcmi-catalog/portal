import React from 'react';
import styled from 'react-emotion';
import {
  space,
  width,
  minWidth,
  maxWidth,
  fontSize,
  color,
  flex,
  alignItems,
  justifyContent,
  flexDirection,
  variant,
} from 'styled-system';

const buttons = variant({
  prop: 'buttons',
  key: 'buttons',
});

let Box = styled('div')`
  ${space}
  ${width}
  ${fontSize}
  ${color}
`;

let Row = styled('div')`
  display: flex;
  ${flex}
  ${space}
  ${alignItems}
  ${justifyContent}
  ${flexDirection}
  ${color}
  ${width}
  ${minWidth}
  ${maxWidth}
`;

let Col = p => <Row flexDirection="column" {...p} />;

let Button = styled('button')`
  ${buttons};
`;

export { Box, Row, Col, Button };
