# Call Me Trimtab

![Edited composite image of two tech executives standing in front of Buckminster Fuller's grave holding copies of Critical Path](./imagetop-linkimage.png)
*Bucky, Apollo, Critical Path, and a completely unreasonable test case.*

The interesting thing about AI right now is not "AI can code."

The interesting thing is that one person can now run a disciplined, self-verifying project loop: break the work into a dependency graph, let an orchestrating agent execute the next unblocked task, force a separate verifier to return `PASS`, `FAIL`, or `INSUFFICIENT`, and refuse to move forward until the check passes.

That is a real operating model, not a demo trick.

I got to this through Buckminster Fuller.

I was listening to *Critical Path* and he was talking about the Apollo program: how the whole thing only worked because it was decomposed into a long chain of dependent steps. Each step had to happen in order. Each step had criteria for done. You could not skip ahead just because the destination was exciting.

That maps cleanly onto software and research work. It maps cleanly onto Linear. It maps cleanly onto any project where the real problem is not raw intelligence, but coordination.

So I wanted to stress-test the idea on something absurdly ambitious.

I took "parallel universe access" as the project. Not because I think it is feasible. Precisely because I do not. If the method could stay honest there, it could probably stay honest anywhere.

I set up a Claude project whose only job was to turn rough ideas into strong decomposition prompts for GPT-5.4 Pro using the official prompt guide as project memory.

![Claude project configured to translate rough ideas into prompts for GPT-5.4 using the prompt guide as project memory](./claudeproject.webp)
*A Claude project with one job: take a rough idea and turn it into a better decomposition prompt.*

Then I ran the resulting prompt through GPT-5.4 Pro and asked it to build a strict dependency graph for the entire program.

What came back was not handwavy futurism. It was a large markdown file: roughly 200 steps across seven phases, from theoretical foundations through to traversal, with later sections explicitly labeled things like "NO CURRENT APPROACH" where the path stopped being real.

That was the moment the method clicked for me. The subject matter was ridiculous. The output was not.

From there, I had Claude load the graph into Linear as issues with blocking relationships and phase milestones. Then I pointed Claude Code at the project and told it to start at Step 1.

![Linear project showing the dependency graph and project state](./linearproject.webp)
*Once the graph is in Linear, the project becomes a live dependency structure instead of a static plan.*

At the time I am writing this, it is on Step 6. I have been using the same loop on a game design project and a math research project too. Different domains, same mechanism.

The mechanism is the point.

---

## The Stack, Briefly

What I am actually using right now is [Claude Code](https://docs.anthropic.com/en/docs/claude-code) as the orchestrator, [Codex](https://developers.openai.com/codex/cli) via the [Codex MCP server](https://developers.openai.com/codex/mcp/) for external sub-agents, [Linear](https://linear.app) via the [Linear MCP server](https://linear.app/docs/mcp) as the shared dependency graph, and the [GPT-5.4 prompt guide](https://developers.openai.com/api/docs/guides/prompt-guidance/) to help sharpen decomposition prompts.

That exact stack is just what works for me as of March 2026. The tools will change. The loop is the thing that matters.

---

## The Core Loop

Here is the loop in plain English:

1. Break the project into a strict dependency graph.
2. Give every step a deliverable and pass/fail criteria.
3. Let one agent work the next unblocked task.
4. Let separate agents handle scoped research, implementation, or verification subtasks.
5. Force an independent verifier to review the deliverable against the criteria.
6. Do not move forward until the verdict is `PASS`.

The orchestrator holds the whole board in context: what is blocked, what is done, what the criteria are, where the risks are, what failed last time. The sub-agents do not need the whole board. They need a narrowly scoped task packet and a clean context.

That separation is what makes the whole thing work.

The worker and the checker do not need to be different providers, but they do need to be different contexts. If the same context does the work and grades the work, the system degrades immediately.

---

## Why These Tools

### Codex via MCP

The [Codex MCP server](https://developers.openai.com/codex/mcp/) is what makes external sub-agent dispatch practical.

The orchestrator can start a fresh Codex session for a scoped task, get a thread back, and continue that thread later without dragging all of the sub-agent's history into the orchestrator's context. That means you can dispatch work, keep moving, and return later for follow-ups or revisions.

It also means the sub-agent can be sandboxed appropriately. A verification task can be `read-only`. A drafting task can be allowed to inspect files. The orchestrator chooses the scope.

### Claude Code as Orchestrator

Claude Code can dispatch Codex work and also spin up its own parallel sub-agents when that is useful. The orchestrator's real job is not typing. It is synthesis: deciding what to delegate, reading across multiple results, and keeping the dependency graph honest.

### Linear as Shared Memory

The graph lives in Linear. The blocking relationships live in Linear. The audit trail lives in Linear. Agents can read and update the same issue graph through the [Linear MCP server](https://linear.app/docs/mcp), and you can see the state of the whole system from any device.

### Remote Control

[Claude Code Remote Control](https://code.claude.com/docs/en/remote-control) is what makes this feel operational instead of theatrical. You can start a long run on your machine, leave your desk, and keep it moving from your phone when the system needs a decision.

That turns the human role into steering rather than babysitting.

![Claude Code settings showing Remote Control enabled for all sessions](./remotecontrol-settings.png)
*One practical setting to flip early: enable Remote Control for all sessions.*

If you are using Claude Code Desktop, this matters more than it looks. In practice, I have found the "enable for all sessions" setting to be the cleaner path for long-lived runs, partly because the desktop MCP timeout behavior seems different enough that I do not want it sitting in the critical path.

---

## Decomposition Is the Highest-Leverage Step

If the graph is sloppy, everything downstream gets sloppy.

That is why I use a Claude project with the [GPT-5.4 prompt guide](https://developers.openai.com/api/docs/guides/prompt-guidance/) loaded as project memory. Its job is not to solve the project. Its job is to help produce a sharper decomposition prompt.

![Screenshot of the GPT-5.4 prompt guide loaded into project memory](./promptguide.webp)
*The prompt guide loaded into project memory. Better decomposition prompts produce better graphs, which produce better downstream work.*

The decomposition prompt I keep coming back to is simple:

```text
Break [your project] into a strict dependency graph. For each step:
1. What it produces (the deliverable)
2. What it depends on (which prior steps must be done)
3. Pass/fail criteria (how to objectively verify it's done)

Be rigorous. If a step is vague, break it into sub-steps until the
criteria are testable. No step should require work from a later step.
```

This usually takes a few iterations. That is normal. You are not trying to get poetry out of the model. You are trying to get a graph that another agent can execute without hallucinating what "done" means.

Once the markdown graph exists, loading it into Linear is straightforward. After that, both the worker and the verifier can read the same task structure directly from the issue tracker.

---

## The Operating Docs

The working docs are simple. The worker reads the dependency graph and only takes unblocked tasks. Every task needs an explicit deliverable and explicit pass/fail criteria. Sub-agents get tightly scoped prompts. Verification is independent and adversarial. `FAIL` stops the line.

That last part matters most.

If the verifier returns `FAIL`, the point is not to argue with it. The point is to fix the exact findings or change the approach.

I have now seen this enough times that I trust the pattern. The verifier catches defects the worker would have shipped. Not because the verifier is magical, but because it did not author the thing it is reviewing.

---

## What Generalizes

The parallel-universe experiment is funny, but the method is not specific to weird research.

You can use the same loop for:

- software projects with real dependency order
- design systems
- research notes and literature reviews
- math or proof-oriented work
- game design
- operational checklists

You also do not need Linear for every case. A markdown graph is fine for smaller projects. Linear becomes useful when you want blocking relationships, milestones, and a durable audit trail.

You also do not need the same provider for orchestration and verification. Claude can work and Codex can verify. Codex can work and Claude can verify. The key is separation between worker and checker.

---

## Things I Have Learned

**Context separation is the mechanism.** The verifier catches real problems because it does not share the author's history or incentives.

**Keep sub-agent prompts scoped.** One task. One objective. One set of criteria. If the prompt is sprawling, split it.

**Tell the verifier to be adversarial.** "Review this" and "find what is wrong with this" are not the same prompt.

**If the same approach fails verification repeatedly, change the approach.** Repeated failure is information.

**The orchestrator's most valuable job is synthesis.** The best thing it does is read across multiple sub-agent outputs and notice connections or contradictions they cannot see from their local context.

---

## Trimtab

I packaged the current best setup into a starter repo called Trimtab.

Point an agent at it, give it a target workspace, and it scaffolds the working parts: `CLAUDE.md`, `AGENTS.md`, a dependency graph, a handoff file, a deliverables directory, and GitHub templates that require verification evidence.

```bash
node scripts/bootstrap-workspace.mjs /path/to/your-project
```

The repo is small on purpose. It is the control surface, not the ship.

---

## Why "Trimtab"

A trimtab is the small flap on a ship's rudder. The rudder is too large to move directly against the water, so you move the trimtab, which redirects the flow, which turns the rudder, which turns the ship.

Buckminster Fuller put "Call me Trimtab" on his gravestone.

![Buckminster Fuller's "Call me Trimtab" gravestone](./trimtabstone.jpg)
*The name was not hard to choose.*

The hard part was never intelligence. It was coordination.

I will keep you posted on the parallel-universe program. Or maybe I will not. We are on Step 6 out of roughly 200, and Step 39 already wants hardware I do not know how to get access to. So there is probably some runway.
