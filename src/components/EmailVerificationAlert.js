import { Alert, AlertTitle, Button, Slide } from "@mui/material";
import { Box } from "@mui/system";
import { sendEmailVerification } from "firebase/auth";
import { useAuth } from "hooks";
import React from "react";

export default function EmailVerificationAlert({ shown }) {
  const [user] = useAuth();

  const handleResendEmailVerification = () => {
    sendEmailVerification(user, { url: "http://www.espressowallet.com/" });
  };

  return (
    <Slide direction="up" in={shown} mountOnEnter unmountOnExit>
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
  );
}

const alertStyle = {
  position: "fixed",
  bottom: "1rem",
  width: "calc(min(28rem, 90vw) - 32px)",
  left: "50%",
  ml: "calc(max(-14rem, -45vw) + 16px)",
};
