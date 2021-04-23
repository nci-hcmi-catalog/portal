import React, { useContext, useState } from 'react';

import { ModalStateContext } from 'providers/ModalState';

import { ButtonPill } from 'theme/adminControlsStyles';
import { ConfirmationPrompt, Footer } from 'theme/adminModalStyles';

const DoubleConfirmationFooter = ({
  onCancel,
  onDoubleConfirm,
  onSingleConfirm,
  doubleConfirmPrompt = 'Are you sure?',
  singleConfirmLabel = 'Confirm',
  doubleConfirmLabel = 'Confirm',
  singleConfirmCancelLabel = 'Cancel',
  doubleConfirmCancelLabel = 'Cancel',
  disabled,
}) => {
  let modalState = useContext(ModalStateContext);
  let [singleConfirm, setSingleConfirm] = useState(false);

  const onSingleConfirmClick = () => {
    setSingleConfirm(true);

    if (onSingleConfirm) {
      onSingleConfirm();
    }
  };

  const onDoubleConfirmClick = () => {
    if (onDoubleConfirm) {
      onDoubleConfirm();
    }
  };

  const onSingleCancelClick = () => {
    modalState.setModalState({ component: null });

    if (onCancel) {
      onCancel();
    }
  };

  const onDoubleCancelClick = () => {
    setSingleConfirm(false);
  };

  return (
    <Footer
      css={`
        margin-bottom: 12px;
      `}
    >
      {
        !singleConfirm ? (
          <>
            <ButtonPill
              primary
              marginRight={`10px`}
              onClick={onSingleConfirmClick}
              disabled={disabled}
            >
              {singleConfirmLabel}
            </ButtonPill>
            <ButtonPill secondary onClick={onSingleCancelClick}>
              {singleConfirmCancelLabel}
            </ButtonPill>
          </>
        ) : (
          <>
            <ConfirmationPrompt>{doubleConfirmPrompt}</ConfirmationPrompt>
            <ButtonPill
              primary
              marginRight={`10px`}
              onClick={onDoubleConfirmClick}
              disabled={disabled}
            >
              {doubleConfirmLabel}
            </ButtonPill>
            <ButtonPill secondary onClick={onDoubleCancelClick}>
              {doubleConfirmCancelLabel}
            </ButtonPill>
          </>
      )}
    </Footer>
  );
};

export default DoubleConfirmationFooter;
