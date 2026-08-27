import { converter } from "constants";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { Currency, MonthMetadata } from "types";
import { calculateRate, dateToMMYYYY } from "utils";
import batchWrapper from "./batchWrapper";
import deleteAllTransactions from "./deleteAllTransactions";
import { auth, db } from "./firebase";

type NewMetadata = {
  currency: Currency;
  balance: number;
} & { [monthKey: string]: MonthMetadata | Currency | number };

const emptyMonth = (): MonthMetadata => ({
  balance: 0,
  incomes: 0,
  totalIncome: 0,
  expenses: 0,
  totalExpense: 0,
});

// `metadata[key]` can statically be a MonthMetadata, a Currency, or a number
// (see NewMetadata above) — but by convention every key besides "currency"
// and "balance" is an "MM/YYYY" string holding a MonthMetadata bucket.
function getOrCreateMonthMetadata(
  metadata: NewMetadata,
  key: string,
): MonthMetadata {
  const value = metadata[key];
  if (typeof value === "object") return value;
  const month = emptyMonth();
  metadata[key] = month;
  return month;
}

export default async function changeCurrency(
  newBaseCurrency: Currency,
  type: "deleteAll" | "convertAll",
) {
  const user = auth?.currentUser;
  if (!user) return;

  const { uid } = user;

  const metadataToUpdate = doc(db, "userData", uid);

  const allIncomes = await getDocs(
    collection(db, "userData", uid, "incomes").withConverter(converter),
  );

  const allExpenses = await getDocs(
    collection(db, "userData", uid, "expenses").withConverter(converter),
  );

  switch (type) {
    case "deleteAll": {
      await deleteAllTransactions();

      await setDoc(metadataToUpdate, { currency: newBaseCurrency, balance: 0 });
      return;
    }

    case "convertAll": {
      await batchWrapper(allIncomes, "update", {
        baseCurrency: newBaseCurrency,
      });

      await batchWrapper(allExpenses, "update", {
        baseCurrency: newBaseCurrency,
      });

      const newMetadata: NewMetadata = {
        currency: newBaseCurrency,
        balance: 0,
      };

      allIncomes.forEach(income => {
        const data = income.data();
        const date = dateToMMYYYY(data.createdAt);

        data.baseCurrency = newBaseCurrency;

        const total = calculateRate(data);

        newMetadata.balance += total;

        const month = getOrCreateMonthMetadata(newMetadata, date);
        month.balance += total;
        month.incomes += 1;
        month.totalIncome += total;
      });

      allExpenses.forEach(expense => {
        const data = expense.data();
        const date = dateToMMYYYY(data.createdAt);

        data.baseCurrency = newBaseCurrency;

        const total = calculateRate(data);

        const month = getOrCreateMonthMetadata(newMetadata, date);
        month.balance -= total;
        month.expenses += 1;
        month.totalExpense += total;
      });

      await setDoc(metadataToUpdate, newMetadata);
      return;
    }

    default:
      return;
  }
}
