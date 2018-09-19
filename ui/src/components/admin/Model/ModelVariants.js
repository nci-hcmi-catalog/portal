import React from 'react';

import { ModelSingleContext } from './ModelSingleController';
import { ModalStateContext } from 'providers/ModalState';

import BulkUploader from '../BulkUpload';
import { Toolbar, DataTable } from '../AdminTable';
import { ModelVariantColumns as tableColumns } from './ModelVariantColumns';

import AdminPlusIcon from '../../../icons/AdminPlusIcon';

import { AdminContainer, AdminHeader, AdminHeaderBlock } from 'theme/adminStyles';
import { Pill } from 'theme/adminControlsStyles';
import { Table } from 'theme/adminTableStyles';
import { AdminModalStyle } from 'theme/adminModalStyles';

export default ({ data: { name, variants } }) => {
  const data = variants.map(variant => ({
    _id: variant._id,
    variant_name: variant.variant.name,
    variant_type: variant.variant.type,
    assessment_type: variant.assessment_type,
    expression_level: variant.expression_level,
  }));

  const type = 'Variants';

  return (
    <ModelSingleContext.Consumer>
      {({
        state: { variantTable },
        attachVariants,
        variantTableControlls: {
          onFilterValueChange,
          onPageChange,
          onPageSizeChange,
          toggleSelection,
          toggleAll,
        },
      }) => (
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
                    <AdminPlusIcon width={16} height={16} css={'margin-right: 9px;'} />Add Variants
                  </Pill>
                )}
              </ModalStateContext.Consumer>
            </AdminHeaderBlock>
          </AdminHeader>
          <Table>
            <Toolbar {...{ state: variantTable, type, onFilterValueChange }} />
            <DataTable
              {...{
                state: { ...variantTable, data },
                variantTable,
                tableColumns,
                onPageChange,
                onPageSizeChange,
                toggleSelection,
                toggleAll,
              }}
            />
          </Table>
        </AdminContainer>
      )}
    </ModelSingleContext.Consumer>
  );
};
