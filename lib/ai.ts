export interface AIProcessResult {
  action: "task" | "event" | "financial" | "note";
  data: Record<string, unknown>;
  summary: string;
}

export async function processTranscription(text: string): Promise<AIProcessResult> {
  const { default: Groq } = await import("groq-sdk");
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const prompt = `Você é um assistente pessoal do Lucas Fregonez. Analise o texto abaixo (transcrição de áudio) e determine qual ação criar.

Texto: "${text}"

Regras:
- Se menciona algo para FAZER, uma tarefa, lembrete → action: "task"
- Se menciona hora, data, reunião, evento, compromisso → action: "event"
- Se menciona dinheiro, gasto, paguei, recebi, salário, comprei → action: "financial"
- Caso contrário → action: "note"

Responda APENAS com JSON válido:
{
  "action": "task" | "event" | "financial" | "note",
  "summary": "frase curta descrevendo o que foi criado",
  "data": {
    // task: { "title": string, "description": string, "priority": "low"|"medium"|"high", "category": string }
    // event: { "title": string, "description": string, "startDate": "ISO 8601", "category": "work"|"personal"|"health"|"financial" }
    // financial: { "type": "income"|"expense", "amount": number, "description": string, "category": string }
    // note: { "content": string }
  }
}`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 512,
    temperature: 0.2,
    response_format: { type: "json_object" },
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("Empty AI response");

  return JSON.parse(raw) as AIProcessResult;
}
