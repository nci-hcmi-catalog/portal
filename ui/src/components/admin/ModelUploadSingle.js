import React from 'react';
import { AdminPage, AdminHeader, AdminContent } from 'theme/adminStyles';
import { AdminModelNav, NavItem, AdminModelContent } from 'theme/adminModelStyles';
import { Row } from 'theme/system';
import ModelForm from './ModelForm';

export default () => (
  <AdminPage>
    <AdminHeader>Header Content</AdminHeader>
    <Row>
      <AdminModelNav>
        <NavItem>Edit</NavItem>
        <NavItem>Images</NavItem>
        <NavItem>Variants</NavItem>
      </AdminModelNav>
      <AdminModelContent>
        <ModelForm />
      </AdminModelContent>
    </Row>
  </AdminPage>
);
