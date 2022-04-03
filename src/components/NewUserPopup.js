import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { currencies } from "constants";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { changeCurrency } from "services";

export default function NewUserPopup() {
  const [show, setShow] = useState(false);

  const { currency, loading } = useSelector(state => state.wallet.baseCurrency);

  const [selectedCurrency, setSelectedCurrency] = useState(currency ?? "USD");

  const handleChange = event => setSelectedCurrency(event.target.value);

  useEffect(() => {
    if (loading) return setShow(false);
    if (currency) return setShow(false);
    if (!currency) return setShow(true);
  }, [currency, loading]);

  const close = async (_event, reason) => {
    if (reason && reason === "backdropClick") return;
    await changeCurrency(selectedCurrency, "convertAll");
    setShow(false);
    return;
  };

  return (
    <Dialog open={show} onClose={close} disableEscapeKeyDown>
      <DialogTitle>Welcome to Espresso!</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Thank you for choosing espresso. Let's set you up by selecting your
          base currency.
        </DialogContentText>
        <TextField
          autoFocus
          select
          label="Base Currency"
          SelectProps={{ native: true }}
          size="small"
          margin="normal"
          onChange={handleChange}
          sx={{ width: "12ch" }}
          value={selectedCurrency}
        >
          {currencies.map(c => (
            <option data-testid={c} value={c} key={c}>
              {c}
            </option>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
