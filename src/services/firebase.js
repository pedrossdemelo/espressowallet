import { initializeApp } from "firebase/app";
import { enableIndexedDbPersistence, getFirestore } from "firebase/firestore";
import {
  getAuth,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCzHmIfEyWQgg_oFGY8ZccyeDto6WS_SZE",
  authDomain: "poliwallet.firebaseapp.com",
  projectId: "poliwallet",
  storageBucket: "poliwallet.appspot.com",
  messagingSenderId: "823847112364",
  appId: "1:823847112364:web:bc2a032be8e3e7ffdcd909",
  measurementId: "G-RW8GN5MJBY",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
enableIndexedDbPersistence(db);
