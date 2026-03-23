import { useNavigate } from "react-router-dom";
import { Sparkles, Zap, Shield, MessageSquare, ArrowRight, Bot, Star, Check, Wand2, Code, Image, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

const Landing = () => {
  const navigate = useNavigate();
  const { t, toggleLang, lang } = useLanguage();

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
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <Globe className="h-3.5 w-3.5" />
              {t("lang_switch")}
            </button>
            <Button variant="ghost" onClick={() => navigate("/login")}>
              {t("nav_login")}
            </Button>
            <Button onClick={() => navigate("/login")} className="gap-2">
              {t("nav_start")} <ArrowRight className="h-4 w-4" />
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
            {t("hero_badge")}
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            {t("hero_title_1")}{" "}
            <span className="text-primary">{t("hero_title_2")}</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10">
            {t("hero_desc")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={() => navigate("/login")} className="text-base px-8 py-6 gap-2 shadow-lg shadow-primary/20">
              {t("hero_cta")} <ArrowRight className="h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              className="text-base px-8 py-6"
            >
              {t("hero_discover")}
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
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t("features_title")}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t("features_desc")}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: MessageSquare, title: t("feat1_title"), desc: t("feat1_desc") },
              { icon: Zap, title: t("feat2_title"), desc: t("feat2_desc") },
              { icon: Shield, title: t("feat3_title"), desc: t("feat3_desc") },
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

      {/* Smart Prompts */}
      <section className="py-24 px-6 bg-card/50">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t("prompts_title")}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t("prompts_subtitle")}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: feature list */}
            <div className="space-y-8">
              {[
                { icon: Wand2, title: t("prompts_feat1_title"), desc: t("prompts_feat1_desc") },
                { icon: Code, title: t("prompts_feat2_title"), desc: t("prompts_feat2_desc") },
                { icon: Image, title: t("prompts_feat3_title"), desc: t("prompts_feat3_desc") },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: mock prompt UI */}
            <div className="rounded-2xl border border-border bg-background p-6 shadow-xl shadow-primary/5">
              <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">{t("prompts_example")}</p>
              <div className="rounded-xl bg-secondary/60 border border-border p-4 mb-4">
                <p className="text-sm text-foreground">{t("prompts_example_text")}</p>
              </div>
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">{t("prompts_suggestion")}</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "Stability AI", type: "Image", color: "bg-purple-500/15 text-purple-400 border-purple-500/30" },
                  { name: "DALL·E", type: "Image", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
                  { name: "DeepAI", type: "Image", color: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
                ].map((ai) => (
                  <span key={ai.name} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${ai.color}`}>
                    <Image className="h-3 w-3" />
                    {ai.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t("pricing_title")}</h2>
          <p className="text-muted-foreground text-lg mb-12 max-w-xl mx-auto">{t("pricing_desc")}</p>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="rounded-2xl border border-border bg-card p-8 text-left">
              <h3 className="text-lg font-semibold mb-1">Starter</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-extrabold">10€</span>
                <span className="text-muted-foreground">/{lang === "fr" ? "mois" : "mo"}</span>
              </div>
              <ul className="space-y-3 mb-6">
                {[t("pricing_starter_f1"), t("pricing_starter_f2"), t("pricing_starter_f3")].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full" onClick={() => navigate("/login")}>
                {t("pricing_choose")} Starter
              </Button>
            </div>
            <div className="rounded-2xl border-2 border-primary bg-card p-8 text-left relative">
              <div className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
                <Star className="h-3 w-3" /> {t("pricing_popular")}
              </div>
              <h3 className="text-lg font-semibold mb-1">Pro</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-extrabold">25€</span>
                <span className="text-muted-foreground">/{lang === "fr" ? "mois" : "mo"}</span>
              </div>
              <ul className="space-y-3 mb-6">
                {[t("pricing_pro_f1"), t("pricing_pro_f2"), t("pricing_pro_f3")].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button className="w-full" onClick={() => navigate("/login")}>
                {t("pricing_choose")} Pro
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-24 px-6 bg-card/50">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t("cta_title")}</h2>
          <p className="text-muted-foreground text-lg mb-8">{t("cta_desc")}</p>
          <Button size="lg" onClick={() => navigate("/login")} className="text-base px-10 py-6 gap-2 shadow-lg shadow-primary/20">
            {t("cta_button")} <Sparkles className="h-5 w-5" />
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
            <button onClick={() => navigate("/privacy")} className="hover:text-foreground transition-colors">{t("footer_privacy")}</button>
            <button onClick={() => navigate("/terms")} className="hover:text-foreground transition-colors">{t("footer_terms")}</button>
            <button onClick={() => navigate("/company")} className="hover:text-foreground transition-colors">{t("footer_about")}</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
