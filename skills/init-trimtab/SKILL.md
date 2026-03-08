---
name: init-trimtab
description: "Use when the user asks for $init-trimtab or wants to inspect a specific repo and install or retune a Trimtab player/coach workflow for that project's actual constraints, tools, and task graph."
---

# $init-trimtab

Use this skill when the user wants to:

- install Trimtab into a specific project
- retune an existing Trimtab setup to match the repo's real workflow
- make the workflow project-local instead of relying on a global-only skill
- inspect repo instructions, dependency graph, issue tracker, and agent surfaces before editing the Trimtab config

## Default Goal

Make Trimtab travel with the repository.

Prefer a checked-in, project-local setup over a user-global-only setup:

- **Claude Code entrypoint:** project command at `.claude/commands/init-trimtab.md`
- **Shared canonical protocol:** `.trimtab/init-trimtab-protocol.md`
- **Codex skill source:** `.codex/skills/init-trimtab/` with registration path `.codex/skills/init-trimtab/SKILL.md`

This keeps the repo's workflow inspectable and versioned with the repo itself.

Default to the thinnest useful installation.

That means:

- prefer adapting existing repo surfaces over creating new ones
- only create missing files when there is no strong equivalent already present
- if the repo already has a task queue, handoff file, issue tracker, or instruction surface, hook Trimtab into it instead of replacing it
- do not create extra workflow files just because the starter repo happens to use them

When a repo uses Linear, the ideal end state is:

- the Linear issue body is the operative prompt
- issue dependencies are the operative graph
- comments and status changes are the durable waterfall surface
- the next task is chosen from the next unblocked issue, not from a fresh bespoke prompt
- local files such as `HANDOFF.md` support the issue flow instead of replacing it

## First Move

1. Identify the target workspace
2. Inspect the repo before editing anything
3. Decide which mode applies:
   - **Bootstrap**: no usable Trimtab workflow exists yet
   - **Protocol upgrade**: workflow exists but needs stricter rules
   - **Retune**: workflow exists and should be adapted to the repo's actual tools and conventions
4. Preserve strong existing instructions instead of flattening them into starter boilerplate

## What To Inspect

Read [references/repo-audit.md](references/repo-audit.md) before you start patching.

At minimum inspect:

- root docs such as `README.md`
- existing `CLAUDE.md`, `AGENTS.md`, `DEPENDENCY_GRAPH.md`, and `HANDOFF.md`
- `.github/` templates and workflows
- repo build, test, and lint entrypoints
- issue-tracker signals such as Linear, beads, Jira, or GitHub Issues
- any existing `.claude/commands/`, `.claude/agents/`, or `.codex/skills/`

## Default Workflow Topology

Default to the safest profile unless the repo already has a better explicit one:

- **Orchestrator / player:** Claude Code
- **Worker sub-agents:** Claude and/or Codex sub-agents as useful
- **Closure verifier / coach:** fresh Codex context

This is a default, not a prison. Preserve a project-specific topology if it is already explicit, coherent, and independently verifiable.

Topology invariant:

- never scaffold `Claude -> Claude` as the default player/coach pattern
- prefer `Claude -> Codex` by default
- allow `Codex -> Codex` when the repo is Codex-led, as long as the coach is a fresh separate Codex context
- treat other non-Claude player -> Codex variants as optional future patterns, not the default

Override conditions:

- Codex is unavailable in the environment
- the user explicitly asks for a different topology
- the repo already has a stronger explicit topology the operator wants to preserve

If you override the default, record the reason explicitly in the protocol or handoff.

Default authority boundary:

- the Codex coach is the only verifier
- the Codex coach is the only actor allowed to touch Linear in the Trimtab loop
- Claude may orchestrate and edit local files, but should not itself verify or post workflow updates to Linear unless the repo explicitly wants a different topology
- worker contexts, including Codex workers, should not directly update Linear; they return evidence to the coach or orchestrator

## Required Outputs

When you initialize or retune a repo, leave these surfaces aligned:

- `CLAUDE.md`
- `AGENTS.md`
- `DEPENDENCY_GRAPH.md` or the repo's real dependency-graph surface
- `HANDOFF.md`
- `.trimtab/init-trimtab-protocol.md`
- `.claude/commands/init-trimtab.md`
- `.codex/skills/init-trimtab/` with `SKILL.md` as the registration target

If the repo does not use one of these exact files, adapt to the repo's real surface and record the deviation.

## Rules

- Do not overwrite existing instructions blindly
- Do not invent a dependency graph if the repo already has one elsewhere
- Do not create a new local dependency graph if the repo already has a real operative task surface such as Linear, GitHub Issues, beads, or an existing handoff/task file
- Do not create duplicate handoff or queue files when the repo already has a strong equivalent
- Do not strip out issue-tracker integration just because the starter is generic
- Do not assume the safest default is always the final topology
- Keep the Claude and Codex entrypoints thin and aligned to the shared protocol file
- If you change the protocol, keep both wrappers consistent with it
- Install the no-self-verdict rule explicitly: review-only or zero-edit batches still go to an external coach before anyone says `PASS` or "no fixes needed"
- If Linear exists, make the issue body, criteria, and dependency edges the primary task packet
- If Linear exists, make the waterfall rule explicit: after a verified issue closes, the player should continue to the next unblocked issue unless the operator reprioritizes
- If Linear exists, make the authority boundary explicit: the Codex coach handles Linear reads/writes and verification; Claude orchestrates unless the repo explicitly chooses another topology
- If the repo already has a rich queue or issue graph, do not spend the session rebuilding it from scratch unless the user explicitly asked for that migration
- Ask clarifying questions only when blocked by missing authority, missing external information, or a genuinely ambiguous mapping between Trimtab and the repo's existing workflow
- If the repo uses Codex through Claude MCP, recommend `approval-policy: never` for bounded worker and verifier packets; the real gate should be issue criteria plus independent verification
- If the repo wants orchestrator-side visibility into live Codex MCP work, consider the optional Trimtab observer bridge; describe it honestly as a local observer surface, not a shared collaboration layer

## Success Condition

The repo should end with:

- one canonical project-local Trimtab protocol
- one Claude Code entrypoint for `/init-trimtab`
- one repo-stored Codex skill source for `$init-trimtab`, plus a clear local registration path
- workflow docs and task surfaces adapted to the actual project rather than left as boilerplate
