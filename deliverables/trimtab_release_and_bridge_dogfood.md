# Trimtab Release and Bridge Dogfood

**Project:** Trimtab Starter Repo
**Prepared by:** Claude Opus (player)
**Verified by:** Awaiting Verification
**Date:** 2026-03-08
**Status:** Awaiting Verification

---

## Purpose

Full dogfood of Trimtab as a release candidate. Verifies release-readiness, observer bridge functionality, doc/script/template consistency, and the Ralph integration story.

## Task

Dogfood Trimtab in this repository as a full release-candidate and runtime audit.

## Pass/Fail Criteria

1. README accurately describes the actual bootstrap, init, runtime, and observer-bridge flow
2. Player/coach contract is strict everywhere: no self-verdicts, zero-edit batches still require verification
3. Linear-first / issue-driven / next-unblocked waterfall model is described consistently
4. Codex MCP guidance consistently recommends `approval-policy: never` for bounded worker/verifier packets
5. Observer bridge is described honestly as a local observer/control surface, not a hosted multi-client system
6. `scripts/setup-claude-mcp.mjs` works for both stock and observer mode, including `--dry-run`
7. `scripts/doctor.sh` correctly detects the observer bridge configuration
8. Bridge actually writes runtime files under `./.trimtab/runtime/codex-mcp/` during real Codex activity
9. Public-facing writing in `articles/` still feels publishable and consistent with the product
10. Any release blockers are either fixed or explicitly called out
11. Codex independently verifies the final state with PASS

## Evidence Package

### Scripts Tested

| Test | Result |
|---|---|
| `node scripts/setup-claude-mcp.mjs --dry-run` (stock) | PASS — outputs correct JSON with stock codex config |
| `node scripts/setup-claude-mcp.mjs --observer --dry-run` | PASS — outputs correct JSON with bridge path |
| `./scripts/doctor.sh` (starter repo) | PASS — detects all tools, bridge config, Ralph plugin, and correctly reports MISS for project-local init surfaces |
| `./scripts/doctor.sh` (bootstrapped target) | PASS — detects init-trimtab surfaces correctly |
| Bootstrap into temp directory | PASS — all 12 files created, template variables rendered, structure correct |
| Codex MCP worker task dispatched | PASS — Codex returned valid summary response with thread ID |

### Bridge Runtime Test

**Finding 1: TDZ bug (fixed).** The bridge script had a critical JavaScript temporal dead zone error — `JsonRpcFramingParser` class was defined at line 328 but first referenced at line 59. This caused the bridge to crash on every startup. The class has been moved above its first usage and the bridge now starts correctly.

**Finding 2: Bridge works standalone.** After the TDZ fix, the bridge starts, spawns codex, writes `latest.json` and a JSONL event log, records session-start and session-end events, and exits cleanly. The implementation is correct.

**Finding 3: Claude Code SDK override.** Claude Code v2.1.x uses its own internal SDK mechanism (`type: "sdk"`) to launch the codex MCP server, bypassing the `settings.json` config. All running codex MCP processes in this session are stock `codex mcp-server` — none are wrapped by the bridge. No bridge runtime output was generated within the Claude Code session itself.

This is documented in `docs/CODEX_MCP_BRIDGE.md` under "Known Limitation: Claude Code SDK Override".

**Finding 4: End-to-end MCP traffic test.** Piped real MCP messages (initialize, notifications/initialized, tools/list) through the bridge. The bridge:
- Forwarded all traffic to codex unchanged — codex responded normally
- Recorded `latest.json` with `recentEvents` showing both responses (initialize id:1, tools/list id:2)
- Recorded 7 events in the JSONL log: session-start, request, response, notification, request, response, session-end
- Correctly classified messages as request/response/notification
- Tracked request-response correlation (responseTo field matches request id)

Evidence at `/tmp/trimtab-bridge-e2e/logs/latest.json` and `*.jsonl`.

**Assessment for criterion 8:** The bridge writes runtime files correctly during real MCP activity when invoked directly. It is not invoked during Claude Code sessions due to the SDK override. The bridge implementation is complete and functional; the gap is in Claude Code's MCP lifecycle, not in Trimtab.

### Consistency Audit

| Criterion | Status | Notes |
|---|---|---|
| README accuracy | Fixed | Added missing files to layout and source-of-truth order; corrected ralph install instructions; added bridge limitation notice |
| Player/coach contract strictness | Present everywhere | Verified across CLAUDE.md, AGENTS.md, skills/trimtab, skills/init-trimtab, all templates, all docs |
| No self-verdicts rule | Present everywhere | Zero-edit batches explicitly require external verification in CLAUDE.md, AGENTS.md, both skills, and templates |
| Linear-first waterfall model | Consistent | Present in README, CLAUDE.md, AGENTS.md, skills, docs/LINEAR_SETUP.md, templates |
| `approval-policy: never` | 13 files | README, CLAUDE.md, AGENTS.md, both skills, all relevant docs, templates, packets reference |
| Observer bridge honesty | Fixed | Described as local observer/control surface only; known SDK limitation documented |
| Articles consistency | Consistent | Articles describe the core loop accurately; they don't mention the bridge (which is fine since the bridge isn't functional yet); they don't oversell |

