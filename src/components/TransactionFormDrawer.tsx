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
import { errorMessage, useSnackbar } from "context";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { addTransaction, editTransaction, getRates } from "services";
import { Tag, Transaction, TransactionType, TransactionWithId } from "types";

// A transaction in progress: always has tag/value/description, and — once
// seeded from `toEdit` — everything else a real Transaction has too.
type FormState = Partial<TransactionWithId> & {
  tag: Tag;
  value: number;
  description: string;
};

const paperProps = {
  style: { backgroundColor: "transparent", backgroundImage: "none" },
};

interface TransactionFormDrawerProps {
  type: TransactionType;
  tagInputs: Tag[];
  defaultTag: Tag;
  defaultValue: number;
  borderRadius: string;
  open: boolean;
  close: () => void;
  toEdit?: TransactionWithId | null;
}

// Shared by ExpenseFormDrawer and IncomeFormDrawer, which were previously
// two ~250-line files identical except for the tag list, the default draft,
// the "expense"/"income" literal, and — genuinely, not just cosmetically —
// a different drawer corner radius (16px vs 12px). All of that is threaded
// through as props rather than silently collapsed to one value.
export default function TransactionFormDrawer({
  type,
  tagInputs,
  defaultTag,
  defaultValue,
  borderRadius,
  open,
  close,
  toEdit = null,
}: TransactionFormDrawerProps) {
  const baseCurrency = useSelector(state => state.wallet.baseCurrency.currency);

  // A mutable per-instance draft, reused across re-renders and reset to a
  // blank form whenever the drawer reopens for a new (non-edit) transaction.
  // This has to be a ref scoped to this component instance rather than
  // module-level state: two instances of this component are mounted at
  // once (SpeedDials renders one configured for expenses, one for incomes),
  // and they must not share a draft.
  const initialFormStateRef = useRef<FormState>({
    tag: defaultTag,
    value: defaultValue,
    description: "",
  });
  initialFormStateRef.current.currency = baseCurrency ?? undefined;

  const [formState, setFormState] = useState<FormState>(
    toEdit ?? initialFormStateRef.current
  );
  const [date, setDate] = useState(toEdit?.createdAt ?? new Date());
  const [submitting, setSubmitting] = useState(false);
  const { tag, value, currency, description } = formState;
  const { showError } = useSnackbar();

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

    setSubmitting(true);
    try {
      const rates = await getRates(date);

      const transaction = {
        ...formState,
        baseCurrency,
        createdAt: date,
        type,
        exchangeRates: rates,
      };

      // Cast: `formState.currency` is optional on the type (it models an
      // in-progress draft) but is always set by submit time — the form only
      // reaches here once a base currency has loaded. `.id` is only relied
      // on below when `toEdit` is set, in which case formState was seeded
      // from it and still carries it.
      if (!toEdit) await addTransaction(transaction as Transaction);

      if (toEdit)
        await editTransaction(toEdit, transaction as TransactionWithId);

      close();
    } catch (err) {
      showError(errorMessage(err, `Couldn't save the ${type}. Try again.`));
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    if (toEdit) return;
    setFormState(initialFormStateRef.current);
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
          borderRadius,
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
            placeholder={`What was the ${type}?`}
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
            value={date}
            label="Date"
            disableFuture
            minDate={new Date(2000, 1, 1)}
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
              !currency ||
              submitting
            }
            sx={{ ml: "auto", mt: 1 }}
            type="submit"
          >
            {toEdit ? "Edit" : "Add"} {type}
          </Button>
        </ListItem>
      </List>
    </SwipeableDrawer>
  );
}
