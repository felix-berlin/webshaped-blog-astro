# Docker Image Optimization Design

Date: 2026-05-08
Repository: webshaped-blog-astro
Branch: deps-upgrade
Status: Approved design (brainstorming)

## 1. Goal and Scope

Primary goals:

- Reduce final Docker image size.
- Improve rebuild speed for local development and CI, especially when only source files change.

Out of scope:

- Switching runtime family to Alpine or Distroless.
- Refactoring Astro runtime behavior or changing SSR architecture.
- Unrelated dependency or application refactors.

## 2. Current Baseline

Current Docker setup uses a multi-stage build and pnpm cache mount, with these notable constraints:

- `COPY . /app` happens early, which can invalidate dependency-related layers too often.
- Base image is `node:lts` rather than a smaller slim variant.
- Build context likely includes files not required for image creation.

The app is Astro SSR with Node adapter (`output: "server"`, standalone mode), runtime entrypoint:

- `dist/server/entry.mjs`

Runtime contract to preserve:

- Host: `0.0.0.0`
- Port: `4321`

## 3. Chosen Approach

Use a minimally invasive optimization of the existing multi-stage strategy:

1. Keep multi-stage pattern (base, prod-deps, build, runtime).
2. Improve layer ordering to maximize cache hits.
3. Use a slimmer Node base (`node:lts-slim`).
4. Tighten `.dockerignore` to reduce build context size.

Rationale:

- Delivers meaningful gains on image size and build speed.
- Keeps risk low by preserving architecture and runtime behavior.
- Aligns with pnpm and Astro Docker guidance.

## 4. Target Dockerfile Design

### 4.1 Base Stage

- Start from `node:lts-slim`.
- Set `PNPM_HOME` and `PATH`.
- Enable Corepack.
- Set `WORKDIR`.

### 4.2 Dependency Stages

Use two dependency stages as today, but with cache-friendly inputs:

- Copy only dependency manifests first:
  - `package.json`
  - `pnpm-lock.yaml`
  - `pnpm-workspace.yaml` (safe to include for forward compatibility)
- Then run installs with BuildKit cache mount:
  - `prod-deps`: `pnpm install --prod --frozen-lockfile`
  - `build-deps` (or equivalent build stage install): `pnpm install --frozen-lockfile`

Expected effect:

- Source-only changes should not invalidate dependency layers.

### 4.3 Build Stage

- Copy the remaining project sources after dependency installation.
- Run `pnpm run build`.
- Produce `dist` artifacts for SSR runtime.

### 4.4 Runtime Stage

- Use `node:lts-slim` runtime stage.
- Copy only:
  - production `node_modules` from `prod-deps`
  - `dist` from build stage
- Preserve runtime env and start command:
  - `HOST=0.0.0.0`
  - `PORT=4321`
  - `CMD ["node", "./dist/server/entry.mjs"]` or equivalent pnpm-based command.

Decision note:

- Prefer direct `node` entrypoint for runtime simplicity unless pnpm invocation is explicitly required.

## 5. .dockerignore Design

Introduce or tighten `.dockerignore` with at least:

- `node_modules`
- `dist`
- `coverage`
- `test-results`
- `dev-dist`
- `.git`
- `.gitignore`
- `.DS_Store`
- `tests`
- `src/tests`

Optional (project policy dependent):

- `*.md` if markdown files are not needed during build.

Important keep rules:

- Do not exclude `src/gql` (required at build/runtime typing boundaries).
- Do not bake secret env files into image; runtime config is provided via compose env files.

## 6. Data Flow and Build Flow

Build flow:

1. Resolve base image and pnpm tooling.
2. Install prod/build dependencies from lockfile-informed layer.
3. Build Astro SSR output.
4. Assemble runtime image from minimal artifacts.

Runtime flow:

1. Container starts Node entrypoint at `dist/server/entry.mjs`.
2. App binds to `HOST` and `PORT`.
3. Requests are served by Astro SSR Node adapter.

## 7. Error Handling and Failure Modes

Potential failure modes and mitigations:

- Lockfile mismatch (`--frozen-lockfile` fails):
  - Mitigation: ensure lockfile committed and in sync with `package.json`.
- Missing runtime dependencies:
  - Mitigation: verify production install stage includes all runtime-required packages.
- Cache not reused in some CI environments:
  - Mitigation: still benefits from improved Docker layer ordering; BuildKit cache remains additive.
- Native module runtime mismatch:
  - Mitigation: keep same OS family between build and runtime stages (`-slim` variants).

## 8. Testing and Verification Plan

### 8.1 Functional Verification

- Build image successfully.
- Run container and verify app reachable on port 4321.
- Validate representative SSR pages return success responses.

### 8.2 Performance Verification

Collect baseline vs optimized metrics:

- Cold build duration (no cache).
- Rebuild duration after source-only change.
- Final runtime image size.

Success criteria:

- Faster rebuilds when only source changes.
- Smaller final image than current baseline.
- No runtime regressions.

## 9. Rollout Plan

1. Update `Dockerfile` according to target design.
2. Add/update `.dockerignore`.
3. Verify local build/run.
4. Compare metrics against current baseline.
5. Merge once criteria are met.

## 10. Non-Goals and Future Options

Non-goals for this iteration:

- Distroless migration.
- Alpine migration.
- Major CI pipeline redesign.

Future options if further gains are needed:

- pnpm `fetch`-oriented CI optimization strategy.
- Hardening runtime user model (non-root) as a dedicated follow-up.

## 11. Implementation Readiness

This design is intentionally scoped for a single implementation cycle and is ready for planning.
