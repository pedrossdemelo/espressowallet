import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { auth, db, logout } from "../services";
import { addDoc, collection, query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const converter = {
  toFirestore: expense => expense,
  fromFirestore: snapshot => {
    const data = snapshot.data();
    return {
      ...data,
      cum: "yes",
      id: snapshot.id,
    };
  },
};

const expensesRef = collection(db, "expenses").withConverter(converter);

const queries = [
  query(expensesRef, where("description", "!=", "Coco fezes")),
  query(expensesRef, where("description", "==", "Coco fezes")),
];

export default function UserConfig() {
  const [user, loading] = useAuthState(auth);
  const history = useHistory();
  const [query, setQuery] = useState(0);
  const changeQuery = () => setQuery((query + 1) % 2);
  const q = queries[query];
  const [expenses, dataLoading] = useCollectionData(q);

  const descriptionRef = useRef();
  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div>{user?.email}</div>
      <button
        onClick={async () => {
          await logout();
          history.push("/");
        }}
      >
        Logout
      </button>
      {dataLoading && (
        <div style={{ backgroundColor: "red", height: "100vh" }}>
          Loading...
        </div>
      )}
      {!dataLoading &&
        expenses?.map(expense => (
          <div key={expense.id}>
            <div>{expense.description}</div>
            <div>{JSON.stringify(expense)}</div>
          </div>
        ))}
      <button onClick={changeQuery}>change</button>

      <br />

      <input ref={descriptionRef}></input>
      <button
        onClick={async () => {
          const dscp = descriptionRef.current.value;
          await addDoc(expensesRef, { description: dscp, value: 0 });
        }}
      >
        upload
      </button>
    </div>
  );
}
