import 'babel-polyfill';
import React from 'react';
import Component from 'react-component-component';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { injectGlobal } from '@emotion/css';

import globals from '../utils/globals';
import RootProvider from '../providers/RootProvider';
import { ModalStateContext } from '../providers/ModalState';
import { ExpandedUnexpandedProvider } from '../providers/ExpandedUnexpanded';
import base from '../theme/index';

import SkipNav from './SkipNav';
import SearchWrapper from './search/SearchWrapper';
// import Model from './Model';
import Admin from './admin';
import Header from './Header';
import Footer from './Footer';
import Modal from './modals/Modal';
import WarningModal from './modals/WarningModal';
// import '../index.css';

// TODO:
const SearchRoute = (
  <>
    <Header subheading="Search Arranger Data" />
    <SearchWrapper index="model" />
  </>
);

// TODO: ({ location }) => (
// location={location}
const AdminRoute = (
  <>
    <Header subheading="Searchable Catalog CMS" />
    <Admin location={'Canada'} />
  </>
);

// TODO: ({ match }) => (
const ModelRoute = (
  <>
    <Header subheading="Model Data" />
    {/* <Model modelName={match.params.modelName} /> */}
  </>
);

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
        {() => (
          <>
            <SkipNav />
            <Routes>
              <Route path="/" element={SearchRoute} />
              <Route path="/admin" element={AdminRoute} />
              <Route path="/model/:modelName" element={ModelRoute} />
            </Routes>
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

const App = ({ loaderData, actionData, params, matches }: Route.ComponentProps) => (
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
