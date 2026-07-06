import { readFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { skills } from "@/skills.config";
import { prisma } from "@/lib/prisma";

/* Baca section todo dari ~/.claude/todo.md — loose parse, gagal = kosong. */
function readTodos(): { agenda: string[]; open: string[] } {
  try {
    const md = readFileSync(
      path.join(os.homedir(), ".claude", "todo.md"),
      "utf8",
    );
    const lines = md.split("\n");
    const agenda: string[] = [];
    const open: string[] = [];
    let section = "";
    for (const line of lines) {
      if (line.startsWith("#")) section = line.toLowerCase();
      const m = line.match(/^-\s*\[( |~)\]\s*(.+)/);
      if (!m) continue;
      const item = m[2].trim();
      if (section.includes("hari ini")) agenda.push(item);
      else open.push(item);
    }
    return { agenda, open: open.slice(0, 5) };
  } catch {
    return { agenda: [], open: [] };
  }
}

export async function DailyReport() {
  const { agenda, open } = readTodos();
  const lastRun = await prisma.run.findFirst({
    where: { status: { not: "running" } },
    orderBy: { startedAt: "desc" },
  });
  const lastSkill = skills.find((s) => s.id === lastRun?.skillId);

  const today = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="rounded-lg border border-line bg-card p-5">
      <p className="text-xs uppercase tracking-widest text-ink-muted">
        {today}
      </p>

      <div className="mt-4 grid gap-6 sm:grid-cols-3">
        <div>
          <h3 className="mb-2 text-xs text-ink-muted">Agenda hari ini</h3>
          {agenda.length ? (
            <ul className="space-y-1 text-[13px]">
              {agenda.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-[13px] text-ink-muted">Tidak ada agenda.</p>
          )}
        </div>

        <div>
          <h3 className="mb-2 text-xs text-ink-muted">Run terakhir</h3>
          {lastRun ? (
            <div className="text-[13px]">
              <p>{lastSkill?.label ?? lastRun.skillId}</p>
              <p className="mt-0.5 font-mono text-xs text-ink-muted">
                {lastRun.status} ·{" "}
                {new Intl.DateTimeFormat("id-ID", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(lastRun.startedAt)}
              </p>
            </div>
          ) : (
            <p className="text-[13px] text-ink-muted">Belum ada run.</p>
          )}
        </div>

        <div>
          <h3 className="mb-2 text-xs text-ink-muted">Task terbuka</h3>
          {open.length ? (
            <ul className="space-y-1 text-[13px]">
              {open.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-[13px] text-ink-muted">Kosong.</p>
          )}
        </div>
      </div>
    </div>
  );
}
