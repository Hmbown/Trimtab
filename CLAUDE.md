# Trimtab Starter — CLAUDE.md

## Identity

This repository is a bootstrapper for other repositories. It is not the product workspace itself unless the user explicitly says so.

Trimtab is the small control surface that helps one operator steer a much larger project.

Your default job here is:

1. Inspect the target workspace the user wants to operate on
2. Install the Trimtab scaffolding into that workspace
3. Tailor the templates to the target project's domain and constraints
4. Leave the target repo with a usable player/coach workflow

## Source Of Truth

When you are using Trimtab to scaffold or update another workspace, prefer this order:

1. The target workspace's real issue tracker and task surface, if one exists
2. The target workspace's existing instructions and conventions
3. The active task definition and its explicit pass/fail criteria
4. Checked-in artifacts such as dependency graphs, handoff files, and deliverables
5. This repo's templates and guidance
6. Informal chat summaries

When there is conflict, exact task criteria and checked artifacts win over informal summaries.

If the target workspace uses Linear or another dependency-aware issue tracker, the live issue body is the operative prompt and the tracker edges are the operative graph. Local markdown should support that flow, not compete with it.

## Default Bootstrap Behavior

When the user gives you a target path:

1. Inspect that workspace before editing anything
2. Preserve existing instructions and conventions where possible
3. Add or update:
   - `CLAUDE.md`
   - `AGENTS.md`
   - `DEPENDENCY_GRAPH.md`
   - `HANDOFF.md`
   - `deliverables/`
   - GitHub verification templates
4. Prefer using `scripts/bootstrap-workspace.mjs` for the initial scaffold
5. Then customize the generated files so they reflect the real project, not generic placeholder text

## Hard Rules

- Do not assume this starter repo itself is the target project
- Do not push to GitHub or create remotes unless the user explicitly asks
- Do not overwrite an existing target repo's instructions blindly; merge or explain conflicts
- Verification must always be performed by a separate agent or separate context
- A task is not complete because work exists; it is complete only when pass/fail criteria pass
- Review-only or audit-only batches still require external verification, even when the provisional player judgment is "no changes needed"
- Do not extend an existing work product without reviewing its current state first
- If review finds a correctness or integrity problem, fix it before downstream work or stop and document the blocker
- Keep exploratory work explicitly labeled; do not present it as closure evidence
- Leave durable evidence and handoff notes, not just chat conclusions
- If you dispatch Codex through Claude MCP for a bounded worker or verifier task, prefer `approval-policy: never`; the real gate is the issue criteria and independent coach verdict
- Do not keep stopping to ask for the next step when the next unblocked task is already discoverable from the repo, issue graph, handoff, or dependency graph
- Ask questions only when there is a real blocker, missing authority, missing external information, or a materially ambiguous fork that would risk wasted work
- If a lookup returns empty or suspiciously narrow results, try a fallback retrieval strategy before concluding the data does not exist
- Do not take irreversible or high-impact external actions without an explicit permission check

## Zero Tolerance

- Handwaving presented as evidence
- Treating inference as direct observation
- Advancing past dependencies without meeting the stated criteria
- Silently carrying forward a known flawed result
- Claiming success from effort or plausibility instead of recorded evidence
- Using verdict language such as `PASS`, `FAIL`, `no fixes needed`, or `move on` before a separate coach has ruled

## Required Session Flow

The target workspace should end up with this operating model.

### Phase 0: Scope Check

Before doing new work:

- Identify the exact task being advanced
- If a real issue tracker exists, read the live issue body and criteria directly
- Read the active pass/fail criteria directly
- Verify that dependencies are actually unblocked
- Decide whether the session is execution, review, verification, red-team, or exploratory support
- Identify the concrete artifacts that matter for the task

If dependencies are not satisfied, stop at documenting the blocker.

### Phase 1: Review

Before extending existing work:

- Re-read the current work product
- Inspect the relevant code, notes, tests, data, or figures
- Re-run the relevant checks when feasible
- Compare the current state against the task criteria, not against informal expectations
- Look for dependency violations, logic gaps, provenance errors, evidence gaps, and confusing inference with direct evidence

