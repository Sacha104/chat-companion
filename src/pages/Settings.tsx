import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Coins, Zap, Shield, LogOut, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useCredits } from "@/hooks/useCredits";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { credits, loading: creditsLoading } = useCredits();
  const [changingPassword, setChangingPassword] = useState(false);

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setChangingPassword(true);
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: window.location.origin + "/settings",
    });
    if (error) {
      toast.error("Erreur lors de l'envoi du lien de réinitialisation.");
    } else {
      toast.success("Un lien de réinitialisation a été envoyé à votre adresse e-mail.");
    }
    setChangingPassword(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const createdAt = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "–";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-2xl items-center gap-3 px-4">
          <button
            onClick={() => navigate("/chat")}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-secondary transition-colors active:scale-[0.95]"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Réglages</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 space-y-6">
        {/* Profile section */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-card-foreground">Profil</h2>
              <p className="text-xs text-muted-foreground">Informations de votre compte</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="flex items-center gap-3 rounded-xl bg-secondary/50 px-4 py-3">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">E-mail</p>
                <p className="text-sm text-foreground truncate">{user?.email ?? "–"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-secondary/50 px-4 py-3">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">Membre depuis</p>
                <p className="text-sm text-foreground">{createdAt}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Credits section */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
              <Coins className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-card-foreground">Crédits</h2>
              <p className="text-xs text-muted-foreground">Votre solde et tarification</p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-secondary/50 px-4 py-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">Solde actuel</p>
              <p className="text-2xl font-bold text-foreground tabular-nums">
                {creditsLoading ? "…" : credits ?? 0}
                <span className="ml-1.5 text-sm font-normal text-muted-foreground">crédits</span>
              </p>
            </div>
            <button
              onClick={() => navigate("/pricing")}
              className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.96]"
            >
              <Zap className="h-4 w-4" />
              Recharger
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-border bg-background px-3 py-3 text-center">
              <p className="text-lg font-bold text-foreground tabular-nums">1</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">crédit / texte</p>
            </div>
            <div className="rounded-xl border border-border bg-background px-3 py-3 text-center">
              <p className="text-lg font-bold text-foreground tabular-nums">2</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">crédits / image</p>
            </div>
            <div className="rounded-xl border border-border bg-background px-3 py-3 text-center">
              <p className="text-lg font-bold text-foreground tabular-nums">5</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">crédits / vidéo</p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Chaque rédaction de prompt coûte également 1 crédit.
          </p>
        </section>

        {/* Security section */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-card-foreground">Sécurité</h2>
              <p className="text-xs text-muted-foreground">Gérez votre mot de passe</p>
            </div>
          </div>

          <button
            onClick={handlePasswordReset}
            disabled={changingPassword}
            className="w-full rounded-xl border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary active:scale-[0.98] disabled:opacity-50"
          >
            {changingPassword ? "Envoi en cours…" : "Réinitialiser le mot de passe"}
          </button>
        </section>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 active:scale-[0.98]"
        >
          <LogOut className="h-4 w-4" />
          Se déconnecter
        </button>
      </main>
    </div>
  );
};

export default Settings;
