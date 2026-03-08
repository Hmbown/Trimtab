1. I think the interesting thing about AI right now is not "it can code."

   It is that one person can now run a disciplined, self-verifying project loop.

2. Break the work into a dependency graph.
   Let an agent execute the next unblocked task.
   Force a separate verifier to return PASS / FAIL / INSUFFICIENT.
   Do not move forward until it passes.

3. That sounds simple, but it changes the human role.

   You stop being the person doing every step.
   You become the person steering the loop.

4. I got to this through Buckminster Fuller.

   I was listening to *Critical Path* and thinking about Apollo: a long chain of dependent steps, each with criteria for done, none skippable because the destination is exciting.

5. That maps surprisingly well onto software, research, and agent workflows.

6. So I stress-tested the method on something absurdly ambitious: "parallel universe access."

   Not because I think it is feasible.
   Because I do not.

7. I wanted a test case that would punish vagueness immediately.

   If the method could stay honest there, it could probably stay honest anywhere.

8. I used a Claude project loaded with the GPT-5.4 prompt guide to turn the idea into a sharper decomposition prompt for GPT-5.4 Pro.

9. GPT-5.4 Pro turned that into a large markdown dependency graph: roughly 200 steps across seven phases, with explicit deliverables, explicit pass/fail criteria, and later sections labeled things like "NO CURRENT APPROACH" where the path stopped being real.

10. Then I had Claude load the graph into Linear as issues with blocking relationships and milestones, and pointed Claude Code at Step 1.

11. At the time I am writing this, it is on Step 6.

    The subject matter is ridiculous.
    The method is not.

12. The mechanism is context separation.

    The worker and the checker do not have to be different providers.
    They do have to be different contexts.

13. If the same context does the work and grades the work, the system degrades immediately.

    If the verifier is independent and adversarial, it catches real defects.

14. The tools will change. The loop is the durable thing.

    Right now mine is basically:
    Claude Code + Codex + Linear + MCP + phone remote control

15. One practical note:

    if you are using Claude Code Desktop, turn on Remote Control for all sessions early.

    In practice I have found that more reliable for long runs because the desktop MCP timeout behavior seems a little different.

16. The highest-leverage step is decomposition.

    If the graph is vague, everything downstream gets vague.
    If the graph is sharp, the whole system improves.

17. That is why I care so much about prompt quality on the decomposition step.

    A better graph produces better work at every downstream step.

18. I packaged the current setup into a starter repo called Trimtab.

    It scaffolds the operating docs, the dependency graph, the handoff file, the deliverables folder, and GitHub templates that require verification evidence.

19. Why "Trimtab"?

    Because a trimtab is the small control surface that turns a much larger ship.

20. Fuller put "Call me Trimtab" on his gravestone.

    The hard part was never intelligence.
    It was coordination.
