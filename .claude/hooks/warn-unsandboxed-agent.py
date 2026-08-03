#!/usr/bin/env python3
"""SessionStart hook: flag when this session is NOT running inside the
Infisical agent-proxy sandbox (`pnpm agent`).

`OPENCLAW_PROXY_URL` only exists inside that sandbox — confirmed absent in a
plain session and present under `infisical secrets agent-proxy run` (2026-08-03).
No other signal was checked against; if the proxy's env vars ever change, this
marker needs re-verifying, the same lesson as no-plaintext-secrets.py's varlock
gap.

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

MARKER = "OPENCLAW_PROXY_URL"

WARNING = (
    "This session is running WITHOUT the Infisical agent-proxy sandbox "
    "(no OPENCLAW_PROXY_URL in the environment). Real secret values from "
    "Infisical/varlock are directly reachable here — nothing stands between "
    "this agent and WP_AUTH_PASS, GITHUB_TOKEN, etc. beyond the no-plaintext-secrets "
    "hook, which only stops named leak commands, not deliberate use.\n\n"
    "Before touching credentials, secret rotation, or anything the project's "
    "agent-proxy setup exists to isolate, tell the user this session is unsandboxed "
    "and offer to continue only after they relaunch via `pnpm agent` (see CLAUDE.md, "
    "Agent Proxy section). For routine work (editing code, running tests, reading "
    "files) this is not a blocker — just don't treat the absence of this warning on "
    "a later turn as license; it fires once, at session start."
)


def main() -> None:
    try:
        json.load(sys.stdin)
    except (json.JSONDecodeError, AttributeError):
        pass  # Stdin shape doesn't matter here — never block on our own bug.

    if os.environ.get(MARKER):
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
