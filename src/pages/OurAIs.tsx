import { useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, MessageSquare, Code, Image, Video } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface AIProvider {
  id: string;
  name: string;
  descKey: string;
  logoUrl: string;
  type: "text" | "code" | "image" | "video";
  website: string;
}

const providers: AIProvider[] = [
  { id: "openai", name: "OpenAI GPT", descKey: "ai_openai", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/OpenAI_Logo.svg/512px-OpenAI_Logo.svg.png", type: "text", website: "https://openai.com" },
  { id: "anthropic", name: "Claude (Anthropic)", descKey: "ai_anthropic", logoUrl: "https://anthropic.com/images/icons/apple-touch-icon.png", type: "text", website: "https://anthropic.com" },
  { id: "gemini", name: "Google Gemini", descKey: "ai_gemini", logoUrl: "https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690b6.svg", type: "text", website: "https://deepmind.google/technologies/gemini/" },
  { id: "mistral", name: "Mistral AI", descKey: "ai_mistral", logoUrl: "https://mistral.ai/images/logo_hugging_face.png", type: "text", website: "https://mistral.ai" },
  { id: "deepseek", name: "DeepSeek Coder", descKey: "ai_deepseek", logoUrl: "https://avatars.githubusercontent.com/u/148330874?s=200&v=4", type: "code", website: "https://deepseek.com" },
  { id: "stability", name: "Stability AI", descKey: "ai_stability", logoUrl: "https://images.crunchbase.com/image/upload/c_pad,f_auto,q_auto:eco,dpr_1/rglsmdkulmbxo6dq0trv", type: "image", website: "https://stability.ai" },
  { id: "deepai", name: "DeepAI", descKey: "ai_deepai", logoUrl: "https://deepai.org/static/images/logo.svg", type: "image", website: "https://deepai.org" },
  { id: "leonardo", name: "Leonardo AI", descKey: "ai_leonardo", logoUrl: "https://avatars.githubusercontent.com/u/122753895?s=200&v=4", type: "image", website: "https://leonardo.ai" },
  { id: "runwayml", name: "RunwayML", descKey: "ai_runwayml", logoUrl: "https://avatars.githubusercontent.com/u/43209968?s=200&v=4", type: "video", website: "https://runwayml.com" },
  { id: "kling", name: "Kling AI", descKey: "ai_kling", logoUrl: "https://klingai.com/favicon.ico", type: "video", website: "https://klingai.com" },
  { id: "hailuo", name: "Hailuo AI", descKey: "ai_hailuo", logoUrl: "https://hailuoai.com/favicon.ico", type: "video", website: "https://hailuoai.com" },
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
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary p-2">
                    <img
                      src={provider.logoUrl}
                      alt={provider.name}
                      className="h-8 w-8 object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
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
