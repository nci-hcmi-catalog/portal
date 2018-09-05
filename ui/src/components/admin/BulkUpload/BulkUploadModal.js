import React from 'react';
import Component from 'react-component-component';

import { ModalStateContext } from 'providers/ModalState';

import BulkUploadInput from './BulkUploadInput';
import BulkUploadControls from './BulkUploadControls';

import { ModalWrapper, Header, Title, CloseModal, Content } from 'theme/adminModalStyles';

//TODO: uploading animation and stream based upload response
const UploadModal = ({ type, onUpload, ...props }) => (
  <ModalStateContext.Consumer>
    {modalState => (
      <Component
        initialState={{
          selectedTab: 0,
          sheetsURL: '',
          uploadingGoogleSheet: false,
          uploadResults: {},
          overwrite: false,
        }}
        didUpdate={async ({ state, setState }) => {
          try {
            if (state.uploadingGoogleSheet) {
              const uploadSheetResult = await onUpload(state.sheetsURL, state.overwrite);
              setState({
                uploadingGoogleSheet: false,
                selectedTab: 1,
                uploadResults: uploadSheetResult,
              });
            }
          } catch (err) {
            setState({ uploadingGoogleSheet: false, selectedTab: 1 });
          }
        }}
      >
        {({ state: { selectedTab, sheetsURL, overwrite }, setState }) => {
          const onSheetsURLChange = newURL => setState({ sheetsURL: newURL });
          const onUploadClick = () => setState({ uploadingGoogleSheet: true });
          const onOverwriteChange = value => setState({ overwrite: value });
          return (
            <ModalWrapper>
              <Header>
                <Title>{`Bulk ${type} Upload`}</Title>
                <CloseModal onClick={() => modalState.setModalState({ component: null })} />
              </Header>
              <Content>
                <BulkUploadInput
                  {...{
                    onSheetsURLChange,
                    sheetsURL,
                    type,
                    overwrite,
                    onOverwriteChange,
                  }}
                  {...props}
                />
              </Content>
              <BulkUploadControls
                {...props}
                controlSet={selectedTab}
                {...{ onUploadClick, modalState }}
              />
            </ModalWrapper>
          );
        }}
      </Component>
    )}
  </ModalStateContext.Consumer>
);

export default UploadModal;
