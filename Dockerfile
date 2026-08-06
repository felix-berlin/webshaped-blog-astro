FROM node:lts-slim@sha256:3638d9a6fe4030bd716be989438248074489337ba3275657f93595428be4fc03 AS base
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

FROM node:lts-slim@sha256:3638d9a6fe4030bd716be989438248074489337ba3275657f93595428be4fc03 AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=prod-deps --chown=node:node /app/node_modules /app/node_modules
COPY --from=build --chown=node:node /app/dist /app/dist

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321

HEALTHCHECK --interval=10s --timeout=5s --retries=3 \
  CMD ["node", "-e", "fetch('http://localhost:4321/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"]

USER node
CMD ["node", "./dist/server/entry.mjs"]
