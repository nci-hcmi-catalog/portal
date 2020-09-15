import 'babel-polyfill';
import React from 'react';
import Component from 'react-component-component';
import { injectGlobal } from 'emotion';

import globals from 'utils/globals';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Dashboard as ArrangerDashboard } from '@arranger/components';

import SearchWrapper from 'components/search/SearchWrapper';
import Model from 'components/Model';
import Admin from 'components/admin';
import Header from 'components/Header';
import Footer from 'components/Footer';
import Modal from 'components/modals/Modal';
import WarningModal from 'components/modals/WarningModal';

import RootProvider from 'providers/RootProvider';
import { ModalStateContext } from 'providers/ModalState';
import base from 'theme';

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
            modalState.setModalState({ component: <WarningModal modalState={modalState} /> });
          }
        }}
      >
        {({ state }) => (
          <>
            <Switch>
              <Route
                path="/"
                exact
                render={() => (
                  <>
                    <Header />
                    <SearchWrapper version={state.version} index="models" />
                  </>
                )}
              />
              {process.env.REACT_APP_ENABLE_ADMIN ? (
                <Route
                  path="/arranger"
                  render={({ match }) => (
                    <>
                      <Header />
                      <ArrangerDashboard basename={match.url} />
                    </>
                  )}
                />
              ) : (
                ''
              )}
              <Route
                path="/admin"
                render={({ location }) => (
                  <>
                    <Header subheading="Searchable Catalog CMS" />
                    <Admin location={location} />
                  </>
                )}
              />
              <Route
                path="/model/:modelName"
                render={({ match }) => (
                  <>
                    <Header />
                    <Model modelName={match.params.modelName} />
                  </>
                )}
              />
            </Switch>
            <Footer />
          </>
        )}
      </Component>
    )}
  </ModalStateContext.Consumer>
);

// Global CSS
injectGlobal`
  body, div {
    /* Overwrite arranger's Montserrat fonts */
    font-family: ${base.fonts.openSans};
  }
`;

export default () => (
  <RootProvider>
    <Router>
      <ProvidedRoutes />
    </Router>
    <Modal />
  </RootProvider>
);
