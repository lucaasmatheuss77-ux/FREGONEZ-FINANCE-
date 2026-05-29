"use client";
import { useEffect, useState } from "react";
import { TopBar } from "@/components/Navigation/TopBar";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { FinancialBarChart, ExpensePieChart } from "@/components/Dashboard/Charts";
import { Card } from "@/components/ui/Card";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { TrendingUp, TrendingDown, CheckSquare, Calendar, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

interface DashboardData {
  totalBalance: number;
  monthIncome: number;
  monthExpense: number;
  taskCounts: { todo: number; doing: number; done: number };
  recentTransactions: { id: string; type: string; amount: number; description: string; category: string; date: string }[];
  upcomingTasks: { id: string; title: string; priority: string; dueDate?: string | null }[];
  upcomingEvents: { id: string; title: string; startDate: string; category: string; color: string }[];
  monthlyData: { month: string; receitas: number; despesas: number }[];
  categoryData: { name: string; value: number }[];
}

const priorityColors: Record<string, string> = {
  high: "text-red-400",
  medium: "text-yellow-400",
  low: "text-emerald-400",
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard").then((r) => r.json()).then(setData).finally(() => setLoading(false));
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-[0_0_40px_rgba(124,58,237,0.5)] animate-pulse">
            <span className="text-2xl font-black text-white">LF</span>
          </div>
          <p className="text-gradient text-lg font-bold">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen">
      <TopBar title={`${greeting()}, Lucas 👋`} subtitle="Seu painel pessoal" />

      <div className="px-4 pb-6 space-y-4 mt-4">
        {/* Balance hero card */}
        <div className="border-neon rounded-2xl p-5 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-cyan-900/10" />
          <div className="relative">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Saldo Total</p>
            <p className={`text-4xl font-black mb-1 ${(data?.totalBalance || 0) >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {formatCurrency(data?.totalBalance || 0)}
            </p>
            <p className="text-xs text-gray-500">Atualizado agora</p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3">
          <StatsCard title="Receitas" value={data?.monthIncome || 0} icon={TrendingUp} isCurrency color="green" />
          <StatsCard title="Despesas" value={data?.monthExpense || 0} icon={TrendingDown} isCurrency color="red" />
          <StatsCard
            title="Tarefas"
            value={(data?.taskCounts.todo || 0) + (data?.taskCounts.doing || 0)}
            icon={CheckSquare}
            color="purple"
            subtitle={`${data?.taskCounts.done || 0} feitas`}
          />
        </div>

        {/* Charts */}
        {data?.monthlyData && data.monthlyData.some((d) => d.receitas > 0 || d.despesas > 0) && (
          <FinancialBarChart data={data.monthlyData} />
        )}
        {data?.categoryData && data.categoryData.length > 0 && (
          <ExpensePieChart data={data.categoryData} />
        )}

        {/* Upcoming tasks */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-200">Próximas Tarefas</h3>
            <Link href="/tarefas" className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300">
              Ver todas <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {data?.upcomingTasks && data.upcomingTasks.length > 0 ? (
              data.upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${task.priority === "high" ? "bg-red-400" : task.priority === "medium" ? "bg-yellow-400" : "bg-emerald-400"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{task.title}</p>
                    {task.dueDate && (
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={10} /> {formatDate(task.dueDate)}
                      </p>
                    )}
                  </div>
                  <span className={`text-xs font-medium flex-shrink-0 ${priorityColors[task.priority] || "text-gray-400"}`}>
                    {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Média" : "Baixa"}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 text-sm py-3">Nenhuma tarefa pendente 🎉</p>
            )}
          </div>
        </Card>

        {/* Upcoming events */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-200">Próximos Eventos</h3>
            <Link href="/agenda" className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300">
              Ver agenda <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {data?.upcomingEvents && data.upcomingEvents.length > 0 ? (
              data.upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ background: event.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{event.title}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar size={10} /> {formatDateTime(event.startDate)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 text-sm py-3">Nenhum evento próximo</p>
            )}
          </div>
        </Card>

        {/* Recent transactions */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-200">Últimas Transações</h3>
            <Link href="/financeiro" className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300">
              Ver todas <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {data?.recentTransactions && data.recentTransactions.length > 0 ? (
              data.recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${tx.type === "income" ? "bg-emerald-500/20" : "bg-red-500/20"}`}>
                      {tx.type === "income" ? <TrendingUp size={14} className="text-emerald-400" /> : <TrendingDown size={14} className="text-red-400" />}
                    </div>
                    <div>
                      <p className="text-sm text-white">{tx.description}</p>
                      <p className="text-xs text-gray-500">{tx.category}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${tx.type === "income" ? "text-emerald-400" : "text-red-400"}`}>
                    {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 text-sm py-3">Nenhuma transação ainda</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
