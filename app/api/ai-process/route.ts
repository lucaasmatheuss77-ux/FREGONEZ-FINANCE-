import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { processTranscription } from "@/lib/ai";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { transcription } = await req.json();
    if (!transcription) return NextResponse.json({ error: "No transcription" }, { status: 400 });

    const result = await processTranscription(transcription);
    let createdItem: string | null = null;

    if (result.action === "task") {
      const d = result.data as { title?: string; description?: string; priority?: string; category?: string };
      const task = await prisma.task.create({
        data: {
          title: d.title || transcription.slice(0, 100),
          description: d.description,
          priority: d.priority || "medium",
          category: d.category,
        },
      });
      createdItem = JSON.stringify(task);
    } else if (result.action === "event") {
      const d = result.data as { title?: string; description?: string; startDate?: string; category?: string };
      const event = await prisma.event.create({
        data: {
          title: d.title || transcription.slice(0, 100),
          description: d.description,
          startDate: d.startDate ? new Date(d.startDate) : new Date(),
          category: d.category || "personal",
        },
      });
      createdItem = JSON.stringify(event);
    } else if (result.action === "financial") {
      const d = result.data as { type?: string; amount?: number; description?: string; category?: string };
      const tx = await prisma.transaction.create({
        data: {
          type: d.type || "expense",
          amount: d.amount || 0,
          description: d.description || transcription.slice(0, 100),
          category: d.category || "Outros",
        },
      });
      createdItem = JSON.stringify(tx);
    } else {
      const note = await prisma.note.create({
        data: { content: (result.data as { content?: string }).content || transcription },
      });
      createdItem = JSON.stringify(note);
    }

    await prisma.audioLog.create({
      data: { transcription, action: result.action, createdItem },
    });

    return NextResponse.json({ action: result.action, summary: result.summary, data: result.data });
  } catch (error) {
    console.error("AI process error:", error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
