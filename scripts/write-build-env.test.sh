#!/usr/bin/env bash
#
# Checks for write-build-env.sh. The quoting split is the whole point of that
# script and it fails silently: a WordPress Application Password contains spaces,
# so the wrong format truncates it at the first group — and, because the Dockerfile
# `source`s the file, tries to execute the rest.
#
# Usage: scripts/write-build-env.test.sh

set -euo pipefail

cd "$(dirname "$0")/.."

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

PASS='abcd efgh ijkl mnop'

export WP_API="https://cms.example.test/graphql"
export WP_REST_API="https://cms.example.test/wp-json"
export WP_AUTH_USER="wp-user"
export WP_AUTH_PASS="$PASS"
export LAST_FM_SCROBBLER_API="https://scrobbler.example.test"
export SITE_URL="https://example.test"
export GITHUB_TOKEN="ghp_example"

fail() {
  echo "❌ $1" >&2
  exit 1
}

# 1. quoted: survives `source` with spaces intact
./scripts/write-build-env.sh "$TMP/build.env" quoted
# shellcheck disable=SC1091 # generated at test time
got="$(set -a && . "$TMP/build.env" && printf '%s' "$WP_AUTH_PASS")"
[[ "$got" == "$PASS" ]] || fail "quoted format truncated the password: '$got'"

# 2. raw: parsed literally by Compose env_file, so no escapes may appear
./scripts/write-build-env.sh "$TMP/compose.env" raw
grep -q "^WP_AUTH_PASS=${PASS}$" "$TMP/compose.env" ||
  fail "raw format did not write the password verbatim"

# 3. unset optional vars are omitted, not written empty — an empty string is
#    *exported* by the Dockerfile's `source` and then fails Astro's url validator.
grep -q "^SENTRY_DSN=" "$TMP/build.env" && fail "unset SENTRY_DSN was written anyway"

# 4. a set optional var is still written
SENTRY_DSN="https://sentry.example.test/1" ./scripts/write-build-env.sh "$TMP/opt.env" raw
grep -q "^SENTRY_DSN=https://sentry.example.test/1$" "$TMP/opt.env" ||
  fail "set SENTRY_DSN was not written"

# 5. an empty required var aborts instead of producing a broken build
WP_AUTH_PASS="" ./scripts/write-build-env.sh "$TMP/bad.env" quoted 2>/dev/null &&
  fail "empty WP_AUTH_PASS did not abort"

# 6. an unknown format aborts
./scripts/write-build-env.sh "$TMP/bad.env" sideways 2>/dev/null &&
  fail "unknown format did not abort"

echo "✅ write-build-env.sh checks passed"
