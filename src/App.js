import { Login, UserConfig, Wallet } from "pages";
import { Route, Switch } from "react-router-dom";

function App() {
  return (
    <Switch>
      <Route exact path="/">
        <Wallet />
      </Route>
      <Route exact path="/config">
        <UserConfig />
      </Route>
      <Route exact path="/login">
        <Login />
      </Route>
    </Switch>
  );
}

export default App;
