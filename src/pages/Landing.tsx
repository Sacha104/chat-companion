import { useNavigate } from "react-router-dom";
import { Sparkles, Zap, Shield, MessageSquare, ArrowRight, Bot, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">Chat Companion</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Connexion
            </Button>
            <Button onClick={() => navigate("/login")} className="gap-2">
              Commencer <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <Zap className="h-3.5 w-3.5" />
            5 crédits offerts à l'inscription
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Toutes les IA,{" "}
            <span className="text-primary">un seul endroit.</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10">
            Accédez à ChatGPT, Claude, Gemini, Grok et bien d'autres depuis une
            interface unique. Générez du texte, du code, des images et des vidéos
            sans jongler entre les plateformes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => navigate("/login")}
              className="text-base px-8 py-6 gap-2 shadow-lg shadow-primary/20"
            >
              Créer un compte gratuit <ArrowRight className="h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-base px-8 py-6"
            >
              Découvrir
            </Button>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-12 border-y border-border/50">
        <div className="mx-auto max-w-4xl flex flex-wrap items-center justify-center gap-8 px-6 text-muted-foreground">
          {["OpenAI GPT", "Claude", "Gemini", "Grok", "Mistral", "DALL·E"].map((name) => (
            <div key={name} className="flex items-center gap-2 text-sm font-medium opacity-60 hover:opacity-100 transition-opacity">
              <Bot className="h-4 w-4" />
              {name}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Pourquoi choisir Chat Companion ?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour exploiter la puissance de l'IA au quotidien.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: MessageSquare,
                title: "Multi-IA unifié",
                desc: "Accédez à GPT, Claude, Gemini, Grok et plus encore depuis une seule conversation.",
              },
              {
                icon: Zap,
                title: "Rapide & simple",
                desc: "Interface fluide, réponses instantanées. Pas besoin de compte sur chaque plateforme.",
              },
              {
                icon: Shield,
                title: "Données sécurisées",
                desc: "Vos conversations restent privées. Authentification sécurisée et chiffrement des données.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group rounded-2xl border border-border bg-card p-8 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="py-24 px-6 bg-card/50">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Des tarifs simples
          </h2>
          <p className="text-muted-foreground text-lg mb-12 max-w-xl mx-auto">
            Commencez gratuitement avec 5 crédits offerts, puis choisissez le plan qui vous convient.
          </p>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Starter */}
            <div className="rounded-2xl border border-border bg-card p-8 text-left">
              <h3 className="text-lg font-semibold mb-1">Starter</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-extrabold">10€</span>
                <span className="text-muted-foreground">/mois</span>
              </div>
              <ul className="space-y-3 mb-6">
                {["100 crédits / mois", "Tous les modèles IA", "Historique illimité"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full" onClick={() => navigate("/login")}>
                Choisir Starter
              </Button>
            </div>
            {/* Pro */}
            <div className="rounded-2xl border-2 border-primary bg-card p-8 text-left relative">
              <div className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
                <Star className="h-3 w-3" /> Populaire
              </div>
              <h3 className="text-lg font-semibold mb-1">Pro</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-extrabold">25€</span>
                <span className="text-muted-foreground">/mois</span>
              </div>
              <ul className="space-y-3 mb-6">
                {["300 crédits / mois", "Tous les modèles IA", "Support prioritaire"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button className="w-full" onClick={() => navigate("/login")}>
                Choisir Pro
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Prêt à essayer ?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Créez votre compte en 30 secondes et recevez 5 crédits offerts pour tester toutes les IA.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/login")}
            className="text-base px-10 py-6 gap-2 shadow-lg shadow-primary/20"
          >
            Commencer maintenant <Sparkles className="h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Chat Companion © {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6">
            <button onClick={() => navigate("/privacy")} className="hover:text-foreground transition-colors">
              Confidentialité
            </button>
            <button onClick={() => navigate("/terms")} className="hover:text-foreground transition-colors">
              CGU
            </button>
            <button onClick={() => navigate("/company")} className="hover:text-foreground transition-colors">
              À propos
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
