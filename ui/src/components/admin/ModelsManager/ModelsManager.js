import React from 'react';
import styled from 'react-emotion';
import { Row } from 'theme/system';
import ModelIcon from '../../../icons/ModelIcon';
import base from 'theme';

const Container = styled('div')`
  background-color: #f3f6f7;
  width: 100%;
  label: models-manager-main;
`;

const ContentPanel = styled('div')`
  padding: 10px 100px 10px 100px;
  width: 100%;
  display: flex;
  label: models-manager-content;
`;

const {
  palette,
  buttons: { pillBase },
} = base;

const ControlPill = styled('div')`
  ${pillBase};
  background-color: ${palette[11]};
  color: #ffffff;
  margin-left: auto;
  margin-left: ${props => props.last && '20px'};
  justify-content: space-between;
  label: models-manager-controls;
`;

const Title = styled('div')`
  display: flex;
  flex-direction: row;
  min-height: 50px;
  align-items: center;
`;

const content = () => {
  return (
    <Container>
      <ContentPanel>
        <Title>
          <ModelIcon height={30} width={30} />Model Management
        </Title>
        <ControlPill>Add Bulk</ControlPill>
        <ControlPill last>Add A Model</ControlPill>
      </ContentPanel>
    </Container>
  );
};

export default content;
