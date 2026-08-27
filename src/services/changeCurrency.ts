import { converter } from "constants";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { Currency, Transaction } from "types";
import batchWrapper from "./batchWrapper";
import buildConvertedMetadata from "./buildConvertedMetadata";
import deleteAllTransactions from "./deleteAllTransactions";
import { auth, db } from "./firebase";

export default async function changeCurrency(
  newBaseCurrency: Currency,
  type: "deleteAll" | "convertAll"
) {
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

      const incomes: Transaction[] = [];
      allIncomes.forEach(income => incomes.push(income.data()));

      const expenses: Transaction[] = [];
      allExpenses.forEach(expense => expenses.push(expense.data()));

      await setDoc(
        metadataToUpdate,
        buildConvertedMetadata(incomes, expenses, newBaseCurrency)
      );
      return;
    }

    default:
      return;
  }
}
