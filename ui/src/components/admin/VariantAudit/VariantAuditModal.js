import React, { useEffect, useContext, useRef, useState } from 'react';
import { css } from '@emotion/react';
import Spinner from 'react-spinkit';
import ReactTable from 'react-table';
import moment from 'moment-timezone';

import { auditGenomicVariantsAllModels } from 'components/admin/Model/actions/GenomicVariants';
import { ModalStateContext } from 'providers/ModalState';

import DoubleConfirmationFooter from 'components/modals/DoubleConfirmationFooter';
import DownloadIcon from 'icons/DownloadIcon';

import { BulkUploadContentBlock, BulkUploadTemplateLink, UploadContentHeading, UploadOverwrite } from 'theme/adminBulkUploadStyles';
import { RadioSelect } from 'theme/formComponentsStyles';
import { ButtonPill } from 'theme/adminControlsStyles';
import { ModalWrapper, Header, Title, CloseModal, Content, Footer, SpinnerBlock } from 'theme/adminModalStyles';
import searchStyles from 'theme/searchStyles';

import tsvDownloader, { convertColumnsToTableData } from 'utils/tsvDownloader';

const normalizeOption = option => (option === 'true' ? true : option === 'false' ? false : option);

const importAllOptions = [
  { label: `Import only new variant data for models with no current variant data.`, value: false },
  { label: `Import all variant data (note: this may take some time).`, value: true },
];

const auditTableColumns = (importedLength, cleanLength) => [
  {
    Header: `Models with variant data already imported (${importedLength})`,
    accessor: 'imported',
  },
  {
    Header: `Models with NO variant data imported (${cleanLength})`,
    accessor: 'not_imported',
  },
];

const generateTsvFilename = () => {
  const date = moment
    .utc(new Date())
    .local()
    .format('YYYY-MM-DD_HH∶mm∶ss');
  return `research-somatic-variant-audit_${date}`;
}

const VariantAuditModal = ({ bulkImportVariants }) => {
  const didMountRef = useRef(false);
  const modalState = useContext(ModalStateContext);

  let [loading, setLoading] = useState(true);
  let [importAll, setImportAll] = useState('false');
  let [imported, setImported] = useState([]);
  let [clean, setClean] = useState([]);
  let [filename, setFilename] = useState('');
  let [error, setError] = useState(null);

  const closeModal = () => modalState.setModalState({ component: null });
  const onImportAllChange = value => setImportAll(value);
  const onImportClick = async () => {
    setLoading(true);
    const modelNames = normalizeOption(importAll)
      ? [...imported, ...clean]
      : [...clean];

    await bulkImportVariants(modelNames);

    setLoading(false);
    closeModal();
  };

  const audit = async () => {
    const response = await auditGenomicVariantsAllModels();

    if (!response.error) {
      setImported(response.data.imported);
      setClean(response.data.clean);
    } else {
      setError(response.data.error.message);
    }

    setLoading(false);
    setFilename(generateTsvFilename());
  };

  useEffect(() => {
    if (!didMountRef || !didMountRef.current) {
      audit();
    } else {
      didMountRef.current = true;
    }
  }, []);

  return (
    <ModalWrapper>
      <Header>
        <Title>GDC Research Somatic Variant Audit</Title>
        <CloseModal onClick={closeModal} />
      </Header>
      <Content>
        {loading ? (
          <SpinnerBlock>
            <Spinner fadeIn="none" name="circle" color="#000" style={{ width: 24, height: 24, marginBottom: 6 }} />
            Searching GDC
          </SpinnerBlock>
        ) : !error ? (
          <>
            <BulkUploadContentBlock>
              <div>The following models have research somatic variant data in GDC.</div>
              <BulkUploadTemplateLink
                onClick={() => tsvDownloader(filename, convertColumnsToTableData(auditTableColumns(imported.length, clean.length), [imported, clean]))}
              >
                <DownloadIcon height={'10px'} width={'10px'} />
                Audit Report
              </BulkUploadTemplateLink>
            </BulkUploadContentBlock>
            <BulkUploadContentBlock>
              <div css={searchStyles} style={{ width: '100%' }}>
                <ReactTable
                  className="-striped audit-table"
                  data={convertColumnsToTableData(auditTableColumns(imported.length, clean.length), [imported, clean])}
                  columns={auditTableColumns(imported.length, clean.length)}
                  loading={loading}
                  pageSize={Math.max(imported.length, clean.length)}
                  showPaginationBottom={false}
                />
              </div>
            </BulkUploadContentBlock>
            <BulkUploadContentBlock>
              <UploadOverwrite>
                <UploadContentHeading>What would you like to import from GDC?</UploadContentHeading>
                <RadioSelect>
                  {importAllOptions.map((option, idx) => {
                    let formValue = normalizeOption(importAll);
                    const optionValue = normalizeOption(option.value);
                    return (
                      <label key={idx} htmlFor={`import-all-option-${idx}`}>
                        {option.label}
                        <input
                          type="radio"
                          id={`import-all-option-${idx}`}
                          value={optionValue}
                          checked={formValue === optionValue}
                          onChange={e => {
                            onImportAllChange(e.currentTarget.value);
                          }}
                          onClick={e => {
                            onImportAllChange(e.currentTarget.value);
                          }}
                        />
                        <span />
                      </label>
                    );
                  })}
                </RadioSelect>
              </UploadOverwrite>
            </BulkUploadContentBlock>
          </>
        ) : (
          <BulkUploadContentBlock>
            <UploadOverwrite>
              <UploadContentHeading>Unexpected Error Occurred During Audit</UploadContentHeading>
              <div>
                Please try again. If issue persists, please contact the support team. You can continue to use the application but you will not be able to audit variant data if this error persists.
                <br />
                {error}
              </div>
            </UploadOverwrite>
          </BulkUploadContentBlock>
        )}
      </Content>
      {normalizeOption(importAll) ? (
        <DoubleConfirmationFooter
          doubleConfirmPrompt='Are you sure you want to import all variant data?'
          singleConfirmLabel='Import'
          doubleConfirmLabel='Yes, Import'
          onDoubleConfirm={() => onImportClick()}
          disabled={loading || error}
        />
      ) : (
        <Footer
          css={css`
            margin-bottom: 12px;
          `}
        >
          <ButtonPill
            primary
            marginRight={`10px`}
            onClick={() => onImportClick()}
            disabled={loading || error}
          >
            Import
          </ButtonPill>
          <ButtonPill secondary onClick={closeModal}>
            Cancel
          </ButtonPill>
        </Footer>
      )}
    </ModalWrapper>
  );
};

export default VariantAuditModal;
