import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const logs = await prisma.audioLog.findMany({ select: { action: true } });
    const counts = logs.reduce(
      (acc, l) => { acc[l.action] = (acc[l.action] ?? 0) + 1; return acc; },
      {} as Record<string, number>
    );
    return NextResponse.json({
      total: logs.length,
      task: counts.task ?? 0,
      event: counts.event ?? 0,
      financial: counts.financial ?? 0,
      note: counts.note ?? 0,
    });
  } catch {
    return NextResponse.json({ total: 0, task: 0, event: 0, financial: 0, note: 0 });
  }
}
