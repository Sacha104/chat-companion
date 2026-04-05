import { useState } from "react";
import { Wand2, Code, Image, Video, Type, Loader2, Paperclip } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Attachment } from "@/components/ChatInput";

interface AiSuggestion {
  provider: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  type: "text" | "code" | "image" | "video";
  supportsAttachments?: boolean;
}

const ALL_PROVIDERS: AiSuggestion[] = [
  { provider: "openai", label: "OpenAI GPT", description: "Texte & code polyvalent", icon: <Type className="h-4 w-4" />, type: "text", supportsAttachments: true },
  { provider: "anthropic", label: "Claude", description: "Raisonnement & analyse", icon: <Type className="h-4 w-4" />, type: "text", supportsAttachments: true },
  { provider: "gemini", label: "Google Gemini", description: "Multimodal & rapide", icon: <Type className="h-4 w-4" />, type: "text", supportsAttachments: true },
  { provider: "mistral", label: "Mistral AI", description: "IA française performante", icon: <Type className="h-4 w-4" />, type: "text", supportsAttachments: false },
  { provider: "deepseek", label: "DeepSeek Coder", description: "Spécialisé code", icon: <Code className="h-4 w-4" />, type: "code", supportsAttachments: false },
  { provider: "stability", label: "Stability AI", description: "Génération d'images HD", icon: <Image className="h-4 w-4" />, type: "image", supportsAttachments: false },
  { provider: "deepai", label: "DeepAI", description: "Images rapides", icon: <Image className="h-4 w-4" />, type: "image", supportsAttachments: false },
  { provider: "runwayml", label: "RunwayML", description: "Vidéo & animation", icon: <Video className="h-4 w-4" />, type: "video", supportsAttachments: false },
  { provider: "kling", label: "Kling AI", description: "Vidéo IA avancée", icon: <Video className="h-4 w-4" />, type: "video", supportsAttachments: false },
];

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

function suggestProviders(prompt: string, hasAttachments: boolean): AiSuggestion[] {
  const lower = prompt.toLowerCase();
  const suggestions: AiSuggestion[] = [];

  // If attachments are present, prioritize multimodal providers
  if (hasAttachments) {
    suggestions.push(
      ALL_PROVIDERS.find(p => p.provider === "gemini")!,
      ALL_PROVIDERS.find(p => p.provider === "openai")!,
      ALL_PROVIDERS.find(p => p.provider === "anthropic")!,
    );
  }

  const hasImage = /\b(image|photo|illustration|dessin|logo|picture|icon[eê]?|affiche|poster|artwork)\b/i.test(lower);
  const hasVideo = /\b(vid[eé]o|animation|motion|clip|film|cin[eé]ma)\b/i.test(lower);
  const hasCode = /\b(code|program|script|function|algorithm|api|développ|develop|debug|html|css|javascript|python|react|sql)\b/i.test(lower);

  if (hasImage) {
    const stability = ALL_PROVIDERS.find(p => p.provider === "stability")!;
    const deepai = ALL_PROVIDERS.find(p => p.provider === "deepai")!;
    if (!suggestions.find(s => s.provider === stability.provider)) suggestions.push(stability);
    if (!suggestions.find(s => s.provider === deepai.provider)) suggestions.push(deepai);
  }

  if (hasVideo) {
    const runway = ALL_PROVIDERS.find(p => p.provider === "runwayml")!;
    const kling = ALL_PROVIDERS.find(p => p.provider === "kling")!;
    if (!suggestions.find(s => s.provider === runway.provider)) suggestions.push(runway);
    if (!suggestions.find(s => s.provider === kling.provider)) suggestions.push(kling);
  }

  if (hasCode) {
    const deepseek = ALL_PROVIDERS.find(p => p.provider === "deepseek")!;
    const openai = ALL_PROVIDERS.find(p => p.provider === "openai")!;
    const anthropic = ALL_PROVIDERS.find(p => p.provider === "anthropic")!;
    if (!suggestions.find(s => s.provider === deepseek.provider)) suggestions.push(deepseek);
    if (!suggestions.find(s => s.provider === openai.provider)) suggestions.push(openai);
    if (!suggestions.find(s => s.provider === anthropic.provider)) suggestions.push(anthropic);
  }

  if (suggestions.length === 0) {
    suggestions.push(
      ALL_PROVIDERS.find(p => p.provider === "openai")!,
      ALL_PROVIDERS.find(p => p.provider === "anthropic")!,
      ALL_PROVIDERS.find(p => p.provider === "gemini")!,
      ALL_PROVIDERS.find(p => p.provider === "mistral")!,
    );
  }

  for (const p of ALL_PROVIDERS) {
    if (!suggestions.find(s => s.provider === p.provider)) {
      suggestions.push(p);
    }
  }

  return suggestions.slice(0, 6);
}

