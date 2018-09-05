import React from 'react';
import Component from 'react-component-component';

import config from '../config';
import { get } from '../services/Fetcher';
import { getSheetObject } from '../helpers';
import { ModalStateContext } from 'providers/ModalState';

import BulkUploader from '../BulkUpload';
import Toolbar from '../AdminTable/data-driven/Toolbar';
import DataTable from '../AdminTable/data-driven/DataTable';
import { ModelVariantColumns as tableColumns } from './ModelVariantColumns';

import AdminPlusIcon from '../../../icons/AdminPlusIcon';

import { AdminContainer, AdminHeader, AdminHeaderBlock } from 'theme/adminStyles';
import { Pill } from 'theme/adminControlsStyles';
import { Table } from 'theme/adminTableStyles';
import { AdminModalStyle } from 'theme/adminModalStyles';

const getSheetData = async sheetURL => {
  const { spreadsheetId, sheetId } = getSheetObject(sheetURL);
  const uploadURL = config.urls.cmsBase + `/sheets-data/${spreadsheetId}/${sheetId}}`;
  const gapi = global.gapi;
  // TODO: this assumes user is already logged in - create a prompt to let user
  // know to login if not already logged in
  const currentUser = gapi.auth2.getAuthInstance().currentUser.get();
  const googleAuthResponse = currentUser.getAuthResponse();

  const response = await get({
    url: uploadURL,
    headers: {
      Authorization: JSON.stringify(googleAuthResponse),
    },
  });

  console.log(response);

  return response;
};

export default ({ data: { variants } }) => {
  return (
    <Component
      initialState={{
        data: variants,
        isLoading: false,
        page: 0,
        pageSize: 10,
        filterValue: '',
        rowCount: 10,
      }}
    >
      {({ state }) => {
        const type = 'Variants';

        // Need to add these (potentially in the imported component)
        const onFilterValueChange = () => console.log('onFilterValueChange');
        const onPageChange = () => console.log('onPageChange');
        const onPageSizeChange = () => console.log('onPageSizeChange');

        return (
          <AdminContainer>
            <AdminHeader>
              <h3>Variant Data</h3>
              <AdminHeaderBlock>
                <ModalStateContext.Consumer>
                  {modalState => (
                    <Pill
                      primary
                      marginRight="10px"
                      onClick={() =>
                        modalState.setModalState({
                          component: <BulkUploader type={'variant'} onUpload={getSheetData} />,
                          shouldCloseOnOverlayClick: true,
                          styles: AdminModalStyle,
                        })
                      }
                    >
                      <AdminPlusIcon width={16} height={16} css={'margin-right: 9px;'} />Add
                      Variants
                    </Pill>
                  )}
                </ModalStateContext.Consumer>
              </AdminHeaderBlock>
            </AdminHeader>
            <Table>
              <Toolbar {...{ state, type, onFilterValueChange }} />
              <DataTable {...{ state, tableColumns, onPageChange, onPageSizeChange }} />
            </Table>
          </AdminContainer>
        );
      }}
    </Component>
  );
};
