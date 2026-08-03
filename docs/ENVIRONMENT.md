# Environment & Secrets

How to get this project running on a new machine, and what to do when a variable
misbehaves. The conceptual side (why the schema looks the way it does) lives in
`CLAUDE.md`; this file is the operator's guide.

## TL;DR — new machine

```bash
pnpm install
infisical run --env=dev -- pnpm dev     # works immediately, no setup
```

That is enough. Everything below buys you `pnpm dev` without the wrapper, plus a
one-hour credential cache. It is optional.

## How values are resolved

`.env.schema` declares every variable; it holds no values. varlock resolves them
at run time, in this order — **later wins**:

```
.env.schema  →  .env  →  .env.local  →  .env.[APP_ENV]  →  .env.[APP_ENV].local  →  process.env
```

`process.env` beating everything is the load-bearing rule. It is why CI and the
Docker build never talk to Infisical: their values arrive through the environment
and the `infisical()` resolver never fires.

`APP_ENV` picks both the Infisical environment and which `.env.[env]` file loads:

| `APP_ENV`       | Source of values                | Used by          |
| --------------- | ------------------------------- | ---------------- |
| `dev` (default) | Infisical `dev`                 | local work       |
| `prod`          | Infisical `prod`                | release builds   |
| `test`          | committed `.env.test`, all fake | `pnpm test:unit` |

## Optional: run without the `infisical run` wrapper

varlock authenticates to Infisical itself if you give it a machine identity. On a
workstation that means **Universal Auth** — OIDC needs a token issuer, and a
laptop has none.

### 1. Create the identity

Infisical → **Organization Access Control** → **Machine Identities** tab →
_Create identity_.

- Name: `local-dev-web-shaped`
- Organization role: `member`
- Universal Auth is attached automatically — nothing to add
- Turn **Delete protection off**: this credential should be cheap to throw away

### 2. Grant it project access

Infisical → **Project Access Control** (project `web-shaped`) → **Machine
Identities** tab → _Add Machine Identity to Project_.

- Project role: **Viewer**. varlock only reads; `Member` would also grant write.

Organization and project are two separate steps, in that order. An identity that
exists only at organization level will not appear in the project picker.

### 3. Create the credential

Open the identity → **Universal Auth** → create a Client Secret. It is shown
once.

> **The Client ID is not the identity ID.** The details panel shows an identity
> ID; the Client ID lives _inside_ the Universal Auth method. Both are UUIDs and
> look identical. Using the wrong one gives `401 Invalid credentials`.

### 4. Store it

Put the pair in `.env.local`:

```bash
INFISICAL_CLIENT_ID=…
INFISICAL_CLIENT_SECRET=…
```

The file is gitignored (`.env.local` and `.env.*.local`), and the guard hook
refuses to read it. Keep it that way — it holds a long-lived credential in
plaintext.

> varlock can encrypt this at rest with a device-bound key (`varlock encrypt
> --file .env.local`). It is deliberately not used here, for a reason worth
> knowing: measured on 2026-08-02, the Windows Hello gate fires for an
> **interactive** decrypt but not for a non-interactive one. A non-TTY process —
> which is what an agent or a script is — decrypted all 19 items silently, while
> `pnpm dev` in a terminal prompts every session. So the gate inconveniences the
> human and waves the agent through, which is backwards from what it looks like.
>
> If you turn encryption on anyway, expect that prompt, and note that
> `pnpm env:scan` then stops reporting the file.

### 5. Verify

```bash
pnpm env:load     # no `infisical run` in front of it
```

Every item should resolve, with sensitive values redacted. That proves Universal
Auth worked. Then `pnpm dev` runs unwrapped.

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

| Symptom                                              | Cause                                                                                            |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `401 Invalid credentials` on `/universal-auth/login` | Identity ID used instead of the Client ID, or the secret was rotated                             |
| `OIDC auth configured but no token available`        | `.env.local` missing or its variables empty, so varlock fell back to OIDC — expected on a laptop |
| `varlock ENV not initialized`                        | Command ran outside `varlock run --`; every script that touches config needs it                  |
| Auth method locked out                               | Three failed logins lock it for 300 s. Infisical → identity → auth method → _Reset All Lockouts_ |

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