### Issues Found and Fixed

| # | Issue | Severity | Fix |
|---|---|---|---|
| 1 | `.gitignore` missing `.trimtab/runtime/` | Medium | Added |
| 2 | CLAUDE.md "Files In This Repo" incomplete | Medium | Added all missing entries |
| 3 | README layout incomplete | Low | Added skills/, articles/, deliverables/, Makefile, package.json |
| 4 | README source-of-truth order missing skills/ | Low | Added |
| 5 | Makefile missing `install-codex-mcp-observer` target | Low | Added |
| 6 | `setup-claude-mcp.mjs` variable `repoRoot` misleading | Low | Renamed to `scriptsDir` |
| 7 | Doctor.sh starter-vs-target distinction undocumented | Low | Added header comment |
| 8 | `ralph-claude-code` npm package doesn't exist | High | Fixed all references to describe plugin and standalone install |
| 9 | Doctor.sh checked fake npm package | Medium | Now checks for plugin dir and standalone binary |
| 10 | Observer bridge TDZ crash bug | Critical | Fixed — moved class definition above first usage |
| 11 | Observer bridge not invoked by Claude Code SDK | Medium | Documented as known limitation — bridge works standalone |

### Ralph Investigation

- `ralph-claude-code` npm package does not exist on npm
- Ralph is actually installed via:
  - Claude Code plugin `ralph-loop@claude-plugins-official` (provides `/ralph-loop` and `/cancel-ralph`)
  - Standalone bash scripts at `~/.ralph/` (provides `ralph` command)
- All README, docs, and template references updated from fake npm package to actual install methods
- Doctor.sh updated to detect both plugin and standalone installations

### Linear + Ralph Integration

Added to the `/trimtab` skill:
- New "Linear-Driven Execution" section describing the barely-prompted waterfall loop
- Updated "When To Use `/ralph`" with the Linear + Ralph pattern
- New "Ralph Integration" section with a concrete `/ralph-loop` invocation example
- New "Linear + Ralph Continuous Loop" workflow profile in references/workflow-profiles.md
- Updated "First Move" to include offering `/ralph-loop` when appropriate

## Files Changed

- `.gitignore` — added `.trimtab/runtime/`
- `CLAUDE.md` — expanded "Files In This Repo"
- `README.md` — layout, source-of-truth, ralph install, bridge limitation notice
- `Makefile` — added `install-codex-mcp-observer` target
- `scripts/setup-claude-mcp.mjs` — renamed misleading variable
- `scripts/doctor.sh` — starter-vs-target comment, ralph detection fix
- `scripts/trimtab-codex-mcp-bridge.mjs` — fixed TDZ crash bug, moved class definition above first usage
- `docs/CODEX_MCP_BRIDGE.md` — SDK limitation section, gitignore note
- `docs/BOOTSTRAP_WORKFLOW.md` — ralph reference fix
- `templates/HANDOFF.md.tmpl` — ralph reference fix
- `skills/trimtab/SKILL.md` — Linear execution, Ralph integration, first-move update
- `skills/trimtab/references/workflow-profiles.md` — Linear + Ralph profile
- `deliverables/trimtab_release_and_bridge_dogfood.md` — this file

## Open Objections and Limitations

1. **Observer bridge works standalone but not within Claude Code** — The TDZ crash bug is fixed and the bridge works correctly when invoked directly. However, Claude Code v2.1.x uses its own SDK mechanism to launch codex MCP servers, bypassing the settings.json config. The bridge is functional code with a documented integration gap.

2. **Criterion 8 partially satisfied** — The bridge writes runtime files correctly when invoked directly (tested and confirmed). It does not write them within a Claude Code session due to the SDK override. The distinction is documented honestly.

3. **Ralph plugin availability** — The `/ralph-loop` plugin is distributed through Claude Code's plugin system. Users need it enabled in their settings. The integration pattern described in the trimtab skill assumes the plugin is available.

4. **Doctor.sh in starter repo** — Doctor correctly reports MISS for project-local init surfaces in the starter repo. This is documented in the script header but could confuse first-time users running doctor from this repo.

## Player Provisional Assessment

The repo is release-ready with one documented asterisk: the observer bridge is correctly designed, configured, and detected, but not functional in practice due to Claude Code's SDK mechanism. All other criteria are met. The doc/script/template consistency is now strong. The Ralph integration story is explicit. The articles are publishable.

**Provisional assessment: likely ready for release with the bridge limitation called out. Awaiting Verification.**
