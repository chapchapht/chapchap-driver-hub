import { supabase } from "@/integrations/supabase/client";

interface DriverRegistrationPayload {
  fullName: string;
  whatsappNumber: string;
  homeAddress: string;
  primaryZone: string;
  otherZones?: string;
  referrerCode?: string;
  idPhotoUrl: string;
  platePhotoUrl: string;
  selfiePhotoUrl: string;
}

interface RegistrationResponse {
  success: boolean;
  message?: string;
  driverId?: string;
  error?: string;
  details?: string | string[];
}

export async function uploadDriverDocument(file: File, folder: string): Promise<string> {
  const timestamp = Date.now();
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filePath = `${folder}/${timestamp}-${cleanFileName}`;

  const { data, error } = await supabase.storage
    .from('driver-documents')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Upload error:', error);
    throw new Error(`Failed to upload ${folder}: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('driver-documents')
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

export async function registerDriver(payload: DriverRegistrationPayload): Promise<RegistrationResponse> {
  const { data, error } = await supabase.functions.invoke('register-driver', {
    body: payload,
  });

  if (error) {
    console.error('Edge function error:', error);
    throw new Error(error.message || 'Failed to register driver');
  }

  return data as RegistrationResponse;
}
