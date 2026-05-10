#!/bin/bash

set -euo pipefail

# Docker Smoke Test Script
# This script boots the Docker Compose stack and validates the proxy behavior.

PROJECT_NAME="webshaped-blog-astro-smoke"
COMPOSE_FILE="compose.yaml"
HOST_PORT="${HOST_PORT:-8080}"
BASE_URL="http://127.0.0.1:${HOST_PORT}"
APP_CONTAINER_NAME="webshaped-blog-astro"
TIMEOUT=30
POLL_INTERVAL=2
TMP_DIR="$(mktemp -d)"
COMPOSE_LOG_FILE="./docker-smoke-test-compose.log"

echo "🐳 Docker Smoke Test"
echo "===================="

echo ""

# Step 2.5: Validate nginx config syntax
echo "🔍 Step 2.5: Checking nginx config syntax (nginx -t)..."
if ! compose exec proxy nginx -t; then
  echo "❌ nginx config test failed"
  exit 1
fi
echo "✅ nginx config syntax is valid"
echo ""

compose() {
  docker compose -p "${PROJECT_NAME}" -f "${COMPOSE_FILE}" "$@"
}

remove_existing_app_container() {
  if docker ps -a --format '{{.Names}}' | grep -q "^${APP_CONTAINER_NAME}$"; then
    echo "ℹ️  Removing existing ${APP_CONTAINER_NAME} container"
    docker rm -f "${APP_CONTAINER_NAME}" >/dev/null 2>&1 || true
  fi
}

header_value() {
  local header_file=$1
  local header_name=$2

  awk -v name="${header_name}" 'BEGIN { IGNORECASE = 1 }
    $0 ~ "^" name ":" {
      sub(/^[^:]+:[[:space:]]*/, "", $0)
      sub(/\r$/, "", $0)
      print
      exit
    }
  ' "${header_file}"
}

run_request() {
  local name=$1
  local path=$2
  shift 2

  local headers_file="${TMP_DIR}/${name}.headers"
  local body_file="${TMP_DIR}/${name}.body"
  local status

  status=$(curl --silent --show-error \
    --output "${body_file}" \
    --dump-header "${headers_file}" \
    --write-out "%{http_code}" \
    "$@" \
    "${BASE_URL}${path}")

  echo "${status}|${headers_file}|${body_file}"
}

assert_status() {
  local actual=$1
  local expected=$2
  local description=$3

  if [ "${actual}" != "${expected}" ]; then
    echo "❌ ${description}: expected status ${expected}, got ${actual}"
    exit 1
  fi

  echo "✅ ${description}"
}

assert_header_equals() {
  local headers_file=$1
  local header_name=$2
  local expected=$3
  local description=$4
  local actual

  actual=$(header_value "${headers_file}" "${header_name}")
  if [ "${actual}" != "${expected}" ]; then
    echo "❌ ${description}: expected ${header_name}=${expected}, got ${actual:-<missing>}"
    exit 1
  fi

  echo "✅ ${description}"
}

assert_header_contains() {
  local headers_file=$1
  local header_name=$2
  local expected_fragment=$3
  local description=$4
  local actual

  actual=$(header_value "${headers_file}" "${header_name}")
  if ! printf '%s' "${actual}" | grep -Fqi "${expected_fragment}"; then
    echo "❌ ${description}: expected ${header_name} to contain ${expected_fragment}, got ${actual:-<missing>}"
    exit 1
  fi

  echo "✅ ${description}"
}

# Cleanup function
cleanup() {
  local exit_code=$?
  echo ""
  echo "🧹 Cleaning up..."

  if [ "${exit_code}" -ne 0 ]; then
    echo "📋 Saving compose logs to ${COMPOSE_LOG_FILE}..."
    compose logs --no-color > "${COMPOSE_LOG_FILE}" 2>&1 || true
  fi

  compose down --remove-orphans >/dev/null 2>&1 || true
  remove_existing_app_container
  rm -rf "${TMP_DIR}"
  echo "✅ Compose stack cleaned up"

  exit $exit_code
}

trap cleanup EXIT

# Step 1: Start compose stack
echo "📦 Step 1: Starting Docker Compose stack..."
compose down --remove-orphans >/dev/null 2>&1 || true
remove_existing_app_container
if compose up --build -d; then
  echo "✅ Compose stack started"
