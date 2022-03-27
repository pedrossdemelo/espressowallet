import { Loading } from "components";
import { useAuth } from "hooks";
import { Login, Settings, UserConfig, Wallet } from "pages";
import { Redirect, Route, Switch } from "react-router-dom";

function App() {
  const [user, loadingUser] = useAuth();

  if (loadingUser) return <Loading />;

  const loggedIn = user !== null;

  return (
    <Switch>
      <Route exact path="/">
        {loggedIn ? <Wallet /> : <Redirect to="/login" />}
      </Route>
      <Route exact path="/config">
        {loggedIn ? <UserConfig /> : <Redirect to="/login" />}
      </Route>
      <Route exact path="/login">
        {loggedIn ? <Redirect to="/" /> : <Login />}
      </Route>
      <Route exact path="/settings">
        {loggedIn ? <Settings /> : <Redirect to="/login" />}
      </Route>
      <Route path="*">
        <Redirect to="/" />
      </Route>
    </Switch>
  );
}

export default App;
