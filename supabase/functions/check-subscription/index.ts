import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Map product_id to credits amount
const PRODUCT_CREDITS: Record<string, number> = {
  "prod_UCBT1h1vwyRMNg": 150, // Starter
  "prod_UCBUpVQjh4HJjX": 450, // Pro
  "prod_UHp5W4PRqoVVJN": 1000, // Expert
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } },
  );

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError) throw new Error(`Auth error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });

    if (customers.data.length === 0) {
      // Ensure credits row exists
      await supabaseAdmin.from("user_credits").upsert({ user_id: user.id, credits: 0 }, { onConflict: "user_id", ignoreDuplicates: true });
      
      // Get current credits
      const { data: creditsData } = await supabaseAdmin.from("user_credits").select("credits").eq("user_id", user.id).single();
      
      return new Response(JSON.stringify({ subscribed: false, credits: creditsData?.credits ?? 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const customerId = customers.data[0].id;
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    const hasActiveSub = subscriptions.data.length > 0;
    let productId = null;
    let subscriptionEnd = null;

    if (hasActiveSub) {
      const sub = subscriptions.data[0];
      subscriptionEnd = new Date(sub.current_period_end * 1000).toISOString();
      productId = sub.items.data[0].price.product as string;
      
      // Check if we need to refresh credits for new billing period
      const periodStart = new Date(sub.current_period_start * 1000).toISOString();
      const creditsAmount = PRODUCT_CREDITS[productId] ?? 0;
      
      if (creditsAmount > 0) {
        // Check last credit refresh
        const { data: creditsRow } = await supabaseAdmin
          .from("user_credits")
          .select("credits, updated_at")
          .eq("user_id", user.id)
          .single();
        
        if (!creditsRow) {
          // First time — give full credits
          await supabaseAdmin.from("user_credits").insert({ user_id: user.id, credits: creditsAmount });
        } else if (new Date(creditsRow.updated_at) < new Date(periodStart)) {
          // New billing period — reset credits
          await supabaseAdmin
            .from("user_credits")
            .update({ credits: creditsAmount, updated_at: new Date().toISOString() })
            .eq("user_id", user.id);
        }
      }
    }

    // Get current credits
    const { data: creditsData } = await supabaseAdmin.from("user_credits").select("credits").eq("user_id", user.id).single();

    return new Response(
      JSON.stringify({ 
        subscribed: hasActiveSub, 
        product_id: productId, 
        subscription_end: subscriptionEnd,
        credits: creditsData?.credits ?? 0,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
