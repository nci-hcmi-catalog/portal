import "babel-polyfill";
import React, { Component } from "react";
import { Dashboard as ArrangerDashboard } from "@arranger/components";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route path="/" exact render={() => <div>HCMI</div>} />
            <Route
              path="/admin"
              render={({ match }) => <ArrangerDashboard basename={match.url} />}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
