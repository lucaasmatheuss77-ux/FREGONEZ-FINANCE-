"use client";
import { useEffect, useState } from "react";
import { TopBar } from "@/components/Navigation/TopBar";
import { Card } from "@/components/ui/Card";
import { FinancialBarChart, ExpensePieChart } from "@/components/Dashboard/Charts";
import { formatCurrency, getMonthName } from "@/lib/utils";
import { TrendingUp, TrendingDown, CheckSquare, Target, Mic } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface DashboardData {
  totalBalance: number; monthIncome: number; monthExpense: number;
  taskCounts: { todo: number; doing: number; done: number };
  monthlyData: { month: string; receitas: number; despesas: number }[];
  categoryData: { name: string; value: number }[];
}
interface Transaction { id: string; type: string; amount: number; description: string; category: string; date: string; }
interface AudioStats { total: number; task: number; event: number; financial: number; note: number; }

export default function RelatoriosPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [audioStats, setAudioStats] = useState<AudioStats>({ total: 0, task: 0, event: 0, financial: 0, note: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard").then(r => r.ok ? r.json() : null),
      fetch("/api/transactions").then(r => r.ok ? r.json() : []),
      fetch("/api/audio-logs").then(r => r.ok ? r.json() : { total: 0, task: 0, event: 0, financial: 0, note: 0 }),
    ])
      .then(([dash, txs, audio]) => {
        if (dash) setData(dash);
        setTransactions(Array.isArray(txs) ? txs : []);
        setAudioStats(audio ?? { total: 0, task: 0, event: 0, financial: 0, note: 0 });
      })
      .finally(() => setLoading(false));
  }, []);

  const totalTasks = data ? data.taskCounts.todo + data.taskCounts.doing + data.taskCounts.done : 0;
  const completionRate = totalTasks > 0 ? Math.round((data?.taskCounts.done ?? 0) / totalTasks * 100) : 0;

  const balanceData = (() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
      const until = transactions.filter(t => new Date(t.date) <= end);
      const balance = until.reduce((s, t) => t.type === "income" ? s + t.amount : s - t.amount, 0);
      return { month: getMonthName(d.getMonth()), saldo: parseFloat(balance.toFixed(2)) };
    });
  })();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const totalIncome = transactions.filter(t => t.type === "income").reduce((s,t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((s,t) => s + t.amount, 0);

  return (
    <div className="max-w-md mx-auto min-h-screen">
      <TopBar title="Relatórios" subtitle="Análise e insights" />

      <div className="px-4 pb-6 mt-2 space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 border-emerald-100">
            <div className="flex items-center gap-2 mb-2"><TrendingUp size={15} className="text-emerald-600" /><span className="text-xs text-gray-400 font-medium">Total Receitas</span></div>
            <p className="text-xl font-black text-emerald-600">{formatCurrency(totalIncome)}</p>
          </Card>
          <Card className="p-4 border-red-100">
            <div className="flex items-center gap-2 mb-2"><TrendingDown size={15} className="text-red-500" /><span className="text-xs text-gray-400 font-medium">Total Gastos</span></div>
            <p className="text-xl font-black text-red-500">{formatCurrency(totalExpense)}</p>
          </Card>
        </div>

        {/* Task completion */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <CheckSquare size={16} className="text-violet-500" />
            <h3 className="text-sm font-bold text-gray-800">Produtividade</h3>
          </div>
          <div className="flex items-center gap-5">
            <div className="relative w-20 h-20 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#F0F2FF" strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="url(#progGrad)" strokeWidth="3" strokeDasharray={`${completionRate}, 100`} strokeLinecap="round" />
                <defs><linearGradient id="progGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#7C3AED" /><stop offset="100%" stopColor="#06B6D4" /></linearGradient></defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center"><span className="text-lg font-black text-gradient">{completionRate}%</span></div>
            </div>
            <div className="flex-1 space-y-2.5">
              {[{ label: "A Fazer", value: data?.taskCounts.todo ?? 0, color: "bg-gray-300" },
                { label: "Fazendo", value: data?.taskCounts.doing ?? 0, color: "bg-blue-400" },
                { label: "Feitas",  value: data?.taskCounts.done ?? 0,  color: "bg-emerald-400" }].map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${item.color}`} />
                  <span className="text-xs text-gray-500 flex-1">{item.label}</span>
                  <span className="text-xs font-black text-gray-700">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Balance evolution */}
        {balanceData.some(d => d.saldo !== 0) && (
          <Card className="p-4">
            <h3 className="text-sm font-bold text-gray-800 mb-4">Evolução do Saldo</h3>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={balanceData}>
                <defs>
                  <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fill: "#9CA3AF", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip formatter={(v: number) => [formatCurrency(v), "Saldo"]}
                  contentStyle={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "10px", fontSize: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }} />
                <Area type="monotone" dataKey="saldo" stroke="#7C3AED" strokeWidth={2.5} fill="url(#balGrad)" dot={{ fill: "#7C3AED", strokeWidth: 0, r: 4 }} activeDot={{ r: 5, fill: "#7C3AED" }} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        )}

        {data?.monthlyData && <FinancialBarChart data={data.monthlyData} />}
        {data?.categoryData && data.categoryData.length > 0 && <ExpensePieChart data={data.categoryData} />}

        {/* Top categories */}
        {data?.categoryData && data.categoryData.length > 0 && (
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Target size={16} className="text-amber-500" />
              <h3 className="text-sm font-bold text-gray-800">Maiores Gastos</h3>
            </div>
            <div className="space-y-3">
              {data.categoryData.slice(0, 5).map((cat, i) => {
                const total = data.categoryData.reduce((s,c) => s + c.value, 0);
                const pct = total > 0 ? (cat.value / total) * 100 : 0;
                const gradients = ["from-violet-500 to-blue-500","from-blue-500 to-cyan-500","from-cyan-500 to-emerald-500","from-emerald-500 to-amber-500","from-amber-500 to-red-500"];
                return (
                  <div key={cat.name}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-semibold text-gray-700">{cat.name}</span>
                      <span className="text-gray-400">{formatCurrency(cat.value)} <span className="text-gray-300">({pct.toFixed(0)}%)</span></span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${gradients[i]} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Voice stats */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Mic size={16} className="text-cyan-500" />
            <h3 className="text-sm font-bold text-gray-800">Uso do Assistente de Voz</h3>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            {[{ label:"Total",    value: audioStats.total,     color:"text-gray-700",    bg:"bg-gray-50"    },
              { label:"Tarefas",  value: audioStats.task,      color:"text-violet-600",  bg:"bg-violet-50"  },
              { label:"Eventos",  value: audioStats.event,     color:"text-blue-600",    bg:"bg-blue-50"    },
              { label:"Finanças", value: audioStats.financial, color:"text-emerald-600", bg:"bg-emerald-50" }].map(s => (
              <div key={s.label} className={`${s.bg} rounded-xl p-2.5 border border-gray-100`}>
                <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
