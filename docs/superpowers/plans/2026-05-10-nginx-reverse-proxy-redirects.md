# Nginx Reverse Proxy Redirects Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Brotli-capable Nginx proxy in front of the Astro SSR container that handles `www` host canonicalization, fixed legacy post redirects, and compressed proxied responses.

**Architecture:** Keep the existing Astro app as the internal `app` service and add a public `proxy` service using a pinned Brotli-enabled Nginx image. Move redirect behavior into a central Nginx mapping, route all other traffic to `app:4321`, and validate the stack through an expanded Docker smoke test that targets the proxy entrypoint.

**Tech Stack:** Docker Compose, Nginx (`fholzer/nginx-brotli:v1.30.0`), Astro SSR Node runtime, Bash smoke tests, GitHub Actions

---

## File Structure

- Modify: `compose.yaml`
  Responsibility: wire the new `proxy` and internal `app` services together and make the external host port configurable for smoke tests.
- Create: `nginx/nginx.conf`
  Responsibility: top-level Nginx runtime config, logging, gzip, Brotli, and `conf.d` include.
- Create: `nginx/conf.d/webshaped.conf`
  Responsibility: host canonicalization, legacy redirect mapping, proxy headers, and upstream pass-through.
- Modify: `scripts/docker-smoke-test.sh`
  Responsibility: build and start the compose stack, hit the proxy entrypoint, and assert redirects plus compression.
- Modify: `.github/workflows/docker-smoke-test.yml`
  Responsibility: rerun smoke tests when proxy config changes.
- Modify: `README.md`
  Responsibility: document the new Docker entrypoint and local port override.
- Modify: `docs/DOCKER_SMOKE_TEST.md`
  Responsibility: document the proxy-aware smoke-test behavior and new checks.

## Task 1: Make the smoke test fail on missing proxy behavior

**Files:**
- Modify: `scripts/docker-smoke-test.sh`
- Modify: `.github/workflows/docker-smoke-test.yml`

- [ ] **Step 1: Rewrite the smoke test around `docker compose` and proxy assertions**

Replace `scripts/docker-smoke-test.sh` with this proxy-aware version:

