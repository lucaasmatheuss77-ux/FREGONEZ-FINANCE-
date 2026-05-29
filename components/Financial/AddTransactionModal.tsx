"use client";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { TRANSACTION_CATEGORIES_EXPENSE, TRANSACTION_CATEGORIES_INCOME, cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface AddTransactionModalProps {
  isOpen: boolean; onClose: () => void;
  onAdd: (t: { type: string; amount: number; description: string; category: string; date: string }) => Promise<void>;
}

export function AddTransactionModal({ isOpen, onClose, onAdd }: AddTransactionModalProps) {
  const [type, setType] = useState<"income"|"expense">("expense");
  const [amount, setAmount] = useState(""); const [description, setDescription] = useState("");
  const [category, setCategory] = useState(""); const [date, setDate] = useState(new Date().toISOString().slice(0,16));
  const [loading, setLoading] = useState(false);
  const cats = type === "income" ? TRANSACTION_CATEGORIES_INCOME : TRANSACTION_CATEGORIES_EXPENSE;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !category) return;
    setLoading(true);
    try { await onAdd({ type, amount: parseFloat(amount), description, category, date }); setAmount(""); setDescription(""); setCategory(""); setDate(new Date().toISOString().slice(0,16)); onClose(); }
    finally { setLoading(false); }
  };

  const inp = "input-light";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nova Transação">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Type toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#F7F4EF] border border-[#E8E4DE] rounded-xl">
          {(["expense","income"] as const).map(t => (
            <button key={t} type="button" onClick={() => { setType(t); setCategory(""); }}
              className={cn("flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all",
                type === t
                  ? t === "income" ? "bg-emerald-500 text-white shadow-sm" : "bg-red-500 text-white shadow-sm"
                  : "text-[#9C968E] hover:text-[#5C5449]"
              )}>
              {t === "income" ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
              {t === "income" ? "Receita" : "Despesa"}
            </button>
          ))}
        </div>

        <div>
          <label className="text-xs text-[#9C968E] mb-1.5 block font-semibold">Valor (R$) *</label>
          <input className={cn(inp, "text-lg font-black", type === "income" ? "text-emerald-600" : "text-red-500")}
            placeholder="0,00" type="number" step="0.01" min="0" value={amount} onChange={e => setAmount(e.target.value)} required />
        </div>
        <div>
          <label className="text-xs text-[#9C968E] mb-1.5 block font-semibold">Descrição *</label>
          <input className={inp} placeholder="Ex: Almoço, Salário..." value={description} onChange={e => setDescription(e.target.value)} required />
        </div>
        <div>
          <label className="text-xs text-[#9C968E] mb-1.5 block font-semibold">Categoria *</label>
          <select className={`${inp} cursor-pointer`} value={category} onChange={e => setCategory(e.target.value)} required>
            <option value="">Selecionar...</option>
            {cats.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-[#9C968E] mb-1.5 block font-semibold">Data</label>
          <input type="datetime-local" className={inp} value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <div className="flex gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancelar</Button>
          <Button type="submit" loading={loading} className="flex-1">
            {type === "income" ? "Adicionar Receita" : "Adicionar Despesa"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
