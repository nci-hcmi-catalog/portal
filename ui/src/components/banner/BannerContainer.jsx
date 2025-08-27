import React, { useState, useEffect } from 'react';

import Banner from './Banner';

const BannerContainer = () => {
  const [banners, setBanners] = useState([]);

  const bannerData = process.env.REACT_APP_BANNERS;

  useEffect(() => {
    if (bannerData) {
      try {
        const parsedBanners = JSON.parse(bannerData);
        setBanners(parsedBanners);
      } catch (e) {
        console.error('Failed to parse REACT_APP_BANNERS env var.');
      }
    }
  }, [bannerData]);

  return (
    <>
      {banners.map((banner, i) => (
        <Banner
          key={`banner-${i}`}
          type={banner.type}
          dismissible={banner.dismissible}
          title={banner.title}
          message={banner.message}
        />
      ))}
    </>
  );
};

export default BannerContainer;
