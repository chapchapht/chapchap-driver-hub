-- Create drivers table for registration data
CREATE TABLE public.drivers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  home_address TEXT NOT NULL,
  primary_zone TEXT NOT NULL,
  other_zones TEXT,
  referrer_code TEXT,
  id_photo_url TEXT,
  plate_photo_url TEXT,
  selfie_photo_url TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  bonus_amount INTEGER NOT NULL DEFAULT 500,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS (admin-only access pattern - submissions via edge function)
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;

-- No public read/write - only edge functions with service role can access
-- This protects driver PII (phone, address, photos)

-- Create storage bucket for driver documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('driver-documents', 'driver-documents', true);

-- Storage policies for driver document uploads
CREATE POLICY "Anyone can upload driver documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'driver-documents');

CREATE POLICY "Anyone can view driver documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'driver-documents');

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_drivers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_drivers_updated_at
BEFORE UPDATE ON public.drivers
FOR EACH ROW
EXECUTE FUNCTION public.update_drivers_updated_at();