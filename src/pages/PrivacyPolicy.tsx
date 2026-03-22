import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-secondary transition-colors active:scale-[0.95]"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Politique de confidentialité</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8 prose prose-sm prose-invert max-w-none">
        <p className="text-xs text-muted-foreground mb-6">Dernière mise à jour : 22 mars 2026</p>

        <h2 className="text-base font-semibold text-foreground mt-8 mb-3">1. Introduction</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          La présente politique de confidentialité décrit comment notre plateforme d'intelligence artificielle
          (ci-après « la Plateforme ») collecte, utilise, stocke et protège vos données personnelles conformément
          au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.
        </p>

        <h2 className="text-base font-semibold text-foreground mt-8 mb-3">2. Données collectées</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-2">Nous collectons les données suivantes :</p>
        <ul className="text-sm text-muted-foreground space-y-1 mb-4 list-disc pl-5">
          <li><strong className="text-foreground">Données d'identification</strong> : adresse email, mot de passe (chiffré).</li>
          <li><strong className="text-foreground">Données d'utilisation</strong> : historique des conversations, prompts envoyés, fournisseurs d'IA utilisés.</li>
          <li><strong className="text-foreground">Données techniques</strong> : adresse IP, type de navigateur, système d'exploitation, journaux de connexion.</li>
          <li><strong className="text-foreground">Données de paiement</strong> : traitées exclusivement par Stripe. Nous ne stockons aucune information bancaire.</li>
        </ul>

        <h2 className="text-base font-semibold text-foreground mt-8 mb-3">3. Finalités du traitement</h2>
        <ul className="text-sm text-muted-foreground space-y-1 mb-4 list-disc pl-5">
          <li>Fournir et améliorer nos services d'IA.</li>
          <li>Gérer votre compte et vos abonnements.</li>
          <li>Assurer la sécurité de la Plateforme.</li>
          <li>Respecter nos obligations légales.</li>
        </ul>

        <h2 className="text-base font-semibold text-foreground mt-8 mb-3">4. Base légale</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Le traitement de vos données repose sur : l'exécution du contrat (utilisation du service),
          votre consentement (lors de la création de compte), notre intérêt légitime (amélioration du service)
          et nos obligations légales.
        </p>

        <h2 className="text-base font-semibold text-foreground mt-8 mb-3">5. Sécurité des données</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-2">Nous mettons en œuvre les mesures suivantes :</p>
        <ul className="text-sm text-muted-foreground space-y-1 mb-4 list-disc pl-5">
          <li><strong className="text-foreground">Chiffrement</strong> : toutes les communications sont chiffrées via TLS/HTTPS.</li>
          <li><strong className="text-foreground">Clés API</strong> : stockées en tant que secrets chiffrés côté serveur, jamais exposées au navigateur client.</li>
          <li><strong className="text-foreground">Authentification</strong> : mots de passe hashés avec bcrypt, sessions sécurisées avec JWT.</li>
          <li><strong className="text-foreground">Isolation des données</strong> : politiques Row Level Security (RLS) garantissant que chaque utilisateur n'accède qu'à ses propres données.</li>
          <li><strong className="text-foreground">Paiements</strong> : délégués à Stripe (certifié PCI DSS Niveau 1).</li>
        </ul>

        <h2 className="text-base font-semibold text-foreground mt-8 mb-3">6. Partage des données</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-2">
          Vos prompts sont transmis aux fournisseurs d'IA que vous sélectionnez (OpenAI, Anthropic, Google, Mistral, DeepSeek, Stability AI, DeepAI, RunwayML, Kling AI) exclusivement pour exécuter votre requête. Nous ne vendons jamais vos données à des tiers.
        </p>

        <h2 className="text-base font-semibold text-foreground mt-8 mb-3">7. Conservation</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Vos données sont conservées tant que votre compte est actif. Vous pouvez demander la suppression
          de votre compte et de toutes les données associées à tout moment.
        </p>

        <h2 className="text-base font-semibold text-foreground mt-8 mb-3">8. Vos droits</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-2">
          Conformément au RGPD, vous disposez des droits suivants :
        </p>
        <ul className="text-sm text-muted-foreground space-y-1 mb-4 list-disc pl-5">
          <li>Droit d'accès, de rectification et de suppression de vos données.</li>
          <li>Droit à la portabilité de vos données.</li>
          <li>Droit d'opposition et de limitation du traitement.</li>
          <li>Droit de retirer votre consentement à tout moment.</li>
        </ul>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Pour exercer ces droits, contactez-nous à l'adresse indiquée dans la section Contact.
        </p>

        <h2 className="text-base font-semibold text-foreground mt-8 mb-3">9. Cookies</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Nous utilisons uniquement des cookies essentiels au fonctionnement du service (session d'authentification).
          Aucun cookie de traçage publicitaire n'est utilisé.
        </p>

        <h2 className="text-base font-semibold text-foreground mt-8 mb-3">10. Contact</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Pour toute question relative à cette politique, vous pouvez nous contacter par email à :
          <span className="text-primary"> contact@votredomaine.com</span>
        </p>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
