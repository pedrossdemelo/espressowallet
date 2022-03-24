import { Login, UserConfig, Wallet } from "pages";
import React from "react";
import { Route, Switch } from "react-router-dom";

function App() {
  return (
    <Switch>
      <Route exact path="/carteira">
        <Wallet />
      </Route>
      <Route exact path="/config">
        <UserConfig />
      </Route>
      <Route exact path="/">
        <Login />
      </Route>
    </Switch>
  );
}

export default App;
