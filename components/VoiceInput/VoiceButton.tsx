"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { Mic, MicOff, X, CheckCircle, Loader2, Wand2, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

interface VoiceButtonProps { onClose: () => void; }
type State = "idle" | "recording" | "processing" | "done" | "error" | "unsupported";
interface Result { transcription: string; action: string; summary: string; }

export function VoiceButton({ onClose }: VoiceButtonProps) {
  const [state, setState] = useState<State>("idle");
  const [result, setResult] = useState<Result | null>(null);
  const [transcript, setTranscript] = useState("");
  const [interimText, setInterimText] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) setState("unsupported");
  }, []);

  const startRecording = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) { setState("unsupported"); return; }

    const recognition = new SR();
    recognition.lang = "pt-BR";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    let finalText = "";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += t + " ";
        else interim = t;
      }
      setTranscript(finalText);
      setInterimText(interim);
    };

    recognition.onerror = () => { setState("error"); };

    recognition.onend = async () => {
      const fullText = finalText.trim();
      if (!fullText) { setState("idle"); return; }
      setState("processing");
      try {
        const res = await fetch("/api/ai-process", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcription: fullText }),
        });
        const data = await res.json();
        setResult({ transcription: fullText, action: data.action, summary: data.summary });
        setState("done");
        toast.success("Criado com sucesso!");
      } catch {
        setState("error");
        toast.error("Erro ao processar");
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setTranscript("");
    setInterimText("");
    setState("recording");
  }, []);

  const stopRecording = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const actionConfig: Record<string, { label: string; color: string; bg: string }> = {
    task:      { label: "✅ Tarefa criada",     color: "text-violet-700", bg: "bg-violet-50 border-violet-200" },
    event:     { label: "📅 Evento adicionado", color: "text-blue-700",   bg: "bg-blue-50 border-blue-200"    },
    financial: { label: "💰 Transação lançada", color: "text-emerald-700",bg: "bg-emerald-50 border-emerald-200" },
    note:      { label: "📝 Nota salva",        color: "text-amber-700",  bg: "bg-amber-50 border-amber-200"  },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white rounded-t-3xl shadow-[0_-8px_60px_rgba(124,58,237,0.2)] border-t border-x border-purple-100 pb-8">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
          <X size={18} />
        </button>

        <div className="px-6 pt-2 pb-4">
          <div className="text-center mb-5">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Sparkles size={15} className="text-violet-500" />
              <h3 className="text-xl font-black text-gradient">Assistente de Voz</h3>
              <Sparkles size={15} className="text-cyan-500" />
            </div>
            <p className="text-xs text-gray-400">Fale uma tarefa, evento ou gasto</p>
          </div>

          <div className="flex flex-col items-center gap-5">

            {/* UNSUPPORTED */}
            {state === "unsupported" && (
              <>
                <div className="w-24 h-24 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center">
                  <AlertCircle size={44} className="text-amber-400" />
                </div>
                <div className="text-center bg-amber-50 border border-amber-200 rounded-2xl p-4">
                  <p className="text-amber-700 font-bold text-sm mb-1">Microfone não suportado</p>
                  <p className="text-amber-600 text-xs">Use Chrome ou Safari para usar o assistente de voz</p>
                </div>
                <Button onClick={onClose} variant="secondary" className="w-full">Fechar</Button>
              </>
            )}

            {/* IDLE */}
            {state === "idle" && (
              <>
                <button onClick={startRecording}
                  className="w-28 h-28 rounded-full bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-500 flex items-center justify-center shadow-[0_8px_40px_rgba(124,58,237,0.45)] hover:shadow-[0_12px_60px_rgba(124,58,237,0.6)] hover:scale-110 active:scale-95 transition-all duration-300 border-4 border-white">
                  <Mic size={44} className="text-white" strokeWidth={2} />
                </button>
                <p className="text-gray-400 text-sm font-medium">Toque para gravar</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['"Reunião amanhã 10h"', '"Gastei 50 no almoço"', '"Ligar pro João"'].map(ex => (
                    <span key={ex} className="text-xs bg-gray-50 border border-gray-200 text-gray-400 px-3 py-1 rounded-full">{ex}</span>
                  ))}
                </div>
              </>
            )}

            {/* RECORDING */}
            {state === "recording" && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-red-100 animate-ping" />
                  <button onClick={stopRecording}
                    className="relative w-28 h-28 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-[0_8px_40px_rgba(239,68,68,0.4)] recording-pulse border-4 border-white">
                    <MicOff size={44} className="text-white" strokeWidth={2} />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-red-500 font-bold text-sm">Ouvindo...</span>
                </div>
                {/* Live transcript */}
                <div className="w-full min-h-[60px] bg-gray-50 border border-gray-200 rounded-2xl p-3">
                  {(transcript || interimText) ? (
                    <p className="text-sm text-gray-700 leading-relaxed">
                      <span className="font-medium">{transcript}</span>
                      <span className="text-gray-400 italic">{interimText}</span>
                    </p>
                  ) : (
                    <p className="text-sm text-gray-300 italic text-center mt-2">Fale algo...</p>
                  )}
                </div>
                <button onClick={stopRecording}
                  className="text-sm text-gray-500 hover:text-gray-800 font-medium underline underline-offset-2">
                  Parar e processar
                </button>
              </>
            )}

            {/* PROCESSING */}
            {state === "processing" && (
              <>
                <div className="w-28 h-28 rounded-full bg-violet-50 border-2 border-violet-200 flex items-center justify-center">
                  <Loader2 size={44} className="text-violet-600 animate-spin" />
                </div>
                <div className="text-center">
                  <p className="text-violet-700 font-bold">Processando com IA...</p>
                  <p className="text-gray-400 text-sm">Interpretando e salvando</p>
                </div>
                {transcript && (
                  <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">Transcrito:</p>
                    <p className="text-sm text-gray-700 italic">&ldquo;{transcript}&rdquo;</p>
                  </div>
                )}
              </>
            )}

            {/* DONE */}
            {state === "done" && result && (
              <>
                <div className="w-24 h-24 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
                  <CheckCircle size={44} className="text-emerald-500" />
                </div>
                <div className="w-full space-y-3">
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-xs text-gray-400 mb-1 font-medium">Você disse:</p>
                    <p className="text-sm text-gray-700 italic">&ldquo;{result.transcription}&rdquo;</p>
                  </div>
                  <div className={`rounded-xl p-3 border ${actionConfig[result.action]?.bg || "bg-violet-50 border-violet-200"}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Wand2 size={14} className={actionConfig[result.action]?.color || "text-violet-700"} />
                      <span className={`text-xs font-bold ${actionConfig[result.action]?.color || "text-violet-700"}`}>
                        {actionConfig[result.action]?.label || "Criado"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{result.summary}</p>
                  </div>
                </div>
                <Button onClick={onClose} className="w-full">Perfeito!</Button>
              </>
            )}

            {/* ERROR */}
            {state === "error" && (
              <>
                <div className="w-24 h-24 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center">
                  <X size={44} className="text-red-400" />
                </div>
                <p className="text-red-500 text-center font-medium text-sm">Erro ao processar. Tente novamente.</p>
                <Button onClick={() => { setState("idle"); setTranscript(""); }} variant="secondary">Tentar novamente</Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
