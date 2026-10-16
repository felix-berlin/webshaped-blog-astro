FROM node:lts-slim@sha256:2fe369e969550cde8e867afc3fe370b260140cab4a23d467074295b42163d553 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml /app/

# Runtime dependencies only. Lifecycle scripts are skipped: the ones allowed in
# pnpm-workspace.yaml (sentry-cli download, esbuild/sharp checks, Infisical CLI)
# are build tooling, and sharp ships prebuilt binaries as optional packages.
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

# Distroless runtime: only glibc/libstdc++ plus the Node binary from the official
# (digest-pinned, Renovate-updated) image above — same Node release as the build,
# but no shell, package manager, npm/yarn or setuid binaries. Far smaller image and
# attack surface. Runs as the unprivileged `nonroot` user (uid 65532); the app
# files stay root-owned, so the process can read but not modify them.
FROM gcr.io/distroless/cc-debian12:nonroot@sha256:9dac0a79194e45a7da0158a9c6da57b217585af0786db3845d1f0ec1a0dd182f AS runtime
COPY --from=base /usr/local/bin/node /usr/local/bin/node
WORKDIR /app
ENV NODE_ENV=production

COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321

HEALTHCHECK --interval=10s --timeout=5s --retries=3 \
  CMD ["node", "-e", "fetch('http://localhost:4321/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"]

# Already the :nonroot image's default; stated so scanners and readers see it.
USER nonroot
# Exec form only: there is no shell to run a CMD string.
CMD ["node", "./dist/server/entry.mjs"]
