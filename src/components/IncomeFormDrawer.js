import { DateTimePicker } from "@mui/lab";
import {
  Button,
  List,
  ListItem,
  SwipeableDrawer,
  TextField
} from "@mui/material";
import {
  addDoc,
  collection,
  doc, Timestamp,
  updateDoc
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../services/firebase";
import getRates from "../services/getRates";

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

const converter = {
  toFirestore(income) {
    return {
      ...income,
      type: "income",
      createdAt: Timestamp.fromDate(income.createdAt),
    };
  },
};

export default function IncomeFormDrawer({ open, close, toEdit = null }) {
  const [user] = useAuthState(auth);

  const userIncomes = collection(
    db,
    `userData/${user.uid}/incomes`
  ).withConverter(converter);

  const [currencies, setCurrencies] = useState([]);

  const [formState, setFormState] = useState(toEdit ?? initialFormState);
  const [date, setDate] = useState(toEdit?.createdAt ?? new Date());
  const { tag, value, currency, description } = formState;

  function handleChange(e) {
    const { name, value: valuePair } = e.target;
    const key = name.split("-")[0];
    setFormState({
      ...formState,
      [key]: valuePair,
    });
  }

  function handleDateChange(date) {
    setDate(date);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const { data } = await getRates();

    const income = { ...formState, createdAt: date, exchangeRates: data };

    if (!toEdit) addDoc(userIncomes, income);

    if (toEdit) {
      const updateLocation = doc(
        db,
        "userData",
        user.uid,
        "incomes",
        toEdit?.id
      );
      updateDoc(updateLocation, income);
    }

    close();
  }

  useEffect(() => {
    (async () => {
      const { data, error } = await getRates();
      if (error) return;
      setCurrencies(Object.keys(data));
    })();
  }, []);

  useEffect(() => {
    if (toEdit) return;
    setFormState(initialFormState);
    setDate(new Date());
  }, [open, toEdit]);

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

        <ListItem sx={{ justifyContent: "space-between" }}>
          <DateTimePicker
            disableFuture
            value={date}
            label="Date"
            onChange={handleDateChange}
            renderInput={params => <TextField size="small" {...params} />}
            ampm={false}
            ampmInClock={false}
          />

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
            {toEdit ? "Edit" : "Add"} income
          </Button>
        </ListItem>
      </List>
    </SwipeableDrawer>
  );
}
