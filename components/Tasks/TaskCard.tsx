"use client";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { Calendar, Trash2, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

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

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

const priorityConfig = {
  high: { label: "Alta", variant: "red" as const, dot: "bg-red-400" },
  medium: { label: "Média", variant: "yellow" as const, dot: "bg-yellow-400" },
  low: { label: "Baixa", variant: "green" as const, dot: "bg-emerald-400" },
};

export function TaskCard({ task, onStatusChange, onDelete }: TaskCardProps) {
  const priority = priorityConfig[task.priority as keyof typeof priorityConfig] || priorityConfig.medium;
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done";

  return (
    <div className={cn(
      "glass-card border p-3 transition-all duration-200 hover:-translate-y-0.5 group",
      task.status === "done"
        ? "border-emerald-500/20 opacity-75"
        : "border-purple-500/10 hover:border-purple-500/30"
    )}>
      <div className="flex items-start gap-2">
        <GripVertical size={14} className="text-gray-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h4 className={cn(
              "text-sm font-semibold text-white leading-tight",
              task.status === "done" && "line-through text-gray-400"
            )}>
              {task.title}
            </h4>
            <button
              onClick={() => onDelete(task.id)}
              className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all flex-shrink-0"
            >
              <Trash2 size={13} />
            </button>
          </div>

          {task.description && (
            <p className="text-xs text-gray-500 mb-2 line-clamp-2">{task.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-1.5">
            <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", priority.dot)} />
            <Badge variant={priority.variant}>{priority.label}</Badge>

            {task.category && (
              <Badge variant="gray">{task.category}</Badge>
            )}

            {task.dueDate && (
              <div className={cn(
                "flex items-center gap-0.5 text-xs",
                isOverdue ? "text-red-400" : "text-gray-500"
              )}>
                <Calendar size={10} />
                <span>{formatDate(task.dueDate)}</span>
              </div>
            )}
          </div>

          {task.status !== "done" && (
            <div className="flex gap-1.5 mt-2.5">
              {task.status !== "doing" && (
                <button
                  onClick={() => onStatusChange(task.id, "doing")}
                  className="text-xs px-2 py-0.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/20 hover:bg-blue-500/30 transition-colors"
                >
                  Iniciar
                </button>
              )}
              <button
                onClick={() => onStatusChange(task.id, "done")}
                className="text-xs px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/30 transition-colors"
              >
                Concluir
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
