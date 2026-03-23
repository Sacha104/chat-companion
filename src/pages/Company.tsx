import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, FileText, Scale } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const Company = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-6 py-4">
          <button
            onClick={() => navigate("/chat")}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-secondary transition-colors active:scale-[0.95]"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">{t("company_title")}</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        <p className="text-sm text-muted-foreground leading-relaxed mb-8">{t("company_desc")}</p>

        <div className="space-y-3">
          <button
            onClick={() => navigate("/privacy")}
            className="group flex w-full items-center gap-4 rounded-xl border border-border bg-card p-5 text-left transition-all hover:shadow-lg hover:shadow-black/5 hover:border-primary/20 active:scale-[0.98]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Shield className="h-5 w-5 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground">{t("company_privacy")}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{t("company_privacy_desc")}</p>
            </div>
          </button>

          <button
            onClick={() => navigate("/terms")}
            className="group flex w-full items-center gap-4 rounded-xl border border-border bg-card p-5 text-left transition-all hover:shadow-lg hover:shadow-black/5 hover:border-primary/20 active:scale-[0.98]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <Scale className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground">{t("company_terms")}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{t("company_terms_desc")}</p>
            </div>
          </button>

          <div className="mt-8 rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">{t("company_security")}</h3>
            </div>
            <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-5">
              <li>{t("company_sec1")}</li>
              <li>{t("company_sec2")}</li>
              <li>{t("company_sec3")}</li>
              <li>{t("company_sec4")}</li>
              <li>{t("company_sec5")}</li>
              <li>{t("company_sec6")}</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Company;
