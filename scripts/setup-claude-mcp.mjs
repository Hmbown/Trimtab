#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const cli = parseArgs(process.argv.slice(2));
const dryRun = cli.dryRun;
const force = cli.force;
const settingsPath = process.env.CLAUDE_SETTINGS_PATH || path.join(os.homedir(), ".claude", "settings.json");
const scriptsDir = path.dirname(fileURLToPath(import.meta.url));

const codexConfig = buildCodexConfig({
  observer: cli.observer,
  logDir: cli.logDir,
  scriptsDir,
});

let settings = {};
let priorContent = "";

if (fs.existsSync(settingsPath)) {
  priorContent = fs.readFileSync(settingsPath, "utf8");
  settings = JSON.parse(priorContent);
}

settings.mcpServers ||= {};
const existing = settings.mcpServers.codex;
const alreadyConfigured = matchesCodexConfig(existing);

if (alreadyConfigured) {
  console.log(`Codex MCP is already configured in ${settingsPath}`);
  process.exit(0);
}

if (existing && !force && !dryRun) {
  console.error(`Refusing to overwrite existing Claude codex MCP config in ${settingsPath}.`);
  console.error("Use --dry-run to inspect the proposed settings or --force to replace the existing codex entry.");
  process.exit(1);
}

settings.mcpServers.codex = codexConfig;
const output = `${JSON.stringify(settings, null, 2)}\n`;

if (dryRun) {
  if (existing && !alreadyConfigured) {
    console.error(`Dry run: would replace existing Claude codex MCP config in ${settingsPath}.`);
  }
  console.log(output);
  process.exit(0);
}

fs.mkdirSync(path.dirname(settingsPath), { recursive: true });

if (priorContent) {
  const backupPath = `${settingsPath}.bak.${Date.now()}`;
  fs.writeFileSync(backupPath, priorContent, "utf8");
  console.log(`Backed up existing settings to ${backupPath}`);
}

fs.writeFileSync(settingsPath, output, "utf8");
if (existing) {
  console.log(`Replaced existing codex MCP settings in ${settingsPath}.`);
} else {
  console.log(`Updated ${settingsPath} with Codex MCP settings.`);
}

if (cli.observer) {
  console.log("Mode: Trimtab observer bridge");
  if (cli.logDir) {
    console.log(`Observer log dir: ${path.resolve(cli.logDir)}`);
  } else {
    console.log("Observer log dir: defaults to ./.trimtab/runtime/codex-mcp at Claude session cwd");
  }
} else {
  console.log("Mode: stock codex mcp-server");
}

function matchesCodexConfig(candidate) {
  if (!candidate || typeof candidate !== "object") {
    return false;
  }

  return JSON.stringify(candidate) === JSON.stringify(codexConfig);
}

function buildCodexConfig({ observer, logDir, scriptsDir }) {
  if (!observer) {
    return {
      type: "stdio",
      command: "codex",
      args: ["mcp-server"],
    };
  }

  const bridgePath = path.join(scriptsDir, "trimtab-codex-mcp-bridge.mjs");
  const env = {};

  if (logDir) {
    env.TRIMTAB_CODEX_MCP_LOG_DIR = path.resolve(logDir);
  }

  return {
    type: "stdio",
    command: process.execPath,
    args: [bridgePath],
    ...(Object.keys(env).length > 0 ? { env } : {}),
  };
}

function parseArgs(argv) {
  const result = {
    dryRun: false,
    force: false,
    observer: false,
    logDir: "",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];

    if (value === "--dry-run") {
      result.dryRun = true;
      continue;
    }

    if (value === "--force") {
      result.force = true;
      continue;
    }

    if (value === "--observer") {
      result.observer = true;
      continue;
    }

    if (value === "--log-dir") {
      const next = argv[index + 1];
      if (!next || next.startsWith("--")) {
        throw new Error("--log-dir requires a value");
      }
      result.logDir = next;
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${value}`);
  }

  return result;
}
