import { Box, styled } from "@mui/material";
import { EmailVerificationAlert, Loading } from "components";
import { FilteredUserDataProvider } from "context";
import { useAuth, useMode } from "hooks";
import { Login, Settings, Wallet } from "pages";
import { Helmet } from "react-helmet";
import { Redirect, Route, Switch } from "react-router-dom";

function App() {
  const [user, loadingUser] = useAuth();
  const { isLight } = useMode();

  if (loadingUser) return <Loading />;

  const loggedIn = Boolean(user);
  const verified = user?.emailVerified === true;

  return (
    <>
      <Helmet>
        {isLight ? (
          <meta name="theme-color" content="#f1f0ed" />
        ) : (
          <meta name="theme-color" content="#111111" />
        )}
      </Helmet>

      <UserData verified={verified}>
        <Background>
          <Switch>
            <Route exact path="/">
              {loggedIn && verified ? <Wallet /> : <Redirect to="/login" />}
            </Route>
            <Route exact path="/login">
              {loggedIn && verified ? <Redirect to="/" /> : <Login />}
            </Route>
            <Route exact path="/settings">
              {loggedIn && verified ? <Settings /> : <Redirect to="/login" />}
            </Route>
            <Route path="*">
              <Redirect to="/" />
            </Route>
          </Switch>
          <EmailVerificationAlert shown={loggedIn && !verified} />
        </Background>
      </UserData>
    </>
  );
}

const Background = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: "-webkit-fill-available",
}));

function UserData({ children, verified }) {
  if (!verified) return <>{children}</>;
  return <FilteredUserDataProvider>{children}</FilteredUserDataProvider>;
}

export default App;
