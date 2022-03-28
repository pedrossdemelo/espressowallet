import { converter } from "constants";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { calculateRate, dateToMMYYYY } from "utils";
import batchWrapper from "./batchWrapper";
import deleteAllTransactions from "./deleteAllTransactions";
import { auth, db } from "./firebase";

export default async function changeCurrency(newBaseCurrency, type) {
  const user = auth?.currentUser;
  if (!user) return;

  const { uid } = user;

  const metadataToUpdate = doc(db, "userData", uid);

  const allIncomes = await getDocs(
    collection(db, "userData", uid, "incomes").withConverter(converter)
  );

  const allExpenses = await getDocs(
    collection(db, "userData", uid, "expenses").withConverter(converter)
  );

  switch (type) {
    case "deleteAll":
      await deleteAllTransactions();

      await setDoc(metadataToUpdate, { currency: newBaseCurrency, balance: 0 });
      return;

    case "convertAll":
      await batchWrapper(allIncomes, "update", {
        baseCurrency: newBaseCurrency,
      });

      await batchWrapper(allExpenses, "update", {
        baseCurrency: newBaseCurrency,
      });

      const newMetadata = {
        currency: newBaseCurrency,
        balance: 0,
      };

      allIncomes.forEach(income => {
        const data = income.data();
        const date = dateToMMYYYY(data.createdAt);

        data.baseCurrency = newBaseCurrency;

        const total = calculateRate(data);

        newMetadata.balance += total;

        if (newMetadata[date]) {
          newMetadata[date].balance += total;
          newMetadata[date].incomes += 1;
          newMetadata[date].totalIncome += total;
        }

        if (!newMetadata[date]) {
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

        if (newMetadata[date]) {
          newMetadata[date].balance -= total;
          newMetadata[date].expenses += 1;
          newMetadata[date].totalExpense += total;
        }

        if (!newMetadata[date]) {
          newMetadata[date] = {
            balance: -total,
            expenses: 1,
            totalExpense: total,
          };
        }
      });

      await setDoc(metadataToUpdate, newMetadata);
      return;

    default:
      return;
  }
}
