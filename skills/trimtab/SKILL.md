---
name: trimtab
description: "Use when the user asks for /trimtab or wants to bootstrap or run a closed-loop self-verifying agentic workflow in a repo. Defaults to the safest profile: Claude orchestrates and may use Claude or Codex sub-agents for work, while a fresh Codex context verifies closure."
---

# /trimtab

Use this skill when the user wants to:

- bootstrap a repo with a Trimtab-style workflow
- upgrade an existing repo to a player/coach workflow
- run a long-horizon autonomous loop with explicit verification
- use `/ralph` as the persistent player loop without letting it self-certify closure

If the repo is not wired yet, or the user wants the workflow adapted to the repo's actual conventions, prefer `init-trimtab` first and then use `trimtab` as the runtime protocol.

## Default Profile

Default to the safest profile unless the user asks otherwise:

- **Orchestrator / player:** Claude Code
- **Long-running loop:** `/ralph` is allowed for planning, context clearing, and handoffs
- **Worker sub-agents:** Claude sub-agents and/or Codex sub-agents
- **Closure verifier / coach:** fresh Codex context

The point is not that Codex does all the work. The point is that closure verification stays independent.

## Allowed Topologies

Valid default topologies:

- `Claude -> Codex`
- `Codex -> Codex` using a fresh Codex coach context

Potentially valid but not yet the default:

- `Gemini -> Codex`
- other non-Claude player -> Codex patterns

Invalid default topology:

- `Claude -> Claude`

The invariant is: the coach must not be Claude unless the user explicitly chooses and accepts that weaker topology.

## Authority Boundary

Unless the user explicitly changes the topology, enforce this boundary:

- only the Codex coach may issue verification verdicts by default
- only the Codex coach may touch Linear as part of the Trimtab loop
- Claude may orchestrate, summarize, and edit local repo files, but it must not act as the verifier and must not itself post verification comments or status changes to Linear
- worker contexts, including Codex workers, should not directly update Linear; they hand evidence back to the coach or orchestrator

If Linear needs to be read or updated, route that through the coach context. If the player needs the issue packet, fetch it through the coach or from a checked local mirror rather than letting the player become the Linear actor.

## Core Contract

- The player does the work
- The coach verifies the work
- The player never self-approves
- The player may review and triage, but it may not issue final verdict language on its own
- `/ralph` may drive execution, but it may never self-certify closure
- Every closure-ready task must pass through an explicit verification packet
- Every completed audit batch, including zero-edit or "no changes needed" batches, must pass through an explicit verification packet
- Only `PASS` allows a task to move to `Done`
- Only the Codex coach may return `PASS`, `FAIL`, or `INSUFFICIENT` in the Trimtab loop
- Only the Codex coach may touch Linear during the Trimtab loop

## Default Execution Bias

When a user invokes `/trimtab`, default to execution, not conversation.

That means:

- inspect the repo and task surface first
- make the smallest reasonable assumptions needed to start
- begin doing the work immediately
- keep moving from one concrete task to the next unblocked one
- ask questions only when blocked by missing authority, missing external information, or a materially ambiguous fork that would risk wasted work

Do **not** stop after one small step and ask "what next?" if the next unblocked task is already discoverable from the issue graph, handoff, dependency graph, or repo state.

Do **not** ask the user to restate a task that already exists in Linear, GitHub Issues, `HANDOFF.md`, or `DEPENDENCY_GRAPH.md`.

The desired operator experience is: invoke `/trimtab`, then the player works quietly and continuously until it reaches a real blocker, an external dependency, or a clean verification boundary.

## Default Follow-Through Policy

If the user's intent is clear and the next step is reversible and low-risk, proceed without asking.

Ask permission only when the next step:

- is irreversible
- has meaningful external side effects such as sending, purchasing, deleting, publishing, or writing to production
- requires missing sensitive information
- requires a choice that would materially change the outcome and cannot be resolved from the repo or task surface

If proceeding, briefly state what you did and continue.

Prefer the task state model:

`Backlog -> In Progress -> Awaiting Verification -> Done`

This prevents "work completed" and "work verified" from collapsing into the same moment.

## Task Packet Rule

When a repo uses Linear or another real issue tracker, the issue itself should be the prompt.

Default behavior:

- read the issue body directly
- use its pass/fail criteria directly
- use its dependency edges directly
- use comments and status as the durable state surface
- use the current issue or next unblocked issue as the default next task, not a new freehand prompt

