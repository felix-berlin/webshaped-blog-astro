# Floating `:beta` Docker Tag

## Goal

Publish a floating `beta` tag alongside the existing pinned semver tag whenever a pre-release version (`vX.Y.Z-beta.N`) is pushed, for both the app image and the proxy image. This lets deployment tooling (Komodo) reference `ghcr.io/felix-berlin/webshaped-blog-astro:beta` / `...-proxy:beta` once, instead of editing the pinned tag in the stack config on every beta release.

## Scope

This design covers:

- adding a conditional `beta` tag to both `docker/metadata-action` blocks in `.github/workflows/docker-build.yml` (`meta_app` and `meta_proxy`)
- the tag updates only on pushes of tags matching `v*.*.*-beta.*`

This design does not cover:

- floating tags for other pre-release channels (`alpha`, `rc`) — not requested, add later if needed
- a floating tag for stable releases (`latest`) — out of scope, existing semver tags already cover that
- branch-push-triggered builds — the workflow still only triggers on tag pushes, unchanged

## Current State

`docker-build.yml` triggers on `push: tags: v*.*.*` and `workflow_dispatch`. Both the `meta_app` and `meta_proxy` jobs use `docker/metadata-action` with:

```yaml
tags: |
  type=schedule
  type=ref,event=branch
  type=ref,event=pr
  type=semver,pattern={{version}}
  type=semver,pattern={{major}}.{{minor}}
  type=semver,pattern={{major}}
  type=sha
```

Per semver tagging convention, `type=semver` patterns only emit the exact-version tag for pre-release versions (e.g. `1.12.0-beta.1`) — no `{{major}}.{{minor}}` or `{{major}}` rollup, so a beta build can never accidentally overwrite a stable tag. This is correct and unchanged. The side effect is there's currently no floating tag at all for betas, so every beta deploy requires editing the pinned version in the target compose config.

## Proposed Change

Add one line to both `tags:` blocks:

```yaml
type=raw,value=beta,enable=${{ contains(github.ref_name, '-beta.') }}
```

`enable` is a GitHub Actions expression, evaluated by the runner before `docker/metadata-action` sees the value — so this needs no extra step or job. When the pushed tag is `v1.12.0-beta.1`, `github.ref_name` is `1.12.0-beta.1`, the `contains(...)` check is true, and the action additionally emits and pushes `beta` (in addition to the exact-version tag it already emits). For a stable tag like `v1.12.0`, the check is false and `beta` is left untouched.

Both images get the same treatment so `:beta` stays consistent between app and proxy.

## Risks And Constraints

- `:beta` always points at the *last* pushed beta build, regardless of version — by design (per user request), but means it's not reproducible the way a pinned tag is. Fine for a beta/staging channel, not a substitute for pinned tags in prod.
- No change to the workflow trigger — publishing a new beta still requires pushing a `vX.Y.Z-beta.N` git tag, same as today.

## Success Criteria

Pushing a tag matching `vX.Y.Z-beta.N` publishes, for both `ghcr.io/felix-berlin/webshaped-blog-astro` and `ghcr.io/felix-berlin/webshaped-blog-astro-proxy`:

- the exact-version tag (unchanged behavior)
- a `beta` tag pointing at the same image
- pushing a stable `vX.Y.Z` tag does not touch the `beta` tag
