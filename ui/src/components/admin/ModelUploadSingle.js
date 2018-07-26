import React from 'react';
import {AdminContainer, AdminHeader} from 'theme/adminStyles';
import {AdminModelNav, NavItem, AdminModelContent} from 'theme/adminModelStyles';
import {Row} from 'theme/system';
import ModelForm from './ModelForm';

export default() => (
  <AdminContainer>
    <AdminHeader>
      <div>
        <h1>Header Content</h1>
      </div>
    </AdminHeader>
    <Row>
      <AdminModelNav>
        <NavItem>Edit</NavItem>
        <NavItem>Images</NavItem>
        <NavItem>Variants</NavItem>
      </AdminModelNav>
      <AdminModelContent>
        <ModelForm/>
      </AdminModelContent>
    </Row>
  </AdminContainer>
);
