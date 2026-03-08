#!/usr/bin/env bash
set -euo pipefail

workspace_dir="${PWD}"
claude_settings_path="${CLAUDE_SETTINGS_PATH:-$HOME/.claude/settings.json}"
codex_config_path="${CODEX_CONFIG_PATH:-$HOME/.codex/config.toml}"
repo_codex_skill="$workspace_dir/.codex/skills/init-trimtab/SKILL.md"
repo_claude_command="$workspace_dir/.claude/commands/init-trimtab.md"

check_cmd() {
  local name="$1"
  if command -v "$name" >/dev/null 2>&1; then
    printf "OK    %s -> %s\n" "$name" "$(command -v "$name")"
  else
    printf "MISS  %s\n" "$name"
  fi
}

# Note: doctor.sh is designed for target repos bootstrapped by Trimtab.
# In the Trimtab starter repo itself, the project-local init surfaces
# live in skills/ and templates/ rather than .claude/commands/ and
# .codex/skills/, so they will correctly report as MISS here.
echo "Trimtab doctor"
check_cmd node
check_cmd npm
check_cmd claude
check_cmd codex

ralph_found=false
if command -v ralph >/dev/null 2>&1; then
  printf "OK    ralph -> %s (standalone)\n" "$(command -v ralph)"
  ralph_found=true
fi
if [[ -d "$HOME/.claude/plugins/cache/claude-plugins-official/ralph-loop" ]]; then
  echo "OK    ralph-loop -> Claude Code plugin installed"
  ralph_found=true
fi
if [[ "$ralph_found" != "true" ]]; then
  echo "MISS  ralph -> optional (plugin or standalone)"
fi

if [[ -f "$claude_settings_path" ]]; then
  echo "OK    Claude settings -> $claude_settings_path"
else
  echo "MISS  Claude settings -> $claude_settings_path"
fi

claude_mcp_mode=""
if [[ -f "$claude_settings_path" ]]; then
  claude_mcp_mode="$(node -e '
  const fs = require("fs");
  const settings = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
  const codex = settings?.mcpServers?.codex;
  if (!codex) {
    process.stdout.write("missing");
    process.exit(0);
  }
  const isStock = codex.command === "codex" && Array.isArray(codex.args) && codex.args.length === 1 && codex.args[0] === "mcp-server";
  const args = Array.isArray(codex.args) ? codex.args : [];
  const isBridge = args.some((value) => typeof value === "string" && value.includes("trimtab-codex-mcp-bridge.mjs"));
  if (isBridge) {
    process.stdout.write("observer-bridge");
  } else if (isStock) {
    process.stdout.write("stock");
  } else {
    process.stdout.write("custom");
  }
' "$claude_settings_path")"
fi

case "$claude_mcp_mode" in
  stock)
    echo "OK    Claude Codex MCP -> configured (stock)"
    ;;
  observer-bridge)
    echo "OK    Claude Codex MCP -> configured (Trimtab observer bridge)"
    ;;
  custom)
    echo "OK    Claude Codex MCP -> configured (custom)"
    ;;
  *)
    echo "MISS  Claude Codex MCP -> not configured"
    ;;
esac

if [[ -f "$repo_claude_command" ]]; then
  echo "OK    Project Claude /init-trimtab -> $repo_claude_command"
else
  echo "MISS  Project Claude /init-trimtab -> $repo_claude_command"
fi

if [[ -f "$repo_codex_skill" ]]; then
  echo "OK    Project Codex skill source -> $repo_codex_skill"
else
  echo "MISS  Project Codex skill source -> $repo_codex_skill"
fi

if [[ -f "$repo_codex_skill" && -f "$codex_config_path" ]]; then
  repo_codex_skill_abs="$(cd "$(dirname "$repo_codex_skill")" && pwd)/$(basename "$repo_codex_skill")"
  if grep -Fq "path = \"$repo_codex_skill_abs\"" "$codex_config_path"; then
    echo "OK    Codex \$init-trimtab registration -> $codex_config_path"
  else
    echo "MISS  Codex \$init-trimtab registration -> add $repo_codex_skill_abs to $codex_config_path"
  fi
elif [[ -f "$repo_codex_skill" ]]; then
  echo "MISS  Codex config -> $codex_config_path"
fi
