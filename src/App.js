import { Box, styled } from "@mui/material";
import { EmailVerificationAlert, Loading } from "components";
import { FilteredUserDataProvider } from "context";
import { useAuth } from "hooks";
import { Login, Settings, Wallet } from "pages";
import { Redirect, Route, Switch } from "react-router-dom";

function App() {
  const [user, loadingUser] = useAuth();

  if (loadingUser) return <Loading />;

  const loggedIn = Boolean(user);
  const verified = user?.emailVerified === true;

  return (
    <UserData verified={verified}>
      <Background>
        <Switch>
          <Route exact path="/">
            {verified ? <Wallet /> : <Redirect to="/login" />}
          </Route>
          <Route exact path="/login">
            {verified ? <Redirect to="/" /> : <Login />}
          </Route>
          <Route exact path="/settings">
            {verified ? <Settings /> : <Redirect to="/login" />}
          </Route>
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
        <EmailVerificationAlert shown={loggedIn && !verified} />
      </Background>
    </UserData>
  );
}

const Background = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: "100vh",
  minWidth: "100vw",
}));

function UserData({ children, verified }) {
  if (!verified) return <>{children}</>;
  return <FilteredUserDataProvider>{children}</FilteredUserDataProvider>;
}

export default App;
