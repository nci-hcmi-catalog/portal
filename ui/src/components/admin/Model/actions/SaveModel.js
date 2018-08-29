import React from 'react';
import { ModelSingleContext } from '../ModelSingleController';
import { Pill } from 'theme/adminControlsStyles';
import AdminModelSaveIcon from 'icons/AdminModelSaveIcon';

export default props => (
  <ModelSingleContext.Consumer>
    {({
      state: {
        form: { values, isReadyToSave },
        data = { response: { files: [] } },
        ui: { activeTab },
      },
      saveForm,
      uploadImages,
    }) => (
      <Pill
        primary
        disabled={!isReadyToSave}
        onClick={async () => {
          if (isReadyToSave) {
            switch (activeTab) {
              case 'edit':
                saveForm({ values });
                break;
              case 'images':
                const uploadedImages = await uploadImages();
                saveForm({
                  values,
                  uploadedImages: {
                    ...data.response.files.reduce(
                      (acc, file) => ({ ...acc, [file._id]: { name: file.name, type: file.type } }),
                      {},
                    ),
                    ...uploadedImages,
                  },
                });
                break;
              default:
                break;
            }
          }
        }}
        {...props}
      >
        <AdminModelSaveIcon css={'margin-right: 8px;'} height={14} width={14} />Save
      </Pill>
    )}
  </ModelSingleContext.Consumer>
);
