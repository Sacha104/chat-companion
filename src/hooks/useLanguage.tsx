import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "fr" | "en";

const translations = {
  // Nav
  nav_login: { fr: "Connexion", en: "Sign in" },
  nav_start: { fr: "Commencer", en: "Get Started" },

  // Hero
  hero_badge: { fr: "5 crédits offerts à l'inscription", en: "5 free credits on signup" },
  hero_title_1: { fr: "Vos prompts,", en: "Your prompts," },
  hero_title_2: { fr: "optimisés par l'IA.", en: "optimized by AI." },
  hero_desc: {
    fr: "Pr@mpt génère des prompts optimisés pour chaque IA — ChatGPT, Claude, Gemini, Grok et bien d'autres. Obtenez les meilleurs résultats en texte, code, image et vidéo, automatiquement.",
    en: "Pr@mpt generates optimized prompts for every AI — ChatGPT, Claude, Gemini, Grok and many more. Get the best results in text, code, image and video, automatically.",
  },
  hero_cta: { fr: "Créer un compte gratuit", en: "Create a free account" },
  hero_discover: { fr: "Découvrir", en: "Discover" },

  // Features
  features_title: { fr: "Pourquoi choisir Pr@mpt ?", en: "Why choose Pr@mpt?" },
  features_desc: {
    fr: "Générez des prompts optimisés et exploitez la puissance de l'IA au quotidien.",
    en: "Generate optimized prompts and harness the power of AI every day.",
  },
  feat1_title: { fr: "Prompts optimisés", en: "Optimized Prompts" },
  feat1_desc: {
    fr: "Pr@mpt reformule et optimise automatiquement vos demandes pour obtenir les meilleurs résultats de chaque IA.",
    en: "Pr@mpt automatically rewrites and optimizes your requests to get the best results from every AI.",
  },
  feat2_title: { fr: "Multi-IA unifié", en: "Unified Multi-AI" },
  feat2_desc: {
    fr: "Accédez à GPT, Claude, Gemini, Grok et plus encore depuis une seule interface. Pas besoin de compte sur chaque plateforme.",
    en: "Access GPT, Claude, Gemini, Grok and more from a single interface. No need for an account on each platform.",
  },
  feat3_title: { fr: "Données sécurisées", en: "Secure Data" },
  feat3_desc: {
    fr: "Vos conversations restent privées. Authentification sécurisée et chiffrement des données.",
    en: "Your conversations stay private. Secure authentication and data encryption.",
  },

  // Prompts section
  prompts_title: { fr: "Des prompts générés et optimisés", en: "Generated & Optimized Prompts" },
  prompts_subtitle: {
    fr: "Pr@mpt analyse votre demande, génère un prompt optimisé et sélectionne automatiquement la meilleure IA pour y répondre.",
    en: "Pr@mpt analyzes your request, generates an optimized prompt and automatically selects the best AI to answer it.",
  },
  prompts_feat1_title: { fr: "Génération automatique", en: "Auto Generation" },
  prompts_feat1_desc: {
    fr: "Décrivez simplement ce que vous voulez. Pr@mpt génère un prompt optimisé et identifie les IA les plus adaptées : texte, code, image ou vidéo.",
    en: "Simply describe what you want. Pr@mpt generates an optimized prompt and identifies the best-suited AIs: text, code, image or video.",
  },
  prompts_feat2_title: { fr: "Exécution en un clic", en: "One-Click Execution" },
  prompts_feat2_desc: {
    fr: "Sélectionnez l'IA suggérée et obtenez votre résultat sans configuration. Le système gère tout pour vous.",
    en: "Select the suggested AI and get your result without any setup. The system handles everything for you.",
  },
  prompts_feat3_title: { fr: "Tous les formats", en: "All Formats" },
  prompts_feat3_desc: {
    fr: "Texte, code, images HD, vidéos… un seul prompt optimisé suffit pour générer du contenu dans tous les formats.",
    en: "Text, code, HD images, videos… a single optimized prompt is enough to generate content in every format.",
  },
  prompts_example: { fr: "Votre demande", en: "Your request" },
  prompts_example_text: { fr: "Je veux un logo minimaliste pour une startup tech", en: "I want a minimalist logo for a tech startup" },
  prompts_optimized: { fr: "Prompt optimisé par Pr@mpt :", en: "Prompt optimized by Pr@mpt:" },
  prompts_optimized_text: {
    fr: "Create a clean, minimalist logo for a tech startup. Use geometric shapes, a modern sans-serif font, and a limited color palette of 2-3 colors. The design should convey innovation and simplicity. Output as high-resolution PNG with transparent background.",
    en: "Create a clean, minimalist logo for a tech startup. Use geometric shapes, a modern sans-serif font, and a limited color palette of 2-3 colors. The design should convey innovation and simplicity. Output as high-resolution PNG with transparent background.",
  },
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
    fr: "Créez votre compte en 30 secondes et recevez 5 crédits offerts pour générer vos premiers prompts optimisés.",
    en: "Create your account in 30 seconds and receive 5 free credits to generate your first optimized prompts.",
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
