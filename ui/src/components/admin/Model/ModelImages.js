import React from 'react';
import Dropzone from 'react-dropzone';
import Component from 'react-component-component';

import { Pill } from 'theme/adminNavStyles';
import base from 'theme';
import { Row, Col } from 'theme/system';
import { FormHeader } from 'theme/adminModelFormStyles';
import DragNDropIcon from 'icons/DragNDrop';

const {
  keyedPalette: { frenchGrey, lightPorcelain, mineShaft, porcelain },
  fonts: { libreFranklin, openSans },
} = base;

const ImagePreview = ({ name, preview }) => (
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
    <img src={preview} alt={`File: ${name}`} height="155" width="250" />
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
    {acceptedFiles.map(({ name, preview }) => <ImagePreview key={name} {...{ name, preview }} />)}
  </>
);

const ImageDropper = ({ state, setState }) => (
  <Dropzone
    css={`
      border: 2px dashed ${frenchGrey};
      border-radius: 3px;
      width: 100%;
      height: 250px;
      padding: 5px;
    `}
    accept="image/jpg, image/jpeg, image/tiff, image/png, image/svg"
    onDrop={(acceptedFiles, rejectedFiles) =>
      setState({
        acceptedFiles: [...state.acceptedFiles, ...acceptedFiles],
        rejectedFiles: [...state.rejectedFiles, ...rejectedFiles],
      })
    }
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
      <Pill>Browse Your Files</Pill>
    </Col>
  </Dropzone>
);

export default () => (
  <>
    <FormHeader>
      <h2>Model Images</h2>
    </FormHeader>
    <Component initialState={{ acceptedFiles: [], rejectedFiles: [] }}>
      {({ state, setState }) => (
        <>
          <Row p={18}>
            Upload images in jpeg, tiff, png or svg formats.
            {!!state.acceptedFiles.length &&
              ' Drag and drop images to reorder them within the gallery.'}
          </Row>
          <Row p={18}>
            {!!state.acceptedFiles.length && <ImageGallery acceptedFiles={state.acceptedFiles} />}
            {console.log(state.acceptedFiles)}
            {!state.acceptedFiles.length && <ImageDropper {...{ state, setState }} />}
          </Row>
        </>
      )}
    </Component>
  </>
);
