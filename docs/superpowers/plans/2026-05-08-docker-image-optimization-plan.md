# Docker Image Optimization Implementation Plan

Date: 2026-05-08
Based on spec: docs/superpowers/specs/2026-05-08-docker-image-optimization-design.md

## Objective

Implement low-risk Docker optimizations focused on:

- Smaller final runtime image
- Faster rebuilds when only source files change

## Step 1: Optimize Dockerfile layer ordering

Actions:

1. Switch base/runtime images from `node:lts` to `node:lts-slim`.
2. Copy only dependency manifests before install:
   - `package.json`
   - `pnpm-lock.yaml`
   - `pnpm-workspace.yaml`
3. Keep separate stages for prod deps and build deps/install.
4. Copy full source only in build stage.
5. Keep runtime artifact copy minimal (`node_modules` + `dist`).
6. Keep runtime contract unchanged (HOST/PORT/EXPOSE 4321).

Expected outcome:

- Better Docker cache reuse for dependency layers.
- Smaller runtime footprint from slim base image.

## Step 2: Add `.dockerignore`

Actions:

1. Create `.dockerignore` at repository root.
2. Exclude heavy/unnecessary build-context paths:
   - `node_modules`, `dist`, `coverage`, `test-results`, `dev-dist`
   - `.git`, `.gitignore`, `.DS_Store`
   - `tests`, `src/tests`
3. Exclude local env files from image context:
   - `.env`, `.env.*`
4. Keep required sources such as `src/gql` and app code.

Expected outcome:

- Smaller/faster context transfer to Docker daemon.
- Fewer irrelevant cache invalidations.

## Step 3: Validate changes

Actions:

1. Validate syntax and content of modified files.
2. Inspect git diff for scope control.
3. (If Docker available) run:
   - `docker build -t webshaped-blog-astro:opt .`
   - `docker run --rm -p 4321:4321 webshaped-blog-astro:opt`

Expected outcome:

- Build remains functional.
- Changes stay limited to Docker concerns.

## Step 4: Summarize and handoff

Actions:

1. Provide concise summary of file changes.
2. Provide exact verification commands and expected checks.
3. Offer optional follow-up optimization path (`pnpm fetch` CI strategy) only if needed.

## Risks and Mitigations

- Risk: Missing files due to stricter context ignore rules.
  - Mitigation: Keep ignore list conservative and validate build.
- Risk: Runtime dependency mismatch.
  - Mitigation: Preserve prod-deps stage and copy only runtime artifacts.
- Risk: Environment file behavior changes.
  - Mitigation: Continue using compose `env_file` and runtime environment injection.
