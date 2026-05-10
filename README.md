# Webshaped Blog Frontend

[![codecov](https://codecov.io/gh/felix-berlin/webshaped-blog-astro/graph/badge.svg?token=FFV1OJ5AEL)](https://codecov.io/gh/felix-berlin/webshaped-blog-astro)

## Building the project

The `.env.runtime` file signals to Astro that the actual value will be available when the built application is run. See: <https://docs.astro.build/en/guides/integrations-guide/node/#runtime-environment-variables>

### Local development

1. `pnpm install` to install the dependencies
2. `cp .env.example .env` to create a new `.env` file
3. `cp .env .env.runtime` to create a new `.env.runtime` file
4. Adjust the `.env.runtime` and `.env` files to your needs.

### Docker

- `docker compose -f compose.yaml up` starts the full stack with Nginx in front of the Astro app
- `HOST_PORT=8080 docker compose -f compose.yaml up --build` starts the stack on `http://localhost:8080` when port `80` should stay free
- `docker compose -f compose.yaml build` builds the app image used by the stack
- `docker compose -f compose.yaml pull` pulls the latest remote images such as the pinned Brotli-enabled Nginx image
