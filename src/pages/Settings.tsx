import {
  ArrowBack,
  AttachMoney,
  DarkModeRounded,
  DeleteForever,
  LightModeRounded,
  Logout,
} from "@mui/icons-material";
import {
  Alert,
  AppBar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { currencies } from "constants";
import { errorMessage, useSnackbar } from "context";
import { useAppSelector, useMode } from "hooks";
import React, { useEffect, useState } from "react";

import { Redirect, useHistory } from "react-router-dom";
import { changeCurrency, logout } from "services";
import { Currency } from "types";

const toolbarStyle = {
  "@media all": { px: 2 },
  alignItems: "flex-start",
  justifyContent: "space-between",
  flexDirection: "column",
  py: 0,
};

export default function ProfileMenu() {
  const history = useHistory();

  const { isLight, toggleMode } = useMode();
  const { showError } = useSnackbar();

  const { currency: currentCurrency, loading } = useAppSelector(
    state => state.wallet.baseCurrency,
  );
  const [currency, setCurrency] = useState<Currency | null | undefined>("USD");
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setCurrency(e.target.value as Currency);

  const [dialogOpen, setDialogOpen] = useState(false);
  const openDialog = () => setDialogOpen(true);
  const closeDialog = () => setDialogOpen(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const openDeleteDialog = () => setDeleteDialogOpen(true);
  const closeDeleteDialog = () => setDeleteDialogOpen(false);

  useEffect(() => {
    setCurrency(currentCurrency);
  }, [currentCurrency]);

  // Non-null: matches the original, which also never guarded these against
  // a currency that hasn't loaded yet.
  const handleChangeCurrencyConvert = async () => {
    try {
      await changeCurrency(currency!, "convertAll");
      closeDialog();
    } catch (err) {
      showError(
        errorMessage(err, "Couldn't convert your currency. Try again."),
      );
    }
  };

  const handleDeleteAllTransactions = async () => {
    try {
      await changeCurrency(
        (dialogOpen ? currency : currentCurrency)!,
        "deleteAll",
      );
      closeDeleteDialog();
      if (dialogOpen) closeDialog();
    } catch (err) {
      showError(
        errorMessage(err, "Couldn't delete your transactions. Try again."),
      );
    }
  };

  if (!currentCurrency && !loading) return <Redirect to="/" />;

  // Frankfurter (see getRates.ts) dropped LKR/TWD from the supported list.
  // A user whose base currency is one of those isn't broken — every past
  // transaction keeps its own stored rate snapshot — but a *new* transaction
  // would look up a currency the rates table no longer has. Surface it
  // instead of letting that fail silently.
  const currencyUnsupported =
    !loading && !!currentCurrency && !currencies.includes(currentCurrency);

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={toolbarStyle}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              height: { xs: 58, sm: 64 },
            }}
          >
            <IconButton
              onClick={() => history.push("/")}
              edge="start"
              size="large"
              color="inherit"
            >
              <ArrowBack />
            </IconButton>

            <Typography ml={1} variant="h6">
              Settings
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {currencyUnsupported && (
        <Alert
          severity="warning"
          sx={{ m: 2 }}
          action={
            <Button color="inherit" size="small" onClick={openDialog}>
              Change
            </Button>
          }
        >
          {currentCurrency} is no longer a supported base currency. Pick a new
          one to keep adding transactions.
        </Alert>
      )}

      <List sx={{ mt: -1 }}>
        <ListItemButton onClick={openDialog}>
          <ListItemIcon>
            <AttachMoney />
          </ListItemIcon>

          <ListItemText>
            Currency: {loading ? "Loading..." : `${currentCurrency}`}
          </ListItemText>
        </ListItemButton>

        <ListItemButton onClick={toggleMode}>
          <ListItemIcon>
            {isLight ? <LightModeRounded /> : <DarkModeRounded />}
          </ListItemIcon>

          <ListItemText>{isLight ? "Light" : "Dark"} theme</ListItemText>
        </ListItemButton>

        <Divider sx={{ my: 1 }} />

        <ListItemButton
          sx={{ color: `error.${isLight ? "dark" : "light"}` }}
          onClick={openDeleteDialog}
        >
          <ListItemIcon>
            <DeleteForever
              sx={{ color: `error.${isLight ? "dark" : "light"}` }}
            />
          </ListItemIcon>

          <ListItemText>Delete all transactions</ListItemText>
        </ListItemButton>

        <ListItemButton
          sx={{ color: `error.${isLight ? "dark" : "light"}` }}
          onClick={logout}
        >
          <ListItemIcon>
            <Logout sx={{ color: `error.${isLight ? "dark" : "light"}` }} />
          </ListItemIcon>

          <ListItemText>Logout</ListItemText>
        </ListItemButton>
      </List>

      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogTitle>
          Are you sure you want to change your currency?
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            You have two options:
            <br />
            <strong>Convert</strong> all your past transactions to the new
            currency or <strong>delete</strong> all your transactions.
          </DialogContentText>

          <TextField
            autoFocus
            select
            label="New currency"
            size="small"
            SelectProps={{ native: true }}
            margin="normal"
            onChange={handleCurrencyChange}
            sx={{ width: "12ch" }}
            value={currency}
          >
            {currencies.map(c => (
              <option data-testid={c} value={c} key={c}>
                {c}
              </option>
            ))}
          </TextField>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Cancel
          </Button>

          <Button onClick={openDeleteDialog} color="primary">
            Delete
          </Button>

          <Button
            onClick={handleChangeCurrencyConvert}
            color="primary"
            autoFocus
          >
            Convert
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Delete all transactions</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete all your transactions?
            <br />
            This action <strong>cannot</strong> be undone.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>

          <Button onClick={handleDeleteAllTransactions} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
