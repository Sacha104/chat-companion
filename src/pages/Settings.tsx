import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Coins, Zap, Shield, LogOut, Calendar, Sun, Moon, Palette } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useCredits } from "@/hooks/useCredits";
import { useLanguage } from "@/hooks/useLanguage";
import { useTheme } from "@/hooks/useTheme";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { credits, loading: creditsLoading } = useCredits();
  const { t, lang } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [changingPassword, setChangingPassword] = useState(false);

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setChangingPassword(true);
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: window.location.origin + "/settings",
    });
    if (error) {
      toast.error(t("settings_reset_error"));
    } else {
      toast.success(t("settings_reset_success"));
    }
    setChangingPassword(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const createdAt = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "–";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-2xl items-center gap-3 px-4">
          <button
            onClick={() => navigate("/chat")}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-secondary transition-colors active:scale-[0.95]"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">{t("settings_title")}</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 space-y-6">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-card-foreground">{t("settings_profile")}</h2>
              <p className="text-xs text-muted-foreground">{t("settings_profile_desc")}</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="flex items-center gap-3 rounded-xl bg-secondary/50 px-4 py-3">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">{t("settings_email")}</p>
                <p className="text-sm text-foreground truncate">{user?.email ?? "–"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-secondary/50 px-4 py-3">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">{t("settings_member_since")}</p>
                <p className="text-sm text-foreground">{createdAt}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
              <Coins className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-card-foreground">{t("settings_credits")}</h2>
              <p className="text-xs text-muted-foreground">{t("settings_credits_desc")}</p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-secondary/50 px-4 py-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">{t("settings_balance")}</p>
              <p className="text-2xl font-bold text-foreground tabular-nums">
                {creditsLoading ? "…" : credits ?? 0}
                <span className="ml-1.5 text-sm font-normal text-muted-foreground">{t("settings_credits_label")}</span>
              </p>
            </div>
            <button
              onClick={() => navigate("/pricing")}
              className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.96]"
            >
              <Zap className="h-4 w-4" />
              {t("settings_recharge")}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-border bg-background px-3 py-3 text-center">
              <p className="text-lg font-bold text-foreground tabular-nums">1</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{t("settings_credit_text")}</p>
            </div>
            <div className="rounded-xl border border-border bg-background px-3 py-3 text-center">
              <p className="text-lg font-bold text-foreground tabular-nums">2</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{t("settings_credits_image")}</p>
            </div>
            <div className="rounded-xl border border-border bg-background px-3 py-3 text-center">
              <p className="text-lg font-bold text-foreground tabular-nums">5</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{t("settings_credits_video")}</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 mb-2">{t("settings_attachment_title")}</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <p className="text-sm font-bold text-foreground tabular-nums">+1</p>
                <p className="text-[10px] text-muted-foreground">{"< 1 Mo"}</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-foreground tabular-nums">+3</p>
                <p className="text-[10px] text-muted-foreground">1 – 5 Mo</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-foreground tabular-nums">+5</p>
                <p className="text-[10px] text-muted-foreground">5 – 20 Mo</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">{t("settings_credits_note")}</p>
        </section>

        {/* Appearance */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-500/10 text-violet-500">
              <Palette className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-card-foreground">{t("settings_appearance")}</h2>
              <p className="text-xs text-muted-foreground">{t("settings_appearance_desc")}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setTheme("light")}
              className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all active:scale-[0.97] ${
                theme === "light"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-secondary/50 text-muted-foreground hover:bg-secondary"
              }`}
            >
              <Sun className="h-4 w-4" />
              {t("settings_theme_light")}
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all active:scale-[0.97] ${
                theme === "dark"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-secondary/50 text-muted-foreground hover:bg-secondary"
              }`}
            >
              <Moon className="h-4 w-4" />
              {t("settings_theme_dark")}
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-card-foreground">{t("settings_security")}</h2>
              <p className="text-xs text-muted-foreground">{t("settings_security_desc")}</p>
            </div>
          </div>

          <button
            onClick={handlePasswordReset}
            disabled={changingPassword}
            className="w-full rounded-xl border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary active:scale-[0.98] disabled:opacity-50"
          >
            {changingPassword ? t("settings_reset_sending") : t("settings_reset_password")}
          </button>
        </section>

        <button
          onClick={handleSignOut}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 active:scale-[0.98]"
        >
          <LogOut className="h-4 w-4" />
          {t("settings_signout")}
        </button>
      </main>
    </div>
  );
};

export default Settings;
