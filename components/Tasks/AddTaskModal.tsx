"use client";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { TASK_CATEGORIES } from "@/lib/utils";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: { title: string; description?: string; priority: string; category?: string; dueDate?: string }) => Promise<void>;
}

export function AddTaskModal({ isOpen, onClose, onAdd }: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await onAdd({ title, description, priority, category, dueDate });
      setTitle(""); setDescription(""); setPriority("medium"); setCategory(""); setDueDate("");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/8 transition-all";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nova Tarefa">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs text-gray-400 mb-1.5 block font-medium">Título *</label>
          <input
            className={inputClass}
            placeholder="O que precisa ser feito?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1.5 block font-medium">Descrição</label>
          <textarea
            className={`${inputClass} resize-none`}
            placeholder="Detalhes opcionais..."
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block font-medium">Prioridade</label>
            <select
              className={`${inputClass} cursor-pointer`}
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="high" className="bg-gray-900">Alta</option>
              <option value="medium" className="bg-gray-900">Média</option>
              <option value="low" className="bg-gray-900">Baixa</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block font-medium">Categoria</label>
            <select
              className={`${inputClass} cursor-pointer`}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="" className="bg-gray-900">Nenhuma</option>
              {TASK_CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-gray-900">{c}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1.5 block font-medium">Prazo</label>
          <input
            type="datetime-local"
            className={`${inputClass} [color-scheme:dark]`}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div className="flex gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancelar</Button>
          <Button type="submit" loading={loading} className="flex-1">Criar Tarefa</Button>
        </div>
      </form>
    </Modal>
  );
}