interface PromptExecutorProps {
  prompt: string;
  attachments?: Attachment[];
  onExecutionResult: (result: ExecutionResult) => void;
  onExecutionComplete?: (result: ExecutionResult) => void;
  onCreditsChanged?: () => void;
}

export interface ExecutionResult {
  provider: string;
  type: "text" | "code" | "image" | "video";
  content?: string;
  imageUrl?: string;
  imageData?: string;
}

const EXECUTE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/execute`;

const PromptExecutor = ({ prompt, attachments, onExecutionResult, onExecutionComplete, onCreditsChanged }: PromptExecutorProps) => {
  const [executing, setExecuting] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  const hasAttachments = (attachments?.length ?? 0) > 0;
  const suggestions = suggestProviders(prompt, hasAttachments);

  const handleExecute = async (suggestion: AiSuggestion) => {
    setSelectedProvider(suggestion.provider);
    setExecuting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        toast.error("Vous devez être connecté pour exécuter une requête.");
        setExecuting(false);
        return;
      }

      // Prepare attachments as base64 for multimodal providers
      let attachmentData: Array<{ base64: string; mimeType: string; fileName: string }> | undefined;
      if (hasAttachments && suggestion.supportsAttachments) {
        attachmentData = await Promise.all(
          attachments!.map(async (att) => ({
            base64: await fileToBase64(att.file),
            mimeType: att.file.type,
            fileName: att.file.name,
          }))
        );
      }

      const resp = await fetch(EXECUTE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt,
          provider: suggestion.provider,
          attachments: attachmentData,
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Erreur inconnue" }));
        if (resp.status === 402) {
          toast.error("Crédits insuffisants ! Rechargez vos crédits pour continuer.");
          setExecuting(false);
          return;
        }
        throw new Error(err.error || `Erreur ${resp.status}`);
      }

      // Image / non-streaming response
      if (suggestion.type === "image") {
        const data = await resp.json();
        const imageResult: ExecutionResult = {
          provider: suggestion.provider,
          type: "image",
          imageUrl: data.url,
          imageData: data.data,
        };
        onExecutionResult(imageResult);
        onExecutionComplete?.(imageResult);
        setExecuting(false);
        return;
      }

      // Streaming text/code response
      if (!resp.body) throw new Error("Pas de stream");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              fullContent += delta;
              onExecutionResult({
                provider: suggestion.provider,
                type: suggestion.type === "code" ? "code" : "text",
                content: fullContent,
              });
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
      }
      // Notify completion with final content

      if (fullContent) {
        onExecutionComplete?.({
          provider: suggestion.provider,
          type: suggestion.type === "code" ? "code" : "text",
          content: fullContent,
        });
      }
    } catch (e: any) {
      console.error("Execution error:", e);
      onExecutionResult({
        provider: suggestion.provider,
        type: "text",
        content: `❌ Erreur : ${e.message}`,
      });
    } finally {
      setExecuting(false);
      onCreditsChanged?.();
    }
  };

  const typeColors: Record<string, string> = {
    text: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    code: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    image: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    video: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };

  return (
    <div className="mt-3 rounded-xl border border-border bg-secondary/30 p-3 animate-fade-up">
      <div className="flex items-center gap-2 mb-2.5">
        <Wand2 className="h-4 w-4 text-primary" />
        <span className="text-xs font-semibold text-foreground">Exécuter avec une IA</span>
        {hasAttachments && (
          <span className="flex items-center gap-1 text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            <Paperclip className="h-3 w-3" />
            {attachments!.length} fichier{attachments!.length > 1 ? "s" : ""} joint{attachments!.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s.provider}
            disabled={executing}
            onClick={() => handleExecute(s)}
            className={`group flex items-center gap-2 rounded-lg border px-3 py-2 text-left transition-all hover:scale-[1.02] active:scale-[0.97] disabled:opacity-40 ${
              selectedProvider === s.provider && executing
                ? "ring-2 ring-primary/40 bg-primary/10 border-primary/30"
                : `${typeColors[s.type]} hover:brightness-110`
            }`}
          >
            {selectedProvider === s.provider && executing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              s.icon
            )}
            <div>
              <div className="text-xs font-semibold leading-tight">
                {s.label}
                {hasAttachments && s.supportsAttachments && (
                  <Paperclip className="inline h-3 w-3 ml-1 opacity-50" />
                )}
              </div>
              <div className="text-[10px] opacity-60">{s.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PromptExecutor;
