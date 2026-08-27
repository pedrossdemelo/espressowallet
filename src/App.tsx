import { Box, styled } from "@mui/material";
import { EmailVerificationAlert, Loading } from "components";
import { FilteredUserDataProvider } from "context";
import { useAuth } from "hooks";
import { lazy, ReactNode, Suspense } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";

// Route-level code splitting: each page (and everything it alone pulls in —
// Wallet drags in the bulk of Firestore usage, Settings its own dialogs) only
// loads once the route is actually reached, instead of all three paying for
// each other upfront in one bundle.
const Login = lazy(() => import("pages/Login"));
const Settings = lazy(() => import("pages/Settings"));
const Wallet = lazy(() => import("pages/Wallet"));

function App() {
  const [user, loadingUser] = useAuth();
  const { pathname } = useLocation();

  if (loadingUser) return <Loading />;

  const loggedIn = Boolean(user);
  const verified = user?.emailVerified === true;

  return (
    <>
      <UserData verified={verified}>
        <Background>
          <Suspense fallback={<Loading />}>
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
          </Suspense>
          {/* /login renders its own pending-verification screen, so the
              floating alert there would just repeat it. */}
          <EmailVerificationAlert
            shown={loggedIn && !verified && pathname !== "/login"}
          />
        </Background>
      </UserData>
    </>
  );
}

const Background = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: "-webkit-fill-available",
}));

function UserData({
  children,
  verified,
}: {
  children: ReactNode;
  verified: boolean;
}) {
  if (!verified) return <>{children}</>;
  return <FilteredUserDataProvider>{children}</FilteredUserDataProvider>;
}

export default App;
