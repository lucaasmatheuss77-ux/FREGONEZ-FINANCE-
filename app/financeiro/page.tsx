"use client";
import { useEffect, useState } from "react";
import { TopBar } from "@/components/Navigation/TopBar";
import { AddTransactionModal } from "@/components/Financial/AddTransactionModal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Plus, TrendingUp, TrendingDown, Wallet, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  category: string;
  date: string;
}

export default function FinanceiroPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");

  useEffect(() => { loadTransactions(); }, []);

  const loadTransactions = async () => {
    setLoading(true);
    const res = await fetch("/api/transactions");
    const data = await res.json();
    setTransactions(data);
    setLoading(false);
  };

  const handleAdd = async (t: { type: string; amount: number; description: string; category: string; date: string }) => {
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(t),
    });
    const newTx = await res.json();
    setTransactions((prev) => [newTx, ...prev]);
    toast.success(t.type === "income" ? "Receita adicionada!" : "Despesa registrada!");
  };

  const handleDelete = async (id: string) => {
    await fetch("/api/transactions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    toast.success("Transação removida");
  };

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthTx = transactions.filter((t) => new Date(t.date) >= startOfMonth);
  const totalBalance = transactions.reduce((s, t) => t.type === "income" ? s + t.amount : s - t.amount, 0);
  const monthIncome = monthTx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const monthExpense = monthTx.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  const filtered = transactions.filter((t) => filter === "all" || t.type === filter);

  // Group by date
  const grouped: Record<string, Transaction[]> = {};
  filtered.forEach((t) => {
    const key = formatDate(t.date);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(t);
  });

  return (
    <div className="max-w-md mx-auto min-h-screen">
      <TopBar title="Financeiro" subtitle="Controle de receitas e despesas" />

      <div className="px-4 pb-6 mt-4 space-y-4">
        {/* Balance card */}
        <div className="border-gold rounded-2xl p-5 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/10 to-amber-900/10" />
          <div className="relative">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Wallet size={16} className="text-yellow-400" />
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Saldo Total</p>
            </div>
            <p className={`text-4xl font-black mb-1 ${totalBalance >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {formatCurrency(totalBalance)}
            </p>
          </div>
        </div>

        {/* Month stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-emerald-500/20 p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <TrendingUp size={14} className="text-emerald-400" />
              </div>
              <span className="text-xs text-gray-400">Receitas (mês)</span>
            </div>
            <p className="text-lg font-black text-emerald-400">{formatCurrency(monthIncome)}</p>
          </Card>
          <Card className="border-red-500/20 p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-red-500/20 flex items-center justify-center">
                <TrendingDown size={14} className="text-red-400" />
              </div>
              <span className="text-xs text-gray-400">Despesas (mês)</span>
            </div>
            <p className="text-lg font-black text-red-400">{formatCurrency(monthExpense)}</p>
          </Card>
        </div>

        {/* Add button */}
        <Button onClick={() => setShowModal(true)} className="w-full">
          <Plus size={16} /> Nova Transação
        </Button>

        {/* Filter */}
        <div className="flex bg-white/5 rounded-xl p-1 gap-1">
          {(["all", "income", "expense"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "flex-1 py-2 rounded-lg text-xs font-semibold transition-all",
                filter === f
                  ? f === "income" ? "bg-emerald-500/30 text-emerald-300" : f === "expense" ? "bg-red-500/30 text-red-300" : "bg-white/10 text-white"
                  : "text-gray-500 hover:text-gray-300"
              )}
            >
              {f === "all" ? "Todas" : f === "income" ? "Receitas" : "Despesas"}
            </button>
          ))}
        </div>

        {/* Transactions grouped by date */}
        {loading ? (
          <div className="py-8 text-center"><div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : Object.keys(grouped).length > 0 ? (
          Object.entries(grouped).map(([date, txs]) => (
            <div key={date}>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-px flex-1 bg-white/5" />
                <span className="text-xs text-gray-600 font-medium">{date}</span>
                <div className="h-px flex-1 bg-white/5" />
              </div>
              <div className="space-y-2">
                {txs.map((tx) => (
                  <Card key={tx.id} className="p-3 group hover:border-purple-500/20 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                          tx.type === "income" ? "bg-emerald-500/20" : "bg-red-500/20"
                        )}>
                          {tx.type === "income"
                            ? <TrendingUp size={18} className="text-emerald-400" />
                            : <TrendingDown size={18} className="text-red-400" />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{tx.description}</p>
                          <p className="text-xs text-gray-500">{tx.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn("text-sm font-black", tx.type === "income" ? "text-emerald-400" : "text-red-400")}>
                          {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                        </span>
                        <button
                          onClick={() => handleDelete(tx.id)}
                          className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))
        ) : (
          <Card className="p-8 text-center">
            <Wallet size={32} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Nenhuma transação encontrada</p>
            <p className="text-gray-600 text-xs mt-1">Adicione sua primeira transação</p>
          </Card>
        )}
      </div>

      <AddTransactionModal isOpen={showModal} onClose={() => setShowModal(false)} onAdd={handleAdd} />
    </div>
  );
}
