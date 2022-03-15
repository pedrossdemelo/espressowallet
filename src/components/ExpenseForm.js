import { Add } from "@mui/icons-material";
import {
  Button, Fab,
  List,
  ListItem,
  SwipeableDrawer,
  TextField
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import getRates from "../services/getRates";
import { addExpenseThunk } from "../store/actions";

const methodInputs = ["Cash", "Credit Card", "Debit Card"];

const tagInputs = ["Food", "Entertainment", "Work", "Transportation", "Health"];

const fabStyle = { position: "fixed", bottom: "1rem", right: "1rem" };

const initialFormState = {
  method: "Cash",
  tag: "Food",
  value: 10,
  currency: "USD",
  description: "",
}

export default function ExpenseForm() {
  const dispatch = useDispatch();
  const [currencies, setCurrencies] = useState([]);
  const lastId = useRef(0);
  const updating = useSelector(state => state.wallet.updating);
  const expenses = useSelector(state => state.wallet.expenses);

  const [formState, setFormState] = useState(initialFormState);
  const { method, tag, value, currency, description } = formState;

  useEffect(() => {
    const expenseToEdit =
      updating === null
        ? null
        : {
            ...expenses.find(expense => expense.id === updating),
            exchangeRate: undefined,
          };
    if (expenseToEdit) setFormState(expenseToEdit);
  }, [updating, expenses]);

  useEffect(() => {
    (async () => {
      const { data, error } = await getRates();
      if (error) return;
      setCurrencies(Object.keys(data));
    })();
  }, []);

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
    const id = updating ?? lastId.current;
    if (updating) lastId.current -= 1;
    dispatch(addExpenseThunk({ ...formState, id }));
    lastId.current += 1;
    setFormState(initialFormState);
    close();
  }

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const open = () => setIsDrawerOpen(true);
  const close = () => setIsDrawerOpen(false);

  return (
    <>
      <Fab onClick={open} color="primary" variant="extended" sx={fabStyle}>
        <Add sx={{ mr: 1, ml: -0.5 }} /> WRITE EXPENSE
      </Fab>

      <SwipeableDrawer onClose={close} open={isDrawerOpen} anchor="bottom">
        <List component="form" onSubmit={handleSubmit}>
          <ListItem>
            <TextField
              variant="standard"
              fullWidth
              name="value-input"
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
              multiline
              fullWidth
              variant="standard"
              type="text"
              placeholder="How did you spend it?"
              autoComplete="off"
              name="description-input"
              label="Description"
              data-testid="description-input"
              onChange={handleChange}
              value={description}
            />
          </ListItem>

          <ListItem sx={{ justifyContent: "space-between" }}>
            <TextField
              select
              variant="standard"
              SelectProps={{ native: true }}
              id="method-input"
              name="method-input"
              data-testid="method-input"
              label="Method"
              onChange={handleChange}
              value={method}
            >
              {methodInputs.map(m => (
                <option data-testid={m} value={m} key={m}>
                  {m}
                </option>
              ))}
            </TextField>

            <TextField
              label="Tag"
              variant="standard"
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
            <Button disabled={description.length < 5} sx={{ml: "auto", mt: 1}} type="submit">
              {updating === null ? "Add " : "Edit "}
              expense
            </Button>
          </ListItem>
        </List>
      </SwipeableDrawer>
    </>
  );
}
