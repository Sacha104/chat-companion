import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "fr" | "en";

const translations = {
  // Nav
  nav_login: { fr: "Connexion", en: "Sign in" },
  nav_start: { fr: "Commencer", en: "Get Started" },

  // Hero
  hero_badge: { fr: "5 crédits offerts à l'inscription", en: "5 free credits on signup" },
  hero_title_1: { fr: "Toutes les IA,", en: "Every AI," },
  hero_title_2: { fr: "un seul endroit.", en: "one place." },
  hero_desc: {
    fr: "Accédez à ChatGPT, Claude, Gemini, Grok et bien d'autres depuis une interface unique. Générez du texte, du code, des images et des vidéos sans jongler entre les plateformes.",
    en: "Access ChatGPT, Claude, Gemini, Grok and many more from a single interface. Generate text, code, images and videos without switching between platforms.",
  },
  hero_cta: { fr: "Créer un compte gratuit", en: "Create a free account" },
  hero_discover: { fr: "Découvrir", en: "Discover" },

  // Features
  features_title: { fr: "Pourquoi choisir Chat Companion ?", en: "Why choose Chat Companion?" },
  features_desc: {
    fr: "Tout ce dont vous avez besoin pour exploiter la puissance de l'IA au quotidien.",
    en: "Everything you need to harness the power of AI every day.",
  },
  feat1_title: { fr: "Multi-IA unifié", en: "Unified Multi-AI" },
  feat1_desc: {
    fr: "Accédez à GPT, Claude, Gemini, Grok et plus encore depuis une seule conversation.",
    en: "Access GPT, Claude, Gemini, Grok and more from a single conversation.",
  },
  feat2_title: { fr: "Rapide & simple", en: "Fast & Simple" },
  feat2_desc: {
    fr: "Interface fluide, réponses instantanées. Pas besoin de compte sur chaque plateforme.",
    en: "Smooth interface, instant responses. No need for an account on each platform.",
  },
  feat3_title: { fr: "Données sécurisées", en: "Secure Data" },
  feat3_desc: {
    fr: "Vos conversations restent privées. Authentification sécurisée et chiffrement des données.",
    en: "Your conversations stay private. Secure authentication and data encryption.",
  },

  // Prompts section
  prompts_title: { fr: "Des prompts intelligents", en: "Smart Prompts" },
  prompts_subtitle: {
    fr: "Notre système analyse votre demande et vous suggère automatiquement la meilleure IA pour y répondre.",
    en: "Our system analyzes your request and automatically suggests the best AI to answer it.",
  },
  prompts_feat1_title: { fr: "Suggestions automatiques", en: "Auto Suggestions" },
  prompts_feat1_desc: {
    fr: "Tapez votre prompt et Chat Companion identifie instantanément les IA les plus adaptées : texte, code, image ou vidéo.",
    en: "Type your prompt and Chat Companion instantly identifies the best-suited AIs: text, code, image or video.",
  },
  prompts_feat2_title: { fr: "Exécution en un clic", en: "One-Click Execution" },
  prompts_feat2_desc: {
    fr: "Sélectionnez l'IA suggérée et obtenez votre résultat sans configuration. Le système gère tout pour vous.",
    en: "Select the suggested AI and get your result without any setup. The system handles everything for you.",
  },
  prompts_feat3_title: { fr: "Tous les formats", en: "All Formats" },
  prompts_feat3_desc: {
    fr: "Texte, code, images HD, vidéos… un seul prompt suffit pour générer du contenu dans tous les formats.",
    en: "Text, code, HD images, videos… a single prompt is enough to generate content in every format.",
  },
  prompts_example: { fr: "Exemple de prompt", en: "Prompt example" },
  prompts_example_text: { fr: "Génère-moi un logo minimaliste pour une startup tech", en: "Generate a minimalist logo for a tech startup" },
  prompts_suggestion: { fr: "IA suggérée :", en: "Suggested AI:" },

  // Pricing
  pricing_title: { fr: "Des tarifs simples", en: "Simple Pricing" },
  pricing_desc: {
    fr: "Commencez gratuitement avec 5 crédits offerts, puis choisissez le plan qui vous convient.",
    en: "Start for free with 5 credits, then choose the plan that suits you.",
  },
  pricing_popular: { fr: "Populaire", en: "Popular" },
  pricing_choose: { fr: "Choisir", en: "Choose" },
  pricing_starter_f1: { fr: "100 crédits / mois", en: "100 credits / month" },
  pricing_starter_f2: { fr: "Tous les modèles IA", en: "All AI models" },
  pricing_starter_f3: { fr: "Historique illimité", en: "Unlimited history" },
  pricing_pro_f1: { fr: "300 crédits / mois", en: "300 credits / month" },
  pricing_pro_f2: { fr: "Tous les modèles IA", en: "All AI models" },
  pricing_pro_f3: { fr: "Support prioritaire", en: "Priority support" },

  // CTA
  cta_title: { fr: "Prêt à essayer ?", en: "Ready to try?" },
  cta_desc: {
    fr: "Créez votre compte en 30 secondes et recevez 5 crédits offerts pour tester toutes les IA.",
    en: "Create your account in 30 seconds and receive 5 free credits to test all AIs.",
  },
  cta_button: { fr: "Commencer maintenant", en: "Start now" },

  // Footer
  footer_privacy: { fr: "Confidentialité", en: "Privacy" },
  footer_terms: { fr: "CGU", en: "Terms" },
  footer_about: { fr: "À propos", en: "About" },

  // Language toggle
  lang_switch: { fr: "EN", en: "FR" },
} as const;

type TranslationKey = keyof typeof translations;

interface LanguageContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem("lang");
    return saved === "en" ? "en" : "fr";
  });

  const toggleLang = () => {
    setLang((prev) => {
      const next = prev === "fr" ? "en" : "fr";
      localStorage.setItem("lang", next);
      return next;
    });
  };

  const t = (key: TranslationKey): string => translations[key][lang];

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
