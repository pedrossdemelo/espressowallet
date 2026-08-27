import { Tag, TransactionWithId } from "types";
import TransactionFormDrawer from "./TransactionFormDrawer";

const tagInputs: Tag[] = [
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

interface ExpenseFormDrawerProps {
  open: boolean;
  close: () => void;
  toEdit?: TransactionWithId | null;
}

export default function ExpenseFormDrawer(props: ExpenseFormDrawerProps) {
  return (
    <TransactionFormDrawer
      {...props}
      type="expense"
      tagInputs={tagInputs}
      defaultTag="Food"
      defaultValue={10}
      borderRadius="1rem 1rem 0 0"
    />
  );
}
