import React from 'react';
import Dropzone from 'react-dropzone';
import Component from 'react-component-component';

import { ModelSingleContext } from './ModelSingleController';
import { Pill as NavPill } from 'theme/adminNavStyles';
import { Pill } from 'theme/adminControlsStyles';
import base from 'theme';
import { Row, Col } from 'theme/system';
import { FormHeader } from 'theme/adminModelFormStyles';
import { Field, Formik } from 'formik';
import { FormInput } from 'components/FormComponents';
import { ModelForm } from 'theme/adminModelFormStyles';

import DragNDropIcon from 'icons/DragNDrop';
import PlusIcon from 'icons/PlusIcon';
import TrashIcon from 'icons/TrashIcon';
import AdminEditPencilIcon from 'icons/AdminEditPencilIcon';
import config from '../config';

const {
  keyedPalette: { frenchGrey, lightPorcelain, mineShaft, porcelain, silver },
  fonts: { libreFranklin, openSans },
} = base;

const ImagePreview = ({ file, queuedForDelete, onDelete }) => (
  <Component initialState={{ editing: false }}>
    {({ state: { editing }, setState }) => (
      <Col
        css={`
          font: ${openSans};
          font-size: 13px;
          border: 1px solid ${porcelain};
          width: 260px;
          align-items: center;
          padding: 5px;
          margin-right: 15px;
          margin-top: 15px;
          position: relative;
          opacity: ${queuedForDelete ? 0.5 : 1};
        `}
      >
        <img
          src={file.preview ? file.preview : `${config.urls.cmsBase}/images/${file._id}`}
          alt={`File: ${file.name}`}
          height="155"
          width="250"
        />
        <Row
          css={`
            position: absolute;
            right: 10px;
            top: 10px;
            opacity: 0;
            width: 100%;
            justify-content: flex-end;
            &:hover {
              opacity: 1;
            }
          `}
        >
          {!queuedForDelete && (
            <NavPill
              css={`
                padding: 0;
                width: 32px;
                height: 32px;
                margin-right: 5px;
              `}
            >
              <AdminEditPencilIcon
                css={`
                  margin-right: 0;
                  height: 17px;
                `}
                onClick={() => setState({ editing: !editing })}
              />
            </NavPill>
          )}
          <NavPill
            css={`
              padding: 0;
              width: 32px;
              height: 32px;
            `}
            onClick={() => onDelete(file._id)}
          >
            {queuedForDelete ? (
              <PlusIcon
                fill="#900000"
                css={`
                  margin-right: 0;
                  height: 17px;
                `}
              />
            ) : (
              <TrashIcon
                css={`
                  margin-right: 0;
                  height: 17px;
                `}
              />
            )}
          </NavPill>
        </Row>
        <Col
          css={`
            align-self: start;
            ul {
              list-style: none;
              padding-left: 0;
            }
          `}
        >
          <Formik
            initialValues={{ name: '', scale_bar_length: 1, magnification: 0, passage_number: 0 }}
            onSubmit={(values, actions) => {
              console.log(values);
            }}
            render={({ values }) => (
              <ModelForm>
                <ul>
                  <li>
                    <b>{file.name}</b>
                    {editing && <Field name="name" component={FormInput} />}
                  </li>
                  <li>
                    Scale-bar length:
                    {editing && (
                      <Field name="scale_bar_length" type="number" step={1} component={FormInput} />
                    )}
                    {file.scale_bar_length}
                  </li>
                  <li>
                    Magnification: {file.magnification}
                    {editing && (
                      <Field name="magnification" type="number" step={1} component={FormInput} />
                    )}
                  </li>
                  <li>
                    Passage Number: {file.passage_number}
                    {editing && (
                      <Field name="passage_number" type="number" step={1} component={FormInput} />
                    )}
                  </li>
                </ul>
              </ModelForm>
            )}
          />
          <div
            css={`
              color: ${silver};
            `}
          >
            {queuedForDelete && 'Will delete on publish'}
          </div>
        </Col>
      </Col>
    )}
  </Component>
);

const ImageGallery = ({ acceptedFiles, toDeleteFiles, onDelete }) => (
  <>
    {acceptedFiles.map(file => (
      <ImagePreview
        queuedForDelete={toDeleteFiles.map(({ _id }) => _id).includes(file._id)}
        key={file._id}
        file={file}
        onDelete={onDelete}
      />
    ))}
  </>
);

let dropzoneRef;
const ImageDropper = ({ onDrop, display }) => (
  <Dropzone
    ref={node => {
      dropzoneRef = node;
    }}
    css={`
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
      css={`
        background: ${lightPorcelain};
        height: 100%;
        font-family: ${libreFranklin};
        font-weight: 500;
        color: ${mineShaft};
        font-size: 20px;
        align-items: center;
        justify-content: center;
      `}
    >
      <DragNDropIcon
        css={`
          height: 53px;
          padding-bottom: 10px;
        `}
      />
      Drag and drop your image(s) here
      <span
        css={`
          font-size: 14px;
          padding: 10px 0;
        `}
      >
        or
      </span>
      <NavPill>Browse Your Files</NavPill>
    </Col>
  </Dropzone>
);

export default () => (
  <>
    <FormHeader>
      <h2>Model Images</h2>
    </FormHeader>
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
            p={18}
            css={`
              justify-content: space-between;
            `}
          >
            <div>
              Upload images in jpeg, tiff, png or svg formats.
              {!!files.length && ' Drag and drop images to reorder them within the gallery.'}
            </div>
            {!!files.length && (
              <Pill
                css={`
                  align-self: right;
                `}
                primary
                onClick={() => {
                  dropzoneRef.open();
                }}
              >
                <PlusIcon
                  css={`
                    height: 16px;
                  `}
                />Add Images
              </Pill>
            )}
          </Row>
          <Row
            p={18}
            css={`
              flex-wrap: wrap;
            `}
          >
            {!!files.length && (
              <ImageGallery
                acceptedFiles={files}
                toDeleteFiles={files.filter(file => file.marked_for_deletion)}
                onDelete={toDeleteFileId => {
                  const toDeleteFile = files.find(f => f._id === toDeleteFileId);
                  console.log(toDeleteFile);
                  saveForm({
                    values,
                    images: [
                      ...files.filter(f => f._id !== toDeleteFileId),
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
                console.log('todo notify rejectedFiles');
                console.log(rejectedFiles);
                const uploaded = await uploadImages(acceptedFiles);
                saveForm({
                  values,
                  images: [...files, ...uploaded],
                  successNotification: {
                    type: 'success',
                    message: `${Object.keys(uploaded).length} image(s) uploaded!`,
                    details:
                      'Image(s) have been succesfully saved to the model, however not yet published.',
                  },
                });
              }}
              display={!files.length}
            />
          </Row>
        </>
      )}
    </ModelSingleContext.Consumer>
  </>
);
