import React, { useContext } from 'react';
import { css } from '@emotion/react';
import Dropzone from 'react-dropzone';
import Component from 'react-component-component';

import { ModelSingleContext } from './ModelSingleController';
import { NotificationsContext, NOTIFICATION_TYPES } from '../Notifications';
import { ButtonPill } from 'theme/adminControlsStyles';
import base from 'theme';
import { Row, Col } from 'theme/system';
import { FormContainer } from 'theme/adminFormStyles';
import { Field, Formik } from 'formik';
import { FormInput } from 'components/FormComponents';

import DragNDropIcon from 'icons/DragNDrop';
import PlusIcon from 'icons/PlusIcon';
import TrashIcon from 'icons/TrashIcon';
import EditIcon from 'icons/EditIcon';
import SaveIcon from 'icons/SaveIcon';
import TabHeader from './TabHeader';
const {
  keyedPalette: { athensGray, black, crimson, elm, frenchGrey, mischka },
  fonts: { openSans },
} = base;

const ImageMetaDataForm = ({ file, editing, setPreviewState, onMetaDataSave }) => (
  <Formik
    initialValues={{
      file_name: file.file_name || '',
      scale_bar_length: file.scale_bar_length || 0,
      magnification: file.magnification || 0,
      passage_number: file.passage_number || 0,
    }}
    onSubmit={values => {
      onMetaDataSave({ fileId: file.file_id, metaData: values });
      setPreviewState({ editing: !editing });
    }}
    render={({ handleSubmit }) => (
      <FormContainer
        css={css`
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        `}
      >
        <ul>
          <li>
            {!editing ? <b>{file.file_name}</b> : 'Description:'}
            {editing && <Field name="file_name" component={FormInput} />}
          </li>
          <li>
            Scale-bar length: {!editing && file.scale_bar_length}
            {editing && (
              <Field name="scale_bar_length" type="number" step={1} component={FormInput} />
            )}
          </li>
          <li>
            Magnification: {!editing && file.magnification}
            {editing && <Field name="magnification" type="number" step={1} component={FormInput} />}
          </li>
          <li>
            Passage Number: {!editing && file.passage_number}
            {editing && (
              <Field name="passage_number" type="number" step={1} component={FormInput} />
            )}
          </li>
        </ul>
        {editing && (
          <ButtonPill
            primary
            css={css`
              margin-right: 10px;
            `}
            onClick={handleSubmit}
          >
            <SaveIcon />
            Save
          </ButtonPill>
        )}
      </FormContainer>
    )}
  />
);
const ImagePreview = ({ file, queuedForDelete, onDelete, onMetaDataSave }) => (
  <Component initialState={{ editing: false, showControls: false }}>
    {({ state: { editing, showControls }, setState }) => (
      <Col
        css={css`
          font: ${openSans};
          font-size: 12px;
          border: 1px solid ${mischka};
          width: 225px;
          align-items: center;
          padding: 5px;
          margin-right: 15px;
          margin-bottom: 15px;
          position: relative;
          opacity: ${queuedForDelete ? 0.5 : 1};
        `}
        onMouseOver={() => setState({ showControls: true })}
        onFocus={() => setState({ showControls: true })}
        onMouseOut={() => setState({ showControls: false })}
        onBlur={() => setState({ showControls: false })}
      >
        <img
          src={file.preview ? file.preview : file.file_url}
          alt={`File: ${file.file_name}`}
          height="163"
          width="215"
        />
        <Row
          css={css`
            position: absolute;
            right: 10px;
            top: 10px;
            opacity: ${showControls && !editing ? 1 : 0};
            width: 100%;
            justify-content: flex-end;
          `}
        >
          {!queuedForDelete && (
            <ButtonPill
              aria-label="Edit"
              secondary
              css={css`
                margin-right: 10px;
                padding: 5px 10px;
              `}
            >
              <EditIcon
                width={'14px'}
                height={'14px'}
                fill={elm}
                css={css`
                  margin: 0;
                `}
                onClick={() => setState({ editing: !editing })}
              />
            </ButtonPill>
          )}
          <ButtonPill
            aria-label={queuedForDelete ? 'Undo Delete' : 'Delete'}
            secondary
            css={css`
              padding: 5px 10px;
            `}
            onClick={() => onDelete(file.file_id)}
          >
            {queuedForDelete ? (
              <PlusIcon
                fill={crimson}
                width={'14px'}
                height={'14px'}
                css={css`
                  margin: 0;
                `}
              />
            ) : (
              <TrashIcon width={'14px'} height={'14px'} css={css`margin: 0;`} />
            )}
          </ButtonPill>
        </Row>
        <Col
          css={css`
            align-self: start;
            ul {
              list-style: none;
              margin: 0;
              padding: 10px;
            }
          `}
        >
          <ImageMetaDataForm
            file={file}
            editing={editing}
            setPreviewState={setState}
            onMetaDataSave={onMetaDataSave}
          />
          <div
            css={css`
              color: ${crimson};
              padding-left: 10px;
            `}
          >
            {queuedForDelete && 'Will delete on publish'}
          </div>
        </Col>
      </Col>
    )}
  </Component>
);

