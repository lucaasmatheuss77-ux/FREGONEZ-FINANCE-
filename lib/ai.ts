export interface AIProcessResult {
  action: "task" | "event" | "financial" | "note";
  data: Record<string, unknown>;
  summary: string;
}

export async function processTranscription(text: string): Promise<AIProcessResult> {
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const prompt = `Você é um assistente pessoal do Lucas Fregonez. Analise o texto abaixo (transcrição de áudio) e determine:
1. Se é uma TAREFA para fazer
2. Se é um EVENTO na agenda
3. Se é uma transação FINANCEIRA (receita ou despesa)
4. Se é apenas uma NOTA/anotação

Texto transcrito: "${text}"

Responda APENAS com um JSON válido no seguinte formato:
{
  "action": "task" | "event" | "financial" | "note",
  "summary": "resumo em português do que foi criado",
  "data": {
    // Para task: { "title": string, "description": string, "priority": "low"|"medium"|"high", "category": string }
    // Para event: { "title": string, "description": string, "startDate": "ISO string", "category": "work"|"personal"|"health"|"financial" }
    // Para financial: { "type": "income"|"expense", "amount": number, "description": string, "category": string }
    // Para note: { "content": string }
  }
}`;

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON found in response");

  return JSON.parse(jsonMatch[0]) as AIProcessResult;
}
