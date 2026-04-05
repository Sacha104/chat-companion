import { PenTool, MessageSquare, Shield } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const LandingFeatures = () => {
  const { t } = useLanguage();

  const features = [
    { icon: PenTool, title: t("feat1_title"), desc: t("feat1_desc") },
    { icon: MessageSquare, title: t("feat2_title"), desc: t("feat2_desc") },
    { icon: Shield, title: t("feat3_title"), desc: t("feat3_desc") },
  ];

  return (
    <section id="features" className="py-28 px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <p className="text-xs font-medium tracking-widest uppercase text-primary mb-3">{t("features_title")}</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {t("features_desc")}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group rounded-xl border border-border/50 bg-card/50 p-8 hover:border-primary/30 hover:bg-card transition-all duration-300"
            >
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/8 text-primary">
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-semibold mb-2 tracking-tight">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingFeatures;
