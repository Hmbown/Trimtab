# Call Me Trimtab

*How I turned Buckminster Fuller, Linear, Claude Code, and Codex into a self-verifying project loop.*

![Edited composite image of two tech executives standing in front of Buckminster Fuller's grave holding copies of Critical Path](./imagetop-linkimage.png)
*Bucky, Apollo, Critical Path, and a completely unreasonable test case.*

The interesting thing about AI right now is not "AI can code."

The interesting thing is that one person can now run a disciplined, self-verifying project loop.

Break the work into a dependency graph. Let an orchestrating agent execute the next unblocked task. Force a separate verifier to return `PASS`, `FAIL`, or `INSUFFICIENT`. Refuse to move forward until the check passes.

That is a real operating model, not a demo trick.

I backed into this through Buckminster Fuller.

I was listening to *Critical Path* and he was talking about the Apollo program: not as mythology, but as dependency management. A long chain of steps. Each one dependent on prior ones. Each one with criteria for done. No skipping ahead because the destination is exciting.

That maps directly onto modern agent workflows.

So I decided to test the method on something maximally unfair.

"Parallel universe access."

Not because I think it is going to work. Because I do not. I wanted a project that would punish vagueness immediately.

I have a Claude project that exists for one narrow purpose: take rough ideas and turn them into better prompts for GPT-5.4 Pro using the official prompt guide as project memory.

![Claude project configured to translate rough ideas into prompts for GPT-5.4 using the prompt guide as project memory](./claudeproject.webp)
*A Claude project with one job: improve the decomposition prompt.*

I used that setup to generate a decomposition prompt, then ran the prompt through GPT-5.4 Pro.

The result was a large markdown dependency graph: roughly 200 steps across seven phases, from theory to traversal, with later sections labeled things like "NO CURRENT APPROACH" where the program ran out of reality.

That was the part I found convincing.

The subject matter was unserious. The structure was not.

From there, I had Claude load the graph into Linear as issues with blocking relationships and phase milestones, then pointed Claude Code at Step 1.

![Linear project showing the dependency graph and project state](./linearproject.webp)
*Once the graph is live in Linear, the plan becomes operational.*

At the time I am writing this, the system is on Step 6. I have been running the same method on a game design project and a math project too. Same loop. Different domains.

The loop is the point.

---

## The Loop

1. Break the project into a strict dependency graph.
2. Give every step a deliverable and pass/fail criteria.
3. Let one agent execute the next unblocked task.
4. Let separate sub-agents handle tightly scoped research, drafting, implementation, or verification work.
5. Send the deliverable to an independent verifier.
6. Do not move forward until the verifier says `PASS`.

The orchestrator sees the whole board. The sub-agents do not. They get a tightly scoped packet and a clean context.

That separation matters more than the specific tool choices.

If the same context does the work and grades the work, the system decays immediately.

---

## Why This Particular Stack

The [Codex MCP server](https://developers.openai.com/codex/mcp/) makes it practical to dispatch scoped sub-agent tasks and continue them later without polluting the orchestrator's context.

Claude Code works well as the orchestrator because it can synthesize across multiple sub-agents and keep the project state straight.

Linear works well because the dependency graph, blockers, and audit trail become durable and shared across sessions.

[Claude Code Remote Control](https://code.claude.com/docs/en/remote-control) is what makes the whole thing feel operational. You can leave your desk and still keep the system moving from your phone.

![Claude Code settings showing Remote Control enabled for all sessions](./remotecontrol-settings.png)
*One practical setting to flip early if you are using Claude Code Desktop.*

In practice, I have found "enable Remote Control for all sessions" to be the more reliable path for long runs, partly because the desktop MCP timeout behavior seems different enough that I do not want it in the middle of the workflow.

The stack will change. The closed loop is the durable part.

---

## The Highest-Leverage Step

The highest-leverage step is decomposition.

If the graph is vague, the whole system becomes vague. If the graph is sharp, the downstream work improves automatically.

That is why I use the [GPT-5.4 prompt guide](https://developers.openai.com/api/docs/guides/prompt-guidance/) as project memory when I am forming the decomposition prompt.

![Screenshot of the GPT-5.4 prompt guide loaded into project memory](./promptguide.webp)
*Better decomposition prompts produce better graphs.*

The prompt template is simple:

```text
Break [your project] into a strict dependency graph. For each step:
1. What it produces (the deliverable)
2. What it depends on (which prior steps must be done)
3. Pass/fail criteria (how to objectively verify it's done)

Be rigorous. If a step is vague, break it into sub-steps until the
criteria are testable. No step should require work from a later step.
```

This usually takes a few iterations. That is fine. The goal is not to get a beautiful answer out of the model. The goal is to get a graph another agent can execute without making up what "done" means.

---

## What Actually Generalizes

The weird research example is just a stress test.

The method generalizes to:

- software projects
- design systems
- research notes
- math and proof work
- game design
- any project where explicit dependencies and independent verification improve quality

The worker and verifier do not need to be the same provider. They just need to be genuinely separate contexts.

---

## What I Packaged

I packaged the current best setup into a starter repo called Trimtab.

Point an agent at it, give it a target workspace, and it scaffolds the working parts: `CLAUDE.md`, `AGENTS.md`, a dependency graph, a handoff file, a deliverables directory, and GitHub templates that require verification evidence.

```bash
node scripts/bootstrap-workspace.mjs /path/to/your-project
```

## Why "Trimtab"

A trimtab is the small flap on a ship's rudder. You move the trimtab, the trimtab moves the rudder, and the rudder turns the ship.

Buckminster Fuller put "Call me Trimtab" on his gravestone.

![Buckminster Fuller's "Call me Trimtab" gravestone](./trimtabstone.jpg)
*The name was not hard to choose.*

The hard part was never intelligence. It was coordination.

I will keep you posted on the parallel-universe program. Or maybe I will not. We are on Step 6 out of roughly 200, and Step 39 already wants hardware I do not know how to get access to. So there is probably some runway.
