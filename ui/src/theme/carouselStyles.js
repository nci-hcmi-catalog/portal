import styled from 'react-emotion';
import StyledSlider from 'react-styled-carousel';
import base from 'theme';

const {
  keyedPalette: { brandPrimary, frenchGrey },
} = base;

export const ModelSlider = styled(StyledSlider)`
  position: relative;
`;

export const ModelSlide = styled('div')`
  position: relative;
  label: model-slide;

  > img {
    display: block;
    padding: 20px 0 16px;
    height: 100%;
    width: 100%;
    object-fit: contain;
    margin: 0 auto;
    max-height: 366px;
  }
`;

const PaddedArrow = styled('button')`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: ${brandPrimary};
  position: absolute;
  width: 30px;
  height: 60px;
  background-color: transparent;
  top: calc(50% - 30px);
  border: 0;
  margin: 0;
  padding: 0;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  outline: none;
  z-index: 1;
  &:before {
    content: '';
    width: 10px;
    height: 10px;
    border-top: solid 2px ${({ disabled }) => (disabled ? frenchGrey : brandPrimary)};
    border-right: solid 2px ${({ disabled }) => (disabled ? frenchGrey : brandPrimary)};
  }
  &:after {
    content: '';
    position: absolute;
  }
`;

export const LeftArrow = styled(PaddedArrow)`
  left: 0px;
  label: left-arrow;
  &:before {
    left: 1px;
    transform: rotate(-135deg);
  }
`;

export const RightArrow = styled(PaddedArrow)`
  right: 0px;
  label: right-arrow;
  &:before {
    right: 1px;
    transform: rotate(45deg);
  }
`;
