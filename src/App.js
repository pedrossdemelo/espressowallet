import { FilteredUserDataProvider, Loading } from "components";
import { useAuth } from "hooks";
import { Login, Settings, Wallet } from "pages";
import { Redirect, Route, Switch } from "react-router-dom";

function App() {
  const [user, loadingUser] = useAuth();

  if (loadingUser) return <Loading />;

  const loggedIn = user !== null;

  return (
    <UserData loggedIn={loggedIn}>
      <Switch>
        <Route exact path="/">
          {loggedIn ? <Wallet /> : <Redirect to="/login" />}
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
    </UserData>
  );
}

function UserData({ children, loggedIn }) {
  if (!loggedIn) return <>{children}</>;
  return <FilteredUserDataProvider>{children}</FilteredUserDataProvider>;
}

export default App;