```bash
#!/bin/bash

set -euo pipefail

PROJECT_NAME="webshaped-blog-astro-smoke"
HOST_PORT="${HOST_PORT:-8080}"
TIMEOUT=60
POLL_INTERVAL=2

echo "🐳 Docker Smoke Test"
echo "===================="
echo ""

cleanup() {
  local exit_code=$?
  echo ""
  echo "🧹 Cleaning up..."
  docker compose -p "${PROJECT_NAME}" -f compose.yaml down --remove-orphans >/dev/null 2>&1 || true
  exit "$exit_code"
}

trap cleanup EXIT

curl_headers() {
  local path="$1"
  shift
  curl -sS -D - -o /dev/null "$@" "http://127.0.0.1:${HOST_PORT}${path}"
}

echo "📦 Step 1: Building and starting compose stack..."
HOST_PORT="${HOST_PORT}" docker compose -p "${PROJECT_NAME}" -f compose.yaml up -d --build
echo "✅ Compose stack started"
echo ""

echo "⏳ Step 2: Waiting for proxy to respond..."
elapsed=0
while [ "$elapsed" -lt "$TIMEOUT" ]; do
  if curl -sf -H 'Host: webshaped.de' "http://127.0.0.1:${HOST_PORT}/" >/dev/null 2>&1; then
    echo "✅ Proxy is healthy and responding"
    break
  fi

  elapsed=$((elapsed + POLL_INTERVAL))
  if [ "$elapsed" -lt "$TIMEOUT" ]; then
    echo "   Waiting... (${elapsed}/${TIMEOUT} seconds)"
    sleep "$POLL_INTERVAL"
  fi
done

if [ "$elapsed" -ge "$TIMEOUT" ]; then
  echo "❌ Proxy failed to become healthy within ${TIMEOUT} seconds"
  echo ""
  docker compose -p "${PROJECT_NAME}" -f compose.yaml logs || true
  exit 1
fi

echo ""
echo "🧪 Step 3: Running proxy smoke tests..."

echo "  3a. Testing root response through proxy"
root_headers=$(curl_headers "/" -H 'Host: webshaped.de')
echo "$root_headers" | grep -q 'HTTP/1.1 200 OK'
echo "$root_headers" | grep -qi '^content-type: text/html'
echo "  ✅ Root response is HTML via proxy"

echo ""
echo "  3b. Testing www to non-www redirect"
www_headers=$(curl_headers "/?utm_source=smoke" -H 'Host: www.webshaped.de')
echo "$www_headers" | grep -q 'HTTP/1.1 301 Moved Permanently'
echo "$www_headers" | grep -q '^Location: http://webshaped.de/?utm_source=smoke'
echo "  ✅ Host canonicalization works"

echo ""
echo "  3c. Testing legacy redirect"
legacy_headers=$(curl_headers "/stockfoto-sammlung/?ref=legacy" -H 'Host: webshaped.de')
echo "$legacy_headers" | grep -q 'HTTP/1.1 301 Moved Permanently'
echo "$legacy_headers" | grep -q '^Location: /de/posts/stockfoto-sammlung?ref=legacy'
echo "  ✅ Legacy redirect works"

echo ""
echo "  3d. Testing Brotli compression"
brotli_headers=$(curl_headers "/" -H 'Host: webshaped.de' -H 'Accept-Encoding: br')
echo "$brotli_headers" | grep -qi '^content-encoding: br'
echo "  ✅ Brotli compression works"

echo ""
echo "  3e. Testing gzip compression"
gzip_headers=$(curl_headers "/" -H 'Host: webshaped.de' -H 'Accept-Encoding: gzip')
echo "$gzip_headers" | grep -qi '^content-encoding: gzip'
echo "$gzip_headers" | grep -qi '^vary: Accept-Encoding'
echo "  ✅ Gzip compression works"

echo ""
echo "  3f. Testing 404 passthrough"
not_found_status=$(curl -s -o /dev/null -w '%{http_code}' -H 'Host: webshaped.de' "http://127.0.0.1:${HOST_PORT}/nonexistent")
if [ "$not_found_status" != "404" ]; then
  echo "  ❌ Expected 404, got ${not_found_status}"
  exit 1
fi
echo "  ✅ 404 passthrough works"

echo ""
echo "📋 Step 4: Checking logs for errors..."
if docker compose -p "${PROJECT_NAME}" -f compose.yaml logs 2>&1 | grep -qi 'error\|exception\|fatal'; then
  echo "⚠️  Potential errors found in logs:"
  docker compose -p "${PROJECT_NAME}" -f compose.yaml logs | grep -i 'error\|exception\|fatal' || true
  exit 1
fi
echo "✅ No obvious errors in logs"

echo ""
echo "================================================"
echo "✨ All smoke tests passed!"
echo "================================================"
```

- [ ] **Step 2: Expand workflow trigger paths so proxy config changes run CI**

Update `.github/workflows/docker-smoke-test.yml` paths to include the proxy config directory:

```yaml
on:
  pull_request:
    paths:
      - "Dockerfile"
      - "compose.yaml"
      - "nginx/**"
      - "scripts/docker-smoke-test.sh"
      - ".github/workflows/docker-smoke-test.yml"
      - ".env.pipeline"
  push:
    branches:
      - main
      - beta
    paths:
      - "Dockerfile"
      - "compose.yaml"
      - "nginx/**"
      - "scripts/docker-smoke-test.sh"
      - ".github/workflows/docker-smoke-test.yml"
      - ".env.pipeline"
```

- [ ] **Step 3: Run the smoke test to verify it fails before the proxy exists**

Run:

```bash
HOST_PORT=8080 ./scripts/docker-smoke-test.sh
```

Expected: FAIL while starting the compose stack or while waiting for the proxy, because `compose.yaml` still has no `proxy` service and nothing serves the new redirect/compression assertions.

- [ ] **Step 4: Commit the failing-test setup**

```bash
git add .github/workflows/docker-smoke-test.yml scripts/docker-smoke-test.sh
git commit -m "test: add proxy smoke test expectations"
```

