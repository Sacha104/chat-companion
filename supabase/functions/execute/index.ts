import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const CREDIT_COSTS: Record<string, number> = {
  chat: 1,
  image: 2,
  video: 5,
};

const PROVIDERS: Record<string, {
  envKey: string;
  type: "chat" | "image" | "video";
  url: string;
  buildBody: (prompt: string, model?: string) => any;
  authHeader: (key: string) => Record<string, string>;
  stream: boolean;
}> = {
  openai: {
    envKey: "OPENAI_API_KEY",
    type: "chat",
    url: "https://api.openai.com/v1/chat/completions",
    buildBody: (prompt, model) => ({
      model: model ?? "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      stream: true,
    }),
    authHeader: (key) => ({ Authorization: `Bearer ${key}` }),
    stream: true,
  },
  anthropic: {
    envKey: "ANTHROPIC_API_KEY",
    type: "chat",
    url: "https://api.anthropic.com/v1/messages",
    buildBody: (prompt, model) => ({
      model: model ?? "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
      stream: true,
    }),
    authHeader: (key) => ({ "x-api-key": key, "anthropic-version": "2023-06-01" }),
    stream: true,
  },
  gemini: {
    envKey: "GEMINI_API_KEY",
    type: "chat",
    url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    buildBody: (prompt, model) => ({
      model: model ?? "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
      stream: true,
    }),
    authHeader: (key) => ({ Authorization: `Bearer ${key}` }),
    stream: true,
  },
  mistral: {
    envKey: "MISTRAL_API_KEY",
    type: "chat",
    url: "https://api.mistral.ai/v1/chat/completions",
    buildBody: (prompt, model) => ({
      model: model ?? "mistral-small-latest",
      messages: [{ role: "user", content: prompt }],
      stream: true,
    }),
    authHeader: (key) => ({ Authorization: `Bearer ${key}` }),
    stream: true,
  },
  deepseek: {
    envKey: "DEEPSEEK_API_KEY",
    type: "chat",
    url: "https://api.deepseek.com/chat/completions",
    buildBody: (prompt, model) => ({
      model: model ?? "deepseek-coder",
      messages: [{ role: "user", content: prompt }],
      stream: true,
    }),
    authHeader: (key) => ({ Authorization: `Bearer ${key}` }),
    stream: true,
  },
  stability: {
    envKey: "STABILITY_API_KEY",
    type: "image",
    url: "https://api.stability.ai/v2beta/stable-image/generate/sd3",
    buildBody: (prompt) => ({ prompt, output_format: "png" }),
    authHeader: (key) => ({ Authorization: `Bearer ${key}`, Accept: "image/*" }),
    stream: false,
  },
  deepai: {
    envKey: "DEEPAI_API_KEY",
    type: "image",
    url: "https://api.deepai.org/api/text2img",
    buildBody: (prompt) => ({ text: prompt }),
    authHeader: (key) => ({ "api-key": key }),
    stream: false,
  },
  runwayml: {
    envKey: "RUNWAYML_API_KEY",
    type: "video",
    url: "https://api.dev.runwayml.com/v1/image_to_video",
    buildBody: (prompt) => ({
      promptText: prompt,
      model: "gen3a_turbo",
      duration: 5,
    }),
    authHeader: (key) => ({
      Authorization: `Bearer ${key}`,
      "X-Runway-Version": "2024-11-06",
    }),
    stream: false,
  },
  kling: {
    envKey: "KLING_API_KEY",
    type: "video",
    url: "https://api.klingai.com/v1/videos/text2video",
    buildBody: (prompt) => ({
      prompt,
      duration: 5,
      aspect_ratio: "16:9",
    }),
    authHeader: (key) => ({ Authorization: `Bearer ${key}` }),
    stream: false,
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { prompt, provider, model } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "prompt string is required" }), {
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

    // --- Credit check ---
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Authorization required" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    // Try to get user - if it's just the anon key, we still need user auth
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    );
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: "User not authenticated" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = userData.user.id;
    const cost = CREDIT_COSTS[cfg.type] ?? 1;

    // Deduct credits atomically
    const { data: remaining, error: deductError } = await supabaseAdmin.rpc("deduct_credits", {
      p_user_id: userId,
      p_amount: cost,
    });

    if (deductError) {
      if (deductError.message?.includes("INSUFFICIENT_CREDITS")) {
        return new Response(JSON.stringify({ error: "Crédits insuffisants", code: "INSUFFICIENT_CREDITS", cost }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (deductError.message?.includes("NO_CREDITS_ROW")) {
        // Create row and retry
        await supabaseAdmin.from("user_credits").insert({ user_id: userId, credits: 0 });
        return new Response(JSON.stringify({ error: "Crédits insuffisants", code: "INSUFFICIENT_CREDITS", cost }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      console.error("Credit deduction error:", deductError);
      return new Response(JSON.stringify({ error: "Credit system error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    // --- End credit check ---

    const apiKey = Deno.env.get(cfg.envKey);
    if (!apiKey) {
      // Refund credits if API key missing
      await supabaseAdmin.rpc("add_credits", { p_user_id: userId, p_amount: cost });
      return new Response(
        JSON.stringify({ error: `${cfg.envKey} is not configured.` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Stability AI (binary image response)
    if (provider === "stability") {
      const formData = new FormData();
      formData.append("prompt", prompt);
      formData.append("output_format", "png");

      const response = await fetch(cfg.url, {
        method: "POST",
        headers: { ...cfg.authHeader(apiKey) },
        body: formData,
      });

      if (!response.ok) {
        await supabaseAdmin.rpc("add_credits", { p_user_id: userId, p_amount: cost });
        const errText = await response.text();
        console.error(`stability API error [${response.status}]:`, errText);
        return new Response(JSON.stringify({ error: `Stability API error: ${response.status}` }), {
          status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const arrayBuf = await response.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuf)));
      return new Response(JSON.stringify({ type: "image", data: `data:image/png;base64,${base64}`, remaining_credits: remaining }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // DeepAI image
    if (provider === "deepai") {
      const formData = new FormData();
      formData.append("text", prompt);

      const response = await fetch(cfg.url, {
        method: "POST",
        headers: { ...cfg.authHeader(apiKey) },
        body: formData,
      });

      if (!response.ok) {
        await supabaseAdmin.rpc("add_credits", { p_user_id: userId, p_amount: cost });
        const errText = await response.text();
        console.error(`deepai API error [${response.status}]:`, errText);
        return new Response(JSON.stringify({ error: `DeepAI API error: ${response.status}` }), {
          status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const data = await response.json();
      return new Response(JSON.stringify({ type: "image", url: data.output_url, remaining_credits: remaining }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // RunwayML video generation
    if (provider === "runwayml") {
      const response = await fetch(cfg.url, {
        method: "POST",
        headers: { ...cfg.authHeader(apiKey), "Content-Type": "application/json" },
        body: JSON.stringify(cfg.buildBody(prompt)),
      });

      if (!response.ok) {
        await supabaseAdmin.rpc("add_credits", { p_user_id: userId, p_amount: cost });
        const errText = await response.text();
        console.error(`runwayml API error [${response.status}]:`, errText);
        return new Response(JSON.stringify({ error: `RunwayML API error: ${response.status}` }), {
          status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const data = await response.json();
      return new Response(JSON.stringify({ type: "video", taskId: data.id, status: data.status, remaining_credits: remaining }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Kling AI video generation
    if (provider === "kling") {
      const response = await fetch(cfg.url, {
        method: "POST",
        headers: { ...cfg.authHeader(apiKey), "Content-Type": "application/json" },
        body: JSON.stringify(cfg.buildBody(prompt)),
      });

      if (!response.ok) {
        await supabaseAdmin.rpc("add_credits", { p_user_id: userId, p_amount: cost });
        const errText = await response.text();
        console.error(`kling API error [${response.status}]:`, errText);
        return new Response(JSON.stringify({ error: `Kling AI API error: ${response.status}` }), {
          status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const data = await response.json();
      return new Response(JSON.stringify({ type: "video", taskId: data.data?.task_id, status: data.data?.task_status, remaining_credits: remaining }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Chat/streaming providers
    const response = await fetch(cfg.url, {
      method: "POST",
      headers: { ...cfg.authHeader(apiKey), "Content-Type": "application/json" },
      body: JSON.stringify(cfg.buildBody(prompt, model)),
    });

    if (!response.ok) {
      await supabaseAdmin.rpc("add_credits", { p_user_id: userId, p_amount: cost });
      const errText = await response.text();
      console.error(`${provider} API error [${response.status}]:`, errText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: `${provider} API error: ${response.status}` }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (cfg.stream) {
      // Normalize Anthropic SSE
      if (provider === "anthropic") {
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
                if (json === "[DONE]") { controller.enqueue(encoder.encode("data: [DONE]\n\n")); controller.close(); return; }
                try {
                  const evt = JSON.parse(json);
                  if (evt.type === "content_block_delta" && evt.delta?.text) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: evt.delta.text } }] })}\n\n`));
                  }
                } catch { /* skip */ }
              }
            }
          },
        });
        return new Response(stream, { headers: { ...corsHeaders, "Content-Type": "text/event-stream" } });
      }

      return new Response(response.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    // Non-streaming fallback
    const data = await response.json();
    const text = data.output ?? data.result ?? data.text ?? JSON.stringify(data);
    return new Response(JSON.stringify({ type: "text", content: text, remaining_credits: remaining }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("execute function error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
