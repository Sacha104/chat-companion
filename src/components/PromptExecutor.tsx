import { useState } from "react";
import { Wand2, Code, Image, Video, Type, Loader2 } from "lucide-react";

interface AiSuggestion {
  provider: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  type: "text" | "code" | "image" | "video";
}

const ALL_PROVIDERS: AiSuggestion[] = [
  { provider: "openai", label: "OpenAI GPT", description: "Texte & code polyvalent", icon: <Type className="h-4 w-4" />, type: "text" },
  { provider: "anthropic", label: "Claude", description: "Raisonnement & analyse", icon: <Type className="h-4 w-4" />, type: "text" },
  { provider: "gemini", label: "Google Gemini", description: "Multimodal & rapide", icon: <Type className="h-4 w-4" />, type: "text" },
  { provider: "mistral", label: "Mistral AI", description: "IA française performante", icon: <Type className="h-4 w-4" />, type: "text" },
  { provider: "deepseek", label: "DeepSeek Coder", description: "Spécialisé code", icon: <Code className="h-4 w-4" />, type: "code" },
  { provider: "stability", label: "Stability AI", description: "Génération d'images HD", icon: <Image className="h-4 w-4" />, type: "image" },
  { provider: "deepai", label: "DeepAI", description: "Images rapides", icon: <Image className="h-4 w-4" />, type: "image" },
  { provider: "runwayml", label: "RunwayML", description: "Vidéo & animation", icon: <Video className="h-4 w-4" />, type: "video" },
  { provider: "kling", label: "Kling AI", description: "Vidéo IA avancée", icon: <Video className="h-4 w-4" />, type: "video" },
];

// Detect which providers are most relevant for a prompt
function suggestProviders(prompt: string): AiSuggestion[] {
  const lower = prompt.toLowerCase();
  const suggestions: AiSuggestion[] = [];

  const hasImage = /\b(image|photo|illustration|dessin|logo|picture|icon[eê]?|affiche|poster|artwork)\b/i.test(lower);
  const hasVideo = /\b(vid[eé]o|animation|motion|clip|film|cin[eé]ma)\b/i.test(lower);
  const hasCode = /\b(code|program|script|function|algorithm|api|développ|develop|debug|html|css|javascript|python|react|sql)\b/i.test(lower);

  if (hasImage) {
    suggestions.push(
      ALL_PROVIDERS.find(p => p.provider === "stability")!,
      ALL_PROVIDERS.find(p => p.provider === "deepai")!,
    );
  }

  if (hasVideo) {
    suggestions.push(ALL_PROVIDERS.find(p => p.provider === "runwayml")!);
  }

  if (hasCode) {
    suggestions.push(
      ALL_PROVIDERS.find(p => p.provider === "deepseek")!,
      ALL_PROVIDERS.find(p => p.provider === "openai")!,
      ALL_PROVIDERS.find(p => p.provider === "anthropic")!,
    );
  }

  // Always suggest text AIs if nothing specific matched or as complement
  if (suggestions.length === 0) {
    suggestions.push(
      ALL_PROVIDERS.find(p => p.provider === "openai")!,
      ALL_PROVIDERS.find(p => p.provider === "anthropic")!,
      ALL_PROVIDERS.find(p => p.provider === "gemini")!,
      ALL_PROVIDERS.find(p => p.provider === "mistral")!,
    );
  }

  // Add remaining if not already present (max 5 shown)
  for (const p of ALL_PROVIDERS) {
    if (!suggestions.find(s => s.provider === p.provider)) {
      suggestions.push(p);
    }
  }

  return suggestions.slice(0, 6);
}

interface PromptExecutorProps {
  prompt: string;
  onExecutionResult: (result: ExecutionResult) => void;
}

export interface ExecutionResult {
  provider: string;
  type: "text" | "code" | "image" | "video";
  content?: string;      // text/code streaming result
  imageUrl?: string;      // image URL or base64
  imageData?: string;     // base64 data
}

const EXECUTE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/execute`;

const PromptExecutor = ({ prompt, onExecutionResult }: PromptExecutorProps) => {
  const [executing, setExecuting] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  const suggestions = suggestProviders(prompt);

  const handleExecute = async (suggestion: AiSuggestion) => {
    setSelectedProvider(suggestion.provider);
    setExecuting(true);

    try {
      const resp = await fetch(EXECUTE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ prompt, provider: suggestion.provider }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Erreur inconnue" }));
        throw new Error(err.error || `Erreur ${resp.status}`);
      }

      // Image / non-streaming response
      if (suggestion.type === "image") {
        const data = await resp.json();
        onExecutionResult({
          provider: suggestion.provider,
          type: "image",
          imageUrl: data.url,
          imageData: data.data,
        });
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
              <div className="text-xs font-semibold leading-tight">{s.label}</div>
              <div className="text-[10px] opacity-60">{s.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PromptExecutor;
