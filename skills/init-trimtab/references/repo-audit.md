# Repo Audit For `init-trimtab`

## Goal

Before you install or retune Trimtab in a target repo, figure out what the repo already uses so the workflow matches reality.

## Read First

1. `README.md`
2. existing workflow docs such as `CLAUDE.md`, `AGENTS.md`, `DEPENDENCY_GRAPH.md`, `HANDOFF.md`
3. `.github/` templates and workflows
4. build/test manifests and entrypoints
5. project-specific orchestration surfaces such as Linear docs, beads files, or issue templates
6. any existing `.claude/commands/`, `.claude/agents/`, and `.codex/skills/`

## Questions To Answer

### Task Surface

- Where does the dependency graph actually live?
- Is task state tracked in files, Linear, GitHub Issues, beads, or somewhere else?
- If Linear or another issue tracker exists, can the agent select the next unblocked task directly from it?
- Are the issue bodies already rich enough to serve as operative task packets without a second prompt?
- Does the repo already distinguish work execution from verification?

### Evidence Surface

- Where do deliverables belong?
- What commands or tests count as evidence here?
- Are there existing PR or issue templates that should require verification output?

### Agent Surface

- Does the repo already have `CLAUDE.md` or `AGENTS.md` instructions worth preserving?
- Does Claude Code already use project commands or project sub-agents?
- Does the repo already contain Codex skill sources?

### Tooling Surface

- What are the real build, test, lint, and deploy commands?
- Does the repo use Linear, beads, GitHub, or another system as the durable state surface?
- What statuses represent `Awaiting Verification`, `Done`, and blocked work?
- How are dependency edges represented: `blockedBy`, linked issues, labels, or something else?
- If Codex is called through Claude MCP, is there an explicit house rule for `approval-policy` on bounded worker and verifier packets?
- Does the orchestrator need a local observer/control surface for Codex MCP activity while continuing other work?
- Are there repo-specific constraints around shared workspaces, permissions, or verification model choice?

## Provider-Specific Install Notes

### Claude Code

For team-shared, checked-in entrypoints, prefer project commands in:

- `.claude/commands/`

If the repo later wants Claude-specific sub-agents, those can live in:

- `.claude/agents/`

### Codex

In this environment, custom Codex skills are configured through `~/.codex/config.toml` using `[[skills.config]]` paths.

That means the best project-local pattern is:

1. store the skill source in the repo at `.codex/skills/init-trimtab/`
2. register `.codex/skills/init-trimtab/SKILL.md` in the operator's local Codex config when they want `$init-trimtab`

This keeps the skill versioned with the repo while avoiding a global-only skill payload.

## Retuning Rules

- Preserve strong project-specific instructions
- Replace only generic starter language that is clearly weaker than the repo's real conventions
- Map Trimtab concepts onto the repo's actual vocabulary when appropriate
- Keep the canonical protocol in one shared file and make wrappers thin
- Record any deliberate deviations from the safest default topology
