import { LoadingButton } from "@mui/lab";
import { Alert, AlertTitle, Slide } from "@mui/material";
import { Box } from "@mui/system";
import { errorMessage, useSnackbar } from "context";
import { useAuth } from "hooks";
import React, { useState } from "react";
import { sendVerificationEmail } from "services";

export default function EmailVerificationAlert({ shown }: { shown: boolean }) {
  const [user] = useAuth();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const { showError } = useSnackbar();

  const handleResendEmailVerification = async () => {
    if (!user || sending) return;
    setSending(true);
    setSent(false);
    try {
      await sendVerificationEmail(user);
      setSent(true);
    } catch (err) {
      showError(errorMessage(err, "Couldn't resend the verification email."));
    } finally {
      setSending(false);
    }
  };

  return (
    <Slide direction="up" in={shown} mountOnEnter unmountOnExit>
      <Alert
        action={
          <LoadingButton
            onClick={handleResendEmailVerification}
            color="inherit"
            size="small"
            sx={{ mt: "-1px" }}
            loading={sending}
          >
            Resend
          </LoadingButton>
        }
        sx={alertStyle}
        severity="info"
      >
        <AlertTitle>Pending verification</AlertTitle>
        <Box sx={{ mr: -6 }}>
          {sent ? "Verification email sent. " : "Verify "}
          <strong>{user?.email}</strong>
          {sent
            ? " Check your inbox and spam folder."
            : " to continue. Check your inbox or resend the email."}
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
