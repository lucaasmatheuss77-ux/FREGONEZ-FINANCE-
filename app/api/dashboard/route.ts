import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { getMonthName } from "@/lib/utils";

export async function GET() {
  try {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const [tasks, events, transactions] = await Promise.all([
    prisma.task.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.event.findMany({ where: { startDate: { gte: now } }, orderBy: { startDate: "asc" }, take: 5 }),
    prisma.transaction.findMany({ orderBy: { date: "desc" } }),
  ]);

  const monthTransactions = transactions.filter(
    (t) => new Date(t.date) >= startOfMonth && new Date(t.date) <= endOfMonth
  );

  const monthIncome = monthTransactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const monthExpense = monthTransactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const totalBalance = transactions.reduce((s, t) => t.type === "income" ? s + t.amount : s - t.amount, 0);

  const taskCounts = {
    todo: tasks.filter((t) => t.status === "todo").length,
    doing: tasks.filter((t) => t.status === "doing").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  // Last 6 months
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
    const monthTx = transactions.filter((t) => new Date(t.date) >= d && new Date(t.date) <= end);
    return {
      month: getMonthName(d.getMonth()),
      receitas: monthTx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
      despesas: monthTx.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
    };
  });

  // Expense categories
  const expensesByCategory: Record<string, number> = {};
  monthTransactions.filter((t) => t.type === "expense").forEach((t) => {
    expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
  });
  const categoryData = Object.entries(expensesByCategory)
    .map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }))
    .sort((a, b) => b.value - a.value);

  return NextResponse.json({
    totalBalance,
    monthIncome,
    monthExpense,
    taskCounts,
    recentTransactions: transactions.slice(0, 5),
    upcomingTasks: tasks.filter((t) => t.status !== "done").slice(0, 3),
    upcomingEvents: events.slice(0, 3),
    monthlyData,
    categoryData,
  });
  } catch {
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
  }
}
