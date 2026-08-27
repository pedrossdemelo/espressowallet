import { DateTimePicker } from "@mui/lab";
import {
  Button,
  List,
  ListItem,
  SwipeableDrawer,
  TextField,
  TextFieldProps,
} from "@mui/material";
import { currencies } from "constants";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { addTransaction, editTransaction, getRates } from "services";
import { Tag, Transaction, TransactionWithId } from "types";

const tagInputs: Tag[] = [
  "Investments",
  "Salary",
  "Gift",
  "Savings",
  "Prize",
  "Sale",
  "Other",
];

// A transaction in progress: always has tag/value/description, and — once
// seeded from `toEdit` — everything else a real Transaction has too.
type FormState = Partial<TransactionWithId> & {
  tag: Tag;
  value: number;
  description: string;
};

const initialFormState: FormState = {
  tag: "Salary",
  value: 1000,
  description: "",
};

const paperProps = {
  style: { backgroundColor: "transparent", backgroundImage: "none" },
};

interface IncomeFormDrawerProps {
  open: boolean;
  close: () => void;
  toEdit?: TransactionWithId | null;
}

export default function IncomeFormDrawer({
  open,
  close,
  toEdit = null,
}: IncomeFormDrawerProps) {
  const baseCurrency = useSelector(state => state.wallet.baseCurrency.currency);
  initialFormState.currency = baseCurrency ?? undefined;
  const [formState, setFormState] = useState<FormState>(
    toEdit ?? initialFormState,
  );
  const [date, setDate] = useState(toEdit?.createdAt ?? new Date());
  const { tag, value, currency, description } = formState;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value: valuePair } = e.target;
    const key = name.split("-")[0];
    let numValue;
    if (key === "value") numValue = Number(valuePair);
    setFormState({
      ...formState,
      [key]: numValue ?? valuePair,
    });
  }

  function handleDateChange(date: Date | null) {
    // Non-null: matches the original, which also stored whatever the picker
    // passed without guarding against a cleared (null) date.
    setDate(date as Date);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const rates = await getRates(date);

    const income = {
      ...formState,
      baseCurrency,
      createdAt: date,
      type: "income" as const,
      exchangeRates: rates,
    };

    // Cast: see the matching comment in ExpenseFormDrawer.
    if (!toEdit) addTransaction(income as Transaction);

    if (toEdit) editTransaction(toEdit, income as TransactionWithId);

    close();
  }

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
      // No-op: matches the original, which never passed this MUI-required
      // prop either — the drawer never opens via edge-swipe.
      onOpen={() => {}}
    >
      <List
        component="form"
        sx={{
          borderRadius: "12px 12px 0 0",
          bgcolor: "background.paper",
          boxShadow: 3,
        }}
        onSubmit={handleSubmit}
      >
        <ListItem>
          <TextField
            variant="standard"
            fullWidth
            // Not a real TextField size ("small" | "medium" only) — kept as
            // the original literal value via a cast rather than changed.
            size={"large" as TextFieldProps["size"]}
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
            size={"large" as TextFieldProps["size"]}
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

        <ListItem sx={{ justifyContent: "space-between", gap: 5 }}>
          <DateTimePicker
            minDate={new Date(2000, 1, 1)}
            disableFuture
            value={date}
            label="Date"
            onChange={handleDateChange}
            renderInput={(params: TextFieldProps) => (
              <TextField size="small" {...params} />
            )}
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
              description.length < 3 ||
              description.length >= 25 ||
              value <= 0 ||
              !currency
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
