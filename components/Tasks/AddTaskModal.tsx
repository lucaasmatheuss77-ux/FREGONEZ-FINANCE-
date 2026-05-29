"use client";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { TASK_CATEGORIES } from "@/lib/utils";

interface AddTaskModalProps {
  isOpen: boolean; onClose: () => void;
  onAdd: (task: { title: string; description?: string; priority: string; category?: string; dueDate?: string }) => Promise<void>;
}

export function AddTaskModal({ isOpen, onClose, onAdd }: AddTaskModalProps) {
  const [title, setTitle] = useState(""); const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium"); const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState(""); const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try { await onAdd({ title, description, priority, category, dueDate }); setTitle(""); setDescription(""); setPriority("medium"); setCategory(""); setDueDate(""); onClose(); }
    finally { setLoading(false); }
  };

  const inp = "input-light";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nova Tarefa">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs text-gray-500 mb-1.5 block font-semibold">Título *</label>
          <input className={inp} placeholder="O que precisa ser feito?" value={title} onChange={e => setTitle(e.target.value)} required autoFocus />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1.5 block font-semibold">Descrição</label>
          <textarea className={`${inp} resize-none`} placeholder="Detalhes opcionais..." rows={2} value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block font-semibold">Prioridade</label>
            <select className={`${inp} cursor-pointer`} value={priority} onChange={e => setPriority(e.target.value)}>
              <option value="high">🔴 Alta</option>
              <option value="medium">🟡 Média</option>
              <option value="low">🟢 Baixa</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block font-semibold">Categoria</label>
            <select className={`${inp} cursor-pointer`} value={category} onChange={e => setCategory(e.target.value)}>
              <option value="">Nenhuma</option>
              {TASK_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1.5 block font-semibold">Prazo</label>
          <input type="datetime-local" className={inp} value={dueDate} onChange={e => setDueDate(e.target.value)} />
        </div>
        <div className="flex gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancelar</Button>
          <Button type="submit" loading={loading} className="flex-1">Criar Tarefa</Button>
        </div>
      </form>
    </Modal>
  );
}
