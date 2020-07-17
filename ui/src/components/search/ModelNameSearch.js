import React from 'react';
import Spinner from 'react-spinkit';
import { QuickSearch } from '@arranger/components/dist/Arranger';
import TextInput from 'components/TextInput';
import SidebarSection from 'components/search/SidebarSection';

export default (
  { props, ...rest }, // super subtle bug due to `props` name collision
) => {
  return (
    <SidebarSection title="Search by Model Name">
      <QuickSearch
        {...rest}
        searchLowercase={true}
        placeholder="Enter model name ..."
        searchTextDelimiters={[',']}
        InputComponent={TextInput}
        LoadingIcon={
          <Spinner fadeIn="none" name="circle" color="#a9adc0" style={{ width: 15, height: 15 }} />
        }
      />
    </SidebarSection>
  );
};
