# Trimtab

![Trimtab stone](./articles/trimtabstone.jpg)

Trimtab is a GitHub-ready starter for self-verifying agentic work.

One agent does the work. A separate agent verifies it. Nothing moves forward until the criteria pass.

This repo is for installing that operating model into other repositories, then running it with discipline.

## Why It Exists

Most agent workflows still collapse planning, execution, and approval into one loop. That is the failure mode Trimtab is built to prevent.

Trimtab makes a few rules explicit:

1. The task needs a real deliverable.
2. The task needs explicit pass/fail criteria.
3. The player may not grade its own work.
4. Review-only and zero-edit batches still require external verification.
5. If a dependency-aware tracker exists, the tracker becomes the live task surface.

The goal is not "autonomous AI." The goal is verified progress with a clean evidence trail.

## The Operating Model

The default topology is intentionally simple:

- Claude Code as the primary orchestrator / player
- Codex as worker support and independent coach
- Linear as the primary task surface when it exists
- GitHub as the durable repo and review surface
- Ralph as optional long-running player orchestration, never as the verifier

The steady state looks like this:

```text
Backlog -> In Progress -> Awaiting Verification -> Done
```

That split between `Awaiting Verification` and `Done` is the whole point. It prevents "work exists" from being mistaken for "work passed."

## What You Get

Point Trimtab at another repository and it can scaffold:

- `CLAUDE.md` with player-side execution and evidence rules
- `AGENTS.md` with shared-workspace and coach protocol
- `DEPENDENCY_GRAPH.md` as a repo-local graph or fallback mirror
- `HANDOFF.md` for clean session continuation
- `deliverables/` with a reusable deliverable template
- `.trimtab/init-trimtab-protocol.md` as the shared project-local source of truth
- `.claude/commands/init-trimtab.md` as the Claude Code entrypoint
- `.codex/skills/init-trimtab/` as the repo-stored Codex skill source
- GitHub issue and PR templates that require criteria and verification evidence

If the target repo already uses Linear or another dependency-aware tracker, Trimtab is supposed to adapt to that reality, not flatten it into generic markdown.

## Quick Start

### 1. Bootstrap a target workspace

```bash
node scripts/bootstrap-workspace.mjs /absolute/path/to/target-project
```

Optional:

```bash
node scripts/bootstrap-workspace.mjs /absolute/path/to/target-project \
  --project-name "My Project" \
  --force
```

### 2. Install Codex MCP into Claude settings

Stock Codex MCP:

```bash
node scripts/setup-claude-mcp.mjs
```

Observer bridge mode:

```bash
node scripts/setup-claude-mcp.mjs --observer
```

Or via npm scripts:

```bash
npm run install:codex-mcp
npm run install:codex-mcp:observer
```

### 3. Verify your local setup

```bash
./scripts/doctor.sh
```

In a bootstrapped target repo, `doctor.sh` checks the project-local `.claude` and `.codex` init surfaces.
In this starter repo itself, those project-local surfaces are intentionally not present, so those lines will report `MISS`.

### 4. Initialize the target repo

After bootstrap, the target repo should use project-local entrypoints:

```text
Claude Code: /init-trimtab
Codex: register .codex/skills/init-trimtab/SKILL.md, then run $init-trimtab
```

## What Bootstrap Writes

```text
your-project/
├── CLAUDE.md
├── AGENTS.md
├── DEPENDENCY_GRAPH.md
├── HANDOFF.md
├── .trimtab/
├── .claude/
├── .codex/
├── deliverables/
└── .github/
```

Core files written by the bootstrapper:

- `CLAUDE.md`
- `AGENTS.md`
- `DEPENDENCY_GRAPH.md`
- `HANDOFF.md`
- `deliverables/DELIVERABLE_TEMPLATE.md`
- `deliverables/.gitkeep`
- `.trimtab/init-trimtab-protocol.md`
- `.claude/commands/init-trimtab.md`
- `.codex/skills/init-trimtab/SKILL.md`
- `.codex/skills/init-trimtab/agents/openai.yaml`
- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/ISSUE_TEMPLATE/task.md`

Existing files are preserved by default. `--force` only overwrites template-managed files.

## How the Loop Works

1. Read the current issue or next unblocked issue if a live tracker exists.
2. Use the issue body as the task packet: deliverable, dependencies, pass/fail criteria.
3. Produce the work and evidence package.
4. Send the exact criteria and evidence to a separate coach.
5. If the coach returns `FAIL` or `INSUFFICIENT`, fix the findings and resubmit.
6. Only after `PASS` does the issue move to `Done`.

If the repo has no live tracker, use `DEPENDENCY_GRAPH.md` and `HANDOFF.md` as the local fallback surfaces.

## Observer Bridge

Trimtab includes an optional observer bridge for Codex MCP.

It does three things:

- wraps `codex mcp-server`
- forwards MCP traffic unchanged
- records local runtime events and thread metadata

This is a local observer surface, not a hosted multi-client system.

Important current limitation as of March 8, 2026:

- Claude Code may launch the stock Codex MCP server through its own SDK path and bypass the configured bridge entry.
- When that happens, the bridge is configured correctly but is not the process Claude actually runs.
- The bridge still works when invoked directly.

Details live in [docs/CODEX_MCP_BRIDGE.md](./docs/CODEX_MCP_BRIDGE.md).

## Tooling

Minimum useful stack:

| Tool | Role |
|---|---|
| Claude Code | Primary player / orchestrator |
| Codex CLI | Coach and worker support |
| GitHub | Durable review and publication surface |
| Linear | Preferred live task graph when present |
| Ralph | Optional long-running player loop |

Required CLIs:

```bash
npm install -g @anthropic-ai/claude-code
npm install -g @openai/codex
codex auth
```

Optional Ralph paths:

- Claude Code plugin: `ralph-loop`
- Standalone scripts: [ghuntley.com/ralph](https://ghuntley.com/ralph/)

If you use Codex through Claude MCP for bounded worker and verifier packets, the recommended default is `approval-policy: never`. The real approval surface should be the issue criteria, dependency status, and independent coach verdict.

## Repo Layout

```text
trimtab/
├── README.md
├── CLAUDE.md
├── AGENTS.md
├── DEPENDENCY_GRAPH.md
├── HANDOFF.md
├── deliverables/
├── docs/
├── scripts/
├── skills/
├── templates/
├── articles/
├── .github/
├── Makefile
└── package.json
```

## Source Of Truth Order

Inside this starter repo, use this order:

1. `README.md`
2. `CLAUDE.md`
3. `AGENTS.md`
4. `DEPENDENCY_GRAPH.md`
5. `HANDOFF.md`
6. `docs/`
7. `skills/`
8. `templates/`
9. `scripts/`

When Trimtab is installed into another repo, that target repo's issue tracker and checked-in instructions outrank this starter.

## This Repo Uses Trimtab On Itself

This repository is intentionally dogfooding the workflow it ships:

- launch and maintenance work are tracked in `DEPENDENCY_GRAPH.md`
- current state is recorded in `HANDOFF.md`
- session evidence lives in `deliverables/`
- public contribution expectations are in `CONTRIBUTING.md`

That keeps the repo honest. It should demonstrate the operating model, not just describe it.

## North Star

Turn intent into verified progress, not autonomous slop.
