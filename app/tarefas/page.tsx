"use client";
import { useEffect, useState } from "react";
import { TopBar } from "@/components/Navigation/TopBar";
import { TaskCard } from "@/components/Tasks/TaskCard";
import { AddTaskModal } from "@/components/Tasks/AddTaskModal";
import { Button } from "@/components/ui/Button";
import { Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface Task {
  id: string; title: string; description?: string | null; status: string;
  priority: string; dueDate?: string | null; category?: string | null; tags?: string[];
}

const columns = [
  { key: "todo",  label: "A Fazer", dot: "bg-gray-400",    badge: "bg-gray-100 text-gray-600"    },
  { key: "doing", label: "Fazendo", dot: "bg-blue-400",    badge: "bg-blue-50 text-blue-700"     },
  { key: "done",  label: "Feito",   dot: "bg-emerald-400", badge: "bg-emerald-50 text-emerald-700" },
];

export default function TarefasPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCol, setActiveCol] = useState<string | null>(null);

  useEffect(() => { loadTasks(); }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/tasks");
      if (!r.ok) throw new Error(String(r.status));
      const data = await r.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Erro ao carregar tarefas");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (task: { title: string; description?: string; priority: string; category?: string; dueDate?: string }) => {
    const r = await fetch("/api/tasks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(task) });
    if (!r.ok) { toast.error("Erro ao criar tarefa"); return; }
    const newTask = await r.json();
    setTasks(prev => [newTask, ...prev]);
    toast.success("Tarefa criada!");
  };

  const handleStatusChange = async (id: string, status: string) => {
    const r = await fetch(`/api/tasks/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    if (!r.ok) { toast.error("Erro ao atualizar tarefa"); return; }
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    toast.success(status === "done" ? "Tarefa concluída! 🎉" : "Status atualizado");
  };

  const handleDelete = async (id: string) => {
    const r = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (!r.ok) { toast.error("Erro ao remover tarefa"); return; }
    setTasks(prev => prev.filter(t => t.id !== id));
    toast.success("Tarefa removida");
  };

  const filtered = tasks.filter(t => !search || t.title.toLowerCase().includes(search.toLowerCase()));
  const getColTasks = (col: string) => filtered.filter(t => t.status === col);
  const pending = tasks.filter(t => t.status !== "done").length;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-md mx-auto min-h-screen">
      <TopBar title="Tarefas" subtitle={`${pending} pendente${pending !== 1 ? "s" : ""}`} />

      <div className="px-4 pb-6 mt-2 space-y-4">
        {/* Search + Add */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input-light pl-8" placeholder="Buscar tarefas..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Button onClick={() => setShowModal(true)} size="md" className="px-3 flex-shrink-0">
            <Plus size={16} />
          </Button>
        </div>

        {/* Column tabs */}
        <div className="flex bg-gray-50 border border-gray-100 rounded-xl p-1 gap-1">
          {columns.map(col => {
            const count = getColTasks(col.key).length;
            const active = activeCol === col.key;
            return (
              <button key={col.key} onClick={() => setActiveCol(active ? null : col.key)}
                className={cn("flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all",
                  active ? "bg-white shadow-sm text-gray-800 border border-gray-100" : "text-gray-400 hover:text-gray-600"
                )}>
                <span className={cn("w-1.5 h-1.5 rounded-full", col.dot)} />
                {col.label}
                <span className={cn("px-1.5 py-0.5 rounded-full text-[10px] font-bold", active ? col.badge : "bg-gray-200 text-gray-500")}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Task lists */}
        {columns.map(col => {
          if (activeCol && activeCol !== col.key) return null;
          const colTasks = getColTasks(col.key);
          return (
            <div key={col.key}>
              {!activeCol && (
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn("w-2 h-2 rounded-full", col.dot)} />
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{col.label}</h3>
                  <span className="text-xs text-gray-400">({colTasks.length})</span>
                </div>
              )}
              <div className="space-y-2">
                {colTasks.length > 0 ? colTasks.map(task => (
                  <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} onDelete={handleDelete} />
                )) : (
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
                    <p className="text-gray-300 text-sm">Nenhuma tarefa aqui</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <AddTaskModal isOpen={showModal} onClose={() => setShowModal(false)} onAdd={handleAdd} />
    </div>
  );
}
