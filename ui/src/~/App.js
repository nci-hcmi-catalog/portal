import 'babel-polyfill';
import React from 'react';
import Component from 'react-component-component';
import { Dashboard as ArrangerDashboard } from '@arranger/components';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import globals from '~/globals';
import Search from '~/Search';

export default () => (
  <Router>
    <Component
      initialState={{
        version: globals.VERSION,
      }}
    >
      {({ state }) => (
        <Switch>
          <Route path="/" exact render={() => <Search version={state.version} />} />
          <Route path="/admin" render={({ match }) => <ArrangerDashboard basename={match.url} />} />
        </Switch>
      )}
    </Component>
  </Router>
);
