import styled from 'react-emotion';
import base from 'theme';

const {
  keyedPalette: { valencia },
  buttons: { pillBase },
} = base;

export const ControlPill = styled('div')`
  ${pillBase};
  background-color: ${valencia};
  color: #ffffff;
  margin-left: auto;
  margin-left: ${props => props.last && '20px'};
  justify-content: space-between;
  label: admin-control-pill;
`;
