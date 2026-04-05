import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

const LandingCTA = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section className="py-28 px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {t("cta_title")}
        </h2>
        <p className="text-muted-foreground text-base mb-8 max-w-lg mx-auto">
          {t("cta_desc")}
        </p>
        <Button size="lg" onClick={() => navigate("/login")} className="text-sm px-10 py-6 gap-2 rounded-lg font-medium">
          {t("cta_button")} <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
};

export default LandingCTA;
