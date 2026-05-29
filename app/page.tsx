"use client";
import { useEffect, useState } from "react";
import { TopBar } from "@/components/Navigation/TopBar";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { FinancialBarChart, ExpensePieChart } from "@/components/Dashboard/Charts";
import { Card } from "@/components/ui/Card";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { TrendingUp, TrendingDown, CheckSquare, Calendar, ArrowRight, Clock, Wallet } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

interface DashboardData {
  totalBalance: number; monthIncome: number; monthExpense: number;
  taskCounts: { todo: number; doing: number; done: number };
  recentTransactions: { id: string; type: string; amount: number; description: string; category: string; date: string }[];
  upcomingTasks: { id: string; title: string; priority: string; dueDate?: string | null }[];
  upcomingEvents: { id: string; title: string; startDate: string; category: string; color: string }[];
  monthlyData: { month: string; receitas: number; despesas: number }[];
  categoryData: { name: string; value: number }[];
}

const priorityDot: Record<string, string> = { high: "bg-red-500", medium: "bg-[#B07D10]", low: "bg-emerald-500" };
const priorityLabel: Record<string, string> = { high: "Alta", medium: "Média", low: "Baixa" };
const priorityText: Record<string, string> = { high: "text-red-500", medium: "text-[#B07D10]", low: "text-emerald-600" };

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then(r => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then(setData)
      .catch(() => toast.error("Erro ao carregar painel"))
      .finally(() => setLoading(false));
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
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#1B3A1B] flex items-center justify-center shadow-neon-sm animate-pulse">
            <span className="text-xl font-black text-white">LF</span>
          </div>
          <p className="text-gradient font-bold">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen">
      <TopBar title={`${greeting()}, Lucas 👋`} subtitle="Seu painel pessoal" />

      <div className="px-4 pb-6 space-y-4 mt-2">
        {/* Balance hero */}
        <div className="border-neon rounded-2xl p-5 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Wallet size={16} className="text-[#B07D10]" />
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Saldo Total</p>
          </div>
          <p className={`text-4xl font-black mb-1 ${(data?.totalBalance ?? 0) >= 0 ? "text-emerald-600" : "text-red-500"}`}>
            {formatCurrency(data?.totalBalance ?? 0)}
          </p>
          <p className="text-xs text-gray-400">Atualizado agora</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatsCard title="Receitas" value={data?.monthIncome ?? 0} icon={TrendingUp} isCurrency color="green" />
          <StatsCard title="Despesas" value={data?.monthExpense ?? 0} icon={TrendingDown} isCurrency color="red" />
          <StatsCard title="Tarefas" value={(data?.taskCounts.todo ?? 0) + (data?.taskCounts.doing ?? 0)} icon={CheckSquare} color="forest" subtitle={`${data?.taskCounts.done ?? 0} feitas`} />
        </div>

        {/* Charts */}
        {data?.monthlyData?.some(d => d.receitas > 0 || d.despesas > 0) && <FinancialBarChart data={data.monthlyData} />}
        {data?.categoryData && data.categoryData.length > 0 && <ExpensePieChart data={data.categoryData} />}

        {/* Upcoming tasks */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-[#0E1A0A]">Próximas Tarefas</h3>
            <Link href="/tarefas" className="flex items-center gap-1 text-xs text-[#1B3A1B] hover:text-[#B07D10] font-medium transition-colors">
              Ver todas <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {data?.upcomingTasks?.length ? data.upcomingTasks.map(task => (
              <div key={task.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-[#FAF7F2] border border-[rgba(27,58,27,0.07)]">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${priorityDot[task.priority] || "bg-gray-400"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#0E1A0A] font-medium truncate">{task.title}</p>
                  {task.dueDate && (
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={10} /> {formatDate(task.dueDate)}
                    </p>
                  )}
                </div>
                <span className={`text-xs font-bold ${priorityText[task.priority] || "text-gray-400"}`}>
                  {priorityLabel[task.priority] || "—"}
                </span>
              </div>
            )) : (
              <p className="text-center text-gray-400 text-sm py-4">Nenhuma tarefa pendente 🎉</p>
            )}
          </div>
        </Card>

        {/* Upcoming events */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-[#0E1A0A]">Próximos Eventos</h3>
            <Link href="/agenda" className="flex items-center gap-1 text-xs text-[#1B3A1B] hover:text-[#B07D10] font-medium transition-colors">
              Ver agenda <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {data?.upcomingEvents?.length ? data.upcomingEvents.map(ev => (
              <div key={ev.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-[#FAF7F2] border border-[rgba(27,58,27,0.07)]">
                <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ background: ev.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#0E1A0A] font-medium truncate">{ev.title}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={10} /> {formatDateTime(ev.startDate)}</p>
                </div>
              </div>
            )) : (
              <p className="text-center text-gray-400 text-sm py-4">Nenhum evento próximo</p>
            )}
          </div>
        </Card>

        {/* Recent transactions */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-[#0E1A0A]">Últimas Transações</h3>
            <Link href="/financeiro" className="flex items-center gap-1 text-xs text-[#1B3A1B] hover:text-[#B07D10] font-medium transition-colors">
              Ver todas <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {data?.recentTransactions?.length ? data.recentTransactions.map(tx => (
              <div key={tx.id} className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F2] border border-[rgba(27,58,27,0.07)]">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${tx.type === "income" ? "bg-emerald-50" : "bg-red-50"}`}>
                    {tx.type === "income" ? <TrendingUp size={15} className="text-emerald-600" /> : <TrendingDown size={15} className="text-red-500" />}
                  </div>
                  <div>
                    <p className="text-sm text-[#0E1A0A] font-medium">{tx.description}</p>
                    <p className="text-xs text-gray-400">{tx.category}</p>
                  </div>
                </div>
                <span className={`text-sm font-black ${tx.type === "income" ? "text-emerald-600" : "text-red-500"}`}>
                  {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                </span>
              </div>
            )) : (
              <p className="text-center text-gray-400 text-sm py-4">Nenhuma transação ainda</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
