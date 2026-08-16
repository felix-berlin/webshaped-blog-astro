#!/usr/bin/env bash
#
# Write the build-time env file consumed by Dockerfile's `--mount=type=secret`.
#
# Reads the values from the current environment (Infisical's secrets-action puts
# them there via $GITHUB_ENV) and writes them %q-quoted, because the Dockerfile
# `source`s the file: an unquoted WordPress Application Password (space-separated
# groups) would otherwise truncate at the first space and try to execute the rest.
#
# Usage: scripts/write-build-env.sh [output-file] [quoted|raw]
#
# Use `raw` for a file handed to Docker Compose's own .env variable-substitution,
# which parses values literally and would keep the backslashes %q adds.

set -euo pipefail

OUT="${1:-.build.env}"
FORMAT="${2:-quoted}"

# Every var the Astro env schema declares `optional: false`. An empty one fails
# the build inside Docker with a far less obvious message than this.
REQUIRED=(
  WP_API
  WP_REST_API
  WP_AUTH_USER
  WP_AUTH_PASS
  LAST_FM_SCROBBLER_API
  SITE_URL
  GITHUB_TOKEN
  IMAGOR_HOST
  IMAGOR_SECRET
)

OPTIONAL=(
  ENABLE_ANALYTICS
  SENTRY_DSN
  SENTRY_PROJECT_ID
  SENTRY_AUTH_TOKEN
  SENTRY_ENVIRONMENT
  CODECOV_TOKEN
)

for var in "${REQUIRED[@]}"; do
  if [[ -z "${!var:-}" ]]; then
    echo "$var is empty — Infisical fetch likely failed or the secret is missing in this environment" >&2
    exit 1
  fi
done

# Optional vars empty is a valid state (e.g. Sentry disabled), not fatal — but
# silent means "why isn't Sentry reporting errors" has no lead without this line.
for var in "${OPTIONAL[@]}"; do
  if [[ -z "${!var:-}" ]]; then
    echo "note: $var is empty (optional)" >&2
  fi
done

case "$FORMAT" in
  quoted) VALUE_FMT='%q' ;;
  raw) VALUE_FMT='%s' ;;
  *)
    echo "unknown format '$FORMAT' — expected 'quoted' or 'raw'" >&2
    exit 1
    ;;
esac

: >"$OUT"
chmod 600 "$OUT"
for var in "${REQUIRED[@]}" "${OPTIONAL[@]}"; do
  # shellcheck disable=SC2059 # VALUE_FMT is a controlled format specifier
  printf "%s=${VALUE_FMT}\n" "$var" "${!var:-}" >>"$OUT"
done
