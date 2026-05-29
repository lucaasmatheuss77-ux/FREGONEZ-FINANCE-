import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({ orderBy: { date: "desc" } });
    return NextResponse.json(transactions);
  } catch {
    return NextResponse.json({ error: "Failed to load transactions" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.type || body.amount == null || !body.description) {
      return NextResponse.json({ error: "type, amount and description are required" }, { status: 400 });
    }
    const tx = await prisma.transaction.create({
      data: {
        type: body.type,
        amount: Number(body.amount),
        description: body.description,
        category: body.category || "Outros",
        date: body.date ? new Date(body.date) : new Date(),
      },
    });
    return NextResponse.json(tx, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await prisma.transaction.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const code = (e as { code?: string })?.code;
    if (code === "P2025") return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