else
  echo "❌ Failed to start Docker Compose stack"
  exit 1
fi

echo ""

# Step 2: Wait for proxy to be ready
echo "⏳ Step 2: Waiting for proxy on 127.0.0.1:${HOST_PORT}..."
elapsed=0
while [ $elapsed -lt $TIMEOUT ]; do
  if curl --silent --show-error --output /dev/null --header "Host: webshaped.de" "${BASE_URL}/" > /dev/null 2>&1; then
    echo "✅ Proxy is responding"
    break
  fi

  elapsed=$((elapsed + POLL_INTERVAL))
  if [ $elapsed -lt $TIMEOUT ]; then
    echo "   Waiting... ($elapsed/$TIMEOUT seconds)"
    sleep $POLL_INTERVAL
  fi
done

if [ $elapsed -ge $TIMEOUT ]; then
  echo "❌ Proxy failed to become ready within ${TIMEOUT} seconds"
  echo ""
  echo "📋 Docker Compose services:"
  compose ps || true
  echo ""
  echo "📋 Docker Compose logs:"
  compose logs --no-color || true
  exit 1
fi

echo ""

# Step 3: Run smoke tests
echo "🧪 Step 3: Running smoke tests..."
echo ""

echo "  3a. Testing root response for webshaped.de"
IFS='|' read -r root_status root_headers _ <<< "$(run_request root / --header 'Host: webshaped.de')"
assert_status "${root_status}" "200" "Root returns HTTP 200"
assert_header_contains "${root_headers}" "content-type" "text/html" "Root returns HTML"

echo ""
echo "  3b. Testing www redirect"
IFS='|' read -r www_status www_headers _ <<< "$(run_request www-redirect '/?utm_source=smoke' --header 'Host: www.webshaped.de')"
assert_status "${www_status}" "301" "www host redirects"
assert_header_equals "${www_headers}" "location" "http://webshaped.de/?utm_source=smoke" "www redirect location"

echo ""
echo "  3c. Testing legacy redirect"
IFS='|' read -r legacy_status legacy_headers _ <<< "$(run_request legacy-redirect '/stockfoto-sammlung/?ref=legacy' --header 'Host: webshaped.de')"
assert_status "${legacy_status}" "301" "Legacy URL redirects"
assert_header_equals "${legacy_headers}" "location" "/de/posts/stockfoto-sammlung?ref=legacy" "Legacy redirect location"

echo ""
echo "  3d. Testing Brotli encoding"
IFS='|' read -r br_status br_headers _ <<< "$(run_request br / --header 'Host: webshaped.de' --header 'Accept-Encoding: br')"
assert_status "${br_status}" "200" "Brotli request returns HTTP 200"
assert_header_equals "${br_headers}" "content-encoding" "br" "Brotli encoding is enabled"

echo ""
echo "  3e. Testing gzip encoding"
IFS='|' read -r gzip_status gzip_headers _ <<< "$(run_request gzip / --header 'Host: webshaped.de' --header 'Accept-Encoding: gzip')"
assert_status "${gzip_status}" "200" "gzip request returns HTTP 200"
assert_header_equals "${gzip_headers}" "content-encoding" "gzip" "gzip encoding is enabled"
assert_header_contains "${gzip_headers}" "vary" "Accept-Encoding" "gzip response varies on Accept-Encoding"

echo ""
echo "  3f. Testing 404 handling"
IFS='|' read -r missing_status _ _ <<< "$(run_request missing /nonexistent --header 'Host: webshaped.de')"
assert_status "${missing_status}" "404" "Missing pages return HTTP 404"

echo ""

# Step 4: Check logs for errors
echo "📋 Step 4: Checking Docker Compose logs for errors..."
if compose logs --no-color 2>&1 | grep -Eiq 'error|exception|fatal'; then
  echo "❌ Potential errors found in Docker Compose logs:"
  compose logs --no-color 2>&1 | grep -Ei 'error|exception|fatal' || true
  exit 1
fi

echo "✅ No obvious errors in Docker Compose logs"

echo ""
echo "================================================"
echo "✨ All smoke tests passed!"
echo "================================================"
echo ""

exit 0
