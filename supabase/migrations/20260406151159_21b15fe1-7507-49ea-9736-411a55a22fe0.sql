
-- Remove the dangerous INSERT policy that lets users set arbitrary credits
DROP POLICY IF EXISTS "Users can insert own credits" ON public.user_credits;

-- Also remove the UPDATE policy (credits should only be managed server-side)
DROP POLICY IF EXISTS "Users can update own credits" ON public.user_credits;
