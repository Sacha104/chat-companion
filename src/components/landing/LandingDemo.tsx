import { Wand2, Code, Image } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const LandingDemo = () => {
  const { t } = useLanguage();

  const steps = [
    { icon: Wand2, title: t("prompts_feat1_title"), desc: t("prompts_feat1_desc") },
    { icon: Code, title: t("prompts_feat2_title"), desc: t("prompts_feat2_desc") },
    { icon: Image, title: t("prompts_feat3_title"), desc: t("prompts_feat3_desc") },
  ];

  return (
    <section className="py-28 px-6 lg:px-8 border-t border-border/30">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <p className="text-xs font-medium tracking-widest uppercase text-primary mb-3">{t("prompts_title")}</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight max-w-2xl mx-auto" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {t("prompts_subtitle")}
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Steps */}
          <div className="space-y-8">
            {steps.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary text-xs font-bold">
                    {i + 1}
                  </div>
                  {i < steps.length - 1 && <div className="w-px flex-1 bg-border/40 mt-2" />}
                </div>
                <div className="pb-6">
                  <h3 className="text-sm font-semibold mb-1 tracking-tight">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Mock prompt card */}
          <div className="rounded-xl border border-border/50 bg-card/80 overflow-hidden">
            <div className="border-b border-border/30 px-5 py-3 flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
              <span className="ml-3 text-xs text-muted-foreground font-medium">Tornado</span>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-[10px] font-medium text-muted-foreground mb-2 uppercase tracking-widest">{t("prompts_example")}</p>
                <div className="rounded-lg bg-secondary/50 border border-border/30 p-3.5">
                  <p className="text-sm text-foreground/80">{t("prompts_example_text")}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-medium text-primary mb-2 uppercase tracking-widest flex items-center gap-1.5">
                  <Wand2 className="h-3 w-3" />
                  {t("prompts_optimized")}
                </p>
                <div className="rounded-lg bg-primary/5 border border-primary/15 p-3.5">
                  <p className="text-xs text-foreground/70 font-mono leading-relaxed">{t("prompts_optimized_text")}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-medium text-muted-foreground mb-2 uppercase tracking-widest">{t("prompts_suggestion")}</p>
                <div className="flex flex-wrap gap-1.5">
                  {["DeepAI", "OpenAI GPT", "RunwayML"].map((name) => (
                    <span key={name} className="inline-flex items-center rounded-md border border-border/40 bg-secondary/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingDemo;
