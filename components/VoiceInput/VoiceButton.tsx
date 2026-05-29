"use client";
import { useState, useRef, useCallback } from "react";
import { Mic, MicOff, X, CheckCircle, Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

interface VoiceButtonProps {
  onClose: () => void;
}

type State = "idle" | "recording" | "processing" | "done" | "error";

interface Result {
  transcription: string;
  action: string;
  summary: string;
}

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
        const transcribeRes = await fetch("/api/transcribe", { method: "POST", body: formData });
        const { transcription } = await transcribeRes.json();
        const processRes = await fetch("/api/ai-process", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcription }),
        });
        const { action, summary } = await processRes.json();
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

  const actionLabels: Record<string, { label: string; color: string }> = {
    task: { label: "Tarefa criada", color: "text-purple-400" },
    event: { label: "Evento adicionado", color: "text-blue-400" },
    financial: { label: "Transação lançada", color: "text-emerald-400" },
    note: { label: "Nota salva", color: "text-yellow-400" },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-sm glass-card border border-purple-500/30 shadow-[0_0_80px_rgba(124,58,237,0.3)] rounded-t-3xl p-6 pb-10">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white p-1">
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <h3 className="text-xl font-black text-gradient mb-1">Assistente de Voz</h3>
          <p className="text-sm text-gray-400">Fale uma tarefa, evento ou gasto</p>
        </div>

        <div className="flex flex-col items-center gap-6">
          {state === "idle" && (
            <>
              <button
                onClick={startRecording}
                className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 flex items-center justify-center shadow-[0_0_50px_rgba(124,58,237,0.6)] hover:shadow-[0_0_80px_rgba(124,58,237,0.8)] transition-all duration-300 hover:scale-110 active:scale-95"
              >
                <Mic size={48} className="text-white" />
              </button>
              <p className="text-gray-400 text-sm">Toque para gravar</p>
            </>
          )}

          {state === "recording" && (
            <>
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
                <button
                  onClick={stopRecording}
                  className="relative w-28 h-28 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.6)] recording-pulse"
                >
                  <MicOff size={48} className="text-white" />
                </button>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-red-400 font-semibold">Gravando...</span>
                </div>
                <span className="text-gray-500 text-sm">
                  {String(Math.floor(duration / 60)).padStart(2, "0")}:{String(duration % 60).padStart(2, "0")}
                </span>
              </div>
              <div className="flex gap-1 h-8 items-center">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-purple-500 rounded-full animate-pulse"
                    style={{
                      height: `${Math.random() * 28 + 4}px`,
                      animationDelay: `${i * 0.05}s`,
                    }}
                  />
                ))}
              </div>
            </>
          )}

          {state === "processing" && (
            <>
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-500/30 flex items-center justify-center">
                <Loader2 size={48} className="text-purple-400 animate-spin" />
              </div>
              <div className="text-center">
                <p className="text-purple-300 font-semibold">Processando com IA...</p>
                <p className="text-gray-500 text-sm">Transcrevendo e interpretando</p>
              </div>
            </>
          )}

          {state === "done" && result && (
            <>
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-900/50 to-cyan-900/50 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle size={44} className="text-emerald-400" />
              </div>
              <div className="w-full space-y-3">
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <p className="text-xs text-gray-500 mb-1">Transcrito:</p>
                  <p className="text-sm text-gray-200 italic">&ldquo;{result.transcription}&rdquo;</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Wand2 size={14} className="text-purple-400" />
                    <span className={`text-xs font-semibold ${actionLabels[result.action]?.color || "text-purple-400"}`}>
                      {actionLabels[result.action]?.label || "Criado"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-200">{result.summary}</p>
                </div>
              </div>
              <Button onClick={onClose} className="w-full">Fechar</Button>
            </>
          )}

          {state === "error" && (
            <>
              <div className="w-24 h-24 rounded-full bg-red-900/30 border border-red-500/30 flex items-center justify-center">
                <X size={44} className="text-red-400" />
              </div>
              <p className="text-red-400 text-center">Erro ao processar. Tente novamente.</p>
              <Button onClick={() => setState("idle")} variant="secondary">Tentar novamente</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
