-- Fix function search_path warning
CREATE OR REPLACE FUNCTION public.update_drivers_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- The drivers table intentionally has no SELECT/UPDATE/DELETE policies
-- because it contains PII and should only be accessed via edge function with service role
-- This is a deliberate security pattern for admin-only data