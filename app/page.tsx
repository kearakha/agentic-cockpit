import { DailyReport } from "@/components/daily-report";
import { StatCard } from "@/components/stat-card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function greeting() {
  const h = Number(
    new Intl.DateTimeFormat("id-ID", {
      hour: "numeric",
      hour12: false,
      timeZone: "Asia/Jakarta",
    }).format(new Date()),
  );
  if (h < 11) return "Selamat pagi.";
  if (h < 15) return "Selamat siang.";
  if (h < 19) return "Selamat sore.";
  return "Selamat malam.";
}

function formatDuration(ms: number) {
  const m = Math.round(ms / 60000);
  return m < 60 ? `${m}m` : `${Math.floor(m / 60)}j ${m % 60}m`;
}

export default async function HomePage() {
  const now = Date.now();
  const weekAgo = new Date(now - 7 * 86400_000);
  const twoWeeksAgo = new Date(now - 14 * 86400_000);

  const [thisWeek, lastWeek] = await Promise.all([
    prisma.run.findMany({ where: { startedAt: { gte: weekAgo } } }),
    prisma.run.findMany({
      where: { startedAt: { gte: twoWeeksAgo, lt: weekAgo } },
    }),
  ]);

  const duration = (runs: typeof thisWeek) =>
    runs.reduce(
      (sum, r) =>
        sum + (r.endedAt ? r.endedAt.getTime() - r.startedAt.getTime() : 0),
      0,
    );

  const failed = thisWeek.filter((r) => r.status === "failed").length;
  const deltaRuns = thisWeek.length - lastWeek.length;

  return (
    <div>
      <h1 className="font-serif text-[44px] leading-tight">{greeting()}</h1>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          value={String(thisWeek.length)}
          label="Runs minggu ini"
          delta={deltaRuns >= 0 ? `+${deltaRuns}` : String(deltaRuns)}
        />
        <StatCard
          value={formatDuration(duration(thisWeek))}
          label="Durasi total"
          delta={formatDuration(duration(lastWeek))}
        />
        <StatCard value={String(failed)} label="Failed minggu ini" />
      </div>

      <div className="mt-3">
        <DailyReport />
      </div>
    </div>
  );
}
