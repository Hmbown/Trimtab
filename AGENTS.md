# Trimtab Starter — AGENTS.md

## Purpose

This repo exists to install a repeatable player/coach workflow into other repositories. Agents operating here should keep the output generic, reusable, auditable, and safe to publish on GitHub.

Trimtab is intentionally small. It should steer larger projects without becoming their payload.

## Shared Workspace Rules

- Multiple agents may inspect or edit files concurrently
- Do not revert changes you did not author unless the user explicitly asks
- Focus only on your assigned task
- If the target workspace already has instructions, preserve and merge them carefully
- Keep target-specific secrets, credentials, and local machine state out of the starter repo

## Session Workflow

Every substantial session should follow the same order.

### 1. Dependency And Scope Check

Before substantive work:

- Identify the exact task, issue, or deliverable being advanced
- If Linear or another issue tracker exists, read the live issue body and criteria directly
- Read the active pass/fail criteria and instructions before editing
- Verify that required dependencies are already satisfied
- Decide whether the session is execution, review, verification, red-team, or exploratory support

If dependencies are not satisfied, document the blocker and stop.

### 2. Review-First Pass

Before extending existing work:

- Inspect the current work product directly
- Review the relevant code, notes, tests, figures, or data
- Re-run relevant checks when feasible
- Look for dependency violations, logic gaps, provenance errors, missing evidence, and inference presented as direct observation

### 3. Fix-First Rule

If review uncovers a correctness, integrity, or methodology problem:

- Fix it before doing downstream work, or
- Document why the task cannot advance

No agent should knowingly build new claims on top of a flawed upstream result.

### 4. Execution

After review passes:

- Perform the smallest useful next unit of work
- Keep exploratory work explicitly labeled as exploratory
- Produce reproducible outputs where possible
- Tie the work back to the task's pass/fail criteria

### 5. Record And Handoff

At the end of every substantial session:

- Update the durable artifact that tracks the work
- If an issue tracker exists, update the relevant issue or issues directly
- Record what changed, what evidence was produced, and what remains
- Note blockers, risks, and external dependencies
- Leave enough detail for another agent to continue without replaying the whole session

## Roles

### Player

The primary agent that performs the task in the target workspace.

Responsibilities:

- Read the active issue first when one exists; use the dependency graph as a mirror or fallback task surface
- Produce auditable deliverables tied to explicit pass/fail criteria
- Treat review-only and audit-only batches as real deliverables that still require verification
- Request verification before marking work complete
- Record blockers, risks, and next-step state in durable artifacts

### Coach

A separate agent or separate reasoning context that verifies the work product.

Responsibilities:

- Read the deliverable and criteria fresh
- Evaluate the exact criteria, not the intent
- Return `PASS`, `FAIL`, or `INSUFFICIENT`
- Be adversarial and specific
- Block closure when evidence is incomplete, contradictory, or non-reproducible

### Red Team (Optional)

Used for tasks where alternative explanations, hidden regressions, or leakage paths matter.

Responsibilities:

- Attempt to break the claim or implementation
- Propose plausible failure modes
- Surface unresolved risks as blockers, not footnotes

## Sub-Agent Packet

When dispatching a sub-agent, include:

1. The exact task or issue being served
2. The precise scope of the assignment
3. The files, artifacts, or systems to inspect
4. The acceptance criteria
5. The expected output format
6. Whether the assignment is review, implementation, verification support, or exploratory support

Sub-agents produce auditable work products. They do not silently decide closure.

## Verification Protocol

1. Every task must define a deliverable
2. Every task must define explicit pass/fail criteria
3. The player submits the deliverable together with the relevant evidence
4. The coach verifies independently against the exact criteria
5. The coach returns `PASS`, `FAIL`, or `INSUFFICIENT`
6. Only `PASS` allows the task to close or move forward

The player may record a provisional assessment, but it may not use final verdict language before the coach responds.

When a dependency-aware issue tracker exists, the issue body is the operative task packet and the dependency edges are the operative graph. The default next task is the next unblocked issue, not a new bespoke prompt.

When Codex is called through Claude MCP for a bounded worker or verifier packet, prefer `approval-policy: never`. Governance should come from task criteria, dependency gates, and coach verdicts rather than interactive approval churn.

## Interaction Rules

### Dependency Enforcement

No agent starts substantive work on a blocked task. If a dependency is unresolved, document it and stop.

### Evidence Chain

Every work product should be traceable to:

1. The task or issue it serves
2. The pass/fail criterion it addresses
3. The sources, calculations, tests, or assumptions it uses
4. The verification state it currently holds

### Exploratory Status

Exploratory results are allowed, but they must stay clearly marked as exploratory. They do not count as closure evidence until promoted explicitly.

### Audit-Only Batches

An audit or review batch that results in zero edits is still a deliverable.

- Record the audit memo
- Mark it `Awaiting Verification`
- Send it to the coach
- Do not treat "no fixes needed" as final until the coach returns `PASS`

### Durable Communication

Record conclusions in durable artifacts such as issue comments, handoff notes, or checked-in documents. Informal chat summaries alone do not count.

## Quality Standards

1. No claim without evidence
2. No evidence without provenance
3. No provenance without reproducibility when reproducibility is feasible
4. No closure without independent verification
5. No downstream work on top of a known flawed upstream result

## GitHub Discipline

For repos bootstrapped with this starter:

- Pull requests should cite the task or tasks addressed
- Pull requests should include the verification result
- Tasks should be written so another agent can evaluate them without hidden context
