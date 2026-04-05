import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

const LandingHero = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section className="relative pt-36 pb-28 px-6 lg:px-8">
      {/* Subtle grid */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-primary/6 blur-[140px]" />

      <div className="relative mx-auto max-w-3xl text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-4 py-1.5 text-xs font-medium text-muted-foreground tracking-wide uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          {t("hero_badge")}
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {t("hero_title_1")}{" "}
          <span className="text-gradient">{t("hero_title_2")}</span>
        </h1>

        <p className="mx-auto max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed mb-10">
          {t("hero_desc")}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            size="lg"
            onClick={() => navigate("/login")}
            className="text-sm px-8 py-6 gap-2 rounded-lg font-medium"
          >
            {t("hero_cta")} <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
            className="text-sm px-8 py-6 rounded-lg font-medium border-border/60"
          >
            {t("hero_discover")}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
