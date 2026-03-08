# Packet Templates

Use these packets to keep the loop explicit and reproducible.

## Sub-Agent Packet

```text
Task:
[task ID/title]

Role:
[execution | review | verification support | exploratory support]

Scope:
[one tight assignment]

Inspect:
[files, artifacts, systems]

Acceptance criteria:
[exact checks]

Expected output:
[notes, patch, checklist, verdict, etc.]

Workspace note:
You are in a shared workspace. Other agents may be reading or editing files concurrently. Focus only on your assigned task.

Execution note:
If this runs through Codex MCP inside Claude for a bounded task, prefer `approval-policy: never`.
```

## Verification Packet

```text
You are the COACH / VERIFICATION AGENT. Be adversarial.

Task under review:
[task ID/title]

Issue tracker source:
[Linear issue ID / URL if applicable]

Dependency status:
[blockedBy satisfied / current upstream state]

Pass/fail criteria:
[paste the exact criteria]

Deliverable:
[file path or artifact summary]

Evidence package:
[tests, commands, screenshots, measurements, notes]

Open objections or limits:
[anything unresolved the verifier should examine]

Player provisional assessment:
[optional; may say "likely no edits needed" or similar, but must remain provisional]

Execution note:
[If this runs through Codex MCP inside Claude for a bounded verification request, prefer `approval-policy: never`]

Return exactly one of:
- PASS — criteria satisfied. State why.
- FAIL — criteria not satisfied. State what is missing or wrong.
- INSUFFICIENT — evidence is incomplete. State what is still needed.
```

Use this packet even for zero-edit review batches. "No changes required" is still a claim that must be verified externally.

## Handoff Record

Record at least:

- current task
- latest verdict
- verifier thread ID if applicable
- blockers and risks
- next unblocked step
- any external dependency or environment assumption
