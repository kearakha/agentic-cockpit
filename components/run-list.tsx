"use client";

import { useState } from "react";
import useSWR from "swr";
import { cn } from "@/lib/utils";
import { skills } from "@/skills.config";

type Run = {
  id: string;
  skillId: string;
  status: string;
  output: string;
  startedAt: string;
  endedAt: string | null;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function formatDuration(run: Run) {
  if (!run.endedAt) return "—";
  const s = Math.round(
    (new Date(run.endedAt).getTime() - new Date(run.startedAt).getTime()) /
      1000,
  );
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`;
}

function StatusDot({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-block size-2 shrink-0 rounded-full",
        status === "running" && "animate-pulse bg-primary",
        status === "success" && "bg-ink",
        status === "failed" && "bg-danger",
        status === "cancelled" && "bg-ink-muted/40",
      )}
    />
  );
}

export function RunList() {
  const { data: runs, isLoading } = useSWR<Run[]>("/api/runs", fetcher, {
    refreshInterval: 5000,
  });
  const [openId, setOpenId] = useState<string | null>(null);

  if (isLoading) return <p className="text-sm text-ink-muted">Memuat…</p>;
  if (!runs?.length)
    return (
      <div className="rounded-lg border border-line bg-card p-8 text-center">
        <p className="text-sm text-ink-muted">
          Belum ada run. Jalankan skill pertama dari halaman Skills.
        </p>
      </div>
    );

  return (
    <div className="divide-y divide-line rounded-lg border border-line bg-card">
      {runs.map((run) => {
        const skill = skills.find((s) => s.id === run.skillId);
        const open = openId === run.id;
        return (
          <div key={run.id}>
            <button
              onClick={() => setOpenId(open ? null : run.id)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-150 hover:bg-accent-soft/50"
            >
              <StatusDot status={run.status} />
              <span className="w-40 font-mono text-xs text-ink-muted">
                {new Intl.DateTimeFormat("id-ID", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(run.startedAt))}
              </span>
              <span className="flex-1 text-sm">
                {skill?.label ?? run.skillId}
              </span>
              <span
                className={cn(
                  "font-mono text-xs",
                  run.status === "failed" ? "text-danger" : "text-ink-muted",
                )}
              >
                {run.status}
              </span>
              <span className="w-16 text-right font-mono text-xs text-ink-muted">
                {formatDuration(run)}
              </span>
            </button>
            {open && (
              <pre className="max-h-96 overflow-y-auto whitespace-pre-wrap bg-ink px-5 py-4 font-mono text-[13px] leading-relaxed text-[#faf8f5]/90">
                {run.output || "(tanpa output)"}
              </pre>
            )}
          </div>
        );
      })}
    </div>
  );
}
