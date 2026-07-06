"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type RunState = {
  skillLabel: string;
  status: "running" | "success" | "failed" | "cancelled";
  output: string;
  startedAt: number;
  endedAt?: number;
};

const statusLabel: Record<RunState["status"], string> = {
  running: "running",
  success: "done",
  failed: "failed",
  cancelled: "cancelled",
};

function formatDuration(ms: number) {
  const s = Math.floor(ms / 1000);
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`;
}

export function RunPanel({
  run,
  onStop,
  onClose,
}: {
  run: RunState;
  onStop: () => void;
  onClose: () => void;
}) {
  const outputRef = useRef<HTMLPreElement>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (run.status !== "running") return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [run.status]);

  useEffect(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight });
  }, [run.output]);

  const duration = formatDuration((run.endedAt ?? now) - run.startedAt);

  return (
    <div className="fixed inset-y-0 right-0 z-40 flex w-[560px] max-w-full flex-col bg-ink text-[#faf8f5] shadow-2xl">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
        <span
          className={cn(
            "size-2 rounded-full",
            run.status === "running" && "animate-pulse bg-primary",
            run.status === "success" && "bg-[#faf8f5]",
            run.status === "failed" && "bg-danger",
            run.status === "cancelled" && "bg-white/40",
          )}
        />
        <span className="text-sm">{run.skillLabel}</span>
        <span
          className={cn(
            "font-mono text-xs",
            run.status === "running" ? "text-primary" : "text-white/50",
          )}
        >
          {statusLabel[run.status]} · {duration}
        </span>
        <div className="ml-auto flex gap-2">
          {run.status === "running" ? (
            <button
              onClick={onStop}
              className="rounded-md border border-white/20 px-3 py-1 text-xs transition-colors duration-150 hover:border-primary hover:text-primary"
            >
              Stop
            </button>
          ) : (
            <button
              onClick={onClose}
              className="rounded-md border border-white/20 px-3 py-1 text-xs transition-colors duration-150 hover:bg-white/10"
            >
              Tutup
            </button>
          )}
        </div>
      </div>
      <pre
        ref={outputRef}
        className="flex-1 overflow-y-auto whitespace-pre-wrap px-5 py-4 font-mono text-[13px] leading-relaxed text-[#faf8f5]/90"
      >
        {run.output ||
          (run.status === "running" ? "Menunggu output…" : "(tanpa output)")}
      </pre>
    </div>
  );
}
