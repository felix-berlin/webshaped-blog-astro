#!/usr/bin/env bash
#
# Checks for no-plaintext-secrets.py. A guard hook fails in the dangerous
# direction: if it silently stops matching, everything it was written to block
# just starts working again, and nothing tells you until a credential is in the
# transcript. The allow cases matter as much — an over-blocking hook gets
# disabled, which is the same outcome by a slower route.
#
# Usage: .claude/hooks/no-plaintext-secrets.test.sh

set -euo pipefail

cd "$(dirname "$0")"

HOOK="./no-plaintext-secrets.py"
FAILED=0

# decision <tool> <json-tool-input> → "deny" or "allow"
decision() {
  local out
  out="$(printf '{"tool_name":"%s","tool_input":%s}' "$1" "$2" | python3 "$HOOK")"

  if [[ "$out" == *'"deny"'* ]]; then echo "deny"; else echo "allow"; fi
}

expect() {
  local want="$1" tool="$2" input="$3" label="$4" got
  got="$(decision "$tool" "$input")"

  if [[ "$got" != "$want" ]]; then
    echo "❌ expected $want, got $got — $label" >&2
    FAILED=1
  fi
}

bash_cmd() { printf '{"command":%s}' "$(python3 -c 'import json,sys; print(json.dumps(sys.argv[1]))' "$1")"; }
read_path() { printf '{"file_path":%s}' "$(python3 -c 'import json,sys; print(json.dumps(sys.argv[1]))' "$1")"; }

# --- Infisical: the original leak ------------------------------------------
expect deny Bash "$(bash_cmd 'infisical secrets --env=dev')" "infisical secrets"
expect deny Bash "$(bash_cmd 'npx infisical export --format=dotenv')" "infisical export"
expect deny Bash "$(bash_cmd 'infisical secrets get WP_AUTH_PASS --plain')" "--plain"
expect allow Bash "$(bash_cmd 'infisical run -- pnpm dev')" "infisical run (injects, never prints)"
expect allow Bash "$(bash_cmd 'infisical secrets agent-proxy --set-env FOO=x')" "agent-proxy launcher"

# --- Dotenv files: printed contents -----------------------------------------
expect deny Bash "$(bash_cmd 'cat .env')" "cat .env"
expect deny Bash "$(bash_cmd 'head -5 .env.runtime')" "head .env.runtime"
expect deny Bash "$(bash_cmd 'grep WP_AUTH .build.env')" "grep .build.env"
expect deny Bash "$(bash_cmd 'set -a && . ./.env && echo "$WP_AUTH_PASS"')" "source then echo"
expect deny Bash "$(bash_cmd 'cat /home/felix/workspace/webshaped-blog-astro/.env')" "absolute path"

# --- Dotenv files: touched but not printed ----------------------------------
expect allow Bash "$(bash_cmd 'rm -f .env .build.env')" "rm (cleanup)"
expect allow Bash "$(bash_cmd 'ls -la .env')" "ls"
expect allow Bash "$(bash_cmd 'git check-ignore -v .build.env')" "git check-ignore"
expect allow Bash "$(bash_cmd 'bash scripts/write-build-env.sh .build.env quoted')" "generating the file"
expect allow Bash "$(bash_cmd "printf 'WP_API=x\n' > .env")" "printf writes .env"
expect allow Bash "$(bash_cmd 'cat .env.example > .env')" "seeding .env from the example"
expect deny Bash "$(bash_cmd 'cat .env > /tmp/leak.txt')" "redirect elsewhere still reads .env"
expect allow Bash "$(bash_cmd 'head -8 .env.example && rm -f .env')" "printer and .env in separate segments"
expect allow Bash "$(bash_cmd 'cat CLAUDE.md; ls -la .build.env')" "segments split on ;"
expect deny Bash "$(bash_cmd 'ls -la && cat .env')" "leak in the second segment"
expect deny Bash "$(bash_cmd 'cat .env | grep WP_AUTH')" "piped into another command"

# --- Placeholders stay readable ---------------------------------------------
expect allow Bash "$(bash_cmd 'cat .env.example')" "cat .env.example"
expect allow Read "$(read_path '.env.example')" "Read .env.example"
expect deny Read "$(read_path '.env.local')" "Read .env.local (real values)"
expect deny Read "$(read_path '.env.runtime')" "Read .env.runtime"
expect allow Read "$(read_path 'src/services/wpGraphqlClient.ts')" "Read ordinary source"
expect allow Bash "$(bash_cmd 'cat docs/environment.md')" "unrelated file"

# --- Read tool --------------------------------------------------------------
expect deny Read "$(read_path '.env')" "Read .env"
expect deny Read "$(read_path '/home/felix/workspace/webshaped-blog-astro/.env.runtime')" "Read .env.runtime"
expect deny Read "$(read_path '.build.env')" "Read .build.env"

# --- Never block on a malformed payload -------------------------------------
expect allow Bash '{}' "missing command key"
expect allow Read '{}' "missing file_path key"

if [[ "$FAILED" -eq 0 ]]; then
  echo "✅ no-plaintext-secrets.py: all checks passed"
else
  exit 1
fi
