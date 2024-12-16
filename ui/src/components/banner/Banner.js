import React, { useState } from 'react';

import DismissIcon from 'icons/DismissIcon';
import CriticalHexagonIcon from 'icons/CriticalHexagonIcon';
import WarningTriangleIcon from 'icons/WarningTriangleIcon';
import InfoCircleIcon from 'icons/InfoCircleIcon';
import { BANNER_TYPES } from 'utils/constants';

import {
  BannerWrapper,
  BannerContent,
  BannerText,
  BannerTitle,
  BannerMessage,
  DismissButton,
} from 'theme/bannerStyles';

const BannerIcon = ({ type, ...props }) => {
  switch (type) {
    case BANNER_TYPES.critical:
      return <CriticalHexagonIcon {...props} />;
    case BANNER_TYPES.warning:
      return <WarningTriangleIcon {...props} />;
    case BANNER_TYPES.info:
    default:
      return <InfoCircleIcon {...props} />;
  }
};

const Banner = ({ dismissible = true, message, title, type = BANNER_TYPES.info }) => {
  const [active, setActive] = useState(true);

  return active ? (
    <BannerWrapper type={type}>
      <BannerContent>
        <BannerIcon type={type} width="1.25rem" height="1.25rem" />
        <BannerText>
          {title && <BannerTitle>{title}</BannerTitle>}
          {message && <BannerMessage>{message}</BannerMessage>}
        </BannerText>
      </BannerContent>
      {dismissible && (
        <DismissButton onClick={() => setActive(false)}>
          <DismissIcon width="1.125rem" height="1.125rem" alt={'Dismiss banner'} />
        </DismissButton>
      )}
    </BannerWrapper>
  ) : (
    <></>
  );
};

export default Banner;
