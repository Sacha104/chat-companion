import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "fr" | "en";

const translations = {
  // ===== Landing =====
  nav_login: { fr: "Connexion", en: "Sign in" },
  nav_start: { fr: "Commencer", en: "Get Started" },
  hero_badge: { fr: "5 crédits offerts à l'inscription", en: "5 free credits on signup" },
  hero_title_1: { fr: "Vos prompts,", en: "Your prompts," },
  hero_title_2: { fr: "optimisés par l'IA.", en: "optimized by AI." },
  hero_desc: {
    fr: "Pr@mpt génère des prompts optimisés pour chaque IA — ChatGPT, Claude, Gemini, Grok et bien d'autres. Obtenez les meilleurs résultats en texte, code, image et vidéo, automatiquement.",
    en: "Pr@mpt generates optimized prompts for every AI — ChatGPT, Claude, Gemini, Grok and many more. Get the best results in text, code, image and video, automatically.",
  },
  hero_cta: { fr: "Créer un compte gratuit", en: "Create a free account" },
  hero_discover: { fr: "Découvrir", en: "Discover" },
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
  cta_title: { fr: "Prêt à essayer ?", en: "Ready to try?" },
  cta_desc: {
    fr: "Créez votre compte en 30 secondes et recevez 5 crédits offerts pour générer vos premiers prompts optimisés.",
    en: "Create your account in 30 seconds and receive 5 free credits to generate your first optimized prompts.",
  },
  cta_button: { fr: "Commencer maintenant", en: "Start now" },
  footer_privacy: { fr: "Confidentialité", en: "Privacy" },
  footer_terms: { fr: "CGU", en: "Terms" },
  footer_about: { fr: "À propos", en: "About" },
  lang_switch: { fr: "EN", en: "FR" },

  // ===== Login =====
  login_welcome: { fr: "Bienvenue", en: "Welcome" },
  login_create_account: { fr: "Créez votre compte", en: "Create your account" },
  login_sign_in: { fr: "Connectez-vous pour continuer", en: "Sign in to continue" },
  login_email: { fr: "Email", en: "Email" },
  login_password: { fr: "Mot de passe", en: "Password" },
  login_email_placeholder: { fr: "vous@exemple.com", en: "you@example.com" },
  login_submit_signup: { fr: "Créer un compte", en: "Create account" },
  login_submit_signin: { fr: "Se connecter", en: "Sign in" },
  login_has_account: { fr: "Déjà un compte ?", en: "Already have an account?" },
  login_no_account: { fr: "Pas encore de compte ?", en: "Don't have an account?" },
  login_accept_terms: { fr: "J'accepte les", en: "I accept the" },
  login_terms_link: { fr: "conditions d'utilisation", en: "terms of service" },
  login_and_the: { fr: "et la", en: "and the" },
  login_privacy_link: { fr: "politique de confidentialité", en: "privacy policy" },
  login_terms_error: {
    fr: "Vous devez accepter les conditions d'utilisation et la politique de confidentialité.",
    en: "You must accept the terms of service and privacy policy.",
  },
  login_otp_sent: { fr: "Un code de vérification a été envoyé à votre email", en: "A verification code has been sent to your email" },
  login_verify_title: { fr: "Vérification", en: "Verification" },
  login_verify_desc: { fr: "Entrez le code à 6 chiffres envoyé à", en: "Enter the 6-digit code sent to" },
  login_verify_btn: { fr: "Vérifier", en: "Verify" },
  login_resend: { fr: "Renvoyer le code", en: "Resend code" },
  login_back: { fr: "Retour", en: "Back" },
  login_verified: { fr: "Compte vérifié avec succès !", en: "Account verified successfully!" },
  login_code_resent: { fr: "Un nouveau code a été envoyé", en: "A new code has been sent" },

  // ===== Sidebar =====
  sidebar_new_chat: { fr: "Nouvelle discussion", en: "New chat" },
  sidebar_today: { fr: "Aujourd'hui", en: "Today" },
  sidebar_yesterday: { fr: "Hier", en: "Yesterday" },
  sidebar_older: { fr: "Plus ancien", en: "Older" },
  sidebar_company: { fr: "Notre société", en: "Our company" },
  sidebar_our_ais: { fr: "Nos IAs", en: "Our AIs" },
  sidebar_account: { fr: "Mon compte", en: "My account" },

  // ===== Settings =====
  settings_title: { fr: "Réglages", en: "Settings" },
  settings_profile: { fr: "Profil", en: "Profile" },
  settings_profile_desc: { fr: "Informations de votre compte", en: "Your account information" },
  settings_email: { fr: "E-mail", en: "Email" },
  settings_member_since: { fr: "Membre depuis", en: "Member since" },
  settings_credits: { fr: "Crédits", en: "Credits" },
  settings_credits_desc: { fr: "Votre solde et tarification", en: "Your balance and pricing" },
  settings_balance: { fr: "Solde actuel", en: "Current balance" },
  settings_credits_label: { fr: "crédits", en: "credits" },
  settings_recharge: { fr: "Recharger", en: "Top up" },
  settings_credit_text: { fr: "crédit / texte", en: "credit / text" },
  settings_credits_image: { fr: "crédits / image", en: "credits / image" },
  settings_credits_video: { fr: "crédits / vidéo", en: "credits / video" },
  settings_credits_note: { fr: "Chaque rédaction de prompt coûte également 1 crédit.", en: "Each prompt generation also costs 1 credit." },
  settings_security: { fr: "Sécurité", en: "Security" },
  settings_security_desc: { fr: "Gérez votre mot de passe", en: "Manage your password" },
  settings_reset_password: { fr: "Réinitialiser le mot de passe", en: "Reset password" },
  settings_reset_sending: { fr: "Envoi en cours…", en: "Sending…" },
  settings_reset_success: { fr: "Un lien de réinitialisation a été envoyé à votre adresse e-mail.", en: "A reset link has been sent to your email." },
  settings_reset_error: { fr: "Erreur lors de l'envoi du lien de réinitialisation.", en: "Error sending reset link." },
  settings_signout: { fr: "Se déconnecter", en: "Sign out" },

  // ===== Pricing page =====
  pricing_page_title: { fr: "Choisissez votre plan", en: "Choose your plan" },
  pricing_current: { fr: "Actuel", en: "Current" },
  pricing_manage: { fr: "Gérer l'abonnement", en: "Manage subscription" },
  pricing_subscribe: { fr: "S'abonner", en: "Subscribe" },
  pricing_month: { fr: "/mois", en: "/mo" },
  pricing_feat_email: { fr: "Support email", en: "Email support" },
  pricing_feat_priority: { fr: "Support prioritaire", en: "Priority support" },
  pricing_feat_early: { fr: "Accès anticipé aux nouveautés", en: "Early access to new features" },
  pricing_feat_history: { fr: "Historique illimité", en: "Unlimited history" },
  pricing_feat_providers: { fr: "Tous les providers IA", en: "All AI providers" },

  // ===== Our AIs =====
  ais_title: { fr: "Nos IAs", en: "Our AIs" },
  ais_subtitle: { fr: "modèles intégrés à votre disposition", en: "integrated models at your disposal" },
  ais_visit: { fr: "Voir le site", en: "Visit website" },
  ais_text: { fr: "Texte", en: "Text" },
  ais_code: { fr: "Code", en: "Code" },
  ais_image: { fr: "Image", en: "Image" },
  ais_video: { fr: "Vidéo", en: "Video" },
  // AI descriptions
  ai_openai: { fr: "Modèle polyvalent pour le texte et le code, capable de raisonnement avancé.", en: "Versatile model for text and code, capable of advanced reasoning." },
  ai_anthropic: { fr: "Spécialisé dans le raisonnement, l'analyse et les tâches complexes.", en: "Specialized in reasoning, analysis and complex tasks." },
  ai_gemini: { fr: "Modèle multimodal rapide de Google, texte et images.", en: "Google's fast multimodal model, text and images." },
  ai_mistral: { fr: "IA française haute performance pour le traitement du langage.", en: "High-performance French AI for language processing." },
  ai_deepseek: { fr: "Optimisé pour la génération et la compréhension de code.", en: "Optimized for code generation and understanding." },
  ai_stability: { fr: "Génération d'images haute définition avec Stable Diffusion.", en: "HD image generation with Stable Diffusion." },
  ai_deepai: { fr: "Génération d'images rapide et accessible.", en: "Fast and accessible image generation." },
  ai_runwayml: { fr: "Génération vidéo et animation par intelligence artificielle.", en: "AI-powered video generation and animation." },
  ai_kling: { fr: "Génération vidéo avancée par IA, texte vers vidéo.", en: "Advanced AI video generation, text to video." },

  // ===== Company =====
  company_title: { fr: "Notre société", en: "Our company" },
  company_desc: {
    fr: "Nous développons une plateforme d'intelligence artificielle multi-fournisseurs qui vous donne accès aux meilleurs modèles d'IA du marché en un seul endroit. Votre vie privée et la sécurité de vos données sont au cœur de notre mission.",
    en: "We develop a multi-provider AI platform that gives you access to the best AI models on the market in one place. Your privacy and data security are at the heart of our mission.",
  },
  company_privacy: { fr: "Politique de confidentialité", en: "Privacy Policy" },
  company_privacy_desc: { fr: "Comment nous protégeons vos données personnelles", en: "How we protect your personal data" },
  company_terms: { fr: "Conditions d'utilisation", en: "Terms of Service" },
  company_terms_desc: { fr: "Les règles d'utilisation de la plateforme", en: "Platform usage rules" },
  company_security: { fr: "Sécurité", en: "Security" },
  company_sec1: { fr: "Toutes les communications sont chiffrées (TLS/HTTPS).", en: "All communications are encrypted (TLS/HTTPS)." },
  company_sec2: { fr: "Les clés API des fournisseurs sont stockées en secrets chiffrés côté serveur et ne sont jamais exposées au navigateur.", en: "Provider API keys are stored as encrypted server-side secrets, never exposed to the browser." },
  company_sec3: { fr: "Les mots de passe sont hashés avec bcrypt.", en: "Passwords are hashed with bcrypt." },
  company_sec4: { fr: "Chaque utilisateur est isolé par des politiques de sécurité au niveau de la base de données (RLS).", en: "Each user is isolated by database-level security policies (RLS)." },
  company_sec5: { fr: "Les paiements sont gérés par Stripe (certifié PCI DSS Niveau 1).", en: "Payments are handled by Stripe (PCI DSS Level 1 certified)." },
  company_sec6: { fr: "Aucune donnée bancaire n'est stockée sur nos serveurs.", en: "No banking data is stored on our servers." },

  // ===== Chat Input =====
  chat_placeholder: { fr: "Écrivez votre message…", en: "Type your message…" },
  chat_disclaimer: { fr: "L'IA peut faire des erreurs. Vérifiez les informations importantes.", en: "AI can make mistakes. Verify important information." },

  // ===== NotFound =====
  notfound_title: { fr: "Page non trouvée", en: "Page not found" },
  notfound_back: { fr: "Retour à l'accueil", en: "Return to Home" },

  // ===== Chat empty state =====
  chat_empty_title: { fr: "Décrivez ce que vous voulez", en: "Describe what you want" },
  chat_empty_desc: {
    fr: "Je génère un prompt optimisé, puis vous pouvez l'exécuter directement avec l'IA de votre choix.",
    en: "I generate an optimized prompt, then you can execute it directly with the AI of your choice.",
  },
  chat_result: { fr: "Résultat", en: "Result" },
  chat_copied: { fr: "Prompt copié !", en: "Prompt copied!" },
  chat_no_credits: { fr: "Crédits insuffisants. Rechargez vos crédits pour continuer.", en: "Not enough credits. Top up to continue." },
  chat_conv_error: { fr: "Erreur lors de la création de la conversation", en: "Error creating conversation" },
  chat_stream_error: { fr: "Erreur lors de la communication avec l'IA", en: "Error communicating with AI" },
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
