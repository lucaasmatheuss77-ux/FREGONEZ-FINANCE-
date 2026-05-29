import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const now = new Date();

  // Tasks
  await prisma.task.createMany({
    data: [
      { title: "Revisar proposta de parceria", description: "Analisar os termos e responder até sexta", status: "todo", priority: "high", category: "Trabalho", dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2) },
      { title: "Ir à academia", description: "Treino de musculação — pernas", status: "todo", priority: "medium", category: "Saúde", dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) },
      { title: "Pagar fatura do cartão", description: "Vencimento dia 10", status: "doing", priority: "high", category: "Financeiro", dueDate: new Date(now.getFullYear(), now.getMonth(), 10) },
      { title: "Estudar TypeScript avançado", description: "Capítulos 5 a 8 do livro", status: "doing", priority: "medium", category: "Estudo" },
      { title: "Comprar presente aniversário", description: "Presente para a Carla", status: "todo", priority: "medium", category: "Pessoal", dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5) },
      { title: "Reunião com cliente Alpha", description: "Apresentar resultado do Q1", status: "done", priority: "high", category: "Trabalho" },
      { title: "Leitura do livro Atomic Habits", status: "done", priority: "low", category: "Estudo" },
    ],
  });

  // Events
  await prisma.event.createMany({
    data: [
      { title: "Reunião de planejamento Q2", description: "Definir metas do próximo trimestre", startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 10, 0), category: "work", color: "#7C3AED" },
      { title: "Consulta médica", description: "Check-up anual — Dr. Carlos", startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 14, 30), category: "health", color: "#10B981" },
      { title: "Almoço com parceiro", startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 4, 12, 0), category: "social", color: "#F59E0B" },
      { title: "Academia — treino pesado", startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 7, 0), category: "health", color: "#EC4899" },
      { title: "Revisão financeira mensal", description: "Analisar receitas e despesas", startDate: new Date(now.getFullYear(), now.getMonth() + 1, 1, 9, 0), category: "financial", color: "#F59E0B" },
    ],
  });

  // Transactions — last 6 months
  const txData = [];
  for (let m = 5; m >= 0; m--) {
    const d = (day: number, hour = 12) => new Date(now.getFullYear(), now.getMonth() - m, day, hour);
    txData.push(
      { type: "income", amount: 8500, description: "Salário", category: "Salário", date: d(5) },
      { type: "income", amount: 2200, description: "Freela — site empresa", category: "Freelance", date: d(10) },
      { type: "expense", amount: 1800, description: "Aluguel", category: "Moradia", date: d(1) },
      { type: "expense", amount: 650, description: "Supermercado", category: "Alimentação", date: d(8) },
      { type: "expense", amount: 180, description: "Combustível", category: "Transporte", date: d(12) },
      { type: "expense", amount: 90, description: "Jantar restaurante", category: "Alimentação", date: d(15) },
      { type: "expense", amount: 120, description: "Academia", category: "Saúde", date: d(3) },
      { type: "expense", amount: 49.9, description: "Streaming (Netflix + Spotify)", category: "Lazer", date: d(7) },
      { type: "expense", amount: 350, description: "Roupa nova", category: "Roupas", date: d(20) },
    );
  }
  await prisma.transaction.createMany({ data: txData });

  console.log("Seed concluído com sucesso!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
