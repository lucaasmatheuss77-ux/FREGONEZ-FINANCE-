import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const transactions = await prisma.transaction.findMany({ orderBy: { date: "desc" } });
  return NextResponse.json(transactions);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const tx = await prisma.transaction.create({
    data: {
      type: body.type,
      amount: body.amount,
      description: body.description,
      category: body.category,
      date: body.date ? new Date(body.date) : new Date(),
    },
  });
  return NextResponse.json(tx, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await prisma.transaction.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
