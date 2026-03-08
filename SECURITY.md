# Security Policy

## Scope

Trimtab is a workflow starter repo. Security issues are most likely to involve:

- secrets or local runtime state accidentally committed
- unsafe shell or config-writing behavior in scripts
- misleading instructions that weaken approval or verification boundaries
- observer bridge logging that exposes sensitive local data

## Reporting

Please report suspected security issues privately before opening a public issue.

If GitHub Security Advisories are available for the repo, use that channel first.

## Expectations

- include reproduction details when feasible
- note whether the issue affects scripts, templates, docs, or runtime logs
- treat `.trimtab/runtime/` and any MCP traces as sensitive local data unless explicitly sanitized
- documentation should be updated whenever the fix changes user-facing security behavior
