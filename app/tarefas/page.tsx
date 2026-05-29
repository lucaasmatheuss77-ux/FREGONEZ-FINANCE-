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
  id: string;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  dueDate?: string | null;
  category?: string | null;
  tags?: string[];
}

const columns = [
  { key: "todo", label: "A Fazer", color: "text-gray-400", dot: "bg-gray-400" },
  { key: "doing", label: "Fazendo", color: "text-blue-400", dot: "bg-blue-400" },
  { key: "done", label: "Feito", color: "text-emerald-400", dot: "bg-emerald-400" },
];

export default function TarefasPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCol, setActiveCol] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data);
    setLoading(false);
  };

  const handleAdd = async (task: { title: string; description?: string; priority: string; category?: string; dueDate?: string }) => {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    const newTask = await res.json();
    setTasks((prev) => [newTask, ...prev]);
    toast.success("Tarefa criada!");
  };

  const handleStatusChange = async (id: string, status: string) => {
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    toast.success(status === "done" ? "Tarefa concluída! 🎉" : "Status atualizado");
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    setTasks((prev) => prev.filter((t) => t.id !== id));
    toast.success("Tarefa removida");
  };

  const filtered = tasks.filter((t) =>
    search ? t.title.toLowerCase().includes(search.toLowerCase()) : true
  );

  const getColTasks = (col: string) => filtered.filter((t) => t.status === col);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen">
      <TopBar title="Tarefas" subtitle={`${tasks.filter((t) => t.status !== "done").length} pendentes`} />

      <div className="px-4 pb-6 mt-4 space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all"
              placeholder="Buscar tarefas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button onClick={() => setShowModal(true)} size="md" className="px-3">
            <Plus size={16} />
          </Button>
        </div>

        {/* Column tabs */}
        <div className="flex bg-white/5 rounded-xl p-1 gap-1">
          {columns.map((col) => {
            const count = getColTasks(col.key).length;
            return (
              <button
                key={col.key}
                onClick={() => setActiveCol(activeCol === col.key ? null : col.key)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all",
                  activeCol === col.key || (!activeCol && col.key === "todo")
                    ? "bg-white/10 text-white"
                    : "text-gray-500 hover:text-gray-300"
                )}
              >
                <span className={cn("w-1.5 h-1.5 rounded-full", col.dot)} />
                {col.label}
                <span className="bg-white/10 px-1.5 py-0.5 rounded-full text-[10px]">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Tasks by column */}
        {columns.map((col) => {
          const show = activeCol ? activeCol === col.key : true;
          if (!show) return null;
          const colTasks = getColTasks(col.key);
          return (
            <div key={col.key}>
              {!activeCol && (
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn("w-2 h-2 rounded-full", col.dot)} />
                  <h3 className={cn("text-xs font-bold uppercase tracking-wider", col.color)}>{col.label}</h3>
                  <span className="text-xs text-gray-600">({colTasks.length})</span>
                </div>
              )}
              <div className="space-y-2">
                {colTasks.length > 0 ? (
                  colTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDelete}
                    />
                  ))
                ) : (
                  <div className="glass-card border border-white/5 p-6 text-center">
                    <p className="text-gray-600 text-sm">Nenhuma tarefa aqui</p>
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
