"use client";

import { useRef, useState } from "react";
import { skillGroups, skills, type Skill } from "@/skills.config";
import { RunPanel, type RunState } from "@/components/run-panel";

export function SkillGrid() {
  const [pending, setPending] = useState<Skill | null>(null); // nunggu input/confirm
  const [inputValue, setInputValue] = useState("");
  const [run, setRun] = useState<RunState | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  function requestRun(skill: Skill) {
    if (skill.input || skill.dangerous) {
      setInputValue("");
      setPending(skill);
    } else {
      void execute(skill);
    }
  }

  async function execute(skill: Skill, input?: string) {
    setPending(null);
    const controller = new AbortController();
    abortRef.current = controller;
    const startedAt = Date.now();
    setRun({
      skillLabel: skill.label,
      status: "running",
      output: "",
      startedAt,
    });

    try {
      const res = await fetch(`/api/run/${skill.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        setRun((r) =>
          r
            ? {
                ...r,
                status: "failed",
                output: err.error ?? "Request gagal",
                endedAt: Date.now(),
              }
            : r,
        );
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const frames = buf.split("\n\n");
        buf = frames.pop() ?? "";
        for (const frame of frames) {
          if (!frame.startsWith("data: ")) continue;
          const ev = JSON.parse(frame.slice(6));
          if (ev.type === "output") {
            setRun((r) => (r ? { ...r, output: r.output + ev.text } : r));
          } else if (ev.type === "done") {
            setRun((r) =>
              r ? { ...r, status: ev.status, endedAt: Date.now() } : r,
            );
          }
        }
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        setRun((r) =>
          r ? { ...r, status: "cancelled", endedAt: Date.now() } : r,
        );
      } else {
        setRun((r) =>
          r
            ? {
                ...r,
                status: "failed",
                output: r.output + `\n${(err as Error).message}`,
                endedAt: Date.now(),
              }
            : r,
        );
      }
    }
  }

  return (
    <div>
      {skillGroups.map((group) => {
        const items = skills.filter((s) => s.group === group);
        if (items.length === 0) return null;
        return (
          <section key={group} className="mb-10">
            <h2 className="mb-3 text-xs uppercase tracking-widest text-ink-muted">
              {group}
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((skill) => (
                <div
                  key={skill.id}
                  className="flex flex-col rounded-lg border border-line bg-card p-4"
                >
                  <h3 className="text-sm">{skill.label}</h3>
                  <p className="mt-1 mb-4 text-[13px] leading-snug text-ink-muted">
                    {skill.description}
                  </p>
                  <button
                    onClick={() => requestRun(skill)}
                    disabled={run?.status === "running"}
                    className="mt-auto self-start rounded-md border border-line px-3 py-1 text-xs transition-colors duration-150 hover:border-primary hover:text-primary disabled:opacity-40 disabled:hover:border-line disabled:hover:text-ink"
                  >
                    Run
                  </button>
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {/* Dialog input / confirm */}
      {pending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40">
          <div className="w-[420px] rounded-lg border border-line bg-card p-5 shadow-lg">
            <h3 className="text-sm">{pending.label}</h3>
            {pending.dangerous && (
              <p className="mt-2 text-[13px] text-danger">
                Skill ini bisa menulis/mengubah file. Lanjutkan?
              </p>
            )}
            {pending.input && (
              <div className="mt-3">
                <label className="text-xs text-ink-muted">
                  {pending.input.label}
                </label>
                <textarea
                  autoFocus
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={pending.input.placeholder}
                  rows={pending.input.label.startsWith("Paste") ? 6 : 2}
                  className="mt-1 w-full rounded-md border border-line bg-background px-3 py-2 font-mono text-[13px] outline-none focus:border-primary"
                />
              </div>
            )}
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setPending(null)}
                className="rounded-md px-3 py-1.5 text-xs text-ink-muted transition-colors duration-150 hover:bg-accent-soft hover:text-ink"
              >
                Batal
              </button>
              <button
                onClick={() => void execute(pending, inputValue || undefined)}
                disabled={!!pending.input && !inputValue.trim()}
                className="rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground transition-opacity duration-150 disabled:opacity-40"
              >
                Run
              </button>
            </div>
          </div>
        </div>
      )}

      {run && (
        <RunPanel
          run={run}
          onStop={() => abortRef.current?.abort()}
          onClose={() => setRun(null)}
        />
      )}
    </div>
  );
}
