import styled from 'react-emotion';
import { Link } from 'react-router-dom';

import base from 'theme';

const {
  keyedPalette: { valencia },
  buttons: { pillBase },
} = base;

export const ControlPill = styled('span')`
  ${pillBase};
  background-color: ${valencia};
  color: #ffffff;
  margin-left: auto;
  margin-left: ${props => props.last && '20px'};
  justify-content: flex-end;
  text-decoration: none;
  label: admin-control-pill;
`;

export const ControlPillLink = ControlPill.withComponent(Link);

export const Controls = styled('div')`
  min-height: 50px;
  align-items: center;
  display: inherit;
  label: models-manager-controls;
`;