Do not invent a second freehand prompt when the issue already contains the task packet.

Use local markdown such as `HANDOFF.md` or `DEPENDENCY_GRAPH.md` as support surfaces, mirrors, or fallbacks, not as replacements for a real issue tracker when one exists.

## Waterfall Rule

When Linear or another dependency-aware issue tracker exists, default to issue-by-issue waterfall execution.

That means:

- start from the active issue the operator points at, or the next unblocked issue if they say "continue"
- read that issue body directly instead of asking for a restated prompt
- complete the deliverable, package evidence, and send it to the coach
- on `PASS`, update the issue and then select the next unblocked issue
- do not wait for a brand-new bespoke prompt between tasks unless the user changes priorities

The ideal steady state is minimal prompting. The issue graph should carry the work.

If the graph already tells you what to do next, continue. Do not pause for permission between routine tasks.

## Dialectical Autocoding Mapping

This skill treats dialectical autocoding as the general pattern:

- **Player:** implementation and orchestration
- **Coach:** adversarial verification
- **Loop:** execute -> verify -> fix -> re-verify until `PASS`

The important extension is that the player does not have to be a single worker. Claude can orchestrate a mix of Claude sub-agents and Codex sub-agents at the same time. The coach remains a fresh context with authority over closure.

## Player Language Guardrail

Before a fresh coach context has ruled, the player must not present its own judgment as closure.

Do not let the player say things like:

- `PASS`
- `FAIL`
- `no fixes needed`
- `showcase-quality`
- `move on`
- `done`

unless the statement is explicitly framed as provisional and paired with `Awaiting Verification`.

Allowed pattern:

- `Provisional player assessment: likely no edits needed. Awaiting Verification.`

## First Move

1. Identify the target workspace
2. Inspect the repo and existing instructions before editing
3. Decide which mode applies:
   - **Bootstrap**: repo does not yet have the workflow
   - **Protocol upgrade**: repo has partial workflow but needs stricter rules
   - **Execution**: repo is already wired; continue the next unblocked task
4. Identify the durable task surface:
   - **Linear / issue tracker present:** use the live issue as the task packet and the dependency edges as the live graph
   - **No issue tracker:** use `DEPENDENCY_GRAPH.md` plus `HANDOFF.md`
5. If the repo is not decomposed yet, scaffold the workflow first
6. If the repo is already decomposed, resume from the next unblocked task and latest handoff
7. Decide whether to run the loop directly in the current context or hand the long-running player role to `/ralph`
8. If the project has a Linear issue graph with multiple reachable tasks, default to continuous execution rather than one-task-at-a-time prompting

## Bootstrap Mode

When bootstrapping:

- Create or update `CLAUDE.md`, `AGENTS.md`, `DEPENDENCY_GRAPH.md`, `HANDOFF.md`, and `deliverables/`
- Prefer one shared project-local protocol file plus thin Claude and Codex wrappers
- Preserve existing repo conventions where possible
- Replace generic placeholders with project-specific constraints
- Add GitHub templates or issue-tracker expectations if the repo uses them
- If Linear exists, make the issue body and dependency edges the primary task packet
- Make verification explicit in both docs and task flow

If you are inside the Trimtab starter repo, prefer using its scaffold scripts and templates rather than rewriting everything from scratch.

## Execution Loop

For each task:

1. Read the task definition and exact pass/fail criteria
2. Verify dependencies are satisfied
3. Produce the deliverable and evidence package
4. Dispatch sub-agents as useful
5. If the batch is review-only or audit-only, still produce a deliverable note or audit memo
6. Mark the batch as `Awaiting Verification`, not as passed
7. Send a fresh verification packet to the coach
8. If `FAIL` or `INSUFFICIENT`, fix the exact findings and resubmit
9. Record verdict, blockers, thread IDs, and next-step state in a durable artifact
10. If the repo is issue-driven and the task gets `PASS`, move to the next unblocked issue unless the user redirects

After step 10, repeat automatically while:

- there is another reachable unblocked task
- the user has not changed priorities
- no external approval or missing information blocks the work

The default `/trimtab` posture is persistent progress, not one-turn compliance.

## Completeness Contract

Treat `/trimtab` work as incomplete until all requested deliverables are either:

- completed and recorded, or
- explicitly marked blocked with the exact missing dependency or authority

