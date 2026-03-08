# Trimtab — Dependency Graph

This repo is using its own workflow. These tasks define the current public launch and immediate follow-on work.

## Project Goal

Ship Trimtab as a credible public starter repo for self-verifying agentic execution, with a clean GitHub surface, working bootstrap tooling, honest docs, and durable handoff artifacts.

## Rules

- Every task must produce a concrete deliverable
- Every task must have explicit pass/fail criteria
- No task closes without independent coach verification
- Review-only and zero-edit batches still require verification
- If GitHub Issues or another tracker becomes the live surface later, this file becomes the mirror or fallback

## Active Tasks

| ID | Title | Status | Depends On | Deliverable | Pass/Fail Criteria |
|---|---|---|---|---|---|
| TT-001 | Public repo launch polish | Done | — | `deliverables/public_repo_launch_2026-03-08.md` | README is polished and accurate, root repo artifacts exist, package metadata is credible, and the repo is push-ready |
| TT-002 | Independent verification of launch surface | Done | TT-001 | Verification note in `deliverables/public_repo_launch_2026-03-08.md` | A separate coach returns `PASS`, `FAIL`, or `INSUFFICIENT` against TT-001 |
| TT-003 | First live dogfood in a target repo | TODO | TT-002 | Linked deliverable from a real target workspace | A real external repo is bootstrapped, tailored, and independently verified |
| TT-004 | Observer bridge runtime validation in Claude Code | TODO | — | Updated bridge note in `deliverables/trimtab_release_and_bridge_dogfood.md` or successor deliverable | The bridge is either confirmed working in Claude Code or the limitation remains documented with exact reproduction evidence |

## Next Unblocked Task

- TT-003 is the next unblocked proof task.
- TT-004 remains a parallel technical follow-up on the observer bridge.
