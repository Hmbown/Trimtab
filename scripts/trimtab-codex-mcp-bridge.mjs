#!/usr/bin/env node

import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

class JsonRpcFramingParser {
  constructor({ direction, onMessage }) {
    this.direction = direction;
    this.onMessage = onMessage;
    this.buffer = Buffer.alloc(0);
  }

  push(chunk) {
    this.buffer = Buffer.concat([this.buffer, chunk]);

    while (this.buffer.length > 0) {
      if (this.startsWithHeader()) {
        const parsed = this.tryParseContentLengthFrame();
        if (!parsed) {
          break;
        }
        continue;
      }

      const parsed = this.tryParseJsonLine();
      if (!parsed) {
        break;
      }
    }
  }

  startsWithHeader() {
    const prefix = this.buffer.toString("utf8", 0, Math.min(this.buffer.length, 32));
    return /^content-length:/i.test(prefix);
  }

  tryParseContentLengthFrame() {
    const headerEnd = this.findHeaderEnd();
    if (headerEnd === -1) {
      return false;
    }

    const separatorLength = this.buffer[headerEnd] === 13 ? 4 : 2;
    const headerText = this.buffer.toString("utf8", 0, headerEnd);
    const match = headerText.match(/content-length:\s*(\d+)/i);

    if (!match) {
      return false;
    }

    const length = Number(match[1]);
    const frameStart = headerEnd + separatorLength;

    if (this.buffer.length < frameStart + length) {
      return false;
    }

    const body = this.buffer.slice(frameStart, frameStart + length);
    this.buffer = this.buffer.slice(frameStart + length);
    this.emit(body.toString("utf8"), "content-length");
    return true;
  }

  tryParseJsonLine() {
    const newlineIndex = this.buffer.indexOf(10);
    if (newlineIndex === -1) {
      return false;
    }

    const line = this.buffer.slice(0, newlineIndex).toString("utf8").trim();
    this.buffer = this.buffer.slice(newlineIndex + 1);

    if (!line) {
      return true;
    }

    this.emit(line, "json-line");
    return true;
  }

  emit(text, transport) {
    try {
      this.onMessage({
        direction: this.direction,
        transport,
        text,
        json: JSON.parse(text),
      });
    } catch {
      writeRecord("unparsed-message", {
        direction: this.direction,
        transport,
        preview: text.slice(0, 500),
      });
    }
  }

  findHeaderEnd() {
    const crlf = this.buffer.indexOf(Buffer.from("\r\n\r\n"));
    if (crlf !== -1) {
      return crlf;
    }
    return this.buffer.indexOf(Buffer.from("\n\n"));
  }
}

const cli = parseArgs(process.argv.slice(2));

if (cli.help) {
  printHelp();
  process.exit(0);
}

const logDir = cli.logDir
  ? path.resolve(cli.logDir)
  : process.env.TRIMTAB_CODEX_MCP_LOG_DIR
    ? path.resolve(process.env.TRIMTAB_CODEX_MCP_LOG_DIR)
    : path.join(process.cwd(), ".trimtab", "runtime", "codex-mcp");

fs.mkdirSync(logDir, { recursive: true });

const runId = `${new Date().toISOString().replace(/[:.]/g, "-")}-${process.pid}`;
const logPath = path.join(logDir, `${runId}.jsonl`);
const latestPath = path.join(logDir, "latest.json");
const logStream = fs.createWriteStream(logPath, { flags: "a" });

const state = {
  runId,
  startedAt: new Date().toISOString(),
  cwd: process.cwd(),
  logDir,
  logPath,
  codexBin: cli.codexBin,
  recentEvents: [],
  activeThreads: {},
  requests: {},
  childPid: null,
  exitCode: null,
  signal: null,
};

writeRecord("session-start", {
  mode: "observer-bridge",
  codexBin: cli.codexBin,
  cwd: process.cwd(),
  logDir,
  passThroughArgs: cli.passThroughArgs,
});

const child = spawn(cli.codexBin, ["mcp-server", ...cli.passThroughArgs], {
  stdio: ["pipe", "pipe", "pipe"],
  env: process.env,
});

state.childPid = child.pid ?? null;
flushLatest();

const hostToCodex = new JsonRpcFramingParser({
  direction: "host->codex",
  onMessage: (payload) => handleHostMessage(payload),
});

const codexToHost = new JsonRpcFramingParser({
  direction: "codex->host",
  onMessage: (payload) => handleCodexMessage(payload),
});

process.stdin.on("data", (chunk) => {
  if (!child.stdin.destroyed) {
    child.stdin.write(chunk);
  }
  hostToCodex.push(chunk);
});

process.stdin.on("end", () => {
  if (!child.stdin.destroyed) {
    child.stdin.end();
  }
});

process.stdin.on("error", (error) => {
  writeRecord("stdin-error", { message: String(error?.message || error) });
});

child.stdout.on("data", (chunk) => {
  process.stdout.write(chunk);
  codexToHost.push(chunk);
});

child.stderr.on("data", (chunk) => {
  const text = chunk.toString("utf8");
  process.stderr.write(chunk);
  writeRecord("codex-stderr", { text });
});

