import { useNavigate } from "react-router-dom";
import { ArrowRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import LandingHero from "@/components/landing/LandingHero";
import LandingLogos from "@/components/landing/LandingLogos";
import LandingFeatures from "@/components/landing/LandingFeatures";
import LandingDemo from "@/components/landing/LandingDemo";
import LandingPricing from "@/components/landing/LandingPricing";
import LandingCTA from "@/components/landing/LandingCTA";
import LandingFooter from "@/components/landing/LandingFooter";

const Landing = () => {
  const navigate = useNavigate();
  const { t, toggleLang } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8 py-4">
          <span className="text-lg font-semibold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Tornado
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Globe className="h-3.5 w-3.5" />
              {t("lang_switch")}
            </button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/login")} className="text-muted-foreground hover:text-foreground">
              {t("nav_login")}
            </Button>
            <Button size="sm" onClick={() => navigate("/login")} className="gap-1.5">
              {t("nav_start")} <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </nav>

      <LandingHero />
      <LandingLogos />
      <LandingFeatures />
      <LandingDemo />
      <LandingPricing />
      <LandingCTA />
      <LandingFooter />
    </div>
  );
};

export default Landing;
