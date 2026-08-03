# Environment & Secrets

How to get this project running on a new machine, and what to do when a variable
misbehaves. The conceptual side (why the schema looks the way it does) lives in
`CLAUDE.md`; this file is the operator's guide.

## TL;DR — new machine

```bash
pnpm install
infisical login          # once
pnpm dev                 # works — no prefix, no .env.local, no machine identity
```

The local-only scripts (`dev`, `gql:generate`, `gql:generate:watch`, `preview`,
`env:load`, `env:scan`) already run through `infisical run --env=dev --`, so
`infisical login` is the entire setup. `build` and `typechecking` stay bare —
`build` because Docker/CI supply values another way, `typechecking` because it
runs under `APP_ENV=test` and needs no real secret at all. For a standalone local
production build, prefix it yourself: `infisical run --env=dev -- pnpm build`.

## How values are resolved

`.env.schema` declares every variable; it holds no values. varlock resolves them
at run time, in this order — **later wins**:

```
.env.schema  →  .env  →  .env.local  →  .env.[APP_ENV]  →  .env.[APP_ENV].local  →  process.env
```

`process.env` beating everything is the load-bearing rule. It is why CI and the
Docker build never talk to Infisical: their values arrive through the environment
and the `infisical()` resolver never fires. It is also why `infisical run
--env=dev -- <command>` works locally without any file on disk: the values it
injects land in `process.env`, ahead of `.env.local` in the chain.

