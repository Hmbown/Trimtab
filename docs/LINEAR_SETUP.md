# Linear Setup

Linear is optional. But when it exists, it should become the primary live task surface.

Use Linear when:

- the project has many tasks with nontrivial dependencies
- multiple humans or agents need shared task state
- you want explicit blockers, milestones, and comments instead of only local markdown

When Linear is present, the intended operating model is:

- the issue body is the operative prompt
- the issue's acceptance criteria are the operative pass/fail criteria
- `blockedBy` or equivalent edges are the operative dependency graph
- comments, status, and linked deliverables are the durable waterfall trail
- after a verified `PASS`, the next unblocked issue becomes the default next task

## Recommended Mapping

For each task in the project graph, create a Linear issue with:

- a concrete deliverable
- explicit dependencies / blockers
- explicit pass/fail criteria
- links to the deliverable file once it exists

Do not rely on a second freehand prompt if the issue already contains the task packet.

## Recommended Status Flow

Use something equivalent to:

`Backlog -> In Progress -> Awaiting Verification -> Done`

Review-only or audit-only batches should still move through `Awaiting Verification`.

## Lifecycle Rule

Do not move an issue to `Done` unless the associated deliverable has received an explicit verification `PASS`.

If you are using Codex through Claude MCP for bounded worker or verifier packets, prefer `approval-policy: never`. The actual approval surface should be the Linear issue criteria, dependency status, and coach verdict.

## Useful Pattern

- Keep the dependency graph markdown as a mirror, summary, or fallback
- Use Linear as the live execution surface for the same graph
- Record verification verdicts in the issue comments or description updates
