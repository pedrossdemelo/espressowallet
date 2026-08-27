#!/usr/bin/env bash
#
# Runs a command with a JRE on PATH. The Firebase emulators shell out to
# `java`, and Homebrew's openjdk is keg-only, so it is deliberately absent
# from PATH on a stock macOS machine.
#
#   bash scripts/with-jre.sh <command> [args...]
#
set -euo pipefail

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
  echo "This needs a JRE for the Firebase emulators: brew install openjdk" >&2
  exit 1
fi

exec "$@"
