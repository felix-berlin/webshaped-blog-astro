#!/usr/bin/env bash
#
# Write the build-time env file consumed by Dockerfile's `--mount=type=secret`.
#
# Reads the values from the current environment — put there by `varlock run --`,
# which resolves them from .env.schema — and writes them %q-quoted, because the
# Dockerfile
# `source`s the file: an unquoted WordPress Application Password (space-separated
# groups) would otherwise truncate at the first space and try to execute the rest.
#
# Usage: scripts/write-build-env.sh [output-file] [quoted|raw]
#
# Use `raw` for a file handed to Docker Compose's `env_file:`, which parses values
# literally and would keep the backslashes %q adds.

set -euo pipefail

OUT="${1:-.build.env}"
FORMAT="${2:-quoted}"

# Every var .env.schema marks `@required`. An empty one fails the build inside
# Docker with a far less obvious message than this.
# Keep in sync when adding a required var to .env.schema.
REQUIRED=(
  WP_API
  WP_REST_API
  WP_AUTH_USER
  WP_AUTH_PASS
  LAST_FM_SCROBBLER_API
  SITE_URL
  GITHUB_TOKEN
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
  # Skip empties: the Dockerfile `source`s this file, so writing SENTRY_DSN=''
  # *exports* it as an empty string, which is not the same as unset. An optional
  # item then still runs its validator — and `@type=url` fails on "" — which is
  # exactly the build failure this script exists to pre-empt.
  [[ -n "${!var:-}" ]] || continue
  # shellcheck disable=SC2059 # VALUE_FMT is a controlled format specifier
  printf "%s=${VALUE_FMT}\n" "$var" "${!var}" >>"$OUT"
done
