.PHONY: doctor bootstrap bootstrap-force install-codex-mcp install-codex-mcp-observer

TARGET ?=
PROJECT_NAME ?=

doctor:
	./scripts/doctor.sh

bootstrap:
ifndef TARGET
	$(error TARGET=/absolute/path/to/project is required)
endif
	node ./scripts/bootstrap-workspace.mjs "$(TARGET)" $(if $(PROJECT_NAME),--project-name "$(PROJECT_NAME)",)

bootstrap-force:
ifndef TARGET
	$(error TARGET=/absolute/path/to/project is required)
endif
	node ./scripts/bootstrap-workspace.mjs "$(TARGET)" $(if $(PROJECT_NAME),--project-name "$(PROJECT_NAME)",) --force

install-codex-mcp:
	node ./scripts/setup-claude-mcp.mjs

install-codex-mcp-observer:
	node ./scripts/setup-claude-mcp.mjs --observer