child.on("error", (error) => {
  writeRecord("child-error", { message: String(error?.message || error) });
});

child.on("exit", (code, signal) => {
  state.exitCode = code;
  state.signal = signal;
  writeRecord("session-end", { code, signal });
  flushLatest();
  logStream.end(() => process.exit(code ?? 0));
});

function handleHostMessage(payload) {
  const json = payload.json;

  if (json?.id !== undefined && json?.method) {
    state.requests[String(json.id)] = {
      method: json.method,
      at: new Date().toISOString(),
    };
  }

  writeRecord("host-message", {
    transport: payload.transport,
    id: json?.id ?? null,
    method: json?.method ?? null,
    kind: classifyMessage(json),
  });
}

function handleCodexMessage(payload) {
  const json = payload.json;
  const requestId = extractRequestId(json);
  const threadId = extractThreadId(json);
  const eventType = extractEventType(json);
  const responseTo = json?.id !== undefined ? String(json.id) : null;
  const requestMethod = responseTo ? state.requests[responseTo]?.method ?? null : null;

  if (threadId) {
    state.activeThreads[threadId] = {
      lastSeenAt: new Date().toISOString(),
      lastEventType: eventType,
      lastRequestId: requestId,
    };
  }

  const eventSummary = {
    at: new Date().toISOString(),
    method: json?.method ?? null,
    kind: classifyMessage(json),
    eventType,
    requestId,
    threadId,
    responseTo,
    requestMethod,
    summary: summarize(json),
  };

  state.recentEvents.unshift(eventSummary);
  state.recentEvents = state.recentEvents.slice(0, 25);

  writeRecord("codex-message", {
    transport: payload.transport,
    ...eventSummary,
  });

  flushLatest();
}

function writeRecord(kind, record) {
  const entry = {
    at: new Date().toISOString(),
    runId,
    kind,
    ...record,
  };

  logStream.write(`${JSON.stringify(entry)}\n`);
}

function flushLatest() {
  const latest = {
    runId: state.runId,
    startedAt: state.startedAt,
    cwd: state.cwd,
    logPath: state.logPath,
    codexBin: state.codexBin,
    childPid: state.childPid,
    exitCode: state.exitCode,
    signal: state.signal,
    activeThreads: state.activeThreads,
    recentEvents: state.recentEvents,
  };

  fs.writeFileSync(latestPath, `${JSON.stringify(latest, null, 2)}\n`, "utf8");
}

function classifyMessage(json) {
  if (!json || typeof json !== "object") {
    return "unknown";
  }
  if (json.method && json.id !== undefined) {
    return "request";
  }
  if (json.method) {
    return "notification";
  }
  if (json.result !== undefined || json.error !== undefined) {
    return "response";
  }
  return "unknown";
}

function extractRequestId(json) {
  return (
    json?.params?._meta?.requestId ??
    json?.result?._meta?.requestId ??
    json?._meta?.requestId ??
    null
  );
}

function extractThreadId(json) {
  return (
    json?.params?.threadId ??
    json?.params?.event?.threadId ??
    json?.params?.item?.threadId ??
    json?.result?.threadId ??
    json?.result?.item?.threadId ??
    json?._meta?.threadId ??
    null
  );
}

function extractEventType(json) {
  return (
    json?.params?.event?.type ??
    json?.params?.type ??
    json?.params?.eventType ??
    json?.result?.event?.type ??
    json?.result?.type ??
    json?.method ??
    null
  );
}

function summarize(json) {
  if (!json || typeof json !== "object") {
    return null;
  }

  const parts = [
    json?.method,
    json?.params?.event?.type,
    json?.params?.item?.type,
    json?.params?.delta?.type,
    json?.result?.type,
  ].filter(Boolean);

  if (parts.length > 0) {
    return parts.join(" | ");
  }

  if (json?.error?.message) {
    return String(json.error.message);
  }

  return null;
}

function parseArgs(argv) {
  const result = {
    help: false,
    logDir: "",
    codexBin: process.env.TRIMTAB_CODEX_BIN || "codex",
    passThroughArgs: [],
  };

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];

    if (value === "--help" || value === "-h") {
      result.help = true;
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

    if (value === "--codex-bin") {
      const next = argv[index + 1];
      if (!next || next.startsWith("--")) {
        throw new Error("--codex-bin requires a value");
      }
      result.codexBin = next;
      index += 1;
      continue;
    }

    if (value === "--") {
      result.passThroughArgs = argv.slice(index + 1);
      break;
    }

    throw new Error(`Unknown argument: ${value}`);
  }

  return result;
}

function printHelp() {
  process.stdout.write(`Trimtab Codex MCP bridge

Wraps "codex mcp-server", forwards MCP traffic unchanged, and records a local observer log.

Usage:
  node scripts/trimtab-codex-mcp-bridge.mjs [--log-dir PATH] [--codex-bin PATH] [-- <extra codex args>]

Defaults:
  log dir:   $TRIMTAB_CODEX_MCP_LOG_DIR or ./.trimtab/runtime/codex-mcp
  codex bin: $TRIMTAB_CODEX_BIN or "codex"
`);
}
