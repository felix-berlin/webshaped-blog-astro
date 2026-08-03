#!/usr/bin/env bash
#
# Checks for warn-unsandboxed-agent.py. The marker it keys off
# (OPENCLAW_PROXY_URL) was found empirically, not documented anywhere — if the
# agent-proxy CLI ever renames it, this hook goes silently blind. Re-verify the
# marker (see CLAUDE.md, Agent Proxy section) before trusting a green run here.
#
# Usage: .claude/hooks/warn-unsandboxed-agent.test.sh

set -euo pipefail

cd "$(dirname "$0")"

HOOK="./warn-unsandboxed-agent.py"
FAILED=0

expect_warns() {
  local out
  out="$(echo '{}' | env -u OPENCLAW_PROXY_URL "$HOOK")"
  if [[ "$out" != *"additionalContext"* ]]; then
    echo "❌ expected a warning with no OPENCLAW_PROXY_URL set, got: $out" >&2
    FAILED=1
  fi
}

expect_silent() {
  local out
  out="$(echo '{}' | OPENCLAW_PROXY_URL="http://127.0.0.1:1" "$HOOK")"
  if [[ -n "$out" ]]; then
    echo "❌ expected silence with OPENCLAW_PROXY_URL set, got: $out" >&2
    FAILED=1
  fi
}

expect_no_crash_on_bad_stdin() {
  local out
  out="$(printf 'not json' | env -u OPENCLAW_PROXY_URL "$HOOK")"
  if [[ "$out" != *"additionalContext"* ]]; then
    echo "❌ malformed stdin should not suppress the warning, got: $out" >&2
    FAILED=1
  fi
}

expect_warns
expect_silent
expect_no_crash_on_bad_stdin

if [[ "$FAILED" -eq 0 ]]; then
  echo "✅ warn-unsandboxed-agent.py: all checks passed"
else
  exit 1
fi
