import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { name, email, company, message }: ContactFormData = await req.json();

    // Input validation and sanitization
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid email address" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const brevoApiKey = Deno.env.get("BREVO_API_KEY");
    const ownerEmail = Deno.env.get("OWNER_EMAIL") || "hello@buildwithaldren.com";

    if (!brevoApiKey) {
      throw new Error("Brevo API key not configured");
    }

    // Sanitize inputs for HTML
    const sanitize = (str: string) => str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    const sanitizedName = sanitize(name);
    const sanitizedEmail = sanitize(email);
    const sanitizedCompany = company ? sanitize(company) : '';
    const sanitizedMessage = sanitize(message);

    // Send notification email to site owner
    const notificationEmail = {
      sender: { email: "hello@buildwithaldren.com", name: "Portfolio Contact Form" },      
      // sender: { email: "noreply@buildwithaldren.com", name: "Portfolio Contact Form" },
      to: [{ email: ownerEmail, name: "Aldren" }],
      subject: `New Contact Form Submission from ${sanitizedName}`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; border-radius: 8px;">
          <h2 style="color: #1e293b; margin-bottom: 20px;">New Contact Form Submission</h2>
          <div style="background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <div style="margin-bottom: 15px;">
              <strong style="color: #475569;">Name:</strong>
              <p style="margin: 5px 0; color: #1e293b;">${sanitizedName}</p>
            </div>
            <div style="margin-bottom: 15px;">
              <strong style="color: #475569;">Email:</strong>
              <p style="margin: 5px 0; color: #1e293b;">${sanitizedEmail}</p>
            </div>
            ${sanitizedCompany ? `
            <div style="margin-bottom: 15px;">
              <strong style="color: #475569;">Company:</strong>
              <p style="margin: 5px 0; color: #1e293b;">${sanitizedCompany}</p>
            </div>
            ` : ''}
            <div style="margin-bottom: 15px;">
              <strong style="color: #475569;">Message:</strong>
              <p style="margin: 5px 0; color: #1e293b; white-space: pre-wrap;">${sanitizedMessage}</p>
            </div>
          </div>
          <p style="color: #64748b; font-size: 12px; margin-top: 20px; text-align: center;">This is an automated message from your portfolio contact form.</p>
        </div>
      `,
    };

    // Send acknowledgment email to user
    const acknowledgmentEmail = {
      sender: { email: ownerEmail, name: "Aldren" },
      to: [{ email: email, name: name }],
      subject: "Thank you for reaching out!",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; border-radius: 8px;">
          <h2 style="color: #1e293b; margin-bottom: 20px;">Thanks for getting in touch, ${sanitizedName}!</h2>
          <div style="background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <p style="color: #475569; line-height: 1.6; margin-bottom: 15px;">
              I've received your message and appreciate you taking the time to reach out.
            </p>
            <p style="color: #475569; line-height: 1.6; margin-bottom: 15px;">
              I typically respond within 24 hours during business days. I'll review your message and get back to you as soon as possible.
            </p>
            <div style="background-color: #f1f5f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="color: #64748b; font-size: 14px; margin: 0;"><strong>Your message:</strong></p>
              <p style="color: #475569; margin: 10px 0 0 0; white-space: pre-wrap;">${sanitizedMessage}</p>
            </div>
            <p style="color: #475569; line-height: 1.6;">
              If your inquiry is urgent, feel free to reach out directly at ${ownerEmail}.
            </p>
          </div>
          <div style="margin-top: 20px; padding: 15px; background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%); border-radius: 8px;">
            <p style="color: white; margin: 0; text-align: center; font-weight: 600;">Looking forward to working with you!</p>
          </div>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 20px; text-align: center;">
            Aldren | Full Stack Developer<br/>
            ${ownerEmail}
          </p>
        </div>
      `,
    };

    // Send both emails via Brevo API
    const brevoEndpoint = "https://api.brevo.com/v3/smtp/email";
    const headers = {
      "accept": "application/json",
      "api-key": brevoApiKey,
      "content-type": "application/json",
    };

    // Send notification email
    const notificationResponse = await fetch(brevoEndpoint, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(notificationEmail),
    });

    if (!notificationResponse.ok) {
      const errorText = await notificationResponse.text();
      console.error("Brevo notification email error:", errorText);
      throw new Error(`Failed to send notification email: ${notificationResponse.status}`);
    }

    // Send acknowledgment email
    const acknowledgmentResponse = await fetch(brevoEndpoint, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(acknowledgmentEmail),
    });

    if (!acknowledgmentResponse.ok) {
      const errorText = await acknowledgmentResponse.text();
      console.error("Brevo acknowledgment email error:", errorText);
      throw new Error(`Failed to send acknowledgment email: ${acknowledgmentResponse.status}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Emails sent successfully" }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
