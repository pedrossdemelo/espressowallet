import { auth } from "./firebase";

export default function changeCurrency(oldBaseCurrency, newBaseCurrency, type) {
  const user = auth?.currentUser;
  if (!user) return;

  const { uid } = user;

  switch (type) {
    case "deleteAll":
      return;

    case "convertAll":
      return;

    default:
      return;
  }
}
