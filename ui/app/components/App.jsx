import 'babel-polyfill';
import React from 'react';
import Component from 'react-component-component';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { injectGlobal } from '@emotion/css';

import globals from '../utils/globals';
import RootProvider from '../providers/RootProvider';
import { ModalStateContext } from '../providers/ModalState';
import { ExpandedUnexpandedProvider } from '../providers/ExpandedUnexpanded';
import base from '../theme/index';

import SkipNav from './SkipNav';
import SearchWrapper from './search/SearchWrapper';
import Model from './Model';
import Admin from './admin';
import Header from './Header';
import Footer from './Footer';
import Modal from './modals/Modal';
import WarningModal from './modals/WarningModal';

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
          <>
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

const App = () => (
  <ExpandedUnexpandedProvider>
    <RootProvider>
      <Router>
        <ProvidedRoutes />
      </Router>
      <Modal />
    </RootProvider>
  </ExpandedUnexpandedProvider>
);

export default App;
