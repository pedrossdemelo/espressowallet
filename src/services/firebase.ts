import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { enableIndexedDbPersistence, getFirestore } from "firebase/firestore";
import { getPerformance } from "firebase/performance";

const firebaseConfig = {
  apiKey: "AIzaSyDk4HjU5PHhrT8MNvDNGkMKe_UblpK1hiU",
  authDomain: "espressowallet.firebaseapp.com",
  projectId: "espressowallet",
  storageBucket: "espressowallet.appspot.com",
  messagingSenderId: "658281377636",
  appId: "1:658281377636:web:ab4474e1104d9d71701471",
  measurementId: "G-0818VVPL4B",
};

const app = initializeApp(firebaseConfig);
getPerformance(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const gProvider = new GoogleAuthProvider();
// Rejects with "failed-precondition" when another tab already has
// persistence enabled, and "unimplemented" on browsers that lack the
// needed APIs — both are fine to ignore (the app just falls back to
// in-memory caching for this tab).
enableIndexedDbPersistence(db).catch(() => {});
