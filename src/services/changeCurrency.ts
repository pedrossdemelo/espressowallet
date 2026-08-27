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

// `metadata[key]` can statically be a MonthMetadata, a Currency, or a number
// (see NewMetadata above) — but by convention every key besides "currency"
// and "balance" is an "MM/YYYY" string holding a MonthMetadata bucket.
function getMonthMetadata(
  metadata: NewMetadata,
  key: string,
): MonthMetadata | undefined {
  const value = metadata[key];
  return typeof value === "object" ? value : undefined;
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

        const month = getMonthMetadata(newMetadata, date);

        if (month) {
          month.balance += total;
          // Non-null: matches the original untyped arithmetic exactly,
          // including its behavior (NaN) for a month that has both incomes
          // and expenses — see the migration report for details.
          month.incomes! += 1;
          month.totalIncome! += total;
        } else {
          newMetadata[date] = {
            balance: total,
            incomes: 1,
            totalIncome: total,
          };
        }
      });

      allExpenses.forEach(expense => {
        const data = expense.data();
        const date = dateToMMYYYY(data.createdAt);

        data.baseCurrency = newBaseCurrency;

        const total = calculateRate(data);

        const month = getMonthMetadata(newMetadata, date);

        if (month) {
          month.balance -= total;
          // Non-null: see the matching comment in the incomes loop above.
          month.expenses! += 1;
          month.totalExpense! += total;
        } else {
          newMetadata[date] = {
            balance: -total,
            expenses: 1,
            totalExpense: total,
          };
        }
      });

      await setDoc(metadataToUpdate, newMetadata);
      return;
    }

    default:
      return;
  }
}
