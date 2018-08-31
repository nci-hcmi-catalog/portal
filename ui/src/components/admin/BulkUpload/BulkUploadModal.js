import React from 'react';
import Component from 'react-component-component';

import config from '../config';
import { get } from '../services/Fetcher';

import SequentialTabs from './SequentialTabs';
import SequentialTab from './SequentialTab';
import BulkUploadResult from './BulkUploadResult';
import BulkUploadInput from './BulkUploadInput';
import BulkUploadControls from './BulkUploadControls';

import { ModalWrapper, Header, Title, CloseModal, Content } from 'theme/adminModalStyles';

const getSheetId = sheetURL => {
  // example sheeturl:
  // https://docs.google.com/spreadsheets/d/18ZWXfsadfasdfP8NV5g_flmEhBkXgsKEJT6y9
  // i Ht0X/edit#gid=0
  let sheetUrlParts = `${sheetURL}/`.match(/(\/d\/)(.*?)(\/)/g) || [];
  // use replace because javascript doesnt have positive lookahead ?<=
  return sheetUrlParts.length > 0 ? sheetUrlParts[0].replace('/d/', '').replace('/', '') : '';
};
const uploadGoogleSheet = async (sheetURL, overwrite) => {
  const sheetID = getSheetId(sheetURL);
  const uploadURL =
    config.urls.cmsBase + `/sync-mongo/${sheetID}/Real Data Collection?overwrite=${overwrite}`;
  const gapi = global.gapi;
  // TODO: this assumes user is already logged in - create a prompt to let user
  // know to login if not already logged in
  const currentUser = gapi.auth2.getAuthInstance().currentUser.get();
  const googleAuthResponse = currentUser.getAuthResponse();
  return get({
    url: uploadURL,
    headers: {
      Authorization: JSON.stringify(googleAuthResponse),
    },
  });
};

//TODO: uploading animation and stream based upload response
const UploadModal = ({ type, ...props }) => (
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
          const uploadSheetResult = await uploadGoogleSheet(state.sheetsURL, state.overwrite);
          setState({
            uploadingGoogleSheet: false,
            selectedTab: 1,
            uploadResults: uploadSheetResult,
          });
        }
      } catch (err) {
        setState({ uploadingGoogleSheet: false, selectedTab: 1, uploadResults: err });
      }
    }}
  >
    {({ state: { selectedTab, sheetsURL, uploadResults, overwrite }, setState }) => {
      const onSheetsURLChange = newURL => setState({ sheetsURL: newURL });
      const onUploadClick = () => setState({ uploadingGoogleSheet: true });
      const onOverwriteChange = value => setState({ overwrite: value });
      return (
        <ModalWrapper>
          <Header>
            <Title>{`Bulk ${type} Upload`}</Title>
            <CloseModal />
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
          <BulkUploadControls {...props} controlSet={selectedTab} {...{ onUploadClick }} />
        </ModalWrapper>
      );
    }}
  </Component>
);

export default UploadModal;
