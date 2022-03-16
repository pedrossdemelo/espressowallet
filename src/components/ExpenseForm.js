import { Add, ArrowDownward, ArrowUpward } from "@mui/icons-material";
import {
  accordionActionsClasses,
  Box,
  Button,
  Fab,
  List,
  ListItem,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  SwipeableDrawer,
  TextField,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import getRates from "../services/getRates";
import { addExpenseThunk } from "../store/actions";

const methodInputs = ["Cash", "Credit Card", "Debit Card"];

const tagInputs = [
  "Food",
  "Education",
  "Eletronics",
  "Household",
  "Clothing",
  "Entertainment",
  "Work",
  "Transportation",
  "Health",
  "Payment",
  "Other",
];

const fabStyle = { position: "fixed", bottom: "1rem", right: "1rem" };

const initialFormState = {
  method: "Cash",
  tag: "Food",
  value: 10,
  currency: "USD",
  description: "",
};

const paperProps = { elevation: 0, style: { backgroundColor: "transparent" } };

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

  const actions = [
    {
      icon: <ArrowDownward />,
      name: "Expense",
      onClick: open,
      color: "error.light"
    },
    {
      icon: <ArrowUpward />,
      name: "Income",
      onClick: open,
      color: "success.light"
    },
  ];

  return (
    <>
      <SpeedDial
        ariaLabel="New expense or income"
        sx={{ position: "fixed", bottom: "1rem", right: "1rem" }}
        icon={<SpeedDialIcon />}
      >
        {actions.map(action => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.onClick}
            tooltipOpen
            FabProps={{ sx: { bgcolor: action.color, color: "background.paper"} }}
          />
        ))}
      </SpeedDial>

      <SwipeableDrawer
        onClose={close}
        PaperProps={paperProps}
        open={isDrawerOpen}
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
              placeholder="What was the expense?"
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
              variant="outlined"
              SelectProps={{ native: true }}
              id="method-input"
              name="method-input"
              size="small"
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
              Add expense
            </Button>
          </ListItem>
        </List>
      </SwipeableDrawer>
    </>
  );
}
