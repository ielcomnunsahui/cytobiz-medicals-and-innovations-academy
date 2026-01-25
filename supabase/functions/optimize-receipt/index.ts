import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OptimizeRequest {
  receiptUrl: string;
  enrollmentId?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Verify user
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub;

    const { receiptUrl, enrollmentId }: OptimizeRequest = await req.json();

    if (!receiptUrl) {
      return new Response(JSON.stringify({ error: "Receipt URL is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const isPdf = receiptUrl.toLowerCase().endsWith(".pdf");
    let optimizedUrl = receiptUrl;
    let thumbnailUrl = null;

    if (isPdf) {
      // For PDFs, we'll create a placeholder thumbnail indicator
      // Full PDF thumbnail generation would require additional services
      thumbnailUrl = null; // PDFs will show file icon in UI
      console.log("PDF detected - thumbnail generation skipped (requires external service)");
    } else if (lovableApiKey) {
      // Use Lovable AI Gateway to optimize the image
      try {
        console.log("Optimizing image with AI gateway...");
        
        const response = await fetch(
          "https://ai.gateway.lovable.dev/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${lovableApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash-image",
              messages: [
                {
                  role: "user",
                  content: [
                    {
                      type: "text",
                      text: "Compress and optimize this receipt image for web viewing. Make it clearer and easier to read while reducing file size. Keep the aspect ratio.",
                    },
                    {
                      type: "image_url",
                      image_url: {
                        url: receiptUrl,
                      },
                    },
                  ],
                },
              ],
              modalities: ["image", "text"],
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const generatedImage = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

          if (generatedImage) {
            // Upload the optimized image to storage
            const base64Data = generatedImage.replace(/^data:image\/\w+;base64,/, "");
            const binaryData = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
            
            const optimizedFileName = `${userId}/optimized-${enrollmentId || Date.now()}-${Date.now()}.webp`;
            
            // Use service role for upload
            const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
            const adminClient = createClient(supabaseUrl, serviceRoleKey);
            
            const { error: uploadError } = await adminClient.storage
              .from("payment-receipts")
              .upload(optimizedFileName, binaryData, {
                contentType: "image/webp",
                upsert: true,
              });

            if (!uploadError) {
              const { data: urlData } = adminClient.storage
                .from("payment-receipts")
                .getPublicUrl(optimizedFileName);
              
              optimizedUrl = urlData.publicUrl;
              thumbnailUrl = optimizedUrl; // Use optimized as thumbnail for images
              
              console.log("Image optimized successfully:", optimizedUrl);
            } else {
              console.error("Upload error:", uploadError);
            }
          }
        } else {
          console.error("AI gateway error:", await response.text());
        }
      } catch (aiError) {
        console.error("AI optimization error:", aiError);
        // Fall back to original URL
      }
    }

    // Update enrollment with optimized URLs if we have an enrollmentId
    if (enrollmentId && (optimizedUrl !== receiptUrl || thumbnailUrl)) {
      // Note: We'd need to add optimized_receipt_url and thumbnail_url columns
      // For now, we just return the URLs to the client
      console.log("Optimization complete for enrollment:", enrollmentId);
    }

    return new Response(
      JSON.stringify({
        success: true,
        originalUrl: receiptUrl,
        optimizedUrl,
        thumbnailUrl,
        isPdf,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to optimize receipt";
    console.error("Error optimizing receipt:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
