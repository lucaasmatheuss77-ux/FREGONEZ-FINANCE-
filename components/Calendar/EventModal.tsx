"use client";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { EVENT_CATEGORIES, EVENT_CATEGORY_LABELS } from "@/lib/utils";

interface EventModalProps {
  isOpen: boolean; onClose: () => void; selectedDate?: string;
  onAdd: (e: { title: string; description?: string; startDate: string; endDate?: string; category: string; color: string }) => Promise<void>;
}

const EVENT_COLORS = ["#D97706","#2563EB","#06B6D4","#10B981","#F59E0B","#EC4899","#EF4444"];

export function EventModal({ isOpen, onClose, selectedDate, onAdd }: EventModalProps) {
  const [title, setTitle] = useState(""); const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(selectedDate || new Date().toISOString().slice(0,16));
  const [endDate, setEndDate] = useState(""); const [category, setCategory] = useState("personal");
  const [color, setColor] = useState("#D97706"); const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try { await onAdd({ title, description, startDate, endDate: endDate || undefined, category, color }); setTitle(""); setDescription(""); setEndDate(""); onClose(); }
    finally { setLoading(false); }
  };

  const inp = "input-light";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Evento">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs text-gray-500 mb-1.5 block font-semibold">Título *</label>
          <input className={inp} placeholder="Nome do evento" value={title} onChange={e => setTitle(e.target.value)} required autoFocus />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1.5 block font-semibold">Descrição</label>
          <textarea className={`${inp} resize-none`} placeholder="Detalhes..." rows={2} value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block font-semibold">Início *</label>
            <input type="datetime-local" className={inp} value={startDate} onChange={e => setStartDate(e.target.value)} required />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block font-semibold">Fim</label>
            <input type="datetime-local" className={inp} value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1.5 block font-semibold">Categoria</label>
          <select className={`${inp} cursor-pointer`} value={category} onChange={e => setCategory(e.target.value)}>
            {EVENT_CATEGORIES.map(c => <option key={c} value={c}>{EVENT_CATEGORY_LABELS[c]}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1.5 block font-semibold">Cor do evento</label>
          <div className="flex gap-2 flex-wrap">
            {EVENT_COLORS.map(c => (
              <button key={c} type="button" onClick={() => setColor(c)}
                className="w-8 h-8 rounded-full transition-all hover:scale-110 border-2"
                style={{ background: c, borderColor: color === c ? "#0F0F1A" : "transparent", outline: color === c ? `3px solid ${c}` : "none", outlineOffset: "2px" }} />
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
