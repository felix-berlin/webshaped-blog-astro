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

# Distroless: same Node major and Debian release as the build stages, but no
# shell, package manager, npm/yarn or setuid binaries — a far smaller image and
# attack surface. Runs as the unprivileged `nonroot` user (uid 65532); the app
# files stay root-owned, so the process can read but not modify them.
FROM gcr.io/distroless/nodejs24-debian12:nonroot@sha256:14d42e2511532589a7c7e01a753667a74fcc96266e137e8125006b87b0c32d0a AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321

# No shell in distroless, so call node by its absolute path (it isn't on PATH).
HEALTHCHECK --interval=10s --timeout=5s --retries=3 \
  CMD ["/nodejs/bin/node", "-e", "fetch('http://localhost:4321/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"]

# Already the :nonroot image's default; stated so scanners and readers see it.
USER nonroot
# The image's entrypoint is node itself.
CMD ["./dist/server/entry.mjs"]
