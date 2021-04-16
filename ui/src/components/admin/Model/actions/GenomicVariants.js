import React from 'react';

import { get, post } from './../../services/Fetcher';
import config from './../../config';

import { MessageLink } from 'theme/adminNotificationStyles';

const GENOMIC_VARIANTS_URL = `${config.urls.cmsBase}/genomic-variants`;
const FILE_PAGE_URL_BASE = 'https://portal.gdc.cancer.gov/files';
const CASE_URL_BASE = 'https://portal.gdc.cancer.gov/cases';

export const GENOMIC_VARIANTS_IMPORT_ERRORS = {
  multipleMaf: 'MULTIPLE_MAFS',
  noMaf: 'NO_MAFS',
  modelNotFound: 'MODEL_NOT_FOUND',
};

export const MultipleMafError = ({ files }) => {
  return (files || [])
    .map((file, index, array) => {
      const fileUrl = `${FILE_PAGE_URL_BASE}/${file.fileId}`;
      return index === array.length - 1 ? (
        <>
          {`and `}
          <MessageLink href={fileUrl} target="_blank" rel="noopener noreferrer">
            {file.filename}
          </MessageLink>
          {`. `}
        </>
      ) : (
        <>
          <MessageLink to={fileUrl} target="_blank" rel="noopener noreferrer">
            {file.filename}
          </MessageLink>
          {`, `}
        </>
      );
    })
    .concat('Please investigate with the GDC team and try again later.');
};

export const NoMafError = ({ caseId, modelName }) => {
  const caseUrl = `${CASE_URL_BASE}/${caseId}`;

  return (
    <>
      <MessageLink href={caseUrl} target="_blank" rel="noopener noreferrer">
        {modelName}
      </MessageLink>
      {` was found on GDC but no open Next Generation Cancer Model MAF files were found.`}
    </>
  );
};

export const importGenomicVariants = async modelName => {
  const url = `${GENOMIC_VARIANTS_URL}/import/${modelName}`;
  return post({ url });
};

export const importBulkGenomicVariants = async models => {
  const url = `${GENOMIC_VARIANTS_URL}/import/bulk`;
  return post({
    url,
    data: {
      models
    },
  });
};

export const auditGenomicVariants = async () => {
  const url = `${GENOMIC_VARIANTS_URL}/audit`;
  return get({
    url,
  });
}

export const checkGenomicVariants = async models => {
  const url = `${GENOMIC_VARIANTS_URL}/audit`;
  return post({
    url,
    data: {
      models
    },
  });
}

export const clearGenomicVariants = async modelName => {
  return new Promise(async (resolve, reject) => {
    const url = `${GENOMIC_VARIANTS_URL}/clear/${modelName}`;
    await post({ url })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const checkImportStatus = async () => {
  return new Promise(async (resolve, reject) => {
    const url = `${GENOMIC_VARIANTS_URL}/status`;
    await get({ url })
      .then(res => {
        resolve(res.data.imports);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const acknowledgeImportStatus = async modelName => {
  return new Promise(async (resolve, reject) => {
    const url = `${GENOMIC_VARIANTS_URL}/acknowledge/${modelName}`;
    await post({ url })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
};
