import React from 'react';
import Component from 'react-component-component';

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

        const onFilterValueChange = () => console.log('hiiii');
        const onPageChange = () => console.log('byyeee');
        const onPageSizeChange = () => console.log('ookkkiii');

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
                          component: <BulkUploader type={'variant'} />,
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
