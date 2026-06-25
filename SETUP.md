# Tornado — Guide d'installation pour l'acheteur

Ce projet est une application React + Vite + Tailwind, branchée sur **Supabase** (base de données, auth, edge functions), **Stripe** (paiements) et **Resend** (envoi d'emails). Toutes les clés API sont configurables via les secrets de tes edge functions Supabase — aucune clé n'est livrée avec le code.

## 1. Prérequis

- Compte [Supabase](https://supabase.com) (gratuit pour démarrer)
- Compte [Stripe](https://stripe.com)
- Compte [Resend](https://resend.com) (gratuit jusqu'à 3 000 emails/mois) — pour les emails auth & transactionnels
- Node.js 20+ et `bun` ou `npm`
- Supabase CLI : `npm i -g supabase`

## 2. Cloner et installer

```bash
git clone <ton-repo>
cd <ton-repo>
bun install
```

## 3. Créer ton projet Supabase

1. Va sur https://supabase.com → **New Project**
2. Récupère ces valeurs dans **Project Settings → API** :
   - `Project URL`
   - `anon public key`
   - `Project ref` (dans l'URL du dashboard)

## 4. Configurer le code client

`src/integrations/supabase/client.ts` lit déjà les variables d'environnement — tu n'as **rien à modifier dans le code**. Édite simplement le `.env` à la racine :

```
VITE_SUPABASE_URL=https://<TON_PROJECT_REF>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<TA_ANON_KEY>
VITE_SUPABASE_PROJECT_ID=<TON_PROJECT_REF>
```

## 5. Appliquer les migrations SQL

```bash
supabase login
supabase link --project-ref <TON_PROJECT_REF>
supabase db push
```

Cela crée toutes les tables : `conversations`, `messages`, `user_credits`, `email_send_log`, etc. — avec leurs RLS.

## 6. Déployer les edge functions

```bash
supabase functions deploy
```

## 7. Configurer les secrets (clés API)

Dans **Supabase Dashboard → Edge Functions → Secrets**, ajoute uniquement les clés des providers que tu veux activer :

| Secret | Provider | Où l'obtenir |
|---|---|---|
| `OPENAI_API_KEY` | OpenAI GPT | https://platform.openai.com/api-keys |
| `ANTHROPIC_API_KEY` | Anthropic Claude | https://console.anthropic.com |
| `GEMINI_API_KEY` | Google Gemini | https://aistudio.google.com/apikey |
| `MISTRAL_API_KEY` | Mistral AI | https://console.mistral.ai |
| `DEEPSEEK_API_KEY` | DeepSeek | https://platform.deepseek.com |
| `DEEPAI_API_KEY` | DeepAI | https://deepai.org/dashboard/profile |
| `LEONARDO_API_KEY` | Leonardo AI | https://app.leonardo.ai/api-access |
| `STABILITY_API_KEY` | Stability AI | https://platform.stability.ai/account/keys |
| `RUNWAYML_API_KEY` | RunwayML | https://dev.runwayml.com |
| `KLING_API_KEY` | Kling | https://klingai.com |
| `HAILUO_API_KEY` | Hailuo / MiniMax | https://hailuoai.video |
| `STRIPE_SECRET_KEY` | Stripe (paiements) | https://dashboard.stripe.com/apikeys |
| `RESEND_API_KEY` | Resend (envoi emails) | https://resend.com/api-keys |
| `RESEND_WEBHOOK_SECRET` | Resend (bounces/plaintes) | https://resend.com/webhooks (créer un endpoint pointant vers `https://<PROJECT_REF>.supabase.co/functions/v1/handle-email-suppression`, copier le signing secret `whsec_…`) |
| `SEND_EMAIL_HOOK_SECRET` | Supabase Auth Hook | Dashboard → Authentication → Hooks → Send Email Hook (active le hook HTTPS vers `https://<PROJECT_REF>.supabase.co/functions/v1/auth-email-hook` et copie le secret généré, format `v1,whsec_…`) |
| `UNSUBSCRIBE_URL_BASE` | URL publique vers ta page `/unsubscribe` (ex: `https://mon-site.com/unsubscribe`) — utilisée dans l'en-tête `List-Unsubscribe` des emails |

Les variables `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` sont injectées automatiquement par Supabase.

## 8. Domaine d'envoi Resend

Dans **Resend Dashboard → Domains**, ajoute et vérifie ton domaine (ex : `prompt-me-up.com`). Ensuite, mets à jour les constantes `SITE_NAME`, `SENDER_DOMAIN`, `FROM_DOMAIN`, `ROOT_DOMAIN` en haut des fichiers :

- `supabase/functions/auth-email-hook/index.ts`
- `supabase/functions/send-transactional-email/index.ts`

## 9. Auth Google (optionnel)

**Supabase Dashboard → Authentication → Providers → Google** : active Google et colle ton Client ID / Secret obtenus sur https://console.cloud.google.com.

## 10. Stripe

1. Crée tes produits/prix dans Stripe Dashboard
2. Mets à jour les `price_id` dans `src/pages/Pricing.tsx`
3. Configure le webhook Stripe pointant vers ton edge function `stripe-webhook` (URL : `https://<TON_PROJECT_REF>.supabase.co/functions/v1/stripe-webhook`)

## 11. Lancer en dev

```bash
bun run dev
```

## 12. Déployer le frontend

Le projet est compatible Vercel, Netlify, Cloudflare Pages. Build :

```bash
bun run build
```

Output dans `dist/`. Pense à recopier les variables `VITE_*` dans les env vars de ton hébergeur.

## Support

Code livré "as-is". Toutes les intégrations sont standard (Supabase JS, Stripe SDK) — la doc officielle de chaque service s'applique.