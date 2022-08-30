/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useContext, useRef, useState } from 'react';
import { css } from '@emotion/react';

import { ModalStateContext } from 'providers/ModalState';
import { isTokenExpired } from '../helpers/googleAuth';

import BulkUploadInput from './BulkUploadInput';

import { ButtonPill } from 'theme/adminControlsStyles';
import { ModalWrapper, Header, Title, CloseModal, Content, Footer } from 'theme/adminModalStyles';

import { VARIANT_OVERWRITE_OPTIONS } from 'utils/constants';

const BulkUploadModal = ({ type, displayType, onUpload, backupURL, ...props }) => {
  const didMountRef = useRef(false);
  let modalState = useContext(ModalStateContext);
  let [sheetsURL, setSheetsURL] = useState('');
  let [uploadingGoogleSheet, setUploadingGoogleSheet] = useState(false);
  // eslint-disable-next-line no-unused-vars
  let [uploadResults, setUploadResults] = useState({});
  let [overwrite, setOverwrite] = useState(false);
  let [overwriteVariants, setOverwriteVariants] = useState(VARIANT_OVERWRITE_OPTIONS.cleanOnly);
  const [signedIn, setSignedIn] = useState(false);

  const onSheetsURLChange = (newURL) => setSheetsURL(newURL);
  const onUploadClick = () => setUploadingGoogleSheet(true);
  const onOverwriteChange = (value) => setOverwrite(value);
  const onOverwriteVariantsChange = (value) => setOverwriteVariants(value);

  const didUpdate = async () => {
    try {
      if (uploadingGoogleSheet) {
        const uploadSheetResult = await onUpload(sheetsURL, overwrite, overwriteVariants);

        await setUploadingGoogleSheet(false);
        await setUploadResults(uploadSheetResult);

        // Close modal
        modalState.setModalState({ component: null });
      }
    } catch (err) {
      await setUploadingGoogleSheet(false);

      // Close modal
      modalState.setModalState({ component: null });
    }
  };

  useEffect(() => {
    if (didMountRef && didMountRef.current) {
      didUpdate();
    } else {
      didMountRef.current = true;
    }
  }, [uploadingGoogleSheet]);

  const checkGoogleStatus = async () => {
    setSignedIn(!isTokenExpired());
  };

  useEffect(() => {
    checkGoogleStatus();
  }, []);

  return (
    <ModalWrapper>
      <Header>
        <Title>{`Bulk ${displayType || type} Upload`}</Title>
        <CloseModal onClick={() => modalState.setModalState({ component: null })} />
      </Header>
      <Content>
        <BulkUploadInput
          {...{
            onSheetsURLChange,
            sheetsURL,
            backupURL,
            type,
            displayType,
            overwrite,
            overwriteVariants,
            onOverwriteChange,
            onOverwriteVariantsChange,
            signedIn,
          }}
          {...props}
        />
      </Content>
      <Footer
        css={css`
          margin-bottom: 12px;
        `}
      >
        <ButtonPill
          primary
          marginRight={`10px`}
          onClick={onUploadClick}
          disabled={!signedIn || !sheetsURL}
        >
          Upload
        </ButtonPill>
        <ButtonPill secondary onClick={() => modalState.setModalState({ component: null })}>
          Cancel
        </ButtonPill>
      </Footer>
    </ModalWrapper>
  );
};

export default BulkUploadModal;
