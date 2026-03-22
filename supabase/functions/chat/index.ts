import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Supported providers — extend this map to add more AI APIs
const PROVIDERS: Record<
  string,
  { envKey: string; url: string; buildBody: (messages: any[], model?: string) => any; authHeader: (key: string) => Record<string, string>; stream: boolean }
> = {
  openai: {
    envKey: "OPENAI_API_KEY",
    url: "https://api.openai.com/v1/chat/completions",
    buildBody: (messages, model) => ({
      model: model ?? "gpt-4o-mini",
      messages,
      stream: true,
    }),
    authHeader: (key) => ({ Authorization: `Bearer ${key}` }),
    stream: true,
  },
  anthropic: {
    envKey: "ANTHROPIC_API_KEY",
    url: "https://api.anthropic.com/v1/messages",
    buildBody: (messages, model) => {
      const system = messages.find((m: any) => m.role === "system")?.content ?? "";
      const filtered = messages.filter((m: any) => m.role !== "system");
      return {
        model: model ?? "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system,
        messages: filtered,
        stream: true,
      };
    },
    authHeader: (key) => ({ "x-api-key": key, "anthropic-version": "2023-06-01" }),
    stream: true,
  },
  gemini: {
    envKey: "GEMINI_API_KEY",
    url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    buildBody: (messages, model) => ({
      model: model ?? "gemini-2.0-flash",
      messages,
      stream: true,
    }),
    authHeader: (key) => ({ Authorization: `Bearer ${key}` }),
    stream: true,
  },
  mistral: {
    envKey: "MISTRAL_API_KEY",
    url: "https://api.mistral.ai/v1/chat/completions",
    buildBody: (messages, model) => ({
      model: model ?? "mistral-small-latest",
      messages,
      stream: true,
    }),
    authHeader: (key) => ({ Authorization: `Bearer ${key}` }),
    stream: true,
  },
  deepseek: {
    envKey: "DEEPSEEK_API_KEY",
    url: "https://api.deepseek.com/chat/completions",
    buildBody: (messages, model) => ({
      model: model ?? "deepseek-coder",
      messages,
      stream: true,
    }),
    authHeader: (key) => ({ Authorization: `Bearer ${key}` }),
    stream: true,
  },
  stability: {
    envKey: "STABILITY_API_KEY",
    url: "https://api.stability.ai/v2beta/stable-image/generate/sd3",
    buildBody: (messages) => ({
      prompt: messages.map((m: any) => m.content).join("\n"),
      output_format: "png",
    }),
    authHeader: (key) => ({ Authorization: `Bearer ${key}` }),
    stream: false,
  },
  runwayml: {
    envKey: "RUNWAYML_API_KEY",
    url: "https://api.dev.runwayml.com/v1/chat/completions",
    buildBody: (messages, model) => ({
      model: model ?? "runway",
      messages,
      stream: true,
    }),
    authHeader: (key) => ({ Authorization: `Bearer ${key}` }),
    stream: true,
  },
  deepai: {
    envKey: "DEEPAI_API_KEY",
    url: "https://api.deepai.org/api/text-generator",
    buildBody: (messages) => ({
      text: messages.map((m: any) => m.content).join("\n"),
    }),
    authHeader: (key) => ({ "api-key": key }),
    stream: false,
  },
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
      content: `Tu es un expert en ingénierie de prompts (prompt engineering). Ton rôle est de transformer la demande de l'utilisateur en un prompt optimisé, clair et structuré, prêt à être utilisé avec une IA comme ChatGPT, Claude, Gemini, etc.

Règles :
- Génère UNIQUEMENT le prompt optimisé, rien d'autre.
- Ne réponds pas à la question de l'utilisateur.
- Le prompt doit être précis, actionnable et bien structuré.
- Utilise des instructions claires (rôle, contexte, format de sortie, contraintes).
- Si la demande est vague, enrichis-la intelligemment.
- Réponds dans la langue de l'utilisateur.`,
    };

    const response = await fetch(cfg.url, {
      method: "POST",
      headers: {
        ...cfg.authHeader(apiKey),
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

    if (cfg.stream) {
      if (provider === "anthropic") {
        // Transform Anthropic SSE to OpenAI-compatible SSE
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          async pull(controller) {
            let buf = "";
            while (true) {
              const { done, value } = await reader.read();
              if (done) {
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                controller.close();
                return;
              }
              buf += decoder.decode(value, { stream: true });
              let idx;
              while ((idx = buf.indexOf("\n")) !== -1) {
                const line = buf.slice(0, idx).trim();
                buf = buf.slice(idx + 1);
                if (!line.startsWith("data: ")) continue;
                const json = line.slice(6);
                if (json === "[DONE]") {
                  controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                  controller.close();
                  return;
                }
                try {
                  const evt = JSON.parse(json);
                  if (evt.type === "content_block_delta" && evt.delta?.text) {
                    const normalized = { choices: [{ delta: { content: evt.delta.text } }] };
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify(normalized)}\n\n`));
                  }
                } catch { /* skip */ }
              }
            }
          },
        });
        return new Response(stream, {
          headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
        });
      }
      // OpenAI-compatible stream — pass through
      return new Response(response.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    } else {
      // Non-streaming: parse and return as SSE-compatible format
      const data = await response.json();
      const text = data.output ?? data.result ?? data.text ?? JSON.stringify(data);
      const ssePayload = `data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\ndata: [DONE]\n\n`;
      return new Response(ssePayload, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }
  } catch (e) {
    console.error("chat function error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
