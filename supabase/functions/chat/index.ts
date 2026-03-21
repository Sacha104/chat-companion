import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Supported providers — extend this map to add more AI APIs
const PROVIDERS: Record<
  string,
  { envKey: string; url: string; buildBody: (messages: any[], model?: string) => any }
> = {
  openai: {
    envKey: "OPENAI_API_KEY",
    url: "https://api.openai.com/v1/chat/completions",
    buildBody: (messages, model) => ({
      model: model ?? "gpt-4o-mini",
      messages,
      stream: true,
    }),
  },
  // Add more providers here, e.g.:
  // anthropic: { envKey: "ANTHROPIC_API_KEY", url: "...", buildBody: ... },
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, provider = "openai", model } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "messages array is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const cfg = PROVIDERS[provider];
    if (!cfg) {
      return new Response(
        JSON.stringify({ error: `Unknown provider: ${provider}. Available: ${Object.keys(PROVIDERS).join(", ")}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get(cfg.envKey);
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: `${cfg.envKey} is not configured. Add it in project secrets.` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemMessage = {
      role: "system",
      content: "Tu es un assistant IA utile, précis et concis. Réponds dans la langue de l'utilisateur.",
    };

    const response = await fetch(cfg.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cfg.buildBody([systemMessage, ...messages], model)),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`${provider} API error [${response.status}]:`, errText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ error: `${provider} API error: ${response.status}` }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Stream the response through
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat function error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
