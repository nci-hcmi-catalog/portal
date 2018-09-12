import React from 'react';
import Component from 'react-component-component';

import { ModelSingleContext } from './ModelSingleController';
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

export default ({ data: { name, variants } }) => {
  return (
    <Component
      initialState={{
        data: variants.map(variant => ({
          id: variant._id,
          variant_name: variant.variant.name,
          variant_type: variant.variant.type,
          assessment_type: variant.assessment_type,
          expression_level: variant.expression_level,
        })),
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
                <ModelSingleContext.Consumer>
                  {({ attachVariants }) => (
                    <ModalStateContext.Consumer>
                      {modalState => (
                        <Pill
                          primary
                          marginRight="10px"
                          onClick={() =>
                            modalState.setModalState({
                              component: (
                                <BulkUploader
                                  type={'variant'}
                                  onUpload={(sheetsURL, overwrite) =>
                                    attachVariants(sheetsURL, overwrite, name)
                                  }
                                />
                              ),
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
                  )}
                </ModelSingleContext.Consumer>
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
