import 'babel-polyfill';
import React from 'react';
import Component from 'react-component-component';
import { Dashboard as ArrangerDashboard } from '@arranger/components';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import globals from 'utils/globals';
import Search from 'components/Search';
import Model from 'components/Model';
import AdminNav from 'components/AdminNav';
import { Row, Col, Box } from 'components/Layout';
import Header from 'components/Header';

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
                  <Row
                    p={15}
                    css={`
                      color: #900;
                      font-weight: bold;
                      font-size: 1.3em;
                    `}
                  >
                    HCMI Data Portal
                  </Row>
                  <Row ml="auto">
                    <Link to="/admin/manage_users">
                      <Box p={15}>Administrator</Box>
                    </Link>
                  </Row>
                </Row>
                <Search version={state.version} index="models" />
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
            path="/model/:modelId"
            render={({ match }) => (
              <div>
                <Header />
                <Model modelId={match.params.modelId} />
              </div>
            )}
          />
        </Switch>
      )}
    </Component>
  </Router>
);
