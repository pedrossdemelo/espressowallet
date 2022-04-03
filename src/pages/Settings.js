import {
  ArrowBack,
  AttachMoney,
  DarkModeRounded,
  DeleteForever,
  LightModeRounded,
  Logout,
} from "@mui/icons-material";
import {
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
import { useMode } from "hooks";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import { changeCurrency, logout } from "services";

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

  const { currency: currentCurrency, loading } = useSelector(
    state => state.wallet.baseCurrency
  );
  const [currency, setCurrency] = useState("USD");
  const handleCurrencyChange = e => setCurrency(e.target.value);

  const [dialogOpen, setDialogOpen] = useState(false);
  const openDialog = () => setDialogOpen(true);
  const closeDialog = () => setDialogOpen(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const openDeleteDialog = () => setDeleteDialogOpen(true);
  const closeDeleteDialog = () => setDeleteDialogOpen(false);

  useEffect(() => {
    setCurrency(currentCurrency);
  }, [currentCurrency]);

  const handleChangeCurrencyConvert = async () => {
    await changeCurrency(currency, "convertAll");
    closeDialog();
  };

  const handleDeleteAllTransactions = async () => {
    await changeCurrency(dialogOpen ? currency : currentCurrency, "deleteAll");
    closeDeleteDialog();
    dialogOpen && closeDialog();
  };

  if (!currentCurrency && !loading) return <Redirect to="/" />;

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