For issue queues, batches, or paginated tracker results:

- determine the expected scope when possible
- keep track of which issues or items have been processed
- confirm coverage before claiming the queue is exhausted

Do not treat a narrow retrieval, one visible issue, or one completed edit as the end of the job unless the task surface actually says it is.

## Tool Persistence And Dependency Checks

- Use tools whenever they materially improve correctness, completeness, or grounding.
- Do not stop early when another tool call is likely to improve correctness or completeness.
- Before taking an action, check whether prerequisite discovery, lookup, or retrieval steps are required.
- Do not skip prerequisite steps just because the intended final action seems obvious.
- If a later action depends on the output of an earlier step, resolve that dependency first.
- When multiple retrieval steps are independent, prefer selective parallel calls; when they are dependent, sequence them.

## Empty-Result Recovery

If a lookup returns empty, partial, or suspiciously narrow results:

- do not immediately conclude that nothing exists
- try at least one or two fallback strategies such as:
  - alternate query wording
  - broader filters
  - a prerequisite lookup
  - or a different source or tool
- only then report that no results were found, along with what was tried

This applies especially to issue trackers, repo search, and evidence gathering. One empty call is not enough to declare the queue empty or the evidence absent.

## Sub-Agent Rules

Use sub-agents aggressively, but keep packets tight.

Every sub-agent packet should include:

1. The exact task or issue being served
2. The precise scope
3. The files or artifacts to inspect
4. The acceptance criteria
5. The expected output format
6. Whether the assignment is execution, review, verification support, or exploratory support
7. A shared-workspace warning if other agents may edit concurrently

The orchestrator owns synthesis. Sub-agents return auditable work products.

## Verification Rules

Verification should be done in a fresh context, defaulting to Codex with the narrowest permissions that still allow inspection.

Claude is not an acceptable verifier for `/trimtab` unless the user explicitly changes the topology. "Independent Claude context" is not sufficient under the default contract.

Codex workers are not acceptable substitutes for the coach when posting tracker updates. Verification authority and Linear authority both stay with the coach.

`Claude -> Claude` is explicitly disallowed as the default Trimtab pattern.

When using Codex through MCP inside Claude Code, prefer `approval-policy: never` for bounded worker and verification packets. The real approval surface should be the issue criteria, dependency gates, and independent coach verdict, not a stream of interactive permission prompts.

The verification request must include:

- task ID or title
- exact pass/fail criteria
- deliverable path
- evidence package
- open objections, limits, or unresolved risks
- required verdicts: `PASS`, `FAIL`, or `INSUFFICIENT`

This applies even when the player's claim is "no changes are needed." Zero-edit batches still need an external coach verdict.

If the repo uses Linear, the verification comment, verdict record, issue-state update, and any tracker synchronization should be executed by the coach, not by Claude and not by a worker.

Do not let the verifier grade intent. The verifier checks the actual criteria.

Use the strongest available verification model. GPT-5.4-class verification is the intended bar when the environment supports it; otherwise use the strongest available independent coach and record the limitation.

Before finalizing a task, run a lightweight verification loop:

- correctness: did the work satisfy every stated criterion?
- grounding: are claims backed by code, docs, tests, or tool outputs?
- formatting: do the deliverable and tracker updates match the expected structure?
- safety: if the next step has external side effects, confirm permission first

If required context is missing, do not guess. Prefer another lookup or retrieval step first; ask a minimal clarifying question only when the missing context cannot be retrieved.

## Optional Observer Bridge

If the main orchestrator needs live visibility into Codex MCP activity while continuing other work, use the optional Trimtab observer bridge.

That bridge:

- wraps `codex mcp-server`
- forwards MCP traffic unchanged
- records local event and thread metadata for inspection

Use it as a local observer/control surface only. It does not replace the coach, does not create a shared hosted service, and does not make broad sharing safe by default.

## Linear-Driven Execution

When a project uses Linear (or another dependency-aware issue tracker), the intended steady state is a barely-prompted waterfall:

1. Read the current or next unblocked issue directly
2. The issue body is the task packet: deliverable, dependencies, and pass/fail criteria
3. Execute the task
4. Package evidence and send to the coach for verification
5. On `PASS`, update the issue to Done and immediately select the next unblocked issue
6. On `FAIL` or `INSUFFICIENT`, fix the exact findings and resubmit
7. Do not wait for a new human prompt between issues unless priorities change

