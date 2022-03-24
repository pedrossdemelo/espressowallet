import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Login, Wallet } from './pages';
import UserConfig from './pages/UserConfig';

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
