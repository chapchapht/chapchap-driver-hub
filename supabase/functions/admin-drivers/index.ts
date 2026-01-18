import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Driver {
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

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const url = new URL(req.url);
    const action = url.searchParams.get('action');
    
    console.log(`Admin drivers request: ${req.method} action=${action}`);

    // GET - Fetch all drivers
    if (req.method === 'GET') {
      const status = url.searchParams.get('status');
      
      let query = supabase
        .from('drivers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching drivers:', error);
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      console.log(`Fetched ${data?.length || 0} drivers`);
      return new Response(
        JSON.stringify({ success: true, data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // POST actions - approve, reject, update-balance, delete
    if (req.method === 'POST') {
      const body = await req.json();
      const { driverId } = body;

      if (!driverId) {
        return new Response(
          JSON.stringify({ success: false, error: 'Driver ID is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // APPROVE DRIVER
      if (action === 'approve') {
        // Generate next driver ID using the function
        const { data: nextIdData, error: seqError } = await supabase
          .rpc('generate_driver_id');
        
        if (seqError) {
          console.error('Error generating driver ID:', seqError);
          return new Response(
            JSON.stringify({ success: false, error: 'Failed to generate driver ID' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { data, error } = await supabase
          .from('drivers')
          .update({
            status: 'Active',
            driver_id: nextIdData,
            bonus_amount: 500
          })
          .eq('id', driverId)
          .select()
          .single();

        if (error) {
          console.error('Error approving driver:', error);
          return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log(`Driver ${driverId} approved with ID ${nextIdData}`);
        return new Response(
          JSON.stringify({ success: true, data, message: `Driver approved with ID ${nextIdData}` }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // REJECT DRIVER
      if (action === 'reject') {
        const { data, error } = await supabase
          .from('drivers')
          .update({ status: 'Rejected' })
          .eq('id', driverId)
          .select()
          .single();

        if (error) {
          console.error('Error rejecting driver:', error);
          return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log(`Driver ${driverId} rejected`);
        return new Response(
          JSON.stringify({ success: true, data, message: 'Driver rejected' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // UPDATE BALANCE
      if (action === 'update-balance') {
        const { amount, reason } = body;
        
        if (typeof amount !== 'number') {
          return new Response(
            JSON.stringify({ success: false, error: 'Amount must be a number' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // First get current balance
        const { data: driver, error: fetchError } = await supabase
          .from('drivers')
          .select('bonus_amount')
          .eq('id', driverId)
          .single();

        if (fetchError) {
          console.error('Error fetching driver:', fetchError);
          return new Response(
            JSON.stringify({ success: false, error: 'Driver not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const newBalance = driver.bonus_amount + amount;

        const { data, error } = await supabase
          .from('drivers')
          .update({ bonus_amount: newBalance })
          .eq('id', driverId)
          .select()
          .single();

        if (error) {
          console.error('Error updating balance:', error);
          return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log(`Driver ${driverId} balance updated: ${driver.bonus_amount} -> ${newBalance} (${reason || 'no reason'})`);
        return new Response(
          JSON.stringify({ success: true, data, message: `Balance updated to ${newBalance} GHT` }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // DELETE DRIVER
      if (action === 'delete') {
        const { error } = await supabase
          .from('drivers')
          .delete()
          .eq('id', driverId);

        if (error) {
          console.error('Error deleting driver:', error);
          return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log(`Driver ${driverId} deleted`);
        return new Response(
          JSON.stringify({ success: true, message: 'Driver deleted' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: false, error: 'Invalid action' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
