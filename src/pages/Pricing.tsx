import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ArrowLeft, Loader2, Crown } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { PLANS, type PlanKey, getPlanByProductId } from "@/lib/plans";

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState<PlanKey | null>(null);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  const [checkingSubscription, setCheckingSubscription] = useState(true);

  useEffect(() => {
    const checkSub = async () => {
      if (!user) { setCheckingSubscription(false); return; }
      try {
        const { data, error } = await supabase.functions.invoke("check-subscription");
        if (!error && data?.subscribed) {
          setCurrentProductId(data.product_id);
        }
      } catch { /* ignore */ }
      setCheckingSubscription(false);
    };
    checkSub();
  }, [user]);

  const handleCheckout = async (planKey: PlanKey) => {
    if (!user) { navigate("/login"); return; }
    setLoading(planKey);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId: PLANS[planKey].price_id },
      });
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (e: any) {
      toast.error(e.message || "Error");
    } finally {
      setLoading(null);
    }
  };

  const handleManage = async () => {
    setLoading("starter");
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (e: any) {
      toast.error(e.message || "Error");
    } finally {
      setLoading(null);
    }
  };

  const currentPlan = currentProductId ? getPlanByProductId(currentProductId) : null;

  const plans: { key: PlanKey; features: string[] }[] = [
    {
      key: "starter",
      features: [t("pricing_starter_f1"), t("pricing_feat_providers"), t("pricing_feat_history"), t("pricing_feat_email")],
    },
    {
      key: "pro",
      features: [t("pricing_pro_f1"), t("pricing_feat_providers"), t("pricing_feat_history"), t("pricing_feat_priority"), t("pricing_feat_early")],
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center gap-3 px-6 py-4 border-b border-border">
        <button
          onClick={() => navigate("/chat")}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary transition-colors active:scale-[0.95]"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">{t("pricing_page_title")}</h1>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl w-full">
          {plans.map(({ key, features }) => {
            const plan = PLANS[key];
            const isCurrent = currentPlan?.product_id === plan.product_id;
            const isPopular = key === "pro";

            return (
              <div
                key={key}
                className={`relative rounded-2xl border p-6 flex flex-col transition-shadow hover:shadow-lg ${
                  isPopular ? "border-primary shadow-md shadow-primary/10" : "border-border"
                } ${isCurrent ? "ring-2 ring-primary/40" : ""}`}
              >
                {isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[11px] font-semibold text-primary-foreground">
                    {t("pricing_popular")}
                  </span>
                )}
                {isCurrent && (
                  <span className="absolute -top-3 right-4 rounded-full bg-primary px-3 py-0.5 text-[11px] font-semibold text-primary-foreground flex items-center gap-1">
                    <Crown className="h-3 w-3" /> {t("pricing_current")}
                  </span>
                )}

                <h2 className="text-xl font-bold text-foreground">{plan.name}</h2>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tracking-tight text-foreground">{plan.price}€</span>
                  <span className="text-sm text-muted-foreground">{t("pricing_month")}</span>
                </div>

                <ul className="mt-6 space-y-3 flex-1">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => (isCurrent ? handleManage() : handleCheckout(key))}
                  disabled={!!loading || checkingSubscription}
                  className={`mt-6 w-full rounded-xl py-2.5 text-sm font-semibold transition-colors active:scale-[0.97] disabled:opacity-50 ${
                    isPopular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {loading === key ? (
                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                  ) : isCurrent ? (
                    t("pricing_manage")
                  ) : (
                    t("pricing_subscribe")
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
