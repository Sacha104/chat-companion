import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";

const LandingPricing = () => {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();

  const plans = [
    {
      name: "Starter",
      price: "10€",
      features: [t("pricing_starter_f1"), t("pricing_starter_f2"), t("pricing_starter_f3")],
      popular: false,
    },
    {
      name: "Pro",
      price: "25€",
      features: [t("pricing_pro_f1"), t("pricing_pro_f2"), t("pricing_pro_f3")],
      popular: true,
    },
    {
      name: "Expert",
      price: "50€",
      features: [t("pricing_expert_f1"), t("pricing_expert_f2"), t("pricing_expert_f3")],
      popular: false,
    },
  ];

  return (
    <section className="py-28 px-6 lg:px-8 border-t border-border/30">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <p className="text-xs font-medium tracking-widest uppercase text-primary mb-3">{t("pricing_title")}</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {t("pricing_desc")}
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-xl p-8 text-left transition-all ${
                plan.popular
                  ? "border-2 border-primary bg-card shadow-lg"
                  : "border border-border/50 bg-card/50"
              }`}
              style={plan.popular ? { boxShadow: "var(--shadow-glow)" } : undefined}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-6 inline-flex items-center rounded-md bg-primary px-3 py-0.5 text-[11px] font-semibold text-primary-foreground tracking-wide">
                  {t("pricing_popular")}
                </div>
              )}
              <h3 className="text-sm font-semibold text-muted-foreground mb-1 tracking-wide uppercase">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{plan.price}</span>
                <span className="text-sm text-muted-foreground">/{lang === "fr" ? "mois" : "mo"}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" strokeWidth={2} /> {f}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
                onClick={() => navigate("/login")}
              >
                {t("pricing_choose")} {plan.name}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingPricing;
