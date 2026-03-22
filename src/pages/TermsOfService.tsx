import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TermsOfService = () => {
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
          <h1 className="text-lg font-semibold text-foreground">Conditions d'utilisation</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8 prose prose-sm prose-invert max-w-none">
        <p className="text-xs text-muted-foreground mb-6">Dernière mise à jour : 22 mars 2026</p>

        <h2 className="text-base font-semibold text-foreground mt-8 mb-3">1. Objet</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Les présentes conditions générales d'utilisation (ci-après « CGU ») régissent l'accès et l'utilisation
          de la Plateforme d'intelligence artificielle multi-fournisseurs. En créant un compte, vous acceptez
          sans réserve l'intégralité des présentes CGU.
        </p>

        <h2 className="text-base font-semibold text-foreground mt-8 mb-3">2. Inscription et compte</h2>
        <ul className="text-sm text-muted-foreground space-y-1 mb-4 list-disc pl-5">
          <li>Vous devez fournir une adresse email valide et un mot de passe sécurisé.</li>
          <li>Vous êtes responsable de la confidentialité de vos identifiants.</li>
          <li>Vous devez être âgé d'au moins 16 ans pour utiliser la Plateforme.</li>
          <li>Un seul compte par personne est autorisé.</li>
        </ul>

        <h2 className="text-base font-semibold text-foreground mt-8 mb-3">3. Description du service</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          La Plateforme permet de générer du contenu (texte, code, images, vidéos) via différents fournisseurs
          d'intelligence artificielle. Les résultats sont générés par des modèles tiers et peuvent contenir
          des inexactitudes. La Plateforme ne garantit pas l'exactitude, la complétude ou la pertinence des
          résultats générés.
        </p>

        <h2 className="text-base font-semibold text-foreground mt-8 mb-3">4. Abonnements et paiement</h2>
        <ul className="text-sm text-muted-foreground space-y-1 mb-4 list-disc pl-5">
          <li>Certaines fonctionnalités nécessitent un abonnement payant (Starter ou Pro).</li>
          <li>Les paiements sont traités de manière sécurisée par Stripe.</li>
          <li>Les abonnements sont renouvelés automatiquement sauf résiliation avant la date d'échéance.</li>
          <li>Les remboursements sont accordés conformément à la législation en vigueur et au droit de rétractation de 14 jours.</li>
        </ul>

        <h2 className="text-base font-semibold text-foreground mt-8 mb-3">5. Utilisation acceptable</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-2">Il est interdit d'utiliser la Plateforme pour :</p>
        <ul className="text-sm text-muted-foreground space-y-1 mb-4 list-disc pl-5">
          <li>Générer du contenu illégal, diffamatoire, haineux ou portant atteinte aux droits d'autrui.</li>
          <li>Tenter de contourner les mesures de sécurité ou accéder aux données d'autres utilisateurs.</li>
          <li>Utiliser de manière automatisée (bots, scraping) sans autorisation préalable.</li>
          <li>Revendre ou redistribuer l'accès au service sans autorisation.</li>
        </ul>

        <h2 className="text-base font-semibold text-foreground mt-8 mb-3">6. Propriété intellectuelle</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Le contenu généré par les modèles d'IA en réponse à vos prompts vous appartient dans les limites
          autorisées par la loi. La Plateforme, son code source, son design et sa marque restent notre
          propriété exclusive.
        </p>

        <h2 className="text-base font-semibold text-foreground mt-8 mb-3">7. Limitation de responsabilité</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          La Plateforme est fournie « en l'état ». Nous ne sommes pas responsables des dommages résultant
          de l'utilisation du contenu généré par les IA, des interruptions de service ou de la disponibilité
          des fournisseurs tiers.
        </p>

        <h2 className="text-base font-semibold text-foreground mt-8 mb-3">8. Suspension et résiliation</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Nous nous réservons le droit de suspendre ou supprimer tout compte en cas de violation des présentes
          CGU, sans préavis ni indemnité. Vous pouvez supprimer votre compte à tout moment.
        </p>

        <h2 className="text-base font-semibold text-foreground mt-8 mb-3">9. Modifications</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Nous pouvons modifier ces CGU à tout moment. Les utilisateurs seront informés par email ou
          notification dans l'application. L'utilisation continue du service après modification vaut
          acceptation des nouvelles conditions.
        </p>

        <h2 className="text-base font-semibold text-foreground mt-8 mb-3">10. Droit applicable</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Les présentes CGU sont régies par le droit français. Tout litige sera soumis à la compétence
          exclusive des tribunaux compétents.
        </p>

        <h2 className="text-base font-semibold text-foreground mt-8 mb-3">11. Contact</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Pour toute question relative à ces conditions, contactez-nous à :
          <span className="text-primary"> contact@votredomaine.com</span>
        </p>
      </main>
    </div>
  );
};

export default TermsOfService;
