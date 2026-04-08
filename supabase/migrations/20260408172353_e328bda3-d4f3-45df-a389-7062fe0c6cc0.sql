DROP POLICY IF EXISTS "Users can insert own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can view own messages" ON public.messages;

CREATE POLICY "Users can insert own messages"
ON public.messages
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND role = ANY (ARRAY['user'::text, 'assistant'::text])
  AND EXISTS (
    SELECT 1
    FROM public.conversations c
    WHERE c.id = conversation_id
      AND c.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update own messages"
ON public.messages
FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1
    FROM public.conversations c
    WHERE c.id = conversation_id
      AND c.user_id = auth.uid()
  )
)
WITH CHECK (
  auth.uid() = user_id
  AND role = ANY (ARRAY['user'::text, 'assistant'::text])
  AND EXISTS (
    SELECT 1
    FROM public.conversations c
    WHERE c.id = conversation_id
      AND c.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own messages"
ON public.messages
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1
    FROM public.conversations c
    WHERE c.id = conversation_id
      AND c.user_id = auth.uid()
  )
);