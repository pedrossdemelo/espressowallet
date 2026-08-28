import { initializeApp } from "firebase/app";
import {
  connectAuthEmulator,
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";
import {
  connectFirestoreEmulator,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import whenIdle from "utils/whenIdle";

const firebaseConfig = {
  apiKey: "AIzaSyDk4HjU5PHhrT8MNvDNGkMKe_UblpK1hiU",
  authDomain: "espressowallet.firebaseapp.com",
  projectId: "espressowallet",
  storageBucket: "espressowallet.appspot.com",
  messagingSenderId: "658281377636",
  appId: "1:658281377636:web:ab4474e1104d9d71701471",
  measurementId: "G-0818VVPL4B",
};

const useEmulators = import.meta.env.VITE_USE_FIREBASE_EMULATORS === "true";

const app = initializeApp(firebaseConfig);

let performanceStarted = false;

/**
 * Starts Firebase Performance Monitoring.
 *
 * On a first visit this costs three network round trips before it reports
 * anything — an installations registration, a fireperf Remote Config fetch,
 * and a firelog upload. Measured on a throttled connection against
 * production, the last of them landed 9.6s into the page. Started on window
 * `load` it was doing all that while someone was typing their password, so
 * the sign-in request queued behind metrics traffic and the login button
 * looked dead.
 *
 * So it waits: the app calls this once the user is through the door, and
 * even then only when the browser is idle.
 */
export function startPerformanceMonitoring() {
  if (performanceStarted || useEmulators) return;
  performanceStarted = true;

  whenIdle(() => {
    import("firebase/performance")
      .then(({ getPerformance }) => getPerformance(app))
      .catch(() => {
        // Metrics are optional; a blocked or failed load must not surface.
      });
  });
}

export const auth = getAuth(app);

// Offline cache is configured up front rather than enabled afterwards:
// enableIndexedDbPersistence() is deprecated, and the multi-tab manager
// replaces its "second tab silently falls back to memory" behaviour with a
// cache shared across tabs. Browsers without the needed APIs fall back to
// in-memory caching on their own.
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});

export const gProvider = new GoogleAuthProvider();

// Local end-to-end runs point at `firebase emulators:start` instead of the
// production project. Never reachable in a production build: the flag is
// inlined at build time and only ever set by the local e2e script.
if (useEmulators) {
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
}
