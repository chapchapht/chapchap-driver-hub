import { supabase } from "@/integrations/supabase/client";

export interface Driver {
  id: string;
  driver_id: string | null;
  full_name: string;
  whatsapp_number: string;
  home_address: string;
  primary_zone: string;
  other_zones: string | null;
  referrer_code: string | null;
  id_photo_url: string | null;
  plate_photo_url: string | null;
  selfie_photo_url: string | null;
  status: string;
  bonus_amount: number;
  created_at: string;
  updated_at: string;
}

interface ApiResponse<T = Driver | Driver[]> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export async function fetchDrivers(status?: string): Promise<Driver[]> {
  const params = new URLSearchParams();
  if (status) params.set('status', status);

  const { data, error } = await supabase.functions.invoke('admin-drivers', {
    method: 'GET',
    body: null,
  });

  // Workaround: invoke doesn't support query params well, so we'll use fetch directly
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-drivers?${params.toString()}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
  });

  const result: ApiResponse<Driver[]> = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch drivers');
  }

  return result.data || [];
}

export async function approveDriver(driverId: string): Promise<Driver> {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-drivers?action=approve`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
    body: JSON.stringify({ driverId }),
  });

  const result: ApiResponse<Driver> = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to approve driver');
  }

  return result.data!;
}

export async function rejectDriver(driverId: string): Promise<Driver> {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-drivers?action=reject`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
    body: JSON.stringify({ driverId }),
  });

  const result: ApiResponse<Driver> = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to reject driver');
  }

  return result.data!;
}

export async function updateDriverBalance(
  driverId: string,
  amount: number,
  reason?: string
): Promise<Driver> {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-drivers?action=update-balance`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
    body: JSON.stringify({ driverId, amount, reason }),
  });

  const result: ApiResponse<Driver> = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to update balance');
  }

  return result.data!;
}

export async function deleteDriver(driverId: string): Promise<void> {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-drivers?action=delete`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
    body: JSON.stringify({ driverId }),
  });

  const result: ApiResponse = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to delete driver');
  }
}
