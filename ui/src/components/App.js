import 'babel-polyfill';
import React from 'react';
import Component from 'react-component-component';
import { injectGlobal } from '@emotion/css';

import globals from 'utils/globals';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import SkipNav from 'components/SkipNav';
import SearchWrapper from 'components/search/SearchWrapper';
import Model from 'components/Model';
import Admin from 'components/admin';
import Header from 'components/Header';
import Footer from 'components/Footer';
import Modal from 'components/modals/Modal';
import WarningModal from 'components/modals/WarningModal';

import RootProvider from 'providers/RootProvider';

import { ModalStateContext } from 'providers/ModalState';
import { ExpandedUnexpandedProvider } from 'providers/ExpandedUnexpanded';
import base from 'theme';

// issue with react-router and react context provider workaround:
// Router and Context must be rendered in seperate render calls, else
// Router does not detect route changes
// https://github.com/ReactTraining/react-router/issues/6072
const ProvidedRoutes = () => (
  <ModalStateContext.Consumer>
    {(modalState) => (
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
          <ExpandedUnexpandedProvider>
            <SkipNav />
            <Switch>
              <Route
                path="/"
                exact
                render={() => (
                  <>
                    <Header />
                    <SearchWrapper index="model" />
                  </>
                )}
              />
              {process.env.REACT_APP_ENABLE_ADMIN ? (
                <Route
                  path="/arranger"
                  render={({ match }) => (
                    <>
                      <Header />
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
          </ExpandedUnexpandedProvider>
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

const App = () => (
  <RootProvider>
    <Router forceRefresh={true}>
      <ProvidedRoutes />
    </Router>
    <Modal />
  </RootProvider>
);

export default App;
