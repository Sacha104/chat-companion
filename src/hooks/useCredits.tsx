import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useCredits() {
  const { user } = useAuth();
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCredits = useCallback(async () => {
    if (!user) { setCredits(null); setLoading(false); return; }
    const { data, error } = await supabase
      .from("user_credits")
      .select("credits")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching credits:", error);
      setCredits(0);
    } else if (!data) {
      // No row yet — insert one
      await supabase.from("user_credits").insert({ user_id: user.id, credits: 0 });
      setCredits(0);
    } else {
      setCredits(data.credits);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  return { credits, loading, refetch: fetchCredits };
}
