-- Add driver_id column for unique driver codes (CC-001, CC-002, etc.)
ALTER TABLE public.drivers ADD COLUMN driver_id TEXT UNIQUE;

-- Create a sequence for auto-generating driver IDs
CREATE SEQUENCE IF NOT EXISTS public.driver_id_seq START 1;

-- Create a function to generate the next driver ID
CREATE OR REPLACE FUNCTION public.generate_driver_id()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_val INTEGER;
BEGIN
  next_val := nextval('driver_id_seq');
  RETURN 'CC-' || LPAD(next_val::TEXT, 3, '0');
END;
$$;