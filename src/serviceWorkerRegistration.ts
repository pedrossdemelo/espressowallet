import whenIdle from "utils/whenIdle";

// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. The custom service worker activates updates
// immediately and reloads open app windows so they cannot remain on a broken
// cached release indefinitely.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read https://cra.link/PWA

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
  // [::1] is the IPv6 localhost address.
  window.location.hostname === "[::1]" ||
  // 127.0.0.0/8 are considered localhost for IPv4.
  window.location.hostname.match(
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/,
  ),
);

interface ServiceWorkerConfig {
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
}

export function register(config?: ServiceWorkerConfig) {
  if (import.meta.env.PROD && "serviceWorker" in navigator) {
    // The URL constructor is available in all browsers that support SW.
    const publicUrl = new URL(import.meta.env.BASE_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets; see https://github.com/facebook/create-react-app/issues/2374
      return;
    }

    // Registering the worker kicks off precaching ~1.4MB of assets. On a
    // first visit that competes with sign-in for the connection, so it waits
    // for the browser to be idle rather than firing straight off `load`.
    window.addEventListener("load", () => {
      whenIdle(() => registerWhenIdle(config));
    });
  }
}

function registerWhenIdle(config?: ServiceWorkerConfig) {
  const swUrl = `${import.meta.env.BASE_URL}service-worker.js`;

  if (isLocalhost) {
    // This is running on localhost. Let's check if a service worker still exists or not.
    checkValidServiceWorker(swUrl, config);

    // Add some additional logging to localhost, pointing developers to the
    // service worker/PWA documentation.
    navigator.serviceWorker.ready.then(() => {
      console.log(
        "This web app is being served cache-first by a service " +
          "worker. To learn more, visit https://cra.link/PWA",
      );
    });
  } else {
    // Is not localhost. Just register service worker
    registerValidSW(swUrl, config);
  }
}

function registerValidSW(swUrl: string, config?: ServiceWorkerConfig) {
  navigator.serviceWorker
    .register(swUrl, { updateViaCache: "none" })
    .then(registration => {
      // Do not wait for the browser's periodic update check. Firebase Hosting
      // serves this file separately from immutable hashed assets.
      registration.update().catch(error => {
        console.error("Couldn't check for an app update:", error);
      });

      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === "installed") {
            if (navigator.serviceWorker.controller) {
              // The custom worker activates immediately and reloads clients.
              console.log(
                "New content is available. The app will update automatically.",
              );

              // Execute callback
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.
              console.log("Content is cached for offline use.");

              // Execute callback
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch(error => {
      console.error("Error during service worker registration:", error);
    });
}

function checkValidServiceWorker(swUrl: string, config?: ServiceWorkerConfig) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl, {
    headers: { "Service-Worker": "script" },
  })
    .then(response => {
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get("content-type");
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf("javascript") === -1)
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log(
        "No internet connection found. App is running in offline mode.",
      );
    });
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(error => {
        console.error(error instanceof Error ? error.message : error);
      });
  }
}
