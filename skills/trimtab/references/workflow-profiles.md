# Workflow Profiles

Use the safest profile by default. Switch only when the user explicitly wants a different topology or the repo already imposes one.

## 1. Safest Default

- **Orchestrator / player:** Claude Code
- **Long-running loop:** `/ralph` inside Claude Code if helpful
- **Worker sub-agents:** Claude and/or Codex
- **Verifier / coach:** fresh Codex context

Use this when:

- the repo is new or loosely structured
- the user wants a closed loop with the least ambiguity
- you want persistent execution without losing independent verification
- the repo uses Linear and you want issue-by-issue waterfall execution with minimal prompting

Why this is the default:

- Claude is good at broad orchestration, synthesis, and adapting the loop
- Codex is kept fresh for closure checks instead of being entangled with authorship
- `/ralph` improves continuity without being allowed to self-certify
- Audit-only or zero-edit batches still go to the coach before the player may move on
- If Linear exists, the live issue body and dependency edges should drive task selection

## 2. Mixed Worker Swarm

- **Orchestrator / player:** Claude Code
- **Workers:** parallel Claude sub-agents and Codex sub-agents
- **Verifier / coach:** fresh Codex context

Use this when:

- the task benefits from parallel implementation, research, or drafting
- some subtasks are better served by Claude local context and others by Codex independence

Rule:

- Mixed workers are fine
- Closure still goes through an independent coach packet
- This includes "looks good" or "no fixes needed" audit outcomes

## 3. Provider-Flipped

- **Orchestrator / player:** Codex
- **Verifier / coach:** Claude

Use this only when:

- the user explicitly wants Codex driving execution
- the repo already has Codex-centric control flow

Guardrail:

- preserve the same independence rule; the worker and checker must still be separate contexts

## 4. Existing-Repo Constraint Mode

Some repos already have hard constraints:

- a specific issue tracker
- a fixed review workflow
- an existing planner loop
- a required provider for implementation

In that case:

- preserve the repo's real constraints
- add Trimtab's verification discipline without fighting the house style
- do not force the safest default if the repo already has a better-supported topology
- if the repo uses Linear, treat the issue body and dependency edges as the operative task packet
- if the repo uses Linear, default to moving from one verified issue to the next unblocked issue unless the operator changes priorities

## 5. Linear + Ralph Continuous Loop

- **Orchestrator / player:** `/ralph` inside Claude Code
- **Task source:** Linear issue graph (next unblocked issue)
- **Worker sub-agents:** Claude and/or Codex
- **Verifier / coach:** fresh Codex context per issue

Use this when:

- the project has a full Linear issue graph with dependencies
- the operator wants the loop to run through multiple issues without manual prompting
- you want phone-based supervision via Remote Control while the loop runs

How it works:

- `/ralph` reads the next unblocked issue from Linear
- executes the task, packages evidence with exact criteria
- dispatches a full verification packet to a fresh adversarial Codex coach with `approval-policy: never`
- the coach returns `PASS`, `FAIL`, or `INSUFFICIENT`
- on `PASS`, updates the issue and moves to the next unblocked one
- on `FAIL` or `INSUFFICIENT`, fixes findings or gathers missing evidence and resubmits
- continues until all reachable issues are done or blocked
- the operator steers from their phone when the loop needs input

This is the highest-autonomy profile. The issue graph drives everything; the human role is steering, not prompting.

## Decision Rule

Choose the simplest topology that preserves:

1. explicit task criteria
2. durable handoffs
3. independent closure verification
4. a clean distinction between execution and verification
