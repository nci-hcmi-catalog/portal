import styled from 'react-emotion';
import base from 'theme';

const {
  fonts: { libreFranklin },
  keyedPalette: { pelorousapprox, valencia, sienna, white },
} = base;

const pillBlue = pelorousapprox;
const pillRed = valencia;
const pillOrange = sienna;

const PillBase = styled('div')`
  font-family: ${libreFranklin};
  text-transform: uppercase;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  text-align: center;
  color: ${white};
  background: ${props => (props.primary ? pillRed : props.warning ? pillOrange : pillBlue)};
  margin-left: ${props => (props.marginLeft ? props.marginLeft : '0')};
  margin-right: ${props => (props.marginRight ? props.marginRight : '0')};
`;

export const SmallPill = styled(PillBase)`
  font-size: 10px;
  line-height: 22px;
  border-radius: 11px;
  padding: 0 12px;
  label: admin-pill-small;
`;

export const Pill = styled(PillBase)`
  font-size: 12px;
  font-weight: 500;
  line-height: 35px;
  border-radius: 10px;
  padding: 0 18px;
  label: admin-pill;
`;
