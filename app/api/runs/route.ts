import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const runs = await prisma.run.findMany({
    orderBy: { startedAt: "desc" },
    take: 100,
  });
  return Response.json(runs);
}
