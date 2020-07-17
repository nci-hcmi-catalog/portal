import React, { useState } from 'react';
import { Row, Col } from 'theme/system';
import Spinner from 'react-spinkit';
import TextInput from 'components/TextInput';
import SidebarHeader from 'components/search/SidebarHeader';
import SidebarSection from 'components/search/SidebarSection';

import { QuickSearch } from '@arranger/components/dist/Arranger';
import * as SQONUtils from '@arranger/components/dist/SQONView/utils';

const LoadingIcon = (
  <Spinner fadeIn="none" name="circle" color="#a9adc0" style={{ width: 15, height: 15 }} />
);

export default ({ sqon, setSQON, ...props }) => {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  return (
    <SidebarSection title="Search by Gene">
      <TextInput
        aria-label="Search by Gene"
        placeholder="e.g. BRAF, EWSR, ..."
        value={value}
        icon={loading ? LoadingIcon : LoadingIcon}
        onChange={e => {
          const selected = e.target.value;
          setValue(selected);
          // const query = {
          //   op: 'and',
          //   content: [
          //     {
          //       op: 'in',
          //       content: {
          //         field: 'genomic_variants.gene',
          //         value: [selected],
          //       },
          //     },
          //   ],
          // };

          // const clearedSqon = SQONUtils.removeSQON('genomic_variants.gene', sqon);
          // const newSqon = selected ? SQONUtils.addInSQON(query, clearedSqon) : clearedSqon;
          // setSQON(newSqon);
        }}
      />
    </SidebarSection>
  );
};
