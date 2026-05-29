# Lucas Fregonez Agenda 📱

Sistema de gestão pessoal mobile-first com controle de tarefas, agenda, finanças e entrada por voz com IA.

## Funcionalidades

- **Dashboard** — Saldo, estatísticas, gráficos e resumo do dia
- **Agenda** — Calendário interativo com eventos por categoria e cor
- **Tarefas** — Kanban com prioridades, categorias e prazos
- **Financeiro** — Controle de receitas e despesas com histórico
- **Relatórios** — Gráficos, análises e produtividade
- **Voz** — Grave um áudio, a IA transcreve e cria tarefas/eventos/lançamentos automaticamente

## Setup

1. Clone e instale dependências:
```bash
npm install
```

2. Copie o arquivo de variáveis de ambiente:
```bash
cp .env.example .env
```

3. Configure as variáveis no `.env`:
   - `DATABASE_URL` — Neon PostgreSQL connection string
   - `DIRECT_URL` — Neon direct URL (sem pooler)
   - `OPENAI_API_KEY` — Para transcrição de áudio (Whisper)
   - `ANTHROPIC_API_KEY` — Para processamento com IA (Claude)

4. Sincronize o banco de dados:
```bash
npm run db:push
```

5. (Opcional) Carregue dados de exemplo:
```bash
npm run db:seed
```

6. Rode o servidor:
```bash
npm run dev
```

## Deploy na Vercel

1. Crie uma conta no [Neon](https://neon.tech) e copie as connection strings
2. Conecte o repositório na Vercel
3. Configure as variáveis de ambiente no painel da Vercel
4. O deploy roda automaticamente a cada push

## Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | PostgreSQL URL (com pooler para serverless) |
| `DIRECT_URL` | PostgreSQL URL direta (para migrations) |
| `OPENAI_API_KEY` | API Key da OpenAI para Whisper |
| `ANTHROPIC_API_KEY` | API Key da Anthropic para Claude |

## Tech Stack

- **Next.js 14** — App Router + TypeScript
- **Tailwind CSS** — Design metalizado e vibrante
- **Prisma** — ORM com PostgreSQL (Neon)
- **OpenAI Whisper** — Transcrição de áudio
- **Claude AI** — Processamento inteligente de transcrições
- **Recharts** — Gráficos e dashboards
- **Lucide React** — Ícones
