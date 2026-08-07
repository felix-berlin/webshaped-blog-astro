#!/usr/bin/env python3
"""SessionStart hook: flag when this session is NOT running inside the
Infisical agent-proxy sandbox (`pnpm agent`).

Detection: `infisical secrets agent-proxy run` documents (CLI reference,
"Environment: scrubbed") that it always writes its own mitm CA into one of
SSL_CERT_FILE / NODE_EXTRA_CA_CERTS / REQUESTS_CA_BUNDLE / CURL_CA_BUNDLE /
GIT_SSL_CAINFO / DENO_CERT, at a path containing `agent-proxy` (the CA lives
under `~/.infisical/agent-proxy/mitm-ca.pem`). That path substring is specific
enough not to collide with an unrelated proxy/CA setup on the same machine —
unlike the previous marker (`OPENCLAW_PROXY_URL`), which was never a
documented variable at all (it turned out to be a stray example agent name
from Infisical's own docs, not something the CLI actually sets — caught
2026-08-03 while researching Infisical's proxy setup).

This can only inform, not enforce: a SessionStart hook cannot be proven to block
session startup from inside a running session (the harness fires it before the
turn we could observe from), and `claude` is a native binary with no shell layer
to intercept for the VS Code extension's launch path either. So this writes a
warning into context and leaves the actual judgment call — proceed, or tell the
user to relaunch via `pnpm agent` — to the agent reading it.
"""

import json
import os
import sys

CA_ENV_VARS = (
    "SSL_CERT_FILE",
    "NODE_EXTRA_CA_CERTS",
    "REQUESTS_CA_BUNDLE",
    "CURL_CA_BUNDLE",
    "GIT_SSL_CAINFO",
    "DENO_CERT",
)
CA_PATH_MARKER = "agent-proxy"

WARNING = (
    "This session is running WITHOUT the Infisical agent-proxy sandbox "
    "(no agent-proxy mitm CA found in SSL_CERT_FILE/NODE_EXTRA_CA_CERTS/etc.). "
    "Real secret values from Infisical are directly reachable here — "
    "nothing stands between this agent and WP_AUTH_PASS, GITHUB_TOKEN, etc. "
    "beyond the no-plaintext-secrets hook, which only stops named leak commands, "
    "not deliberate use.\n\n"
    "Before touching credentials, secret rotation, or anything the project's "
    "agent-proxy setup exists to isolate, tell the user this session is unsandboxed "
    "and offer to continue only after they relaunch via `pnpm agent` (see CLAUDE.md, "
    "Agent Proxy section). For routine work (editing code, running tests, reading "
    "files) this is not a blocker — just don't treat the absence of this warning on "
    "a later turn as license; it fires once, at session start."
)


def _sandboxed() -> bool:
    return any(CA_PATH_MARKER in os.environ.get(var, "") for var in CA_ENV_VARS)


def main() -> None:
    try:
        json.load(sys.stdin)
    except (json.JSONDecodeError, AttributeError):
        pass  # Stdin shape doesn't matter here — never block on our own bug.

    if _sandboxed():
        sys.exit(0)  # Sandboxed — nothing to say.

    json.dump(
        {
            "hookSpecificOutput": {
                "hookEventName": "SessionStart",
                "additionalContext": WARNING,
            }
        },
        sys.stdout,
    )
    sys.exit(0)


if __name__ == "__main__":
    main()
