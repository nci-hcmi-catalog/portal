import { get, post } from './../../services/Fetcher';
import config from './../../config';

const GENOMIC_VARIANTS_URL = `${config.urls.cmsBase}/genomic-variants`;

export const importGenomicVariants = async modelName => {
  const url = `${GENOMIC_VARIANTS_URL}/import/${modelName}`;
  return post({ url });
};

export const importBulkGenomicVariants = async models => {
  const url = `${GENOMIC_VARIANTS_URL}/import/bulk`;
  return post({
    url,
    data: {
      models,
    },
  });
};

export const auditGenomicVariantsAllModels = async () => {
  const url = `${GENOMIC_VARIANTS_URL}/audit`;
  return get({
    url,
  });
};

export const auditGenomicVariantsSpecificModels = async models => {
  const url = `${GENOMIC_VARIANTS_URL}/audit`;
  return post({
    url,
    data: {
      models,
    },
  });
};

export const clearGenomicVariants = async modelName => {
  return new Promise(async (resolve, reject) => {
    const url = `${GENOMIC_VARIANTS_URL}/clear/${modelName}`;
    await post({ url })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.response ? err.response.data.error : err);
      });
  });
};

export const checkImportStatus = async () => {
  return new Promise(async (resolve, reject) => {
    const url = `${GENOMIC_VARIANTS_URL}/status`;
    await get({ url })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.response ? err.response.data.error : err);
      });
  });
};

export const acknowledgeImportStatus = async modelName => {
  return new Promise(async (resolve, reject) => {
    const url = `${GENOMIC_VARIANTS_URL}/acknowledge/${modelName}`;
    await post({ url })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.response ? err.response.data.error : err);
      });
  });
};

export const acknowledgeBulkImportStatus = async models => {
  return new Promise(async (resolve, reject) => {
    const url = `${GENOMIC_VARIANTS_URL}/acknowledge/bulk`;
    await post({
      url,
      data: {
        models,
      },
    })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.response ? err.response.data.error : err);
      });
  });
};

export const resolveMafFileConflict = async (modelName, fileId, filename) => {
  return new Promise(async (resolve, reject) => {
    const url = `${GENOMIC_VARIANTS_URL}/resolve`;
    await post({
      url,
      data: {
        name: modelName,
        fileId: fileId,
        filename: filename,
      },
    })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.response ? err.response.data.error : err);
      });
  });
};

export const stopAllImports = async () => {
  return new Promise(async (resolve, reject) => {
    const url = `${GENOMIC_VARIANTS_URL}/stop/all`;
    await post({ url })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.response ? err.response.data.error : err);
      });
  });
};

export const manualMafImport = async (modelName, fileId, filename) => {
  return new Promise(async (resolve, reject) => {
    const url = `${GENOMIC_VARIANTS_URL}/import/${modelName}`;
    await post({
      url,
      data: {
        fileId: fileId,
        filename: filename,
      },
    })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.response ? err.response.data.error : err);
      });
  });
};
