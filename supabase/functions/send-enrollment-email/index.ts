import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
// Custom domain sender - update this when you verify your domain in Resend
// Default: onboarding@resend.dev (for testing)
// After verification: noreply@yourdomain.com
const FROM_EMAIL = Deno.env.get("RESEND_FROM_EMAIL") || "Cytobiz Academy <onboarding@resend.dev>";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EnrollmentEmailRequest {
  type: "submitted" | "approved" | "rejected";
  enrollmentId: string;
  userEmail: string;
  userName: string;
  courseName: string;
  cohortName?: string;
  rejectionReason?: string;
}

const getEmailContent = (req: EnrollmentEmailRequest) => {
  const baseStyles = `
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
  `;

  const containerStyle = `
    max-width: 600px;
    margin: 0 auto;
    padding: 40px 20px;
    background: #ffffff;
  `;

  const headerStyle = `
    background: linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%);
    padding: 40px 20px;
    border-radius: 16px 16px 0 0;
    text-align: center;
  `;

  const buttonStyle = `
    display: inline-block;
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    color: white;
    padding: 14px 32px;
    border-radius: 10px;
    text-decoration: none;
    font-weight: 600;
    font-size: 16px;
    box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
  `;

  const cardStyle = `
    background: #f8fafc;
    border-radius: 12px;
    padding: 24px;
    margin: 24px 0;
    border: 1px solid #e2e8f0;
  `;

  switch (req.type) {
    case "submitted":
      return {
        subject: `✨ Application Received - ${req.courseName}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="${baseStyles} margin: 0; padding: 0; background: #f1f5f9;">
            <div style="${containerStyle}">
              <div style="${headerStyle}">
                <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-weight: 700;">
                  🎉 Application Received!
                </h1>
                <p style="color: rgba(255,255,255,0.8); margin: 12px 0 0 0; font-size: 16px;">
                  We're excited to review your application
                </p>
              </div>
              
              <div style="background: #ffffff; padding: 32px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <p style="color: #374151; font-size: 16px; margin-top: 0;">Dear <strong>${req.userName}</strong>,</p>
                
                <p style="color: #374151; font-size: 16px;">
                  Thank you for applying to <strong style="color: #4f46e5;">${req.courseName}</strong>${req.cohortName ? ` (${req.cohortName})` : ""}.
                  We have received your application and our team will review it shortly.
                </p>
                
                <div style="${cardStyle}">
                  <h3 style="color: #1e1b4b; margin: 0 0 16px 0; font-size: 18px;">📋 What happens next?</h3>
                  <div style="color: #4b5563;">
                    <div style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                      <span style="color: #10b981; margin-right: 12px; font-size: 18px;">✓</span>
                      <span>Our team will review your application within 24-48 hours</span>
                    </div>
                    <div style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                      <span style="color: #10b981; margin-right: 12px; font-size: 18px;">✓</span>
                      <span>If payment is required, please ensure you've completed the payment</span>
                    </div>
                    <div style="display: flex; align-items: flex-start;">
                      <span style="color: #10b981; margin-right: 12px; font-size: 18px;">✓</span>
                      <span>You'll receive an email once your enrollment is confirmed</span>
                    </div>
                  </div>
                </div>
                
                <p style="color: #374151; font-size: 16px;">
                  If you have any questions, don't hesitate to reach out to our support team.
                </p>
                
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
                
                <p style="color: #374151; font-size: 16px; margin-bottom: 0;">
                  Best regards,<br>
                  <strong style="color: #1e1b4b;">The Cytobiz Academy Team</strong>
                </p>
              </div>
              
              <div style="text-align: center; padding: 24px; color: #9ca3af; font-size: 14px;">
                <p style="margin: 0;">© 2024 Cytobiz Medical & Innovation Academy</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

    case "approved":
      return {
        subject: `🎊 Congratulations! You're In - ${req.courseName}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="${baseStyles} margin: 0; padding: 0; background: #f1f5f9;">
            <div style="${containerStyle}">
              <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 40px 20px; border-radius: 16px 16px 0 0; text-align: center;">
                <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-weight: 700;">
                  🚀 Welcome Aboard!
                </h1>
                <p style="color: rgba(255,255,255,0.9); margin: 12px 0 0 0; font-size: 16px;">
                  Your enrollment has been approved
                </p>
              </div>
              
              <div style="background: #ffffff; padding: 32px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <p style="color: #374151; font-size: 16px; margin-top: 0;">Dear <strong>${req.userName}</strong>,</p>
                
                <p style="color: #374151; font-size: 16px;">
                  <strong>Great news!</strong> Your enrollment for <strong style="color: #059669;">${req.courseName}</strong>${req.cohortName ? ` (${req.cohortName})` : ""} has been approved!
                </p>
                
                <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center; border: 2px solid #10b981;">
                  <p style="color: #065f46; font-size: 20px; font-weight: 700; margin: 0;">
                    ✅ Your enrollment is confirmed!
                  </p>
                </div>
                
                <p style="color: #374151; font-size: 16px;">
                  You now have full access to the course materials. Log in to your dashboard to start your learning journey!
                </p>
                
                <div style="text-align: center; margin: 32px 0;">
                  <a href="https://cytobiz.com/dashboard" style="${buttonStyle}">
                    Start Learning →
                  </a>
                </div>
                
                <p style="color: #374151; font-size: 16px;">
                  We're thrilled to have you on this learning journey. Get ready to gain practical skills and advance your healthcare career!
                </p>
                
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
                
                <p style="color: #374151; font-size: 16px; margin-bottom: 0;">
                  Best regards,<br>
                  <strong style="color: #1e1b4b;">The Cytobiz Academy Team</strong>
                </p>
              </div>
              
              <div style="text-align: center; padding: 24px; color: #9ca3af; font-size: 14px;">
                <p style="margin: 0;">© 2024 Cytobiz Medical & Innovation Academy</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

    case "rejected":
      return {
        subject: `Application Update - ${req.courseName}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="${baseStyles} margin: 0; padding: 0; background: #f1f5f9;">
            <div style="${containerStyle}">
              <div style="background: linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%); padding: 40px 20px; border-radius: 16px 16px 0 0; text-align: center;">
                <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-weight: 700;">
                  Application Update
                </h1>
              </div>
              
              <div style="background: #ffffff; padding: 32px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <p style="color: #374151; font-size: 16px; margin-top: 0;">Dear <strong>${req.userName}</strong>,</p>
                
                <p style="color: #374151; font-size: 16px;">
                  Thank you for your interest in <strong>${req.courseName}</strong>${req.cohortName ? ` (${req.cohortName})` : ""}.
                </p>
                
                <p style="color: #374151; font-size: 16px;">
                  After reviewing your application, we regret to inform you that we are unable to proceed with your enrollment at this time.
                </p>
                
                ${req.rejectionReason ? `
                  <div style="background: #fef2f2; border-left: 4px solid #ef4444; border-radius: 0 8px 8px 0; padding: 20px; margin: 24px 0;">
                    <p style="color: #991b1b; margin: 0; font-weight: 600; font-size: 14px;">Reason:</p>
                    <p style="color: #7f1d1d; margin: 8px 0 0 0; font-size: 15px;">${req.rejectionReason}</p>
                  </div>
                ` : ""}
                
                <p style="color: #374151; font-size: 16px;">
                  If you believe this was in error or have any questions, please contact our support team.
                  We encourage you to explore our other courses that might be a better fit.
                </p>
                
                <div style="text-align: center; margin: 32px 0;">
                  <a href="https://cytobiz.com/courses" style="${buttonStyle}">
                    Browse Other Courses
                  </a>
                </div>
                
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
                
                <p style="color: #374151; font-size: 16px; margin-bottom: 0;">
                  Best regards,<br>
                  <strong style="color: #1e1b4b;">The Cytobiz Academy Team</strong>
                </p>
              </div>
              
              <div style="text-align: center; padding: 24px; color: #9ca3af; font-size: 14px;">
                <p style="margin: 0;">© 2024 Cytobiz Medical & Innovation Academy</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const emailRequest: EnrollmentEmailRequest = await req.json();
    const { subject, html } = getEmailContent(emailRequest);

    console.log(`Sending ${emailRequest.type} email to ${emailRequest.userEmail} from ${FROM_EMAIL}`);

    // Use Resend API directly via fetch
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [emailRequest.userEmail],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Resend API error:", error);
      throw new Error(`Resend API error: ${error}`);
    }

    const emailResponse = await res.json();
    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending enrollment email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
