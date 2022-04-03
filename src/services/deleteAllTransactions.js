import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { batchWrapper } from "services";
import { auth, db } from "./firebase";

export default async function deleteAllTransactions() {
  const user = auth?.currentUser;
  if (!user) return;

  const { uid } = user;

  const allExpenses = await getDocs(
    collection(db, "userData", uid, "expenses")
  );
  const allIncomes = await getDocs(collection(db, "userData", uid, "incomes"));

  const metadataToUpdate = doc(db, "userData", uid);

  // TODO: Find a way to keep the base currency
  await setDoc(metadataToUpdate, { balance: 0 }, { merge: true });

  await batchWrapper(allExpenses, "delete");

  await batchWrapper(allIncomes, "delete");

  return;
}
