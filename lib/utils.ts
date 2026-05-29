import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function getMonthName(monthIndex: number) {
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  return months[monthIndex];
}

export const TASK_CATEGORIES = ["Trabalho", "Pessoal", "Saúde", "Financeiro", "Estudo", "Casa", "Outros"];
export const EVENT_CATEGORIES = ["work", "personal", "health", "financial", "social"];
export const EVENT_CATEGORY_LABELS: Record<string, string> = {
  work: "Trabalho",
  personal: "Pessoal",
  health: "Saúde",
  financial: "Financeiro",
  social: "Social",
};
export const TRANSACTION_CATEGORIES_EXPENSE = [
  "Alimentação", "Transporte", "Saúde", "Lazer", "Moradia", "Educação", "Roupas", "Tecnologia", "Outros",
];
export const TRANSACTION_CATEGORIES_INCOME = [
  "Salário", "Freelance", "Investimentos", "Vendas", "Presente", "Outros",
];
