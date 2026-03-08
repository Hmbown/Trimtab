# Contributing

Trimtab is a small starter repo. Contributions should make the workflow sharper, more auditable, and easier to install into real projects without inflating the payload.

## Standard

Every meaningful change should carry:

- a concrete task or problem statement
- explicit pass/fail criteria
- a durable artifact or evidence trail
- independent verification before closure language

If a change only adjusts wording, templates, or docs, it still needs a clear reason and a review-first pass.

## Workflow

1. Read [README.md](./README.md), [CLAUDE.md](./CLAUDE.md), and [AGENTS.md](./AGENTS.md).
2. Check [DEPENDENCY_GRAPH.md](./DEPENDENCY_GRAPH.md) and [HANDOFF.md](./HANDOFF.md) before starting new work.
3. Make the smallest useful change that advances the task.
4. Record evidence in `deliverables/` or another durable artifact.
5. Mark the batch `Awaiting Verification` until a separate coach verifies it.

## Pull Requests

Use the PR template. A good PR in this repo should include:

- the task or deliverable it advances
- the exact criteria it claims to satisfy
- the evidence used
- the verification result or the fact that it is still awaiting verification

## Scope Discipline

Good changes:

- improve the starter workflow
- fix correctness issues in scripts or templates
- make the repo easier to adopt in another workspace
- improve the honesty and clarity of the public-facing docs

Bad changes:

- repo-specific secrets or local machine state
- platform bloat unrelated to the starter's purpose
- claims of autonomy without an independent verification path

## Questions To Ask Before Opening A PR

- Does this preserve the player/coach split?
- Does it strengthen the evidence trail?
- Does it keep the starter generic enough for reuse?
- Could another agent verify this change without hidden context?
