import React from 'react';
import Dropzone from 'react-dropzone';

import { ModelSingleContext } from './ModelSingleController';
import { Pill as NavPill } from 'theme/adminNavStyles';
import { Pill } from 'theme/adminControlsStyles';
import base from 'theme';
import { Row, Col } from 'theme/system';
import { FormHeader } from 'theme/adminModelFormStyles';
import DragNDropIcon from 'icons/DragNDrop';
import PlusIcon from 'icons/PlusIcon';
import config from '../config';

const {
  keyedPalette: { frenchGrey, lightPorcelain, mineShaft, porcelain },
  fonts: { libreFranklin, openSans },
} = base;

const ImagePreview = ({ file_id, name, preview }) => (
  <Col
    css={`
      font: ${openSans};
      font-size: 13px;
      border: 1px solid ${porcelain};
      width: 260px;
      align-items: center;
      padding: 5px;
      margin-right: 15px;
    `}
  >
    <img
      src={preview ? preview : `${config.urls.cmsBase}/images/${file_id}`}
      alt={`File: ${name}`}
      height="155"
      width="250"
    />`
    <b
      css={`
        align-self: start;
      `}
    >
      {name}
    </b>
  </Col>
);

const ImageGallery = ({ acceptedFiles }) => (
  <>
    {acceptedFiles.map(({ _id, name, preview }) => (
      <ImagePreview key={_id} {...{ file_id: _id, name, preview }} />
    ))}
  </>
);

let dropzoneRef;
const ImageDropper = ({ enqueueImages, display }) => (
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
    onDrop={(acceptedFiles, rejectedFiles) => {
      console.log('todo notify rejectedFiles');
      console.log(rejectedFiles);
      enqueueImages(acceptedFiles);
    }}
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
          imageUploadQueue,
          data: {
            response: { files = [] },
          },
        },
        enqueueImages,
        imageFiles = [...imageUploadQueue, ...files],
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
              {!!imageFiles.length && ' Drag and drop images to reorder them within the gallery.'}
            </div>
            {!!imageFiles.length && (
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
          <Row p={18}>
            {!!imageFiles.length && <ImageGallery acceptedFiles={imageFiles} />}
            <ImageDropper {...{ display: !imageFiles.length, imageFiles, enqueueImages }} />
          </Row>
        </>
      )}
    </ModelSingleContext.Consumer>
  </>
);