## Task 2: Add the Nginx proxy service and configuration

**Files:**
- Create: `nginx/nginx.conf`
- Create: `nginx/conf.d/webshaped.conf`
- Modify: `compose.yaml`

- [ ] **Step 1: Create the top-level Nginx runtime config**

Create `nginx/nginx.conf` with the shared HTTP and compression settings:

```nginx
worker_processes auto;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;

    sendfile on;
    tcp_nopush on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    server_tokens off;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_min_length 256;
    gzip_types
        text/plain
        text/css
        text/xml
        application/javascript
        application/json
        application/rss+xml
        application/xml
        image/svg+xml;

    brotli on;
    brotli_comp_level 5;
    brotli_min_length 256;
    brotli_types
        text/plain
        text/css
        text/xml
        application/javascript
        application/json
        application/rss+xml
        application/xml
        image/svg+xml;

    include /etc/nginx/conf.d/*.conf;
}
```

- [ ] **Step 2: Create the host canonicalization and redirect config**

Create `nginx/conf.d/webshaped.conf` with one central regex-based slug map and the reverse proxy:

```nginx
map $http_x_forwarded_proto $redirect_scheme {
    default $scheme;
    https https;
}

map $host $canonical_host {
    default "";
    www.webshaped.de webshaped.de;
}

map $uri $legacy_post_slug {
    default "";
    ~^/(?<legacy_slug>(automatische-matomo-backups|matomo-tracking-script-optimal-einbinden|gutenberg-standard-vollbildmodus-deaktivieren-wordpress-5-4|wordpress-comment-form-validation-interaktiv-mit-javascript|code-dokumentieren-leicht-gemacht-vs-code-extension-guide|datenschutz-checkbox-fuer-wordpress-kommentare-ohne-plugin|stockfoto-sammlung))/?$ $legacy_slug;
}

server {
    listen 80;
    server_name webshaped.de www.webshaped.de _;

    if ($canonical_host != "") {
        return 301 $redirect_scheme://$canonical_host$request_uri;
    }

    if ($legacy_post_slug != "") {
        return 301 /de/posts/$legacy_post_slug$is_args$args;
    }

    location / {
        proxy_http_version 1.1;
        proxy_pass http://app:4321;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Connection "";
    }
}
```

- [ ] **Step 3: Wire the proxy and internal app services together in Compose**

Replace `compose.yaml` with this structure:

```yaml
services:
  proxy:
    image: fholzer/nginx-brotli:v1.30.0
    container_name: webshaped-blog-astro-proxy
    depends_on:
      app:
        condition: service_healthy
    ports:
      - "${HOST_PORT:-80}:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/conf.d/webshaped.conf:/etc/nginx/conf.d/webshaped.conf:ro
    healthcheck:
      test: ["CMD-SHELL", "wget -q -O /dev/null http://127.0.0.1/ || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s

  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: webshaped-blog-astro
    env_file:
      - .env
    environment:
      HOST: 0.0.0.0
      PORT: 4321
    expose:
      - "4321"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:4321/"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 30s
```

- [ ] **Step 4: Validate the rendered compose file before the full smoke test**

Run:

```bash
HOST_PORT=8080 docker compose -f compose.yaml config
```

Expected: PASS and print both `proxy` and `app` services with the pinned image, config mounts, `expose: 4321`, and `ports: 8080:80` for the proxy.

- [ ] **Step 5: Run the smoke test to verify the proxy implementation passes**

Run:

```bash
HOST_PORT=8080 ./scripts/docker-smoke-test.sh
```

Expected: PASS with successful checks for root HTML, `www` redirect, `/stockfoto-sammlung/` redirect, Brotli, gzip, and `404` passthrough.

- [ ] **Step 6: Commit the proxy implementation**

```bash
git add compose.yaml nginx/nginx.conf nginx/conf.d/webshaped.conf
git commit -m "feat: add nginx reverse proxy for legacy redirects"
```

## Task 3: Update repository documentation for the proxy entrypoint

**Files:**
- Modify: `README.md`
- Modify: `docs/DOCKER_SMOKE_TEST.md`

