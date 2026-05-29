"use client";
import { useEffect, useState } from "react";
import { TopBar } from "@/components/Navigation/TopBar";
import { Card } from "@/components/ui/Card";
import { FinancialBarChart, ExpensePieChart } from "@/components/Dashboard/Charts";
import { formatCurrency, getMonthName } from "@/lib/utils";
import { TrendingUp, TrendingDown, CheckSquare, Target, Mic } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

interface DashboardData {
  totalBalance: number;
  monthIncome: number;
  monthExpense: number;
  taskCounts: { todo: number; doing: number; done: number };
  monthlyData: { month: string; receitas: number; despesas: number }[];
  categoryData: { name: string; value: number }[];
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  category: string;
  date: string;
}

interface AudioLog {
  id: string;
  transcription: string;
  action: string;
  createdAt: string;
}

export default function RelatoriosPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [audioLogs] = useState<AudioLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard").then((r) => r.json()),
      fetch("/api/transactions").then((r) => r.json()),
    ]).then(([dash, txs]) => {
      setData(dash);
      setTransactions(txs);
    }).finally(() => setLoading(false));
  }, []);

  const totalTasks = data ? data.taskCounts.todo + data.taskCounts.doing + data.taskCounts.done : 0;
  const completionRate = totalTasks > 0 ? Math.round((data?.taskCounts.done || 0) / totalTasks * 100) : 0;

  // Balance evolution (last 6 months cumulative)
  const balanceData = (() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
      const until = transactions.filter((t) => new Date(t.date) <= end);
      const balance = until.reduce((s, t) => t.type === "income" ? s + t.amount : s - t.amount, 0);
      return { month: getMonthName(d.getMonth()), saldo: parseFloat(balance.toFixed(2)) };
    });
  })();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen">
      <TopBar title="Relatórios" subtitle="Análise e insights" />

      <div className="px-4 pb-6 mt-4 space-y-4">
        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-emerald-500/20 p-3">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-emerald-400" />
              <span className="text-xs text-gray-400">Receita Total</span>
            </div>
            <p className="text-lg font-black text-emerald-400">
              {formatCurrency(transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0))}
            </p>
          </Card>
          <Card className="border-red-500/20 p-3">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown size={16} className="text-red-400" />
              <span className="text-xs text-gray-400">Gasto Total</span>
            </div>
            <p className="text-lg font-black text-red-400">
              {formatCurrency(transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0))}
            </p>
          </Card>
        </div>

        {/* Task completion */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckSquare size={16} className="text-purple-400" />
            <h3 className="text-sm font-bold text-gray-200">Produtividade de Tarefas</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke="url(#prog)" strokeWidth="3" strokeDasharray={`${completionRate}, 100`} strokeLinecap="round" />
                <defs>
                  <linearGradient id="prog" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-black text-gradient">{completionRate}%</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {[
                { label: "A Fazer", value: data?.taskCounts.todo || 0, color: "bg-gray-500" },
                { label: "Fazendo", value: data?.taskCounts.doing || 0, color: "bg-blue-500" },
                { label: "Feitas", value: data?.taskCounts.done || 0, color: "bg-emerald-500" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${item.color}`} />
                  <span className="text-xs text-gray-400 flex-1">{item.label}</span>
                  <span className="text-xs font-bold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Balance evolution */}
        {balanceData.some((d) => d.saldo !== 0) && (
          <Card className="p-4">
            <h3 className="text-sm font-bold text-gray-200 mb-4">Evolução do Saldo</h3>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={balanceData}>
                <defs>
                  <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  formatter={(v: number) => [formatCurrency(v), "Saldo"]}
                  contentStyle={{ background: "rgba(15,15,30,0.9)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: "10px", fontSize: 12 }}
                />
                <Area type="monotone" dataKey="saldo" stroke="#7C3AED" strokeWidth={2} fill="url(#balGrad)" dot={{ fill: "#7C3AED", strokeWidth: 0, r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Charts */}
        {data?.monthlyData && <FinancialBarChart data={data.monthlyData} />}
        {data?.categoryData && data.categoryData.length > 0 && <ExpensePieChart data={data.categoryData} />}

        {/* Category breakdown */}
        {data?.categoryData && data.categoryData.length > 0 && (
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Target size={16} className="text-yellow-400" />
              <h3 className="text-sm font-bold text-gray-200">Maiores Gastos</h3>
            </div>
            <div className="space-y-2.5">
              {data.categoryData.slice(0, 5).map((cat, i) => {
                const total = data.categoryData.reduce((s, c) => s + c.value, 0);
                const pct = total > 0 ? (cat.value / total) * 100 : 0;
                const colors = ["from-purple-600 to-blue-600", "from-blue-600 to-cyan-500", "from-cyan-500 to-emerald-500", "from-emerald-500 to-yellow-500", "from-yellow-500 to-red-500"];
                return (
                  <div key={cat.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-300">{cat.name}</span>
                      <span className="text-gray-400">{formatCurrency(cat.value)} ({pct.toFixed(0)}%)</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${colors[i]} rounded-full transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Voice usage stats */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Mic size={16} className="text-cyan-400" />
            <h3 className="text-sm font-bold text-gray-200">Entradas por Voz</h3>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { label: "Total", value: audioLogs.length, color: "text-white" },
              { label: "Tarefas", value: audioLogs.filter((l) => l.action === "task").length, color: "text-purple-400" },
              { label: "Eventos", value: audioLogs.filter((l) => l.action === "event").length, color: "text-blue-400" },
              { label: "Finanças", value: audioLogs.filter((l) => l.action === "financial").length, color: "text-emerald-400" },
            ].map((s) => (
              <div key={s.label} className="bg-white/5 rounded-xl p-2">
                <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