The loop should keep running until all issues in the current milestone or project are either Done or blocked on external dependencies. If all reachable issues are done, surface that to the operator and ask whether to close the milestone or plan the next batch.

If you are inside a Linear-driven project, **default to this behavior**. Do not stop after one issue and wait for a new prompt. The issue graph carries the work.

This is the main anti-chatter rule for `/trimtab`: if the next task is discoverable and unblocked, continue working instead of asking the operator what to do next.

## When To Use `/ralph`

Use `/ralph` when the value is:

- longer-running execution across many issues without context loss
- automatic plan management and progress tracking
- context compaction or clearing between issues
- durable handoffs across long sessions

Default to `/ralph` when:

- there are multiple reachable issues or tasks to burn down
- the run is likely to outlast one context comfortably
- the user wants the loop to keep making progress with minimal supervision

If those conditions hold, `/trimtab` should prefer starting or handing off to `/ralph` instead of repeatedly returning to the operator for routine continuation prompts.

When a project uses Linear, `/ralph` is a natural fit for the player loop: it keeps execution moving through the issue graph, handles context management, and provides continuity across issues. The operator can steer from their phone via Remote Control while `/ralph` drives the loop.

The expected pattern with Linear + Ralph:

1. `/ralph` reads the next unblocked issue from Linear
2. `/ralph` executes the task and packages evidence
3. `/ralph` dispatches the full verification packet (exact criteria, evidence package, open objections) to a fresh adversarial Codex coach
4. On `PASS`, `/ralph` updates the issue and moves to the next one
5. On `FAIL` or `INSUFFICIENT`, `/ralph` fixes the findings or gathers missing evidence and resubmits
6. The loop continues until all reachable issues are done or an external blocker is hit

If the repo is being dogfooded or prepared for release, treat `/ralph` as an optional but recommended execution path worth testing.

Do **not** use `/ralph` as the verifier. `/ralph` makes the player loop more durable; it does not replace fresh verification.

## Workflow Variants

Read [references/workflow-profiles.md](references/workflow-profiles.md) when the user wants a different topology.

Examples:

- safest default: Claude player, Codex coach
- mixed swarm: Claude orchestrator with Claude and Codex workers, Codex coach
- provider-flipped: Codex player, Claude coach

## Ralph Integration

When the project has a full issue graph and the user wants continuous execution, `/trimtab` should prefer to start `/ralph-loop` as the player execution loop.

The integration pattern:

1. `/trimtab` inspects the repo and sets up the workflow
2. If there is a Linear issue graph (or equivalent) with multiple tasks, `/trimtab` should default to `/ralph-loop` unless there is a clear reason to stay in the current context
3. The `/ralph-loop` prompt should encode the full Trimtab contract:
   - read the next unblocked issue from Linear
   - execute the task and package evidence
   - dispatch a full verification packet (exact criteria, evidence package, open objections) to a fresh adversarial Codex coach with `approval-policy: never`
   - the coach must return exactly `PASS`, `FAIL`, or `INSUFFICIENT`
   - on `PASS`, update the issue to Done and move to the next unblocked issue
   - on `FAIL` or `INSUFFICIENT`, fix the findings or gather missing evidence and resubmit
   - continue until all reachable issues are done or blocked
   - output the completion promise only when the issue graph is exhausted or an external blocker is hit

Example `/ralph-loop` invocation for a Linear-driven project:

```text
/ralph-loop "Read the next unblocked Linear issue for this project. Execute the task using the Trimtab player/coach loop: produce the deliverable, package evidence with exact pass/fail criteria, dispatch a full verification packet to a fresh adversarial Codex coach with approval-policy: never. The coach must return PASS, FAIL, or INSUFFICIENT. On PASS, update the issue to Done and move to the next unblocked issue. On FAIL or INSUFFICIENT, fix the findings or gather missing evidence and resubmit. Continue until all reachable issues are done. Output <promise>ALL_ISSUES_COMPLETE</promise> when no unblocked issues remain." --completion-promise "ALL_ISSUES_COMPLETE"
```

The key constraint remains: `/ralph-loop` drives the player execution, but the verification packet is always dispatched to a separate adversarial Codex context. Ralph runs the loop; Codex independently verifies each issue.

## Packet Templates

Use [references/packets.md](references/packets.md) for:

- sub-agent packet template
- verification packet template
- handoff record template
