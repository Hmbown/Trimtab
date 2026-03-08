# Codex MCP Observer Bridge

Trimtab can optionally wrap the stock Codex MCP server with a local observer bridge.

The point is not to replace Codex. The point is to give the main orchestrator a better visibility surface while Codex workers or verifiers are running.

## What It Does

The bridge:

- launches `codex mcp-server`
- forwards MCP traffic unchanged
- records parsed MCP requests, responses, and notifications to a local JSONL log
- writes a `latest.json` summary with recent events and active thread IDs

That gives the orchestrator a local surface it can inspect while continuing other work.

## What It Does Not Do

This is not:

- a hosted shared service
- a full multi-client observer API
- a subscription hub
- a privacy-safe broadcast layer

It is a local bridge and log surface.

## Why Trimtab Uses It

This makes the player loop more practical:

- Claude can keep orchestrating while Codex threads run
- the orchestrator can inspect thread IDs and recent event activity
- long-running worker loops are easier to redirect or resume
- the system can rely less on a single monolithic high-reasoning context

It does **not** change the verification contract:

- issue criteria still gate the work
- dependency order still gates the work
- the coach verdict still gates closure
- `approval-policy: never` remains the preferred mode for bounded worker and verifier packets

## Installation

Install the stock MCP entry:

```bash
node scripts/setup-claude-mcp.mjs
```

Install the observer bridge instead:

```bash
node scripts/setup-claude-mcp.mjs --observer
```

Optional custom log directory:

```bash
node scripts/setup-claude-mcp.mjs --observer --log-dir /absolute/path/to/codex-mcp-logs
```

## Runtime Output

By default, the bridge writes logs to:

```text
./.trimtab/runtime/codex-mcp/
```

at the Claude session working directory.

Files:

- `TIMESTAMP-PID.jsonl`: append-only event log
- `latest.json`: current session summary with recent events and active threads

## Known Limitation: Claude Code SDK Override

Claude Code (as of v2.1.x) may use its own internal SDK mechanism to launch the `codex` MCP server, bypassing the `mcpServers.codex` entry in `settings.json`. When this happens:

- `setup-claude-mcp.mjs --observer` correctly writes the bridge config to `settings.json`
- `doctor.sh` correctly detects the observer bridge config
- but Claude Code starts the stock `codex mcp-server` directly through its SDK layer instead of the bridge script
- the bridge runtime output (`latest.json`, JSONL logs) is never generated in a Claude Code session

The bridge itself works correctly when invoked directly (e.g., `node scripts/trimtab-codex-mcp-bridge.mjs`). The gap is in Claude Code's MCP server launch path, not in the bridge implementation.

Workarounds:

- register the bridge under a different MCP server name (not `codex`) to avoid the SDK override
- run the bridge manually in a terminal and point Claude at it through a different config mechanism
- wait for Claude Code to support user-configurable codex MCP server launch

This limitation is documented honestly. The bridge is functional standalone but not yet operational within Claude Code's MCP lifecycle.

## Privacy Note

Codex MCP events can include command execution details and other sensitive runtime data.

Treat the observer log as sensitive local runtime state:

- keep it local
- do not commit it by default (`.trimtab/runtime/` is in `.gitignore`)
- do not assume it is safe to share broadly

If a repo wants a true multi-client share layer, ACLs, filtering, or redaction, that should be designed as a separate system.
