import 'babel-polyfill';
import React from 'react';
import Component from 'react-component-component';

import globals from 'utils/globals';

import { ThemeProvider } from 'emotion-theming';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { Dashboard as ArrangerDashboard } from '@arranger/components';

import Search from 'components/SearchWrapper';
import Model from 'components/Model';
import AdminNav from 'components/AdminNav';
import { Row, Col } from 'theme/system';
import Header from 'components/Header';
import Footer from 'components/Footer';
import theme from 'theme';
import Modal from 'components/modals/Modal';

import RootProvider from 'providers/RootProvider';
import { ModalStateContext } from 'providers/ModalState';
import WarningModal from 'components/modals/WarningModal';

// issue with react-router and react context provider workaround:
// Router and Context must be rendered in seperate render calls, else
// Router does not detect route changes
// https://github.com/ReactTraining/react-router/issues/6072
const ProvidedRoutes = () => (
  <ModalStateContext.Consumer>
    {modalState => (
      <Component
        initialState={{
          version: globals.VERSION,
        }}
        didMount={() => {
          if (!localStorage.getItem(globals.SEEN_WARNING_KEY)) {
            modalState.setModal({ component: <WarningModal modalState={modalState} /> });
          }
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
                render={() => (
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
            <Footer />
          </>
        )}
      </Component>
    )}
  </ModalStateContext.Consumer>
);

export default () => (
  <ThemeProvider theme={theme}>
    <RootProvider>
      <Router>
        <ProvidedRoutes />
      </Router>
      <Modal />
    </RootProvider>
  </ThemeProvider>
);
