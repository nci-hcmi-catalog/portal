import React from 'react';

import { ModelSingleContext } from './ModelSingleController';
import { ModalStateContext } from 'providers/ModalState';

import BulkUploader from '../BulkUpload';
import { Toolbar, DataTable } from '../AdminTable';
import { ModelVariantColumns as tableColumns } from './ModelVariantColumns';

import AdminPlusIcon from '../../../icons/AdminPlusIcon';

import { AdminContainer, AdminHeader, AdminHeaderH3, AdminHeaderBlock } from 'theme/adminStyles';
import { FormHeader } from 'theme/adminFormStyles';
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
    <>
      <FormHeader>
        <h2>Variants</h2>
      </FormHeader>
      <ModelSingleContext.Consumer>
        {({
          state: { variantTable },
          attachVariants,
          variantTableControls: {
            onFilterValueChange,
            onPageChange,
            onPageSizeChange,
            toggleSelection,
            toggleAll,
          },
        }) => (
          <AdminContainer p="18px 42px">
            <AdminHeader>
              <AdminHeaderH3>
                {data.length > 0
                  ? 'Variant Data'
                  : 'Submit your variant data by selecting “Add Variants” and uploading a google sheet or a CSV file.'}
              </AdminHeaderH3>
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
                      <AdminPlusIcon width={16} height={16} css={'margin-right: 9px;'} />Add
                      Variants
                    </Pill>
                  )}
                </ModalStateContext.Consumer>
              </AdminHeaderBlock>
            </AdminHeader>
            {data.length > 0 && (
              <Table marginBottom="0">
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
            )}
          </AdminContainer>
        )}
      </ModelSingleContext.Consumer>
    </>
  );
};
