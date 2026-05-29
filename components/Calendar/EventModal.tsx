"use client";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { EVENT_CATEGORIES, EVENT_CATEGORY_LABELS } from "@/lib/utils";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: string;
  onAdd: (e: { title: string; description?: string; startDate: string; endDate?: string; category: string; color: string }) => Promise<void>;
}

const EVENT_COLORS = ["#7C3AED", "#2563EB", "#06B6D4", "#10B981", "#F59E0B", "#EC4899", "#EF4444"];

export function EventModal({ isOpen, onClose, selectedDate, onAdd }: EventModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(selectedDate || new Date().toISOString().slice(0, 16));
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("personal");
  const [color, setColor] = useState("#7C3AED");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await onAdd({ title, description, startDate, endDate: endDate || undefined, category, color });
      setTitle(""); setDescription(""); setEndDate("");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Evento">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs text-gray-400 mb-1.5 block font-medium">Título *</label>
          <input className={inputClass} placeholder="Nome do evento" value={title} onChange={(e) => setTitle(e.target.value)} required autoFocus />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1.5 block font-medium">Descrição</label>
          <textarea className={`${inputClass} resize-none`} placeholder="Detalhes..." rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block font-medium">Início *</label>
            <input type="datetime-local" className={`${inputClass} [color-scheme:dark]`} value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block font-medium">Fim</label>
            <input type="datetime-local" className={`${inputClass} [color-scheme:dark]`} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1.5 block font-medium">Categoria</label>
          <select className={`${inputClass} cursor-pointer`} value={category} onChange={(e) => setCategory(e.target.value)}>
            {EVENT_CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-gray-900">{EVENT_CATEGORY_LABELS[c]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1.5 block font-medium">Cor</label>
          <div className="flex gap-2 flex-wrap">
            {EVENT_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className="w-7 h-7 rounded-full transition-all hover:scale-110"
                style={{ background: c, outline: color === c ? `3px solid ${c}` : "none", outlineOffset: "2px" }}
              />
            ))}
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancelar</Button>
          <Button type="submit" loading={loading} className="flex-1">Criar Evento</Button>
        </div>
      </form>
    </Modal>
  );
}
