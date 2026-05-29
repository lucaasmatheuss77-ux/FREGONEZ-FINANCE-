export interface AIProcessResult {
  action: "task" | "event" | "financial" | "note";
  data: Record<string, unknown>;
  summary: string;
}

// ─── Parser inteligente por regras (sem API key) ────────────────────────────

function extractAmount(text: string): number {
  const match = text.match(/r\$\s*(\d+(?:[.,]\d+)?)|(\d+(?:[.,]\d+)?)\s*(?:reais?|conto|pila)/i)
    ?? text.match(/(\d+(?:[.,]\d+)?)/);
  if (!match) return 0;
  const raw = (match[1] || match[2] || match[0]).replace(",", ".");
  return parseFloat(raw) || 0;
}

function ruleBasedParse(text: string): AIProcessResult {
  const t = text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

  // ── Financeiro ─────────────────────────────────────────────────────────────
  const expenseWords = ["gastei","paguei","comprei","custou","custa","cobrou","descontou","sai","saiu","perdi","debitou"];
  const incomeWords  = ["recebi","ganhei","salario","entrou","deposito","pagaram","transferiram","lucrei","faturei","me pagou"];
  const moneyHints   = ["reais","real","conto","pila","r$","centavos","brl"];
  const hasNumber    = /\d/.test(t);

  const isExpense = expenseWords.some(w => t.includes(w));
  const isIncome  = incomeWords.some(w => t.includes(w));
  const hasMoney  = moneyHints.some(w => t.includes(w)) || (hasNumber && (isExpense || isIncome));

  if (hasMoney || isExpense || isIncome) {
    const amount = extractAmount(text);
    const type = isIncome ? "income" : "expense";

    // Detectar categoria financeira
    let category = "Outros";
    if (/almoco|jantar|lanche|restaurante|ifood|comida|pizza|burger|cafe/.test(t)) category = "Alimentação";
    else if (/mercado|supermercado|feira|hortifruti/.test(t)) category = "Alimentação";
    else if (/uber|99|taxi|gasolina|combustivel|onibus|metro|passagem/.test(t)) category = "Transporte";
    else if (/farmacia|remedio|medico|consulta|hospital|plano de saude/.test(t)) category = "Saúde";
    else if (/academia|gym|fitness/.test(t)) category = "Saúde";
    else if (/aluguel|condominio|conta de luz|energia|agua|internet|tv/.test(t)) category = "Moradia";
    else if (/netflix|spotify|disney|prime|streaming|jogo|cinema|show/.test(t)) category = "Lazer";
    else if (/faculdade|curso|livro|estudo|escola/.test(t)) category = "Educação";
    else if (/roupa|tenis|sapato|camisa|calcado|loja/.test(t)) category = "Roupas";
    else if (/salario|freelance|projeto|servico/.test(t)) category = isIncome ? "Salário" : "Outros";

    return {
      action: "financial",
      data: { type, amount, description: text.charAt(0).toUpperCase() + text.slice(1), category },
      summary: `${type === "income" ? "Receita" : "Despesa"} de R$ ${amount.toFixed(2).replace(".", ",")} em ${category} registrada`,
    };
  }

  // ── Evento / Compromisso ───────────────────────────────────────────────────
  const eventWords    = ["reuniao","compromisso","evento","consulta","encontro","festa","aniversario","wedding","casamento","formatura","palestra","treinamento","workshop","entrevista","voo","viagem","dentista","medico"];
  const timePatterns  = /\b(\d{1,2})[h:]\s*(\d{0,2})\b|\b(amanha|depois de amanha|proxima|semana que vem)\b/;
  const dayWords      = ["segunda","terca","quarta","quinta","sexta","sabado","domingo","amanha","hoje a noite","hoje","proxima semana"];

  const isEvent = eventWords.some(w => t.includes(w)) || timePatterns.test(t) || dayWords.some(w => t.includes(w));

  if (isEvent) {
    let category = "personal";
    if (/reuniao|trabalho|cliente|projeto|empresa|escritorio/.test(t)) category = "work";
    else if (/medico|dentista|consulta|exame|farmacia/.test(t)) category = "health";
    else if (/financeiro|banco|imposto|contador/.test(t)) category = "financial";

    // Tenta extrair hora
    const hourMatch = text.match(/(\d{1,2})[h:]\s*(\d{0,2})/);
    const startDate = new Date();
    if (hourMatch) {
      startDate.setHours(parseInt(hourMatch[1]), parseInt(hourMatch[2] || "0"), 0);
      if (startDate < new Date()) startDate.setDate(startDate.getDate() + 1);
    } else {
      startDate.setDate(startDate.getDate() + 1);
      startDate.setHours(9, 0, 0);
    }

    return {
      action: "event",
      data: { title: text.charAt(0).toUpperCase() + text.slice(1), startDate: startDate.toISOString(), category, description: "" },
      summary: `Evento "${text.slice(0, 50)}" adicionado na agenda`,
    };
  }

  // ── Tarefa (padrão) ────────────────────────────────────────────────────────
  let priority: "low" | "medium" | "high" = "medium";
  if (/urgente|importante|critico|asap|hoje|agora/.test(t)) priority = "high";
  else if (/quando puder|sem pressa|talvez|futuro/.test(t)) priority = "low";

  let category = "Outros";
  if (/trabalho|cliente|projeto|reuniao|email|ligar|ligar para|contato/.test(t)) category = "Trabalho";
  else if (/academia|correr|exercicio|treino|dieta|saude/.test(t)) category = "Saúde";
  else if (/comprar|mercado|feira|loja/.test(t)) category = "Casa";
  else if (/estudar|ler|livro|curso|aprender/.test(t)) category = "Estudo";

  return {
    action: "task",
    data: { title: text.charAt(0).toUpperCase() + text.slice(1), description: "", priority, category },
    summary: `Tarefa "${text.slice(0, 60)}" criada`,
  };
}

// ─── Processamento principal ────────────────────────────────────────────────

export async function processTranscription(text: string): Promise<AIProcessResult> {
  // Se tiver GROQ_API_KEY: usa IA para melhor interpretação
  if (process.env.GROQ_API_KEY) {
    try {
      const { default: Groq } = await import("groq-sdk");
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

      const prompt = `Você é o assistente pessoal do Lucas Fregonez. Analise este texto em português e determine a ação correta.

Texto: "${text}"

Classifique como:
- "task" → algo para fazer, lembrete, to-do
- "event" → compromisso, reunião, hora marcada, evento futuro
- "financial" → dinheiro, gasto, receita, pagamento
- "note" → observação geral

Responda APENAS com JSON válido (sem markdown):
{
  "action": "task"|"event"|"financial"|"note",
  "summary": "frase descrevendo o que foi criado",
  "data": {
    // task: { "title": string, "priority": "low"|"medium"|"high", "category": string, "description": string }
    // event: { "title": string, "startDate": "ISO 8601", "category": "work"|"personal"|"health"|"financial", "description": string }
    // financial: { "type": "income"|"expense", "amount": number, "description": string, "category": string }
    // note: { "content": string }
  }
}`;

      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 512,
        temperature: 0.1,
        response_format: { type: "json_object" },
      });

      const raw = completion.choices[0]?.message?.content;
      if (raw) return JSON.parse(raw) as AIProcessResult;
    } catch (e) {
      console.warn("Groq failed, using rule-based parser:", e);
    }
  }

  // Fallback: parser por regras (sem API key)
  return ruleBasedParse(text);
}
