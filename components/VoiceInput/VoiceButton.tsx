"use client";
import { useState, useRef, useCallback } from "react";
import { Mic, MicOff, X, CheckCircle, Loader2, Wand2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

interface VoiceButtonProps { onClose: () => void; }

type State = "idle" | "recording" | "processing" | "done" | "error";
interface Result { transcription: string; action: string; summary: string; }

export function VoiceButton({ onClose }: VoiceButtonProps) {
  const [state, setState] = useState<State>("idle");
  const [result, setResult] = useState<Result | null>(null);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
      chunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.start(100);
      mediaRecorderRef.current = mr;
      setState("recording");
      setDuration(0);
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } catch {
      toast.error("Permissão de microfone negada");
    }
  }, []);

  const stopRecording = useCallback(() => {
    const mr = mediaRecorderRef.current;
    if (!mr) return;
    if (timerRef.current) clearInterval(timerRef.current);
    mr.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      mr.stream.getTracks().forEach((t) => t.stop());
      setState("processing");
      try {
        const formData = new FormData();
        formData.append("audio", blob, "recording.webm");
        const t1 = await fetch("/api/transcribe", { method: "POST", body: formData });
        const { transcription } = await t1.json();
        const t2 = await fetch("/api/ai-process", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ transcription }) });
        const { action, summary } = await t2.json();
        setResult({ transcription, action, summary });
        setState("done");
        toast.success("Criado com sucesso!");
      } catch {
        setState("error");
        toast.error("Erro ao processar áudio");
      }
    };
    mr.stop();
  }, []);

  const actionConfig: Record<string, { label: string; color: string; bg: string }> = {
    task:      { label: "✅ Tarefa criada",       color: "text-violet-700", bg: "bg-violet-50 border-violet-200" },
    event:     { label: "📅 Evento adicionado",   color: "text-blue-700",   bg: "bg-blue-50 border-blue-200"    },
    financial: { label: "💰 Transação lançada",   color: "text-emerald-700",bg: "bg-emerald-50 border-emerald-200" },
    note:      { label: "📝 Nota salva",          color: "text-amber-700",  bg: "bg-amber-50 border-amber-200"  },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white rounded-t-3xl shadow-[0_-8px_60px_rgba(124,58,237,0.2)] border-t border-x border-purple-100 pb-8">
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
          <X size={18} />
        </button>

        <div className="px-6 pt-2 pb-4">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Sparkles size={16} className="text-violet-500" />
              <h3 className="text-xl font-black text-gradient">Assistente de Voz</h3>
              <Sparkles size={16} className="text-cyan-500" />
            </div>
            <p className="text-sm text-gray-400">Fale uma tarefa, evento ou gasto</p>
          </div>

          <div className="flex flex-col items-center gap-5">
            {state === "idle" && (
              <>
                <button onClick={startRecording} className="w-28 h-28 rounded-full bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-500 flex items-center justify-center shadow-[0_8px_40px_rgba(124,58,237,0.45)] hover:shadow-[0_12px_60px_rgba(124,58,237,0.6)] hover:scale-110 active:scale-95 transition-all duration-300 border-4 border-white">
                  <Mic size={44} className="text-white" strokeWidth={2} />
                </button>
                <p className="text-gray-400 text-sm font-medium">Toque para gravar</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['"Reunião amanhã 10h"', '"Gastei 50 no almoço"', '"Ligar pro João"'].map((ex) => (
                    <span key={ex} className="text-xs bg-gray-50 border border-gray-200 text-gray-500 px-3 py-1 rounded-full">{ex}</span>
                  ))}
                </div>
              </>
            )}

            {state === "recording" && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-red-100 animate-ping" />
                  <button onClick={stopRecording} className="relative w-28 h-28 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-[0_8px_40px_rgba(239,68,68,0.4)] recording-pulse border-4 border-white">
                    <MicOff size={44} className="text-white" strokeWidth={2} />
                  </button>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-red-500 font-bold text-sm">Gravando...</span>
                  </div>
                  <span className="text-gray-400 text-sm tabular-nums">
                    {String(Math.floor(duration / 60)).padStart(2,"0")}:{String(duration % 60).padStart(2,"0")}
                  </span>
                </div>
                <div className="flex gap-1 h-8 items-center">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="w-1 rounded-full bg-gradient-to-t from-violet-500 to-cyan-400 animate-pulse"
                      style={{ height: `${Math.random() * 28 + 4}px`, animationDelay: `${i * 0.05}s` }} />
                  ))}
                </div>
              </>
            )}

            {state === "processing" && (
              <>
                <div className="w-28 h-28 rounded-full bg-violet-50 border-2 border-violet-200 flex items-center justify-center">
                  <Loader2 size={44} className="text-violet-600 animate-spin" />
                </div>
                <div className="text-center">
                  <p className="text-violet-700 font-bold">Processando com IA...</p>
                  <p className="text-gray-400 text-sm">Transcrevendo e interpretando</p>
                </div>
              </>
            )}

            {state === "done" && result && (
              <>
                <div className="w-24 h-24 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
                  <CheckCircle size={44} className="text-emerald-500" />
                </div>
                <div className="w-full space-y-3">
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                    <p className="text-xs text-gray-400 mb-1 font-medium">Transcrito:</p>
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
                <Button onClick={onClose} className="w-full">Fechar</Button>
              </>
            )}

            {state === "error" && (
              <>
                <div className="w-24 h-24 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center">
                  <X size={44} className="text-red-400" />
                </div>
                <p className="text-red-500 text-center font-medium">Erro ao processar. Tente novamente.</p>
                <Button onClick={() => setState("idle")} variant="secondary">Tentar novamente</Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
