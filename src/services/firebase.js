import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { enableIndexedDbPersistence, getFirestore } from "firebase/firestore";
import { getPerformance } from "firebase/performance";

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
getPerformance(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const gProvider = new GoogleAuthProvider();
enableIndexedDbPersistence(db);
