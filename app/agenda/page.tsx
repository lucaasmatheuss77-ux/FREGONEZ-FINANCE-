"use client";
import { useEffect, useState } from "react";
import { TopBar } from "@/components/Navigation/TopBar";
import { EventModal } from "@/components/Calendar/EventModal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatDateTime, EVENT_CATEGORY_LABELS, cn } from "@/lib/utils";
import { Plus, ChevronLeft, ChevronRight, Trash2, Calendar } from "lucide-react";
import toast from "react-hot-toast";

interface Event {
  id: string; title: string; description?: string | null;
  startDate: string; endDate?: string | null; category: string; color: string;
}

const DAYS = ["D","S","T","Q","Q","S","S"];
const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

export default function AgendaPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events")
      .then(r => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then(data => setEvents(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Erro ao carregar eventos"))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e: { title: string; description?: string; startDate: string; endDate?: string; category: string; color: string }) => {
    const r = await fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) });
    if (!r.ok) { toast.error("Erro ao criar evento"); return; }
    const newEv = await r.json();
    setEvents(prev => [...prev, newEv]);
    toast.success("Evento criado!");
  };

  const handleDelete = async (id: string) => {
    const r = await fetch("/api/events", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    if (!r.ok) { toast.error("Erro ao remover evento"); return; }
    setEvents(prev => prev.filter(e => e.id !== id));
    toast.success("Evento removido");
  };

  const year = currentDate.getFullYear(); const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const calDays: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const eventsForDay = (day: number) => events.filter(e => {
    const d = new Date(e.startDate);
    return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
  });

  const selectedDayEvents = selectedDate ? events.filter(e => new Date(e.startDate).toDateString() === new Date(selectedDate).toDateString()) : [];
  const upcoming = events.filter(e => new Date(e.startDate) >= today).sort((a,b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()).slice(0, 10);

  return (
    <div className="max-w-md mx-auto min-h-screen">
      <TopBar title="Agenda" subtitle={`${events.length} eventos`} />

      <div className="px-4 pb-6 mt-2 space-y-4">
        {/* Calendar card */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCurrentDate(new Date(year, month - 1))} className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors"><ChevronLeft size={18} /></button>
            <h2 className="font-black text-gray-800">{MONTHS[month]} {year}</h2>
            <button onClick={() => setCurrentDate(new Date(year, month + 1))} className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors"><ChevronRight size={18} /></button>
          </div>

          <div className="grid grid-cols-7 mb-2">
            {DAYS.map((d, i) => <div key={i} className="text-center text-xs font-bold text-gray-300 py-1">{d}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-y-1">
            {calDays.map((day, i) => {
              if (!day) return <div key={i} />;
              const dayEvs = eventsForDay(day);
              const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
              const dateStr = new Date(year, month, day).toISOString();
              const isSel = selectedDate && new Date(selectedDate).toDateString() === new Date(year, month, day).toDateString();

              return (
                <button key={i} onClick={() => { setSelectedDate(dateStr); if (!dayEvs.length) setShowModal(true); }}
                  className={cn("flex flex-col items-center py-1.5 rounded-xl transition-all",
                    isToday ? "bg-gradient-to-br from-amber-600 to-yellow-500 shadow-neon-sm" : isSel ? "bg-[#EEF2E6] border border-[#C5D4A0]" : "hover:bg-gray-50"
                  )}>
                  <span className={cn("text-xs font-bold", isToday ? "text-white" : "text-gray-700")}>{day}</span>
                  {dayEvs.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5">
                      {dayEvs.slice(0,3).map((e,j) => <div key={j} className="w-1 h-1 rounded-full" style={{ background: e.color }} />)}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        <Button onClick={() => { setSelectedDate(new Date().toISOString()); setShowModal(true); }} className="w-full">
          <Plus size={16} /> Novo Evento
        </Button>

        {/* Selected day */}
        {selectedDate && selectedDayEvents.length > 0 && (
          <Card className="p-4">
            <h3 className="text-sm font-bold text-gray-800 mb-3">
              {new Date(selectedDate).toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
            </h3>
            <div className="space-y-2">
              {selectedDayEvents.map(ev => (
                <div key={ev.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 group">
                  <div className="w-1 min-h-[40px] rounded-full flex-shrink-0" style={{ background: ev.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{ev.title}</p>
                    {ev.description && <p className="text-xs text-gray-400 mt-0.5">{ev.description}</p>}
                    <p className="text-xs text-gray-400 mt-1">{formatDateTime(ev.startDate)}</p>
                  </div>
                  <button onClick={() => handleDelete(ev.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Upcoming events */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={16} className="text-amber-500" />
            <h3 className="text-sm font-bold text-gray-800">Próximos Eventos</h3>
          </div>
          {loading ? (
            <div className="py-4 text-center"><div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>
          ) : upcoming.length > 0 ? (
            <div className="space-y-2">
              {upcoming.map(ev => (
                <div key={ev.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 border border-gray-100 group">
                  <div className="w-10 h-10 rounded-xl flex flex-col items-center justify-center flex-shrink-0" style={{ background: `${ev.color}15`, border: `1.5px solid ${ev.color}40` }}>
                    <span className="text-[11px] font-black" style={{ color: ev.color }}>{new Date(ev.startDate).getDate()}</span>
                    <span className="text-[9px] font-semibold" style={{ color: ev.color }}>
                      {["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"][new Date(ev.startDate).getMonth()]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 font-semibold truncate">{ev.title}</p>
                    <p className="text-xs text-gray-400">{formatDateTime(ev.startDate)}</p>
                    <span className="text-xs text-gray-400">{EVENT_CATEGORY_LABELS[ev.category] || ev.category}</span>
                  </div>
                  <button onClick={() => handleDelete(ev.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-300 text-sm py-4">Nenhum evento próximo</p>
          )}
        </Card>
      </div>

      <EventModal isOpen={showModal} onClose={() => setShowModal(false)} selectedDate={selectedDate || undefined} onAdd={handleAdd} />
    </div>
  );
}
