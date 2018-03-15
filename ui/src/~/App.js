import 'babel-polyfill';
import React from 'react';
import Component from 'react-component-component';
import { Dashboard as ArrangerDashboard } from '@arranger/components';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import globals from '~/globals';
import Search from '~/Search';
import Model from '~/Model';

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
          <Route
            path="/arranger"
            render={({ match }) => <ArrangerDashboard basename={match.url} />}
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
