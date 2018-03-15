import styled from 'react-emotion';
import {
  space,
  width,
  fontSize,
  color,
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

let Flex = styled.div`
  display: flex;
  ${space}
  ${alignItems}
  ${justifyContent}
  ${flexDirection}
`;

export { Box, Flex };
