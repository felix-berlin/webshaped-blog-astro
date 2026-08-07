# CI Caching Optimizations

## Goal

Reduce GitHub Actions wall-clock time and remove redundant work in the Docker-related workflows, without changing what any workflow verifies.

## Scope

This design covers:

- adding BuildKit/GHA layer caching to `docker-smoke-test.yml`, which currently has none
- removing an unnecessary serialization between the two independent jobs in `docker-build.yml`
- switching two `pnpm install` invocations in CI to `--frozen-lockfile`

This design does not cover:

- `codeql.yml` (no caching concerns identified there; CodeQL's JS/TS analysis does not require a dependency install)
- changing what `docker-smoke-test.sh` verifies, or its trigger conditions
- introducing a shared reusable workflow / composite action across the Docker workflows (out of scope, not requested)

## Current State

- `unit-test.yml` and `release.yml` already cache the pnpm store correctly via `actions/setup-node@v6`'s built-in `cache: "pnpm"` option (keyed on the lockfile hash). Both call plain `pnpm install`/`pnpm i` without `--frozen-lockfile`, unlike the `Dockerfile`, which already uses `--frozen-lockfile` for its `pnpm install` steps.
- `docker-build.yml` already uses `docker/build-push-action`'s `cache-from`/`cache-to: type=gha`, scoped per image (`scope=app`, `scope=proxy`). This is correctly set up. Its `build-proxy` job declares `needs: build-app`, serializing two jobs that don't share data — `build-proxy` builds `docker/nginx.Dockerfile` from the same repo context but references nothing produced by `build-app` (no shared artifact, no image reference, no output variable).
- `docker-smoke-test.yml` runs `scripts/docker-smoke-test.sh`, which calls `docker compose up --build` (`scripts/docker-smoke-test.sh:138`). This uses the classic Compose build path with no cache backend configured. GitHub-hosted runners are ephemeral, so every run rebuilds both images (app + proxy) from scratch — the layer cache that `docker-build.yml` already produces is never reused here, and consecutive smoke-test runs never warm a cache of their own either.

## Proposed Changes

### 1. GHA layer cache for the Compose-based smoke test build

Add `x-bake` cache hints to both services' `build:` blocks in `compose.yaml`:

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      secrets: [build_env]
      x-bake:
        cache-from: [type=gha,scope=app]
        cache-to: [type=gha,mode=max,scope=app]
  proxy:
    build:
      context: .
      dockerfile: docker/nginx.Dockerfile
      x-bake:
        cache-from: [type=gha,scope=proxy]
        cache-to: [type=gha,mode=max,scope=proxy]
```

In `docker-smoke-test.yml`, set `COMPOSE_BAKE=true` in the environment before the existing `./scripts/docker-smoke-test.sh` invocation. Docker Compose v2's native Buildx Bake integration then honors the `x-bake` cache settings when `compose up --build` runs — the smoke test script itself is unchanged.

Reusing the same `scope=app`/`scope=proxy` names as `docker-build.yml` means the smoke test can benefit from a release build's cache when one exists, and always benefits from its own cache on the next run either way.

**Verification note:** `COMPOSE_BAKE` requires Docker Compose v2.20+ (Docker Engine 27+ ships it enabled by default). `ubuntu-latest` runners are expected to have a compatible version, but the first CI run after this change should be checked to confirm Bake is actually engaged (the Compose build output names the builder driver used) rather than silently falling back to the legacy builder with no cache.

### 2. Parallelize `build-app` and `build-proxy`

Remove `needs: build-app` from the `build-proxy` job in `docker-build.yml`. The two jobs build from different Dockerfiles, different base images, and neither reads any output, artifact, or image reference from the other. Running them in parallel halves the wall-clock time of a release build without changing what either job does.

### 3. `--frozen-lockfile` for CI installs

- `unit-test.yml`: `pnpm i` → `pnpm i --frozen-lockfile`
- `release.yml`: `pnpm install --ignore-scripts` → `pnpm install --ignore-scripts --frozen-lockfile`

Matches the existing convention already used in `Dockerfile`. A lockfile that's out of sync with `package.json` now fails the CI step loudly and immediately, instead of pnpm silently re-resolving it.

## Risks And Constraints

- If `COMPOSE_BAKE` turns out to be unsupported or misbehaves on the current `ubuntu-latest` image, the smoke test still functions (Compose falls back to its legacy builder) — just without the intended cache benefit. This is a performance risk, not a correctness risk.
- Parallelizing `build-app`/`build-proxy` means both jobs authenticate to GHCR and pull QEMU/Buildx setup concurrently; no shared state exists between them today, so this carries no coordination risk.
- `--frozen-lockfile` will fail a workflow run if the lockfile is ever out of sync with `package.json` — this is the intended, desired behavior (fail fast, matching the Dockerfile's existing behavior), not a regression.

## Success Criteria

- A second, unmodified push that re-triggers `docker-smoke-test.yml` shows cache hits in the Docker build output (layers reported as cached rather than rebuilt).
- `docker-build.yml`'s `build-app` and `build-proxy` jobs start concurrently (visible in the Actions run graph) rather than one waiting on the other.
- `unit-test.yml` and `release.yml` still pass with `--frozen-lockfile`, confirming the current lockfile is in sync with `package.json`.
