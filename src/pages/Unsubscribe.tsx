import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, MailX } from "lucide-react";

type Status = "loading" | "valid" | "already" | "invalid" | "success" | "error";

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>("loading");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }

    const validate = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        const res = await fetch(
          `${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${token}`,
          { headers: { apikey: anonKey } }
        );
        const data = await res.json();
        if (data.valid === false && data.reason === "already_unsubscribed") {
          setStatus("already");
        } else if (data.valid) {
          setStatus("valid");
        } else {
          setStatus("invalid");
        }
      } catch {
        setStatus("invalid");
      }
    };
    validate();
  }, [token]);

  const handleUnsubscribe = async () => {
    if (!token) return;
    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", {
        body: { token },
      });
      if (error) throw error;
      if (data?.success) {
        setStatus("success");
      } else if (data?.reason === "already_unsubscribed") {
        setStatus("already");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {status === "loading" && (
          <>
            <Loader2 className="w-12 h-12 animate-spin text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">Vérification en cours...</p>
          </>
        )}

        {status === "valid" && (
          <>
            <MailX className="w-16 h-16 text-destructive mx-auto" />
            <h1 className="text-2xl font-bold text-foreground">Se désabonner</h1>
            <p className="text-muted-foreground">
              Souhaitez-vous vous désabonner des e-mails de Tornado ?
            </p>
            <Button onClick={handleUnsubscribe} variant="destructive" disabled={processing}>
              {processing ? "Traitement..." : "Confirmer le désabonnement"}
            </Button>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-16 h-16 text-primary mx-auto" />
            <h1 className="text-2xl font-bold text-foreground">Désabonné</h1>
            <p className="text-muted-foreground">
              Vous ne recevrez plus d'e-mails de notre part.
            </p>
          </>
        )}

        {status === "already" && (
          <>
            <CheckCircle className="w-16 h-16 text-muted-foreground mx-auto" />
            <h1 className="text-2xl font-bold text-foreground">Déjà désabonné</h1>
            <p className="text-muted-foreground">
              Vous êtes déjà désabonné de nos e-mails.
            </p>
          </>
        )}

        {status === "invalid" && (
          <>
            <XCircle className="w-16 h-16 text-destructive mx-auto" />
            <h1 className="text-2xl font-bold text-foreground">Lien invalide</h1>
            <p className="text-muted-foreground">
              Ce lien de désabonnement est invalide ou a expiré.
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-16 h-16 text-destructive mx-auto" />
            <h1 className="text-2xl font-bold text-foreground">Erreur</h1>
            <p className="text-muted-foreground">
              Une erreur est survenue. Veuillez réessayer plus tard.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Unsubscribe;