const ImageGallery = ({ acceptedFiles, toDeleteFiles, onDelete, onMetaDataSave }) => (
  <>
    {acceptedFiles.map(file => (
      <ImagePreview
        queuedForDelete={toDeleteFiles.map(({ file_id }) => file_id).includes(file.file_id)}
        key={file.file_id}
        file={file}
        onDelete={onDelete}
        onMetaDataSave={onMetaDataSave}
      />
    ))}
  </>
);

let dropzoneRef;
const ImageDropper = ({ onDrop, display }) => (
  <Dropzone
    inputProps={{ 'aria-label': `Drop images here` }}
    ref={node => {
      dropzoneRef = node;
    }}
    css={css`
      display: ${display ? 'block' : 'none'};
      border: 2px dashed ${frenchGrey};
      border-radius: 3px;
      width: 100%;
      height: 250px;
      padding: 5px;
    `}
    accept="image/jpg, image/jpeg, image/tiff, image/png, image/svg"
    onDrop={onDrop}
  >
    <Col
      css={css`
        background: ${athensGray};
        height: 100%;
        font-family: ${openSans};
        font-weight: bold;
        color: ${black};
        font-size: 14px;
        line-height: 1.71;
        align-items: center;
        justify-content: center;
        text-align: center;
      `}
    >
      <DragNDropIcon
        height={'36px'}
        css={css`
          margin-bottom: 8px;
        `}
      />
      Drag and drop your image(s) here <br /> or
      <ButtonPill
        secondary
        css={css`
          margin-top: 8px;
        `}
      >
        Browse Your Files
      </ButtonPill>
    </Col>
  </Dropzone>
);

export default ({ data: { updatedAt } }) => {
  const { appendNotification } = useContext(NotificationsContext);
  return (
    <>
      <TabHeader title={`Model Images`} updatedAt={updatedAt} />
      <ModelSingleContext.Consumer>
        {({
          state: {
            form: { values },
            data: {
              response: { files = [] },
            },
          },
          uploadImages,
          saveForm,
        }) => (
          <>
            <Row
              p={'24px 10px 22px'}
              css={css`
                justify-content: space-between;
                align-items: center;
                font-size: 14px;
              `}
            >
              <div>Upload images in jpeg, tiff, png or svg formats.</div>
              <ButtonPill
                css={css`
                  align-self: right;
                `}
                primary
                onClick={() => {
                  dropzoneRef.open();
                }}
              >
                <PlusIcon />
                Add Images
              </ButtonPill>
            </Row>
            <Row
              p={'0 10px'}
              css={css`
                flex-wrap: wrap;
              `}
            >
              {!!files.length && (
                <ImageGallery
                  acceptedFiles={files}
                  toDeleteFiles={files.filter(file => file.marked_for_deletion)}
                  onMetaDataSave={({ fileId, metaData }) => {
                    saveForm({
                      values,
                      images: files.map(f => (f.file_id === fileId ? { ...f, ...metaData } : f)),
                      successNotification: {
                        type: 'success',
                        message: `Image Metadata Saved!`,
                        details:
                          'Image metadata has been successfully saved, however not yet published.',
                      },
                    });
                  }}
                  onDelete={toDeleteFileId => {
                    const toDeleteFile = files.find(f => f.file_id === toDeleteFileId);
                    saveForm({
                      values,
                      images: [
                        ...files.filter(f => f.file_id !== toDeleteFileId),
                        {
                          ...toDeleteFile,
                          marked_for_deletion: !toDeleteFile.marked_for_deletion,
                        },
                      ],
                      successNotification: null,
                    });
                  }}
                />
              )}
              <ImageDropper
                onDrop={async (acceptedFiles, rejectedFiles) => {
                  if (rejectedFiles.length) {
                    await appendNotification({
                      type: NOTIFICATION_TYPES.ERROR,
                      message: 'Image Upload Error',
                      details: [
                        'The following image(s) were not an acceptable file type: ',
                        rejectedFiles.reduce((listStr, file, i, fileList) => {
                          listStr += fileList[i + 1] ? `${file.name}, ` : `${file.name}. `;
                          return listStr;
                        }, ''),
                        'Please ensure that images are jpeg, tiff, png, or svg only.',
                      ],
                      timeout: false,
                    });
                    return;
                  }
                  const uploaded = await uploadImages(acceptedFiles);
                  if (uploaded.length > 0) {
                    saveForm({
                      values,
                      images: [...files, ...uploaded],
                      successNotification: {
                        type: 'success',
                        message: `${Object.keys(uploaded).length} image(s) uploaded!`,
                        details:
                          'Image(s) have been successfully saved to the model, however not yet published.',
                      },
                    });
                  }
                }}
                display={!files.length}
              />
            </Row>
          </>
        )}
      </ModelSingleContext.Consumer>
    </>
  );
};
