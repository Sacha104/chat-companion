# Tornado — Guide d'installation pour l'acheteur

Ce projet est une application React + Vite + Tailwind, branchée sur **Supabase** (base de données, auth, edge functions) et **Stripe** (paiements). Toutes les clés API IA sont configurables via les secrets de tes edge functions Supabase — aucune clé n'est livrée avec le code.

## 1. Prérequis

- Compte [Supabase](https://supabase.com) (gratuit pour démarrer)
- Compte [Stripe](https://stripe.com)
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

Édite `src/integrations/supabase/client.ts` et remplace :

```ts
const SUPABASE_URL = "https://<TON_PROJECT_REF>.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "<TA_ANON_KEY>";
```

Édite aussi `.env` (créé à la racine) :

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

Les variables `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` sont injectées automatiquement par Supabase.

## 8. Auth Google (optionnel)

**Supabase Dashboard → Authentication → Providers → Google** : active Google et colle ton Client ID / Secret obtenus sur https://console.cloud.google.com.

## 9. Stripe

1. Crée tes produits/prix dans Stripe Dashboard
2. Mets à jour les `price_id` dans `src/pages/Pricing.tsx`
3. Configure le webhook Stripe pointant vers ton edge function `stripe-webhook` (URL : `https://<TON_PROJECT_REF>.supabase.co/functions/v1/stripe-webhook`)

## 10. Lancer en dev

```bash
bun run dev
```

## 11. Déployer le frontend

Le projet est compatible Vercel, Netlify, Cloudflare Pages. Build :

```bash
bun run build
```

Output dans `dist/`. Pense à recopier les variables `VITE_*` dans les env vars de ton hébergeur.

## Support

Code livré "as-is". Toutes les intégrations sont standard (Supabase JS, Stripe SDK) — la doc officielle de chaque service s'applique.