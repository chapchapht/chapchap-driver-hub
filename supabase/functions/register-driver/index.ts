import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Haiti phone validation regex: +509 followed by 8 digits
const HAITI_PHONE_REGEX = /^\+509\d{8}$/;

interface DriverRegistrationData {
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

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const data: DriverRegistrationData = await req.json();
    
    console.log("Received driver registration:", {
      fullName: data.fullName,
      whatsappNumber: data.whatsappNumber,
      primaryZone: data.primaryZone,
    });

    // Validation
    const errors: string[] = [];

    if (!data.fullName || data.fullName.trim().length < 2) {
      errors.push("Non konplè obligatwa (minmòm 2 karaktè)");
    }

    if (!data.whatsappNumber || !HAITI_PHONE_REGEX.test(data.whatsappNumber)) {
      errors.push("Nimewo WhatsApp dwe kòmanse ak +509 epi gen 8 chif aprè");
    }

    if (!data.homeAddress || data.homeAddress.trim().length < 5) {
      errors.push("Adrès kay obligatwa (minmòm 5 karaktè)");
    }

    if (!data.primaryZone) {
      errors.push("Zòn prensipal obligatwa");
    }

    if (!data.idPhotoUrl) {
      errors.push("Foto CIN/NIF obligatwa");
    }

    if (!data.platePhotoUrl) {
      errors.push("Foto plak obligatwa");
    }

    if (!data.selfiePhotoUrl) {
      errors.push("Selfie ak CIN obligatwa");
    }

    if (errors.length > 0) {
      console.log("Validation errors:", errors);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Validation failed", 
          details: errors 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with service role for admin access
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert driver record
    const { data: driver, error: insertError } = await supabase
      .from("drivers")
      .insert({
        full_name: data.fullName.trim(),
        whatsapp_number: data.whatsappNumber,
        home_address: data.homeAddress.trim(),
        primary_zone: data.primaryZone,
        other_zones: data.otherZones?.trim() || null,
        referrer_code: data.referrerCode?.trim() || null,
        id_photo_url: data.idPhotoUrl,
        plate_photo_url: data.platePhotoUrl,
        selfie_photo_url: data.selfiePhotoUrl,
        status: "Pending",
        bonus_amount: 500,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Database insert error:", insertError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Database error", 
          details: insertError.message 
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Driver registered successfully:", driver.id);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Enskripsyon fini. 500 GHT ap tann ou apre verifikasyon.",
        driverId: driver.id,
        status: "Pending",
        bonus: "500 GHT",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error processing request:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Internal server error",
        details: errorMessage 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
