#!/usr/bin/env bash
#
# Checks for warn-unsandboxed-agent.py. The marker it keys off is the
# agent-proxy mitm CA path substring in SSL_CERT_FILE (and siblings), which
# `infisical secrets agent-proxy run` documents itself (CLI reference,
# "Environment: scrubbed"). Re-verify against a real `pnpm agent` run
# (CLAUDE.md, Agent Proxy section) if the CLI ever changes how it wires CA
# trust.
#
# Usage: .claude/hooks/warn-unsandboxed-agent.test.sh

set -euo pipefail

cd "$(dirname "$0")"

HOOK="./warn-unsandboxed-agent.py"
CA_VARS=(SSL_CERT_FILE NODE_EXTRA_CA_CERTS REQUESTS_CA_BUNDLE CURL_CA_BUNDLE GIT_SSL_CAINFO DENO_CERT)
FAILED=0

expect_warns() {
  local out
  out="$(echo '{}' | env -u SSL_CERT_FILE -u NODE_EXTRA_CA_CERTS -u REQUESTS_CA_BUNDLE -u CURL_CA_BUNDLE -u GIT_SSL_CAINFO -u DENO_CERT "$HOOK")"
  if [[ "$out" != *"additionalContext"* ]]; then
    echo "❌ expected a warning with no agent-proxy CA vars set, got: $out" >&2
    FAILED=1
  fi
}

expect_silent() {
  local out
  out="$(echo '{}' | SSL_CERT_FILE="$HOME/.infisical/agent-proxy/mitm-ca.pem" "$HOOK")"
  if [[ -n "$out" ]]; then
    echo "❌ expected silence with an agent-proxy SSL_CERT_FILE set, got: $out" >&2
    FAILED=1
  fi
}

expect_no_crash_on_bad_stdin() {
  local out
  out="$(printf 'not json' | env -u SSL_CERT_FILE -u NODE_EXTRA_CA_CERTS -u REQUESTS_CA_BUNDLE -u CURL_CA_BUNDLE -u GIT_SSL_CAINFO -u DENO_CERT "$HOOK")"
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
