"use client";
import { useEffect, useState } from "react";
import { TopBar } from "@/components/Navigation/TopBar";
import { EventModal } from "@/components/Calendar/EventModal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatDateTime, EVENT_CATEGORY_LABELS } from "@/lib/utils";
import { Plus, ChevronLeft, ChevronRight, Trash2, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface Event {
  id: string;
  title: string;
  description?: string | null;
  startDate: string;
  endDate?: string | null;
  category: string;
  color: string;
}

const DAYS = ["D", "S", "T", "Q", "Q", "S", "S"];
const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

export default function AgendaPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    const res = await fetch("/api/events");
    const data = await res.json();
    setEvents(data);
    setLoading(false);
  };

  const handleAdd = async (e: { title: string; description?: string; startDate: string; endDate?: string; category: string; color: string }) => {
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(e),
    });
    const newEvent = await res.json();
    setEvents((prev) => [...prev, newEvent]);
    toast.success("Evento criado!");
  };

  const handleDelete = async (id: string) => {
    await fetch("/api/events", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setEvents((prev) => prev.filter((e) => e.id !== id));
    toast.success("Evento removido");
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const calendarDays: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const getEventsForDay = (day: number) =>
    events.filter((e) => {
      const d = new Date(e.startDate);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });

  const selectedDayEvents = selectedDate
    ? events.filter((e) => new Date(e.startDate).toDateString() === new Date(selectedDate).toDateString())
    : [];

  const upcomingEvents = events
    .filter((e) => new Date(e.startDate) >= today)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 10);

  return (
    <div className="max-w-md mx-auto min-h-screen">
      <TopBar title="Agenda" subtitle={`${events.length} eventos`} />

      <div className="px-4 pb-6 mt-4 space-y-4">
        {/* Calendar header */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCurrentDate(new Date(year, month - 1))} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400">
              <ChevronLeft size={18} />
            </button>
            <h2 className="font-bold text-white text-sm">{MONTHS[month]} {year}</h2>
            <button onClick={() => setCurrentDate(new Date(year, month + 1))} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400">
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Day names */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map((d, i) => (
              <div key={i} className="text-center text-xs font-semibold text-gray-600 py-1">{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-y-1">
            {calendarDays.map((day, i) => {
              if (!day) return <div key={i} />;
              const dayEvents = getEventsForDay(day);
              const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
              const dateStr = new Date(year, month, day).toISOString();
              const isSelected = selectedDate && new Date(selectedDate).toDateString() === new Date(year, month, day).toDateString();

              return (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedDate(dateStr);
                    if (dayEvents.length === 0) {
                      setShowModal(true);
                    }
                  }}
                  className={cn(
                    "flex flex-col items-center py-1.5 rounded-xl transition-all",
                    isToday && "bg-gradient-to-br from-purple-600 to-blue-600 shadow-[0_0_15px_rgba(124,58,237,0.4)]",
                    isSelected && !isToday && "bg-white/10",
                    !isToday && !isSelected && "hover:bg-white/5"
                  )}
                >
                  <span className={cn(
                    "text-xs font-semibold",
                    isToday ? "text-white" : "text-gray-300"
                  )}>{day}</span>
                  {dayEvents.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5">
                      {dayEvents.slice(0, 3).map((e, j) => (
                        <div key={j} className="w-1 h-1 rounded-full" style={{ background: e.color }} />
                      ))}
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

        {/* Selected day events */}
        {selectedDate && selectedDayEvents.length > 0 && (
          <Card>
            <h3 className="text-sm font-bold text-gray-200 mb-3">
              {new Date(selectedDate).toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
            </h3>
            <div className="space-y-2">
              {selectedDayEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 group">
                  <div className="w-1 h-full min-h-[40px] rounded-full flex-shrink-0 mt-0.5" style={{ background: event.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{event.title}</p>
                    {event.description && <p className="text-xs text-gray-500 mt-0.5">{event.description}</p>}
                    <p className="text-xs text-gray-500 mt-1">{formatDateTime(event.startDate)}</p>
                    <span className="text-xs text-gray-600">{EVENT_CATEGORY_LABELS[event.category] || event.category}</span>
                  </div>
                  <button onClick={() => handleDelete(event.id)} className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Upcoming events */}
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={16} className="text-purple-400" />
            <h3 className="text-sm font-bold text-gray-200">Próximos Eventos</h3>
          </div>
          {loading ? (
            <div className="py-4 text-center"><div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>
          ) : upcomingEvents.length > 0 ? (
            <div className="space-y-2">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/5 group">
                  <div className="w-10 h-10 rounded-xl flex flex-col items-center justify-center flex-shrink-0" style={{ background: `${event.color}20`, border: `1px solid ${event.color}40` }}>
                    <span className="text-[10px] font-bold" style={{ color: event.color }}>
                      {new Date(event.startDate).getDate()}
                    </span>
                    <span className="text-[8px]" style={{ color: event.color }}>
                      {["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"][new Date(event.startDate).getMonth()]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{event.title}</p>
                    <p className="text-xs text-gray-500">{formatDateTime(event.startDate)}</p>
                  </div>
                  <button onClick={() => handleDelete(event.id)} className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all flex-shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-sm py-4">Nenhum evento próximo</p>
          )}
        </Card>
      </div>

      <EventModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        selectedDate={selectedDate || undefined}
        onAdd={handleAdd}
      />
    </div>
  );
}
