"use client";
import { useEffect, useState } from "react";
import { TopBar } from "@/components/Navigation/TopBar";
import { AddTransactionModal } from "@/components/Financial/AddTransactionModal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { Plus, TrendingUp, TrendingDown, Wallet, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface Transaction { id: string; type: string; amount: number; description: string; category: string; date: string; }

export default function FinanceiroPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<"all"|"income"|"expense">("all");

  useEffect(() => {
    fetch("/api/transactions")
      .then(r => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then(data => setTransactions(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Erro ao carregar transações"))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (t: { type: string; amount: number; description: string; category: string; date: string }) => {
    const r = await fetch("/api/transactions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t) });
    if (!r.ok) { toast.error("Erro ao registrar transação"); return; }
    const newTx = await r.json();
    setTransactions(prev => [newTx, ...prev]);
    toast.success(t.type === "income" ? "Receita adicionada! 📈" : "Despesa registrada! 📝");
  };

  const handleDelete = async (id: string) => {
    const r = await fetch("/api/transactions", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    if (!r.ok) { toast.error("Erro ao remover transação"); return; }
    setTransactions(prev => prev.filter(t => t.id !== id));
    toast.success("Transação removida");
  };

  const now = new Date(); const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthTx = transactions.filter(t => new Date(t.date) >= startOfMonth);
  const totalBalance = transactions.reduce((s, t) => t.type === "income" ? s + t.amount : s - t.amount, 0);
  const monthIncome = monthTx.filter(t => t.type === "income").reduce((s,t) => s + t.amount, 0);
  const monthExpense = monthTx.filter(t => t.type === "expense").reduce((s,t) => s + t.amount, 0);

  const filtered = transactions.filter(t => filter === "all" || t.type === filter);
  const grouped: Record<string, Transaction[]> = {};
  filtered.forEach(t => { const k = formatDate(t.date); if (!grouped[k]) grouped[k] = []; grouped[k].push(t); });

  return (
    <div className="max-w-md mx-auto min-h-screen">
      <TopBar title="Financeiro" subtitle="Receitas e despesas" />

      <div className="px-4 pb-6 mt-2 space-y-4">
        {/* Balance hero */}
        <div className="border-gold rounded-2xl p-5 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Wallet size={16} className="text-[#B07D10]" />
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Saldo Total</p>
          </div>
          <p className={`text-4xl font-black mb-1 ${totalBalance >= 0 ? "text-emerald-600" : "text-red-500"}`}>
            {formatCurrency(totalBalance)}
          </p>
        </div>

        {/* Month stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 border-emerald-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center">
                <TrendingUp size={15} className="text-emerald-600" />
              </div>
              <span className="text-xs text-gray-400 font-medium">Receitas (mês)</span>
            </div>
            <p className="text-xl font-black text-emerald-600">{formatCurrency(monthIncome)}</p>
          </Card>
          <Card className="p-4 border-red-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center">
                <TrendingDown size={15} className="text-red-500" />
              </div>
              <span className="text-xs text-gray-400 font-medium">Despesas (mês)</span>
            </div>
            <p className="text-xl font-black text-red-500">{formatCurrency(monthExpense)}</p>
          </Card>
        </div>

        <Button onClick={() => setShowModal(true)} className="w-full"><Plus size={16} /> Nova Transação</Button>

        {/* Filter */}
        <div className="flex bg-gray-50 border border-gray-100 rounded-xl p-1 gap-1">
          {(["all","income","expense"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={cn("flex-1 py-2 rounded-lg text-xs font-bold transition-all",
                filter === f
                  ? f === "income" ? "bg-emerald-500 text-white shadow-sm" : f === "expense" ? "bg-red-500 text-white shadow-sm" : "bg-white shadow-sm text-gray-800 border border-gray-100"
                  : "text-gray-400 hover:text-gray-600"
              )}>
              {f === "all" ? "Todas" : f === "income" ? "Receitas" : "Despesas"}
            </button>
          ))}
        </div>

        {/* Transactions */}
        {loading ? (
          <div className="py-8 text-center"><div className="w-6 h-6 border-2 border-[#B07D10] border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : Object.keys(grouped).length > 0 ? (
          Object.entries(grouped).map(([date, txs]) => (
            <div key={date}>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-px flex-1 bg-gray-100" />
                <span className="text-xs text-gray-400 font-semibold">{date}</span>
                <div className="h-px flex-1 bg-gray-100" />
              </div>
              <div className="space-y-2">
                {txs.map(tx => (
                  <Card key={tx.id} className="p-3.5 group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", tx.type === "income" ? "bg-emerald-50" : "bg-red-50")}>
                          {tx.type === "income" ? <TrendingUp size={18} className="text-emerald-600" /> : <TrendingDown size={18} className="text-red-500" />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{tx.description}</p>
                          <p className="text-xs text-gray-400">{tx.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn("text-sm font-black", tx.type === "income" ? "text-emerald-600" : "text-red-500")}>
                          {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                        </span>
                        <button onClick={() => handleDelete(tx.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all">
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
          <Card className="p-10 text-center">
            <Wallet size={36} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">Nenhuma transação</p>
            <p className="text-gray-300 text-sm mt-1">Adicione sua primeira transação</p>
          </Card>
        )}
      </div>

      <AddTransactionModal isOpen={showModal} onClose={() => setShowModal(false)} onAdd={handleAdd} />
    </div>
  );
}
