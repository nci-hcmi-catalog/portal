import 'babel-polyfill';
import React from 'react';
import Component from 'react-component-component';
import { Dashboard as ArrangerDashboard } from '@arranger/components';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import globals from '~/globals';
import Search from '~/Search';
import Model from '~/Model';
import AdminNav from '~/AdminNav';
import { Row, Col, Box } from './Layout';

export default () => (
  <Router>
    <Component
      initialState={{
        version: globals.VERSION,
      }}
    >
      {({ state }) => (
        <Switch>
          <Route
            path="/"
            exact
            render={() => (
              <Col>
                <Row>
                  <Row ml="auto">
                    <Link to="/admin/manage_users">
                      <Box p={15}>Administrator</Box>
                    </Link>
                  </Row>
                </Row>
                <Search version={state.version} />
              </Col>
            )}
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
            path="/:modelId"
            render={({ match }) => (
              <div>
                <Link to="/">« Back to List View</Link>
                <Model modelId={match.params.modelId} />
              </div>
            )}
          />
        </Switch>
      )}
    </Component>
  </Router>
);
