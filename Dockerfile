FROM node:lts-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml /app/

FROM deps AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM deps AS build
ARG BUILD_ENV_HASH=unset
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . /app
RUN --mount=type=secret,id=build_env,target=/run/secrets/build_env \
  echo "build env hash: ${BUILD_ENV_HASH}" >/dev/null \
  && set -a && . /run/secrets/build_env && set +a \
  && pnpm run build

FROM node:lts-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Install curl for health checks
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

COPY --from=prod-deps --chown=node:node /app/node_modules /app/node_modules
COPY --from=build --chown=node:node /app/dist /app/dist
# Sensitive values are deliberately not baked into the bundle, so the server
# resolves them at boot. varlock needs its declaration file to do that; the file
# holds no values, the values come from the container environment.
COPY --chown=node:node .env.schema /app/.env.schema
# @generateTypes runs on every varlock invocation, including the entrypoint. Ship
# the file the build already produced so it finds it current — and owned by node,
# so a regeneration would not die on EACCES either.
COPY --from=build --chown=node:node /app/env.d.ts /app/env.d.ts

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321

HEALTHCHECK --interval=10s --timeout=5s --retries=3 \
  CMD curl -f http://localhost:4321/ || exit 1

USER node
# varlock validates the environment at boot and fails fast on a missing or
# malformed value, rather than letting the server start and 500 on first request.
ENTRYPOINT ["./node_modules/.bin/varlock", "run", "--"]
CMD ["node", "./dist/server/entry.mjs"]
