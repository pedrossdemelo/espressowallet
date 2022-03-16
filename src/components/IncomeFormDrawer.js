import {
  Button,
  List,
  ListItem,
  SwipeableDrawer,
  TextField,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import getRates from "../services/getRates";
import { addIncomeThunk } from "../store/actions";

const tagInputs = [
  "Investments",
  "Salary",
  "Gift",
  "Savings",
  "Prize",
  "Sale",
  "Other",
];

const initialFormState = {
  tag: "Salary",
  value: 1000,
  currency: "USD",
  description: "",
};

const paperProps = { style: { backgroundColor: "transparent" } };

export default function IncomeFormDrawer({ open, close }) {
  const dispatch = useDispatch();
  const [currencies, setCurrencies] = useState([]);
  const lastId = useRef(0);

  const [formState, setFormState] = useState(initialFormState);
  const { tag, value, currency, description } = formState;

  function handleChange(e) {
    const { name, value: valuePair } = e.target;
    const key = name.split("-")[0];
    setFormState({
      ...formState,
      [key]: valuePair,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    dispatch(
      addIncomeThunk({
        ...formState,
        createdAt: new Date(),
        id: lastId.current,
      })
    );
    lastId.current += 1;
    setFormState(initialFormState);
    close();
  }

  useEffect(() => {
    (async () => {
      const { data, error } = await getRates();
      if (error) return;
      setCurrencies(Object.keys(data));
    })();
  }, []);

  return (
    <SwipeableDrawer
      onClose={close}
      PaperProps={paperProps}
      open={open}
      anchor="bottom"
    >
      <List
        component="form"
        sx={{
          borderRadius: "1rem 1rem 0 0",
          bgcolor: "background.paper",
          boxShadow: 3,
        }}
        onSubmit={handleSubmit}
      >
        <ListItem>
          <TextField
            variant="standard"
            fullWidth
            size="large"
            name="value-input"
            error={value <= 0}
            helperText={value <= 0 ? "Value must be greater than 0" : " "}
            autoFocus
            type="number"
            label="Value"
            onChange={handleChange}
            value={value}
          />

          <TextField
            variant="standard"
            label="Currency"
            select
            SelectProps={{ native: true }}
            id="currency-input"
            name="currency-input"
            helperText=" "
            data-testid="currency-input"
            onChange={handleChange}
            value={currency}
          >
            {currencies.map(c => (
              <option data-testid={c} value={c} key={c}>
                {c}
              </option>
            ))}
          </TextField>
        </ListItem>

        <ListItem>
          <TextField
            fullWidth
            variant="outlined"
            error={description.length >= 25}
            helperText={
              description.length >= 25
                ? "Descriptions should be shorter than 25 characters"
                : " "
            }
            size="large"
            type="text"
            placeholder="What was the income?"
            autoComplete="off"
            name="description-input"
            label="Description"
            data-testid="description-input"
            onChange={handleChange}
            value={description}
          />
        </ListItem>

        <ListItem sx={{ justifyContent: "center" }}>
          <TextField
            label="Tag"
            size="small"
            variant="outlined"
            select
            SelectProps={{ native: true }}
            onChange={handleChange}
            id="tag-input"
            name="tag-input"
            data-testid="tag-input"
            value={tag}
          >
            {tagInputs.map(t => (
              <option data-testid={t} value={t} key={t}>
                {t}
              </option>
            ))}
          </TextField>
        </ListItem>

        <ListItem>
          <Button
            disabled={
              description.length < 3 || description.length >= 25 || value <= 0
            }
            sx={{ ml: "auto", mt: 1 }}
            type="submit"
          >
            Add income
          </Button>
        </ListItem>
      </List>
    </SwipeableDrawer>
  );
}