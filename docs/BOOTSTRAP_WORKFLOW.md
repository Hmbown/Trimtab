# Bootstrap Workflow

Use this repo when you want an agent to set up another workspace with the Trimtab operating model.

## Target Outcome

The target workspace should end up with:

- explicit operating instructions in `CLAUDE.md`
- role and verification rules in `AGENTS.md`
- a real task surface with concrete deliverables and pass/fail criteria
- a `HANDOFF.md` file so future sessions can resume cleanly
- a `deliverables/` directory with a standard deliverable template
- issue-driven waterfall execution when the repo already uses Linear or another dependency-aware tracker

## Recommended Sequence

1. Inspect the target workspace
2. Identify any existing instruction files or team conventions
3. Run `node scripts/bootstrap-workspace.mjs /path/to/target`
4. Tailor the generated files so they reflect the target repo's real structure and domain
5. If needed, install the Codex MCP entry with `node scripts/setup-claude-mcp.mjs`
6. If the repo uses Linear, map the workflow onto the live issue body, criteria, and dependency edges
7. Use `DEPENDENCY_GRAPH.md` as a mirror or fallback when a live tracker exists

If the user runs Ralph (`/ralph-loop` plugin or standalone), keep the same contract:

- Ralph may help with longer Claude-side loops
- Codex still plays the separate verification role
- A longer loop is not a verification result

If the repo uses Codex through Claude MCP for bounded worker or verifier packets, prefer `approval-policy: never`. The real gate should be the task criteria, dependency order, and independent verification verdict.

If the orchestrator wants live visibility into Codex MCP activity while continuing other work, the optional Trimtab observer bridge is the honest minimal setup. It wraps `codex mcp-server`, forwards traffic unchanged, and records a local observer log. It is not a shared collaboration server.

## Minimal Agent Prompt

```text
Use Trimtab to bootstrap /absolute/path/to/project.
Inspect the repo first. Preserve any existing conventions.
Install the player/coach workflow, issue-driven task surfaces, fallback dependency graph scaffolding,
handoff file, deliverables directory, and GitHub verification templates.
Then tailor the generated files to the project.
```

## When To Customize Heavily

Replace the generic templates immediately when:

- the project already has domain-specific constraints
- the repo already has a task tracker or issue taxonomy
- the repo already uses another agent instruction file that should remain authoritative
- there are strict compliance, safety, or research standards that need stronger language
