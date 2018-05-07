import 'babel-polyfill';
import React from 'react';
import Component from 'react-component-component';

import globals from 'utils/globals';

import { ThemeProvider } from 'emotion-theming';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { Dashboard as ArrangerDashboard } from '@arranger/components';

import Search from 'components/Search';
import Model from 'components/Model';
import AdminNav from 'components/AdminNav';
import { Row, Col } from 'theme/system';
import Header from 'components/Header';
import theme from 'theme';

import RootProvider from 'providers/RootProvider';

export default () => (
  <ThemeProvider theme={theme}>
    <Router>
      <RootProvider>
        <Component
          initialState={{
            version: globals.VERSION,
          }}
        >
          {({ state }) => (
            <>
              <Header />
              <Switch>
                <Route
                  path="/"
                  exact
                  render={() => <Search version={state.version} index="models" />}
                />
                <Route
                  path="/arranger"
                  render={({ match }) => <ArrangerDashboard basename={match.url} />}
                />
                <Route
                  path="/admin"
                  render={({ match }) => (
                    <Col>
                      <Row>
                        <Row p={15}>
                          <Link to="/">« Back to List View</Link>
                        </Row>
                        <Row flex={1} p={15}>
                          HCMI Searchable Catalog Administration
                        </Row>
                        <Row p={15}>Logout</Row>
                      </Row>
                      <Row>
                        <AdminNav />
                        <Route path="/admin/manage_users" render={() => <Row p={15}>Users</Row>} />
                        <Route
                          path="/admin/single_model_upload"
                          render={() => <Row p={15}>single model upload</Row>}
                        />
                        <Route
                          path="/admin/bulk_model_upload"
                          render={() => <Row p={15}>bulk model upload</Row>}
                        />
                        <Route
                          path="/admin/manage_models"
                          render={() => <Row p={15}>manage models</Row>}
                        />
                      </Row>
                    </Col>
                  )}
                />
                <Route
                  path="/model/:modelName"
                  render={({ match }) => <Model modelName={match.params.modelName} />}
                />
              </Switch>
            </>
          )}
        </Component>
      </RootProvider>
    </Router>
  </ThemeProvider>
);
