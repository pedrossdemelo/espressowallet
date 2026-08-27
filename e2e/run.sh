#!/usr/bin/env bash
#
# Brings up everything e2e/wallet.mjs needs, runs it, and tears it all down:
# the Firebase emulators, a production build wired to those emulators, and a
# preview server. Nothing here ever touches the production Firebase project.
#
#   npm run test:e2e
#
set -euo pipefail

cd "$(dirname "$0")/.."

PORT="${E2E_PORT:-3000}"
AUTH_PORT=9099
FIRESTORE_PORT=8080
LOG_DIR="$(mktemp -d)"

# The Firebase emulators shell out to `java`, and Homebrew's openjdk is
# keg-only, so it is deliberately absent from PATH on a stock macOS machine.
# macOS ships a /usr/bin/java stub that exists but fails without a real JDK,
# so probe by running it rather than by looking it up on PATH.
have_java() { java -version >/dev/null 2>&1; }

if ! have_java; then
  for candidate in /opt/homebrew/opt/openjdk/bin /usr/local/opt/openjdk/bin; do
    if [ -x "$candidate/java" ]; then
      export PATH="$candidate:$PATH"
      break
    fi
  done
fi

if ! have_java; then
  echo "e2e: needs a JRE for the Firebase emulators: brew install openjdk" >&2
  exit 1
fi

CHROME="${CHROME_PATH:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
if [ ! -x "$CHROME" ]; then
  echo "e2e: no Chrome at '$CHROME'. Set CHROME_PATH to your browser." >&2
  exit 1
fi
export CHROME_PATH="$CHROME"

pids=()
cleanup() {
  for pid in "${pids[@]:-}"; do
    kill "$pid" 2>/dev/null || true
  done
  # build/ now points at the emulators. `firebase deploy` publishes whatever
  # is in there, so it must not survive this run.
  rm -rf build
}
trap cleanup EXIT INT TERM

wait_for() {
  local url="$1" name="$2" tries=0
  until curl -sf -o /dev/null "$url" || curl -s -o /dev/null "$url"; do
    tries=$((tries + 1))
    if [ "$tries" -gt 60 ]; then
      echo "e2e: $name never came up. Log: $LOG_DIR" >&2
      exit 1
    fi
    sleep 1
  done
}

echo "e2e: starting emulators…"
npx firebase emulators:start --only auth,firestore --project espressowallet \
  >"$LOG_DIR/emulators.log" 2>&1 &
pids+=($!)
wait_for "http://127.0.0.1:$AUTH_PORT" "auth emulator"
wait_for "http://127.0.0.1:$FIRESTORE_PORT" "firestore emulator"

echo "e2e: building against the emulators…"
VITE_USE_FIREBASE_EMULATORS=true npm run build >"$LOG_DIR/build.log" 2>&1

echo "e2e: serving the build…"
npx vite preview --port "$PORT" --strictPort >"$LOG_DIR/preview.log" 2>&1 &
pids+=($!)
wait_for "http://127.0.0.1:$PORT" "preview server"

echo "e2e: running the wallet flow…"
node e2e/wallet.mjs "${1:-run}" "${2:-$LOG_DIR}"