`.env.local` is deliberately empty on a workstation — see [Why not a local
machine identity](#why-not-a-local-machine-identity) below for why that is a
decision, not an oversight.

`APP_ENV` picks both the Infisical environment and which `.env.[env]` file loads:

| `APP_ENV`       | Source of values                | Used by          |
| --------------- | ------------------------------- | ---------------- |
| `dev` (default) | Infisical `dev`                 | local work       |
| `prod`          | Infisical `prod`                | release builds   |
| `test`          | committed `.env.test`, all fake | `pnpm test:unit` |

## Why not a local machine identity

varlock can authenticate to Infisical itself if you give it a machine identity —
**Universal Auth** on a workstation, since OIDC needs a token issuer and a
laptop has none. This project tried that (`local-dev-web-shaped`, Client
ID/Secret in `.env.local`) and reverted it. Not a style preference — two
independent, measured failures:

1. **It defeats the agent sandbox.** `pnpm agent` isolates the agent by handing
   it placeholder credentials; the sandbox separately denies it `~/.infisical`
   and the keyring, so a user login stays out of reach in there. But the project
   directory is readable by design, and a credential in `.env.local` lives in
   the project directory. Measured 2026-08-02: inside the sandbox, `.env.local`
   was readable and `varlock load` resolved all 19 items with real values — the
   agent could just authenticate to Infisical itself, bypassing the placeholder
   mechanism entirely.
2. **Decrypting it re-prompts for Windows Hello on every interactive command.**
   `@initInfisical()`'s own arguments (`clientId`, `clientSecret`) have to
   resolve before the plugin can even initialize — regardless of whether the
   _other_ items it would fetch are already satisfied by `process.env`. With the
   credential encrypted at rest, that meant a TPM decrypt, and a biometric
   prompt, on every single `pnpm dev`. (The opposite case is also worth
   knowing, since it's counterintuitive: a **non-interactive** decrypt — what an
   agent or a script does — went through silently, no prompt at all. The gate
   protects the human at the keyboard, not the thing it looks like it protects
   against.)

`infisical login` has neither hole: nothing sits in the project directory for
the sandbox to read, and there is nothing to decrypt.

If you want the convenience back and are fine re-accepting problem 1, run
`pnpm agent` only from a checkout where `.env.local` doesn't exist, or move the
credential to the shell environment instead of a file (the sandbox's env scrub
drops it — verified 2026-08-02 — so it survives problem 1 but not problem 2).

## Agent isolation

An AI agent working in this repo runs as you. That single fact decides what each
layer is worth:

| Layer                                   | Stops                                    | Does not stop                                  |
| --------------------------------------- | ---------------------------------------- | ---------------------------------------------- |
| `.gitignore`                            | The credential reaching the repo         | Anything reading the working tree              |
| `.claude/hooks/no-plaintext-secrets.py` | The accidental read, named leak commands | `varlock run -- <program that prints a value>` |
| Agent proxy                             | The agent ever holding a real credential | The agent _using_ it against a routed host     |

Only the third is a boundary. The first two reduce accidents, which is worth
having — both leaks that prompted this setup were accidents — but neither
contains a determined agent.

### Why `.env.local` is empty on this project

Covered in full under [Why not a local machine
identity](#why-not-a-local-machine-identity): a credential placed there is
readable from inside the `pnpm agent` sandbox, which defeats the placeholder
mechanism this section relies on. `infisical login` has no such hole — nothing
sits in the project directory for the sandbox to find.

### Infisical agent proxy (`pnpm agent`) — in use

The agent gets **placeholder** credentials; the proxy substitutes the real value
on the wire as the request leaves, and a bubblewrap sandbox keeps it out of
`~/.ssh`, `~/.infisical` and the keyring. Services are configured in the
Infisical UI. Details and the verification run are in `CLAUDE.md`.

Worth adding to the script if you want the network rule to bite:

```bash
--unmatched-host block          # allowlist instead of advisory routing
--allow-host example.com        # single exception
--log-file ./agent-proxy.log    # keep the activity log
```

### varlock proxy — the alternative

varlock has an equivalent (`varlock proxy run -- claude`) driven by the schema
rather than a UI:

```env-spec
# @proxyConfig={egress="strict"}

# @sensitive @proxy(domain="cms.webshaped.de")
WP_AUTH_PASS=infisical()
```

`varlock proxy rules` prints the effective policy, `varlock proxy audit` the
request log. Reloads requested from inside the agent are refused by design.

|                 | Infisical proxy                          | varlock proxy                          |
| --------------- | ---------------------------------------- | -------------------------------------- |
| Status here     | verified 2026-08-02                      | not tried                              |
| Rules live in   | Infisical UI                             | `.env.schema`, versioned with the repo |
| Sandbox on WSL2 | bubblewrap, **shared network namespace** | `--sandbox=docker`, own network        |

**The sandbox row is the deciding one.** On WSL2 a private network namespace is
unavailable, so bubblewrap falls back to shared networking and proxy routing
becomes advisory — a tool that ignores `HTTP_PROXY` reaches the network directly.
The placeholder protection still holds; the network boundary does not.
varlock's `--sandbox=docker` puts the child on an internal network whose only
egress is the proxy, which is the only option here that draws a real line. It
needs a container image with the agent CLI in it.

Recommendation: stay on the Infisical proxy while it is the tested one, and move
only if the missing network isolation becomes a concrete problem — then with the
Docker sandbox, not without.

## Troubleshooting

| Symptom                                                          | Cause                                                                                                                                                                         |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SchemaError: infisical(): Infisical authentication is required` | Ran a bare `varlock`/`pnpm exec varlock` command, or a script not wrapped with `infisical run --`. Use the `pnpm` script, or run `infisical login` first and prefix manually. |
| `OIDC auth configured but no token available`                    | Same root cause as above — no client credentials and no OIDC issuer, which is the normal state on a laptop. Not a bug; there is no local machine identity to fall back to.    |
| `varlock ENV not initialized`                                    | Command ran outside `varlock run --`; every script that touches config needs it                                                                                               |
| CI's `github-actions-web-shaped` identity locked out             | Three failed logins lock an auth method for 300 s. Infisical → identity → auth method → _Reset All Lockouts_                                                                  |
| Values unresolved inside `pnpm agent`                            | Expected — the sandbox blocks `~/.infisical` and the keyring on purpose. See [Why not a local machine identity](#why-not-a-local-machine-identity).                           |

`pnpm env:load` is the first thing to run when a variable misbehaves — it shows
each item's resolved value (redacted) **and where it came from**.

## Adding a variable

1. Add it to `.env.schema` with a type and, if it may reach the browser,
   `@sensitive=false`. Sensitivity is opt-out, so leaving it off keeps it secret.
2. Add the value in Infisical.
3. If it is required at build time, add it to the lists in
   `scripts/write-build-env.sh`.

`env.d.ts` regenerates on the next varlock run — no separate step.

## `pnpm env:scan`

Finds resolved secret values sitting in plaintext anywhere in the repo. It only
means something against **real** values: run it under `APP_ENV=test` and it
finds the fakes in `.env.test` and reports five hits. That is the scanner
working, not a leak.
