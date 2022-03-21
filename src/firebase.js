// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzHmIfEyWQgg_oFGY8ZccyeDto6WS_SZE",
  authDomain: "poliwallet.firebaseapp.com",
  projectId: "poliwallet",
  storageBucket: "poliwallet.appspot.com",
  messagingSenderId: "823847112364",
  appId: "1:823847112364:web:bc2a032be8e3e7ffdcd909",
  measurementId: "G-RW8GN5MJBY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);