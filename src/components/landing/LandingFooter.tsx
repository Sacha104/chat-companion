import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";

const LandingFooter = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border/30 py-8 px-6 lg:px-8">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <span className="font-medium tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Pr@mpt © {new Date().getFullYear()}
        </span>
        <div className="flex gap-6">
          <button onClick={() => navigate("/privacy")} className="hover:text-foreground transition-colors">{t("footer_privacy")}</button>
          <button onClick={() => navigate("/terms")} className="hover:text-foreground transition-colors">{t("footer_terms")}</button>
          <button onClick={() => navigate("/company")} className="hover:text-foreground transition-colors">{t("footer_about")}</button>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
