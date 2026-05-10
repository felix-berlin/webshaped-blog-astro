# Nginx Reverse Proxy With Legacy Redirects

## Goal

Add a dedicated Nginx reverse proxy in front of the existing Astro SSR container for Docker-based deployment. The proxy is responsible for host canonicalization, a fixed set of legacy URL redirects, and response compression with gzip and Brotli. TLS termination remains outside this stack.

## Scope

This design covers:

- adding a public `proxy` service to `compose.yaml`
- keeping the existing Astro SSR container as an internal `app` service
- redirecting `www.webshaped.de` to `webshaped.de`
- redirecting known legacy root-level post slugs to `/de/posts/<slug>`
- proxying all other requests to the Astro app
- enabling gzip and Brotli for proxied text responses
- extending the existing Docker smoke test to validate proxy behavior

This design does not cover:

- TLS termination or certificate management
- generic redirect management from CMS, CSV, or database sources
- regex-driven site migrations beyond the known legacy slugs
- edge caching, rate limiting, or firewall behavior

## Current State

The current Docker setup exposes the Astro SSR app directly on port `4321`. There is no reverse proxy in the repository. Historical redirect behavior previously existed as Traefik labels outside the application. That logic now needs to move into a small, repo-owned proxy layer.

## Proposed Architecture

The Docker stack will contain two services:

- `proxy`: the only public HTTP entrypoint on port `80`
- `app`: the existing Astro SSR container, reachable only on the internal Compose network

Request handling order inside the proxy:

1. If the request host is `www.webshaped.de`, return a permanent redirect to `webshaped.de` and preserve path plus query string.
2. Otherwise, match the request path against a central list of known legacy slugs.
3. If a slug matches, return a permanent redirect to the configured `/de/posts/<slug>` target.
4. If nothing matches, proxy the request to `app:4321`.

This keeps redirect behavior out of Astro and preserves a clean separation between infrastructure concerns and application routing.

## Nginx Configuration Structure

The proxy configuration should stay deliberately small and easy to audit.

Recommended file layout:

- `nginx/nginx.conf`: top-level Nginx config with compression, upstream include, and server includes
- `nginx/conf.d/webshaped.conf`: main server configuration for host canonicalization, redirect handling, and reverse proxying

The legacy redirect rules should be expressed as a central mapping instead of repeated near-identical blocks. The implementation should use one shared lookup table that maps each legacy path to its final target path. This avoids copy-paste configuration and keeps future additions localized to one section.

The redirect list currently includes:

- `/automatische-matomo-backups` -> `/de/posts/automatische-matomo-backups`
- `/matomo-tracking-script-optimal-einbinden` -> `/de/posts/matomo-tracking-script-optimal-einbinden`
- `/gutenberg-standard-vollbildmodus-deaktivieren-wordpress-5-4` -> `/de/posts/gutenberg-standard-vollbildmodus-deaktivieren-wordpress-5-4`
- `/wordpress-comment-form-validation-interaktiv-mit-javascript` -> `/de/posts/wordpress-comment-form-validation-interaktiv-mit-javascript`
- `/code-dokumentieren-leicht-gemacht-vs-code-extension-guide` -> `/de/posts/code-dokumentieren-leicht-gemacht-vs-code-extension-guide`
- `/datenschutz-checkbox-fuer-wordpress-kommentare-ohne-plugin` -> `/de/posts/datenschutz-checkbox-fuer-wordpress-kommentare-ohne-plugin`
- `/stockfoto-sammlung` -> `/de/posts/stockfoto-sammlung`

Matching rules:

- match only root-level legacy paths
- accept requests with or without a trailing slash
- preserve the query string when redirecting
- return `301 Moved Permanently` for all configured redirects

## Compression Requirements

The proxy will use an Nginx image that already includes Brotli support. No custom module build should be added to this repository for the first iteration.

Compression behavior:

- enable `gzip` for proxied text-based responses
- enable `brotli` for proxied text-based responses when requested by the client
- set `Vary: Accept-Encoding`
- apply compression to HTML, CSS, JavaScript, JSON, XML, SVG, and similar text formats
- avoid recompressing already compressed or binary payloads

Redirect responses themselves are not the performance target. Compression is intended for normal application responses served through the proxy.

## Proxying Requirements

The proxy must forward the request to `app:4321` for all non-redirect traffic.

Required forwarded headers:

- `Host`
- `X-Real-IP`
- `X-Forwarded-For`
- `X-Forwarded-Host`
- `X-Forwarded-Proto`

These headers are required so the Astro SSR app can continue to resolve request context correctly behind a proxy.

## Docker Compose Changes

`compose.yaml` should be updated so that:

- `proxy` becomes the public service
- `proxy` publishes port `80`
- `proxy` depends on `app`
- `app` no longer needs to publish its port publicly for the normal stack path
- both services share the default Compose network

Health checks should be aligned with the public entrypoint. The smoke test and service-level validation should hit the proxy instead of bypassing it and calling the app directly.

## Image Strategy

Use a pinned Brotli-capable Nginx image rather than introducing a second custom Dockerfile just to add the Brotli module. The chosen image must be explicit and reproducible so that compression support does not change unexpectedly across builds.

The Astro application image remains the existing Node-based runtime image.

## Validation Strategy

The existing Docker smoke test should be expanded to cover the proxy behavior.

Required checks:

- the container stack starts successfully with both `proxy` and `app`
- `GET /` through the proxy returns a successful HTML response
- a request to each representative legacy slug returns `301` with the expected `Location`
- a request with `Host: www.webshaped.de` returns `301` to the non-`www` host
- a request with `Accept-Encoding: gzip` or `Accept-Encoding: br` returns the expected compression header when appropriate
- the proxy path still preserves normal `404` behavior from the application layer
- logs do not show startup failures or proxy errors during the smoke test

At minimum, the smoke test should validate one legacy redirect and the host canonicalization path. It does not need to enumerate every redirect if one targeted redirect plus the shared mapping mechanism are already covered.

## Operational Notes

- TLS is terminated elsewhere, so this proxy only handles plain HTTP inside the Docker stack.
- Host canonicalization is limited to `www.webshaped.de` -> `webshaped.de`.
- Redirect behavior is intentionally explicit and finite. New redirects are added by editing the central mapping list.
- The proxy is not intended to become a generalized ingress platform in this iteration.

## Risks And Constraints

- Brotli support depends on the selected Nginx image. The implementation must verify that the chosen image exposes the expected modules.
- Redirect testing in local Docker may need explicit `Host` headers to simulate production hostnames.
- If the app currently assumes direct access on port `4321`, the compose and smoke-test changes must avoid breaking local workflows.

## Implementation Notes

The first implementation should stay minimal:

- keep the existing Astro image path unchanged except where proxy integration requires adjustments
- add one proxy config directory under source control
- update the smoke test only where necessary to validate the new public entrypoint
- avoid adding unrelated Nginx features such as cache policies, rate limiting, or complex rewrite rules

## Success Criteria

The design is complete when the repository can run a Docker stack where:

- the public service is Nginx on port `80`
- `www.webshaped.de` redirects permanently to `webshaped.de`
- all specified legacy slugs redirect permanently to their `/de/posts/...` destinations
- non-redirect requests reach the Astro app successfully through the proxy
- gzip and Brotli are available for normal text responses
- the Docker smoke test validates the new proxy-based request path
