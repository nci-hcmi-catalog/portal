import React from 'react';
import Component from 'react-component-component';

const UploadModal = ({ type, children, ...props }) => {
  return (
    <Component>{({ state, setState, ...props }) => <span>Bulk {type} Upload</span>}</Component>
  );
};

export default UploadModal;
