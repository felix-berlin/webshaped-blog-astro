FROM node:26-slim@sha256:e4db4c914bf8ad241bd24804fc25d272d89bad97e68cdc8a1414862790a02c39 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# Corepack is no longer bundled with Node (removed in 25).
RUN npm install -g corepack && corepack enable
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml /app/

# Runtime dependencies only. Lifecycle scripts are skipped: everything in
# pnpm-workspace.yaml's `allowBuilds` is build tooling (sentry-cli download,
# esbuild/sharp checks, Infisical CLI, …), and sharp ships prebuilt binaries as
# optional packages.
FROM deps AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile --ignore-scripts

FROM deps AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . /app
# Declared after the install/COPY layers on purpose: every RUN after an ARG sees it
# as an env var, so a changed hash (secret rotation) would otherwise re-run the
# dependency install too instead of only the build.
ARG BUILD_ENV_HASH=unset
RUN --mount=type=secret,id=build_env,target=/run/secrets/build_env \
  echo "build env hash: ${BUILD_ENV_HASH}" >/dev/null \
  && set -a && . /run/secrets/build_env && set +a \
  && pnpm run build

# Distroless runtime: the official Node image from distroless (libc, libstdc++,
# libatomic, libssl, CA certs, tzdata and Node itself), digest-pinned and
# Renovate-updated — but no shell, package manager, npm/yarn or setuid binaries. Far
# smaller image and attack surface. Runs as the unprivileged `nonroot` user
# (uid 65532); the app files stay root-owned, so the process can read but not modify
# them. Same Node major as the build stage above (keep in sync with .nvmrc).
FROM gcr.io/distroless/nodejs26-debian13:nonroot@sha256:a51c5d631b90e1b298e17a88a307b77f0b959b47de942d033acce0c96be3fb83 AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321

HEALTHCHECK --interval=10s --timeout=5s --retries=3 \
  CMD ["/nodejs/bin/node", "-e", "fetch('http://localhost:4321/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"]

# Already the :nonroot image's default; stated so scanners and readers see it.
USER nonroot
# The image's ENTRYPOINT is already /nodejs/bin/node (not on PATH).
# Exec form only: there is no shell to run a CMD string.
CMD ["./dist/server/entry.mjs"]
