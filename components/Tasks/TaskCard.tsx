"use client";
import { Badge } from "@/components/ui/Badge";
import { formatDate, cn } from "@/lib/utils";
import { Calendar, Trash2 } from "lucide-react";

interface Task {
  id: string; title: string; description?: string | null; status: string;
  priority: string; dueDate?: string | null; category?: string | null; tags?: string[];
}
interface TaskCardProps { task: Task; onStatusChange: (id: string, status: string) => void; onDelete: (id: string) => void; }

const priorityConf = {
  high:   { label: "Alta",  variant: "red" as const,    bar: "bg-red-400",    left: "bg-red-400"   },
  medium: { label: "Média", variant: "gold" as const,   bar: "bg-[#B07D10]",  left: "bg-[#B07D10]" },
  low:    { label: "Baixa", variant: "green" as const,  bar: "bg-emerald-400",left: "bg-emerald-400"},
};

export function TaskCard({ task, onStatusChange, onDelete }: TaskCardProps) {
  const p = priorityConf[task.priority as keyof typeof priorityConf] ?? priorityConf.medium;
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done";

  return (
    <div className={cn(
      "bg-white rounded-2xl border transition-all duration-200 group hover:shadow-card-hover hover:-translate-y-0.5 overflow-hidden",
      task.status === "done" ? "border-[rgba(27,58,27,0.06)] opacity-70" : "border-[rgba(27,58,27,0.09)] hover:border-[rgba(27,58,27,0.20)]"
    )}>
      {/* Priority bar on top */}
      <div className={cn("h-0.5 w-full", p.bar)} />

      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className={cn("text-sm font-semibold text-[#0E1A0A] leading-snug", task.status === "done" && "line-through text-gray-400")}>
            {task.title}
          </h4>
          <button onClick={() => onDelete(task.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all flex-shrink-0">
            <Trash2 size={13} />
          </button>
        </div>

        {task.description && <p className="text-xs text-gray-400 mb-2.5 line-clamp-2">{task.description}</p>}

        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant={p.variant}>{p.label}</Badge>
          {task.category && <Badge variant="gray">{task.category}</Badge>}
          {task.dueDate && (
            <div className={cn("flex items-center gap-1 text-xs", isOverdue ? "text-red-500" : "text-gray-400")}>
              <Calendar size={10} />{formatDate(task.dueDate)}
            </div>
          )}
        </div>

        {task.status !== "done" && (
          <div className="flex gap-1.5 mt-3 pt-3 border-t border-[rgba(27,58,27,0.06)]">
            {task.status !== "doing" && (
              <button onClick={() => onStatusChange(task.id, "doing")}
                className="text-xs px-3 py-1 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 font-medium transition-colors">
                Iniciar
              </button>
            )}
            <button onClick={() => onStatusChange(task.id, "done")}
              className="text-xs px-3 py-1 rounded-lg bg-[#E6EDE6] text-[#1B3A1B] border border-[#B8D0B8] hover:bg-[#D6E4D6] font-medium transition-colors">
              Concluir ✓
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
