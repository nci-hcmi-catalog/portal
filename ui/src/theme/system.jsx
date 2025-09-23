import styled from '@emotion/styled';
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
  system,
} from 'styled-system';

const buttons = system({
  prop: 'buttons',
  key: 'buttons',
});

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
  ${width}
  ${minWidth}
  ${maxWidth}
`;

let Col = (p) => <Row flexDirection="column" {...p} />;

let Button = styled.button`
  ${buttons};
`;

export { Box, Row, Col, Button };
