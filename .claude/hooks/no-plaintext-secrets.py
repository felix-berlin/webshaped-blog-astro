#!/usr/bin/env python3
"""PreToolUse guard: block anything that PRINTS secret values into the transcript.

Two sources, same failure mode — credentials land verbatim in the session log and
have to be rotated:

1. Infisical reads. `infisical run -- <cmd>` injects into a child process and never
   exposes values — that stays allowed, otherwise pnpm dev, gql:generate,
   build:local and the test suite all stop working. Blocked is the reading side
   (`secrets`, `export`, `--plain`). That leaked on 2026-07-31 and is why this
   hook exists. `infisical secrets agent-proxy …` is the sandbox launcher, not a
   read — allowed.

2. Dotenv files. `.env`, `.env.runtime` and `.build.env` hold the same credentials
   in plaintext; `cat .env` leaks exactly as much as `infisical secrets` does. That
   leaked on 2026-07-31 too, via a `--plain`-style dump whose redaction failed.
   `.env.example` and friends are placeholders and stay readable.

Only *content-printing* commands are blocked, not every mention of the path:
`rm -f .env`, `ls -la .env`, `cp .build.env .env` and `git check-ignore .env` are
routine cleanup and reveal nothing. Naming a printer plus an env file is the leak.

This is pattern matching, not a sandbox: `grep -r secret .` still reaches `.env`
without naming it. It stops the accidental read, not a determined one.

Python, not jq + bash: jq is not installed here, and a hook that errors out
silently allows everything it was written to stop.
"""

import json
import os
import re
import sys

SANDBOX = re.compile(r"infisical\s+secrets\s+agent-proxy")
READS = re.compile(r"infisical(?:\s+\S+)*?\s+(secrets|export)(\s|$)")
PLAIN = re.compile(r"infisical(?:\s+\S+)*\s--plain(\s|$)")

# `.env`, `.env.runtime`, `.build.env` — but not `.environment` or `prod.envrc`.
ENV_FILE = re.compile(r"^(\.env(\.[\w-]+)?|[\w.-]+\.env)$")
# Files that ship in the repo and hold no real values — readable on purpose.
# `.env.schema` is varlock's declaration file and is the whole point of the setup:
# agents read the schema, humans hold the secrets. Blocking it defeats the tool.
# `.env.test` is committed and deliberately fake, so the unit suite needs no
# credentials — if that ever stops being true, drop `test` from this list.
ENV_PLACEHOLDER = re.compile(r"\.(schema|test|example|sample|template|dist)$|^example\.env$")

# Commands that write file contents to stdout, plus `source`/`.`, which loads the
# values into a shell where a later `echo` in the same command can print them.
# Deliberately excludes `echo`/`printf`: naming an env file alongside those means
# writing it (`printf ... > .env`), and they cannot leak a file they don't read.
PRINTERS = re.compile(
    r"(^|[\s;|&(`$])("
    r"cat|bat|tac|head|tail|less|more|nl|od|xxd|hexdump|strings|base64|"
    r"cut|sed|awk|gawk|perl|python3?|node|grep|egrep|fgrep|rg|ag|ack|"
    r"sort|uniq|tr|tee|jq|yq|dotenv|source|\.)"
    r"(\s|$)"
)

# `> .env` / `>> .env` is a write. Strip those targets before scanning, or
# `cat config > .env` reads as a leak of the file it is creating.
REDIRECT_TARGET = re.compile(r"\d?>>?\s*[^\s;|&<>()\"'`]+")

# Shell-ish splitting: enough to find path-looking tokens, not a real parser.
TOKEN = re.compile(r"""[^\s;|&<>()"'`]+""")

# Each `&&`/`||`/`;`/`|`/newline segment is judged on its own, or
# `head .env.example && rm -f .env` reads as "a printer and a secret file".
SEGMENT = re.compile(r"&&|\|\||[;|\n]")

RUN_HINT = (
    "Use 'infisical run -- <command>' to inject secrets into a child process "
    "instead, or ask the user to read the value themselves."
)
ENV_HINT = (
    "Dotenv files hold the same plaintext credentials as Infisical. Read "
    "'.env.schema' for the variable names and types, run 'pnpm env:load' for a "
    "redacted view of the resolved values, or use 'varlock run -- <command>' to "
    "consume them without printing them."
)


def deny(reason: str) -> None:
    json.dump(
        {
            "hookSpecificOutput": {
                "hookEventName": "PreToolUse",
                "permissionDecision": "deny",
                "permissionDecisionReason": reason,
            }
        },
        sys.stdout,
    )
    sys.exit(0)


def is_secret_env(path: str) -> bool:
    """True for a dotenv file that carries real values."""
    name = os.path.basename(path.strip().strip("\"'").rstrip(":,"))

    return bool(ENV_FILE.match(name)) and not ENV_PLACEHOLDER.search(name)


def check_bash(command: str) -> None:
    if SANDBOX.search(command):
        return

    if READS.search(command):
        deny(f"Blocked: this prints Infisical secret values into the transcript. {RUN_HINT}")

    if PLAIN.search(command):
        deny(f"Blocked: '--plain' makes Infisical print raw secret values. {RUN_HINT}")

    leaked = set()

    for segment in SEGMENT.split(command):
        # Naming an env file is fine — rm, ls, cp, test all reveal nothing.
        if not PRINTERS.search(segment):
            continue

        reads_only = REDIRECT_TARGET.sub(" ", segment)
        leaked.update(token for token in TOKEN.findall(reads_only) if is_secret_env(token))

    if leaked:
        deny(f"Blocked: this would print the contents of {', '.join(sorted(leaked))}. {ENV_HINT}")


def check_file_read(tool_input: dict) -> None:
    for key in ("file_path", "path", "notebook_path"):
        target = tool_input.get(key)

        if isinstance(target, str) and is_secret_env(target):
            deny(f"Blocked: {target} holds plaintext credentials. {ENV_HINT}")


def main() -> None:
    try:
        payload = json.load(sys.stdin)
        tool = payload.get("tool_name", "")
        tool_input = payload.get("tool_input", {}) or {}
    except (json.JSONDecodeError, AttributeError):
        sys.exit(0)  # Not a shape we understand — never block on our own bug.

    if not isinstance(tool_input, dict):
        sys.exit(0)

    if tool == "Bash":
        command = tool_input.get("command", "")

        if isinstance(command, str):
            check_bash(command)
    else:
        check_file_read(tool_input)

    sys.exit(0)


if __name__ == "__main__":
    main()
