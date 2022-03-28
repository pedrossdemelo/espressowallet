import { Alert, AlertTitle, Button, Slide } from "@mui/material";
import { Box } from "@mui/system";
import { FilteredUserDataProvider, Loading } from "components";
import { sendEmailVerification } from "firebase/auth";
import { useAuth } from "hooks";
import { Login, Settings, Wallet } from "pages";
import { Redirect, Route, Switch } from "react-router-dom";

function App() {
  const [user, loadingUser] = useAuth();

  if (loadingUser) return <Loading />;

  const loggedIn = Boolean(user);
  const verified = user?.emailVerified === true;

  const handleResendEmailVerification = () => {
    sendEmailVerification(user, { url: "http://localhost:3000/" });
  };

  return (
    <UserData verified={verified}>
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
      <Slide
        direction="up"
        in={loggedIn && !verified}
        mountOnEnter
        unmountOnExit
      >
        <Alert
          action={
            <Button
              onClick={handleResendEmailVerification}
              color="inherit"
              size="small"
              sx={{ mt: "-1px" }}
            >
              Resend
            </Button>
          }
          sx={alertStyle}
          severity="info"
        >
          <AlertTitle>Pending verification</AlertTitle>
          <Box sx={{ mr: -6 }}>
            An email has been sent to <strong>{user?.email}</strong> to verify
            your account. Make sure to check your spam folder.
          </Box>
        </Alert>
      </Slide>
    </UserData>
  );
}

const alertStyle = {
  position: "fixed",
  bottom: "1rem",
  width: "calc(min(480px, 90vw) - 32px)",
  left: "50%",
  ml: "max(-240px, -45vw)",
};

function UserData({ children, verified }) {
  if (!verified) return <>{children}</>;
  return <FilteredUserDataProvider>{children}</FilteredUserDataProvider>;
}

export default App;
