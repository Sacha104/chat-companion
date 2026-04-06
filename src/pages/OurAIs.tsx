import { useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, MessageSquare, Code, Image, Video } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

import openaiLogo from "@/assets/logos/openai.png";
import anthropicLogo from "@/assets/logos/anthropic.png";
import geminiLogo from "@/assets/logos/gemini.png";
import mistralLogo from "@/assets/logos/mistral.png";
import deepseekLogo from "@/assets/logos/deepseek.png";
import stabilityLogo from "@/assets/logos/stability.png";
import deepaiLogo from "@/assets/logos/deepai.png";
import leonardoLogo from "@/assets/logos/leonardo.png";
import runwaymlLogo from "@/assets/logos/runwayml.png";
import klingLogo from "@/assets/logos/kling.png";
import hailuoLogo from "@/assets/logos/hailuo.png";

interface AIProvider {
  id: string;
  name: string;
  descKey: string;
  logoUrl: string;
  type: "text" | "code" | "image" | "video";
  website: string;
}

const providers: AIProvider[] = [
  { id: "openai", name: "OpenAI GPT", descKey: "ai_openai", logoUrl: openaiLogo, type: "text", website: "https://openai.com" },
  { id: "anthropic", name: "Claude (Anthropic)", descKey: "ai_anthropic", logoUrl: anthropicLogo, type: "text", website: "https://anthropic.com" },
  { id: "gemini", name: "Google Gemini", descKey: "ai_gemini", logoUrl: geminiLogo, type: "text", website: "https://deepmind.google/technologies/gemini/" },
  { id: "mistral", name: "Mistral AI", descKey: "ai_mistral", logoUrl: mistralLogo, type: "text", website: "https://mistral.ai" },
  { id: "deepseek", name: "DeepSeek Coder", descKey: "ai_deepseek", logoUrl: deepseekLogo, type: "code", website: "https://deepseek.com" },
  { id: "stability", name: "Stability AI", descKey: "ai_stability", logoUrl: stabilityLogo, type: "image", website: "https://stability.ai" },
  { id: "deepai", name: "DeepAI", descKey: "ai_deepai", logoUrl: deepaiLogo, type: "image", website: "https://deepai.org" },
  { id: "leonardo", name: "Leonardo AI", descKey: "ai_leonardo", logoUrl: leonardoLogo, type: "image", website: "https://leonardo.ai" },
  { id: "runwayml", name: "RunwayML", descKey: "ai_runwayml", logoUrl: runwaymlLogo, type: "video", website: "https://runwayml.com" },
  { id: "kling", name: "Kling AI", descKey: "ai_kling", logoUrl: klingLogo, type: "video", website: "https://klingai.com" },
  { id: "hailuo", name: "Hailuo AI", descKey: "ai_hailuo", logoUrl: hailuoLogo, type: "video", website: "https://hailuoai.com" },
];

const OurAIs = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const typeConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
    text: { label: t("ais_text"), icon: <MessageSquare className="h-3.5 w-3.5" />, color: "bg-blue-500/15 text-blue-400" },
    code: { label: t("ais_code"), icon: <Code className="h-3.5 w-3.5" />, color: "bg-emerald-500/15 text-emerald-400" },
    image: { label: t("ais_image"), icon: <Image className="h-3.5 w-3.5" />, color: "bg-amber-500/15 text-amber-400" },
    video: { label: t("ais_video"), icon: <Video className="h-3.5 w-3.5" />, color: "bg-rose-500/15 text-rose-400" },
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-4">
          <button
            onClick={() => navigate("/chat")}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-secondary transition-colors active:scale-[0.95]"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-foreground">{t("ais_title")}</h1>
            <p className="text-xs text-muted-foreground">
              {providers.length} {t("ais_subtitle")}
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {providers.map((provider, i) => {
            const tc = typeConfig[provider.type];
            return (
              <div
                key={provider.id}
                className="group relative flex flex-col rounded-2xl border border-border bg-card p-5 transition-all hover:shadow-lg hover:shadow-black/5 hover:border-primary/20 active:scale-[0.98]"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <div className="mb-4 flex items-start justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 p-2.5">
                    <img
                      src={provider.logoUrl}
                      alt={provider.name}
                      className="h-10 w-10 object-contain drop-shadow-md"
                      loading="lazy"
                      width={40}
                      height={40}
                    />
                  </div>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${tc.color}`}>
                    {tc.icon}
                    {tc.label}
                  </span>
                </div>

                <h3 className="mb-1 text-sm font-semibold text-foreground">{provider.name}</h3>
                <p className="mb-4 flex-1 text-xs leading-relaxed text-muted-foreground">
                  {t(provider.descKey as any)}
                </p>

                <a
                  href={provider.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium text-primary hover:underline"
                >
                  {t("ais_visit")}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default OurAIs;
