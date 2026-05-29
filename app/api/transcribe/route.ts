import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { default: Groq } = await import("groq-sdk");
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const formData = await req.formData();
    const audio = formData.get("audio") as File;
    if (!audio) return NextResponse.json({ error: "Nenhum áudio enviado" }, { status: 400 });

    const transcription = await groq.audio.transcriptions.create({
      file: audio,
      model: "whisper-large-v3-turbo",
      language: "pt",
      response_format: "json",
    });

    return NextResponse.json({ transcription: transcription.text });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json({ error: "Falha na transcrição" }, { status: 500 });
  }
}