If review finds a bug, integrity issue, or methodology problem:

- Fix it before continuing, or
- Downgrade the claim and document why the task cannot advance

### Phase 2: Targeted Execution

Only after review passes:

- Execute the smallest useful next unit of work
- Prefer reproducible and auditable outputs over persuasive but thin ones
- Keep exploratory outputs explicitly labeled

### Phase 3: Evidence Package

Any meaningful result should be left in a form another reviewer can inspect without replaying the whole session.

Minimum expectations:

- What was tested or changed and why it matters for the task
- Inputs, assumptions, and provenance
- Commands, tests, scripts, or procedures needed to reproduce the result
- Negative results, failure modes, or unresolved objections
- Limitations and reasons the evidence may still be insufficient

### Phase 4: Verification And Handoff

Every substantial session should end with an explicit record:

- Send the exact criteria and work product to a separate coach
- If the player's current view is "looks good" or "no edits needed," record that only as a provisional assessment and mark the batch `Awaiting Verification`
- Record the verification verdict when one exists
- Update the relevant task tracker or handoff artifact
- Note blockers, risks, and what remains

Only `PASS` allows closure.

Before finalizing:

- check correctness against every stated criterion
- check grounding against code, tests, docs, and tool outputs
- check formatting against the required deliverable or tracker structure
- if the next step has external side effects, confirm permission first

## Waterfall Rule

When the target workspace has Linear or another dependency-aware issue tracker:

- start from the active issue or the next unblocked issue
- do not rely on a fresh bespoke prompt between routine tasks
- after a verified `PASS`, update the issue and continue to the next unblocked issue unless the user reprioritizes
- if the next unblocked task is already clear, keep going without asking "what next?"

If the task surface shows a continuous queue of reachable work, default to sustained execution rather than conversational check-ins.

## Sub-Agent Packet Standard

When you dispatch a sub-agent, include:

1. The exact task or issue being served
2. The scope of the assignment
3. The files, artifacts, or systems to inspect
4. The acceptance criteria
5. The expected output format
6. Whether the assignment is review, execution, verification support, or exploratory support
7. A shared-workspace warning when other agents may be editing concurrently

## Working Norms

- Distinguish what is observed from what is inferred
- Record null results and contradictory evidence
- Treat external dependencies as real blockers
- Investigate suspiciously strong results for artifact explanations before presenting them as credible findings
- Prefer direct evidence over persuasive narrative

## Files In This Repo

- `README.md`: human-facing overview
- `AGENTS.md`: role and coordination rules for this starter repo
- `docs/BOOTSTRAP_WORKFLOW.md`: operator guidance
- `docs/CODEX_MCP_BRIDGE.md`: optional observer bridge for Codex MCP
- `docs/LINEAR_SETUP.md`: issue-driven workflow guidance when a live tracker exists
- `scripts/bootstrap-workspace.mjs`: scaffolds a target workspace
- `scripts/setup-claude-mcp.mjs`: installs the Codex MCP entry into Claude settings
- `scripts/trimtab-codex-mcp-bridge.mjs`: observer bridge that wraps `codex mcp-server`
- `scripts/doctor.sh`: checks local setup and project-local init surfaces
- `skills/trimtab/`: the `/trimtab` runtime skill for Claude Code
- `skills/init-trimtab/`: the `$init-trimtab` skill for Claude Code and Codex
- `templates/`: generic files rendered into target workspaces
- `articles/`: public-facing writing about the project
- `Makefile`: convenience targets for doctor, bootstrap, and MCP install
- `package.json`: npm metadata and script aliases

## First Response Pattern

If a user asks you to use this repo for setup, your first step is to identify the target workspace and inspect it. If the target is already given, do not ask unnecessary questions. Inspect, scaffold, tailor, and verify.

If the user invokes `/trimtab` as an execution mode, treat that as permission to work through the reachable task queue with minimal prompting until you hit a real blocker or verification boundary.
