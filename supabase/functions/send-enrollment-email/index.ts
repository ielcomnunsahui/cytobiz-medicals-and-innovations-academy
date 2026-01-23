import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

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

  const buttonStyle = `
    display: inline-block;
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    color: white;
    padding: 14px 28px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    margin-top: 20px;
  `;

  switch (req.type) {
    case "submitted":
      return {
        subject: `Application Received - ${req.courseName}`,
        html: `
          <div style="${baseStyles} max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #1e1b4b; font-size: 28px; margin: 0;">Application Received! 🎉</h1>
            </div>
            
            <p style="color: #374151; font-size: 16px;">Dear ${req.userName},</p>
            
            <p style="color: #374151; font-size: 16px;">
              Thank you for applying to <strong>${req.courseName}</strong>${req.cohortName ? ` (${req.cohortName})` : ""}.
              We have received your application and our team will review it shortly.
            </p>
            
            <div style="background: linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%); border-radius: 12px; padding: 24px; margin: 24px 0;">
              <h3 style="color: #1e1b4b; margin: 0 0 12px 0;">What happens next?</h3>
              <ul style="color: #4b5563; margin: 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">Our team will review your application</li>
                <li style="margin-bottom: 8px;">If payment is required, please ensure you've completed the payment</li>
                <li style="margin-bottom: 8px;">You'll receive an email once your enrollment is confirmed</li>
              </ul>
            </div>
            
            <p style="color: #374151; font-size: 16px;">
              If you have any questions, don't hesitate to reach out to us.
            </p>
            
            <p style="color: #374151; font-size: 16px;">
              Best regards,<br>
              <strong>The Cytobiz Academy Team</strong>
            </p>
          </div>
        `,
      };

    case "approved":
      return {
        subject: `🎊 Congratulations! You're In - ${req.courseName}`,
        html: `
          <div style="${baseStyles} max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #1e1b4b; font-size: 28px; margin: 0;">Welcome to ${req.courseName}! 🚀</h1>
            </div>
            
            <p style="color: #374151; font-size: 16px;">Dear ${req.userName},</p>
            
            <p style="color: #374151; font-size: 16px;">
              <strong>Great news!</strong> Your enrollment for <strong>${req.courseName}</strong>${req.cohortName ? ` (${req.cohortName})` : ""} has been approved!
            </p>
            
            <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
              <p style="color: #065f46; font-size: 18px; font-weight: 600; margin: 0;">
                ✅ Your enrollment is confirmed!
              </p>
            </div>
            
            <p style="color: #374151; font-size: 16px;">
              You now have full access to the course materials. Log in to your dashboard to start learning!
            </p>
            
            <div style="text-align: center;">
              <a href="https://cytobiz.com/learn" style="${buttonStyle}">
                Start Learning →
              </a>
            </div>
            
            <p style="color: #374151; font-size: 16px; margin-top: 32px;">
              We're excited to have you on this learning journey!
            </p>
            
            <p style="color: #374151; font-size: 16px;">
              Best regards,<br>
              <strong>The Cytobiz Academy Team</strong>
            </p>
          </div>
        `,
      };

    case "rejected":
      return {
        subject: `Application Update - ${req.courseName}`,
        html: `
          <div style="${baseStyles} max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #1e1b4b; font-size: 28px; margin: 0;">Application Update</h1>
            </div>
            
            <p style="color: #374151; font-size: 16px;">Dear ${req.userName},</p>
            
            <p style="color: #374151; font-size: 16px;">
              Thank you for your interest in <strong>${req.courseName}</strong>${req.cohortName ? ` (${req.cohortName})` : ""}.
            </p>
            
            <p style="color: #374151; font-size: 16px;">
              After reviewing your application, we regret to inform you that we are unable to proceed with your enrollment at this time.
            </p>
            
            ${req.rejectionReason ? `
              <div style="background: #fef2f2; border-left: 4px solid #ef4444; border-radius: 8px; padding: 16px; margin: 24px 0;">
                <p style="color: #991b1b; margin: 0; font-weight: 500;">Reason:</p>
                <p style="color: #7f1d1d; margin: 8px 0 0 0;">${req.rejectionReason}</p>
              </div>
            ` : ""}
            
            <p style="color: #374151; font-size: 16px;">
              If you believe this was in error or have any questions, please contact our support team.
              We encourage you to explore our other courses that might be a better fit.
            </p>
            
            <div style="text-align: center;">
              <a href="https://cytobiz.com/courses" style="${buttonStyle}">
                Browse Other Courses
              </a>
            </div>
            
            <p style="color: #374151; font-size: 16px; margin-top: 32px;">
              Best regards,<br>
              <strong>The Cytobiz Academy Team</strong>
            </p>
          </div>
        `,
      };
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const emailRequest: EnrollmentEmailRequest = await req.json();
    const { subject, html } = getEmailContent(emailRequest);

    // Use Resend API directly via fetch
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Cytobiz Academy <onboarding@resend.dev>",
        to: [emailRequest.userEmail],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
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
