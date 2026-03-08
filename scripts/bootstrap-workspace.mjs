#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const usage = `Usage:
  node scripts/bootstrap-workspace.mjs /absolute/path/to/target [--project-name "Name"] [--force]
`;

const args = process.argv.slice(2);
let force = false;
let projectName = "";
const positional = [];

for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];
  if (arg === "--force") {
    force = true;
    continue;
  }
  if (arg === "--project-name") {
    const nextValue = args[index + 1];
    if (!nextValue || nextValue.startsWith("-")) {
      console.error("Error: --project-name requires a value.");
      console.error(usage);
      process.exit(1);
    }
    projectName = nextValue;
    index += 1;
    continue;
  }
  if (arg === "--help" || arg === "-h") {
    console.log(usage);
    process.exit(0);
  }
  if (arg.startsWith("-")) {
    console.error(`Error: unknown option ${arg}`);
    console.error(usage);
    process.exit(1);
  }
  positional.push(arg);
}

if (positional.length !== 1) {
  console.error(usage);
  process.exit(1);
}

const targetDir = path.resolve(positional[0]);
const inferredProjectName = projectName || path.basename(targetDir);
const today = new Date().toISOString().slice(0, 10);

const templateContext = {
  PROJECT_NAME: inferredProjectName,
  PROJECT_SLUG: slugify(inferredProjectName),
  TARGET_PATH: targetDir,
  TODAY: today,
};

const renderedFiles = [
  ["templates/CLAUDE.md.tmpl", "CLAUDE.md"],
  ["templates/AGENTS.md.tmpl", "AGENTS.md"],
  ["templates/DEPENDENCY_GRAPH.md.tmpl", "DEPENDENCY_GRAPH.md"],
  ["templates/HANDOFF.md.tmpl", "HANDOFF.md"],
  ["templates/DELIVERABLE_TEMPLATE.md.tmpl", "deliverables/DELIVERABLE_TEMPLATE.md"],
  ["templates/.trimtab/init-trimtab-protocol.md.tmpl", ".trimtab/init-trimtab-protocol.md"],
  ["templates/.claude/commands/init-trimtab.md.tmpl", ".claude/commands/init-trimtab.md"],
  ["templates/.codex/skills/init-trimtab/SKILL.md.tmpl", ".codex/skills/init-trimtab/SKILL.md"],
];

const copiedFiles = [
  [".github/PULL_REQUEST_TEMPLATE.md", ".github/PULL_REQUEST_TEMPLATE.md"],
  [".github/ISSUE_TEMPLATE/task.md", ".github/ISSUE_TEMPLATE/task.md"],
  ["templates/.codex/skills/init-trimtab/agents/openai.yaml", ".codex/skills/init-trimtab/agents/openai.yaml"],
];

const created = [];
const skipped = [];
const overwritten = [];

fs.mkdirSync(targetDir, { recursive: true });

for (const [sourceRel, destRel] of renderedFiles) {
  const sourcePath = path.join(repoRoot, sourceRel);
  const destPath = path.join(targetDir, destRel);
  writeRenderedTemplate(sourcePath, destPath, templateContext, force, created, skipped, overwritten);
}

for (const [sourceRel, destRel] of copiedFiles) {
  const sourcePath = path.join(repoRoot, sourceRel);
  const destPath = path.join(targetDir, destRel);
  copyStaticFile(sourcePath, destPath, force, created, skipped, overwritten);
}

const gitkeepPath = path.join(targetDir, "deliverables", ".gitkeep");
if (!fs.existsSync(gitkeepPath)) {
  fs.mkdirSync(path.dirname(gitkeepPath), { recursive: true });
  fs.writeFileSync(gitkeepPath, "", "utf8");
  created.push(relativeTarget(gitkeepPath));
} else {
  skipped.push(relativeTarget(gitkeepPath));
}

console.log(`Bootstrapped with Trimtab: ${targetDir}`);
console.log(`Project name: ${inferredProjectName}`);
printBucket("Created", created);
printBucket("Overwritten", overwritten);
printBucket("Skipped", skipped);

const codexSkillPath = path.join(targetDir, ".codex", "skills", "init-trimtab", "SKILL.md");
console.log("\nProject-local init surfaces:");
console.log("  - Claude Code: /init-trimtab via .claude/commands/init-trimtab.md");
console.log("  - Codex source: .codex/skills/init-trimtab/SKILL.md");
console.log("\nIf you want $init-trimtab available in Codex on this machine, add this to ~/.codex/config.toml:");
console.log("");
console.log("[[skills.config]]");
console.log(`path = "${codexSkillPath}"`);
console.log("enabled = true");

function writeRenderedTemplate(sourcePath, destPath, context, allowOverwrite, createdList, skippedList, overwrittenList) {
  const template = fs.readFileSync(sourcePath, "utf8");
  const output = renderTemplate(template, context);
  writeFile(destPath, output, allowOverwrite, createdList, skippedList, overwrittenList);
}

function copyStaticFile(sourcePath, destPath, allowOverwrite, createdList, skippedList, overwrittenList) {
  const output = fs.readFileSync(sourcePath, "utf8");
  writeFile(destPath, output, allowOverwrite, createdList, skippedList, overwrittenList);
}

function writeFile(destPath, content, allowOverwrite, createdList, skippedList, overwrittenList) {
  const exists = fs.existsSync(destPath);
  if (exists && !allowOverwrite) {
    skippedList.push(relativeTarget(destPath));
    return;
  }

  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, content, "utf8");
  if (exists) {
    overwrittenList.push(relativeTarget(destPath));
  } else {
    createdList.push(relativeTarget(destPath));
  }
}

function renderTemplate(template, context) {
  return template.replace(/\{\{([A-Z0-9_]+)\}\}/g, (_, key) => context[key] ?? "");
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function relativeTarget(filePath) {
  return path.relative(targetDir, filePath) || ".";
}

function printBucket(label, items) {
  console.log(`\n${label}:`);
  if (items.length === 0) {
    console.log("  (none)");
    return;
  }
  for (const item of items) {
    console.log(`  - ${item}`);
  }
}