- [ ] **Step 1: Update the Docker section in `README.md`**

Replace the current Docker bullet list with this content:

```md
### Docker

- `docker compose -f compose.yaml up` starts the full stack with Nginx in front of the Astro app
- `HOST_PORT=8080 docker compose -f compose.yaml up --build` starts the stack on `http://localhost:8080` when port `80` should stay free
- `docker compose -f compose.yaml build` builds the app image used by the stack
- `docker compose -f compose.yaml pull` pulls the latest remote images such as the pinned Brotli-enabled Nginx image
```

- [ ] **Step 2: Update `docs/DOCKER_SMOKE_TEST.md` for proxy-based validation**

Apply these content changes:

```md
## Was wird getestet?

Der Smoke Test fuehrt die folgenden Ueberpruefungen durch:

1. **Docker Compose Build/Start** - Stellt sicher, dass die App und der Nginx-Proxy erfolgreich starten
2. **Proxy Health Check** - Wartet bis der Proxy auf dem oeffentlichen HTTP-Endpunkt antwortet
3. **HTTP Response** - Stellt sicher, dass `/` ueber den Proxy mit HTTP 200 antwortet
4. **Host Redirect** - Ueberprueft `www.webshaped.de -> webshaped.de`
5. **Legacy Redirect** - Ueberprueft einen alten Post-Slug auf den neuen `/de/posts/...` Pfad
6. **Compression** - Ueberprueft Brotli- und gzip-Antwortheader
7. **Error Handling** - Testet, dass 404-Fehlerseiten ueber den Proxy durchgereicht werden
8. **Log Analysis** - Sucht nach Errors oder Exceptions in den Compose-Logs

## Lokal testen

```bash
HOST_PORT=8080 ./scripts/docker-smoke-test.sh
```

Das Skript baut den Stack, startet `proxy` und `app`, prueft Redirects und Kompression und raeumt die Compose-Ressourcen danach automatisch auf.
```

- [ ] **Step 3: Inspect the documentation diff for scope control**

Run:

```bash
git --no-pager diff -- README.md docs/DOCKER_SMOKE_TEST.md
```

Expected: PASS and show only documentation changes for the new proxy entrypoint, local port override, and smoke-test checks.

- [ ] **Step 4: Commit the documentation update**

```bash
git add README.md docs/DOCKER_SMOKE_TEST.md
git commit -m "docs: describe nginx proxy docker flow"
```

## Task 4: Final verification before handoff

**Files:**
- Verify only, no new files

- [ ] **Step 1: Re-run the full smoke test after docs are in place**

Run:

```bash
HOST_PORT=8080 ./scripts/docker-smoke-test.sh
```

Expected: PASS with the same proxy checks as Task 2, confirming no documentation-related accidental changes leaked into the stack.

- [ ] **Step 2: Inspect the final diff for scope control**

Run:

```bash
git --no-pager diff --stat
git --no-pager diff
```

Expected: PASS and show changes limited to `compose.yaml`, `nginx/`, `scripts/docker-smoke-test.sh`, `.github/workflows/docker-smoke-test.yml`, `README.md`, and `docs/DOCKER_SMOKE_TEST.md`.

- [ ] **Step 3: Commit the verification checkpoint**

```bash
git add compose.yaml nginx/nginx.conf nginx/conf.d/webshaped.conf scripts/docker-smoke-test.sh .github/workflows/docker-smoke-test.yml README.md docs/DOCKER_SMOKE_TEST.md
git commit -m "chore: verify docker proxy integration"
```

## Self-Review Notes

- Spec coverage:
  - host canonicalization is implemented in Task 2 via `canonical_host`
  - legacy redirects are implemented in Task 2 via the regex slug map
  - gzip and Brotli are configured in Task 2 and asserted in Tasks 1, 2, and 4
  - smoke-test coverage and CI path triggers are handled in Tasks 1 and 4
  - Docker usage docs are updated in Task 3
- Placeholder scan: no unresolved placeholders or deferred steps remain
- Type and naming consistency: `proxy`, `app`, `HOST_PORT`, `webshaped.conf`, and the redirect targets are used consistently across all tasks
