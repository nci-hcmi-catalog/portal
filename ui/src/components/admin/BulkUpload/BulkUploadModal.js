import React from 'react';
import {
  BulkUploadMain,
  BulkUploadHeader,
  CloseModal,
  BulkUploadTitle,
  BulkUploadContent,
  SectionDivider,
} from 'theme/adminBulkUploadStyles';
import SequentialTabs from './SequentialTabs';
import SequentialTab from './SequentialTab';
import BulkUploadResult from './BulkUploadResult';
import BulkUploadInput from './BulkUploadInput';
import Component from 'react-component-component';
import BulkUploadControls from './BulkUploadControls';
import config from '../config';
import { get } from '../services/Fetcher';

const getSheetId = sheetURL => {
  // example sheeturl:
  // https://docs.google.com/spreadsheets/d/18ZWXfsadfasdfP8NV5g_flmEhBkXgsKEJT6y9
  // i Ht0X/edit#gid=0
  let sheetUrlParts = `${sheetURL}/`.match(/(\/d\/)(.*?)(\/)/g) || [];
  // use replace because javascript doesnt have positive lookahead ?<=
  return sheetUrlParts.length > 0 ? sheetUrlParts[0].replace('/d/', '').replace('/', '') : '';
};
const uploadGoogleSheet = async (type, sheetURL) => {
  const sheetID = getSheetId(sheetURL);
  const uploadURL = config.urls.cmsBase + `/sync-mongo/${sheetID}/Real Data Collection`;
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
    }}
    didUpdate={async ({ state, setState }) => {
      try {
        if (state.uploadingGoogleSheet) {
          const uploadSheetResult = await uploadGoogleSheet(type, state.sheetsURL);
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
    {({ state: { selectedTab, sheetsURL, uploadResults }, setState }) => {
      const onSheetsURLChange = newURL => setState({ sheetsURL: newURL });
      const onUploadClick = () => setState({ uploadingGoogleSheet: true });
      return (
        <BulkUploadMain>
          <BulkUploadHeader>
            <BulkUploadTitle>{`Bulk ${type} Upload`}</BulkUploadTitle>
            <CloseModal />
          </BulkUploadHeader>
          <SectionDivider />
          <BulkUploadContent>
            <SequentialTabs
              {...props}
              selectedTab={selectedTab}
              onSelectionChanged={index => setState({ selectedTab: index })}
            >
              <SequentialTab
                title={`Step 1:Submit ${type} list`}
                component={
                  <BulkUploadInput
                    {...{
                      onSheetsURLChange,
                      sheetsURL,
                      type,
                    }}
                    {...props}
                  />
                }
              />
              <SequentialTab
                title={`Step 2:Validate and finalize`}
                component={
                  <BulkUploadResult
                    {...props}
                    {...{
                      type,
                      uploadResults,
                    }}
                  />
                }
              />
            </SequentialTabs>
            <BulkUploadControls {...props} controlSet={selectedTab} {...{ onUploadClick }} />
          </BulkUploadContent>
        </BulkUploadMain>
      );
    }}
  </Component>
);

export default UploadModal;
