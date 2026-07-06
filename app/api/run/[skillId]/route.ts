import { spawn } from "node:child_process";
import { statSync } from "node:fs";
import os from "node:os";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { skills } from "@/skills.config";

export const runtime = "nodejs";

function expandHome(p: string) {
  return p.startsWith("~") ? p.replace("~", os.homedir()) : p;
}

/** Ambil teks tampil dari satu event stream-json Claude Code. */
function extractText(line: string): { text: string; isError?: boolean } {
  try {
    const ev = JSON.parse(line);
    if (ev.type === "assistant") {
      const parts = (ev.message?.content ?? []) as Array<{
        type: string;
        text?: string;
        name?: string;
      }>;
      return {
        text: parts
          .map((c) =>
            c.type === "text"
              ? c.text
              : c.type === "tool_use"
                ? `\n[${c.name}]\n`
                : "",
          )
          .join(""),
      };
    }
    if (ev.type === "result") {
      return { text: "", isError: ev.is_error === true };
    }
    return { text: "" };
  } catch {
    // Baris non-JSON (mis. warning CLI) tampilkan apa adanya.
    return { text: line + "\n" };
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ skillId: string }> },
) {
  const { skillId } = await params;
  const skill = skills.find((s) => s.id === skillId);
  if (!skill)
    return Response.json({ error: "Skill tidak dikenal" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const input = typeof body.input === "string" ? body.input.trim() : "";

  let prompt = skill.prompt;
  let cwd = skill.cwd ? expandHome(skill.cwd) : os.homedir();

  if (skill.input) {
    if (!input)
      return Response.json({ error: "Input wajib diisi" }, { status: 400 });
    if (skill.input.as === "cwd") {
      const dir = expandHome(input);
      try {
        if (!statSync(dir).isDirectory()) throw new Error();
      } catch {
        return Response.json(
          { error: `Bukan direktori valid: ${dir}` },
          { status: 400 },
        );
      }
      cwd = dir;
    } else {
      prompt = prompt.replaceAll("{{input}}", input);
    }
  }

  const run = await prisma.run.create({ data: { skillId, status: "running" } });

  // Command & args selalu dari config — input user hanya jadi prompt/cwd, tidak pernah jadi command.
  const child = spawn(
    "claude",
    [
      "-p",
      prompt,
      "--output-format",
      "stream-json",
      "--verbose",
      "--permission-mode",
      "bypassPermissions",
    ],
    { cwd, env: process.env, stdio: ["ignore", "pipe", "pipe"] },
  );

  const encoder = new TextEncoder();
  let output = "";
  let isError = false;
  let aborted = false;
  let spawnError = "";

  const stream = new ReadableStream({
    start(controller) {
      const send = (data: unknown) => {
        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(data)}\n\n`),
          );
        } catch {
          // stream sudah ditutup client — abaikan
        }
      };

      send({ type: "run", runId: run.id });

      let buf = "";
      child.stdout.on("data", (chunk: Buffer) => {
        buf += chunk.toString();
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const { text, isError: err } = extractText(line);
          if (err) isError = true;
          if (text) {
            output += text;
            send({ type: "output", text });
          }
        }
      });

      child.stderr.on("data", (chunk: Buffer) => {
        const text = chunk.toString();
        output += text;
        send({ type: "output", text });
      });

      child.on("error", (err) => {
        // mis. binary `claude` tidak ketemu
        spawnError = `Gagal spawn claude: ${err.message}\n`;
        output += spawnError;
        send({ type: "output", text: spawnError });
      });

      child.on("close", async (code) => {
        const status = aborted
          ? "cancelled"
          : code === 0 && !isError && !spawnError
            ? "success"
            : "failed";
        await prisma.run.update({
          where: { id: run.id },
          data: { status, output, endedAt: new Date() },
        });
        send({ type: "done", status });
        try {
          controller.close();
        } catch {
          /* sudah ditutup */
        }
      });

      req.signal.addEventListener("abort", () => {
        aborted = true;
        child.kill("SIGTERM");
      });
    },
    cancel() {
      aborted = true;
      child.kill("SIGTERM");
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
